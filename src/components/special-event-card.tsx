import React from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { useTranslation } from "react-i18next";

interface SpecialEventCardProps {
  title: string;
  description?: string;
  location: string;
  time: string;
  image?: string;
  onParticipateClick: () => void;
}

export const SpecialEventCard: React.FC<SpecialEventCardProps> = ({
  title,
  description,
  location,
  time,
  image,
  onParticipateClick
}) => {
  const { t } = useTranslation();
  
  return (
    <Card className="rounded-[7px] relative w-full md:w-[350px] h-auto bg-white shadow-md mb-8">
      <CardContent className="p-5">
        <Badge className="bg-transparent text-[#cd5138] text-[9px] [font-family:'Montserrat',Helvetica] font-bold p-0 shadow-none">
          {t('event')}
        </Badge>
        <h3 className="[font-family:'Montserrat',Helvetica] font-bold text-[#234724] text-base mt-2">
          {title}
        </h3>
        {description && (
          <p className="[font-family:'Montserrat',Helvetica] font-normal text-[#234724] text-sm mt-2">
            {description}
          </p>
        )}

        <div className="flex items-start mt-4">
          <div className="w-[35px] h-[35px] invisible"></div>
          <div className="flex flex-col ml-4">
            <div className="flex items-center">
              <img
                className="w-4 h-4 object-cover"
                alt="Local"
                src="/local-6-2.png"
              />
              <span className="[font-family:'Montserrat',Helvetica] font-semibold ml-2 text-[11px]">
                {location}
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

        <Separator className="my-4" />

        <div className="flex items-center">
          <img
            className="w-11 h-[17px] object-cover"
            alt="Sfmp logo header"
            src="/sfmp-logo-header-4.png"
          />
        </div>

        {image && (
          <div className="flex mt-4">
            <img
              className="w-[133px] h-[83px] object-cover ml-auto"
              alt={title}
              src={image}
            />
          </div>
        )}

        <div className="flex flex-col space-y-3 mt-5">
          {/* Bouton "Voir les détails" */}
          <Button
            variant="outline" 
            className="w-full border-[#cd5138] text-[#cd5138] hover:bg-[#cd5138]/10 transition-colors [font-family:'Montserrat',Helvetica] font-semibold text-xs"
          >
            Voir les détails
          </Button>

          {/* Bouton "Je participe" */}
          <Button
            className="w-full h-[37px] rounded-[7px] [background:linear-gradient(90deg,rgba(205,81,56,1)_0%,rgba(143,41,28,1)_100%)] [font-family:'Montserrat',Helvetica] font-bold text-white text-xs"
            onClick={onParticipateClick}
          >
            {t('participate')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};