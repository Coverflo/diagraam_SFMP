# Documentation - Sécurité Administration SFMP

## 🔐 Système de Connexion Administrateur

### **Fonctionnalités de Sécurité**

#### **1. Authentification Renforcée**
- **Emails autorisés uniquement :** Seuls les emails dans la liste des administrateurs peuvent accéder
- **Validation Firebase :** Double vérification avec l'authentification Firebase
- **Mots de passe sécurisés :** Minimum 8 caractères requis

#### **2. Protection Anti-Brute Force**
- **Limite de tentatives :** Maximum 3 tentatives de connexion
- **Blocage automatique :** 15 minutes de blocage après 3 échecs
- **Compteur visible :** Affichage du nombre de tentatives restantes
- **Reset automatique :** Remise à zéro après connexion réussie

#### **3. Contrôle d'Accès**
- **Liste blanche d'emails :** Configuration centralisée des administrateurs
- **Vérification continue :** Contrôle à chaque accès aux pages admin
- **Redirection automatique :** Vers la page de connexion si non autorisé

### **📧 Emails Administrateurs Autorisés**

```javascript
const ADMIN_EMAILS = [
  'admin@sfmp.fr',
  'direction@sfmp.fr', 
  'tech@sfmp.fr',
  'congres@sfmp.fr'
];
```

### **🛡️ Mesures de Sécurité Implémentées**

#### **Client-Side (Frontend)**
- Validation des formulaires avec Yup
- Masquage des mots de passe
- Interface utilisateur sécurisée
- Messages d'erreur appropriés
- Blocage temporaire local

#### **Server-Side (Firebase)**
- Authentification Firebase Auth
- Règles de sécurité Firestore
- Validation côté serveur
- Sessions sécurisées
- Logs d'authentification

#### **Réseau & Transport**
- Connexion HTTPS/SSL obligatoire
- Tokens JWT sécurisés
- Protection CORS configurée
- Headers de sécurité

### **🚨 Gestion des Incidents**

#### **Tentatives de Connexion Suspectes**
1. **Blocage automatique** après 3 tentatives
2. **Message d'alerte** visible à l'utilisateur
3. **Logs Firebase** pour traçabilité
4. **Support technique** contactable

#### **Accès Non Autorisé**
- Message d'erreur clair
- Redirection vers page de connexion
- Pas de révélation d'informations sensibles
- Contact support affiché

### **⚙️ Configuration & Maintenance**

#### **Ajouter un Nouvel Administrateur**
1. Ajouter l'email dans `ADMIN_EMAILS`
2. Créer le compte Firebase
3. Tester l'accès
4. Documenter l'ajout

#### **Révoquer un Accès**
1. Retirer l'email de `ADMIN_EMAILS`
2. Désactiver le compte Firebase (optionnel)
3. Vérifier la déconnexion
4. Documenter la révocation

#### **Surveillance & Logs**
- Firebase Authentication logs
- Console Firebase pour monitoring
- Alertes automatiques sur tentatives multiples
- Audit trail des connexions admin

### **🔧 Dépannage**

#### **Problèmes Courants**

**"Email non autorisé"**
- Vérifier que l'email est dans `ADMIN_EMAILS`
- Vérifier l'orthographe exacte
- Contacter le support technique

**"Accès bloqué"**
- Attendre 15 minutes
- Ou contacter le support pour déblocage manuel
- Vérifier les identifiants

**"Erreur de connexion"**
- Vérifier la connexion internet
- Contrôler les identifiants Firebase
- Tester avec un autre navigateur

### **📞 Support & Contact**

**Support Technique SFMP :**
- **Email :** support@sfmp.fr
- **Téléphone :** +33 (0)1 XX XX XX XX
- **Disponibilité :** 9h-17h, lun-ven

**Urgences Sécurité :**
- **Email :** security@sfmp.fr
- **Disponibilité :** 24h/7j

---

**Note :** Cette documentation est confidentielle et réservée à l'équipe technique SFMP.