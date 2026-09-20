import { Router, Request, Response } from 'express';
import { pool, ensureInitialized } from '../db';
import { requireAuth } from '../auth';
import { parseGoogleDriveLink } from '../utils/driveParser';

export const settingsRouter = Router();

// GET settings (public)
settingsRouter.get('/', async (_req: Request, res: Response) => {
  try {
    await ensureInitialized();
    const result = await pool.query('SELECT key, value FROM settings');
    const settings: Record<string, string> = {};
    for (const r of result.rows) {
      settings[r.key] = r.value;
    }
    res.json({ success: true, data: settings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Database query failed' });
  }
});

// PUT update settings (protected)
settingsRouter.put('/', requireAuth, async (req: Request, res: Response) => {
  try {
    await ensureInitialized();
    const updates = req.body as Record<string, string>;

    const imageKeys = [
      'heroImageUrl',
      'aboutPhoto1',
      'aboutPhoto2',
      'aboutPhoto3',
      'igPhoto1',
      'igPhoto2',
      'igPhoto3',
      'igPhoto4',
      'igPhoto5',
    ];

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const [key, value] of Object.entries(updates)) {
        let finalValue = value ? String(value).trim() : '';
        // If it's an image key and contains a Drive link, resolve to direct stream URL
        if (imageKeys.includes(key) && finalValue) {
          const parsed = parseGoogleDriveLink(finalValue);
          finalValue = parsed.directUrl;
        }
        await client.query(`
          INSERT INTO settings (key, value)
          VALUES ($1, $2)
          ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
        `, [key, finalValue]);
      }
      await client.query('COMMIT');
    } catch (txError) {
      await client.query('ROLLBACK');
      throw txError;
    } finally {
      client.release();
    }

    res.json({ success: true, message: 'Settings updated successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to update settings' });
  }
});
