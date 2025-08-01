import React from "react";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "es", name: "Español", flag: "🇪🇸" },
];

export const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    // Save language preference to localStorage
    localStorage.setItem("preferredLanguage", lng);
  };

  // Find current language
  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1 rounded-md px-2 py-1 hover:bg-gray-100 transition-colors focus:outline-none">
        <span className="text-base" aria-hidden="true">{currentLanguage.flag}</span>
        <span className="sr-only">{currentLanguage.name}</span>
        <svg 
          width="12" 
          height="6" 
          viewBox="0 0 12 6" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="ml-1"
        >
          <path d="M6 6L0 0L12 0L6 6Z" fill="#234724"/>
        </svg>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            className={`flex items-center gap-2 text-sm focus:bg-gray-100 cursor-pointer ${
              i18n.language === language.code ? "font-bold" : ""
            }`}
            onClick={() => changeLanguage(language.code)}
          >
            <span className="text-base" aria-hidden="true">{language.flag}</span>
            <span>{language.name}</span>
            {i18n.language === language.code && (
              <svg 
                className="ml-auto h-4 w-4"
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};