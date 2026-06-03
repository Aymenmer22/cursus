# API Documentation - Cursus

## 🔑 Authentication Endpoints

### POST /api/auth/google
Authentifier avec Google OAuth

**Request Body:**
```json
{
  "token": "google-access-token"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "level": "L3-ISIL",
      "speciality": "Informatique"
    },
    "accessToken": "jwt-token",
    "refreshToken": "refresh-token"
  }
}
```

### POST /api/auth/anonymous
Créer une session anonyme

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "level": "L1",
  "speciality": "Informatique",
  "group": "Groupe 1"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "session-id",
      "firstName": "John",
      "lastName": "Doe",
      "level": "L1",
      "isAnonymous": true,
      "sessionId": "session-id"
    }
  }
}
```

### POST /api/auth/refresh
Renouveler le token d'accès

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "refreshToken": "refresh-token"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "new-jwt-token",
    "refreshToken": "new-refresh-token"
  }
}
```

### GET /api/auth/me
Obtenir l'utilisateur actuel

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { /* user object */ }
  }
}
```

---

## 👤 User Endpoints

### GET /api/users/profile
Récupérer le profil utilisateur

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "level": "L3-ISIL",
      "speciality": "Informatique",
      "group": "Groupe 1"
    }
  }
}
```

### PUT /api/users/profile
Mettre à jour le profil

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "level": "M1",
  "group": "Groupe 2"
}
```

---

## 📊 Calculation Endpoints

### POST /api/calculations
Créer un nouveau calcul

**Request Body:**
```json
{
  "level": "L3-ISIL",
  "speciality": "Informatique",
  "semesterNumber": 1,
  "grades": [
    {
      "moduleName": "Sécurité Informatique",
      "moduleCode": "SEC-301",
      "coefficient": 3,
      "evaluationType": "td+exam",
      "td": 12,
      "exam": 14
    },
    {
      "moduleName": "Recherche d'Information",
      "moduleCode": "RI-301",
      "coefficient": 3,
      "evaluationType": "td+exam",
      "td": 13,
      "exam": 15
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "calculation": {
      "id": "calc-id",
      "userId": "user-id",
      "level": "L3-ISIL",
      "semesterNumber": 1,
      "grades": [ /* grades */ ],
      "semesterGrade": 14.2,
      "yearGrade": 0,
      "validatedModules": 2,
      "failedModules": 0,
      "isSaved": false,
      "createdAt": "2026-06-03T13:45:00Z"
    }
  }
}
```

### GET /api/calculations/:id
Récupérer un calcul spécifique

**Response:**
```json
{
  "success": true,
  "data": {
    "calculation": { /* calculation object */ }
  }
}
```

### POST /api/calculations/:id/save
Sauvegarder un calcul (authentifiés uniquement)

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request Body:**
```json
{
  "savedName": "Mon calcul du semestre 5"
}
```

### GET /api/calculations/history/all
Récupérer l'historique des calculs

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Query Parameters:**
- `limit` (default: 20)
- `page` (default: 1)
- `sortBy` (default: createdAt)

**Response:**
```json
{
  "success": true,
  "data": {
    "calculations": [ /* array of calculations */ ],
    "total": 15,
    "page": 1,
    "pages": 1
  }
}
```

### PUT /api/calculations/:id
Mettre à jour un calcul

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request Body:** (pareil que POST)

### DELETE /api/calculations/:id
Supprimer un calcul

**Headers:**
```
Authorization: Bearer {accessToken}
```

### POST /api/calculations/:id/duplicate
Dupliquer un calcul

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response:** Retourne le nouveau calcul dupliqué

---

## 📚 Program Endpoints

### GET /api/programs
Récupérer tous les programmes

**Query Parameters:**
- `level` (optional): L1, L2, L3-ISIL, L3-SI, M1, M2-ISI, M2-RSSI
- `speciality` (optional): Informatique, etc.

**Response:**
```json
{
  "success": true,
  "data": {
    "programs": [
      {
        "id": "prog-id",
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
                "evaluationType": "td+exam"
              }
            ]
          }
        ]
      }
    ]
  }
}
```

### GET /api/programs/:level/:speciality
Récupérer un programme spécifique

**Response:** (pareil que GET /api/programs avec un seul programme)

### GET /api/programs/:level/:speciality/semesters
Récupérer les semestres d'un programme

**Response:**
```json
{
  "success": true,
  "data": {
    "semesters": [
      {
        "semesterNumber": 5,
        "modules": [ /* modules */ ]
      },
      {
        "semesterNumber": 6,
        "modules": [ /* modules */ ]
      }
    ]
  }
}
```

---

## 🏆 Ranking Endpoints

### GET /api/rankings/:level/:speciality
Récupérer le classement par niveau/spécialité

**Query Parameters:**
- `limit` (default: 50)
- `page` (default: 1)

**Response:**
```json
{
  "success": true,
  "data": {
    "ranking": [
      {
        "rank": 1,
        "userId": "user-id",
        "firstName": "John",
        "lastName": "Doe",
        "averageGrade": 15.8,
        "percentile": 95
      }
    ],
    "total": 120
  }
}
```

### GET /api/rankings/:level/:speciality/position
Obtenir la position de l'utilisateur actuel

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "position": {
      "rank": 15,
      "totalStudents": 120,
      "averageGrade": 14.2,
      "percentile": 87,
      "averageGroupGrade": 13.5
    }
  }
}
```

