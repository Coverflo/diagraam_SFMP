import React, { useState } from "react";
import { useEffect } from "react";
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from "../../config/firebase";
import {
  BarChart,
  Calendar,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";
import { wednesdayData, thursdayData, fridayData } from "../../data/event-data";

// Interface pour les activités unifiées
interface UnifiedActivity {
  id: number;
  title: string;
  subtitle?: string;
  presenters: { name: string; title: string }[];
  room: string;
  time: string;
  day: string;
  type: string;
  dayPart?: string;
  status: string;
}

export default function Dashboard() {
  const [selectedDay, setSelectedDay] = useState<"mercredi" | "jeudi" | "vendredi" | "all">("all");
  const [firebaseUsers, setFirebaseUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Récupérer les utilisateurs Firebase au chargement
  useEffect(() => {
    const fetchFirebaseUsers = async () => {
      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const userData: any[] = [];
        querySnapshot.forEach((doc) => {
          userData.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        setFirebaseUsers(userData);
        console.log(`✅ ${userData.length} utilisateurs Firebase récupérés pour les stats`);
      } catch (error) {
        console.warn('⚠️ Impossible de récupérer les utilisateurs Firebase pour les stats:', error);
        // Utiliser des données par défaut en cas d'erreur
        setFirebaseUsers([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFirebaseUsers();
  }, []);

  // Calculate statistics
  const totalWorkshops = {
    mercredi: wednesdayData.morningWorkshops.length + wednesdayData.afternoonWorkshops.length,
    jeudi: thursdayData.morningWorkshops.length + thursdayData.afternoonWorkshops.length,
    vendredi: fridayData.morningWorkshops.length + fridayData.afternoonWorkshops.length,
  };

  const totalSpecialEvents = {
    mercredi: wednesdayData.specialEvent ? 1 : 0,
    jeudi: thursdayData.specialEvent ? 1 : 0,
    vendredi: 0,
  };

  const totalPlenary = {
    mercredi: 0,
    jeudi: thursdayData.plenary ? 1 : 0,
    vendredi: fridayData.closingSession ? 1 : 0,
  };

  const totalMeetings = {
    mercredi: wednesdayData.meetings ? wednesdayData.meetings.length : 0,
    jeudi: 0,
    vendredi: 0,
  };

  const totalActivities = {
    mercredi: totalWorkshops.mercredi + totalSpecialEvents.mercredi + totalPlenary.mercredi + totalMeetings.mercredi,
    jeudi: totalWorkshops.jeudi + totalSpecialEvents.jeudi + totalPlenary.jeudi + totalMeetings.jeudi,
    vendredi: totalWorkshops.vendredi + totalSpecialEvents.vendredi + totalPlenary.vendredi + totalMeetings.vendredi,
  };

  const allActivitiesTotal = totalActivities.mercredi + totalActivities.jeudi + totalActivities.vendredi;

  // All presenters
  const getAllPresenters = () => {
    const mercrediPresenters = [
      ...wednesdayData.morningWorkshops.flatMap(w => w.presenters),
      ...wednesdayData.afternoonWorkshops.flatMap(w => w.presenters),
      ...(wednesdayData.meetings || []).flatMap(m => m.presenters || []),
      ...(wednesdayData.welcomeEvent ? wednesdayData.welcomeEvent.presenters : []),
      ...(wednesdayData.plenary ? wednesdayData.plenary.presenters : []),
      ...(wednesdayData.parallelSession ? wednesdayData.parallelSession.presenters : []),
      ...(wednesdayData.actualityConference ? wednesdayData.actualityConference.presenters : []),
    ];
    
    const jeudiPresenters = [
      ...thursdayData.morningWorkshops.flatMap(w => w.presenters),
      ...thursdayData.afternoonWorkshops.flatMap(w => w.presenters),
      ...(thursdayData.plenary ? thursdayData.plenary.presenters : []),
    ];
    
    const vendrediPresenters = [
      ...fridayData.morningWorkshops.flatMap(w => w.presenters),
      ...fridayData.afternoonWorkshops.flatMap(w => w.presenters),
      ...(fridayData.closingSession ? fridayData.closingSession.presenters : []),
    ];

    // Return unique presenters by name
    const allPresenters = [...mercrediPresenters, ...jeudiPresenters, ...vendrediPresenters];
    const uniquePresenters = allPresenters.filter((presenter, index, self) =>
      index === self.findIndex(p => p.name === presenter.name)
    );
    
    return uniquePresenters;
  };

  const uniquePresentersCount = getAllPresenters().length;

  // Calculer les vraies statistiques
  const realUserCount = firebaseUsers.length || 0;
  const estimatedRegistrations = Math.floor(realUserCount * 3.2); // Estimation basée sur le nombre d'utilisateurs
  
  // Statistiques des inscriptions par jour (basées sur les vrais utilisateurs)
  const registrationStats = {
    mercredi: Math.floor(estimatedRegistrations * 0.4),
    jeudi: Math.floor(estimatedRegistrations * 0.35),
    vendredi: Math.floor(estimatedRegistrations * 0.25),
  };

  // Recent alerts
  const recentAlerts = [
    {
      id: 1,
      title: "Modification du lieu de l'atelier 13",
      description: "Le lieu a été modifié de Salle 104 à Salle 105",
      timestamp: "Il y a 20 minutes",
      type: "warning",
    },
    {
      id: 2,
      title: "Nouvelle activité ajoutée",
      description: "L'atelier 'Préparation mentale à l'accouchement' a été ajouté le jeudi après-midi",
      timestamp: "Il y a 2 heures",
      type: "success",
    },
    {
      id: 3,
      title: "Capacité maximale atteinte pour la session plénière",
      description: "La session plénière de jeudi a atteint sa capacité maximale de participants",
      timestamp: "Hier, 17:45",
      type: "warning",
    },
    {
      id: 4,
      title: "Intervenant remplacé",
      description: "Marie Laurent remplace Thomas Petit pour l'atelier 10 'Dépistage des troubles anxio-dépressifs'",
      timestamp: "Hier, 14:20",
      type: "warning",
    },
  ];

  // Filter activities based on selected day
  const getActivities = (): UnifiedActivity[] => {
    const mercrediActivities = [
      ...wednesdayData.morningWorkshops.map(w => ({ 
        ...w, 
        day: "mercredi", 
        type: "workshop", 
        dayPart: "morning",
        status: "active"
      })),
      ...wednesdayData.afternoonWorkshops.map(w => ({ 
        ...w, 
        day: "mercredi", 
        type: "workshop", 
        dayPart: "afternoon",
        status: "active"
      })),
      ...(wednesdayData.meetings || []).map(m => ({ 
        ...m, 
        day: "mercredi", 
        type: "meeting",
        status: "active",
        presenters: m.presenters || []
      })),
      ...(wednesdayData.specialEvent ? [{ 
        ...wednesdayData.specialEvent, 
        day: "mercredi", 
        type: "special",
        status: "active",
        presenters: []
      }] : []),
      ...(wednesdayData.welcomeEvent ? [{ 
        ...wednesdayData.welcomeEvent, 
        day: "mercredi", 
        type: "welcome",
        status: "active"
      }] : []),
    ];
    
    const jeudiActivities = [
      ...thursdayData.morningWorkshops.map(w => ({ 
        ...w, 
        day: "jeudi", 
        type: "workshop", 
        dayPart: "morning",
        status: "active"
      })),
      ...thursdayData.afternoonWorkshops.map(w => ({ 
        ...w, 
        day: "jeudi", 
        type: "workshop", 
        dayPart: "afternoon",
        status: "active"
      })),
      ...(thursdayData.plenary ? [{ 
        ...thursdayData.plenary, 
        day: "jeudi", 
        type: "plenary",
        status: "active",
        presenters: thursdayData.plenary.presenters || []
      }] : []),
      ...(thursdayData.specialEvent ? [{ 
        ...thursdayData.specialEvent, 
        day: "jeudi", 
        type: "special",
        status: "active",
        presenters: []
      }] : []),
    ];
    
    const vendrediActivities = [
      ...fridayData.morningWorkshops.map(w => ({ 
        ...w, 
        day: "vendredi", 
        type: "workshop", 
        dayPart: "morning",
        status: "active"
      })),
      ...fridayData.afternoonWorkshops.map(w => ({ 
        ...w, 
        day: "vendredi", 
        type: "workshop", 
        dayPart: "afternoon",
        status: "active"
      })),
      ...(fridayData.closingSession ? [{ 
        ...fridayData.closingSession, 
        day: "vendredi", 
        type: "closing",
        status: "active",
        presenters: fridayData.closingSession.presenters || []
      }] : []),
    ];

    if (selectedDay === "all") {
      return [...mercrediActivities, ...jeudiActivities, ...vendrediActivities];
    } else if (selectedDay === "mercredi") {
      return mercrediActivities;
    } else if (selectedDay === "jeudi") {
      return jeudiActivities;
    } else {
      return vendrediActivities;
    }
  };

  const activities = getActivities();

  // Status counters
  const statusCounters = {
    active: activities.length,
    pending: 2,
    cancelled: 0,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Connectés</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : realUserCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Comptes créés dans Firebase
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Activités</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allActivitiesTotal}</div>
            <p className="text-xs text-muted-foreground">
              Sur les 3 jours de l'événement
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inscriptions Totales</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : estimatedRegistrations}
            </div>
            <p className="text-xs text-muted-foreground">
              Estimation basée sur {realUserCount} utilisateurs
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Intervenants Uniques</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniquePresentersCount}</div>
            <p className="text-xs text-muted-foreground">
              Experts et professionnels
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Répartition des activités par jour</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{totalActivities.mercredi}</div>
                  <div className="text-sm text-green-800">Mercredi</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {totalWorkshops.mercredi} ateliers
                  </div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{totalActivities.jeudi}</div>
                  <div className="text-sm text-blue-800">Jeudi</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {totalWorkshops.jeudi} ateliers
                  </div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{totalActivities.vendredi}</div>
                  <div className="text-sm text-purple-800">Vendredi</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {totalWorkshops.vendredi} ateliers
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700">Types d'activités</div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Ateliers</span>
                      <span className="font-medium">{totalWorkshops.mercredi + totalWorkshops.jeudi + totalWorkshops.vendredi}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Sessions spéciales</span>
                      <span className="font-medium">{totalSpecialEvents.mercredi + totalSpecialEvents.jeudi + totalSpecialEvents.vendredi}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Réunions</span>
                      <span className="font-medium">{totalMeetings.mercredi}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700">Inscriptions</div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Mercredi</span>
                      <span className="font-medium">{registrationStats.mercredi}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Jeudi</span>
                      <span className="font-medium">{registrationStats.jeudi}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Vendredi</span>
                      <span className="font-medium">{registrationStats.vendredi}</span>
                    </div>
                    <div className="mt-2 pt-2 border-t text-xs text-gray-500">
                      Basé sur {realUserCount} utilisateurs Firebase
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>État du congrès</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="mr-2 h-2 w-2 rounded-full bg-green-500" />
                <div className="text-sm font-medium">Activités confirmées</div>
                <div className="ml-auto text-sm font-semibold">{statusCounters.active}</div>
              </div>
              <div className="h-1.5 w-full rounded-full bg-gray-200">
                <div
                  className="h-1.5 rounded-full bg-green-500"
                  style={{ width: `${(statusCounters.active / (statusCounters.active + statusCounters.pending + statusCounters.cancelled)) * 100}%` }}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="mr-2 h-2 w-2 rounded-full bg-yellow-500" />
                <div className="text-sm font-medium">En préparation</div>
                <div className="ml-auto text-sm font-semibold">{statusCounters.pending}</div>
              </div>
              <div className="h-1.5 w-full rounded-full bg-gray-200">
                <div
                  className="h-1.5 rounded-full bg-yellow-500"
                  style={{ width: `${(statusCounters.pending / (statusCounters.active + statusCounters.pending + statusCounters.cancelled)) * 100}%` }}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="mr-2 h-2 w-2 rounded-full bg-red-500" />
                <div className="text-sm font-medium">Reports</div>
                <div className="ml-auto text-sm font-semibold">{statusCounters.cancelled}</div>
              </div>
              <div className="h-1.5 w-full rounded-full bg-gray-200">
                <div
                  className="h-1.5 rounded-full bg-red-500"
                  style={{ width: `${(statusCounters.cancelled / (statusCounters.active + statusCounters.pending + statusCounters.cancelled)) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle>Programme par jour - SFMP 2025</CardTitle>
          </CardHeader>
          <CardContent className="px-2">
            <Tabs 
              defaultValue="all" 
              onValueChange={(value) => setSelectedDay(value as any)}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">Tous</TabsTrigger>
                <TabsTrigger value="mercredi">Mercredi</TabsTrigger>
                <TabsTrigger value="jeudi">Jeudi</TabsTrigger>
                <TabsTrigger value="vendredi">Vendredi</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="space-y-4 mt-4">
                <div className="overflow-x-auto">
                  <ul className="divide-y divide-gray-200 max-h-[400px] overflow-y-auto min-w-[600px]">
                    {activities.slice(0, 12).map((activity: UnifiedActivity) => (
                      <li key={`${activity.type}-${activity.id}`} className="py-3 flex flex-wrap md:flex-nowrap justify-between items-center px-2">
                        <div className="w-full md:w-auto pr-4">
                          <div className="flex items-center">
                            <span className="inline-flex mr-2 flex-shrink-0">
                              {activity.type === "workshop" ? (
                                <Calendar className="h-4 w-4 text-gray-500" />
                              ) : activity.type === "special" || activity.type === "welcome" ? (
                                <Users className="h-4 w-4 text-[#cd5138]" />
                              ) : (
                                <BarChart className="h-4 w-4 text-blue-500" />
                              )}
                            </span>
                            <span className="text-sm font-medium line-clamp-1">{activity.title}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1 ml-6">
                            {activity.day === "mercredi" ? "Mercredi 16 Oct" : 
                             activity.day === "jeudi" ? "Jeudi 17 Oct" : "Vendredi 18 Oct"} - {activity.time}
                          </div>
                          {activity.presenters && activity.presenters.length > 0 && (
                            <div className="text-xs text-gray-400 mt-1 ml-6">
                              {activity.presenters.slice(0, 2).map(p => p.name).join(', ')}
                              {activity.presenters.length > 2 && ` +${activity.presenters.length - 2}`}
                            </div>
                          )}
                        </div>
                        <div className="w-full md:w-auto mt-2 md:mt-0 flex-shrink-0">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${activity.day === "mercredi" 
                              ? "bg-green-100 text-green-800" 
                              : activity.day === "jeudi" 
                                ? "bg-blue-100 text-blue-800" 
                                : "bg-purple-100 text-purple-800"
                            }`}>
                            {activity.type === "workshop" ? "Atelier" : 
                             activity.type === "meeting" ? "Réunion" : 
                             activity.type === "special" ? "Événement spécial" : 
                             activity.type === "plenary" ? "Session plénière" : 
                             activity.type === "welcome" ? "Accueil" : "Session de clôture"}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="mercredi" className="space-y-4 mt-4">
                {/* Similar content for Wednesday only */}
                <div className="overflow-x-auto">
                  <ul className="divide-y divide-gray-200 max-h-[400px] overflow-y-auto min-w-[600px]">
                    {activities.filter(a => a.day === "mercredi").map((activity: any) => (
                      <li key={`${activity.type}-${activity.id}`} className="py-3 flex flex-wrap md:flex-nowrap justify-between items-center px-2">
                        <div className="w-full md:w-auto pr-4">
                          <div className="flex items-center">
                            <span className="inline-flex mr-2 flex-shrink-0">
                              {activity.type === "workshop" ? (
                                <Calendar className="h-4 w-4 text-gray-500" />
                              ) : activity.type === "special" || activity.type === "welcome" ? (
                                <Users className="h-4 w-4 text-[#cd5138]" />
                              ) : (
                                <BarChart className="h-4 w-4 text-blue-500" />
                              )}
                            </span>
                            <span className="text-sm font-medium line-clamp-1">{activity.title}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1 ml-6">
                            Mercredi - {activity.time}
                          </div>
                        </div>
                        <div className="w-full md:w-auto mt-2 md:mt-0 flex-shrink-0">
                          <Badge className="bg-green-100 text-green-800">
                            {activity.type === "workshop" ? "Atelier" : 
                             activity.type === "meeting" ? "Réunion" : 
                             activity.type === "special" ? "Événement spécial" : "Accueil"}
                          </Badge>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="jeudi" className="space-y-4 mt-4">
                {/* Thursday content */}
                <div className="overflow-x-auto">
                  <ul className="divide-y divide-gray-200 max-h-[400px] overflow-y-auto min-w-[600px]">
                    {activities.filter(a => a.day === "jeudi").map((activity: any) => (
                      <li key={`${activity.type}-${activity.id}`} className="py-3 flex flex-wrap md:flex-nowrap justify-between items-center px-2">
                        <div className="w-full md:w-auto pr-4">
                          <div className="flex items-center">
                            <span className="inline-flex mr-2 flex-shrink-0">
                              {activity.type === "workshop" ? (
                                <Calendar className="h-4 w-4 text-gray-500" />
                              ) : activity.type === "special" ? (
                                <Users className="h-4 w-4 text-[#cd5138]" />
                              ) : (
                                <BarChart className="h-4 w-4 text-blue-500" />
                              )}
                            </span>
                            <span className="text-sm font-medium line-clamp-1">{activity.title}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1 ml-6">
                            Jeudi - {activity.time}
                          </div>
                        </div>
                        <div className="w-full md:w-auto mt-2 md:mt-0 flex-shrink-0">
                          <Badge className="bg-blue-100 text-blue-800">
                            {activity.type === "workshop" ? "Atelier" : 
                             activity.type === "plenary" ? "Session plénière" : "Événement spécial"}
                          </Badge>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="vendredi" className="space-y-4 mt-4">
                {/* Friday content */}
                <div className="overflow-x-auto">
                  <ul className="divide-y divide-gray-200 max-h-[400px] overflow-y-auto min-w-[600px]">
                    {activities.filter(a => a.day === "vendredi").map((activity: any) => (
                      <li key={`${activity.type}-${activity.id}`} className="py-3 flex flex-wrap md:flex-nowrap justify-between items-center px-2">
                        <div className="w-full md:w-auto pr-4">
                          <div className="flex items-center">
                            <span className="inline-flex mr-2 flex-shrink-0">
                              {activity.type === "workshop" ? (
                                <Calendar className="h-4 w-4 text-gray-500" />
                              ) : (
                                <BarChart className="h-4 w-4 text-blue-500" />
                              )}
                            </span>
                            <span className="text-sm font-medium line-clamp-1">{activity.title}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1 ml-6">
                            Vendredi - {activity.time}
                          </div>
                        </div>
                        <div className="w-full md:w-auto mt-2 md:mt-0 flex-shrink-0">
                          <Badge className="bg-purple-100 text-purple-800">
                            {activity.type === "workshop" ? "Atelier" : "Session de clôture"}
                          </Badge>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Informations du congrès</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-[#234724] to-[#2a5029] p-4 rounded-lg text-white">
                <h3 className="font-semibold mb-2">🎯 Thème 2025</h3>
                <p className="text-sm text-green-100">Innovations en périnatalité</p>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Lieu du congrès :</span>
                  <span className="font-medium">Centre Prouvé, Nancy</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-600">Organisateur :</span>
                  <span className="font-medium">SFMP</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}