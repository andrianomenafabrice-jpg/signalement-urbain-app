import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { Request } from 'express';
import { AppError } from './errorHandler';

const MIME_AUTORISES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const TAILLE_MAX_OCTETS = 5 * 1024 * 1024; // 5 Mo

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(process.cwd(), 'uploads'));
  },
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `${crypto.randomUUID()}${extension}`);
  },
});

function fileFilter(_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback): void {
  if (!MIME_AUTORISES.has(file.mimetype)) {
    cb(new AppError('FICHIER_INVALIDE', 'Seules les images JPEG, PNG ou WebP sont acceptees.', 400));
    return;
  }
  cb(null, true);
}

export const uploadPhoto = multer({
  storage,
  fileFilter,
  limits: { fileSize: TAILLE_MAX_OCTETS, files: 1 },
});