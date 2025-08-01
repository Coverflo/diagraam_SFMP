import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Heart, Clock, MapPin, ChevronRight } from "lucide-react";
import { Favorite } from "../hooks/useFavorites";
import { Button } from "./ui/button";

interface FavoritesSectionProps {
  favorites: Favorite[];
  onRemoveFavorite: (activityId: number) => void;
}

export const FavoritesSection: React.FC<FavoritesSectionProps> = ({
  favorites,
  onRemoveFavorite
}) => {
  if (favorites.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-gradient-to-r from-pink-50 to-red-50 border-l-4 border-red-400 mb-8">
      <div className="w-[85%] mx-auto py-6 px-4 md:px-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Heart className="h-6 w-6 text-red-500 fill-current" />
            <h2 className="[font-family:'Space_Grotesk',Helvetica] font-bold text-[#234724] text-xl">
              Mes Favoris
            </h2>
            <Badge className="bg-red-100 text-red-800">
              {favorites.length}
            </Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.slice(0, 6).map((favorite) => (
            <Card key={favorite.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="[font-family:'Montserrat',Helvetica] font-semibold text-[#234724] text-sm line-clamp-2">
                    {favorite.activity_title}
                  </h3>
                  <button
                    onClick={() => onRemoveFavorite(parseInt(favorite.activity_id))}
                    className="ml-2 p-1 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Heart className="h-4 w-4 text-red-500 fill-current hover:text-red-600" />
                  </button>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-xs text-gray-600">
                    <Clock className="h-3 w-3 mr-1" />
                    <span className="font-medium">{favorite.activity_day}</span>
                    <span className="mx-1">•</span>
                    <span>{favorite.activity_time}</span>
                  </div>
                  
                  <div className="flex items-center text-xs text-gray-600">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{favorite.activity_room}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {favorites.length > 6 && (
          <div className="text-center mt-4">
            <Button 
              variant="outline" 
              className="text-[#234724] border-[#234724] hover:bg-[#234724] hover:text-white"
            >
              Voir tous mes favoris ({favorites.length})
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};