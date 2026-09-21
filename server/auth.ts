import 'dotenv/config';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


if (!process.env.CMS_ADMIN_PASSWORD || !process.env.JWT_SECRET) {
  throw new Error(
    '[Auth] Missing required env vars: CMS_ADMIN_PASSWORD and JWT_SECRET must be set in .env'
  );
}

const ADMIN_PASSWORD_KEY = process.env.CMS_ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;

export interface AuthRequest extends Request {
  user?: {
    role: string;
    loginTime: number;
  };
}

export function handleLogin(req: Request, res: Response): void {
  const password = req.body.password || req.body.key;

  if (!password) {
    res.status(400).json({ success: false, message: 'Password is required' });
    return;
  }

  if (password !== ADMIN_PASSWORD_KEY) {
    res.status(401).json({ success: false, message: 'Invalid credential key password' });
    return;
  }

  // Issue JWT Token valid for 7 days
  const token = jwt.sign(
    {
      role: 'admin',
      loginTime: Date.now(),
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    success: true,
    message: 'Authentication successful',
    token,
    user: {
      role: 'admin',
      name: 'Administrator',
    },
  });
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Authorization token required' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { role: string; loginTime: number };
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ success: false, message: 'Session expired or invalid token' });
  }
}
