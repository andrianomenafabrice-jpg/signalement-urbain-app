import { createApp } from './app';
import { connectDB } from './config/db';
import { env } from './config/env';

async function start(): Promise<void> {
  await connectDB();
  const app = createApp();

  app.listen(env.PORT, () => {
    console.log(`Serveur API demarre sur http://localhost:${env.PORT}`);
  });
}

start();