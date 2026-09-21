import 'dotenv/config';
import { initDatabase, pool } from './db';

async function main() {
  console.log('[DB Init] Starting table migration using environment configuration...');

  try {
    await initDatabase();

    // Verify created tables in public schema
    const res = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    const tableNames = res.rows.map((r) => r.table_name);
    console.log('[DB Init] Available tables in database:', tableNames);

    if (tableNames.includes('photos')) {
      const photosCount = await pool.query('SELECT COUNT(*) as cnt FROM photos');
      console.log(`[DB Init] "photos" table ready (rows: ${photosCount.rows[0].cnt})`);
    }

    if (tableNames.includes('stories')) {
      const storiesCount = await pool.query('SELECT COUNT(*) as cnt FROM stories');
      console.log(`[DB Init] "stories" table ready (rows: ${storiesCount.rows[0].cnt})`);
    }

    if (tableNames.includes('settings')) {
      const settingsCount = await pool.query('SELECT COUNT(*) as cnt FROM settings');
      console.log(`[DB Init] "settings" table ready (rows: ${settingsCount.rows[0].cnt})`);
    }

    console.log('[DB Init] Database tables and schema successfully built and verified!');
  } catch (err: any) {
    console.error('[DB Init] Failed to build tables:', err.message || err);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();
