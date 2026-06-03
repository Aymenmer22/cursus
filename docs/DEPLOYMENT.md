# Guide de Déploiement - Cursus

## 🚀 Architecture de Déploiement

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│   Vercel    │────▶│   Railway    │────▶│ MongoDB      │
│  Frontend   │     │   Backend    │     │   Atlas      │
└─────────────┘     └──────────────┘     └──────────────┘
     React              Node.js           MongoDB Cloud
     Vite              Express.js
```

---

## 📋 Prérequis

- Node.js v18+
- npm ou yarn
- Compte MongoDB Atlas
- Compte Google Cloud (OAuth)
- Compte Vercel
- Compte Railway ou Render

---

## 1️⃣ MongoDB Atlas Setup

### Créer une base de données

1. **Accéder à MongoDB Atlas**: https://www.mongodb.com/cloud/atlas

2. **Créer un cluster**:
   - Choisir le plan gratuit `M0` pour développement
   - Région: `EU (Frankfurt)` ou proche de vous
   - Nommer: `cursus-db`

3. **Configurer l'accès réseau**:
   - IP Address: `0.0.0.0/0` (production: spécifier les IPs)
   - Username: `cursus_admin`
   - Password: Générer un mot de passe sécurisé

4. **Obtenir la connection string**:
   ```
   mongodb+srv://cursus_admin:PASSWORD@cursus-db.mongodb.net/cursus?retryWrites=true&w=majority
   ```

5. **Créer les collections**:
   ```javascript
   // Exécuter dans MongoDB Atlas Data Explorer
   db.createCollection("users")
   db.createCollection("programs")
   db.createCollection("calculations")
   db.createCollection("rankings")
   db.createCollection("sharedresults")
   db.createCollection("statistics")
   db.createCollection("notifications")
   
   // Créer les indexes
   db.users.createIndex({ email: 1 })
   db.programs.createIndex({ level: 1, speciality: 1 })
   // ... (voir DATABASE.md pour tous les indexes)
   ```

---

## 2️⃣ Google OAuth Setup

### Configurer Google Cloud Console

1. **Accéder à Google Cloud Console**: https://console.cloud.google.com

2. **Créer un nouveau projet**:
   - Nom: `Cursus`
   - Accepter les conditions

3. **Activer OAuth 2.0**:
   - Navigation ▶ APIs & Services ▶ OAuth consent screen
   - User type: `External`
   - Remplir les infos:
     - App name: `Cursus`
     - User support email: votre email
     - Developer contact: votre email

4. **Créer les credentials**:
   - APIs & Services ▶ Credentials ▶ Create Credentials ▶ OAuth client ID
   - Application type: `Web application`
   - Authorized redirect URIs:
     ```
     http://localhost:5173
     http://localhost:3000
     https://your-frontend.vercel.app
     https://your-backend.railway.app/api/auth/google/callback
     ```
   - Copier le `Client ID` et `Client Secret`

---

## 3️⃣ Backend Deployment (Railway)

### Préparation locale

1. **Créer un fichier `.env.production`**:
   ```
   MONGODB_URI=mongodb+srv://cursus_admin:PASSWORD@cursus-db.mongodb.net/cursus
   JWT_SECRET=your-very-secure-random-secret-key-min-32-chars
   JWT_REFRESH_SECRET=your-other-very-secure-secret-key-min-32-chars
   JWT_EXPIRE=7d
   JWT_REFRESH_EXPIRE=30d
   
   GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GOOGLE_REDIRECT_URI=https://your-backend.railway.app/api/auth/google/callback
   
   PORT=5000
   NODE_ENV=production
   API_URL=https://your-backend.railway.app
   FRONTEND_URL=https://your-frontend.vercel.app
   
   REDIS_URL=redis://default:PASSWORD@redis-server:6379
   LOG_LEVEL=info
   ```

2. **Tester localement**:
   ```bash
   cd backend
   npm install
   NODE_ENV=production npm start
   ```

### Déployer sur Railway

1. **Accéder à Railway**: https://railway.app

2. **Créer un nouveau projet**:
   - New Project ▶ GitHub Repo
   - Sélectionner le repo `cursus`

3. **Configurer le projet**:
   - Ajouter les variables d'environnement depuis `.env.production`
   - Configurer le build:
     ```
     Root Directory: backend
     Build Command: npm install
     Start Command: npm start
     ```

4. **Ajouter MongoDB Plugin**:
   - Ajouter service ▶ MongoDB
   - Variables générées automatiquement

5. **Déployer**:
   - Git push vers main/staging
   - Railway déploie automatiquement

6. **Copier l'URL du backend**:
   - Settings ▶ Domains
   - Copier l'URL générée (ex: `https://your-backend.railway.app`)

---

## 4️⃣ Frontend Deployment (Vercel)

### Préparation locale

1. **Créer un fichier `.env.production`**:
   ```
   VITE_API_URL=https://your-backend.railway.app/api
   VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   ```

2. **Builder localement**:
   ```bash
   cd frontend
   npm install
   npm run build
   npm run preview
   ```

