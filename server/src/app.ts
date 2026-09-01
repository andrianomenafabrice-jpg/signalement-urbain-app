import express, { Express } from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import { env } from './config/env';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import authRoutes from './modules/auth/auth.routes';
import reportRoutes from './modules/reports/report.routes';

export function createApp(): Express {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());

  if (env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
  }

  const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/api', globalLimiter);

  // Sert les photos uploadees localement en dev. En prod (Phase 8),
  // les photos sont sur Cloudinary et cette ligne devient inutile.
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', db: mongoose.connection.readyState === 1 ? 'connecte' : 'deconnecte' });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/reports', reportRoutes);

  // Les routes admin arrivent en Phase 6.

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}