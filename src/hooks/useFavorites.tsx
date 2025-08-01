import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  doc, 
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

export interface Favorite {
  id: string;
  activity_id: string;
  activity_title: string;
  activity_day: string;
  activity_time: string;
  activity_room: string;
  created_at: string;
}

export interface Activity {
  id: number;
  title: string;
  day: string;
  time: string;
  room: string;
  subtitle?: string;
  presenters?: { name: string; title: string }[];
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  // Fetch user's favorites
  const fetchFavorites = async () => {
    if (!currentUser) {
      setFavorites([]);
      return;
    }

    try {
      setLoading(true);
      const favoritesRef = collection(db, 'favorites');
      const q = query(
        favoritesRef, 
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const favoritesData: Favorite[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        favoritesData.push({
          id: doc.id,
          activity_id: data.activityId,
          activity_title: data.activityTitle,
          activity_day: data.activityDay,
          activity_time: data.activityTime,
          activity_room: data.activityRoom,
          created_at: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
        });
      });

      setFavorites(favoritesData);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error('Impossible de charger les favoris');
    } finally {
      setLoading(false);
    }
  };

  // Check if an activity is favorited
  const isFavorite = (activityId: number): boolean => {
    return favorites.some(fav => fav.activity_id === activityId.toString());
  };

  // Add activity to favorites
  const addToFavorites = async (activity: Activity): Promise<boolean> => {
    if (!currentUser) {
      toast.error('Vous devez être connecté pour ajouter des favoris');
      return false;
    }

    // Check if already favorited
    if (isFavorite(activity.id)) {
      toast.error('Cette activité est déjà dans vos favoris');
      return false;
    }

    try {
      const favoritesRef = collection(db, 'favorites');
      await addDoc(favoritesRef, {
        userId: currentUser.uid,
        activityId: activity.id.toString(),
        activityTitle: activity.title,
        activityDay: activity.day,
        activityTime: activity.time,
        activityRoom: activity.room,
        createdAt: Timestamp.now()
      });

      toast.success('Ajouté aux favoris');
      fetchFavorites(); // Refresh favorites
      return true;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      toast.error('Impossible d\'ajouter aux favoris');
      return false;
    }
  };

  // Remove activity from favorites
  const removeFromFavorites = async (activityId: number): Promise<boolean> => {
    if (!currentUser) {
      return false;
    }

    try {
      const favoritesRef = collection(db, 'favorites');
      const q = query(
        favoritesRef, 
        where('userId', '==', currentUser.uid),
        where('activityId', '==', activityId.toString())
      );
      
      const querySnapshot = await getDocs(q);
      
      // Delete all matching documents (there should be only one)
      const deletePromises = querySnapshot.docs.map(docSnapshot => 
        deleteDoc(doc(db, 'favorites', docSnapshot.id))
      );
      
      await Promise.all(deletePromises);

      toast.success('Retiré des favoris');
      fetchFavorites(); // Refresh favorites
      return true;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      toast.error('Impossible de retirer des favoris');
      return false;
    }
  };

  // Toggle favorite status
  const toggleFavorite = async (activity: Activity): Promise<boolean> => {
    if (isFavorite(activity.id)) {
      return await removeFromFavorites(activity.id);
    } else {
      return await addToFavorites(activity);
    }
  };

  // Load favorites when user changes
  useEffect(() => {
    fetchFavorites();
  }, [currentUser]);

  return {
    favorites,
    loading,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    refreshFavorites: fetchFavorites
  };
};