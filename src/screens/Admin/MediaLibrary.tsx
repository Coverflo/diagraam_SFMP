import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Upload, Search, FolderOpen, Image, X, Edit2, Trash2, Eye, ChevronLeft } from "lucide-react";

// Sample media data
const sampleMedia = [
  {
    id: 1,
    name: "conference-audience.jpg",
    type: "image",
    url: "/public/conference-audience.jpg",
    size: "1.2 MB",
    dimensions: "1800 x 1200",
    folder: "event",
    uploaded: "2025-02-15T10:30:00Z",
  },
  {
    id: 2,
    name: "workshop-image.jpg",
    type: "image",
    url: "https://images.unsplash.com/photo-1517048676732-d65bc937f952",
    size: "850 KB",
    dimensions: "1200 x 800",
    folder: "workshops",
    uploaded: "2025-02-20T14:15:00Z",
  },
  {
    id: 3,
    name: "speaker-portrait.jpg",
    type: "image",
    url: "https://images.unsplash.com/photo-1560250097-0b93528c311a",
    size: "720 KB",
    dimensions: "1000 x 1500",
    folder: "presenters",
    uploaded: "2025-02-25T09:45:00Z",
  },
  {
    id: 4,
    name: "venue-exterior.jpg",
    type: "image",
    url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2",
    size: "1.5 MB",
    dimensions: "1600 x 900",
    folder: "venue",
    uploaded: "2025-03-01T16:20:00Z",
  },
  {
    id: 5,
    name: "workshop-room.jpg",
    type: "image",
    url: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205",
    size: "980 KB",
    dimensions: "1400 x 940",
    folder: "venue",
    uploaded: "2025-03-05T11:10:00Z",
  },
  {
    id: 6,
    name: "atelier-medical.jpg",
    type: "image",
    url: "https://images.unsplash.com/photo-1579684385127-1ef15d508118",
    size: "760 KB",
    dimensions: "1200 x 800",
    folder: "workshops",
    uploaded: "2025-03-08T13:25:00Z",
  },
];

// Folder options
const folders = [
  { label: "Tous les dossiers", value: "all" },
  { label: "Événement", value: "event" },
  { label: "Ateliers", value: "workshops" },
  { label: "Intervenants", value: "presenters" },
  { label: "Lieu", value: "venue" },
];

