import fs from 'fs/promises';
import mongoose from 'mongoose';
import Report, { IReport } from '../../models/Report';
import { AppError } from '../../middlewares/errorHandler';
import { appliquerTransition, EtatSignalement, Statut } from '../../services/statut.service';
import { CreateReportInput, ListReportsQuery } from './report.validation';
import { verifierSignatureImage } from '../../utils/fileSignature';
import { envoyerEmailChangementStatut } from '../../services/email.service';

interface CreerReportParams {
  input: CreateReportInput;
  auteurId: string;
  fichier?: Express.Multer.File;
}

export async function creerSignalement({ input, auteurId, fichier }: CreerReportParams): Promise<IReport> {
  if (!fichier) {
    throw new AppError('PHOTO_REQUISE', 'Une photo est requise pour creer un signalement.', 400);
  }

  const signatureValide = await verifierSignatureImage(fichier.path, fichier.mimetype);
  if (!signatureValide) {
    await fs.unlink(fichier.path).catch(() => undefined);
    throw new AppError('FICHIER_INVALIDE', 'Le contenu du fichier ne correspond pas a une image valide.', 400);
  }

  // En dev, l'URL pointe vers le fichier local servi par Express.
  // En prod (Phase 8), remplace par l'URL retournee par Cloudinary.
  const urlPhoto = `/uploads/${fichier.filename}`;

  const report = await Report.create({
    titre: input.titre,
    description: input.description,
    categorie: input.categorie,
    location: { type: 'Point', coordinates: [input.longitude, input.latitude] },
    photos: [urlPhoto],
    auteurId,
    historiqueStatuts: [{ statut: 'signale', date: new Date(), parId: auteurId }],
  });

  return report;
}

export async function listerSignalements(query: ListReportsQuery) {
  const filtre: Record<string, unknown> = {};

  if (query.categorie) filtre.categorie = query.categorie;
  if (query.statut) filtre.statut = query.statut;

  if (query.bbox) {
    const [minLon, minLat, maxLon, maxLat] = query.bbox.split(',').map(Number);
    filtre.location = {
      $geoWithin: { $box: [[minLon, minLat], [maxLon, maxLat]] },
    };
  }

  const skip = (query.page - 1) * query.limit;

  const [donnees, total] = await Promise.all([
    Report.find(filtre).sort({ createdAt: -1 }).skip(skip).limit(query.limit),
    Report.countDocuments(filtre),
  ]);

  return {
    donnees,
    pagination: { page: query.page, limit: query.limit, total, totalPages: Math.ceil(total / query.limit) },
  };
}

export async function obtenirSignalementParId(id: string): Promise<IReport> {
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError('SIGNALEMENT_INTROUVABLE', 'Signalement introuvable.', 404);
  }
  const report = await Report.findById(id);
  if (!report) {
    throw new AppError('SIGNALEMENT_INTROUVABLE', 'Signalement introuvable.', 404);
  }
  return report;
}

export async function listerMesSignalements(auteurId: string, query: ListReportsQuery) {
  const filtre: Record<string, unknown> = { auteurId };
  if (query.categorie) filtre.categorie = query.categorie;
  if (query.statut) filtre.statut = query.statut;

  const skip = (query.page - 1) * query.limit;

  const [donnees, total] = await Promise.all([
    Report.find(filtre).sort({ createdAt: -1 }).skip(skip).limit(query.limit),
    Report.countDocuments(filtre),
  ]);

  return {
    donnees,
    pagination: { page: query.page, limit: query.limit, total, totalPages: Math.ceil(total / query.limit) },
  };
}

export async function changerStatutSignalement(id: string, nouveauStatut: Statut, adminId: string): Promise<IReport> {
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError('SIGNALEMENT_INTROUVABLE', 'Signalement introuvable.', 404);
  }

  const report = await Report.findById(id);
  if (!report) {
    throw new AppError('SIGNALEMENT_INTROUVABLE', 'Signalement introuvable.', 404);
  }

  const etatActuel: EtatSignalement = { statut: report.statut, historiqueStatuts: report.historiqueStatuts };
  const resultat = appliquerTransition(etatActuel, nouveauStatut, adminId);

  if (!resultat.succes) {
    throw new AppError('TRANSITION_INVALIDE', resultat.erreur ?? 'Transition de statut invalide.', 400);
  }

  report.statut = resultat.etat.statut;
  report.historiqueStatuts = resultat.etat.historiqueStatuts as typeof report.historiqueStatuts;
  await report.save();

  envoyerEmailChangementStatut(report).catch((erreur) => {
    console.error("Echec de l'envoi de l'email de notification :", erreur);
  });

  return report;
}