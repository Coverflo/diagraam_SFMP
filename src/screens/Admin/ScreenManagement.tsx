import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Monitor, Wifi, WifiOff, RefreshCw, Power, PowerOff, Settings, Eye, Play, Pause, RotateCcw, FolderSync as Sync, Grid3X3, List, AlertTriangle, CheckCircle } from "lucide-react";

// Types pour les écrans
interface Screen {
  id: string;
  name: string;
  location: string;
  status: "active" | "inactive" | "error";
  lastSeen: string;
  resolution: string;
  orientation: "landscape" | "portrait";
  currentContent: string;
  brightness: number;
  isOnline: boolean;
}

// Types pour le contenu
interface ContentItem {
  id: string;
  name: string;
  type: "program" | "announcement" | "welcome" | "schedule";
  thumbnail: string;
}

// Données simulées des écrans
const mockScreens: Screen[] = [
  {
    id: "screen-001",
    name: "Écran 1",
    location: "Hall d'entrée",
    status: "active",
    lastSeen: "2025-01-18T10:30:00Z",
    resolution: "1920x1080",
    orientation: "landscape",
    currentContent: "Programme du jour",
    brightness: 85,
    isOnline: true,
  },
  {
    id: "screen-002",
    name: "Écran 2",
    location: "Salle 103",
    status: "active",
    lastSeen: "2025-01-18T10:29:00Z",
    resolution: "1920x1080",
    orientation: "landscape",
    currentContent: "Atelier en cours",
    brightness: 90,
    isOnline: true,
  },
  {
    id: "screen-003",
    name: "Écran 3",
    location: "Salle 104",
    status: "inactive",
    lastSeen: "2025-01-18T09:15:00Z",
    resolution: "1366x768",
    orientation: "landscape",
    currentContent: "Écran de veille",
    brightness: 50,
    isOnline: false,
  },
  {
    id: "screen-004",
    name: "Écran 4",
    location: "Auditorium",
    status: "active",
    lastSeen: "2025-01-18T10:31:00Z",
    resolution: "3840x2160",
    orientation: "landscape",
    currentContent: "Session plénière",
    brightness: 95,
    isOnline: true,
  },
  {
    id: "screen-005",
    name: "Écran 5",
    location: "Cafétéria",
    status: "error",
    lastSeen: "2025-01-18T08:45:00Z",
    resolution: "1920x1080",
    orientation: "portrait",
    currentContent: "Erreur de connexion",
    brightness: 0,
    isOnline: false,
  },
  {
    id: "screen-006",
    name: "Écran 6",
    location: "Salle 105",
    status: "active",
    lastSeen: "2025-01-18T10:30:00Z",
    resolution: "1920x1080",
    orientation: "landscape",
    currentContent: "Prochain atelier",
    brightness: 80,
    isOnline: true,
  },
];

// Contenu disponible
const availableContent: ContentItem[] = [
  {
    id: "content-program",
    name: "Programme du jour",
    type: "program",
    thumbnail: "/public/conference-audience.jpg",
  },
  {
    id: "content-welcome",
    name: "Message de bienvenue",
    type: "welcome",
    thumbnail: "/public/conference-image.jpg",
  },
  {
    id: "content-schedule",
    name: "Horaires détaillés",
    type: "schedule",
    thumbnail: "/public/conference-audience.jpg",
  },
  {
    id: "content-announcement",
    name: "Annonces importantes",
    type: "announcement",
    thumbnail: "/public/conference-image.jpg",
  },
];

