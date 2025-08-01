import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { body, validationResult } from 'express-validator';

// Initialiser Firebase Admin
admin.initializeApp();
const db = admin.firestore();

const app = express();

// Middleware de sécurité
app.use(helmet());
app.use(cors({ origin: true }));
app.use(express.json());

// Middleware d'authentification
const authenticateUser = async (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token d\'authentification requis' });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Erreur de vérification du token:', error);
    return res.status(401).json({ error: 'Token invalide' });
  }
};

// Middleware de gestion d'erreurs
const handleValidationErrors = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Données invalides', 
      details: errors.array() 
    });
  }
  next();
};

// Routes pour les événements
app.get('/events', authenticateUser, async (req: any, res: any) => {
  try {
    const userId = req.user.uid;
    const eventsSnapshot = await db
      .collection('events')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    const events = eventsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({ success: true, data: events });
  } catch (error) {
    console.error('Erreur lors de la récupération des événements:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/events/:id', authenticateUser, async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;

    const eventDoc = await db.collection('events').doc(id).get();

    if (!eventDoc.exists) {
      return res.status(404).json({ error: 'Événement non trouvé' });
    }

    const eventData = eventDoc.data();
    
    // Vérifier que l'utilisateur est propriétaire de l'événement
    if (eventData?.userId !== userId) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    res.json({ 
      success: true, 
      data: { id: eventDoc.id, ...eventData } 
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'événement:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/events', 
  authenticateUser,
  [
    body('nom').notEmpty().withMessage('Le nom de l\'événement est requis'),
    body('date').isISO8601().withMessage('Date invalide'),
    body('description').notEmpty().withMessage('La description est requise')
  ],
  handleValidationErrors,
  async (req: any, res: any) => {
    try {
      const userId = req.user.uid;
      const eventData = {
        ...req.body,
        userId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      const docRef = await db.collection('events').add(eventData);
      
      res.status(201).json({ 
        success: true, 
        data: { id: docRef.id, ...eventData } 
      });
    } catch (error) {
      console.error('Erreur lors de la création de l\'événement:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
);

app.put('/events/:id',
  authenticateUser,
  [
    body('nom').optional().notEmpty().withMessage('Le nom ne peut pas être vide'),
    body('date').optional().isISO8601().withMessage('Date invalide'),
    body('description').optional().notEmpty().withMessage('La description ne peut pas être vide')
  ],
  handleValidationErrors,
  async (req: any, res: any) => {
    try {
      const { id } = req.params;
      const userId = req.user.uid;

      // Vérifier que l'événement existe et appartient à l'utilisateur
      const eventDoc = await db.collection('events').doc(id).get();
      
      if (!eventDoc.exists) {
        return res.status(404).json({ error: 'Événement non trouvé' });
      }

      const eventData = eventDoc.data();
      if (eventData?.userId !== userId) {
        return res.status(403).json({ error: 'Accès non autorisé' });
      }

      const updateData = {
        ...req.body,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      await db.collection('events').doc(id).update(updateData);

      res.json({ success: true, message: 'Événement mis à jour' });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'événement:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
);

app.delete('/events/:id', authenticateUser, async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;

    // Vérifier que l'événement existe et appartient à l'utilisateur
    const eventDoc = await db.collection('events').doc(id).get();
    
    if (!eventDoc.exists) {
      return res.status(404).json({ error: 'Événement non trouvé' });
    }

    const eventData = eventDoc.data();
    if (eventData?.userId !== userId) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    // Supprimer toutes les activités associées
    const activitiesSnapshot = await db
      .collection('activities')
      .where('eventId', '==', id)
      .get();

    const batch = db.batch();
    activitiesSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    // Supprimer l'événement
    batch.delete(db.collection('events').doc(id));
    
    await batch.commit();

    res.json({ success: true, message: 'Événement supprimé' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'événement:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Routes pour les activités
app.get('/events/:eventId/activities', authenticateUser, async (req: any, res: any) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.uid;

    // Vérifier que l'événement appartient à l'utilisateur
    const eventDoc = await db.collection('events').doc(eventId).get();
    
    if (!eventDoc.exists) {
      return res.status(404).json({ error: 'Événement non trouvé' });
    }

    const eventData = eventDoc.data();
    if (eventData?.userId !== userId) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const activitiesSnapshot = await db
      .collection('activities')
      .where('eventId', '==', eventId)
      .orderBy('createdAt', 'desc')
      .get();

    const activities = activitiesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({ success: true, data: activities });
  } catch (error) {
    console.error('Erreur lors de la récupération des activités:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/activities',
  authenticateUser,
  [
    body('eventId').notEmpty().withMessage('L\'ID de l\'événement est requis'),
    body('titre').notEmpty().withMessage('Le titre de l\'activité est requis'),
    body('horaire').notEmpty().withMessage('L\'horaire est requis'),
    body('description').notEmpty().withMessage('La description est requise')
  ],
  handleValidationErrors,
  async (req: any, res: any) => {
    try {
      const userId = req.user.uid;
      const { eventId } = req.body;

      // Vérifier que l'événement appartient à l'utilisateur
      const eventDoc = await db.collection('events').doc(eventId).get();
      
      if (!eventDoc.exists) {
        return res.status(404).json({ error: 'Événement non trouvé' });
      }

      const eventData = eventDoc.data();
      if (eventData?.userId !== userId) {
        return res.status(403).json({ error: 'Accès non autorisé' });
      }

      const activityData = {
        ...req.body,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      const docRef = await db.collection('activities').add(activityData);
      
      res.status(201).json({ 
        success: true, 
        data: { id: docRef.id, ...activityData } 
      });
    } catch (error) {
      console.error('Erreur lors de la création de l\'activité:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }
);

// Route de santé
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Diagraam API'
  });
});

// Exporter l'API comme fonction Firebase
export const api = functions.https.onRequest(app);