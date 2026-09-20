import express from 'express';
import cors from 'cors';
import { initDatabase } from './db';
import { handleLogin } from './auth';
import { photosRouter } from './routes/photos';
import { storiesRouter } from './routes/stories';
import { settingsRouter } from './routes/settings';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));

// Health Check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Ahad Qeis Ismail Portfolio CMS Backend (PostgreSQL)',
  });
});

// Authentication
app.post('/api/auth/login', handleLogin);

// API Routers
app.use('/api/photos', photosRouter);
app.use('/api/stories', storiesRouter);
app.use('/api/settings', settingsRouter);

// Initialize PostgreSQL database & start server
initDatabase().catch((err) => {
  console.error('[PostgreSQL] Database initialization error:', err);
});

app.listen(PORT, () => {
  console.log(`[CMS Backend] Server running on http://127.0.0.1:${PORT}`);
});
