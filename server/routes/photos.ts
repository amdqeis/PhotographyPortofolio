import { Router, Request, Response } from 'express';
import { db } from '../db';
import { requireAuth } from '../auth';
import { parseGoogleDriveLink } from '../utils/driveParser';

export const photosRouter = Router();

// GET all photos (public)
photosRouter.get('/', (_req: Request, res: Response) => {
  try {
    const rows = db.prepare('SELECT * FROM photos ORDER BY sort_order ASC, created_at DESC').all() as any[];

    const photos = rows.map((r) => ({
      id: r.id,
      imageUrl: r.image_url,
      driveFileId: r.drive_file_id,
      title: r.title || undefined,
      subtitle: r.subtitle || undefined,
      aspectRatio: 'portrait',
      location: r.location || '',
      year: r.year || '',
      exif: {
        camera: r.camera || '',
        lens: r.lens || '',
        aperture: r.aperture || '',
        shutterSpeed: r.shutter_speed || '',
        iso: r.iso || '',
        focalLength: r.focal_length || '',
      },
      sortOrder: r.sort_order,
      createdAt: r.created_at,
    }));

    res.json({ success: true, data: photos });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST new photo (protected)
photosRouter.post('/', requireAuth, (req: Request, res: Response) => {
  try {
    const rawUrl = req.body.imageUrl || req.body.driveUrl || req.body.url;

    if (!rawUrl) {
      res.status(400).json({ success: false, message: 'Image link or Google Drive URL is required' });
      return;
    }

    // Parse Google Drive Link if provided
    const parsed = parseGoogleDriveLink(rawUrl);
    const finalImageUrl = parsed.directUrl;
    const driveFileId = parsed.fileId;

    const id = req.body.id || `photo-${Date.now()}`;
    const nextOrder = req.body.sortOrder !== undefined ? req.body.sortOrder : 0;

    const title = req.body.title ? req.body.title.trim() : null;
    const subtitle = req.body.subtitle ? req.body.subtitle.trim() : null;
    const location = req.body.location ? req.body.location.trim() : null;
    const year = req.body.year ? req.body.year.trim() : null;

    // Handle both flat and nested exif
    const exifObj = req.body.exif || {};
    const camera = req.body.camera || exifObj.camera || null;
    const lens = req.body.lens || exifObj.lens || null;
    const aperture = req.body.aperture || exifObj.aperture || null;
    const shutterSpeed = req.body.shutterSpeed || exifObj.shutterSpeed || null;
    const iso = req.body.iso || exifObj.iso || null;
    const focalLength = req.body.focalLength || exifObj.focalLength || null;

    const insert = db.prepare(`
      INSERT INTO photos (
        id, image_url, drive_file_id, title, subtitle, location, year, camera, lens, aperture, shutter_speed, iso, focal_length, sort_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insert.run(
      id,
      finalImageUrl,
      driveFileId,
      title,
      subtitle,
      location,
      year,
      camera,
      lens,
      aperture,
      shutterSpeed,
      iso,
      focalLength,
      nextOrder
    );

    res.json({
      success: true,
      message: 'Photo published successfully',
      data: {
        id,
        imageUrl: finalImageUrl,
        driveFileId,
        title: title || undefined,
        subtitle: subtitle || undefined,
        location: location || '',
        year: year || '',
        exif: {
          camera: camera || '',
          lens: lens || '',
          aperture: aperture || '',
          shutterSpeed: shutterSpeed || '',
          iso: iso || '',
          focalLength: focalLength || '',
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT update photo (protected)
photosRouter.put('/:id', requireAuth, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const rawUrl = req.body.imageUrl || req.body.driveUrl || req.body.url;

    let finalImageUrl = rawUrl;
    let driveFileId = req.body.driveFileId || null;

    if (rawUrl) {
      const parsed = parseGoogleDriveLink(rawUrl);
      finalImageUrl = parsed.directUrl;
      driveFileId = parsed.fileId;
    }

    const exifObj = req.body.exif || {};
    const camera = req.body.camera !== undefined ? req.body.camera : exifObj.camera;
    const lens = req.body.lens !== undefined ? req.body.lens : exifObj.lens;
    const aperture = req.body.aperture !== undefined ? req.body.aperture : exifObj.aperture;
    const shutterSpeed = req.body.shutterSpeed !== undefined ? req.body.shutterSpeed : exifObj.shutterSpeed;
    const iso = req.body.iso !== undefined ? req.body.iso : exifObj.iso;
    const focalLength = req.body.focalLength !== undefined ? req.body.focalLength : exifObj.focalLength;

    const update = db.prepare(`
      UPDATE photos
      SET 
        image_url = COALESCE(?, image_url),
        drive_file_id = COALESCE(?, drive_file_id),
        title = ?,
        subtitle = ?,
        location = ?,
        year = ?,
        camera = ?,
        lens = ?,
        aperture = ?,
        shutter_speed = ?,
        iso = ?,
        focal_length = ?,
        sort_order = COALESCE(?, sort_order)
      WHERE id = ?
    `);

    update.run(
      finalImageUrl || null,
      driveFileId,
      req.body.title ? req.body.title.trim() : null,
      req.body.subtitle ? req.body.subtitle.trim() : null,
      req.body.location ? req.body.location.trim() : null,
      req.body.year ? req.body.year.trim() : null,
      camera ? camera.trim() : null,
      lens ? lens.trim() : null,
      aperture ? aperture.trim() : null,
      shutterSpeed ? shutterSpeed.trim() : null,
      iso ? iso.trim() : null,
      focalLength ? focalLength.trim() : null,
      req.body.sortOrder,
      id
    );

    res.json({ success: true, message: 'Photo updated successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE photo (protected)
photosRouter.delete('/:id', requireAuth, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = db.prepare('DELETE FROM photos WHERE id = ?').run(id);

    if (result.changes === 0) {
      res.status(404).json({ success: false, message: 'Photo not found' });
      return;
    }

    res.json({ success: true, message: 'Photo deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});
