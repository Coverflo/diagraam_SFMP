import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { login, register, loginWithGoogle, loading } = useAuth();
  const navigate = useNavigate();
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFirstName("");
    setLastName("");
    setErrors({});
    setIsRegistering(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!email) {
      newErrors.email = t('email_required');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t('email_invalid');
    }
    
    if (!password) {
      newErrors.password = t('password_required');
    } else if (password.length < 6) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères";
    }
    
    if (isRegistering) {
      if (!firstName.trim()) {
        newErrors.firstName = "Le prénom est requis";
      }
      if (!lastName.trim()) {
        newErrors.lastName = "Le nom est requis";
      }
      if (!confirmPassword) {
        newErrors.confirmPassword = "Confirmez votre mot de passe";
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      console.log('❌ Validation échouée:', errors);
      return;
    }
    
    try {
      if (isRegistering) {
        console.log("Création de compte avec:", { email, firstName, lastName });
        await register(email, password, lastName, firstName);
      } else {
        console.log("Connexion avec:", email);
        await login(email, password);
      }
      
      // Rediriger vers le dashboard après connexion réussie
      navigate('/dashboard');
      handleClose();
    } catch (error) {
      // Les erreurs sont gérées dans le hook useAuth avec toast
      console.error('Erreur d\'authentification:', error);
      // Ne pas fermer le modal en cas d'erreur pour que l'utilisateur puisse réessayer
    }
  };

  const handleGoogleLogin = () => {
    loginWithGoogle()
      .then(() => {
        navigate('/dashboard');
        handleClose();
      })
      .catch((error) => {
        console.error('Erreur connexion Google:', error);
      });
  };

  const switchMode = () => {
    setIsRegistering(!isRegistering);
    setErrors({});
    console.log("Mode changé vers:", !isRegistering ? "inscription" : "connexion");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className="p-0 border-none overflow-hidden max-w-4xl w-[90vw] md:w-[85%] h-[90vh] md:h-[85vh] rounded-xl"
        hideCloseButton={true}
      >
        <DialogTitle className="sr-only">
          {isRegistering ? "Créer un compte" : t('login')}
        </DialogTitle>
        <div className="flex flex-col md:flex-row h-full">
          {/* Left side - Image */}
          <div className="relative hidden md:block md:w-1/2 bg-blue-900">
            <img 
              src="https://i.ibb.co/8DGGSxLR/ZAAZ.jpg" 
              alt="Participant à une conférence"
              className="w-full h-full object-cover"
              loading="eager"
              fetchpriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-between p-10">
              <div className="[font-family:'Space_Grotesk',Helvetica] font-bold text-white text-3xl">
                Diagraam
                <p className="text-base font-normal mt-2">
                  {isRegistering 
                    ? "Rejoignez la communauté SFMP et accédez au programme complet du congrès" 
                    : "Pour mettre en favoris ou s'inscrire à un événement, veuillez créer un compte"
                  }
                </p>
              </div>
              <div className="text-white">
                <div className="flex mt-4 space-x-2">
                  <div className="h-1 w-12 bg-white rounded"></div>
                  <div className="h-1 w-12 bg-white/30 rounded"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side - Form */}
          <div className="md:w-1/2 bg-white p-6 md:p-10 flex flex-col relative">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-10"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            <div className="flex flex-col items-center md:items-start mb-6 md:mb-8">
              <img 
                src="/diagraam-logo-2-3x-1.png" 
                alt="Diagraam logo" 
                className="h-14 mb-6 md:hidden"
              />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {isRegistering ? "Créer un compte" : t('welcome')}
              </h1>
              <p className="text-gray-600">
                {isRegistering ? (
                  <>Vous avez déjà un compte ? <button type="button" onClick={switchMode} className="text-[#cd5138] hover:underline font-semibold">Se connecter</button></>
                ) : (
                  <>{t('new_user')} <button type="button" onClick={switchMode} className="text-[#cd5138] hover:underline font-semibold">Créez un compte</button></>
                )}
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
              {/* Champs nom/prénom pour l'inscription */}
              {isRegistering && (
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      Prénom
                    </label>
                    <Input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Votre prénom"
                      className={`h-12 transition-all duration-200 ${errors.firstName ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300 focus-visible:ring-[#cd5138]'}`}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Nom
                    </label>
                    <Input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Votre nom"
                      className={`h-12 transition-all duration-200 ${errors.lastName ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300 focus-visible:ring-[#cd5138]'}`}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                    )}
                  </div>
                </div>
              )}
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('email')}
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('enter_email')}
                  className={`h-12 transition-all duration-200 ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300 focus-visible:ring-[#cd5138]'}`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('password')}
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('enter_password')}
                    className={`h-12 pr-10 transition-all duration-200 ${errors.password ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300 focus-visible:ring-[#cd5138]'}`}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              {/* Confirmation mot de passe pour l'inscription */}
              {isRegistering && (
                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirmez votre mot de passe"
                      className={`h-12 pr-10 transition-all duration-200 ${errors.confirmPassword ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300 focus-visible:ring-[#cd5138]'}`}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                  )}
                </div>
              )}
              
              {!isRegistering && (
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <Checkbox 
                      id="remember-me" 
                      checked={rememberMe} 
                      onCheckedChange={(checked) => setRememberMe(checked === true)}
                      className="h-4 w-4 border-gray-300 text-[#cd5138] focus:ring-[#cd5138]"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      {t('remember_me')}
                    </label>
                  </div>
                  <a href="#" className="text-sm font-medium text-[#cd5138] hover:underline">
                    {t('forgot_password')}
                  </a>
                </div>
              )}
              
              <Button 
                type="submit"
                disabled={loading}
                className="h-12 [background:linear-gradient(90deg,rgba(205,81,56,1)_0%,rgba(143,41,28,1)_100%)] hover:opacity-90 transition-opacity font-bold text-white mb-4"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {isRegistering ? "Création..." : "Connexion..."}
                  </div>
                ) : (
                  isRegistering ? "Créer le compte" : t('login_button')
                )}
              </Button>
              
              <div className="relative flex items-center my-4">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-600 text-sm">{t('or')}</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              <Button 
                type="button"
                onClick={handleGoogleLogin}
                variant="outline"
                className="h-12 border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 mb-4"
              >
                <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                </svg>
                {t('login_with_google')}
              </Button>
              
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  {isRegistering ? (
                    <>Vous avez déjà un compte ? <button type="button" onClick={switchMode} className="font-semibold text-[#cd5138] hover:underline">Se connecter</button></>
                  ) : (
                    <>{t('no_account')} <button type="button" onClick={switchMode} className="font-semibold text-[#cd5138] hover:underline">{t('create_account')}</button></>
                  )}
                </p>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};