import { Timestamp } from 'firebase/firestore';

export interface User {
  id: string;
  email: string;
  nom: string;
  prenom?: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  role?: 'participant' | 'admin' | 'speaker';
  status?: 'active' | 'inactive' | 'pending';
  phone?: string;
  organization?: string;
}

export interface Event {
  id: string;
  nom: string;
  date: string;
  dateDebut?: string;
  dateFin?: string;
  description: string;
  lieu?: string;
  ville?: string;
  userId: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

export interface Activity {
  id: string;
  eventId: string;
  titre: string;
  sousTitre?: string;
  horaire: string;
  description: string;
  salle?: string;
  type?: 'atelier' | 'conference' | 'reunion' | 'pause' | 'autre';
  intervenants?: Presenter[];
  capacite?: number;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

export interface Presenter {
  nom: string;
  titre: string;
  organisation?: string;
}

export interface AuthError {
  code: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}