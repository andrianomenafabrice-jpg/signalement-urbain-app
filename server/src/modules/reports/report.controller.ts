import { Response } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import * as reportService from './report.service';
import { CreateReportInput, ChangeStatutInput, ListReportsQuery } from './report.validation';

export async function createReportHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
  const report = await reportService.creerSignalement({
    input: req.body as CreateReportInput,
    auteurId: req.user!.id,
    fichier: req.file,
  });
  res.status(201).json({ signalement: report });
}

export async function listReportsHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
  const resultat = await reportService.listerSignalements(req.query as unknown as ListReportsQuery);
  res.json(resultat);
}

export async function getReportHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
  const report = await reportService.obtenirSignalementParId(req.params.id);
  res.json({ signalement: report });
}

export async function listMineHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
  const resultat = await reportService.listerMesSignalements(req.user!.id, req.query as unknown as ListReportsQuery);
  res.json(resultat);
}

export async function changeStatutHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { statut } = req.body as ChangeStatutInput;
  const report = await reportService.changerStatutSignalement(req.params.id, statut, req.user!.id);
  res.json({ signalement: report });
}