import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod: MongoMemoryServer | null = null;

export async function connecterDbTest(): Promise<void> {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
}

export async function viderDbTest(): Promise<void> {
  const collections = mongoose.connection.collections;
  for (const nom in collections) {
    await collections[nom].deleteMany({});
  }
}

export async function fermerDbTest(): Promise<void> {
  const { fermerTransporteurEmail } = await import('../../services/email.service');
  fermerTransporteurEmail();
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  if (mongod) await mongod.stop();
}