### Déployer sur Vercel

1. **Accéder à Vercel**: https://vercel.com

2. **Importer le projet**:
   - New Project ▶ Import Git Repository
   - Sélectionner `cursus`

3. **Configurer le build**:
   - Framework: `Vite`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Ajouter les variables d'environnement**:
   - Settings ▶ Environment Variables
   - Ajouter `VITE_API_URL` et `VITE_GOOGLE_CLIENT_ID`

5. **Configurer les domaines personnalisés** (optionnel):
   - Settings ▶ Domains
   - Ajouter votre domaine

6. **Déployer**:
   - Git push vers main
   - Vercel déploie automatiquement

---

## 5️⃣ Configuration PWA

### Générer le manifest

**frontend/public/manifest.json**:
```json
{
  "name": "Cursus - Calculateur de Moyennes UDL-SBA",
  "short_name": "Cursus",
  "description": "Plateforme de calcul des moyennes universitaires",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "theme_color": "#1a1a2e",
  "background_color": "#ffffff",
  "icons": [
    {
      "src": "/logo-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/logo-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/logo-maskable.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable"
    }
  ]
}
```

### Enregistrer le service worker

**frontend/src/main.jsx**:
```javascript
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onNeedRefresh() {
    console.log('App update available!')
  },
})
```

### Configurer Vite PWA

**frontend/vite.config.js**:
```javascript
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Cursus',
        short_name: 'Cursus',
        // ... (manifest complet)
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\./,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 86400, // 24 heures
              },
            },
          },
        ],
      },
    }),
  ],
})
```

---

## 6️⃣ CI/CD Pipeline

### GitHub Actions

**`.github/workflows/deploy.yml`**:
```yaml
name: Deploy

on:
  push:
    branches: [main, staging]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: cd backend && npm install
      
      - name: Run tests
        run: cd backend && npm test
      
      - name: Deploy to Railway
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
        run: npm i -g @railway/cli && railway deploy

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@main
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: frontend
```

---

## 7️⃣ Monitoring & Maintenance

### Health Checks

Backend:
```bash
curl https://your-backend.railway.app/health
```

### Logs

**Railway**:
- Dashboard ▶ Logs

**Vercel**:
- Dashboard ▶ Analytics ▶ Web Vitals

### Backups

MongoDB Atlas gère les backups automatiquement:
- Daily snapshots
- 7-day retention (gratuit)
- Ou configurer des snapshots hebdomadaires

### Scaling

**En cas d'augmentation du trafic**:

1. **Backend**: Railway ▶ Settings ▶ Auto-scaling
   - Min instances: 1
   - Max instances: 3

2. **Database**: MongoDB ▶ Upgrade Plan
   - De `M0` à `M5` selon les besoins

3. **Frontend**: Vercel gère l'auto-scaling (gratuit)

---

## 8️⃣ SSL/TLS Certificate

Vercel et Railway incluent les certificats SSL/TLS automatiquement.

Pour un domaine personnalisé:
```
Railway: Settings ▶ Domains ▶ Add Custom Domain
Vercel: Settings ▶ Domains ▶ Add Domain
```

---

## 9️⃣ Vérification Post-Déploiement

### Checklist

- [ ] Frontend accessible sur vercel.app
- [ ] Backend accessible et healthy (`/health`)
- [ ] MongoDB connection OK
- [ ] Google OAuth fonctionne
- [ ] JWT tokens générés correctement
- [ ] Calculs de moyennes corrects
- [ ] Socket.io connecté
- [ ] PWA installable sur mobile
- [ ] Dark mode fonctionne
- [ ] Partage de résultats fonctionne
- [ ] Classement met à jour
- [ ] Notifications envoyées

### Tests Manuels

```bash
# Test Auth
curl -X POST https://api.railway.app/api/auth/anonymous \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","level":"L1","speciality":"Informatique"}'

# Test Programs
curl https://api.railway.app/api/programs/L3-ISIL/Informatique

# Test Health
curl https://api.railway.app/health
```

---

## 🔐 Sécurité Production

1. **HTTPS**: ✅ Automatique
2. **CORS**: Configuré pour Vercel uniquement
3. **Rate Limiting**: 100 req/15min par IP
4. **JWT Secret**: Changé en production
5. **MongoDB**: Authentifié, IP whitelist
6. **Secrets**: Jamais commiter `.env`
7. **HTTPS Headers**: Helmet.js activé

---

## 📞 Troubleshooting

### Erreur CORS
- Vérifier `FRONTEND_URL` dans `.env`
- Vérifier les origins dans Vercel

### Connection MongoDB échouée
- Vérifier `MONGODB_URI`
- Vérifier l'IP whitelist dans MongoDB Atlas
- Tester la connection: `mongosh "mongodb+srv://..."`

### Google OAuth ne marche pas
- Vérifier les OAuth credentials
- Vérifier les redirect URIs
- Console du navigateur pour les erreurs

### Les données ne se synchro pas
- Vérifier les logs Railway
- Vérifier le Socket.io connection
- Vérifier CORS headers

