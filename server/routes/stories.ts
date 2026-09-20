import { Router, Request, Response } from 'express';
import { db } from '../db';
import { requireAuth } from '../auth';
import { parseGoogleDriveLink } from '../utils/driveParser';

export const storiesRouter = Router();

// GET all stories (public)
storiesRouter.get('/', (_req: Request, res: Response) => {
  try {
    const rows = db.prepare('SELECT * FROM stories ORDER BY sort_order ASC, created_at DESC').all() as any[];

    const stories = rows.map((r) => {
      let content: string[] = [];
      try {
        content = JSON.parse(r.content_json);
      } catch {
        content = [r.content_json];
      }

      return {
        id: r.id,
        title: r.title,
        tag: r.tag,
        date: r.date,
        readTime: r.read_time,
        coverImage: r.cover_image,
        driveFileId: r.drive_file_id,
        excerpt: r.excerpt,
        content,
        quote: r.quote || undefined,
        location: r.location || undefined,
        sortOrder: r.sort_order,
        createdAt: r.created_at,
      };
    });

    res.json({ success: true, data: stories });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST new story (protected)
storiesRouter.post('/', requireAuth, (req: Request, res: Response) => {
  try {
    const { title, tag, date, readTime, coverImage, excerpt, content, quote, location, sortOrder } = req.body;

    if (!title || !coverImage || !excerpt) {
      res.status(400).json({ success: false, message: 'Title, cover image, and excerpt are required' });
      return;
    }

    const parsed = parseGoogleDriveLink(coverImage);
    const finalCover = parsed.directUrl;
    const driveFileId = parsed.fileId;

    const id = `story-${Date.now()}`;
    const formattedDate = date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const formattedReadTime = readTime || '5 min read';
    const formattedTag = (tag || 'TRAVEL').toUpperCase();
    const contentArray = Array.isArray(content) ? content : [content || excerpt];

    const insert = db.prepare(`
      INSERT INTO stories (
        id, title, tag, date, read_time, cover_image, drive_file_id, excerpt, content_json, quote, location, sort_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insert.run(
      id,
      title.trim(),
      formattedTag,
      formattedDate,
      formattedReadTime,
      finalCover,
      driveFileId,
      excerpt.trim(),
      JSON.stringify(contentArray),
      quote ? quote.trim() : null,
      location ? location.trim() : null,
      sortOrder || 0
    );

    res.status(201).json({ success: true, message: 'Story created successfully', id });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT update story (protected)
storiesRouter.put('/:id', requireAuth, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, tag, date, readTime, coverImage, excerpt, content, quote, location, sortOrder } = req.body;

    const existing = db.prepare('SELECT * FROM stories WHERE id = ?').get(id) as any;
    if (!existing) {
      res.status(404).json({ success: false, message: 'Story not found' });
      return;
    }

    let finalCover = existing.cover_image;
    let driveFileId = existing.drive_file_id;

    if (coverImage && coverImage !== existing.cover_image) {
      const parsed = parseGoogleDriveLink(coverImage);
      finalCover = parsed.directUrl;
      driveFileId = parsed.fileId;
    }

    const contentJson = content !== undefined
      ? JSON.stringify(Array.isArray(content) ? content : [content])
      : existing.content_json;

    const update = db.prepare(`
      UPDATE stories SET
        title = ?,
        tag = ?,
        date = ?,
        read_time = ?,
        cover_image = ?,
        drive_file_id = ?,
        excerpt = ?,
        content_json = ?,
        quote = ?,
        location = ?,
        sort_order = ?
      WHERE id = ?
    `);

    update.run(
      title ? title.trim() : existing.title,
      tag ? tag.toUpperCase() : existing.tag,
      date || existing.date,
      readTime || existing.read_time,
      finalCover,
      driveFileId,
      excerpt ? excerpt.trim() : existing.excerpt,
      contentJson,
      quote !== undefined ? (quote ? quote.trim() : null) : existing.quote,
      location !== undefined ? (location ? location.trim() : null) : existing.location,
      sortOrder !== undefined ? sortOrder : existing.sort_order,
      id
    );

    res.json({ success: true, message: 'Story updated successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE story (protected)
storiesRouter.delete('/:id', requireAuth, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = db.prepare('DELETE FROM stories WHERE id = ?').run(id);

    if (result.changes === 0) {
      res.status(404).json({ success: false, message: 'Story not found' });
      return;
    }

    res.json({ success: true, message: 'Story deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});
