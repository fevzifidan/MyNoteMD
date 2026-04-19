import i18n from "@/i18n";

/**
 * Formats a date string or object into a localized format.
 * Uses the current application language from i18next.
 * 
 * @param date - The date to format (string, number or Date object)
 * @param options - Intl.DateTimeFormatOptions
 * @returns Localized date string
 */
export const formatLocalizedDate = (
  date: string | number | Date,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'medium', timeStyle: 'short' }
): string => {
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return '—';
  }

  // Use the language code from i18next
  const currentLang = i18n.language || 'en';

  try {
    return dateObj.toLocaleString(currentLang, options);
  } catch (error) {
    // Fallback if the language code is not supported by the browser
    return dateObj.toLocaleString(undefined, options);
  }
};
