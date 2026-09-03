# SignalUrbain

Plateforme citoyenne de signalement de problèmes urbains (voirie, éclairage, déchets, eau) avec géolocalisation, carte interactive et suivi de statut.

## Stack

- **Backend** : Node.js, Express, TypeScript, MongoDB Atlas (Mongoose), JWT, Zod, Multer, Nodemailer
- **Frontend** : React, Vite, TypeScript, Leaflet, TanStack Query, Zustand, Tailwind CSS

## Installation

### Prérequis
- Node.js ≥ 18
- Un cluster MongoDB Atlas (M0 gratuit)

### Backend
```bash
cd server
cp .env.example .env   # renseigne MONGODB_URI et les secrets JWT
npm install
npm run dev
```

### Frontend
```bash
cd client
cp .env.example .env
npm install
npm run dev
```

API sur http://localhost:4000, frontend sur http://localhost:5173.

## Statut du projet

- [ ] Phase 1 — Setup monorepo, connexion MongoDB Atlas, tokens de design
- [ ] Phase 2 — Modèles Mongoose + authentification
- [ ] Phase 3 — Logique de transition de statut + API REST signalements
- [ ] Phase 4 — Formulaire de création + carte interactive
- [ ] Phase 5 — Suivi des signalements côté citoyen
- [ ] Phase 6 — Dashboard admin
- [ ] Phase 7 — Notifications email
- [ ] Phase 8 — Tests d'intégration, déploiement
