import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  nom: string;
  email: string;
  motDePasseHash: string;
  role: 'citoyen' | 'admin';
  currentRefreshJti: string | null;
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  nom: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  motDePasseHash: { type: String, required: true, select: false },
  role: { type: String, enum: ['citoyen', 'admin'], default: 'citoyen' },
  currentRefreshJti: { type: String, default: null, select: false },
}, { timestamps: true });

export default model<IUser>('User', userSchema);