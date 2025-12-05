import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation'; // <-- CAMBIATO QUI

export const routing = defineRouting({
  // Una lista di tutti i locali supportati
  locales: ['it', 'en'],
 
  // Usato quando nessun locale corrisponde
  defaultLocale: 'it',
  
  // Opzionale: prefisso sempre visibile (es. /it/...)
  localePrefix: 'always' 
});
 
// Wrapper leggeri attorno alle API di navigazione di Next.js
export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing); // <-- CAMBIATO QUI