import React, { useState, useRef, useEffect } from "react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "../../components/ui/toggle-group";
import { LoginModal } from "../../components/login-modal";
import { WorkshopCard } from "../../components/workshop-card";
import { DayContent } from "../../components/day-content";
import { Footer } from "../../components/footer";
import { LanguageSelector } from "../../components/language-selector";
import { PersonalizedHeader } from "../../components/personalized-header";
import { FavoritesSection } from "../../components/favorites-section";
import { useFavorites } from "../../hooks/useFavorites";
import { useTranslation } from "react-i18next";
import { wednesdayData, thursdayData, fridayData } from "../../data/event-data";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export const MacbookPro = (): JSX.Element => {
  const { t } = useTranslation();
  const { currentUser, userData, logout } = useAuth();
  const { favorites, isFavorite, toggleFavorite, removeFromFavorites } = useFavorites();
  const navigate = useNavigate();
  
  // État pour la gestion de la modal de connexion
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  
  // État pour le jour sélectionné (par défaut: mercredi)
  const [selectedDay, setSelectedDay] = useState<"mercredi" | "jeudi" | "vendredi">("mercredi");
  
  // État pour le tri sélectionné (par défaut: aucun)
  const [sortBy, setSortBy] = useState<"salle" | "theme" | null>(null);
  
  // État pour la salle sélectionnée (par défaut: aucune)
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  
  // État pour contrôler l'ouverture du dropdown
  const [isRoomDropdownOpen, setIsRoomDropdownOpen] = useState(false);
  
  // Nouvel état pour le terme de recherche
  const [searchTerm, setSearchTerm] = useState("");
  
  // Référence pour le dropdown
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Référence pour le champ de recherche
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Référence pour le contenu principal
  const mainContentRef = useRef<HTMLDivElement>(null);

  // Fermer le dropdown si on clique ailleurs
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsRoomDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Options de salles
  const roomOptions = [
    { value: null, label: t('all_rooms') },
    { value: "SALLE 103", label: t('room_103') },
    { value: "SALLE 104", label: t('room_104') },
    { value: "SALLE 105", label: t('room_105') },
    { value: "SALLE 106", label: t('room_106') },
    { value: "Auditorium", label: t('auditorium') }
  ];

  // Gestionnaires d'événements
  const handleLoginClick = () => {
    setLoginModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Optionally show a success message or redirect
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const handleProfileClick = () => {
    navigate('/dashboard');
  };

  const handleFavoriteClick = () => {
    if (!currentUser) {
      // Nécessite une connexion pour ajouter aux favoris
      setLoginModalOpen(true);
    }
    // Si l'utilisateur est connecté, la fonction handleActivityFavorite sera appelée
  };

  const handleActivityFavorite = async (activity: any) => {
    if (!currentUser) {
      setLoginModalOpen(true);
      return;
    }

    const activityData = {
      id: activity.id,
      title: activity.title,
      day: selectedDay === "mercredi" ? "Mercredi" : 
           selectedDay === "jeudi" ? "Jeudi" : "Vendredi",
      time: activity.time,
      room: activity.room,
      subtitle: activity.subtitle,
      presenters: activity.presenters
    };

    await toggleFavorite(activityData);
  };

  const handleDayChange = (value: string) => {
    if (value === "mercredi" || value === "jeudi" || value === "vendredi") {
      setSelectedDay(value);
    }
  };

  const handleSortChange = (type: "salle" | "theme") => {
    setSortBy(sortBy === type ? null : type);
  };
  
  const handleRoomSelect = (room: string | null) => {
    setSelectedRoom(room);
    setIsRoomDropdownOpen(false);
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique de recherche à implémenter
    console.log("Recherche soumise:", searchTerm);
  };
  
  const handleSearchClear = () => {
    setSearchTerm("");
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };
  
  // Filtrer les données en fonction de la salle sélectionnée
  const getFilteredData = () => {
    const dayData = selectedDay === "mercredi" 
      ? wednesdayData 
      : selectedDay === "jeudi" 
        ? thursdayData 
        : fridayData;
    
    if (!selectedRoom) return dayData;
    
    const filterByRoom = (workshops: any[]) => {
      return workshops.filter(workshop => workshop.room === selectedRoom);
    };
    
    return {
      ...dayData,
      morningWorkshops: filterByRoom(dayData.morningWorkshops),
      afternoonWorkshops: filterByRoom(dayData.afternoonWorkshops),
      meetings: dayData.meetings ? filterByRoom(dayData.meetings) : undefined,
      plenary: dayData.plenary && dayData.plenary.room === selectedRoom ? dayData.plenary : undefined,
      welcomeEvent: dayData.welcomeEvent && dayData.welcomeEvent.room === selectedRoom ? dayData.welcomeEvent : undefined,
      closingSession: dayData.closingSession && dayData.closingSession.room === selectedRoom ? dayData.closingSession : undefined,
      specialEvent: dayData.specialEvent // Ne pas filtrer les événements spéciaux car ils se produisent à des endroits différents
    };
  };
  
  const filteredData = getFilteredData();

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white overflow-hidden w-full relative">
        {/* Header - Full width background */}
        <div className="w-full bg-[#f5f0d6]">
          <header className="w-[85%] mx-auto h-auto min-h-[60px] flex flex-col md:flex-row items-center px-4 md:px-0 py-3 md:py-0">
            <div className="[font-family:'Space_Grotesk',Helvetica] font-bold text-[#234724] text-xl">
              {t('app_title')}
            </div>
            <div className="my-2 md:ml-8 lg:ml-16 md:my-0 [font-family:'Space_Grotesk',Helvetica] font-bold text-[#234724] text-sm flex items-center">
              <img
                className="hidden md:block w-px h-3 mx-3 object-cover"
                alt="Line"
                src="/line-1.svg"
              />
              <span>{t('app_subtitle')}</span>
            </div>
            <div className="md:ml-auto mt-2 md:mt-0 flex items-center gap-3">
              {/* Admin Link */}
              <Link 
                to={currentUser ? "/admin" : "/admin/login"}
                className="flex items-center px-3 py-1.5 rounded hover:bg-[#eae3b7] transition-colors [font-family:'Space_Grotesk',Helvetica] font-bold text-[#234724]"
              >
                <svg 
                  className="w-4 h-4 mr-1.5" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="3" y1="9" x2="21" y2="9"></line>
                  <line x1="9" y1="21" x2="9" y2="9"></line>
                </svg>
                Admin
              </Link>
              
              {/* Language Selector */}
              <LanguageSelector />
              
              {/* Personalized Header or Login Button */}
              <PersonalizedHeader
                currentUser={currentUser}
                userData={userData}
                onLoginClick={handleLoginClick}
                onLogoutClick={handleLogout}
                onProfileClick={handleProfileClick}
              />
            </div>
          </header>
        </div>

        {/* Main Content */}
        <main className="w-full" ref={mainContentRef}>
          {/* Favorites Section - Only show if user has favorites */}
          {currentUser && favorites.length > 0 && (
            <FavoritesSection 
              favorites={favorites}
              onRemoveFavorite={removeFromFavorites}
            />
          )}

          {/* Event Header - Full width background */}
          <div className="w-full bg-white">
            <section className="w-[85%] mx-auto pt-6 pb-8 px-4 md:px-0">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="max-w-[400px]">
                  <Badge className="bg-[#cd5138] text-white text-[10px] [font-family:'Montserrat',Helvetica] font-bold mt-4">
                    {t('venue')}
                  </Badge>
                  <div className="flex items-center mt-4">
                    <img
                      className="w-full max-w-[393px] h-auto object-contain"
                      alt="54èmes Journées Nationales SFMP"
                      src="/diagraam-logo-2-3x-1.png"
                      onError={(e) => {
                        console.error('Logo not found, trying fallback...');
                        e.currentTarget.src = "/diagraam-logo-2-3x-1.png";
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Date Selection */}
              <div className="flex flex-col md:flex-row md:items-center mt-8">
                <ToggleGroup
                  type="single"
                  value={selectedDay}
                  onValueChange={handleDayChange}
                  className="flex flex-col md:flex-row gap-2 md:gap-4"
                >
                  <ToggleGroupItem
                    value="mercredi"
                    className={`w-full md:w-[153px] h-[37px] rounded-[7px] ${
                      selectedDay === "mercredi" 
                        ? "[background:linear-gradient(90deg,rgba(205,81,56,1)_0%,rgba(143,41,28,1)_100%)] [font-family:'Montserrat',Helvetica] font-bold text-white !text-white" 
                        : "border border-solid border-[#8f291c] [font-family:'Montserrat',Helvetica] font-semibold text-[#8f291c]"
                    } text-xs`}
                  >
                    {t('wednesday')}
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="jeudi"
                    className={`w-full md:w-[153px] h-[37px] rounded-[7px] ${
                      selectedDay === "jeudi" 
                        ? "[background:linear-gradient(90deg,rgba(205,81,56,1)_0%,rgba(143,41,28,1)_100%)] [font-family:'Montserrat',Helvetica] font-bold text-white !text-white" 
                        : "border border-solid border-[#8f291c] [font-family:'Montserrat',Helvetica] font-semibold text-[#8f291c]"
                    } text-xs`}
                  >
                    {t('thursday')}
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="vendredi"
                    className={`w-full md:w-[153px] h-[37px] rounded-[7px] ${
                      selectedDay === "vendredi" 
                        ? "[background:linear-gradient(90deg,rgba(205,81,56,1)_0%,rgba(143,41,28,1)_100%)] [font-family:'Montserrat',Helvetica] font-bold text-white !text-white" 
                        : "border border-solid border-[#8f291c] [font-family:'Montserrat',Helvetica] font-semibold text-[#8f291c]"
                    } text-xs`}
                  >
                    {t('friday')}
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
              
              {/* Affichage du filtre actif */}
              {selectedRoom && (
                <div className="mt-4 py-2 px-4 bg-gray-100 rounded-md flex items-center justify-between">
                  <span className="[font-family:'Space_Grotesk',Helvetica] text-sm">
                    {t('filtered_by')} <span className="font-bold">{roomOptions.find(r => r.value === selectedRoom)?.label}</span>
                  </span>
                  <button 
                    className="text-[#cd5138] hover:text-[#8f291c] transition-colors"
                    onClick={() => setSelectedRoom(null)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}
            </section>
          </div>

          {/* Barre de recherche - Full width background */}
          <div className="w-full bg-[#f8f8f8] py-4 border-t border-b border-gray-200">
            <div className="w-[85%] mx-auto flex items-center justify-between">
              {/* Barre de recherche */}
              <form onSubmit={handleSearchSubmit} className="relative w-[57.5%] md:w-[40%]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg 
                    className="h-5 w-5 text-gray-400" 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor" 
                    aria-hidden="true"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  ref={searchInputRef}
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#cd5138] focus:border-[#cd5138] transition-colors duration-200 [font-family:'Montserrat',Helvetica]"
                  placeholder={t('search_placeholder')}
                  aria-label={t('search_label')}
                  autoComplete="off"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={handleSearchClear}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={t('clear_search')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </form>
              
              {/* Options de tri */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="[font-family:'Space_Grotesk',Helvetica] font-bold text-black text-sm">
                  {t('sort')}
                </span>
                
                {/* Room Filter Dropdown */}
                <div className="relative ml-4" ref={dropdownRef}>
                  <button 
                    className="[font-family:'Space_Grotesk',Helvetica] font-normal text-black text-sm focus:outline-none flex items-center"
                    onClick={() => setIsRoomDropdownOpen(!isRoomDropdownOpen)}
                  >
                    {t('by_room')}
                    <img
                      className={`inline-block w-1.5 h-[5px] ml-1 transform ${
                        isRoomDropdownOpen ? "rotate-180" : ""
                      }`}
                      alt="Polygon"
                     src="/polygon-1.svg"
                    />
                  </button>
                  
                  {isRoomDropdownOpen && (
                    <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-lg z-20">
                      {roomOptions.map((option) => (
                        <button
                          key={option.label}
                          className={`block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 [font-family:'Space_Grotesk',Helvetica] ${
                            selectedRoom === option.value ? 'font-bold' : 'font-normal'
                          }`}
                          onClick={() => handleRoomSelect(option.value)}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                <button 
                  className={`[font-family:'Space_Grotesk',Helvetica] ${
                    sortBy === "theme" ? "font-bold" : "font-normal"
                  } text-black text-sm ml-4 focus:outline-none`}
                  onClick={() => handleSortChange("theme")}
                >
                  {t('by_theme')}
                </button>
              </div>
            </div>
          </div>

          {/* Program Content - Full width background */}
          <div className="w-full bg-neutral-100">
            <section className="w-[85%] mx-auto px-4 md:px-0 py-8">
              {/* Affichage dynamique du contenu selon le jour sélectionné */}
              {selectedDay === "mercredi" && (
                <DayContent
                  day="mercredi"
                  morningWorkshops={filteredData.morningWorkshops}
                  afternoonWorkshops={filteredData.afternoonWorkshops}
                  meetings={filteredData.meetings}
                  welcomeEvent={filteredData.welcomeEvent}
                  afternoonPause={filteredData.afternoonPause}
                  plenary={filteredData.plenary}
                  parallelSession={filteredData.parallelSession}
                  actualityConference={filteredData.actualityConference}
                  specialEvent={filteredData.specialEvent}
                  onFavoriteClick={handleActivityFavorite}
                  onParticipateClick={handleLoginClick}
                  isFavorite={isFavorite}
                />
              )}

              {selectedDay === "jeudi" && (
                <DayContent
                  day="jeudi"
                  morningWorkshops={filteredData.morningWorkshops}
                  afternoonWorkshops={filteredData.afternoonWorkshops}
                  plenary={filteredData.plenary}
                  specialEvent={filteredData.specialEvent}
                  onFavoriteClick={handleActivityFavorite}
                  onParticipateClick={handleLoginClick}
                  isFavorite={isFavorite}
                />
              )}

              {selectedDay === "vendredi" && (
                <DayContent
                  day="vendredi"
                  morningWorkshops={filteredData.morningWorkshops}
                  afternoonWorkshops={filteredData.afternoonWorkshops}
                  closingSession={filteredData.closingSession}
                  onFavoriteClick={handleActivityFavorite}
                  onParticipateClick={handleLoginClick}
                  isFavorite={isFavorite}
                />
              )}

              {/* Affichage si aucun événement n'est trouvé après filtrage */}
              {(filteredData.morningWorkshops.length === 0 && 
                filteredData.afternoonWorkshops.length === 0 && 
                (!filteredData.meetings || filteredData.meetings.length === 0) && 
                !filteredData.plenary && 
                !filteredData.welcomeEvent && 
                !filteredData.closingSession) && (
                <div className="flex flex-col items-center justify-center py-16">
                  <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium [font-family:'Montserrat',Helvetica] text-gray-900">{t('no_events_found')}</h3>
                  <p className="mt-1 text-sm [font-family:'Montserrat',Helvetica] text-gray-500">
                    {t('no_events_for_filter')}
                  </p>
                  <button
                    onClick={() => setSelectedRoom(null)}
                    className="mt-4 px-4 py-2 text-sm font-medium text-white bg-[#cd5138] rounded-md hover:bg-[#8f291c] transition-colors"
                  >
                    {t('reset_filter')}
                  </button>
                </div>
              )}

              {/* Bottom Navigation */}
              <div className="flex flex-col md:flex-row md:justify-end gap-2 md:gap-4 mt-8">
                {selectedDay !== "jeudi" && (
                  <Button
                    variant="outline"
                    className="w-full md:w-[153px] h-[37px] rounded-[7px] border border-solid border-[#8f291c] [font-family:'Montserrat',Helvetica] font-semibold text-[#8f291c] text-xs"
                    onClick={() => setSelectedDay("jeudi")}
                  >
                    {t('thursday')}
                  </Button>
                )}
                {selectedDay !== "vendredi" && (
                  <Button
                    variant="outline"
                    className="w-full md:w-[153px] h-[37px] rounded-[7px] border border-solid border-[#8f291c] [font-family:'Montserrat',Helvetica] font-semibold text-[#8f291c] text-xs"
                    onClick={() => setSelectedDay("vendredi")}
                  >
                    {t('friday')}
                  </Button>
                )}
                {selectedDay !== "mercredi" && (
                  <Button
                    variant="outline"
                    className="w-full md:w-[153px] h-[37px] rounded-[7px] border border-solid border-[#8f291c] [font-family:'Montserrat',Helvetica] font-semibold text-[#8f291c] text-xs"
                    onClick={() => setSelectedDay("mercredi")}
                  >
                    {t('wednesday')}
                  </Button>
                )}
              </div>
            </section>
          </div>
        </main>

        {/* Footer */}
        <Footer />

        {/* Login Modal */}
        <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
      </div>
    </div>
  );
};