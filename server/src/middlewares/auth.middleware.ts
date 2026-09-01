import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/tokens';
import { AppError } from './errorHandler';

export interface AuthenticatedRequest extends Request {
  user?: { id: string; role: 'citoyen' | 'admin' };
}

export function requireAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    next(new AppError('NON_AUTHENTIFIE', "Token d'acces manquant.", 401));
    return;
  }

  const token = header.slice('Bearer '.length);

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    next(new AppError('NON_AUTHENTIFIE', "Token d'acces invalide ou expire.", 401));
  }
}