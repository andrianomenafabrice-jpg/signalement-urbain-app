import bcrypt from 'bcryptjs';
import User, { IUser } from '../../models/User';
import { AppError } from '../../middlewares/errorHandler';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/tokens';
import { RegisterInput, LoginInput } from './auth.validation';

const SALT_ROUNDS = 10;

export interface SafeUser {
  id: string;
  nom: string;
  email: string;
  role: 'citoyen' | 'admin';
}

interface AuthResult {
  user: SafeUser;
  accessToken: string;
  refreshToken: string;
}

function toSafeUser(user: IUser): SafeUser {
  return {
    id: user.id,
    nom: user.nom,
    email: user.email,
    role: user.role,
  };
}

export async function register(input: RegisterInput): Promise<AuthResult> {
  const emailExiste = await User.exists({ email: input.email });
  if (emailExiste) {
    throw new AppError('EMAIL_DEJA_UTILISE', 'Un compte existe deja avec cet email.', 409);
  }

  const motDePasseHash = await bcrypt.hash(input.motDePasse, SALT_ROUNDS);
  const user = await User.create({
    nom: input.nom,
    email: input.email,
    motDePasseHash,
  });

  return emettreSession(user);
}

export async function login(input: LoginInput): Promise<AuthResult> {
  const user = await User.findOne({ email: input.email }).select('+motDePasseHash');
  if (!user) {
    throw new AppError('IDENTIFIANTS_INVALIDES', 'Email ou mot de passe incorrect.', 401);
  }

  const motDePasseValide = await bcrypt.compare(input.motDePasse, user.motDePasseHash);
  if (!motDePasseValide) {
    throw new AppError('IDENTIFIANTS_INVALIDES', 'Email ou mot de passe incorrect.', 401);
  }

  return emettreSession(user);
}

export async function refresh(refreshToken: string): Promise<AuthResult> {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new AppError('TOKEN_INVALIDE', 'Refresh token invalide ou expire.', 401);
  }

  const user = await User.findById(payload.sub).select('+currentRefreshJti');
  if (!user || user.currentRefreshJti !== payload.jti) {
    if (user) {
      user.currentRefreshJti = null;
      await user.save();
    }
    throw new AppError('TOKEN_INVALIDE', 'Session invalide, reconnecte-toi.', 401);
  }

  return emettreSession(user);
}

export async function logout(userId: string): Promise<void> {
  await User.findByIdAndUpdate(userId, { currentRefreshJti: null });
}

async function emettreSession(user: IUser): Promise<AuthResult> {
  const accessToken = generateAccessToken(user.id, user.role);
  const { token: refreshToken, jti } = generateRefreshToken(user.id);

  user.currentRefreshJti = jti;
  await user.save();

  return { user: toSafeUser(user), accessToken, refreshToken };
}