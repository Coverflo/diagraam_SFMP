import React from "react";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";

type Presenter = {
  name: string;
  title: string;
};

export interface WorkshopCardProps {
  id: number;
  title: string;
  subtitle?: string;
  presenters: Presenter[];
  room: string;
  floor?: string;
  time: string;
  icon?: string;
  introduction?: string;
  onFavoriteClick: (activity: any) => void;
  isFavorite?: boolean;
}

export const WorkshopCard: React.FC<WorkshopCardProps> = ({
  id,
  title,
  subtitle,
  presenters,
  room,
  floor,
  time,
  icon,
  introduction,
  onFavoriteClick,
  isFavorite = false
}) => {
  const { t } = useTranslation();
  const [showIntroduction, setShowIntroduction] = React.useState(false);

  const handleFavoriteClick = () => {
    onFavoriteClick({
      id,
      title,
      subtitle,
      presenters,
      room,
      floor,
      time
    });
  };
  
  return (
    <>
    <Card className="rounded-[7px] relative bg-white shadow-md">
      <CardContent className="p-0">
        <div className="p-5">
          <Badge className="bg-transparent text-[#cd5138] text-[13px] [font-family:'Montserrat',Helvetica] font-bold p-0 shadow-none">
            {t('workshop')} {id}
          </Badge>
          <div className="absolute top-[15px] right-[15px]">
            <button
              onClick={handleFavoriteClick}
              className="p-1 hover:bg-red-50 rounded-full transition-colors"
            >
              <img
                className="w-[17px] h-[15px] object-cover transition-opacity"
                alt="Favorite"
                src="/coeurr-3x-13.png"
                style={{
                  filter: isFavorite ? 'none' : 'grayscale(100%)',
                  opacity: isFavorite ? 1 : 0.5
                }}
              />
            </button>
          </div>
          <h3 className="[font-family:'Montserrat',Helvetica] font-bold text-[#234724] text-base mt-2">
            {title}
            {subtitle && (
              <span className="font-normal text-sm block">
                {subtitle}
              </span>
            )}
          </h3>

          <div className="flex items-start mt-4">
            {icon && (
              <div className="w-[39px] h-[39px] overflow-hidden rounded-full flex items-center justify-center bg-gray-200">
                <img
                  className="w-full h-full object-cover"
                  alt="Workshop icon"
                  src={icon}
                />
              </div>
            )}
            {!icon && (
              <div className="w-[39px] h-[39px] bg-[#d9d9d9] rounded-full"></div>
            )}
            <div className="flex flex-col ml-4">
              <div className="flex items-center">
                <img
                  className="w-4 h-4 object-cover"
                  alt="Local"
                  src="/local-6-2.png"
                />
                <span className="[font-family:'Montserrat',Helvetica] ml-2 text-[11px]">
                  <span className="font-semibold">
                    {room}
                  </span>{" "}
                  {floor && `- ${floor}`}
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
                <span className="font-semibold">
                  {presenter.name},{" "}
                </span>
                <span>{presenter.title}</span>
                {index < presenters.length - 1 && <br />}
              </div>
            ))}
          </div>

          {/* Bouton "Introduction" ou masqué s'il n'y a pas d'introduction */}
          {introduction && (
          <div className="mt-5 w-full">
            <Button 
              variant="outline" 
              className="w-full border-[#cd5138] text-[#cd5138] hover:bg-[#cd5138]/10 transition-colors [font-family:'Montserrat',Helvetica] font-semibold text-xs"
              onClick={() => setShowIntroduction(true)}
            >
              Introduction
            </Button>
          </div>
          )}
        </div>
      </CardContent>
    </Card>
    
    {/* Modal d'introduction */}
    {showIntroduction && introduction && (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <Badge className="bg-[#cd5138] text-white text-[11px] [font-family:'Montserrat',Helvetica] font-bold mb-2">
                  {t('workshop')} {id}
                </Badge>
                <h3 className="text-lg font-bold text-[#234724] [font-family:'Montserrat',Helvetica]">
                  {title}
                </h3>
                {subtitle && (
                  <p className="text-sm text-gray-600 [font-family:'Montserrat',Helvetica]">
                    {subtitle}
                  </p>
                )}
              </div>
              <button 
                onClick={() => setShowIntroduction(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4">
              <h4 className="font-semibold text-[#234724] [font-family:'Montserrat',Helvetica] text-sm mb-2">
                Intervenants :
              </h4>
              <div className="text-sm text-gray-700 [font-family:'Montserrat',Helvetica]">
                {presenters.map((presenter, index) => (
                  <div key={index} className="mb-1">
                    <span className="font-semibold">{presenter.name}</span>
                    <span className="text-gray-600">, {presenter.title}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center gap-4 text-sm text-gray-600 [font-family:'Montserrat',Helvetica]">
                <div className="flex items-center">
                  <img className="w-4 h-4 mr-2" alt="Local" src="/local-6-2.png" />
                  <span className="font-semibold">{room}</span>
                  {floor && <span> - {floor}</span>}
                </div>
                <div className="flex items-center">
                  <img className="w-4 h-4 mr-2" alt="Time" src="/time-and-date-6-2.png" />
                  <span className="font-semibold">{time}</span>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-semibold text-[#234724] [font-family:'Montserrat',Helvetica] text-sm mb-3">
                Introduction :
              </h4>
              <div className="text-sm text-gray-700 [font-family:'Montserrat',Helvetica] leading-relaxed">
                {introduction}
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
};