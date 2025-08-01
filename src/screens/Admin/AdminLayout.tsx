import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Calendar, 
  Settings, 
  Users, 
  LogOut, 
  Menu, 
  X,
  ChevronLeft,
  MapPin,
  Clock,
  CalendarDays,
  Monitor
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "../../components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Separator } from "../../components/ui/separator";
import { useAuth } from "../../hooks/useAuth";
import { useEffect } from "react";

// Liste des emails administrateurs autorisés
const ADMIN_EMAILS = [
  'admin@sfmp.fr',
  'direction@sfmp.fr', 
  'tech@sfmp.fr',
  'congres@sfmp.fr'
];

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  
  // Vérifier si l'utilisateur est un admin autorisé
  useEffect(() => {
    if (currentUser && !ADMIN_EMAILS.includes(currentUser.email || '')) {
      // Rediriger vers la page de connexion admin si pas autorisé
      navigate('/admin/login');
    }
  }, [currentUser, navigate]);
  
  // Main navigation items
  const mainMenuItems = [
    { 
      path: '/admin', 
      icon: <LayoutDashboard className="mr-2 h-5 w-5" />, 
      label: 'Tableau de bord',
      description: 'Statistiques et informations clés'
    },
    { 
      path: '/admin/users', 
      icon: <Users className="mr-2 h-5 w-5" />, 
      label: 'Utilisateurs',
      description: 'Gestion des participants'
    },
    { 
      path: '/admin/event', 
      icon: <CalendarDays className="mr-2 h-5 w-5" />, 
      label: 'Événement',
      description: 'Configuration générale'
    },
    { 
      path: '/admin/activities', 
      icon: <Calendar className="mr-2 h-5 w-5" />, 
      label: 'Activités',
      description: 'Gestion du programme'
    },
    { 
      path: '/admin/screens', 
      icon: <Monitor className="mr-2 h-5 w-5" />, 
      label: 'Mes Écrans',
      description: 'Contrôle des affichages'
    },
  ];
  
  // Secondary navigation items
  const secondaryMenuItems = [
    { 
      path: '/admin/settings', 
      icon: <Settings className="mr-2 h-5 w-5" />, 
      label: 'Paramètres',
      description: 'Configuration du compte'
    }
  ];

  const handleLogout = () => {
    // Implement logout logic
    navigate('/');
  };

  // Find current page title
  const getCurrentPageTitle = () => {
    const currentMenuItem = [...mainMenuItems, ...secondaryMenuItems].find(item => item.path === location.pathname);
    return currentMenuItem ? currentMenuItem.label : "Tableau de bord";
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Backdrop overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="bg-white shadow-md"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Back to site link on mobile */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/')}
          className="bg-white shadow-md flex items-center gap-1"
        >
          <ChevronLeft size={16} />
          <span className="text-xs">Site</span>
        </Button>
      </div>

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition duration-200 ease-in-out w-[280px] lg:w-64 bg-[#234724] text-white z-40 overflow-y-auto flex flex-col`}
      >
        <div className="flex flex-col h-full">
          <div className="px-4 py-6 border-b border-[#2a5029] flex items-center justify-between">
            <div className="flex items-center">
              <img 
                src="/public/diagraam-logo-2-3x-1.png" 
                alt="Diagraam Logo" 
                className="h-10 w-auto brightness-0 invert"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-white hover:bg-[#2a5029] hover:text-white"
            >
              <X size={20} />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            {/* Main Navigation */}
            <div className="px-3 py-2">
              <h2 className="px-4 text-xs uppercase tracking-wider text-gray-300 font-semibold mb-2">
                Navigation principale
              </h2>
              <nav className="space-y-1">
                {mainMenuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-4 py-3 text-sm rounded-md transition-colors ${
                      location.pathname === item.path
                        ? "bg-[#1b3a1c] text-white"
                        : "text-gray-300 hover:bg-[#2a5029] hover:text-white"
                    }`}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <div className="flex-shrink-0">
                      {item.icon}
                    </div>
                    <div className="ml-1">
                      <p className="font-medium">{item.label}</p>
                      <p className="text-xs text-gray-400">{item.description}</p>
                    </div>
                  </Link>
                ))}
              </nav>
            </div>
            
            <Separator className="my-4 bg-[#2a5029]" />
            
            {/* Secondary Navigation */}
            <div className="px-3 py-2">
              <h2 className="px-4 text-xs uppercase tracking-wider text-gray-300 font-semibold mb-2">
                Options
              </h2>
              <nav className="space-y-1">
                {secondaryMenuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-4 py-3 text-sm rounded-md transition-colors ${
                      location.pathname === item.path
                        ? "bg-[#1b3a1c] text-white"
                        : "text-gray-300 hover:bg-[#2a5029] hover:text-white"
                    }`}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <div className="flex-shrink-0">
                      {item.icon}
                    </div>
                    <div className="ml-1">
                      <p className="font-medium">{item.label}</p>
                      <p className="text-xs text-gray-400">{item.description}</p>
                    </div>
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          <div className="p-4 border-t border-[#2a5029] space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:bg-[#2a5029] hover:text-white"
              onClick={() => navigate('/')}
            >
              <ChevronLeft className="mr-2 h-5 w-5" />
              <div>
                <p className="font-medium text-left">Retour au site</p>
                <p className="text-xs text-gray-400 text-left">Interface utilisateur</p>
              </div>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:bg-[#2a5029] hover:text-white"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-5 w-5" />
              <div>
                <p className="font-medium text-left">Se déconnecter</p>
                <p className="text-xs text-gray-400 text-left">Quitter l'administration</p>
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={`flex-1 flex flex-col lg:ml-64 transition-all duration-200 max-h-screen`}>
        {/* Header */}
        <header className="bg-white shadow-sm z-10 px-4 py-4 sticky top-0">
          <div className="flex items-center justify-between max-w-full mx-auto">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 pl-12 lg:pl-0 truncate">
              {getCurrentPageTitle()}
            </h1>

            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={currentUser?.photoURL || undefined} alt="Admin" />
                      <AvatarFallback className="bg-[#234724] text-white text-xs font-bold">
                        {currentUser?.email?.slice(0, 2).toUpperCase() || 'AD'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-2 py-1.5 text-sm font-medium text-gray-900 border-b">
                    {currentUser?.email}
                  </div>
                  <DropdownMenuItem>Mon profil</DropdownMenuItem>
                  <DropdownMenuItem>Paramètres</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Se déconnecter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-4 pb-20">
          <Outlet />
        </main>
      </div>
    </div>
  );
}