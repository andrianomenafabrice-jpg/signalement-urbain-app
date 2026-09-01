import { Request, Response } from 'express';
import * as authService from './auth.service';
import { env } from '../../config/env';
import { toMilliseconds } from '../../utils/duration';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';

const REFRESH_COOKIE_NAME = 'refreshToken';

function setRefreshCookie(res: Response, token: string): void {
  res.cookie(REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: toMilliseconds(env.JWT_REFRESH_EXPIRES),
    path: '/api/auth',
  });
}

export async function registerHandler(req: Request, res: Response): Promise<void> {
  const { user, accessToken, refreshToken } = await authService.register(req.body);
  setRefreshCookie(res, refreshToken);
  res.status(201).json({ user, accessToken });
}

export async function loginHandler(req: Request, res: Response): Promise<void> {
  const { user, accessToken, refreshToken } = await authService.login(req.body);
  setRefreshCookie(res, refreshToken);
  res.json({ user, accessToken });
}

export async function refreshHandler(req: Request, res: Response): Promise<void> {
  const token = req.cookies?.[REFRESH_COOKIE_NAME];
  if (!token) {
    res.status(401).json({ error: { code: 'TOKEN_INVALIDE', message: 'Aucun refresh token fourni.' } });
    return;
  }

  const { user, accessToken, refreshToken } = await authService.refresh(token);
  setRefreshCookie(res, refreshToken);
  res.json({ user, accessToken });
}

export async function logoutHandler(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (req.user) {
    await authService.logout(req.user.id);
  }
  res.clearCookie(REFRESH_COOKIE_NAME, { path: '/api/auth' });
  res.status(204).send();
}