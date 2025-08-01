import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { PlusCircle, Filter, Calendar, Users, Search } from "lucide-react";
import { DataTable } from "../../components/ui/data-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { wednesdayData, thursdayData, fridayData } from "../../data/event-data";

// Combine all activities from the three days
const getAllActivities = () => {
  const mercrediActivities = [
    ...wednesdayData.morningWorkshops.map(w => ({ 
      ...w, 
      day: "Mercredi", 
      type: "Atelier", 
      dayPart: "Matin",
      status: "Programmée"
    })),
    ...wednesdayData.afternoonWorkshops.map(w => ({ 
      ...w, 
      day: "Mercredi", 
      type: "Atelier", 
      dayPart: "Après-midi",
      status: "Programmée"
    })),
    ...(wednesdayData.meetings || []).map(m => ({ 
      ...m, 
      day: "Mercredi", 
      type: "Réunion",
      dayPart: "Matin",
      status: "Programmée"
    })),
    ...(wednesdayData.specialEvent ? [{ 
      ...wednesdayData.specialEvent, 
      day: "Mercredi", 
      type: "Événement spécial",
      dayPart: "Soirée",
      status: "Programmée"
    }] : []),
    ...(wednesdayData.welcomeEvent ? [{ 
      ...wednesdayData.welcomeEvent, 
      day: "Mercredi", 
      type: "Accueil",
      dayPart: "Après-midi",
      status: "Programmée"
    }] : []),
  ];
  
  const jeudiActivities = [
    ...thursdayData.morningWorkshops.map(w => ({ 
      ...w, 
      day: "Jeudi", 
      type: "Atelier", 
      dayPart: "Matin",
      status: "Programmée"
    })),
    ...thursdayData.afternoonWorkshops.map(w => ({ 
      ...w, 
      day: "Jeudi", 
      type: "Atelier", 
      dayPart: "Après-midi",
      status: "Programmée"
    })),
    ...(thursdayData.plenary ? [{ 
      ...thursdayData.plenary, 
      day: "Jeudi", 
      type: "Session plénière",
      dayPart: "Matin",
      status: "Programmée"
    }] : []),
    ...(thursdayData.specialEvent ? [{ 
      ...thursdayData.specialEvent, 
      day: "Jeudi", 
      type: "Événement spécial",
      dayPart: "Soirée",
      status: "Programmée"
    }] : []),
  ];
  
  const vendrediActivities = [
    ...fridayData.morningWorkshops.map(w => ({ 
      ...w, 
      day: "Vendredi", 
      type: "Atelier", 
      dayPart: "Matin",
      status: "Programmée"
    })),
    ...fridayData.afternoonWorkshops.map(w => ({ 
      ...w, 
      day: "Vendredi", 
      type: "Atelier", 
      dayPart: "Après-midi",
      status: "Programmée"
    })),
    ...(fridayData.closingSession ? [{ 
      ...fridayData.closingSession, 
      day: "Vendredi", 
      type: "Session de clôture",
      dayPart: "Après-midi",
      status: "Programmée"
    }] : []),
  ];

  // Add some sample activities with different statuses
  const additionalActivities = [
    { 
      id: 100, 
      title: "Atelier annulé", 
      presenters: [{ name: "Jean Martin", title: "Médecin" }],
      room: "SALLE 106",
      time: "15h30 - 17h00",
      day: "Jeudi", 
      type: "Atelier", 
      dayPart: "Après-midi",
      status: "Annulée"
    },
    { 
      id: 101, 
      title: "Session en attente de confirmation", 
      presenters: [{ name: "Marie Dubois", title: "Sage-femme" }],
      room: "SALLE 103",
      time: "9h00 - 10h30",
      day: "Vendredi", 
      type: "Atelier", 
      dayPart: "Matin",
      status: "En attente"
    },
    { 
      id: 102, 
      title: "Réunion - capacité maximale atteinte", 
      presenters: [{ name: "Paul Dupont", title: "Administrateur" }],
      room: "SALLE 105",
      time: "11h00 - 12h30",
      day: "Mercredi", 
      type: "Réunion", 
      dayPart: "Matin",
      status: "Complète"
    }
  ];

  return [...mercrediActivities, ...jeudiActivities, ...vendrediActivities, ...additionalActivities];
};