export default function ScreenManagement() {
  const [screens, setScreens] = useState<Screen[]>(mockScreens);
  const [selectedScreens, setSelectedScreens] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [previewScreen, setPreviewScreen] = useState<string | null>(null);

  // Simulation de mise à jour en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setScreens(prev => prev.map(screen => ({
        ...screen,
        lastSeen: screen.isOnline ? new Date().toISOString() : screen.lastSeen,
      })));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Gestionnaires d'événements
  const handleScreenSelect = (screenId: string) => {
    setSelectedScreens(prev => 
      prev.includes(screenId)
        ? prev.filter(id => id !== screenId)
        : [...prev, screenId]
    );
  };

  const handleSelectAll = () => {
    const activeScreens = screens.filter(s => s.isOnline).map(s => s.id);
    setSelectedScreens(selectedScreens.length === activeScreens.length ? [] : activeScreens);
  };

  const handleRefreshScreen = (screenId: string) => {
    setIsRefreshing(true);
    setTimeout(() => {
      setScreens(prev => prev.map(screen => 
        screen.id === screenId 
          ? { ...screen, lastSeen: new Date().toISOString() }
          : screen
      ));
      setIsRefreshing(false);
    }, 1000);
  };

  const handleToggleScreen = (screenId: string) => {
    setScreens(prev => prev.map(screen => 
      screen.id === screenId 
        ? { 
            ...screen, 
            status: screen.status === "active" ? "inactive" : "active",
            isOnline: screen.status !== "active"
          }
        : screen
    ));
  };

  const handleUpdateContent = (screenId: string, contentId: string) => {
    const content = availableContent.find(c => c.id === contentId);
    if (content) {
      setScreens(prev => prev.map(screen => 
        screen.id === screenId 
          ? { ...screen, currentContent: content.name }
          : screen
      ));
    }
  };

  const handleSyncAll = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const now = new Date().toISOString();
      setScreens(prev => prev.map(screen => 
        selectedScreens.includes(screen.id)
          ? { ...screen, lastSeen: now, currentContent: "Programme synchronisé" }
          : screen
      ));
      setIsRefreshing(false);
    }, 2000);
  };

  // Fonctions utilitaires
  const getStatusBadge = (status: Screen['status']) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Actif</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactif</Badge>;
      case "error":
        return <Badge className="bg-red-100 text-red-800">Erreur</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Inconnu</Badge>;
    }
  };

  const getStatusIcon = (screen: Screen) => {
    if (!screen.isOnline) return <WifiOff className="h-4 w-4 text-red-500" />;
    if (screen.status === "error") return <AlertTriangle className="h-4 w-4 text-red-500" />;
    if (screen.status === "active") return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <Wifi className="h-4 w-4 text-gray-500" />;
  };

  const formatLastSeen = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffMins < 1440) return `Il y a ${Math.floor(diffMins / 60)}h`;
    return date.toLocaleDateString("fr-FR");
  };

  // Rendu de la grille d'écrans
  const renderScreenGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {screens.map((screen) => (
        <Card 
          key={screen.id}
          className={`relative transition-all cursor-pointer ${
            selectedScreens.includes(screen.id) ? 'ring-2 ring-[#234724]' : ''
          }`}
          onClick={() => handleScreenSelect(screen.id)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                {screen.name}
              </CardTitle>
              {getStatusIcon(screen)}
            </div>
            <p className="text-sm text-gray-600">{screen.location}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Statut</span>
              {getStatusBadge(screen.status)}
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Dernière activité</span>
              <span className="text-sm">{formatLastSeen(screen.lastSeen)}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Résolution</span>
              <span className="text-sm">{screen.resolution}</span>
            </div>
            
            <div className="space-y-2">
              <span className="text-sm text-gray-600">Contenu actuel</span>
              <p className="text-sm font-medium">{screen.currentContent}</p>
            </div>
            
            <div className="space-y-2">
              <span className="text-sm text-gray-600">Luminosité</span>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-[#234724] h-2 rounded-full transition-all"
                  style={{ width: `${screen.brightness}%` }}
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRefreshScreen(screen.id);
                }}
                disabled={isRefreshing || !screen.isOnline}
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleScreen(screen.id);
                }}
              >
                {screen.status === "active" ? (
                  <PowerOff className="h-4 w-4 mr-1" />
                ) : (
                  <Power className="h-4 w-4 mr-1" />
                )}
                {screen.status === "active" ? "Désactiver" : "Activer"}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewScreen(screen.id);
                }}
              >
                <Eye className="h-4 w-4 mr-1" />
                Préview
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Rendu de la liste d'écrans
  const renderScreenList = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <input
                type="checkbox"
                checked={selectedScreens.length === screens.filter(s => s.isOnline).length}
                onChange={handleSelectAll}
                className="rounded"
              />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Écran
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Statut
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contenu
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Dernière activité
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {screens.map((screen) => (
            <tr key={screen.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={selectedScreens.includes(screen.id)}
                  onChange={() => handleScreenSelect(screen.id)}
                  disabled={!screen.isOnline}
                  className="rounded"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <Monitor className="h-5 w-5 mr-2 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{screen.name}</div>
                    <div className="text-sm text-gray-500">{screen.location}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  {getStatusIcon(screen)}
                  {getStatusBadge(screen.status)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{screen.currentContent}</div>
                <div className="text-sm text-gray-500">{screen.resolution}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatLastSeen(screen.lastSeen)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRefreshScreen(screen.id)}
                  disabled={isRefreshing || !screen.isOnline}
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreviewScreen(screen.id)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleScreen(screen.id)}
                >
                  {screen.status === "active" ? (
                    <PowerOff className="h-4 w-4" />
                  ) : (
                    <Power className="h-4 w-4" />
                  )}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const activeScreensCount = screens.filter(s => s.status === "active").length;
  const onlineScreensCount = screens.filter(s => s.isOnline).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Mes Écrans</h1>
          <p className="text-sm text-gray-600 mt-1">
            {onlineScreensCount} écrans en ligne • {activeScreensCount} actifs
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          >
            {viewMode === "grid" ? (
              <List className="h-4 w-4 mr-2" />
            ) : (
              <Grid3X3 className="h-4 w-4 mr-2" />
            )}
            {viewMode === "grid" ? "Vue liste" : "Vue grille"}
          </Button>
          
          <Button
            onClick={handleSyncAll}
            disabled={selectedScreens.length === 0 || isRefreshing}
            className="bg-[#234724] hover:bg-[#1b3a1c]"
          >
            <Sync className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Synchroniser ({selectedScreens.length})
          </Button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Monitor className="h-8 w-8 text-[#234724]" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{screens.length}</p>
                <p className="text-xs text-gray-600">Total écrans</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{activeScreensCount}</p>
                <p className="text-xs text-gray-600">Écrans actifs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Wifi className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{onlineScreensCount}</p>
                <p className="text-xs text-gray-600">En ligne</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{screens.filter(s => s.status === "error").length}</p>
                <p className="text-xs text-gray-600">Erreurs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions en lot */}
      {selectedScreens.length > 0 && (
        <Card className="bg-[#234724] text-white">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="font-medium">{selectedScreens.length} écran(s) sélectionné(s)</p>
                <p className="text-sm text-gray-300">Actions disponibles pour la sélection</p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Select onValueChange={(value) => {
                  selectedScreens.forEach(screenId => {
                    handleUpdateContent(screenId, value);
                  });
                }}>
                  <SelectTrigger className="w-[200px] bg-white text-black">
                    <SelectValue placeholder="Changer le contenu" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableContent.map((content) => (
                      <SelectItem key={content.id} value={content.id}>
                        {content.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button variant="secondary" onClick={handleSyncAll}>
                  <Sync className="h-4 w-4 mr-2" />
                  Synchroniser
                </Button>
                
                <Button variant="secondary" onClick={() => setSelectedScreens([])}>
                  Désélectionner tout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste/Grille des écrans */}
      <Card>
        <CardHeader>
          <CardTitle>Écrans connectés</CardTitle>
        </CardHeader>
        <CardContent>
          {viewMode === "grid" ? renderScreenGrid() : renderScreenList()}
        </CardContent>
      </Card>

      {/* Modal de prévisualisation */}
      {previewScreen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  Prévisualisation - {screens.find(s => s.id === previewScreen)?.name}
                </h3>
                <Button
                  variant="ghost"
                  onClick={() => setPreviewScreen(null)}
                >
                  ✕
                </Button>
              </div>
              
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <Monitor className="h-24 w-24 mx-auto text-gray-400 mb-4" />
                <p className="text-lg font-medium mb-2">
                  {screens.find(s => s.id === previewScreen)?.currentContent}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Résolution: {screens.find(s => s.id === previewScreen)?.resolution}
                </p>
                
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  <Button variant="outline">
                    <Play className="h-4 w-4 mr-2" />
                    Démarrer
                  </Button>
                  <Button variant="outline">
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </Button>
                  <Button variant="outline">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Redémarrer
                  </Button>
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Paramètres
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}