import mongoose from 'mongoose';
import { env } from './env';

export async function connectDB(): Promise<void> {
  mongoose.set('strictQuery', true);

  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log(`MongoDB connecte : ${mongoose.connection.host}`);
  } catch (error) {
    console.error('Echec de connexion a MongoDB :', error);
    process.exit(1);
  }

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB deconnecte.');
  });
}