import request from 'supertest';
import { createApp } from '../../app';
import { connecterDbTest, viderDbTest, fermerDbTest } from './testDb';

const app = createApp();

beforeAll(async () => {
  await connecterDbTest();
});

afterEach(async () => {
  await viderDbTest();
});

afterAll(async () => {
  await fermerDbTest();
});

describe('POST /api/auth/register', () => {
  const utilisateur = { nom: 'Test User', email: 'test@integration.mg', motDePasse: 'motdepasse123' };

  it('cree un compte et renvoie un accessToken', async () => {
    const res = await request(app).post('/api/auth/register').send(utilisateur);
    expect(res.status).toBe(201);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.user.email).toBe(utilisateur.email);
  });

  it('refuse un email deja utilise', async () => {
    await request(app).post('/api/auth/register').send(utilisateur);
    const res = await request(app).post('/api/auth/register').send(utilisateur);
    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('EMAIL_DEJA_UTILISE');
  });
});

describe('POST /api/auth/login', () => {
  const utilisateur = { nom: 'Test User', email: 'login@integration.mg', motDePasse: 'motdepasse123' };

  beforeEach(async () => {
    await request(app).post('/api/auth/register').send(utilisateur);
  });

  it('connecte avec les bons identifiants', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: utilisateur.email, motDePasse: utilisateur.motDePasse });
    expect(res.status).toBe(200);
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('refuse un mauvais mot de passe', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: utilisateur.email, motDePasse: 'faux' });
    expect(res.status).toBe(401);
  });
});