import React from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { useTranslation } from "react-i18next";

interface PlenarySessionCardProps {
  id: number;
  title: string;
  presenters: { name: string; title: string }[];
  room: string;
  time: string;
  onFavoriteClick: () => void;
}

export const PlenarySessionCard: React.FC<PlenarySessionCardProps> = ({
  id,
  title,
  presenters,
  room,
  time,
  onFavoriteClick
}) => {
  const { t } = useTranslation();
  
  return (
    <Card className="rounded-[7px] relative bg-white shadow-md col-span-1 md:col-span-2 lg:col-span-3">
      <CardContent className="p-0">
        <div className="p-5">
          <Badge className="bg-transparent text-[#cd5138] text-[13px] [font-family:'Montserrat',Helvetica] font-bold p-0 shadow-none">
            {t('plenary_session')}
          </Badge>
          <div className="absolute top-[15px] right-[15px]">
            <img
              className="w-[17px] h-[15px] object-cover cursor-pointer hover:opacity-70 transition-opacity"
              alt="Favorite"
              src="/coeurr-3x-13.png"
              onClick={onFavoriteClick}
            />
          </div>
          <h3 className="[font-family:'Montserrat',Helvetica] font-bold text-[#234724] text-lg mt-2">
            {title}
          </h3>

          <div className="flex items-start mt-4">
            <div className="w-[120px] h-auto">
              <img
                className="w-full h-auto max-h-[113px] object-cover"
                alt="Conférence plénière"
                src="/capture-d-e-cran-2025-03-18-a--09-44-56-1.png"
              />
            </div>
            
            <div className="flex flex-col ml-4">
              <div className="flex items-center">
                <img
                  className="w-4 h-4 object-cover"
                  alt="Local"
                  src="/local-6-2.png"
                />
                <span className="[font-family:'Montserrat',Helvetica] font-semibold ml-2 text-[11px]">
                  {room}
                </span>
              </div>
              <div className="flex items-center mt-1">
                <img
                  className="w-[15px] h-[15px] object-cover"
                  alt="Time and date"
                  src="/time-and-date-6-2.png"
                />
                <span className="[font-family:'Montserrat',Helvetica] font-semibold text-[11px] ml-2">
                  {time}
                </span>
              </div>
            </div>
          </div>

          <Separator className="my-2" />

          <div className="[font-family:'Montserrat',Helvetica] text-black text-[9px] mt-2">
            {presenters.map((presenter, index) => (
              <div key={index}>
                <span className="font-semibold">{presenter.name}, </span>
                <span>{presenter.title}</span>
                {index < presenters.length - 1 && <br />}
              </div>
            ))}
          </div>
          
          {/* Bouton "Voir les détails" */}
          <div className="mt-5 w-full">
            <Button 
              variant="outline" 
              className="w-full border-[#cd5138] text-[#cd5138] hover:bg-[#cd5138]/10 transition-colors [font-family:'Montserrat',Helvetica] font-semibold text-xs"
            >
              Voir les détails
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};