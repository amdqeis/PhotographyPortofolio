import 'dotenv/config';
import pg from 'pg';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const { Pool, Client } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isRemote = (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost') && !process.env.DATABASE_URL.includes('127.0.0.1'))
  || (process.env.PGHOST && process.env.PGHOST !== 'localhost' && process.env.PGHOST !== '127.0.0.1');

const sslConfig = process.env.PGSSL === 'true' || isRemote
  ? { rejectUnauthorized: false }
  : (process.env.PGSSL === 'false' ? false : undefined);

const dbConfig: any = {
  ...(process.env.DATABASE_URL ? { connectionString: process.env.DATABASE_URL } : {}),
  host: process.env.PGHOST || 'localhost',
  port: parseInt(process.env.PGPORT || '5432', 10),
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'postgres',
  database: process.env.PGDATABASE || 'webportofolio',
  ...(sslConfig ? { ssl: sslConfig } : {}),
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
        let adminConfig: any;
        if (process.env.DATABASE_URL) {
          try {
            const parsed = new URL(process.env.DATABASE_URL);
            parsed.pathname = '/postgres';
            adminConfig = {
              connectionString: parsed.toString(),
              ...(sslConfig ? { ssl: sslConfig } : {}),
            };
          } catch {
            adminConfig = { ...dbConfig, database: 'postgres' };
            delete adminConfig.connectionString;
          }
        } else {
          adminConfig = { ...dbConfig, database: 'postgres' };
          delete adminConfig.connectionString;
        }
        const adminClient = new Client(adminConfig);
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
        // Default portfolio settings (seeded with ON CONFLICT DO NOTHING to never overwrite user data)
        const defaultSettings: Record<string, string> = {
          fullName: 'Ahmad Qeis Ismail',
          brandName: 'amdkey',
          tagline: 'CAPTURING REAL MOMENTS',
          eyebrow: "HEY, I'M AHMAD QEIS",
          bio: "Photography found me years ago and it changed the way I see the world. It's more than taking pictures — it's about preserving memories, telling stories and connecting with people.",
          email: 'ahmad.qeis122@gmail.com',
          phone: '081934193454',
          instagram: '@amdqeis__',
          instagramUrl: 'https://instagram.com/amdqeis__',
          location: 'Indonesia',
          statYears: '12+',
          statCountries: '28',
          statAwards: '14+',
          instagramTitle: 'FOLLOW MY JOURNEY\nON INSTAGRAM',
          aboutPhoto1: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=85',
          aboutPhoto2: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=85',
          aboutPhoto3: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=85',
        };

        for (const [k, v] of Object.entries(defaultSettings)) {
          await pool.query('INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING', [k, v]);
        }
        console.log('[PostgreSQL] Default portfolio settings seeded.');
      }
    } else {
      // Ensure any newly added settings keys exist even if settings already had some rows
      const additionalSettings: Record<string, string> = {
        statYears: '12+',
        statCountries: '28',
        statAwards: '14+',
        instagramTitle: 'FOLLOW MY JOURNEY\nON INSTAGRAM',
        aboutPhoto1: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=85',
        aboutPhoto2: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=85',
        aboutPhoto3: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=85',
      };
      for (const [k, v] of Object.entries(additionalSettings)) {
        await pool.query('INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO NOTHING', [k, v]);
      }
    }

    // 2b. Sanitize any legacy hardcoded typo in settings
    await pool.query(`
      UPDATE settings 
      SET value = 'HEY, I''M AHMAD QEIS' 
      WHERE key = 'eyebrow' AND value LIKE '%AHAD%';
    `);

    // 3. Ensure stories table is seeded if currently empty
    const storiesCheck = await pool.query('SELECT COUNT(*) as count FROM stories');
    const storiesCount = parseInt(storiesCheck.rows[0]?.count || '0', 10);
    if (storiesCount === 0) {
      const initialStories = [
        {
          id: 'story-1',
          title: 'Hiking The Canadian Rockies With My Camera',
          tag: 'TRAVEL',
          date: 'May 12, 2024',
          read_time: '6 min read',
          cover_image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=85',
          location: 'Banff National Park, Canada',
          excerpt: 'Ascending sub-zero ridges with 14kg of camera gear taught me how patience and physical endurance transform landscape photography.',
          quote: 'The mountain rewards those who wait past the point where common sense tells you to turn back.',
          content_json: JSON.stringify([
            'There is a quiet stillness that settles over the Canadian Rockies at 5:00 AM before the sun clears the serrated summits. The thermometer mounted to my pack read -8°C as my boots crunched into glacial shale.',
            'Carrying a heavy mirrorless rig with weather-sealed glass over 1,200 vertical meters is physically demanding, but the clarity of thin air at high altitude yields micro-contrast that no studio filter can replicate.',
            'Key takeaway: Always carry mechanical shutter backups, keep lithium-ion batteries inside your thermal inner jacket, and scout your vantage point during midday light before returning in pre-dawn gloom.'
          ]),
          sort_order: 1,
        },
        {
          id: 'story-2',
          title: 'My Favorite Camera Settings For Sharp Photos',
          tag: 'GEAR',
          date: 'May 8, 2024',
          read_time: '5 min read',
          cover_image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=85',
          location: 'Cape Town Studio, South Africa',
          excerpt: 'Debunking the myth of ultra-wide apertures and breaking down the precise auto-focus tracking calibrations I use on commercial assignments.',
          quote: 'Sharpness is not merely a technical parameter; it is the discipline of knowing where the viewer’s eye must rest.',
          content_json: JSON.stringify([
            'Too many photographers blame their lenses for softness when the culprit is almost always micro-motion blur or miscalibrated depth-of-field expectations. Shooting wide open at f/1.2 might create pleasant bokeh, but on dynamic editorial sets, stopping down to f/2.2 or f/2.8 often triples your keeper rate.',
            'For handheld natural light work, adhere to the reciprocal rule multiplied by 1.5x on high-resolution sensors (50MP+). When using an 85mm prime, never drop below 1/250s unless you are stabilized with a solid carbon tripod.',
            'Configure back-button focus with instantaneous eye-tracking override. This gives you tactile separation between shutter release timing and autofocus lock.'
          ]),
          sort_order: 2,
        },
        {
          id: 'story-3',
          title: '5 Tips For Natural Wedding Photography',
          tag: 'WEDDING',
          date: 'May 3, 2024',
          read_time: '7 min read',
          cover_image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=85',
          location: 'Valensole, France',
          excerpt: 'How to move invisibly, cultivate genuine emotional rapport, and anticipate unscripted moments without intrusive posing.',
          quote: 'The most timeless wedding photographs are the ones the couple never realized you were taking.',
          content_json: JSON.stringify([
            'Authentic emotion cannot be commanded. When you instruct a couple to "look happy and kiss," tension creeps into their jawlines and shoulders. Instead, create spatial freedom: give them a prompt to whisper to each other, and step back with a 70-200mm lens.',
            'Anticipate the reactions, not just the action. When vows are spoken, keep one eye trained on the parents in the second row or the grandfather wiping a discrete tear.',
            'Light is your co-author. Avoid harsh overhead midday sunlight by scouting shaded tree groves, or embrace backlit golden hour rim lighting by exposing for skin highlights.'
          ]),
          sort_order: 3,
        },
        {
          id: 'story-4',
          title: 'A Week In Amalfi Coast, Italy',
          tag: 'TRAVEL',
          date: 'April 28, 2024',
          read_time: '4 min read',
          cover_image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1000&q=85',
          location: 'Positano, Amalfi Coast, Italy',
          excerpt: 'Navigating narrow cliffside staircases, pastel terraces, and the timeless interplay between azure water and Mediterranean architecture.',
          quote: 'Positano bites deep. It is a dream place that isn’t quite real while you are there and becomes vividly real after you have left.',
          content_json: JSON.stringify([
            'The vertical architecture of the Amalfi coast presents unique compositional challenges. Traditional horizontal landscape framing cuts off either the dramatic sea cliff or the tiered pastel villas stacked above.',
            'Using a 24-70mm lens allowed me to frame vertical slices that juxtapose fishermen mending nets on the pebbled shore against lemon orchards clinging to limestone crags high overhead.',
            'The blue hour here is legendary. As twilight falls, the warm tungsten streetlamps turn the cliffside into a glowing jewel box reflected across the Tyrrhenian Sea.'
          ]),
          sort_order: 4,
        },
      ];

      for (const st of initialStories) {
        await pool.query(`
          INSERT INTO stories (
            id, title, tag, date, read_time, cover_image, excerpt, content_json, quote, location, sort_order
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          ON CONFLICT (id) DO NOTHING
        `, [
          st.id, st.title, st.tag, st.date, st.read_time, st.cover_image, st.excerpt, st.content_json, st.quote, st.location, st.sort_order
        ]);
      }
      console.log(`[PostgreSQL] Seeded ${initialStories.length} initial stories into DB.`);
    }

    // 4. Ensure portfolio photos table has curated entries if low count
    const photosCheck = await pool.query('SELECT COUNT(*) as count FROM photos');
    const photosCount = parseInt(photosCheck.rows[0]?.count || '0', 10);
    if (photosCount <= 1) {
      const curatedPhotos = [
        {
          id: 'photo-1789908428681',
          image_url: 'https://lh3.googleusercontent.com/d/1zsuMn_klT6oGAYkqy2bSKFtoPD4gURtR',
          title: 'As the night Calls',
          subtitle: 'Papandayan Night Series',
          location: 'Papandayan, West Java',
          year: '2026',
          camera: 'Sony Alpha 1',
          lens: 'FE 24-70mm f/2.8 GM II',
          aperture: 'f/2.8',
          shutter_speed: '25s',
          iso: '3200',
          focal_length: '24mm',
          sort_order: 0,
        },
        {
          id: 'photo-portrait-1',
          image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85',
          title: 'PORTRAITS',
          subtitle: 'Cape Town Series',
          location: 'Cape Town, South Africa',
          year: '2024',
          camera: 'Sony Alpha 1',
          lens: 'FE 85mm f/1.4 GM',
          aperture: 'f/1.4',
          shutter_speed: '1/1250s',
          iso: '100',
          focal_length: '85mm',
          sort_order: 1,
        },
        {
          id: 'photo-fashion-2',
          image_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85',
          title: 'FASHION',
          subtitle: 'Namib Dunes',
          location: 'Namib Desert, Namibia',
          year: '2024',
          camera: 'Hasselblad X2D 100C',
          lens: 'XCD 55mm f/2.5 V',
          aperture: 'f/2.8',
          shutter_speed: '1/2000s',
          iso: '64',
          focal_length: '55mm',
          sort_order: 2,
        },
        {
          id: 'photo-landscape-3',
          image_url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1000&q=85',
          title: 'LANDSCAPE',
          subtitle: 'Alpine Peaks',
          location: 'Dolomites, Italy',
          year: '2023',
          camera: 'Sony A7R V',
          lens: 'FE 16-35mm f/2.8 GM II',
          aperture: 'f/8.0',
          shutter_speed: '1/250s',
          iso: '100',
          focal_length: '24mm',
          sort_order: 3,
        },
        {
          id: 'photo-wildlife-4',
          image_url: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=1000&q=85',
          title: 'WILDLIFE',
          subtitle: 'Savannah Roam',
          location: 'Serengeti, Tanzania',
          year: '2024',
          camera: 'Canon EOS R3',
          lens: 'RF 400mm f/2.8 L IS USM',
          aperture: 'f/3.2',
          shutter_speed: '1/1600s',
          iso: '400',
          focal_length: '400mm',
          sort_order: 4,
        },
        {
          id: 'photo-wedding-5',
          image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85',
          title: 'WEDDINGS',
          subtitle: 'Golden Romance',
          location: 'Provence, France',
          year: '2024',
          camera: 'Leica SL2-S',
          lens: 'Summilux-SL 50mm f/1.4 ASPH',
          aperture: 'f/1.4',
          shutter_speed: '1/3200s',
          iso: '100',
          focal_length: '50mm',
          sort_order: 5,
        },
      ];

      for (const p of curatedPhotos) {
        await pool.query(`
          INSERT INTO photos (
            id, image_url, title, subtitle, location, year, camera, lens, aperture, shutter_speed, iso, focal_length, sort_order
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
          ON CONFLICT (id) DO NOTHING
        `, [
          p.id, p.image_url, p.title, p.subtitle, p.location, p.year,
          p.camera, p.lens, p.aperture, p.shutter_speed, p.iso, p.focal_length, p.sort_order,
        ]);
      }
      console.log(`[PostgreSQL] Seeded ${curatedPhotos.length} portfolio photos into DB.`);
    }

    isInitialized = true;
    console.log('[PostgreSQL] Database tables and schema verified successfully.');
  } catch (err: any) {
    console.error('[PostgreSQL] Error during schema initialization:', err.message);
  }
}
