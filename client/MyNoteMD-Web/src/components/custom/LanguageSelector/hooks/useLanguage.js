import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const useLanguage = (onLanguageChangeCallback) => {
  const { i18n, t } = useTranslation(["component"]);

  // Determine current language safely
  const currentLanguage = i18n.resolvedLanguage || i18n.language || 'tr';

  // Language Change Function
  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('language', langCode);

    if (onLanguageChangeCallback) {
      onLanguageChangeCallback();
    }
  };

  // Cross-tab Synchronization (Live)
  useEffect(() => {
    const handleStorageChange = (e) => {
      // If 'language' changes in another tab, update this tab too
      if (e.key === 'language' && e.newValue) {
        i18n.changeLanguage(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [i18n]);

  return {
    currentLanguage,
    changeLanguage,
    t
  };
};