export default function ActivityList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  
  const allActivities = getAllActivities();

  // Filter activities based on search term and selected filter
  const filteredActivities = allActivities.filter((activity) => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.day.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.room.toLowerCase().includes(searchTerm.toLowerCase());
                         
    const matchesFilter = !selectedFilter || 
                          (selectedFilter === 'day-mercredi' && activity.day === 'Mercredi') ||
                          (selectedFilter === 'day-jeudi' && activity.day === 'Jeudi') ||
                          (selectedFilter === 'day-vendredi' && activity.day === 'Vendredi') ||
                          (selectedFilter === 'type-atelier' && activity.type === 'Atelier') ||
                          (selectedFilter === 'type-reunion' && activity.type === 'Réunion') ||
                          (selectedFilter === 'type-special' && ['Événement spécial', 'Session plénière', 'Accueil', 'Session de clôture'].includes(activity.type));
                          
    return matchesSearch && matchesFilter;
  });
  
  // Columns for the data table
  const columns = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }: any) => <div className="text-center font-medium">{row.original.id}</div>,
    },
    {
      accessorKey: "title",
      header: "Titre",
      cell: ({ row }: any) => (
        <div className="max-w-[250px] overflow-hidden">
          <div className="font-medium truncate">{row.original.title}</div>
          {row.original.subtitle && (
            <div className="text-xs text-gray-500 truncate">{row.original.subtitle}</div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "day",
      header: "Jour",
      cell: ({ row }: any) => <div>{row.original.day}</div>,
    },
    {
      accessorKey: "dayPart",
      header: "Période",
      cell: ({ row }: any) => <div>{row.original.dayPart}</div>,
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }: any) => <div className="whitespace-nowrap">{row.original.type}</div>,
    },
    {
      accessorKey: "room",
      header: "Lieu",
      cell: ({ row }: any) => <div className="whitespace-nowrap">{row.original.room}</div>,
    },
    {
      accessorKey: "time",
      header: "Horaire",
      cell: ({ row }: any) => <div className="whitespace-nowrap">{row.original.time}</div>,
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }: any) => {
        const status = row.original.status;
        const getStatusStyles = (status: string) => {
          switch (status) {
            case "Programmée":
              return "bg-green-100 text-green-800";
            case "En attente":
              return "bg-yellow-100 text-yellow-800";
            case "Annulée":
              return "bg-red-100 text-red-800";
            case "Complète":
              return "bg-blue-100 text-blue-800";
            default:
              return "bg-gray-100 text-gray-800";
          }
        };
        
        return (
          <Badge className={`font-medium whitespace-nowrap ${getStatusStyles(status)}`}>
            {status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }: any) => (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" asChild className="whitespace-nowrap">
            <Link to={`/admin/activities/${row.original.id}`}>
              Modifier
            </Link>
          </Button>
        </div>
      ),
    },
  ];

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(selectedFilter === filter ? null : filter);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Gestion des activités</h1>
        <Button asChild className="bg-[#234724] hover:bg-[#1b3a1c]">
          <Link to="/admin/activities/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nouvelle activité
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Liste des activités</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center w-full sm:w-auto">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Rechercher..."
                  className="w-full pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="whitespace-nowrap">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtres
                    {selectedFilter && <span className="ml-1 h-2 w-2 rounded-full bg-[#234724]"></span>}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 text-xs font-medium text-gray-500">Par jour</div>
                  <DropdownMenuItem 
                    className={selectedFilter === 'day-mercredi' ? 'bg-gray-100' : ''}
                    onClick={() => handleFilterChange('day-mercredi')}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Mercredi
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className={selectedFilter === 'day-jeudi' ? 'bg-gray-100' : ''}
                    onClick={() => handleFilterChange('day-jeudi')}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Jeudi
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className={selectedFilter === 'day-vendredi' ? 'bg-gray-100' : ''}
                    onClick={() => handleFilterChange('day-vendredi')}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Vendredi
                  </DropdownMenuItem>
                  
                  <div className="px-2 py-1.5 text-xs font-medium text-gray-500 mt-2">Par type</div>
                  <DropdownMenuItem 
                    className={selectedFilter === 'type-atelier' ? 'bg-gray-100' : ''}
                    onClick={() => handleFilterChange('type-atelier')}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Ateliers
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className={selectedFilter === 'type-reunion' ? 'bg-gray-100' : ''}
                    onClick={() => handleFilterChange('type-reunion')}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Réunions
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className={selectedFilter === 'type-special' ? 'bg-gray-100' : ''}
                    onClick={() => handleFilterChange('type-special')}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Événements spéciaux
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {selectedFilter && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedFilter(null)}
                  className="text-xs"
                >
                  Réinitialiser
                </Button>
              )}
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <DataTable
                columns={columns}
                data={filteredActivities}
                searchColumn="title"
                searchPlaceholder="Filtrer par titre..."
              />
            </div>
          </div>
          
          {filteredActivities.length === 0 && (
            <div className="text-center py-6">
              <div className="text-gray-400 mb-2">
                <Calendar className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Aucune activité trouvée</h3>
              <p className="mt-1 text-sm text-gray-500">
                Modifiez vos critères de recherche ou ajoutez une nouvelle activité
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}