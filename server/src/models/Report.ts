import { Schema, model, Document, Types } from 'mongoose';

interface IStatusChange {
  statut: 'signale' | 'en_cours' | 'resolu';
  date: Date;
  parId: Types.ObjectId;
}

export interface IReport extends Document {
  titre: string;
  description: string;
  categorie: 'voirie' | 'eclairage' | 'dechets' | 'eau' | 'autre';
  location: { type: 'Point'; coordinates: [number, number] };
  photos: string[];
  statut: 'signale' | 'en_cours' | 'resolu';
  historiqueStatuts: IStatusChange[];
  auteurId: Types.ObjectId;
  createdAt: Date;
}

const reportSchema = new Schema<IReport>({
  titre: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  categorie: { type: String, enum: ['voirie', 'eclairage', 'dechets', 'eau', 'autre'], required: true },
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true },
  },
  photos: [{ type: String }],
  statut: { type: String, enum: ['signale', 'en_cours', 'resolu'], default: 'signale' },
  historiqueStatuts: [{
    statut: { type: String, enum: ['signale', 'en_cours', 'resolu'] },
    date: { type: Date, default: Date.now },
    parId: { type: Schema.Types.ObjectId, ref: 'User' },
  }],
  auteurId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

reportSchema.index({ location: '2dsphere' });

export default model<IReport>('Report', reportSchema);