export default function MediaLibrary() {
  const [media, setMedia] = useState(sampleMedia);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("all");
  const [selectedMedia, setSelectedMedia] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Update window width on resize
  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Filter media by search term and folder
  const filteredMedia = media.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFolder = selectedFolder === "all" || item.folder === selectedFolder;
    return matchesSearch && matchesFolder;
  });
  
  // Handle file drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      const newMedia = acceptedFiles.map((file, index) => ({
        id: Math.max(...media.map(m => m.id)) + index + 1,
        name: file.name,
        type: "image",
        // Create an object URL for preview
        url: URL.createObjectURL(file),
        size: `${(file.size / 1024).toFixed(0)} KB`,
        dimensions: "1200 x 800", // Placeholder
        folder: selectedFolder === "all" ? "event" : selectedFolder,
        uploaded: new Date().toISOString(),
      }));
      
      setMedia([...newMedia, ...media]);
      setIsUploading(false);
    }, 1500);
  }, [media, selectedFolder]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    }
  });
  
  // Delete media
  const handleDelete = (id: number) => {
    setMedia(media.filter(item => item.id !== id));
    if (selectedMedia === id) {
      setSelectedMedia(null);
    }
  };
  
  // Render media details panel
  const renderMediaDetails = () => {
    if (selectedMedia === null) return null;
    
    const selected = media.find(item => item.id === selectedMedia);
    if (!selected) return null;
    
    return (
      <div className={`border-t lg:border-t-0 lg:border-l border-gray-200 p-4 ${windowWidth < 1024 ? 'w-full' : 'w-full lg:w-1/3'}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Détails du média</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedMedia(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="mb-4">
          <img
            src={selected.url}
            alt={selected.name}
            className="w-full h-auto rounded-md object-cover"
          />
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="media-name">Nom du fichier</Label>
            <Input
              id="media-name"
              value={selected.name}
              readOnly
              className="mt-1"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Type</Label>
              <p className="text-sm mt-1">{selected.type}</p>
            </div>
            <div>
              <Label>Taille</Label>
              <p className="text-sm mt-1">{selected.size}</p>
            </div>
          </div>
          
          <div>
            <Label>Dimensions</Label>
            <p className="text-sm mt-1">{selected.dimensions}</p>
          </div>
          
          <div>
            <Label>Dossier</Label>
            <Select defaultValue={selected.folder}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Sélectionner un dossier" />
              </SelectTrigger>
              <SelectContent>
                {folders.filter(f => f.value !== "all").map((folder) => (
                  <SelectItem key={folder.value} value={folder.value}>
                    {folder.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Ajouté le</Label>
            <p className="text-sm mt-1">
              {new Date(selected.uploaded).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => window.open(selected.url, "_blank")}
            >
              <Eye className="mr-2 h-4 w-4" /> Voir
            </Button>
            <Button
              variant="outline"
              className="flex-1"
            >
              <Edit2 className="mr-2 h-4 w-4" /> Modifier
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => handleDelete(selected.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Supprimer
            </Button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Médiathèque</h1>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Bibliothèque d'images</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row">
            <div className={`w-full ${selectedMedia && windowWidth >= 1024 ? 'lg:w-2/3' : 'w-full'}`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
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
                
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Select
                    value={selectedFolder}
                    onValueChange={setSelectedFolder}
                  >
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Sélectionner un dossier" />
                    </SelectTrigger>
                    <SelectContent>
                      {folders.map((folder) => (
                        <SelectItem key={folder.value} value={folder.value}>
                          {folder.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Upload area */}
              <div 
                {...getRootProps()} 
                className={`border-2 border-dashed rounded-md p-8 mb-6 text-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-[#234724] bg-[#2347240f]' : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 font-medium">
                  Glissez-déposez des fichiers ici, ou cliquez pour sélectionner des fichiers
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Formats supportés: JPEG, PNG, GIF
                </p>
                
                {isUploading && (
                  <div className="mt-4">
                    <div className="h-1.5 w-full rounded-full bg-gray-200">
                      <div
                        className="h-1.5 rounded-full bg-[#234724] animate-pulse"
                        style={{ width: "75%" }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Chargement en cours...</p>
                  </div>
                )}
              </div>
              
              {/* Media grid */}
              {filteredMedia.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-h-[600px] overflow-y-auto pb-4">
                  {filteredMedia.map((item) => (
                    <div
                      key={item.id}
                      className={`group relative rounded-md overflow-hidden border cursor-pointer hover:shadow-md transition-shadow ${
                        selectedMedia === item.id ? 'ring-2 ring-[#234724]' : ''
                      }`}
                      onClick={() => setSelectedMedia(item.id)}
                    >
                      <div className="aspect-square relative">
                        <img
                          src={item.url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 bg-white bg-opacity-80 hover:bg-opacity-100"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(item.url, "_blank");
                              }}
                            >
                              <Eye className="h-4 w-4 text-gray-700" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 bg-white bg-opacity-80 hover:bg-opacity-100"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(item.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        <p className="text-xs font-medium truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.size}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border rounded-md">
                  <FolderOpen className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                  <h3 className="text-sm font-medium text-gray-700">Aucun média trouvé</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Essayez de modifier vos critères de recherche ou ajoutez de nouveaux médias
                  </p>
                </div>
              )}
              
              {/* Mobile back button (when details are shown) */}
              {selectedMedia && windowWidth < 1024 && (
                <div className="mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedMedia(null)}
                    className="w-full flex items-center justify-center"
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Retour à la galerie
                  </Button>
                </div>
              )}
            </div>
            
            {/* Hide main panel on mobile when details are shown */}
            {windowWidth < 1024 && selectedMedia && renderMediaDetails()}
            
            {/* Always show details panel on desktop */}
            {windowWidth >= 1024 && selectedMedia && renderMediaDetails()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}