import request from 'supertest';
import { createApp } from '../../app';
import { connecterDbTest, viderDbTest, fermerDbTest } from './testDb';
import User from '../../models/User';

const app = createApp();

const PNG_1X1 = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  'base64'
);

beforeAll(async () => {
  await connecterDbTest();
});

afterEach(async () => {
  await viderDbTest();
});

afterAll(async () => {
  await fermerDbTest();
});

async function creerUtilisateurEtObtenirToken(role: 'citoyen' | 'admin' = 'citoyen'): Promise<string> {
  const email = `${role}-${Date.now()}@integration.mg`;
  const inscription = await request(app)
    .post('/api/auth/register')
    .send({ nom: 'Test', email, motDePasse: 'motdepasse123' });

  if (role === 'admin') {
    await User.findByIdAndUpdate(inscription.body.user.id, { role: 'admin' });
    const connexion = await request(app).post('/api/auth/login').send({ email, motDePasse: 'motdepasse123' });
    return connexion.body.accessToken as string;
  }

  return inscription.body.accessToken as string;
}

describe('POST /api/reports', () => {
  it('refuse la creation sans authentification', async () => {
    const res = await request(app)
      .post('/api/reports')
      .field('titre', 'Test')
      .field('description', 'Une description assez longue.')
      .field('categorie', 'voirie')
      .field('latitude', '-18.87')
      .field('longitude', '47.5');
    expect(res.status).toBe(401);
  });

  it('refuse la creation sans photo', async () => {
    const token = await creerUtilisateurEtObtenirToken();
    const res = await request(app)
      .post('/api/reports')
      .set('Authorization', `Bearer ${token}`)
      .field('titre', 'Test sans photo')
      .field('description', 'Une description assez longue.')
      .field('categorie', 'voirie')
      .field('latitude', '-18.87')
      .field('longitude', '47.5');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('PHOTO_REQUISE');
  });

  it('cree un signalement avec une photo valide', async () => {
    const token = await creerUtilisateurEtObtenirToken();
    const res = await request(app)
      .post('/api/reports')
      .set('Authorization', `Bearer ${token}`)
      .field('titre', 'Nid de poule test')
      .field('description', 'Une description assez longue pour passer la validation.')
      .field('categorie', 'voirie')
      .field('latitude', '-18.87')
      .field('longitude', '47.5')
      .attach('photo', PNG_1X1, 'test.png');

    expect(res.status).toBe(201);
    expect(res.body.signalement.statut).toBe('signale');
  });
});

describe('PATCH /api/reports/:id/statut', () => {
  it('refuse le changement de statut pour un citoyen', async () => {
    const tokenCitoyen = await creerUtilisateurEtObtenirToken();
    const creation = await request(app)
      .post('/api/reports')
      .set('Authorization', `Bearer ${tokenCitoyen}`)
      .field('titre', 'Test statut')
      .field('description', 'Une description assez longue pour passer la validation.')
      .field('categorie', 'eau')
      .field('latitude', '-18.87')
      .field('longitude', '47.5')
      .attach('photo', PNG_1X1, 'test.png');

    const res = await request(app)
      .patch(`/api/reports/${creation.body.signalement._id}/statut`)
      .set('Authorization', `Bearer ${tokenCitoyen}`)
      .send({ statut: 'en_cours' });

    expect(res.status).toBe(403);
  });

  it('autorise un admin a changer le statut', async () => {
    const tokenCitoyen = await creerUtilisateurEtObtenirToken();
    const tokenAdmin = await creerUtilisateurEtObtenirToken('admin');

    const creation = await request(app)
      .post('/api/reports')
      .set('Authorization', `Bearer ${tokenCitoyen}`)
      .field('titre', 'Test statut admin')
      .field('description', 'Une description assez longue pour passer la validation.')
      .field('categorie', 'eau')
      .field('latitude', '-18.87')
      .field('longitude', '47.5')
      .attach('photo', PNG_1X1, 'test.png');

    const res = await request(app)
      .patch(`/api/reports/${creation.body.signalement._id}/statut`)
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({ statut: 'en_cours' });

    expect(res.status).toBe(200);
    expect(res.body.signalement.statut).toBe('en_cours');
  });
});