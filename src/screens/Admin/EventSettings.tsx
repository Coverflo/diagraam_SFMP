import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Separator } from "../../components/ui/separator";
import { CalendarDays, MapPin, Clock, Save, Building, Users, Link as LinkIcon } from "lucide-react";

export default function EventSettings() {
  const [eventData, setEventData] = useState({
    name: "Congrès SFMP 2025",
    subtitle: "Innovations en périnatalité",
    startDate: "2025-10-16",
    endDate: "2025-10-18",
    venue: "Centre Prouvé",
    city: "Nancy",
    address: "1 Place de la République, 54000 Nancy",
    capacity: "500",
    description: "Le congrès annuel de la Société Française de Médecine Périnatale, rassemblant chercheurs, médecins et professionnels de santé autour des dernières avancées dans le domaine de la périnatalité.",
    organizerName: "Société Française de Médecine Périnatale",
    organizerEmail: "contact@sfmp2025.fr",
    organizerPhone: "+33 (0)3 83 XX XX XX",
    websiteUrl: "https://sfmp2025.fr",
    registrationUrl: "https://sfmp2025.fr/inscription"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save event data logic would go here
    console.log("Event data saved:", eventData);
    // Show success notification
    alert("Les paramètres de l'événement ont été enregistrés avec succès");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Configuration de l'événement</h1>
        <Button 
          type="submit" 
          form="event-form"
          className="bg-[#234724] hover:bg-[#1b3a1c] flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Enregistrer les modifications
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">Informations générales</TabsTrigger>
          <TabsTrigger value="location">Lieu et dates</TabsTrigger>
          <TabsTrigger value="organizer">Organisateur</TabsTrigger>
        </TabsList>

        <form id="event-form" onSubmit={handleSubmit}>
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Détails de l'événement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom de l'événement</Label>
                  <Input
                    id="name"
                    name="name"
                    value={eventData.name}
                    onChange={handleInputChange}
                    placeholder="Nom de l'événement"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subtitle">Sous-titre / Thème</Label>
                  <Input
                    id="subtitle"
                    name="subtitle"
                    value={eventData.subtitle}
                    onChange={handleInputChange}
                    placeholder="Sous-titre ou thème de l'événement"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={eventData.description}
                    onChange={handleInputChange}
                    placeholder="Description détaillée de l'événement"
                    className="min-h-[150px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacité maximale</Label>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-gray-500" />
                    <Input
                      id="capacity"
                      name="capacity"
                      type="number"
                      value={eventData.capacity}
                      onChange={handleInputChange}
                      placeholder="Nombre maximum de participants"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Capacité totale de l'événement, tous jours confondus
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Liens web</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="websiteUrl">Site web officiel</Label>
                  <div className="flex items-center">
                    <LinkIcon className="h-4 w-4 mr-2 text-gray-500" />
                    <Input
                      id="websiteUrl"
                      name="websiteUrl"
                      value={eventData.websiteUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registrationUrl">URL d'inscription</Label>
                  <div className="flex items-center">
                    <LinkIcon className="h-4 w-4 mr-2 text-gray-500" />
                    <Input
                      id="registrationUrl"
                      name="registrationUrl"
                      value={eventData.registrationUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com/register"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="location" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dates et horaires</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Date de début</Label>
                    <div className="flex items-center">
                      <CalendarDays className="h-4 w-4 mr-2 text-gray-500" />
                      <Input
                        id="startDate"
                        name="startDate"
                        type="date"
                        value={eventData.startDate}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">Date de fin</Label>
                    <div className="flex items-center">
                      <CalendarDays className="h-4 w-4 mr-2 text-gray-500" />
                      <Input
                        id="endDate"
                        name="endDate"
                        type="date"
                        value={eventData.endDate}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Horaires quotidiens</Label>
                  <p className="text-sm text-gray-600 mb-4">
                    Définissez les heures d'ouverture et de fermeture pour chaque jour de l'événement
                  </p>

                  {/* Jour 1 */}
                  <div className="bg-gray-50 p-4 rounded-md mb-2">
                    <div className="flex items-center mb-2">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="font-medium">Premier jour (Mercredi)</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="day1Start" className="text-sm">Heure d'ouverture</Label>
                        <Input id="day1Start" type="time" defaultValue="09:30" />
                      </div>
                      <div>
                        <Label htmlFor="day1End" className="text-sm">Heure de fermeture</Label>
                        <Input id="day1End" type="time" defaultValue="18:15" />
                      </div>
                    </div>
                  </div>

                  {/* Jour 2 */}
                  <div className="bg-gray-50 p-4 rounded-md mb-2">
                    <div className="flex items-center mb-2">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="font-medium">Deuxième jour (Jeudi)</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="day2Start" className="text-sm">Heure d'ouverture</Label>
                        <Input id="day2Start" type="time" defaultValue="08:30" />
                      </div>
                      <div>
                        <Label htmlFor="day2End" className="text-sm">Heure de fermeture</Label>
                        <Input id="day2End" type="time" defaultValue="17:30" />
                      </div>
                    </div>
                  </div>

                  {/* Jour 3 */}
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex items-center mb-2">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="font-medium">Troisième jour (Vendredi)</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="day3Start" className="text-sm">Heure d'ouverture</Label>
                        <Input id="day3Start" type="time" defaultValue="08:30" />
                      </div>
                      <div>
                        <Label htmlFor="day3End" className="text-sm">Heure de fermeture</Label>
                        <Input id="day3End" type="time" defaultValue="17:30" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informations sur le lieu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="venue">Nom du lieu</Label>
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-2 text-gray-500" />
                    <Input
                      id="venue"
                      name="venue"
                      value={eventData.venue}
                      onChange={handleInputChange}
                      placeholder="Nom du lieu"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Ville</Label>
                    <Input
                      id="city"
                      name="city"
                      value={eventData.city}
                      onChange={handleInputChange}
                      placeholder="Ville"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Adresse complète</Label>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      <Input
                        id="address"
                        name="address"
                        value={eventData.address}
                        onChange={handleInputChange}
                        placeholder="Adresse du lieu"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <p className="text-sm font-medium mb-2">Aperçu de la carte</p>
                  <div className="h-[200px] bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Carte interactive du lieu</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Une carte interactive sera générée à partir de l'adresse saisie
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="organizer" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations sur l'organisateur</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="organizerName">Nom de l'organisateur</Label>
                  <Input
                    id="organizerName"
                    name="organizerName"
                    value={eventData.organizerName}
                    onChange={handleInputChange}
                    placeholder="Nom de l'organisation"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="organizerEmail">Email de contact</Label>
                    <Input
                      id="organizerEmail"
                      name="organizerEmail"
                      type="email"
                      value={eventData.organizerEmail}
                      onChange={handleInputChange}
                      placeholder="email@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organizerPhone">Téléphone de contact</Label>
                    <Input
                      id="organizerPhone"
                      name="organizerPhone"
                      value={eventData.organizerPhone}
                      onChange={handleInputChange}
                      placeholder="+33 (0)X XX XX XX XX"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Logo de l'organisateur</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                    <div className="flex justify-center mb-2">
                      <img
                        src="/sfmp-logo-header-4.png"
                        alt="Logo organisateur"
                        className="h-12 object-contain"
                      />
                    </div>
                    <Button 
                      variant="outline" 
                      type="button" 
                      className="text-sm"
                    >
                      Modifier le logo
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Réseaux sociaux</Label>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className="w-8 h-8 mr-2 flex items-center justify-center bg-blue-100 text-blue-600 rounded">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                        </svg>
                      </span>
                      <Input defaultValue="https://facebook.com/sfmp" placeholder="URL Facebook" />
                    </div>
                    
                    <div className="flex items-center">
                      <span className="w-8 h-8 mr-2 flex items-center justify-center bg-blue-100 text-blue-600 rounded">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                        </svg>
                      </span>
                      <Input defaultValue="https://twitter.com/sfmp" placeholder="URL Twitter" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </form>
      </Tabs>
    </div>
  );
}