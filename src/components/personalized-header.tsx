import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface PersonalizedHeaderProps {
  currentUser: any;
  userData: any;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onProfileClick: () => void;
}

export const PersonalizedHeader: React.FC<PersonalizedHeaderProps> = ({
  currentUser,
  userData,
  onLoginClick,
  onLogoutClick,
  onProfileClick
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Extract user's first name with fallbacks
  const getUserFirstName = () => {
    if (userData?.prenom) return userData.prenom;
    if (currentUser?.displayName) return currentUser.displayName.split(' ')[0];
    if (currentUser?.email) return currentUser.email.split('@')[0];
    return 'Utilisateur';
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    const firstName = getUserFirstName();
    const lastName = userData?.nom || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Check if user is admin
  const isAdmin = () => {
    const adminEmails = ['admin@sfmp.fr', 'tech@sfmp.fr', 'direction@sfmp.fr', 'congres@sfmp.fr'];
    return currentUser?.email && adminEmails.includes(currentUser.email);
  };

  if (!currentUser) {
    // Show login button for non-authenticated users
    return (
      <button
        onClick={onLoginClick}
        className="flex items-center px-4 py-2 rounded-lg hover:bg-[#eae3b7] transition-colors [font-family:'Space_Grotesk',Helvetica] font-bold text-[#234724]"
      >
        <svg 
          className="w-4 h-4 mr-2" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
          <polyline points="10,17 15,12 10,7"></polyline>
          <line x1="15" y1="12" x2="3" y2="12"></line>
        </svg>
        Se connecter
      </button>
    );
  }

  const firstName = getUserFirstName();
  const userRole = isAdmin() ? 'Administrateur' : 'Participant';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-[#eae3b7] transition-colors focus:outline-none focus:ring-2 focus:ring-[#234724] focus:ring-opacity-20"
      >
        {/* Desktop: Full greeting */}
        <div className="hidden md:flex flex-col items-start">
          <span className="[font-family:'Space_Grotesk',Helvetica] font-bold text-[#234724] text-sm">
            Bonjour {firstName} !
          </span>
          <span className="[font-family:'Montserrat',Helvetica] font-medium text-[#234724] text-xs opacity-75">
            {userRole}
          </span>
        </div>

        {/* Mobile: Compact version */}
        <div className="md:hidden">
          <span className="[font-family:'Space_Grotesk',Helvetica] font-bold text-[#234724] text-sm">
            {firstName}
          </span>
        </div>

        {/* User Avatar */}
        <div className="w-8 h-8 bg-[#234724] rounded-full flex items-center justify-center">
          <span className="[font-family:'Space_Grotesk',Helvetica] font-bold text-white text-xs">
            {getUserInitials()}
          </span>
        </div>

        {/* Dropdown arrow */}
        <svg 
          className={`w-4 h-4 text-[#234724] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <polyline points="6,9 12,15 18,9"></polyline>
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {/* User info header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#234724] rounded-full flex items-center justify-center">
                <span className="[font-family:'Space_Grotesk',Helvetica] font-bold text-white text-sm">
                  {getUserInitials()}
                </span>
              </div>
              <div>
                <p className="[font-family:'Space_Grotesk',Helvetica] font-bold text-[#234724] text-sm">
                  {firstName} {userData?.nom || ''}
                </p>
                <p className="[font-family:'Montserrat',Helvetica] text-gray-600 text-xs">
                  {currentUser.email}
                </p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-[#234724] text-white text-xs rounded-full [font-family:'Montserrat',Helvetica] font-medium">
                  {userRole}
                </span>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="py-1">
            <button
              onClick={() => {
                onProfileClick();
                setIsDropdownOpen(false);
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 [font-family:'Montserrat',Helvetica] text-gray-700 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Mon tableau de bord</span>
            </button>

            <button
              onClick={() => {
                // TODO: Add profile editing functionality
                setIsDropdownOpen(false);
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 [font-family:'Montserrat',Helvetica] text-gray-700 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Mon profil</span>
            </button>

            <button
              onClick={() => {
                // TODO: Add settings functionality
                setIsDropdownOpen(false);
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 [font-family:'Montserrat',Helvetica] text-gray-700 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Paramètres</span>
            </button>

            <div className="border-t border-gray-100 my-1"></div>

            <button
              onClick={() => {
                onLogoutClick();
                setIsDropdownOpen(false);
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 [font-family:'Montserrat',Helvetica] text-red-600 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Se déconnecter</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};