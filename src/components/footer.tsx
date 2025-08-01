import React from "react";
import { Separator } from "./ui/separator";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="w-full bg-[#234724] text-white pt-8 pb-6">
      <div className="w-[85%] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* À propos de l'événement */}
          <div>
            <h3 className="[font-family:'Space_Grotesk',Helvetica] font-bold text-lg mb-4">
              {t('congress_title')}
            </h3>
            <ul className="space-y-2 [font-family:'Montserrat',Helvetica] text-sm">
              <li className="flex items-center">
                <img 
                  src="/time-and-date-6-2.png" 
                  alt="Date" 
                  className="w-4 h-4 mr-2 opacity-70"
                />
                {t('congress_dates')}
              </li>
              <li className="flex items-center">
                <img 
                  src="/local-6-2.png" 
                  alt="Location" 
                  className="w-4 h-4 mr-2 opacity-70"
                />
                Centre Prouvé - Nancy
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 mr-2 opacity-70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {t('congress_theme')}
              </li>
            </ul>
          </div>

          {/* À propos de Diagraam */}
          <div>
            <h3 className="[font-family:'Space_Grotesk',Helvetica] font-bold text-lg mb-4">
              {t('app_title')}
            </h3>
            <p className="[font-family:'Montserrat',Helvetica] text-sm mb-4">
              {t('about_diagraam')}
            </p>
            <a 
              href="#" 
              className="inline-flex items-center [font-family:'Montserrat',Helvetica] text-sm font-semibold bg-[#cd5138] hover:bg-[#b24530] transition-colors px-4 py-2 rounded-md"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 16L7 11M7 11L12 6M7 11H22M16 16V17C16 18.6569 14.6569 20 13 20H6C4.34315 20 3 18.6569 3 17V7C3 5.34315 4.34315 4 6 4H13C14.6569 4 16 5.34315 16 7V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {t('download_app')}
            </a>
          </div>

          {/* Contact et réseaux sociaux */}
          <div>
            <h3 className="[font-family:'Space_Grotesk',Helvetica] font-bold text-lg mb-4">
              {t('contact')}
            </h3>
            <ul className="space-y-2 [font-family:'Montserrat',Helvetica] text-sm">
              <li className="flex items-center">
                <svg className="w-4 h-4 mr-2 opacity-70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 12C22 10.6868 21.7413 9.38647 21.2388 8.1731C20.7363 6.95996 19.9997 5.85742 19.0711 4.92893C18.1425 4.00043 17.04 3.26384 15.8269 2.7613C14.6138 2.25866 13.3132 2 12 2C10.6868 2 9.38647 2.25866 8.1731 2.7613C6.95996 3.26384 5.85742 4.00043 4.92893 4.92893C3.26633 6.59153 2.25866 8.74458 2.07089 11H6.07089C6.24301 9.50524 6.92186 8.11247 8.00049 7.05408C9.07853 5.99628 10.5146 5.4981 12.0013 5.5C12.9073 5.5 13.8006 5.70574 14.6102 6.10101C15.4198 6.49629 16.1244 7.0713 16.6692 7.78141C17.2139 8.49151 17.5826 9.31222 17.7483 10.1808C17.9139 11.0493 17.8724 11.942 17.6265 12.7913C17.3806 13.6406 16.9368 14.4263 16.3287 15.0877C15.7207 15.7492 14.9648 16.2684 14.1162 16.6038C13.2675 16.9393 12.3505 17.0828 11.438 17.0232C10.5255 16.9635 9.6363 16.702 8.83939 16.2582C8.04249 15.8143 7.35975 15.1999 6.84246 14.4562C6.32518 13.7124 5.9887 12.8605 5.85791 11.9669C5.82877 11.6458 5.82877 11.3229 5.85791 11.0018H1.85791C1.82877 11.3318 1.82877 11.6649 1.85791 12.0018C2.0457 14.8878 3.36995 17.5562 5.55016 19.4486C7.73038 21.341 10.612 22.2503 13.5147 21.9716C16.4173 21.6929 19.1072 20.2461 21.0119 17.9661C22.9166 15.686 23.8846 12.7533 23.7265 9.76C23.5684 6.76648 22.2967 3.95422 20.1585 1.86542C18.0203 -0.223379 15.1693 -0.512042 12.6544 0.12049C10.1395 0.753021 8.1056 2.23739 6.9533 4.25C6.70243 4.62606 6.47723 5.01805 6.27871 5.42399L5.15791 4.30358L3.74312 5.71816L6.56403 8.53908C6.59696 8.572 6.63489 8.59708 6.67574 8.6132C6.71658 8.62931 6.7596 8.63613 6.80271 8.63319C6.84583 8.63026 6.88775 8.61763 6.92602 8.59613C6.9643 8.57462 6.99797 8.54483 7.02517 8.50854L9.84609 5.68762L8.43151 4.27304L7.14699 5.55694C7.52647 4.98203 7.97099 4.45458 8.47382 3.9852C9.91542 2.71116 11.7256 2 13.6 2C15.4744 2 17.2846 2.71116 18.7262 3.9852C20.1678 5.25924 21 6.9308 21 8.6776C21 10.4244 20.1678 12.096 18.7262 13.37C17.2846 14.644 15.4744 15.3552 13.6 15.3552C12.1493 15.3552 10.7268 14.9417 9.5 14.1552" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                contact@sfmp2025.fr
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 mr-2 opacity-70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 16.9V19.9C22.0011 20.1031 21.9601 20.3037 21.8797 20.4868C21.7993 20.67 21.6815 20.832 21.5346 20.9622C21.3877 21.0925 21.2153 21.1879 21.0287 21.2428C20.842 21.2977 20.6451 21.3108 20.45 21.281C17.4578 20.8277 14.6084 19.6801 12.14 17.94C9.87 16.3578 7.9699 14.3666 6.4 12.11C4.6421 9.62519 3.49454 6.7518 3.05 3.75C3.02041 3.55577 3.03319 3.35997 3.08712 3.17406C3.14104 2.98815 3.23551 2.81686 3.36443 2.67076C3.49336 2.52466 3.65352 2.40774 3.83452 2.32797C4.01552 2.24819 4.21432 2.20669 4.416 2.20803H7.416C7.76742 2.20437 8.1067 2.33426 8.37357 2.57121C8.64044 2.80815 8.81131 3.13375 8.851 3.484C8.93262 4.22339 9.09209 4.95069 9.328 5.657C9.42089 5.92072 9.43183 6.2075 9.35891 6.47739C9.28599 6.74729 9.13348 6.98821 8.925 7.168L7.585 8.506C9.0193 10.8905 10.9735 12.8462 13.359 14.283L14.7 12.942C14.8798 12.7335 15.1207 12.581 15.3906 12.5081C15.6605 12.4351 15.9473 12.4461 16.21 12.537C16.9163 12.7729 17.6436 12.9324 18.383 13.014C18.7378 13.0542 19.0663 13.2287 19.3033 13.5003C19.5402 13.772 19.6663 14.117 19.657 14.472L22 16.9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                +33 (0)3 83 XX XX XX
              </li>
            </ul>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-white hover:text-[#cd5138] transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a href="#" className="text-white hover:text-[#cd5138] transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" className="text-white hover:text-[#cd5138] transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a href="#" className="text-white hover:text-[#cd5138] transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 3a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V3zm-2 0v14H7V3h10zM9 9a1 1 0 011-1h4a1 1 0 110 2h-4a1 1 0 01-1-1zm0 4a1 1 0 011-1h4a1 1 0 110 2h-4a1 1 0 01-1-1z" clipRule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <Separator className="my-6 bg-gray-200/20" />

        <div className="flex flex-col md:flex-row justify-between items-center [font-family:'Montserrat',Helvetica] text-xs text-gray-300">
          <div className="mb-4 md:mb-0">
            {t('copyright')}
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#" className="hover:text-white transition-colors">{t('legal_mentions')}</a>
            <a href="#" className="hover:text-white transition-colors">{t('privacy_policy')}</a>
            <a href="#" className="hover:text-white transition-colors">{t('terms_of_use')}</a>
            <a href="#" className="hover:text-white transition-colors">{t('accessibility')}</a>
            <Link to="/admin" className="hover:text-white transition-colors text-[#cd5138]">Administration</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};