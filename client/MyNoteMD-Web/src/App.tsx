import './App.css';
import { useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { AuthProvider } from './context/AuthContext';
import { Toaster } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AxiosInterceptorSetup from './components/custom/AxiosInterceptorSetup/AxiosInterceptorSetup.jsx';
import { ConfirmProvider } from './shared/services/confirmation/ConfirmContext.js';
import { BannerProvider } from './components/custom/GlobalBanner/BannerContext.js';
import { GlobalBanner } from './components/custom/GlobalBanner/GlobalBanner.js';

import LoginPage from './features/auth/Login.js';
import RegisterPage from './features/auth/Register.js';
import HomePage from './pages/HomePage.js';
import NotesPage from './pages/NotesPage.js';
import CollectionsPage from './pages/CollectionsPage.js';
import ProtectedRoute from './components/custom/ProtectedRoute/ProtectedRoute.jsx';
import { ThemeProvider } from './providers/ThemeProvider/ThemeProvider.js';
import { TooltipProvider } from "@/components/ui/tooltip"

function App() {
  const { i18n, ready } = useTranslation();

  useEffect(() => {
    const handleLanguageChange = () => {
      // Get browser's language ('en-US' -> 'en')
      const newLang = navigator.language.split('-')[0]; 
      i18n.changeLanguage(newLang);
    };

    // Listen for browser language change event
    window.addEventListener('languagechange', handleLanguageChange);

    return () => {
      // Remove listener when component removed
      window.removeEventListener('languagechange', handleLanguageChange);
    };
  }, [i18n]);

  // Do not render anything until i18n is completely initialized
  if (!ready) {
    return null;
  }

  return (
    <ThemeProvider>
      <TooltipProvider>
        <BrowserRouter>
          <BannerProvider>
            <GlobalBanner />
            <ConfirmProvider>
              <AuthProvider>
                <AxiosInterceptorSetup />
                <Toaster position="top-right" richColors />

                <Routes>
                  <></>
                  <Route path='/login' element={<><LoginPage/></>} />
                  <Route path='/register' element={<><RegisterPage/></>} />
                  <Route path='/home'
                    element={<ProtectedRoute><HomePage /></ProtectedRoute>}
                  />
                  <Route path='/collections'
                    element={<ProtectedRoute><CollectionsPage /></ProtectedRoute>}
                  />
                  <Route path='/notes'
                    element={<ProtectedRoute><NotesPage /></ProtectedRoute>}
                  />
                  <Route path='/collection/notes'
                    element={<ProtectedRoute><NotesPage forCollection={true}/></ProtectedRoute>}
                  />
                </Routes>
              </AuthProvider>
            </ConfirmProvider>
          </BannerProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  )
}

export default App
