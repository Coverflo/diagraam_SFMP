# Guide d'Installation Diagraam MVP

## Prérequis

- Node.js (version 18 ou supérieure)
- npm ou yarn
- Compte Firebase
- Git

## 1. Configuration Firebase

### Créer un projet Firebase

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Cliquez "Ajouter un projet"
3. Suivez les étapes de création
4. Activez les services suivants :
   - Authentication (Email/Password)
   - Firestore Database
   - Functions

### Configuration Authentication

1. Dans Firebase Console > Authentication > Sign-in method
2. Activez "Email/Password"
3. Configurez les domaines autorisés

### Configuration Firestore

1. Dans Firebase Console > Firestore Database
2. Créez une base de données en mode test
3. Les règles de sécurité seront déployées automatiquement

## 2. Installation du projet

### Cloner et installer les dépendances

```bash
# Cloner le projet
git clone [URL_DU_REPO]
cd diagraam-mvp

# Installer les dépendances frontend
npm install

# Installer Firebase CLI
npm install -g firebase-tools

# Se connecter à Firebase
firebase login

# Initialiser Firebase dans le projet
firebase init

# Sélectionner :
# - Functions (avec TypeScript)
# - Firestore 
# - Hosting

# Installer les dépendances backend
cd backend
npm install
cd ..
```

### Configuration des variables d'environnement

```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer .env avec vos clés Firebase
```

Récupérer les clés depuis Firebase Console > Paramètres du projet > Configuration :

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 3. Développement local

### Démarrer les émulateurs Firebase

```bash
# Terminal 1 - Émulateurs Firebase
firebase emulators:start
```

### Démarrer le frontend

```bash
# Terminal 2 - Frontend React
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

Les émulateurs Firebase seront sur :
- Auth: `http://localhost:9099`
- Firestore: `http://localhost:8080`
- Functions: `http://localhost:5001`

## 4. Déploiement en production

### Préparer le build

```bash
# Build du frontend
npm run build

# Build du backend
cd backend
npm run build
cd ..
```

### Déployer sur Firebase

```bash
# Déployer tout (hosting + functions + rules)
firebase deploy

# Ou déployer individuellement :
firebase deploy --only hosting
firebase deploy --only functions
firebase deploy --only firestore:rules
```

### Configuration du domaine personnalisé

1. Firebase Console > Hosting
2. Ajouter un domaine personnalisé
3. Suivre les instructions DNS

## 5. Scripts utiles

```bash
# Développement
npm run dev                    # Frontend en mode dev
firebase emulators:start       # Émulateurs Firebase

# Production
npm run build                  # Build frontend
firebase deploy               # Déploiement complet

# Maintenance
firebase functions:log        # Logs des fonctions
firebase firestore:delete --all-collections  # Reset DB (attention!)
```

## 6. Structure des données

### Collections Firestore

```
users/
  {userId}/
    - id: string
    - email: string
    - nom: string
    - prenom?: string
    - createdAt: timestamp

events/
  {eventId}/
    - id: string
    - nom: string
    - date: string
    - description: string
    - userId: string
    - createdAt: timestamp
    - updatedAt: timestamp

activities/
  {activityId}/
    - id: string
    - eventId: string
    - titre: string
    - horaire: string
    - description: string
    - createdAt: timestamp
    - updatedAt: timestamp
```

## 7. Dépannage

### Erreurs communes

**"Firebase project not found"**
```bash
firebase use --add
# Sélectionner votre projet
```

**"Permission denied" sur Firestore**
- Vérifier les règles de sécurité
- S'assurer que l'utilisateur est authentifié

**Build frontend échoue**
```bash
# Nettoyer le cache
rm -rf node_modules
npm install
```

**Functions deployment échoue**
```bash
cd backend
npm run build
firebase deploy --only functions
```

### Logs et debugging

```bash
# Logs des fonctions
firebase functions:log

# Debug des émulateurs
firebase emulators:start --debug

# Logs du frontend
# Ouvrir la console développeur du navigateur
```

## 8. Sécurité

### Variables d'environnement

- Ne jamais commiter le fichier `.env`
- Utiliser Firebase Config pour les clés publiques
- Les clés secrètes vont dans Firebase Functions config

### Règles Firestore

Les règles sont automatiquement déployées et sécurisent :
- Lecture/écriture par utilisateur authentifié uniquement
- Isolation des données par `userId`
- Validation des données côté serveur

## Support

En cas de problème :
1. Vérifier les logs Firebase
2. Tester avec les émulateurs locaux
3. Consulter la documentation Firebase
4. Vérifier les règles de sécurité Firestore