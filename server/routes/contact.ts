import { Router, Request, Response } from 'express';
import { pool, ensureInitialized } from '../db';

export const contactRouter = Router();

// POST /api/contact — simpan pesan kontak ke DB (public)
contactRouter.post('/', async (req: Request, res: Response) => {
  try {
    await ensureInitialized();

    const { email, message } = req.body as { email?: string; message?: string };

    if (!email || !email.includes('@')) {
      res.status(400).json({ success: false, message: 'Email tidak valid.' });
      return;
    }

    // Pastikan tabel contact_messages ada
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL,
        message TEXT,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(
      'INSERT INTO contact_messages (email, message) VALUES ($1, $2)',
      [email.trim(), message ? message.trim() : null]
    );

    console.log(`[Contact] Pesan masuk dari: ${email}`);
    res.json({ success: true, message: 'Pesan berhasil diterima.' });
  } catch (error: any) {
    console.error('[Contact] Error:', error.message);
    res.status(500).json({ success: false, message: 'Gagal menyimpan pesan.' });
  }
});
