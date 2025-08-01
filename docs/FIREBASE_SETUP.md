# Guide Configuration Firebase - Étape par Étape

## 🔥 **Étape 1 : Accéder à votre projet Firebase**

1. **Allez sur [Firebase Console](https://console.firebase.google.com/)**
2. **Sélectionnez votre projet existant** Diagraam
3. **Si vous n'avez pas encore de projet :** Cliquez "Ajouter un projet"

---

## 🔧 **Étape 2 : Récupérer les clés de configuration**

### **Dans Firebase Console :**

1. **Cliquez sur l'icône "Paramètres" (roue dentée)** en haut à gauche
2. **Sélectionnez "Paramètres du projet"**
3. **Scrollez jusqu'à "Vos applications"**
4. **Si aucune app n'existe :**
   - Cliquez le bouton **"</>"** (icône web)
   - Donnez un nom : `diagraam-web`
   - **NE PAS** cocher "Firebase Hosting"
   - Cliquez "Enregistrer l'application"

5. **Copiez la configuration** qui apparaît (ressemble à ça) :
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD...",
  authDomain: "votre-projet.firebaseapp.com",
  projectId: "votre-projet",
  storageBucket: "votre-projet.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

---

## 🔐 **Étape 3 : Activer l'authentification**

### **Configuration Authentication :**

1. **Dans le menu de gauche :** Cliquez "Authentication"
2. **Onglet "Sign-in method"**
3. **Cliquez sur "E-mail/Mot de passe"**
4. **Activez** la première option (E-mail/Mot de passe)
5. **Laissez** la seconde option (lien e-mail) désactivée
6. **Cliquez "Enregistrer"**

### **Domaines autorisés :**
1. **Toujours dans Authentication > Settings**
2. **Ajoutez ces domaines autorisés :**
   - `localhost`
   - `steady-phoenix-1223f1.netlify.app` (votre domaine Netlify)
   - Votre domaine personnalisé OVH si vous l'avez

---

## 📊 **Étape 4 : Configurer Firestore Database**

### **Créer la base de données :**

1. **Menu de gauche :** Cliquez "Firestore Database"
2. **Cliquez "Créer une base de données"**
3. **Choisissez "Commencer en mode test"** (temporairement)
4. **Sélectionnez une région** proche de vous (ex: europe-west1)
5. **Cliquez "Terminé"**

### **Les règles de sécurité** seront automatiquement configurées par le code.

---

## ⚡ **Étape 5 : Activer Firebase Functions**

### **Activation :**

1. **Menu de gauche :** Cliquez "Functions"
2. **Cliquez "Commencer"**
3. **Choisissez votre plan :**
   - **Plan gratuit (Spark) :** OK pour développement
   - **Plan Blaze :** Requis pour production (facturation à l'usage)
4. **Sélectionnez la même région** que Firestore

---

## 🔑 **Étape 6 : Mettre à jour votre fichier .env**

### **Remplacez dans votre .env :**

```env
# Remplacez ces valeurs par celles de VOTRE projet Firebase :
VITE_FIREBASE_API_KEY=votre_vraie_api_key_ici
VITE_FIREBASE_AUTH_DOMAIN=votre-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=votre-project-id
VITE_FIREBASE_STORAGE_BUCKET=votre-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=votre_messaging_sender_id
VITE_FIREBASE_APP_ID=votre_app_id

# Gardez Supabase pour d'autres fonctionnalités si nécessaire
VITE_SUPABASE_URL=https://fzjynmhafubufpkckhjd.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6anlubWhhZnVidWZwa2NraGpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0MzQ2MDYsImV4cCI6MjA2OTAxMDYwNn0.-mipHCQubuLJZTrdmLcNAgghFlm_dFt8QMKRLFmwECM
```

---

## 🧪 **Étape 7 : Tester la configuration**

### **Vérification :**

1. **Redémarrez** votre serveur de développement :
```bash
npm run dev
```

2. **Allez sur** http://localhost:5173
3. **L'erreur Firebase devrait disparaître**
4. **Testez l'inscription :** Créez un compte test
5. **Vérifiez dans Firebase Console > Authentication** : votre utilisateur apparaît

---

## 🔍 **Dépannage si problèmes :**

### **Erreur "auth/invalid-api-key" :**
- Vérifiez que vous avez copié la bonne `apiKey`
- Pas d'espaces avant/après dans le .env

### **Erreur "auth/unauthorized-domain" :**
- Ajoutez `localhost` dans Authentication > Settings > Domaines autorisés

### **Erreur "Missing or insufficient permissions" :**
- Les règles Firestore seront configurées automatiquement
- Patientez quelques minutes après activation

---

## ✅ **Validation finale**

### **Votre SaaS est prêt quand :**
- ✅ Inscription/connexion fonctionne
- ✅ Dashboard accessible après connexion  
- ✅ Création d'événements possible
- ✅ Aucune erreur dans la console navigateur

### **URL de votre SaaS :**
- **Développement :** http://localhost:5173
- **Production :** https://steady-phoenix-1223f1.netlify.app

---

## 📞 **Besoin d'aide ?**

Si vous rencontrez des difficultés à une étape, dites-moi laquelle et je vous aiderai spécifiquement !