import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { ensureInitialized } from './db';
import { handleLogin } from './auth';
import { photosRouter } from './routes/photos';
import { storiesRouter } from './routes/stories';
import { settingsRouter } from './routes/settings';
import { contactRouter } from './routes/contact';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const isProd = process.env.NODE_ENV === 'production';

// Middleware
app.use(cors({
  origin: isProd ? false : '*', // lock CORS in production (same-origin via static serve)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));

// Health Check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Portfolio CMS Backend (PostgreSQL)',
  });
});

// Authentication
app.post('/api/auth/login', handleLogin);

// API Routers
app.use('/api/photos', photosRouter);
app.use('/api/stories', storiesRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/contact', contactRouter);

// ── Production: serve the Vite-built frontend ──────────────────────────────
if (isProd) {
  const distPath = path.resolve(__dirname, '../dist');
  app.use(express.static(distPath));

  // SPA fallback — all non-API routes serve index.html
  app.get('/{*splat}', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Initialize PostgreSQL database & start server
ensureInitialized().catch((err) => {
  console.error('[PostgreSQL] Database initialization error:', err);
});

app.listen(PORT, () => {
  console.log(`[CMS Backend] Server running on http://0.0.0.0:${PORT}`);
  if (isProd) {
    console.log(`[Static]     Serving frontend from /dist`);
  }
});
