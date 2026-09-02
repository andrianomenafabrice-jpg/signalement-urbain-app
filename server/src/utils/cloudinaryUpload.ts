import cloudinary from '../config/cloudinary';
import { env } from '../config/env';

export function televerserPhoto(buffer: Buffer): Promise<string> {
  // En environnement de test, on evite un vrai appel reseau vers Cloudinary
  // (tests plus rapides, plus fiables, pas de consommation du quota gratuit).
  if (env.NODE_ENV === 'test') {
    return Promise.resolve('https://res.cloudinary.com/test/image/upload/photo-test.jpg');
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'signalurbain', resource_type: 'image' },
      (erreur, resultat) => {
        if (erreur || !resultat) {
          reject(erreur ?? new Error('Echec du televersement Cloudinary.'));
          return;
        }
        resolve(resultat.secure_url);
      }
    );
    stream.end(buffer);
  });
}