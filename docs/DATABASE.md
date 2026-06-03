# Base de Données - Schémas MongoDB

## 📋 Collections Overview

```
Users              - Profils utilisateurs
Programs           - Programmes académiques
Calculations       - Calculs et historique
Rankings           - Classement des étudiants
SharedResults      - Résultats partagés
Statistics         - Statistiques globales
Notifications      - Notifications utilisateurs
```

---

## 👤 Collection: Users

Stocke les informations des utilisateurs

**Schema:**
```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  firstName: String (required),
  lastName: String (required),
  avatar: String, // URL photo
  level: String (enum: L1, L2, L3-ISIL, L3-SI, M1, M2-ISI, M2-RSSI),
  speciality: String,
  group: String,
  googleId: String (unique, sparse),
  isAnonymous: Boolean (default: false),
  sessionId: String, // pour utilisateurs anonymes
  lastLogin: Date,
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

**Indexes:**
```javascript
db.users.createIndex({ email: 1 })
db.users.createIndex({ googleId: 1 }, { sparse: true })
db.users.createIndex({ level: 1, speciality: 1 })
```

**Exemple:**
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439011"),
  "email": "john.doe@univ.dz",
  "firstName": "John",
  "lastName": "Doe",
  "avatar": "https://lh3.googleusercontent.com/...",
  "level": "L3-ISIL",
  "speciality": "Informatique",
  "group": "Groupe 1",
  "googleId": "123456789",
  "isAnonymous": false,
  "lastLogin": ISODate("2026-06-03T13:45:00Z"),
  "createdAt": ISODate("2026-05-15T10:30:00Z"),
  "updatedAt": ISODate("2026-06-03T13:45:00Z")
}
```

---

## 📚 Collection: Programs

Stocke les programmes académiques par niveau et spécialité

**Schema:**
```javascript
{
  _id: ObjectId,
  level: String (enum: L1, L2, L3-ISIL, L3-SI, M1, M2-ISI, M2-RSSI),
  speciality: String,
  semesters: [{
    semesterNumber: Number (1-10),
    modules: [{
      name: String (required),
      code: String (required, unique per semester),
      coefficient: Number (required),
      evaluationType: String (enum: exam, td, tp, td+exam, tp+exam, td+tp+exam, tp-only),
      credits: Number (default: 0)
    }]
  }],
  totalCredits: Number,
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

**Indexes:**
```javascript
db.programs.createIndex({ level: 1, speciality: 1 }, { unique: true })
db.programs.createIndex({ "semesters.semesterNumber": 1 })
```

**Exemple (L3-ISIL Semestre 5):**
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439012"),
  "level": "L3-ISIL",
  "speciality": "Informatique",
  "semesters": [
    {
      "semesterNumber": 5,
      "modules": [
        {
          "name": "Sécurité Informatique",
          "code": "SEC-301",
          "coefficient": 3,
          "evaluationType": "td+exam",
          "credits": 3
        },
        {
          "name": "Recherche d'Information",
          "code": "RI-301",
          "coefficient": 3,
          "evaluationType": "td+exam",
          "credits": 3
        }
      ]
    },
    {
      "semesterNumber": 6,
      "modules": [ /* ... */ ]
    }
  ],
  "totalCredits": 60,
  "createdAt": ISODate("2026-01-01T00:00:00Z"),
  "updatedAt": ISODate("2026-01-01T00:00:00Z")
}
```

---

## 📊 Collection: Calculations

Stocke l'historique des calculs de moyennes

**Schema:**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, required),
  sessionId: String, // pour utilisateurs anonymes
  level: String (required),
  speciality: String (required),
  semesterNumber: Number (required),
  grades: [{
    moduleName: String,
    moduleCode: String,
    evaluationType: String,
    td: Number,
    tp: Number,
    exam: Number,
    moduleGrade: Number, // calculé
    coefficient: Number
  }],
  semesterGrade: Number, // moyenne semestrielle
  yearGrade: Number, // moyenne annuelle (si disponible)
  validatedModules: Number, // nombre de modules >= 10
  failedModules: Number, // nombre de modules < 10
  isSaved: Boolean (default: false),
  savedName: String, // nom personalisé du calcul
  isPublic: Boolean (default: false),
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

**Indexes:**
```javascript
db.calculations.createIndex({ userId: 1, createdAt: -1 })
db.calculations.createIndex({ sessionId: 1, createdAt: -1 })
db.calculations.createIndex({ level: 1, speciality: 1 })
db.calculations.createIndex({ isSaved: 1 })
```

**Exemple:**
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439013"),
  "userId": ObjectId("507f1f77bcf86cd799439011"),
  "level": "L3-ISIL",
  "speciality": "Informatique",
  "semesterNumber": 5,
  "grades": [
    {
      "moduleName": "Sécurité Informatique",
      "moduleCode": "SEC-301",
      "evaluationType": "td+exam",
      "td": 12,
      "exam": 14,
      "moduleGrade": 13.2,
      "coefficient": 3
    }
  ],
  "semesterGrade": 14.2,
  "validatedModules": 5,
  "failedModules": 0,
  "isSaved": true,
  "savedName": "Semestre 5 - Essai 1",
  "createdAt": ISODate("2026-06-03T13:45:00Z"),
  "updatedAt": ISODate("2026-06-03T13:45:00Z")
}
```

---

## 🏆 Collection: Rankings

Stocke le classement des étudiants par niveau/spécialité

**Schema:**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, required),
  level: String (required),
  speciality: String (required),
  averageGrade: Number (required),
  rank: Number, // position dans le classement
  totalStudents: Number, // nombre total d'étudiants au même niveau
  percentile: Number, // 0-100
  lastUpdated: Date (default: Date.now)
}
```

