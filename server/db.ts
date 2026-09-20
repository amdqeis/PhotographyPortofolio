import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'portfolio.db');
export const db = new Database(dbPath);

// Enable WAL mode for high performance and concurrency
db.pragma('journal_mode = WAL');

export function initDatabase() {
  // Create Photos table
  db.exec(`
    CREATE TABLE IF NOT EXISTS photos (
      id TEXT PRIMARY KEY,
      image_url TEXT NOT NULL,
      drive_file_id TEXT,
      title TEXT,
      subtitle TEXT,
      location TEXT,
      year TEXT,
      camera TEXT,
      lens TEXT,
      aperture TEXT,
      shutter_speed TEXT,
      iso TEXT,
      focal_length TEXT,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS stories (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      tag TEXT NOT NULL,
      date TEXT NOT NULL,
      read_time TEXT NOT NULL,
      cover_image TEXT NOT NULL,
      drive_file_id TEXT,
      excerpt TEXT NOT NULL,
      content_json TEXT NOT NULL,
      quote TEXT,
      location TEXT,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  // Seed default settings if not exists
  const settingsCount = db.prepare('SELECT COUNT(*) as count FROM settings').get() as { count: number };
  if (settingsCount.count === 0) {
    const insertSetting = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)');
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

    for (const [key, value] of Object.entries(defaultSettings)) {
      insertSetting.run(key, value);
    }
  }

  console.log('[SQLite] Portfolio database initialized successfully (clean slate).');
}
