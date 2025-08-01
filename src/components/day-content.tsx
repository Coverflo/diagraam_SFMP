import React from "react";
import { WorkshopCard } from "./workshop-card";
import { PlenarySessionCard } from "./plenary-session-card";
import { SpecialEventCard } from "./special-event-card";
import { TimeSlotHeader } from "./time-slot-header";
import { LunchBreak } from "./lunch-break";
import { Workshop, Meeting } from "../data/event-data";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { useTranslation } from "react-i18next";

interface DayContentProps {
  day: "mercredi" | "jeudi" | "vendredi";
  morningWorkshops: Workshop[];
  afternoonWorkshops: Workshop[];
  meetings?: Meeting[];
  plenary?: any;
  welcomeEvent?: any;
  afternoonPause?: any;
  parallelSession?: any;
  actualityConference?: any;
  specialEvent?: any;
  closingSession?: any;
  onFavoriteClick: (activity: any) => void;
  onParticipateClick: () => void;
  isFavorite?: (activityId: number) => boolean;
}

export const DayContent: React.FC<DayContentProps> = ({
  day,
  morningWorkshops,
  afternoonWorkshops,
  meetings,
  plenary,
  welcomeEvent,
  afternoonPause,
  parallelSession,
  actualityConference,
  specialEvent,
  closingSession,
  onFavoriteClick,
  onParticipateClick,
  isFavorite = () => false
}) => {
  const { t } = useTranslation();
  
  // Date de début de l'accueil selon le jour
  const welcomeTime = day === "mercredi" ? "9h30" : "8h30";
  
  // Texte et horaire pour la pause déjeuner selon le jour
  const lunchBreak = {
    mercredi: { time: "12h00 - 13h00", text: t('free_lunch') },
    jeudi: { time: "12h30 - 14h00", text: t('free_lunch') },
    vendredi: { time: "12h00 - 14h00", text: t('free_lunch') }
  };

  // Message de fin de journée selon le jour
  const endOfDayMessage = {
    mercredi: t('end_day_1'),
    jeudi: t('end_day_2'),
    vendredi: t('end_congress')
  };

  // Heure de fin selon le jour
  const endTime = {
    mercredi: "18h15",
    jeudi: "17h30",
    vendredi: "17h30"
  };

  return (
    <>
      {/* Accueil des participants */}
      <div className="flex items-center mb-4">
        <img
          className="w-[18px] h-[18px] object-cover mr-2"
          alt="Ouverture de porte"
          src="/ouverture-de-porte-ouverte-1.png"
        />
        <span className="[font-family:'Montserrat',Helvetica] text-[#234724] text-xs">
          <span className="font-semibold">{t('welcome')} </span>
          {welcomeTime}
        </span>
      </div>

      {/* Programme Matin */}
      <TimeSlotHeader title={t('morning_program')} />

      {/* Morning Workshops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {morningWorkshops.map((workshop) => (
          <WorkshopCard
            key={workshop.id}
            id={workshop.id}
            title={workshop.title}
            subtitle={workshop.subtitle}
            presenters={workshop.presenters}
            room={workshop.room}
            floor={workshop.floor}
            time={workshop.time}
            icon={workshop.icon}
            onFavoriteClick={onFavoriteClick}
            isFavorite={isFavorite(workshop.id)}
            introduction={workshop.introduction}
          />
        ))}
      </div>

      {/* Réunions (uniquement pour mercredi) */}
      {meetings && meetings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {meetings.map((meeting) => (
            <Card key={meeting.id} className="rounded-[7px] relative bg-white shadow-md">
              <CardContent className="p-0">
                <div className="p-5">
                  <div className="absolute top-[15px] right-[15px]">
                    <button
                      onClick={() => onFavoriteClick(meeting)}
                      className="p-1 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <img
                        className="w-[17px] h-[15px] object-cover transition-opacity"
                        alt="Favorite"
                        src="/coeurr-3x-13.png"
                        style={{
                          filter: isFavorite(meeting.id) ? 'none' : 'grayscale(100%)',
                          opacity: isFavorite(meeting.id) ? 1 : 0.5
                        }}
                      />
                    </button>
                  </div>
                  <h3 className="[font-family:'Montserrat',Helvetica] font-bold text-[#234724] text-base mt-2">
                    {meeting.title}
                  </h3>

                  <div className="flex items-start mt-4">
                    <div className="w-[78px] h-[30px]">
                      <img
                        className="w-full h-full object-contain"
                        alt="Sfmp logo header"
                        src="/sfmp-logo-header-4.png"
                      />
                    </div>
                    <div className="flex flex-col ml-4">
                      <div className="flex items-center">
                        <img
                          className="w-4 h-4 object-cover"
                          alt="Local"
                          src="/local-6-2.png"
                        />
                        <span className="[font-family:'Montserrat',Helvetica] ml-2 text-[11px]">
                          <span className="font-semibold">{meeting.room}</span>{" "}
                          {meeting.floor && `- ${meeting.floor}`}
                        </span>
                      </div>
                      <div className="flex items-center mt-1">
                        <img
                          className="w-[15px] h-[15px] object-cover"
                          alt="Time and date"
                          src="/time-and-date-6-2.png"
                        />
                        <span className="[font-family:'Montserrat',Helvetica] font-semibold text-[11px] ml-2">
                          {meeting.time}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Session plénière (uniquement pour jeudi) */}
      {plenary && day !== "mercredi" && (
        <PlenarySessionCard
          id={plenary.id}
          title={plenary.title}
          presenters={plenary.presenters}
          room={plenary.room}
          time={plenary.time}
          onFavoriteClick={onFavoriteClick}
        />
      )}

      {/* Pause déjeuner */}
      <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw]">
        <div className="w-[85%] mx-auto">
          <LunchBreak 
            timeRange={lunchBreak[day].time} 
            text={lunchBreak[day].text} 
          />
        </div>
      </div>

      {/* Programme Après-midi */}
      <TimeSlotHeader title={t('afternoon_program')} />

      {/* Afternoon Workshops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {afternoonWorkshops.map((workshop) => (
          <WorkshopCard
            key={workshop.id}
            id={workshop.id}
            title={workshop.title}
            subtitle={workshop.subtitle}
            presenters={workshop.presenters}
            room={workshop.room}
            floor={workshop.floor}
            time={workshop.time}
            icon={workshop.icon}
            onFavoriteClick={onFavoriteClick}
            isFavorite={isFavorite(workshop.id)}
            introduction={workshop.introduction}
          />
        ))}
      </div>

      {/* Bienvenue à Nancy/Rennes (uniquement pour mercredi) */}
      {welcomeEvent && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="rounded-[7px] relative bg-white shadow-md">
            <CardContent className="p-0">
              <div className="p-5">
                <Badge className="bg-transparent text-[#cd5138] text-[13px] [font-family:'Montserrat',Helvetica] font-bold p-0 shadow-none">
                  {t('event')}
                </Badge>
                <div className="absolute top-[15px] right-[15px]">
                  <img
                    className="w-[17px] h-[15px] object-cover cursor-pointer hover:opacity-70 transition-opacity"
                    alt="Favorite"
                    src="/coeurr-3x-13.png"
                    onClick={onFavoriteClick}
                  />
                </div>
                <h3 className="[font-family:'Montserrat',Helvetica] font-bold text-[#234724] text-base mt-2">
                  {welcomeEvent.title}
                </h3>

                <div className="flex items-start mt-4">
                  <div className="w-[120px] h-auto">
                    <img
                      className="w-full h-auto max-h-[113px] object-cover"
                      alt="Rennes"
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
                        {welcomeEvent.room}
                      </span>
                    </div>
                    <div className="flex items-center mt-1">
                      <img
                        className="w-[15px] h-[15px] object-cover"
                        alt="Time and date"
                        src="/time-and-date-6-2.png"
                      />
                      <span className="[font-family:'Montserrat',Helvetica] font-semibold text-[11px] ml-2">
                        {welcomeEvent.time}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator className="my-2" />

                <div className="[font-family:'Montserrat',Helvetica] font-semibold text-black text-[9px] mt-2">
                  {welcomeEvent.presenters[0].name}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Session plénière - Table ronde (uniquement pour mercredi) */}
      {day === "mercredi" && plenary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <PlenarySessionCard
            id={plenary.id}
            title={plenary.title}
            presenters={plenary.presenters}
            room={plenary.room}
            time={plenary.time}
            onFavoriteClick={onFavoriteClick}
          />
        </div>
      )}

      {/* Session parallèle FFRSP (uniquement pour mercredi) */}
      {parallelSession && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="rounded-[7px] relative bg-white shadow-md">
            <CardContent className="p-0">
              <div className="p-5">
                <Badge className="bg-transparent text-[#cd5138] text-[13px] [font-family:'Montserrat',Helvetica] font-bold p-0 shadow-none">
                  SESSION PARALLÈLE
                </Badge>
                <div className="absolute top-[15px] right-[15px]">
                  <img
                    className="w-[17px] h-[15px] object-cover cursor-pointer hover:opacity-70 transition-opacity"
                    alt="Favorite"
                    src="/coeurr-3x-13.png"
                    onClick={onFavoriteClick}
                  />
                </div>
                <h3 className="[font-family:'Montserrat',Helvetica] font-bold text-[#234724] text-base mt-2">
                  {parallelSession.title}
                </h3>

                <div className="flex items-start mt-4">
                  <div className="w-[120px] h-auto">
                    <img
                      className="w-full h-auto max-h-[113px] object-cover"
                      alt="Session FFRSP"
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
                        {parallelSession.room}
                      </span>
                    </div>
                    <div className="flex items-center mt-1">
                      <img
                        className="w-[15px] h-[15px] object-cover"
                        alt="Time and date"
                        src="/time-and-date-6-2.png"
                      />
                      <span className="[font-family:'Montserrat',Helvetica] font-semibold text-[11px] ml-2">
                        {parallelSession.time}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator className="my-2" />

                <div className="[font-family:'Montserrat',Helvetica] text-black text-[9px] mt-2">
                  {parallelSession.presenters.map((presenter, index) => (
                    <div key={index}>
                      <span className="font-semibold">{presenter.name}, </span>
                      <span>{presenter.title}</span>
                      {index < parallelSession.presenters.length - 1 && <br />}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Pause de l'après-midi (uniquement pour mercredi) */}
      {afternoonPause && (
        <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw]">
          <div className="w-[85%] mx-auto">
            <LunchBreak 
              timeRange={afternoonPause.time} 
              text="Pause" 
            />
          </div>
        </div>
      )}

      {/* Conférence d'actualité (uniquement pour mercredi) */}
      {actualityConference && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="rounded-[7px] relative bg-white shadow-md col-span-1 md:col-span-2 lg:col-span-3">
            <CardContent className="p-0">
              <div className="p-5">
                <Badge className="bg-transparent text-[#cd5138] text-[13px] [font-family:'Montserrat',Helvetica] font-bold p-0 shadow-none">
                  CONFÉRENCE D'ACTUALITÉ
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
                  {actualityConference.title}
                </h3>
                {actualityConference.subtitle && (
                  <p className="[font-family:'Montserrat',Helvetica] text-[#234724] text-sm mt-1">
                    {actualityConference.subtitle}
                  </p>
                )}

                <div className="flex items-start mt-4">
                  <div className="w-[120px] h-auto">
                    <img
                      className="w-full h-auto max-h-[113px] object-cover"
                      alt="Conférence d'actualité"
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
                        {actualityConference.room}
                      </span>
                    </div>
                    <div className="flex items-center mt-1">
                      <img
                        className="w-[15px] h-[15px] object-cover"
                        alt="Time and date"
                        src="/time-and-date-6-2.png"
                      />
                      <span className="[font-family:'Montserrat',Helvetica] font-semibold text-[11px] ml-2">
                        {actualityConference.time}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator className="my-2" />

                <div className="[font-family:'Montserrat',Helvetica] text-black text-[9px] mt-2">
                  {actualityConference.presenters.map((presenter, index) => (
                    <div key={index}>
                      <span className="font-semibold">{presenter.name}, </span>
                      <span>{presenter.title}</span>
                      {index < actualityConference.presenters.length - 1 && <br />}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Session de clôture (uniquement pour vendredi) */}
      {closingSession && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="rounded-[7px] relative bg-white shadow-md col-span-1 md:col-span-2 lg:col-span-3">
            <CardContent className="p-0">
              <div className="p-5">
                <Badge className="bg-transparent text-[#cd5138] text-[13px] [font-family:'Montserrat',Helvetica] font-bold p-0 shadow-none">
                  {t('closing_session')}
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
                  {closingSession.title}
                </h3>

                <div className="flex items-start mt-4">
                  <div className="w-[120px] h-auto">
                    <img
                      className="w-full h-auto max-h-[113px] object-cover"
                      alt="Session de clôture"
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
                        {closingSession.room}
                      </span>
                    </div>
                    <div className="flex items-center mt-1">
                      <img
                        className="w-[15px] h-[15px] object-cover"
                        alt="Time and date"
                        src="/time-and-date-6-2.png"
                      />
                      <span className="[font-family:'Montserrat',Helvetica] font-semibold text-[11px] ml-2">
                        {closingSession.time}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator className="my-2" />

                <div className="[font-family:'Montserrat',Helvetica] text-black text-[9px] mt-2">
                  {closingSession.presenters.map((presenter, index) => (
                    <div key={index}>
                      <span className="font-semibold">{presenter.name}, </span>
                      <span>{presenter.title}</span>
                      {index < closingSession.presenters.length - 1 && <br />}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Fin de la journée - Only for mercredi, moved above the special event */}
      {day === "mercredi" && (
        <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw]">
          <div className="w-[85%] mx-auto">
            <div className="w-full h-auto md:h-[62px] rounded-[7px] [background:linear-gradient(270deg,rgba(188,200,189,1)_0%,rgba(35,71,36,1)_100%)] flex flex-col md:flex-row items-center px-6 py-4 md:py-0 mb-8">
              <div className="[font-family:'Montserrat',Helvetica] font-bold text-white text-base">
                {endTime[day]}
              </div>
              <div className="[font-family:'Montserrat',Helvetica] font-bold text-white text-base mt-2 md:mt-0 md:ml-[180px] lg:ml-[340px]">
                {endOfDayMessage[day]}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Événement spécial */}
      {specialEvent && (
        <SpecialEventCard
          title={specialEvent.title}
          description={specialEvent.description}
          location={specialEvent.location}
          time={specialEvent.time}
          image={specialEvent.image}
          onParticipateClick={onParticipateClick}
        />
      )}

      {/* Fin de la journée - For jeudi and vendredi, remains at the bottom */}
      {day !== "mercredi" && (
        <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw]">
          <div className="w-[85%] mx-auto">
            <div className="w-full h-auto md:h-[62px] rounded-[7px] [background:linear-gradient(270deg,rgba(188,200,189,1)_0%,rgba(35,71,36,1)_100%)] flex flex-col md:flex-row items-center px-6 py-4 md:py-0 mb-8">
              <div className="[font-family:'Montserrat',Helvetica] font-bold text-white text-base">
                {endTime[day]}
              </div>
              <div className="[font-family:'Montserrat',Helvetica] font-bold text-white text-base mt-2 md:mt-0 md:ml-[180px] lg:ml-[340px]">
                {endOfDayMessage[day]}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};