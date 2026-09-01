import fs from 'fs';
import path from 'path';
import { createApp } from './app';
import { connectDB } from './config/db';
import { env } from './config/env';

async function start(): Promise<void> {
  const dossierUploads = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(dossierUploads)) {
    fs.mkdirSync(dossierUploads, { recursive: true });
  }

  await connectDB();
  const app = createApp();

  app.listen(env.PORT, () => {
    console.log(`Serveur API demarre sur http://localhost:${env.PORT}`);
  });
}

start();