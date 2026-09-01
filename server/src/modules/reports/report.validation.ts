import { z } from 'zod';

const categorieEnum = z.enum(['voirie', 'eclairage', 'dechets', 'eau', 'autre']);
const statutEnum = z.enum(['signale', 'en_cours', 'resolu']);

export const createReportSchema = z.object({
  titre: z.string().trim().min(3, 'Le titre doit contenir au moins 3 caracteres.').max(120),
  description: z.string().trim().min(10, 'La description doit contenir au moins 10 caracteres.'),
  categorie: categorieEnum,
  latitude: z.coerce.number().min(-90, 'Latitude invalide.').max(90, 'Latitude invalide.'),
  longitude: z.coerce.number().min(-180, 'Longitude invalide.').max(180, 'Longitude invalide.'),
});

export const changeStatutSchema = z.object({
  statut: statutEnum,
});

export const listReportsQuerySchema = z.object({
  categorie: categorieEnum.optional(),
  statut: statutEnum.optional(),
  bbox: z
    .string()
    .regex(/^-?\d+(\.\d+)?,-?\d+(\.\d+)?,-?\d+(\.\d+)?,-?\d+(\.\d+)?$/, 'Format bbox attendu : minLon,minLat,maxLon,maxLat')
    .optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type CreateReportInput = z.infer<typeof createReportSchema>;
export type ChangeStatutInput = z.infer<typeof changeStatutSchema>;
export type ListReportsQuery = z.infer<typeof listReportsQuerySchema>;