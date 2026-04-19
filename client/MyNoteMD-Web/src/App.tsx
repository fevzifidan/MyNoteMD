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
import GuestRoute from './components/custom/GuestRoute/GuestRoute.js';
import { ThemeProvider } from './providers/ThemeProvider/ThemeProvider.js';
import { TooltipProvider } from "@/components/ui/tooltip"
import NoteEditPage from './pages/NoteEditPage/NoteEditPage.js';
import NotePreviewPage from './pages/NotePreviewPage/NotePreviewPage.js';
import TrashPage from './pages/TrashPage.js';
import GuestPreviewPage from './pages/NotePreviewPage/GuestPreviewPage.js';
import NotFoundPage from './pages/NotFoundPage.js';


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
                  <Route path='/' element={<GuestRoute><LoginPage /></GuestRoute>} />
                  <Route path='/login' element={<GuestRoute><LoginPage /></GuestRoute>} />
                  <Route path='/register' element={<GuestRoute><RegisterPage /></GuestRoute>} />
                  <Route path='/home'
                    element={<ProtectedRoute><HomePage /></ProtectedRoute>}
                  />
                  <Route path='/collections'
                    element={<ProtectedRoute><CollectionsPage /></ProtectedRoute>}
                  />
                  <Route path='/notes'
                    element={<ProtectedRoute><NotesPage /></ProtectedRoute>}
                  />
                  <Route path='/notes/:id'
                    element={<ProtectedRoute><NotePreviewPage /></ProtectedRoute>}
                  />
                  <Route path='/collection/notes'
                    element={<ProtectedRoute><NotesPage forCollection={true} /></ProtectedRoute>}
                  />
                  <Route path='/edit/:id'
                    element={<ProtectedRoute><NoteEditPage /></ProtectedRoute>}
                  />
                  <Route path='/trash'
                    element={<ProtectedRoute><TrashPage /></ProtectedRoute>}
                  />
                  <Route path='/notes/public/:id'
                    element={<GuestPreviewPage />}
                  />
                  <Route path='*' element={<NotFoundPage />} />
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
