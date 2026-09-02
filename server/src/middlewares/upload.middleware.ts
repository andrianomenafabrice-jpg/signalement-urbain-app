import multer from 'multer';
import { Request } from 'express';
import { AppError } from './errorHandler';

const MIME_AUTORISES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const TAILLE_MAX_OCTETS = 5 * 1024 * 1024;

function fileFilter(_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback): void {
  if (!MIME_AUTORISES.has(file.mimetype)) {
    cb(new AppError('FICHIER_INVALIDE', 'Seules les images JPEG, PNG ou WebP sont acceptees.', 400));
    return;
  }
  cb(null, true);
}

export const uploadPhoto = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: TAILLE_MAX_OCTETS, files: 1 },
});