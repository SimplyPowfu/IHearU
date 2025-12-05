import {getRequestConfig} from 'next-intl/server';
 
export default getRequestConfig(async ({requestLocale}) => {
  // Questo fornisce una lingua predefinita se nessuna è richiesta
  let locale = await requestLocale;
 
  // Assicuriamoci che la lingua sia valida, altrimenti fallback su 'it'
  if (!locale || !['it', 'en'].includes(locale)) {
    locale = 'it';
  }
 
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});