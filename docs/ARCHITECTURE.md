# Cursus - Architecture et Implémentation

## 📋 Table des matières

1. [Structure du Projet](#structure-du-projet)
2. [Backend Setup](#backend-setup)
3. [Frontend Setup](#frontend-setup)
4. [Base de Données](#base-de-données)
5. [Authentification](#authentification)
6. [Calcul des Moyennes](#calcul-des-moyennes)
7. [Déploiement](#déploiement)

## 🏗️ Structure du Projet

```
cursus/
├── backend/
│   ├── src/
│   │   ├── server.js                 # Entry point
│   │   ├── config/
│   │   │   └── database.js           # MongoDB connection
│   │   ├── models/                   # Mongoose schemas
│   │   │   ├── User.js
│   │   │   ├── Program.js
│   │   │   ├── Calculation.js
│   │   │   ├── Ranking.js
│   │   │   ├── SharedResult.js
│   │   │   └── Statistics.js
│   │   ├── controllers/              # Business logic
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   ├── calculationController.js
│   │   │   ├── programController.js
│   │   │   ├── rankingController.js
│   │   │   └── statisticsController.js
│   │   ├── routes/                   # API endpoints
│   │   │   ├── auth.js
│   │   │   ├── users.js
│   │   │   ├── calculations.js
│   │   │   ├── programs.js
│   │   │   ├── rankings.js
│   │   │   └── statistics.js
│   │   ├── middleware/
│   │   │   ├── auth.js               # JWT validation
│   │   │   ├── errorHandler.js
│   │   │   ├── logger.js
│   │   │   └── rateLimiter.js
│   │   ├── services/                 # Utility functions
│   │   │   ├── calculationService.js
│   │   │   ├── rankingService.js
│   │   │   └── notificationService.js
│   │   └── utils/
│   │       ├── validators.js
│   │       └── constants.js
│   ├── .env.example
│   ├── package.json
│   └── jest.config.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   ├── Dashboard/
│   │   │   ├── Calculator/
│   │   │   ├── Ranking/
│   │   │   └── Shared/
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── CalculatorPage.jsx
│   │   │   ├── RankingPage.jsx
│   │   │   ├── HistoryPage.jsx
│   │   │   └── ProfilePage.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useCalculation.js
│   │   │   └── useSocket.js
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── socket.js
│   │   ├── styles/
│   │   │   ├── tailwind.config.js
│   │   │   └── globals.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   │   └── manifest.json             # PWA manifest
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
│
├── docs/
│   ├── API.md                        # API endpoints
│   ├── DATABASE.md                   # Database schema
│   ├── ARCHITECTURE.md               # Detailed architecture
│   ├── DEPLOYMENT.md                 # Deployment guide
│   └── CONTRIBUTING.md               # Contributing guidelines
│
├── .gitignore
├── README.md
└── package.json                      # Root workspace
```

## 🔧 Backend Setup

### Installation

```bash
cd backend
npm install
```

### Fichiers clés à créer

**backend/src/server.js:**
```javascript
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database.js';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Routes
app.get('/health', (req, res) => res.json({ status: 'OK' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
```

**backend/src/config/database.js:**
```javascript
import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ DB Error:', error);
    process.exit(1);
  }
};
```

### Modèles à créer

Tous les modèles doivent être implémentés dans `backend/src/models/`:

- **User.js** - Profil utilisateur
- **Program.js** - Programmes académiques par niveau/spécialité
- **Calculation.js** - Historique des calculs
- **Ranking.js** - Classement des étudiants
- **SharedResult.js** - Résultats partagés
- **Statistics.js** - Statistiques globales

### Controllers à créer

Tous les controllers doivent être dans `backend/src/controllers/`:

- **authController.js** - Google OAuth, login anonyme, refresh tokens
- **userController.js** - Profil utilisateur
- **calculationController.js** - CRUD des calculs
- **programController.js** - Récupération des programmes
- **rankingController.js** - Classements
- **statisticsController.js** - Stats globales

## 🎨 Frontend Setup

### Installation

```bash
cd frontend
npm install
```

### Configuration Vite

**frontend/vite.config.js:**
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
})
```

### Structure des composants

- **pages/** - Pages principales (HomePage, CalculatorPage, etc.)
- **components/** - Composants réutilisables
- **hooks/** - Custom hooks (useAuth, useCalculation)
- **context/** - Context API (Auth, Theme)
- **services/** - API calls, WebSocket

## 💾 Base de Données

### Collections MongoDB

**Users:**
```javascript
{
  email: String,
  firstName: String,
  lastName: String,
  level: String,          // L1, L2, L3-ISIL, M1, M2-ISI
  speciality: String,
  googleId: String,
  isAnonymous: Boolean,
  createdAt: Date
}
```

**Programs:**
```javascript
{
  level: String,
  speciality: String,
  semesters: [{
    semesterNumber: Number,
    modules: [{
      name: String,
      coefficient: Number,
      evaluationType: String  // exam, td+exam, tp+exam, etc.
    }]
  }]
}
```

**Calculations:**
```javascript
{
  userId: ObjectId,
  level: String,
  speciality: String,
  semesterNumber: Number,
  grades: [{
    moduleName: String,
    td: Number,
    tp: Number,
    exam: Number,
    moduleGrade: Number,
    coefficient: Number
  }],
  semesterGrade: Number,
  yearGrade: Number,
  isSaved: Boolean,
  createdAt: Date
}
```

## 🔐 Authentification

### Google OAuth Flow

1. **Frontend**: Utilise Google Sign-In SDK
2. **Backend**: Valide le token avec Google API
3. **Response**: JWT + Refresh Token

### Tokens

- **Access Token** - Court terme (7 jours)
- **Refresh Token** - Long terme (30 jours)

## 📊 Calcul des Moyennes

### Formules

**Cas 1: TD + Examen**
```
Moyenne = 40% TD + 60% Examen
```

**Cas 2: TP + Examen**
```
Moyenne = 40% TP + 60% Examen
```

**Cas 3: TD + TP + Examen**
```
Moyenne = 20% TD + 20% TP + 60% Examen
```

**Moyenne Semestrielle:**
```
Σ(Note Module × Coefficient) / Σ(Coefficients)
```

**Moyenne Annuelle:**
```
(Moyenne S1 + Moyenne S2) / 2
```

## 🚀 Déploiement

### Variables d'environnement

**Backend (.env):**
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret
GOOGLE_CLIENT_ID=your-id
PORT=5000
FRONTEND_URL=https://your-frontend.com
```

**Frontend (.env):**
```
VITE_API_URL=https://your-backend.com/api
VITE_GOOGLE_CLIENT_ID=your-id
```

### Production

**Frontend**: Vercel
```bash
npm run build
# Deploy dist/ folder
```

**Backend**: Render/Railway
```bash
npm start
```

**Database**: MongoDB Atlas

## 📝 Prochaines étapes

1. ✅ Créer tous les modèles Mongoose
2. ✅ Implémenter les controllers
3. ✅ Configurer les routes
4. ✅ Frontend avec React
5. ✅ Intégration Socket.io
6. ✅ Tests unitaires
7. ✅ Déploiement

## 📚 Documentation complète

Voir les fichiers dans `/docs`:
- `API.md` - Endpoints détaillés
- `DATABASE.md` - Schémas complets
- `DEPLOYMENT.md` - Guide de déploiement
