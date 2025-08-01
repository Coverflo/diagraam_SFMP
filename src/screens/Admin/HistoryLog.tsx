import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { 
  PlusCircle, 
  Edit2, 
  Trash2, 
  RefreshCw, 
  Calendar, 
  Image, 
  Clock, 
  Users 
} from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Button } from "../../components/ui/button";

// Sample history data
const historyData = [
  {
    id: 1,
    action: "create",
    itemType: "activity",
    itemName: "Dépistage et prise en charge des troubles anxio-dépressifs périnataux",
    user: "admin@sfmp.fr",
    timestamp: "2025-03-10T15:45:00Z",
    details: "Création d'un nouvel atelier pour le jeudi matin",
  },
  {
    id: 2,
    action: "update",
    itemType: "activity",
    itemName: "Les mots pour le dire",
    user: "editor@sfmp.fr",
    timestamp: "2025-03-10T14:20:00Z",
    details: "Modification de l'horaire: 10h30 - 12h00 → 11h00 - 12h30",
  },
  {
    id: 3,
    action: "delete",
    itemType: "activity",
    itemName: "Réunion du comité scientifique",
    user: "admin@sfmp.fr",
    timestamp: "2025-03-10T11:10:00Z",
    details: "Suppression d'une réunion planifiée le mercredi matin",
  },
  {
    id: 4,
    action: "upload",
    itemType: "media",
    itemName: "conference-hall.jpg",
    user: "media@sfmp.fr",
    timestamp: "2025-03-09T16:35:00Z",
    details: "Ajout d'une nouvelle image dans la médiathèque",
  },
  {
    id: 5,
    action: "update",
    itemType: "activity",
    itemName: "Soirée de Gala",
    user: "admin@sfmp.fr",
    timestamp: "2025-03-09T14:50:00Z",
    details: "Mise à jour de la description et du lieu de l'événement",
  },
  {
    id: 6,
    action: "restore",
    itemType: "activity",
    itemName: "Préparation à la naissance en cas de pathologies maternelles chroniques",
    user: "editor@sfmp.fr",
    timestamp: "2025-03-09T10:25:00Z",
    details: "Restauration de la version précédente de l'atelier",
  },
  {
    id: 7,
    action: "create",
    itemType: "activity",
    itemName: "Session de clôture : Perspectives futures en périnatalité",
    user: "admin@sfmp.fr",
    timestamp: "2025-03-08T17:05:00Z",
    details: "Ajout de la session de clôture pour vendredi après-midi",
  },
  {
    id: 8,
    action: "update",
    itemType: "activity",
    itemName: "Nutrition et grossesse",
    user: "editor@sfmp.fr",
    timestamp: "2025-03-08T15:40:00Z",
    details: "Ajout d'un intervenant supplémentaire à l'atelier",
  },
  {
    id: 9,
    action: "delete",
    itemType: "media",
    itemName: "old-venue-map.jpg",
    user: "media@sfmp.fr",
    timestamp: "2025-03-08T13:15:00Z",
    details: "Suppression d'une image obsolète de la médiathèque",
  },
  {
    id: 10,
    action: "update",
    itemType: "activity",
    itemName: "Soins de développement centrés sur l'enfant et sa famille",
    user: "admin@sfmp.fr",
    timestamp: "2025-03-08T11:30:00Z",
    details: "Mise à jour du contenu de l'atelier et des intervenants",
  },
];

export default function HistoryLog() {
  // Filter history data by tab
  const activityHistory = historyData.filter((item) => item.itemType === "activity");
  const mediaHistory = historyData.filter((item) => item.itemType === "media");
  
  // Render history item
  const renderHistoryItem = (item: any) => {
    // Action icon
    const getActionIcon = () => {
      switch (item.action) {
        case "create":
          return <PlusCircle className="h-5 w-5 text-green-500 flex-shrink-0" />;
        case "update":
          return <Edit2 className="h-5 w-5 text-blue-500 flex-shrink-0" />;
        case "delete":
          return <Trash2 className="h-5 w-5 text-red-500 flex-shrink-0" />;
        case "upload":
          return <Image className="h-5 w-5 text-purple-500 flex-shrink-0" />;
        case "restore":
          return <RefreshCw className="h-5 w-5 text-yellow-500 flex-shrink-0" />;
        default:
          return <Calendar className="h-5 w-5 text-gray-500 flex-shrink-0" />;
      }
    };
    
    // Action badge
    const getActionBadge = () => {
      switch (item.action) {
        case "create":
          return <Badge className="bg-green-100 text-green-800 whitespace-nowrap">Création</Badge>;
        case "update":
          return <Badge className="bg-blue-100 text-blue-800 whitespace-nowrap">Modification</Badge>;
        case "delete":
          return <Badge className="bg-red-100 text-red-800 whitespace-nowrap">Suppression</Badge>;
        case "upload":
          return <Badge className="bg-purple-100 text-purple-800 whitespace-nowrap">Importation</Badge>;
        case "restore":
          return <Badge className="bg-yellow-100 text-yellow-800 whitespace-nowrap">Restauration</Badge>;
        default:
          return <Badge className="bg-gray-100 text-gray-800 whitespace-nowrap">Action</Badge>;
      }
    };
    
    // Type icon
    const getTypeIcon = () => {
      switch (item.itemType) {
        case "activity":
          return <Calendar className="h-4 w-4 text-[#234724]" />;
        case "media":
          return <Image className="h-4 w-4 text-[#cd5138]" />;
        default:
          return null;
      }
    };
    
    // Format date
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };
    
    return (
      <div className="flex space-x-4 py-4 border-b border-gray-100 last:border-0">
        <div className="flex-shrink-0 pt-1">
          {getActionIcon()}
        </div>
        <div className="flex-grow min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
            <div className="flex flex-wrap items-center gap-2 mb-1 sm:mb-0">
              <span className="font-medium truncate max-w-[200px] sm:max-w-[300px]">{item.itemName}</span>
              {getActionBadge()}
              <div className="inline-flex items-center">
                {getTypeIcon()}
                <span className="text-xs text-gray-500 ml-1 whitespace-nowrap">
                  {item.itemType === "activity" ? "Activité" : "Média"}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
              <div className="flex items-center">
                <Users className="h-3 w-3 mr-1" />
                <span className="truncate max-w-[100px] sm:max-w-none">{item.user}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                <span>{formatDate(item.timestamp)}</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600 break-words">{item.details}</p>
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Historique des modifications</h1>
        <Button variant="outline" className="whitespace-nowrap">
          <RefreshCw className="mr-2 h-4 w-4" />
          Actualiser
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Journal des modifications</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">Tout</TabsTrigger>
              <TabsTrigger value="activities">Activités</TabsTrigger>
              <TabsTrigger value="media">Médiathèque</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-4">
              <div className="max-h-[600px] overflow-y-auto">
                {historyData.map((item) => (
                  <div key={item.id}>
                    {renderHistoryItem(item)}
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="activities" className="mt-4">
              <div className="max-h-[600px] overflow-y-auto">
                {activityHistory.map((item) => (
                  <div key={item.id}>
                    {renderHistoryItem(item)}
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="media" className="mt-4">
              <div className="max-h-[600px] overflow-y-auto">
                {mediaHistory.map((item) => (
                  <div key={item.id}>
                    {renderHistoryItem(item)}
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}