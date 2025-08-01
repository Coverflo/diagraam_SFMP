import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Settings,
  LogOut,
  Clock,
  Heart,
  UserPlus,
  BarChart3,
  Eye,
  Star,
  ArrowRight
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { wednesdayData, thursdayData, fridayData } from '../data/event-data';

export const Dashboard: React.FC = () => {
  const { currentUser, userData, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState<"mercredi" | "jeudi" | "vendredi">("mercredi");

  // Calculer les statistiques de l'événement SFMP
  const getAllActivities = () => {
    const mercrediActivities = [
      ...wednesdayData.morningWorkshops,
      ...wednesdayData.afternoonWorkshops,
      ...(wednesdayData.meetings || []),
    ];
    
    const jeudiActivities = [
      ...thursdayData.morningWorkshops,
      ...thursdayData.afternoonWorkshops,
    ];
    
    const vendrediActivities = [
      ...fridayData.morningWorkshops,
      ...fridayData.afternoonWorkshops,
    ];

    return {
      mercredi: mercrediActivities,
      jeudi: jeudiActivities,
      vendredi: vendrediActivities,
      total: [...mercrediActivities, ...jeudiActivities, ...vendrediActivities]
    };
  };

  const activities = getAllActivities();
  
  // Calculer les intervenants uniques
  const getAllPresenters = () => {
    const allPresenters = activities.total.flatMap(activity => activity.presenters || []);
    const uniquePresenters = allPresenters.filter((presenter, index, self) =>
      index === self.findIndex(p => p.name === presenter.name)
    );
    return uniquePresenters;
  };

  const uniquePresenters = getAllPresenters();

  // Statistiques simulées pour l'utilisateur connecté
  const userStats = {
    favoriteActivities: 3,
    registeredActivities: 5,
    completedProfile: currentUser?.displayName ? 100 : 60
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const getCurrentDayData = () => {
    switch (selectedDay) {
      case "mercredi":
        return wednesdayData;
      case "jeudi":
        return thursdayData;
      case "vendredi":
        return fridayData;
      default:
        return wednesdayData;
    }
  };

  const currentDayData = getCurrentDayData();
  const currentDayActivities = activities[selectedDay];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img
                src="/diagraam-logo-2-3x-1.png"
                alt="Diagraam"
                className="h-8 w-auto mr-4"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Tableau de bord</h1>
                <p className="text-sm text-gray-500">
                  54e Journée Nationale SFMP 2025
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-900">
                  {userData?.prenom} {userData?.nom}
                </p>
                <p className="text-xs text-gray-500">{currentUser?.email}</p>
              </div>
              
              <Link to="/">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  Retour au site
                </Button>
              </Link>
              
              <Link to="/admin">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2"
                  onClick={() => navigate('/admin/login')}
                >
                  <Settings className="h-4 w-4" />
                  Administration
                </Button>
              </Link>
              
              <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-[#234724] to-[#2a5029] rounded-lg p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">
                Bienvenue {userData?.prenom} ! 👋
              </h2>
              <p className="text-green-100 mb-4">
                {userData?.prenom && userData?.nom 
                  ? `${userData.prenom} ${userData.nom}` 
                  : currentUser?.displayName || 'Utilisateur'
                }
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>16-18 Octobre 2025</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Centre Prouvé - Nancy</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{uniquePresenters.length} intervenants</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-[#234724] bg-opacity-10 rounded-lg">
                    <Calendar className="h-8 w-8 text-[#234724]" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{activities.total.length}</p>
                    <p className="text-sm text-gray-500">Activités au programme</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-[#cd5138] bg-opacity-10 rounded-lg">
                    <Heart className="h-8 w-8 text-[#cd5138]" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{userStats.favoriteActivities}</p>
                    <p className="text-sm text-gray-500">Favoris</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <UserPlus className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{userStats.registeredActivities}</p>
                    <p className="text-sm text-gray-500">Inscriptions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{uniquePresenters.length}</p>
                    <p className="text-sm text-gray-500">Intervenants</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Programme par jour */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            
            {/* Programme détaillé */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Programme des activités</span>
                  <Link to="/" className="text-sm text-[#234724] hover:underline">
                    Voir le programme complet
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={selectedDay} onValueChange={(value) => setSelectedDay(value as any)}>
                  <TabsList className="grid w-full grid-cols-3 mb-4">
                    <TabsTrigger value="mercredi">Mercredi 16</TabsTrigger>
                    <TabsTrigger value="jeudi">Jeudi 17</TabsTrigger>
                    <TabsTrigger value="vendredi">Vendredi 18</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value={selectedDay} className="space-y-4">
                    <div className="max-h-[400px] overflow-y-auto space-y-3">
                      {currentDayActivities.map((activity, index) => (
                        <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-900 text-sm leading-tight">
                              {activity.title}
                            </h4>
                            <Badge variant="outline" className="text-xs whitespace-nowrap ml-2">
                              {activity.category || "Atelier"}
                            </Badge>
                          </div>
                          
                          <div className="flex flex-wrap gap-4 text-xs text-gray-600 mb-2">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{activity.time}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{activity.room}</span>
                            </div>
                          </div>
                          
                          {activity.presenters && activity.presenters.length > 0 && (
                            <div className="text-xs text-gray-500">
                              <strong>Intervenants :</strong> {activity.presenters.map(p => p.name).join(', ')}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Mes activités */}
            <Card>
              <CardHeader>
                <CardTitle>Mes activités</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Mes favoris</h4>
                    <div className="space-y-2">
                      {activities.total.slice(0, 3).map((activity, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded">
                          <div>
                            <p className="text-xs font-medium">{activity.title}</p>
                            <p className="text-xs text-gray-500">{activity.time}</p>
                          </div>
                          <Heart className="h-4 w-4 text-red-500 fill-current" />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Mes inscriptions</h4>
                    <div className="space-y-2">
                      {activities.total.slice(3, 6).map((activity, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded">
                          <div>
                            <p className="text-xs font-medium">{activity.title}</p>
                            <p className="text-xs text-gray-500">{activity.time}</p>
                          </div>
                          <UserPlus className="h-4 w-4 text-green-500" />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="space-y-2">
                      <>
                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                          {activities.mercredi ? activities.mercredi.length : 0} activités
                        </div>
                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                          {activities.jeudi ? activities.jeudi.length : 0} activités
                        </div>
                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mt-1">
                          {activities.vendredi ? activities.vendredi.length : 0} activités
                        </div>
                      </>
                    </div>
                    
                    <Link to="/">
                      <Button className="w-full bg-[#234724] hover:bg-[#1b3a1c] text-sm">
                        Voir le programme complet
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions rapides */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/')}>
              <CardContent className="p-6 text-center">
                <Eye className="h-8 w-8 text-[#234724] mx-auto mb-2" />
                <h3 className="font-medium text-gray-900 mb-1">Consulter le programme</h3>
                <p className="text-sm text-gray-500">Voir tous les ateliers et conférences</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/')}>
              <CardContent className="p-6 text-center">
                <Heart className="h-8 w-8 text-[#cd5138] mx-auto mb-2" />
                <h3 className="font-medium text-gray-900 mb-1">Mes favoris</h3>
                <p className="text-sm text-gray-500">Gérer mes activités préférées</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/admin')}>
              <CardContent className="p-6 text-center">
                <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900 mb-1">Administration</h3>
                <p className="text-sm text-gray-500">Accès interface d'administration</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};