**Indexes:**
```javascript
db.rankings.createIndex({ level: 1, speciality: 1, averageGrade: -1 })
db.rankings.createIndex({ userId: 1, level: 1, speciality: 1 }, { unique: true })
db.rankings.createIndex({ rank: 1 })
```

**Exemple:**
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439014"),
  "userId": ObjectId("507f1f77bcf86cd799439011"),
  "level": "L3-ISIL",
  "speciality": "Informatique",
  "averageGrade": 14.8,
  "rank": 5,
  "totalStudents": 120,
  "percentile": 96,
  "lastUpdated": ISODate("2026-06-03T13:45:00Z")
}
```

---

## 🔗 Collection: SharedResults

Stocke les résultats partagés publiquement

**Schema:**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, required),
  calculationId: ObjectId (ref: Calculation, required),
  shareToken: String (unique, required),
  level: String (required),
  speciality: String (required),
  semesterGrade: Number,
  yearGrade: Number,
  grades: Array, // sans détails sensibles
  expiresAt: Date, // expiration du lien (30 jours par défaut)
  viewCount: Number (default: 0),
  createdAt: Date (default: Date.now)
}
```

**Indexes:**
```javascript
db.sharedresults.createIndex({ shareToken: 1 }, { unique: true })
db.sharedresults.createIndex({ userId: 1 })
db.sharedresults.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
```

**Exemple:**
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439015"),
  "userId": ObjectId("507f1f77bcf86cd799439011"),
  "calculationId": ObjectId("507f1f77bcf86cd799439013"),
  "shareToken": "abc123def456xyz789",
  "level": "L3-ISIL",
  "speciality": "Informatique",
  "semesterGrade": 14.2,
  "grades": [ /* grades publics seulement */ ],
  "expiresAt": ISODate("2026-07-03T13:45:00Z"),
  "viewCount": 42,
  "createdAt": ISODate("2026-06-03T13:45:00Z")
}
```

---

## 📈 Collection: Statistics

Stocke les statistiques globales du système

**Schema:**
```javascript
{
  _id: ObjectId,
  totalUsers: Number (default: 0),
  activeUsers: Number (default: 0),
  authenticatedUsers: Number (default: 0),
  anonymousUsers: Number (default: 0),
  totalCalculations: Number (default: 0),
  levelDistribution: {
    L1: Number,
    L2: Number,
    L3ISIL: Number,
    L3SI: Number,
    M1: Number,
    M2ISI: Number,
    M2RSSI: Number
  },
  averageGrade: Number (default: 0),
  updatedAt: Date (default: Date.now)
}
```

**Exemple:**
```json
{
  "_id": ObjectId("507f1f77bcf86cd799439016"),
  "totalUsers": 5432,
  "activeUsers": 234,
  "authenticatedUsers": 2100,
  "anonymousUsers": 3332,
  "totalCalculations": 15642,
  "levelDistribution": {
    "L1": 1200,
    "L2": 1100,
    "L3ISIL": 900,
    "L3SI": 0,
    "M1": 800,
    "M2ISI": 432,
    "M2RSSI": 0
  },
  "averageGrade": 13.2,
  "updatedAt": ISODate("2026-06-03T14:00:00Z")
}
```

---

## 🔔 Collection: Notifications

Stocke les notifications utilisateurs

**Schema:**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, required),
  type: String (enum: grade_increased, module_failed, ranking_update, validation, achievement),
  title: String,
  message: String,
  data: Object, // données contextuelles
  read: Boolean (default: false),
  createdAt: Date (default: Date.now),
  expiresAt: Date // auto-delete après 30 jours
}
```

**Indexes:**
```javascript
db.notifications.createIndex({ userId: 1, createdAt: -1 })
db.notifications.createIndex({ read: 1 })
db.notifications.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
```

---

## 🔄 Aggregation Examples

### Obtenir le classement par niveau/spécialité

```javascript
db.rankings.aggregate([
  { $match: { level: "L3-ISIL", speciality: "Informatique" } },
  { $sort: { averageGrade: -1 } },
  { $limit: 50 },
  { $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "user"
    }
  }
])
```

### Calculer les statistiques par niveau

```javascript
db.calculations.aggregate([
  { $match: { level: "L3-ISIL" } },
  { $group: {
      _id: "$speciality",
      avgGrade: { $avg: "$semesterGrade" },
      count: { $sum: 1 }
    }
  },
  { $sort: { avgGrade: -1 } }
])
```

### Obtenir les utilisateurs actifs

```javascript
db.calculations.aggregate([
  { $match: {
      createdAt: { $gte: new Date(Date.now() - 24*60*60*1000) }
    }
  },
  { $group: {
      _id: "$userId",
      count: { $sum: 1 }
    }
  },
  { $count: "activeUsers" }
])
```

---

## 🚀 Seed Data

Pour tester, insérer les programmes académiques:

```javascript
// Créer le programme L3-ISIL
db.programs.insertOne({
  level: "L3-ISIL",
  speciality: "Informatique",
  semesters: [
    {
      semesterNumber: 5,
      modules: [
        {
          name: "Sécurité Informatique",
          code: "SEC-301",
          coefficient: 3,
          evaluationType: "td+exam",
          credits: 3
        },
        // ... autres modules
      ]
    },
    {
      semesterNumber: 6,
      modules: [ /* ... */ ]
    }
  ],
  totalCredits: 60
})
```

