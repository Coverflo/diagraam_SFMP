import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { wednesdayData, thursdayData, fridayData } from "../../data/event-data";
import { ArrowLeft, Save, Eye, Trash2, Clock, Calendar, MapPin, Users, AlertTriangle } from "lucide-react";

export default function ActivityForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewActivity = id === "new";
  
  const [activity, setActivity] = useState({
    id: "",
    title: "",
    subtitle: "",
    description: "",
    day: "",
    dayPart: "",
    type: "",
    room: "",
    floor: "",
    time: "",
    status: "Programmée",
    capacity: "50",
    presenters: [{ name: "", title: "" }],
    category: "",
    requirements: "",
  });
  
  const [activeTab, setActiveTab] = useState("details");
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Update window width on resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Find activity by ID when editing
  useEffect(() => {
    if (!isNewActivity) {
      const allActivities = [
        ...wednesdayData.morningWorkshops,
        ...wednesdayData.afternoonWorkshops,
        ...(wednesdayData.meetings || []),
        ...thursdayData.morningWorkshops,
        ...thursdayData.afternoonWorkshops,
        ...fridayData.morningWorkshops,
        ...fridayData.afternoonWorkshops,
      ];
      
      // Special events
      if (wednesdayData.specialEvent && wednesdayData.specialEvent.id.toString() === id) {
        const event = wednesdayData.specialEvent;
        setActivity({
          ...activity,
          id: event.id.toString(),
          title: event.title,
          description: event.description || "",
          day: "Mercredi",
          type: "Événement spécial",
          room: event.location,
          time: event.time,
        });
        return;
      }
      
      // Plenary session
      if (thursdayData.plenary && thursdayData.plenary.id.toString() === id) {
        const plenary = thursdayData.plenary;
        setActivity({
          ...activity,
          id: plenary.id.toString(),
          title: plenary.title,
          day: "Jeudi",
          type: "Session plénière",
          room: plenary.room,
          time: plenary.time,
          presenters: plenary.presenters,
        });
        return;
      }
      
      // Find in regular activities
      const foundActivity = allActivities.find(a => a.id.toString() === id);
      if (foundActivity) {
        let day = "";
        let dayPart = "";
        
        // Determine day and dayPart
        if (wednesdayData.morningWorkshops.includes(foundActivity)) {
          day = "Mercredi";
          dayPart = "Matin";
        } else if (wednesdayData.afternoonWorkshops.includes(foundActivity)) {
          day = "Mercredi";
          dayPart = "Après-midi";
        } else if (thursdayData.morningWorkshops.includes(foundActivity)) {
          day = "Jeudi";
          dayPart = "Matin";
        } else if (thursdayData.afternoonWorkshops.includes(foundActivity)) {
          day = "Jeudi";
          dayPart = "Après-midi";
        } else if (fridayData.morningWorkshops.includes(foundActivity)) {
          day = "Vendredi";
          dayPart = "Matin";
        } else if (fridayData.afternoonWorkshops.includes(foundActivity)) {
          day = "Vendredi";
          dayPart = "Après-midi";
        }
        
        // Determine type
        let type = "Atelier";
        if (wednesdayData.meetings && wednesdayData.meetings.includes(foundActivity)) {
          type = "Réunion";
        }
        
        setActivity({
          ...activity,
          id: foundActivity.id.toString(),
          title: foundActivity.title,
          subtitle: foundActivity.subtitle || "",
          day,
          dayPart,
          type,
          room: foundActivity.room,
          floor: foundActivity.floor || "",
          time: foundActivity.time,
          presenters: foundActivity.presenters,
          category: foundActivity.category || "",
        });
      }
    } else {
      // Generate a new ID for new activities
      const newId = Math.floor(Math.random() * 1000) + 200;
      setActivity({ ...activity, id: newId.toString() });
    }
  }, [id]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setActivity({ ...activity, [name]: value });
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setActivity({ ...activity, [name]: value });
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };
  
  const handlePresenterChange = (index: number, field: string, value: string) => {
    const updatedPresenters = [...activity.presenters];
    updatedPresenters[index] = {
      ...updatedPresenters[index],
      [field]: value,
    };
    setActivity({ ...activity, presenters: updatedPresenters });
    
    // Clear presenters error if it exists
    if (formErrors['presenters']) {
      setFormErrors({ ...formErrors, presenters: '' });
    }
  };
  
  const addPresenter = () => {
    setActivity({
      ...activity,
      presenters: [...activity.presenters, { name: "", title: "" }],
    });
  };
  
  const removePresenter = (index: number) => {
    const updatedPresenters = [...activity.presenters];
    updatedPresenters.splice(index, 1);
    setActivity({ ...activity, presenters: updatedPresenters });
  };
  
  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!activity.title.trim()) {
      errors.title = 'Le titre est requis';
    }
    
    if (!activity.day) {
      errors.day = 'Le jour est requis';
    }
    
    if (!activity.type) {
      errors.type = 'Le type d\'activité est requis';
    }
    
    if (!activity.time.trim()) {
      errors.time = 'L\'horaire est requis';
    }
    
    if (!activity.room.trim()) {
      errors.room = 'La salle est requise';
    }
    
    // Check if at least one presenter has a name
    const hasNamedPresenter = activity.presenters.some(p => p.name.trim() !== '');
    if (!hasNamedPresenter) {
      errors.presenters = 'Au moins un intervenant est requis';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Set active tab to the tab with errors
      if (formErrors.title || formErrors.day || formErrors.type || formErrors.time || formErrors.room) {
        setActiveTab('details');
      } else if (formErrors.presenters) {
        setActiveTab('presenters');
      }
      return;
    }
    
    console.log("Saving activity:", activity);
    // Here you would typically save the data to your backend
    
    // Navigate back to the activities list
    navigate("/admin/activities");
  };
  
  // Get tab title based on screen size
  const getTabTitle = (title: string) => {
    if (windowWidth < 460) {
      // For very small screens, use icons
      switch (title) {
        case 'details': return 'Détails';
        case 'presenters': return 'Intervenants';
        case 'requirements': return 'Infos';
        default: return title;
      }
    }
    return title;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/activities")}
          className="flex items-center text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        <h1 className="text-xl md:text-2xl font-bold truncate max-w-[200px] md:max-w-full">
          {isNewActivity ? "Nouvelle activité" : `Modifier l'activité #${id}`}
        </h1>
      </div>
      
      {/* Show form errors summary if any */}
      {Object.keys(formErrors).length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start space-x-2">
          <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-sm">Veuillez corriger les erreurs suivantes :</p>
            <ul className="mt-1 text-xs space-y-1 list-disc pl-5">
              {Object.entries(formErrors).map(([field, error]) => (
                <li key={field}>{error}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">
            {getTabTitle("details")}
            {(formErrors.title || formErrors.day || formErrors.type || formErrors.time || formErrors.room) && 
              <span className="ml-1.5 h-1.5 w-1.5 rounded-full bg-red-500"></span>
            }
          </TabsTrigger>
          <TabsTrigger value="presenters">
            {getTabTitle("presenters")}
            {formErrors.presenters && 
              <span className="ml-1.5 h-1.5 w-1.5 rounded-full bg-red-500"></span>
            }
          </TabsTrigger>
          <TabsTrigger value="requirements">{getTabTitle("requirements")}</TabsTrigger>
        </TabsList>
        
        <form onSubmit={handleSubmit}>
          {/* Details Tab */}
          <TabsContent value="details" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Informations générales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="flex items-center">
                    Titre
                    {formErrors.title && <span className="text-xs text-red-500 ml-2">*</span>}
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={activity.title}
                    onChange={handleInputChange}
                    placeholder="Titre de l'activité"
                    className={formErrors.title ? 'border-red-500 focus-visible:ring-red-500' : ''}
                  />
                  {formErrors.title && (
                    <p className="text-xs text-red-500">{formErrors.title}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subtitle">Sous-titre</Label>
                  <Input
                    id="subtitle"
                    name="subtitle"
                    value={activity.subtitle}
                    onChange={handleInputChange}
                    placeholder="Sous-titre (optionnel)"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={activity.description}
                    onChange={handleInputChange}
                    placeholder="Description détaillée de l'activité"
                    className="min-h-[100px]"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="day" className="flex items-center">
                      Jour
                      {formErrors.day && <span className="text-xs text-red-500 ml-2">*</span>}
                    </Label>
                    <Select
                      value={activity.day}
                      onValueChange={(value) => handleSelectChange("day", value)}
                    >
                      <SelectTrigger className={formErrors.day ? 'border-red-500 focus-visible:ring-red-500' : ''}>
                        <SelectValue placeholder="Sélectionner un jour" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mercredi">Mercredi</SelectItem>
                        <SelectItem value="Jeudi">Jeudi</SelectItem>
                        <SelectItem value="Vendredi">Vendredi</SelectItem>
                      </SelectContent>
                    </Select>
                    {formErrors.day && (
                      <p className="text-xs text-red-500">{formErrors.day}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dayPart">Période</Label>
                    <Select
                      value={activity.dayPart}
                      onValueChange={(value) => handleSelectChange("dayPart", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une période" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Matin">Matin</SelectItem>
                        <SelectItem value="Après-midi">Après-midi</SelectItem>
                        <SelectItem value="Soirée">Soirée</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type" className="flex items-center">
                      Type d'activité
                      {formErrors.type && <span className="text-xs text-red-500 ml-2">*</span>}
                    </Label>
                    <Select
                      value={activity.type}
                      onValueChange={(value) => handleSelectChange("type", value)}
                    >
                      <SelectTrigger className={formErrors.type ? 'border-red-500 focus-visible:ring-red-500' : ''}>
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Atelier">Atelier</SelectItem>
                        <SelectItem value="Réunion">Réunion</SelectItem>
                        <SelectItem value="Session plénière">Session plénière</SelectItem>
                        <SelectItem value="Événement spécial">Événement spécial</SelectItem>
                        <SelectItem value="Accueil">Accueil</SelectItem>
                        <SelectItem value="Session de clôture">Session de clôture</SelectItem>
                      </SelectContent>
                    </Select>
                    {formErrors.type && (
                      <p className="text-xs text-red-500">{formErrors.type}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status">Statut</Label>
                    <Select
                      value={activity.status}
                      onValueChange={(value) => handleSelectChange("status", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Programmée">Programmée</SelectItem>
                        <SelectItem value="En attente">En attente</SelectItem>
                        <SelectItem value="Annulée">Annulée</SelectItem>
                        <SelectItem value="Complète">Complète</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="time" className="flex items-center">
                    Horaire
                    {formErrors.time && <span className="text-xs text-red-500 ml-2">*</span>}
                  </Label>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    <Input
                      id="time"
                      name="time"
                      value={activity.time}
                      onChange={handleInputChange}
                      placeholder="ex: 10h30 - 12h00"
                      className={formErrors.time ? 'border-red-500 focus-visible:ring-red-500' : ''}
                    />
                  </div>
                  {formErrors.time && (
                    <p className="text-xs text-red-500">{formErrors.time}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="room" className="flex items-center">
                      Salle
                      {formErrors.room && <span className="text-xs text-red-500 ml-2">*</span>}
                    </Label>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      <Input
                        id="room"
                        name="room"
                        value={activity.room}
                        onChange={handleInputChange}
                        placeholder="ex: SALLE 103"
                        className={formErrors.room ? 'border-red-500 focus-visible:ring-red-500' : ''}
                      />
                    </div>
                    {formErrors.room && (
                      <p className="text-xs text-red-500">{formErrors.room}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="floor">Étage</Label>
                    <Input
                      id="floor"
                      name="floor"
                      value={activity.floor}
                      onChange={handleInputChange}
                      placeholder="ex: Étage 1"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacité maximale</Label>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-gray-500" />
                      <Input
                        id="capacity"
                        name="capacity"
                        type="number"
                        value={activity.capacity}
                        onChange={handleInputChange}
                        placeholder="Nombre maximum de participants"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Catégorie</Label>
                    <Select
                      value={activity.category}
                      onValueChange={(value) => handleSelectChange("category", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Soins pédiatriques">Soins pédiatriques</SelectItem>
                        <SelectItem value="Communication médicale">Communication médicale</SelectItem>
                        <SelectItem value="Suivi médical">Suivi médical</SelectItem>
                        <SelectItem value="Préparation à l'accouchement">Préparation à l'accouchement</SelectItem>
                        <SelectItem value="Alimentation">Alimentation</SelectItem>
                        <SelectItem value="Bien-être prénatal">Bien-être prénatal</SelectItem>
                        <SelectItem value="Parentalité">Parentalité</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Presenters Tab */}
          <TabsContent value="presenters" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center justify-between">
                    <span>Intervenants</span>
                    {formErrors.presenters && (
                      <span className="text-xs text-red-500 px-2 py-1 bg-red-50 rounded-md">
                        Au moins un intervenant est requis
                      </span>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {activity.presenters.map((presenter, index) => (
                  <div key={index} className="space-y-4 p-4 border rounded-md relative">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                      onClick={() => removePresenter(index)}
                      disabled={activity.presenters.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`presenter-name-${index}`}>Nom</Label>
                      <Input
                        id={`presenter-name-${index}`}
                        value={presenter.name}
                        onChange={(e) => handlePresenterChange(index, "name", e.target.value)}
                        placeholder="Nom de l'intervenant"
                        className={formErrors.presenters && !presenter.name ? 'border-red-500 focus-visible:ring-red-500' : ''}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`presenter-title-${index}`}>Titre / Fonction</Label>
                      <Input
                        id={`presenter-title-${index}`}
                        value={presenter.title}
                        onChange={(e) => handlePresenterChange(index, "title", e.target.value)}
                        placeholder="ex: Pédiatre - Paris"
                      />
                    </div>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={addPresenter}
                  className="w-full"
                >
                  Ajouter un intervenant
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Requirements Tab */}
          <TabsContent value="requirements" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Informations complémentaires</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="requirements">Besoins spécifiques</Label>
                  <Textarea
                    id="requirements"
                    name="requirements"
                    value={activity.requirements}
                    onChange={handleInputChange}
                    placeholder="Équipements ou matériels nécessaires pour cette activité"
                    className="min-h-[150px]"
                  />
                </div>
                
                <div className="border rounded-md p-4 bg-gray-50">
                  <h3 className="font-medium text-gray-700 mb-2">Image d'illustration</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Choisissez une image pour illustrer cette activité.
                    Vous pouvez la sélectionner depuis la médiathèque.
                  </p>
                  <Button variant="outline" type="button">
                    Sélectionner une image
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <div className="flex flex-wrap sm:flex-nowrap justify-between gap-2 mt-6">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate("/admin/activities")}
              className="w-full sm:w-auto"
            >
              Annuler
            </Button>
            
            <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full sm:w-auto">
              <Button 
                type="button" 
                variant="outline" 
                className="gap-2 w-full sm:w-auto"
              >
                <Eye className="h-4 w-4" />
                <span className="whitespace-nowrap">Aperçu</span>
              </Button>
              <Button 
                type="submit" 
                className="gap-2 bg-[#234724] hover:bg-[#1b3a1c] w-full sm:w-auto"
              >
                <Save className="h-4 w-4" />
                <span className="whitespace-nowrap">Enregistrer</span>
              </Button>
            </div>
          </div>
        </form>
      </Tabs>
    </div>
  );
}