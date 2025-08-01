import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { User } from '../types';
import toast from 'react-hot-toast';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userData: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, nom: string, prenom?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Messages d'erreur Firebase traduits en français
const getErrorMessage = (errorCode: string): string => {
  const errorMessages: { [key: string]: string } = {
    'auth/email-already-in-use': 'Cette adresse email est déjà utilisée.',
    'auth/weak-password': 'Le mot de passe doit contenir au moins 6 caractères.',
    'auth/user-not-found': 'Aucun utilisateur trouvé avec cette adresse email.',
    'auth/wrong-password': 'Mot de passe incorrect.',
    'auth/invalid-email': 'Adresse email invalide.',
    'auth/too-many-requests': 'Trop de tentatives. Veuillez réessayer plus tard.',
    'auth/user-disabled': 'Ce compte a été désactivé.',
    'auth/requires-recent-login': 'Cette action nécessite une reconnexion récente.',
    'auth/invalid-credential': 'Identifiants invalides.',
    'auth/operation-not-allowed': 'L\'inscription par email/mot de passe n\'est pas activée.',
    'auth/network-request-failed': 'Erreur de connexion réseau. Vérifiez votre connexion internet.',
    'auth/internal-error': 'Erreur interne du serveur. Veuillez réessayer.',
    'auth/popup-closed-by-user': 'La fenêtre de connexion a été fermée.',
    'auth/cancelled-popup-request': 'Demande de connexion annulée.',
    'auth/popup-blocked': 'La fenêtre popup a été bloquée par le navigateur.',
    'permission-denied': 'Accès refusé à la base de données.',
    'unavailable': 'Service temporairement indisponible.',
  };
  
  console.error('🔥 Code d\'erreur Firebase:', errorCode);
  return errorMessages[errorCode] || 'Une erreur inattendue s\'est produite.';
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const googleProvider = new GoogleAuthProvider();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Récupérer les données utilisateur depuis Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const firestoreData = userDoc.data() as User;
            setUserData(firestoreData);
          } else {
            // Si l'utilisateur n'existe pas dans Firestore, le créer
            const displayName = user.displayName || '';
            const nameParts = displayName.split(' ');
            const prenom = nameParts[0] || '';
            const nom = nameParts.slice(1).join(' ') || '';
            
            const newUserData: User = {
              id: user.uid,
              email: user.email!,
              nom: nom || 'Utilisateur',
              prenom: prenom,
              createdAt: Timestamp.now(),
              role: 'participant',
              status: 'active'
            };
            await setDoc(doc(db, 'users', user.uid), newUserData);
            setUserData(newUserData);
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des données utilisateur:', error);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Connexion réussie !');
    } catch (error: any) {
      const errorMessage = getErrorMessage(error.code);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, nom: string, prenom?: string): Promise<void> => {
    try {
      setLoading(true);
      console.log('🔥 Tentative de création de compte:', { email, nom, prenom });
      
      // Vérifier que Firebase est correctement initialisé
      if (!auth) {
        throw new Error('Firebase Auth n\'est pas initialisé');
      }
      
      // Créer le compte Firebase Auth
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      console.log('✅ Compte Firebase créé:', user.uid);
      
      // Mettre à jour le profil avec le nom
      try {
        await updateProfile(user, {
          displayName: `${prenom || ''} ${nom}`.trim()
        });
        console.log('✅ Profil Firebase mis à jour');
      } catch (profileError) {
        console.warn('⚠️ Erreur mise à jour profil (non bloquante):', profileError);
      }

      // Créer le document utilisateur dans Firestore
      const userData: User = {
        id: user.uid,
        email: user.email!,
        nom,
        prenom,
        createdAt: Timestamp.now(),
        role: 'participant', // Rôle par défaut
        status: 'active'    // Statut par défaut
      };

      try {
        await setDoc(doc(db, 'users', user.uid), userData);
        console.log('✅ Document utilisateur créé dans Firestore');
        setUserData(userData);
      } catch (firestoreError: any) {
        console.warn('⚠️ Erreur Firestore (compte créé mais données non sauvées):', firestoreError);
        // Le compte Firebase est créé même si Firestore échoue
        setUserData(userData);
      }
      
      toast.success('Compte créé avec succès !');
    } catch (error: any) {
      console.error('❌ Erreur création compte:', error);
      const errorMessage = getErrorMessage(error.code || error.message);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    try {
      setLoading(true);
      
      // Connexion avec Google
      const { user } = await signInWithPopup(auth, googleProvider);
      
      // Vérifier si l'utilisateur existe déjà dans Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        // Créer le document utilisateur depuis les données Google
        const displayName = user.displayName || '';
        const nameParts = displayName.split(' ');
        const prenom = nameParts.slice(0, -1).join(' ') || '';
        const nom = nameParts[nameParts.length - 1] || 'Utilisateur';
        
        const userData: User = {
          id: user.uid,
          email: user.email!,
          nom,
          prenom,
          createdAt: Timestamp.now(),
          role: 'participant',
          status: 'active'
        };

        await setDoc(userDocRef, userData);
        setUserData(userData);
      }
      
      toast.success('Connexion Google réussie !');
    } catch (error: any) {
      const errorMessage = getErrorMessage(error.code);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      setUserData(null);
      toast.success('Déconnexion réussie');
    } catch (error: any) {
      toast.error('Erreur lors de la déconnexion');
      throw error;
    }
  };

  const value: AuthContextType = {
    currentUser,
    userData,
    loading,
    login,
    register,
    loginWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};