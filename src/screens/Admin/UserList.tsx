import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { 
  Search, 
  UserPlus, 
  Filter, 
  Download,
  Mail,
  Phone,
  Calendar,
  Loader2,
  RefreshCw
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "../../components/ui/dropdown-menu";
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db, auth } from '../../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { debugFirestore } from '../../services/debugFirestore';

// Interface pour les utilisateurs Firebase
interface FirebaseUser {
  id: string;
  email: string;
  nom: string;
  prenom?: string;
  createdAt: any;
  updatedAt?: any;
  role?: string;
  status?: string;
  phone?: string;
  organization?: string;
}

export default function UserList() {
  const [users, setUsers] = useState<FirebaseUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Écouter l'état d'authentification
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    
    return () => unsubscribe();
  }, []);
  
  // Fonction de debug pour tester l'accès Firestore
  const handleDebugFirestore = async () => {
    console.log('🔍 Début du test debug Firestore...');
    const result = await debugFirestore.testConnection();
    console.log('🔍 Résultat test:', result);
    
    if (result.success) {
      toast.success(`✅ Connexion Firestore réussie ! ${result.userCount} utilisateurs trouvés.`);
      // Rafraîchir les données après le test réussi
      fetchUsers();
    } else {
      toast.error(`❌ Échec connexion Firestore: ${result.error}`);
    }
  };
  
  // Fonction pour créer un utilisateur de test
  const handleCreateTestUser = async () => {
    const result = await debugFirestore.createTestUser();
    if (result.success) {
      toast.success('✅ Utilisateur de test créé !');
      fetchUsers();
    } else {
      toast.error(`❌ Erreur: ${result.error}`);
    }
  };
  
  // Fonction pour récupérer les utilisateurs depuis Firebase
  const fetchUsers = async () => {
    try {
      setIsRefreshing(true);
      setError(null);
      
      // Vérifier que l'utilisateur est connecté
      if (!currentUser) {
        setError('Vous devez être connecté pour voir les utilisateurs');
        return;
      }
      
      // Vérifier que l'utilisateur est admin côté client également
      if (!ADMIN_EMAILS.includes(currentUser.email)) {
        setError(`Accès non autorisé pour ${currentUser.email}. Contactez l'administrateur système.`);
        return;
      }
      
      console.log('🔥 Utilisateur connecté:', currentUser.email);
      console.log('🔥 Token utilisateur:', await currentUser.getIdToken());
      console.log('🔥 Tentative de récupération des utilisateurs Firestore avec admin:', currentUser.email);
      
      const usersRef = collection(db, 'users');
      const q = query(usersRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const userData: FirebaseUser[] = [];
      querySnapshot.forEach((doc) => {
        console.log('📄 Document utilisateur trouvé:', doc.id, doc.data());
        userData.push({
          id: doc.id,
          ...doc.data()
        } as FirebaseUser);
      });
      
      setUsers(userData);
      console.log(`✅ ${userData.length} utilisateurs récupérés depuis Firebase`);
      
      if (userData.length === 0) {
        console.log('ℹ️ Aucun utilisateur trouvé dans Firestore, mais pas d\'erreur - la collection est peut-être vide');
        // Ne pas définir d'erreur si la requête réussit mais qu'il n'y a pas de données
      }
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des utilisateurs:', error);
      console.error('❌ Détails de l\'erreur:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      
      if (errorMessage.includes('permission') || errorMessage.includes('denied')) {
        setError(`🚫 Accès refusé pour ${currentUser?.email}. Problème avec les règles Firestore. Vérifiez que votre email est bien autorisé dans Firebase Console.`);
      } else if (errorMessage.includes('network')) {
        setError('Erreur de connexion réseau. Vérifiez votre connexion internet.');
      } else {
        setError(`Impossible de charger les utilisateurs: ${errorMessage}`);
      }
    } finally {
      setIsRefreshing(false);
      setLoading(false);
    }
  };

  // Charger les utilisateurs au montage du composant
  useEffect(() => {
    if (currentUser) {
      console.log('🚀 Chargement initial des utilisateurs pour:', currentUser.email);
      fetchUsers();
    }
  }, [currentUser]);
  
  // Filter users based on search term and filters
  const filteredUsers = users.filter((user) => {
    const fullName = `${user.prenom || ''} ${user.nom}`.trim();
    const matchesSearch = 
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesRole = !selectedRole || user.role === selectedRole;
    const matchesStatus = !selectedStatus || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });
  
  // Format date from Firebase timestamp
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Date inconnue';
    
    let date: Date;
    if (timestamp.toDate) {
      // Firestore Timestamp
      date = timestamp.toDate();
    } else if (timestamp.seconds) {
      // Timestamp object
      date = new Date(timestamp.seconds * 1000);
    } else {
      // Regular date
      date = new Date(timestamp);
    }
    
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };
  
  // Get status badge (simulé pour l'instant)
  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inactif</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      default:
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
    }
  };
  
  // Get role badge (simulé pour l'instant)
  const getRoleBadge = (user: FirebaseUser) => {
    const role = user.role;
    const email = user.email;
    
    if (role === 'admin' || email.includes('admin') || email === 'tech@sfmp.fr' || email === 'direction@sfmp.fr') {
      return <Badge className="bg-purple-100 text-purple-800">Administrateur</Badge>;
    } else if (role === 'speaker') {
      return <Badge className="bg-blue-100 text-blue-800">Intervenant</Badge>;
    }
    return <Badge className="bg-indigo-100 text-indigo-800">Participant</Badge>;
  };
  
  // Get avatar initials from name
  const getInitials = (user: FirebaseUser) => {
    const firstName = user.prenom || '';
    const lastName = user.nom || '';
    
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    } else if (lastName) {
      return lastName.slice(0, 2).toUpperCase();
    } else if (user.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return 'U?';
  };

  // Affichage de chargement
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#234724]" />
              <span className="ml-2 text-gray-600">Chargement des utilisateurs Firebase...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Affichage d'erreur
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>
          <Button 
            onClick={fetchUsers}
            disabled={isRefreshing}
            className="bg-[#234724] hover:bg-[#1b3a1c] flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Réessayer
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-12">
              <div className="text-red-500 mb-4 flex justify-center">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur de chargement</h3>
              <div className="text-gray-600 mb-4 max-w-md mx-auto">
                <p className="mb-2">{error}</p>
                {error?.includes('permission') && (
                  <div className="text-sm bg-yellow-50 border border-yellow-200 rounded p-3 mt-4">
                    <p className="font-medium text-yellow-800">💡 Solution :</p>
                    <div className="text-yellow-700 text-left mt-2 space-y-2">
                      <p>Testez la connexion Firestore avec les boutons ci-dessous :</p>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={handleDebugFirestore}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          🔍 Test Connexion
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={handleCreateTestUser}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          👤 Créer Test User
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                {!currentUser && (
                  <div className="text-sm bg-blue-50 border border-blue-200 rounded p-3 mt-4">
                    <p className="text-blue-800">
                      👤 Vous devez être connecté comme administrateur pour voir les utilisateurs
                    </p>
                  </div>
                )}
                {currentUser && (
                  <div className="text-sm bg-gray-50 border border-gray-200 rounded p-3 mt-4">
                    <p className="text-gray-800">
                      🔐 Connecté en tant que: <strong>{currentUser.email}</strong>
                    </p>
                    <p className="text-gray-600 mt-1">
                      🆔 UID: <span className="font-mono text-xs">{currentUser.uid}</span>
                    </p>
                    <p className="text-gray-600 mt-1">
                      Les utilisateurs Firebase Auth apparaîtront ici une fois qu'ils se seront inscrits via l'application.
                    </p>
                  </div>
                )}
              </div>
              <Button 
                onClick={fetchUsers} 
                disabled={isRefreshing}
                className="bg-[#234724] hover:bg-[#1b3a1c]"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Réessayer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>
        <div className="flex gap-2">
          <Button 
            onClick={fetchUsers}
            disabled={isRefreshing}
            variant="outline" 
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Exporter
          </Button>
          <Button className="bg-[#234724] hover:bg-[#1b3a1c] flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Ajouter un utilisateur
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Rechercher..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Rôle {selectedRole && `(${selectedRole})`}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSelectedRole(null)}>
                Tous les rôles
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedRole('participant')}>
                Participants
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedRole('admin')}>
                Administrateurs
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedRole('speaker')}>
                Intervenants
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="text-sm text-gray-600">
            <strong>{filteredUsers.length}</strong> utilisateur(s) • 
            <strong className="text-[#234724] ml-1">{users.length}</strong> total
          </div>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <span>Utilisateurs Firebase ({filteredUsers.length})</span>
            <div className="flex items-center gap-2">
              {currentUser && (
                <span className="text-xs text-gray-500">
                  Connecté: {currentUser.email}
                </span>
              )}
              <span className="text-sm font-normal text-gray-500">
                Données Firestore
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden ring-1 ring-black ring-opacity-5 rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8">
                        Utilisateur
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Contact
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Rôle
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Statut
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Inscription
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        ID Firebase
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6 lg:pl-8">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 rounded-full">
                              <AvatarFallback>{getInitials(user)}</AvatarFallback>
                            </Avatar>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">
                                {user.prenom && user.nom ? `${user.prenom} ${user.nom}` : user.nom || 'Nom non renseigné'}
                              </div>
                              <div className="text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Mail className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                            <span className="truncate max-w-[150px]">{user.email}</span>
                          </div>
                          <div className="flex items-center mt-1">
                            <Phone className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                            <span className="text-gray-400">{user.phone || 'Non renseigné'}</span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {getRoleBadge(user)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {getStatusBadge(user.status)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                            <span>{formatDate(user.createdAt)}</span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                            {user.id.substring(0, 8)}...
                          </div>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Voir<span className="sr-only">, {user.email}</span>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {filteredUsers.length === 0 && users.length > 0 && (
                  <div className="px-6 py-10 text-center">
                    <Search className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun utilisateur trouvé</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Modifiez vos critères de recherche.
                    </p>
                  </div>
                )}

                {users.length === 0 && !loading && (
                  <div className="px-6 py-10 text-center">
                    <UserPlus className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun utilisateur dans Firestore</h3>
                    <div className="mt-1 text-sm text-gray-500 max-w-md mx-auto space-y-2">
                      <p>
                        Les utilisateurs Firebase Auth apparaîtront ici après leur première inscription via l'application.
                      </p>
                      <div className="bg-blue-50 border border-blue-200 rounded p-3 mt-4">
                        <p className="text-blue-800 font-medium">📝 Pour voir des utilisateurs :</p>
                        <ol className="text-blue-700 text-left mt-2 space-y-1 text-xs">
                          <li>1. Allez sur le site public</li>
                          <li>2. Cliquez "Se connecter" → "Créer un compte"</li>
                          <li>3. Remplissez le formulaire d'inscription</li>
                          <li>4. L'utilisateur apparaîtra automatiquement ici</li>
                        </ol>
                      </div>
                    </div>
                    <div className="mt-6">
                      <Button 
                        onClick={fetchUsers}
                        disabled={isRefreshing}
                      >
                        <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        Actualiser
                      </Button>
                    </div>
                    <div className="mt-4 text-xs text-gray-400">
                      <p>💡 Connecté en tant que: {currentUser?.email}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}