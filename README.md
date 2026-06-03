# Cursus - Plateforme de Calcul des Moyennes Universitaires UDL-SBA

## 🎓 Description

Cursus est une plateforme web moderne et performante permettant aux étudiants de l'Université Djillali Liabès (UDL-SBA) de :

- 📊 Calculer automatiquement leurs moyennes
- 📈 Suivre leur progression académique
- 🏆 Se comparer aux autres étudiants
- 💾 Sauvegarder et retrouver leur historique
- 🔗 Partager leurs résultats

## 🏗️ Architecture

### Stack Technologique

**Frontend:**
- React 18+
- Vite
- Tailwind CSS
- Framer Motion
- Socket.io Client

**Backend:**
- Node.js
- Express.js
- MongoDB Atlas
- Socket.io
- JWT + Google OAuth

**Déploiement:**
- Frontend: Vercel
- Backend: Render/Railway
- Database: MongoDB Atlas

## 📁 Structure du Projet

```
cursus/
├── frontend/                 # Application React (Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── services/
│   │   ├── styles/
│   │   └── App.jsx
│   ├── public/
│   ├── vite.config.js
│   └── package.json
│
├── backend/                  # API Express.js
│   ├── src/
│   │   ├── models/           # Mongoose Schemas
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── config/
│   │   ├── utils/
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
├── docs/                     # Documentation
│   ├── API.md
│   ├── DATABASE.md
│   ├── DEPLOYMENT.md
│   └── ARCHITECTURE.md
│
└── .gitignore
```

## 🚀 Démarrage Rapide

### Prérequis
- Node.js v18+
- MongoDB Atlas Account
- Google OAuth Credentials

### Installation

```bash
# Cloner le repo
git clone https://github.com/Aymenmer22/cursus.git
cd cursus

# Backend
cd backend
npm install
cp .env.example .env
# Configurer les variables d'environnement
npm run dev

# Frontend (dans un autre terminal)
cd frontend
npm install
npm run dev
```

## 📚 Documentation

- [Architecture Détaillée](./docs/ARCHITECTURE.md)
- [Schémas Base de Données](./docs/DATABASE.md)
- [Endpoints API](./docs/API.md)
- [Guide de Déploiement](./docs/DEPLOYMENT.md)

## 👥 Niveaux Supportés

### Actuellement Implémentés
- ✅ Licence 1
- ✅ Licence 2
- ✅ Licence 3 ISIL
- ✅ Master 1
- ✅ Master 2 ISI

### À Venir
- 📋 Licence 3 SI
- 📋 Master 2 RSSI
- 📋 Cycle Ingénieur (ING1-ING5)

## 🔐 Authentification

- Google OAuth 2.0
- JWT Tokens
- Refresh Tokens
- Sessions utilisateur anonyme

## 📊 Règles de Calcul

Le système supporte :
- Examen uniquement (100%)
- TD + Examen (40% TD + 60% Examen)
- TP + Examen (40% TP + 60% Examen)
- TD + TP + Examen (20% TD + 20% TP + 60% Examen)
- TP uniquement (100%)

## 🎯 Fonctionnalités Principales

- ✨ Calcul automatique des moyennes
- 📱 Interface responsive (Mobile First)
- 🌙 Mode sombre/clair
- 💾 Historique des calculs
- 🏅 Classement de promotion
- 📊 Analyses de performance
- 🎯 Simulation et objectifs
- 🔔 Notifications intelligentes
- 🔗 Partage de résultats
- ⚡ PWA (Progressive Web App)
- 🔄 Synchronisation temps réel (Socket.io)
- 📈 Compteurs en temps réel

## 📝 Licence

MIT

## 👨‍💻 Auteur

Aymenmer22

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez consulter [CONTRIBUTING.md](./CONTRIBUTING.md)
