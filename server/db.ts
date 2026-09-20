import pg from 'pg';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const { Pool, Client } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  host: process.env.PGHOST || 'localhost',
  port: parseInt(process.env.PGPORT || '5432', 10),
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'postgres',
  database: process.env.PGDATABASE || 'webportofolio',
};

export const pool = new Pool(dbConfig);

// Handle idle client connection drops gracefully
pool.on('error', (err) => {
  console.error('[PostgreSQL] Unexpected client error on idle client:', err.message || err);
});

let isInitialized = false;
let initPromise: Promise<void> | null = null;

export async function ensureInitialized() {
  if (isInitialized) return;
  if (!initPromise) {
    initPromise = initDatabase()
      .then(() => {
        isInitialized = true;
      })
      .catch((err) => {
        initPromise = null;
        throw err;
      });
  }
  return initPromise;
}

export async function initDatabase() {
  // Test connection or attempt to create target database if missing
  try {
    const probeClient = await pool.connect();
    probeClient.release();
  } catch (err: any) {
    if (err.code === '3D000') {
      // Database does not exist, try creating it via default maintenance db 'postgres'
      const targetDb = (dbConfig.database || 'webportofolio').replace(/[^a-zA-Z0-9_]/g, '');
      console.log(`[PostgreSQL] Database "${targetDb}" does not exist. Attempting creation via maintenance database...`);
      try {
        const adminClient = new Client({
          ...dbConfig,
          database: 'postgres',
        });
        await adminClient.connect();
        await adminClient.query(`CREATE DATABASE "${targetDb}"`);
        await adminClient.end();
        console.log(`[PostgreSQL] Database "${targetDb}" created successfully.`);
      } catch (adminErr: any) {
        console.warn(`[PostgreSQL] Notice: Could not auto-create database "${targetDb}": ${adminErr.message || adminErr}`);
      }
    } else {
      const errDetail = err.code ? `${err.code} (${err.message || 'Connection refused'})` : err.message;
      console.warn(`[PostgreSQL] Notice: Could not connect to PostgreSQL (${dbConfig.host}:${dbConfig.port}/${dbConfig.database}). Detail: ${errDetail}`);
      console.warn('[PostgreSQL] Server is active and will initialize schema automatically as soon as PostgreSQL is available.');
      return;
    }
  }

  try {
    // 1. Create tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS photos (
        id VARCHAR(255) PRIMARY KEY,
        image_url TEXT NOT NULL,
        drive_file_id VARCHAR(255),
        title TEXT,
        subtitle TEXT,
        location TEXT,
        year VARCHAR(50),
        camera VARCHAR(255),
        lens VARCHAR(255),
        aperture VARCHAR(50),
        shutter_speed VARCHAR(50),
        iso VARCHAR(50),
        focal_length VARCHAR(50),
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS stories (
        id VARCHAR(255) PRIMARY KEY,
        title TEXT NOT NULL,
        tag VARCHAR(100) NOT NULL,
        date VARCHAR(100) NOT NULL,
        read_time VARCHAR(50) NOT NULL,
        cover_image TEXT NOT NULL,
        drive_file_id VARCHAR(255),
        excerpt TEXT NOT NULL,
        content_json TEXT NOT NULL,
        quote TEXT,
        location TEXT,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS settings (
        key VARCHAR(255) PRIMARY KEY,
        value TEXT NOT NULL
      );
    `);

    // 2. Check if settings is empty, seed or migrate from SQLite
    const settingsCheck = await pool.query('SELECT COUNT(*) as count FROM settings');
    const count = parseInt(settingsCheck.rows[0]?.count || '0', 10);

    if (count === 0) {
      let migratedFromSqlite = false;
      const sqliteFile = path.join(__dirname, 'data', 'portfolio.db');

      if (fs.existsSync(sqliteFile)) {
        try {
          const { default: Database } = await import('better-sqlite3');
          const sqlite = new Database(sqliteFile, { readonly: true });

          // Migrate settings
          const sqliteSettings = sqlite.prepare('SELECT key, value FROM settings').all() as { key: string; value: string }[];
          for (const s of sqliteSettings) {
            await pool.query('INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING', [s.key, s.value]);
          }

          // Migrate photos
          const sqlitePhotos = sqlite.prepare('SELECT * FROM photos').all() as any[];
          for (const p of sqlitePhotos) {
            await pool.query(`
              INSERT INTO photos (
                id, image_url, drive_file_id, title, subtitle, location, year, camera, lens, aperture, shutter_speed, iso, focal_length, sort_order
              ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
              ON CONFLICT (id) DO NOTHING
            `, [
              p.id, p.image_url, p.drive_file_id, p.title, p.subtitle, p.location, p.year,
              p.camera, p.lens, p.aperture, p.shutter_speed, p.iso, p.focal_length, p.sort_order || 0,
            ]);
          }

          // Migrate stories
          const sqliteStories = sqlite.prepare('SELECT * FROM stories').all() as any[];
          for (const st of sqliteStories) {
            await pool.query(`
              INSERT INTO stories (
                id, title, tag, date, read_time, cover_image, drive_file_id, excerpt, content_json, quote, location, sort_order
              ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
              ON CONFLICT (id) DO NOTHING
            `, [
              st.id, st.title, st.tag, st.date, st.read_time, st.cover_image, st.drive_file_id,
              st.excerpt, st.content_json, st.quote, st.location, st.sort_order || 0,
            ]);
          }

          sqlite.close();
          migratedFromSqlite = true;
          console.log(`[PostgreSQL] Successfully migrated ${sqliteSettings.length} settings, ${sqlitePhotos.length} photos, and ${sqliteStories.length} stories from SQLite!`);
        } catch (migErr: any) {
          console.warn('[PostgreSQL] SQLite auto-migration skipped:', migErr.message);
        }
      }

      if (!migratedFromSqlite) {
        // Fallback default settings
        const defaultSettings: Record<string, string> = {
          fullName: 'Ahad Qeis Ismail',
          brandName: 'AHAD QEIS',
          tagline: 'CAPTURING REAL MOMENTS',
          eyebrow: "HEY, I'M AHAD QEIS",
          bio: "Photography found me years ago and it changed the way I see the world. It's more than taking pictures — it's about preserving memories, telling stories and connecting with people.",
          email: 'ahmad.qeis122@gmail.com',
          phone: '081934193454',
          instagram: '@amdqeis__',
          instagramUrl: 'https://instagram.com/amdqeis__',
          location: 'Indonesia',
        };

        for (const [k, v] of Object.entries(defaultSettings)) {
          await pool.query('INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING', [k, v]);
        }
        console.log('[PostgreSQL] Default portfolio settings seeded.');
      }
    }

    isInitialized = true;
    console.log('[PostgreSQL] Database tables and schema verified successfully.');
  } catch (err: any) {
    console.error('[PostgreSQL] Error during schema initialization:', err.message);
  }
}
