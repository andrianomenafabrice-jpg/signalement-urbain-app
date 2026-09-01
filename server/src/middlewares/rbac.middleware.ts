import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';
import { AppError } from './errorHandler';

export function requireRole(...roles: Array<'citoyen' | 'admin'>) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      next(new AppError('ACCES_REFUSE', 'Acces reserve a un role different.', 403));
      return;
    }
    next();
  };
}