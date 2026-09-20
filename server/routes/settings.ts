import { Router, Request, Response } from 'express';
import { db } from '../db';
import { requireAuth } from '../auth';
import { parseGoogleDriveLink } from '../utils/driveParser';

export const settingsRouter = Router();

// GET settings (public)
settingsRouter.get('/', (_req: Request, res: Response) => {
  try {
    const rows = db.prepare('SELECT * FROM settings').all() as { key: string; value: string }[];
    const settings: Record<string, string> = {};
    for (const r of rows) {
      settings[r.key] = r.value;
    }
    res.json({ success: true, data: settings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT update settings (protected)
settingsRouter.put('/', requireAuth, (req: Request, res: Response) => {
  try {
    const updates = req.body as Record<string, string>;

    const upsert = db.prepare(`
      INSERT INTO settings (key, value) VALUES (?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `);

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

    const updateMany = db.transaction((entries: [string, string][]) => {
      for (const [key, value] of entries) {
        let finalValue = value ? String(value).trim() : '';
        // If it's an image key and contains a Drive link, resolve to high-speed CDN stream
        if (imageKeys.includes(key) && finalValue) {
          const parsed = parseGoogleDriveLink(finalValue);
          finalValue = parsed.directUrl;
        }
        upsert.run(key, finalValue);
      }
    });

    updateMany(Object.entries(updates));

    res.json({ success: true, message: 'Settings updated successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});
