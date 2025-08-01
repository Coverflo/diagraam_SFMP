# Documentation API Diagraam

## Base URL

- **Développement :** `http://localhost:5001/your_project_id/us-central1/api`
- **Production :** `https://us-central1-your_project_id.cloudfunctions.net/api`

## Authentification

Toutes les routes API (sauf `/health`) nécessitent un token JWT Firebase dans le header :

```
Authorization: Bearer <firebase_jwt_token>
```

## Routes disponibles

### Health Check

#### GET `/health`
Vérifier le statut de l'API.

**Réponse :**
```json
{
  "status": "OK",
  "timestamp": "2024-01-18T10:30:00.000Z",
  "service": "Diagraam API"
}
```

---

### Événements

#### GET `/events`
Récupérer tous les événements de l'utilisateur authentifié.

**Headers requis :**
- `Authorization: Bearer <token>`

**Réponse :**
```json
{
  "success": true,
  "data": [
    {
      "id": "event_id",
      "nom": "Mon Événement",
      "date": "2024-06-15",
      "description": "Description de l'événement",
      "lieu": "Paris",
      "ville": "Paris",
      "userId": "user_id",
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  ]
}
```

#### GET `/events/:id`
Récupérer un événement spécifique.

**Paramètres :**
- `id` : ID de l'événement

**Réponse :**
```json
{
  "success": true,
  "data": {
    "id": "event_id",
    "nom": "Mon Événement",
    "date": "2024-06-15",
    "description": "Description de l'événement",
    "userId": "user_id",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

#### POST `/events`
Créer un nouvel événement.

**Headers requis :**
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Body :**
```json
{
  "nom": "Nom de l'événement",
  "date": "2024-06-15",
  "description": "Description de l'événement",
  "lieu": "Lieu de l'événement",
  "ville": "Ville",
  "dateDebut": "2024-06-15T09:00:00Z",
  "dateFin": "2024-06-15T18:00:00Z"
}
```

**Réponse :**
```json
{
  "success": true,
  "data": {
    "id": "new_event_id",
    "nom": "Nom de l'événement",
    "date": "2024-06-15",
    "description": "Description de l'événement",
    "userId": "user_id",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

#### PUT `/events/:id`
Mettre à jour un événement.

**Paramètres :**
- `id` : ID de l'événement

**Headers requis :**
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Body :**
```json
{
  "nom": "Nouveau nom",
  "description": "Nouvelle description"
}
```

**Réponse :**
```json
{
  "success": true,
  "message": "Événement mis à jour"
}
```

#### DELETE `/events/:id`
Supprimer un événement et toutes ses activités associées.

**Paramètres :**
- `id` : ID de l'événement

**Headers requis :**
- `Authorization: Bearer <token>`

**Réponse :**
```json
{
  "success": true,
  "message": "Événement supprimé"
}
```

---

### Activités

#### GET `/events/:eventId/activities`
Récupérer toutes les activités d'un événement.

**Paramètres :**
- `eventId` : ID de l'événement

**Headers requis :**
- `Authorization: Bearer <token>`

**Réponse :**
```json
{
  "success": true,
  "data": [
    {
      "id": "activity_id",
      "eventId": "event_id",
      "titre": "Titre de l'activité",
      "sousTitre": "Sous-titre",
      "horaire": "09:00 - 10:30",
      "description": "Description de l'activité",
      "salle": "Salle A",
      "type": "atelier",
      "intervenants": [
        {
          "nom": "Jean Dupont",
          "titre": "Expert",
          "organisation": "Entreprise XYZ"
        }
      ],
      "capacite": 50,
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  ]
}
```

#### POST `/activities`
Créer une nouvelle activité.

**Headers requis :**
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Body :**
```json
{
  "eventId": "event_id",
  "titre": "Titre de l'activité",
  "sousTitre": "Sous-titre optionnel",
  "horaire": "09:00 - 10:30",
  "description": "Description détaillée",
  "salle": "Salle A",
  "type": "atelier",
  "intervenants": [
    {
      "nom": "Jean Dupont",
      "titre": "Expert en...",
      "organisation": "Entreprise XYZ"
    }
  ],
  "capacite": 50
}
```

**Réponse :**
```json
{
  "success": true,
  "data": {
    "id": "new_activity_id",
    "eventId": "event_id",
    "titre": "Titre de l'activité",
    "horaire": "09:00 - 10:30",
    "description": "Description détaillée",
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

---

## Codes d'erreur

### Erreurs d'authentification (401)
```json
{
  "error": "Token d'authentification requis"
}
```

```json
{
  "error": "Token invalide"
}
```

### Erreurs d'autorisation (403)
```json
{
  "error": "Accès non autorisé"
}
```

### Erreurs de validation (400)
```json
{
  "error": "Données invalides",
  "details": [
    {
      "msg": "Le nom de l'événement est requis",
      "param": "nom",
      "location": "body"
    }
  ]
}
```

### Erreurs de ressource (404)
```json
{
  "error": "Événement non trouvé"
}
```

### Erreurs serveur (500)
```json
{
  "error": "Erreur serveur"
}
```

---

## Exemples d'utilisation

### JavaScript/TypeScript

```typescript
// Configuration
const API_BASE_URL = 'https://us-central1-your-project-id.cloudfunctions.net/api';

// Fonction utilitaire pour les requêtes authentifiées
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = await firebase.auth().currentUser?.getIdToken();
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

// Exemples d'usage
const events = await apiRequest('/events');
const newEvent = await apiRequest('/events', {
  method: 'POST',
  body: JSON.stringify({
    nom: 'Mon Événement',
    date: '2024-06-15',
    description: 'Description...'
  })
});
```

### cURL

```bash
# Obtenir un token (avec Firebase CLI)
TOKEN=$(firebase auth:print-access-token)

# Récupérer les événements
curl -H "Authorization: Bearer $TOKEN" \
     https://us-central1-project-id.cloudfunctions.net/api/events

# Créer un événement
curl -X POST \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"nom":"Test Event","date":"2024-06-15","description":"Test"}' \
     https://us-central1-project-id.cloudfunctions.net/api/events
```

---

## Limites et quotas

- **Firestore :** 50,000 lectures/écritures par jour (plan gratuit)
- **Functions :** 2,000,000 invocations par mois (plan gratuit)
- **Taille requête :** Maximum 10MB
- **Timeout :** 60 secondes par requête

Pour augmenter ces limites, passer au plan Blaze de Firebase.