import { Response } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';
import * as adminService from './admin.service';

export async function statsHandler(_req: AuthenticatedRequest, res: Response): Promise<void> {
  const stats = await adminService.obtenirStatistiques();
  res.json(stats);
}