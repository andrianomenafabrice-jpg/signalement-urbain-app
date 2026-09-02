import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../config/env';

export interface AccessTokenPayload {
  sub: string;
  role: 'citoyen' | 'admin';
  jti: string;
}

export interface RefreshTokenPayload {
  sub: string;
  jti: string;
}

export function generateAccessToken(userId: string, role: 'citoyen' | 'admin'): string {
  const payload: AccessTokenPayload = { sub: userId, role, jti: crypto.randomUUID() };
  const options: SignOptions = { expiresIn: env.JWT_ACCESS_EXPIRES as SignOptions['expiresIn'] };
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, options);
}

export function generateRefreshToken(userId: string): { token: string; jti: string } {
  const jti = crypto.randomUUID();
  const payload: RefreshTokenPayload = { sub: userId, jti };
  const options: SignOptions = { expiresIn: env.JWT_REFRESH_EXPIRES as SignOptions['expiresIn'] };
  const token = jwt.sign(payload, env.JWT_REFRESH_SECRET, options);
  return { token, jti };
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
}