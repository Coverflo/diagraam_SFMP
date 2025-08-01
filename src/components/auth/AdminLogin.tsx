import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Eye, EyeOff, Mail, Lock, Shield, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

const schema = yup.object({
  email: yup
    .string()
    .email('Adresse email invalide')
    .required('L\'email administrateur est requis'),
  password: yup
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .required('Le mot de passe est requis'),
});

type FormData = yup.InferType<typeof schema>;

// Liste des emails administrateurs autorisés
const ADMIN_EMAILS = [
  'admin@sfmp.fr',
  'direction@sfmp.fr',
  'tech@sfmp.fr',
  'congres@sfmp.fr'
];

export const AdminLogin: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [customError, setCustomError] = useState<string | null>(null);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  });

  // Fonction pour vérifier si l'email est autorisé comme admin
  const isAdminEmail = (email: string): boolean => {
    return ADMIN_EMAILS.includes(email.toLowerCase());
  };

  // Gestion de la sécurité contre les attaques brute force
  const handleFailedAttempt = () => {
    const newAttempts = loginAttempts + 1;
    setLoginAttempts(newAttempts);
    
    if (newAttempts >= 3) {
      setIsBlocked(true);
      setCustomError('Trop de tentatives de connexion. Accès bloqué pendant 15 minutes.');
      
      // Débloquer après 15 minutes
      setTimeout(() => {
        setIsBlocked(false);
        setLoginAttempts(0);
        setCustomError(null);
      }, 15 * 60 * 1000);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (isBlocked) {
      return;
    }

    try {
      setCustomError(null);
      
      // Vérifier si l'email est autorisé comme administrateur
      if (!isAdminEmail(data.email)) {
        setCustomError('Accès administrateur non autorisé pour cette adresse email.');
        handleFailedAttempt();
        return;
      }

      // Tentative de connexion Firebase
      await login(data.email, data.password);
      
      // Reset des tentatives en cas de succès
      setLoginAttempts(0);
      setCustomError(null);
      
      // Redirection vers l'interface d'administration
      navigate('/admin');
      
    } catch (error) {
      handleFailedAttempt();
      setCustomError('Identifiants administrateur incorrects.');
    }
  };

  const handleBackToSite = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] to-[#e8f2e8] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        
        {/* Header avec logo SFMP */}
        <div className="text-center mb-8">
          <div className="mx-auto h-20 w-auto mb-6">
            <img
              src="/sfmp-logo-header-4.png"
              alt="SFMP - Société Française de Médecine Périnatale"
              className="h-20 w-auto mx-auto"
            />
          </div>
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-[#234724] mr-2" />
            <h2 className="text-3xl font-bold text-[#234724]">
              Administration SFMP
            </h2>
          </div>
          <p className="text-gray-600 text-sm">
            Interface d'administration sécurisée
          </p>
          <p className="text-gray-500 text-xs mt-1">
            54e Journée Nationale - Nancy 2025
          </p>
        </div>

        {/* Carte de connexion */}
        <div className="bg-white shadow-2xl rounded-2xl border border-gray-100">
          <div className="px-8 py-8">
            
            {/* Alerte de sécurité */}
            <Alert className="mb-6 border-amber-200 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800 text-sm">
                <strong>Accès restreint :</strong> Cette interface est réservée aux administrateurs autorisés de la SFMP.
              </AlertDescription>
            </Alert>

            {/* Affichage des erreurs */}
            {customError && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800 text-sm">
                  {customError}
                </AlertDescription>
              </Alert>
            )}

            {/* Indicateur de tentatives */}
            {loginAttempts > 0 && !isBlocked && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-yellow-800 text-sm">
                  ⚠️ Tentative {loginAttempts}/3. {3 - loginAttempts} tentative(s) restante(s).
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Champ Email */}
              <div>
                <Label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Administrateur
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    {...register('email')}
                    type="email"
                    autoComplete="email"
                    className="pl-10 h-12 border-2 border-gray-200 focus:border-[#234724] focus:ring-[#234724] transition-all duration-200"
                    placeholder="admin@sfmp.fr"
                    disabled={isBlocked}
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Champ Mot de passe */}
              <div>
                <Label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Mot de passe
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    className="pl-10 pr-10 h-12 border-2 border-gray-200 focus:border-[#234724] focus:ring-[#234724] transition-all duration-200"
                    placeholder="••••••••••••"
                    disabled={isBlocked}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isBlocked}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Informations de sécurité */}
              <div className="bg-gray-50 p-4 rounded-lg border">
                <div className="flex items-start">
                  <Shield className="h-5 w-5 text-[#234724] mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-1">
                      Sécurité renforcée
                    </h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• Connexion limitée aux emails autorisés</li>
                      <li>• Blocage automatique après 3 tentatives</li>
                      <li>• Session sécurisée avec Firebase Auth</li>
                      <li>• Logs d'accès automatiques</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Bouton de connexion */}
              <Button
                type="submit"
                className={`w-full h-12 text-base font-bold transition-all duration-200 ${
                  isBlocked 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-[#234724] to-[#2a5029] hover:from-[#1b3a1c] hover:to-[#1f4020] transform hover:scale-105 shadow-lg hover:shadow-xl'
                }`}
                disabled={isSubmitting || loading || isBlocked}
              >
                {isSubmitting || loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Connexion en cours...
                  </div>
                ) : isBlocked ? (
                  'Accès temporairement bloqué'
                ) : (
                  <>
                    <Shield className="h-5 w-5 mr-2" />
                    Accéder à l'administration
                  </>
                )}
              </Button>
            </form>

            {/* Lien retour */}
            <div className="mt-6 text-center">
              <button
                onClick={handleBackToSite}
                className="text-sm text-[#234724] hover:text-[#1b3a1c] font-medium transition-colors duration-200"
              >
                ← Retour au site public
              </button>
            </div>

            {/* Footer sécurité */}
            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-500">
                🔒 Connexion sécurisée SSL • Firebase Authentication
              </p>
              <p className="text-xs text-gray-400 mt-1">
                © 2025 SFMP - Tous droits réservés
              </p>
            </div>
          </div>
        </div>

        {/* Informations de contact d'urgence */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Problème de connexion ? Contactez le support technique :
          </p>
          <p className="text-xs text-[#234724] font-medium">
            support@sfmp.fr • +33 (0)1 XX XX XX XX
          </p>
        </div>
      </div>
    </div>
  );
};