### GET /api/rankings/:level/:speciality/percentiles
Récupérer les percentiles

**Response:**
```json
{
  "success": true,
  "data": {
    "percentiles": {
      "top10": 16.0,
      "top25": 15.2,
      "top50": 13.8,
      "average": 12.5,
      "minimum": 8.0
    }
  }
}
```

---

## 📈 Statistics Endpoints

### GET /api/statistics/global/overview
Obtenir les statistiques globales

**Response:**
```json
{
  "success": true,
  "data": {
    "statistics": {
      "totalUsers": 5432,
      "activeUsers": 234,
      "authenticatedUsers": 2100,
      "anonymousUsers": 3332,
      "totalCalculations": 15642,
      "averageGrade": 13.2,
      "levelDistribution": {
        "L1": 1200,
        "L2": 1100,
        "L3ISIL": 900,
        "M1": 800,
        "M2ISI": 432
      }
    }
  }
}
```

### GET /api/statistics/users/active
Obtenir le nombre d'utilisateurs actifs (temps réel)

**Response:**
```json
{
  "success": true,
  "data": {
    "activeUsers": 234,
    "timestamp": "2026-06-03T13:45:00Z"
  }
}
```

### GET /api/statistics/level/:level
Obtenir les statistiques par niveau

**Response:**
```json
{
  "success": true,
  "data": {
    "levelStats": {
      "totalStudents": 900,
      "averageGrade": 13.8,
      "specialities": [
        {
          "name": "Informatique",
          "students": 450,
          "averageGrade": 14.2
        }
      ]
    }
  }
}
```

---

## 🔗 Share Endpoints

### POST /api/calculations/:id/share
Créer un lien de partage

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "shareUrl": "https://cursus.app/share/abc123def456",
    "shareToken": "abc123def456",
    "expiresAt": "2026-07-03T13:45:00Z"
  }
}
```

### GET /api/share/:token
Accéder à un résultat partagé

**Response:**
```json
{
  "success": true,
  "data": {
    "result": {
      "level": "L3-ISIL",
      "speciality": "Informatique",
      "semesterGrade": 14.2,
      "grades": [ /* sans détails sensibles */ ]
    }
  }
}
```

---

## ⚠️ Error Responses

Tous les endpoints retournent cette structure en cas d'erreur:

```json
{
  "success": false,
  "error": {
    "message": "Description de l'erreur",
    "statusCode": 400
  }
}
```

**Status Codes:**
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## 🔐 Authentication

Tous les endpoints protégés nécessitent:

```
Authorization: Bearer {accessToken}
```

Pour obtenir un token:
1. POST `/api/auth/google` ou `/api/auth/anonymous`
2. Recevoir `accessToken` et `refreshToken`
3. Inclure `accessToken` dans le header `Authorization`

Pour renouveler:
1. POST `/api/auth/refresh` avec `refreshToken`
2. Recevoir un nouveau `accessToken`
