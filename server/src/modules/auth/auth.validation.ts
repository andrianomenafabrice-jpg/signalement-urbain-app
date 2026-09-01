import { z } from 'zod';

export const registerSchema = z.object({
  nom: z.string().trim().min(2, 'Le nom doit contenir au moins 2 caracteres.'),
  email: z.string().trim().toLowerCase().email('Email invalide.'),
  motDePasse: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caracteres.'),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Email invalide.'),
  motDePasse: z.string().min(1, 'Mot de passe requis.'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;