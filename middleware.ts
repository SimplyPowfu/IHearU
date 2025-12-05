import createMiddleware from 'next-intl/middleware';
import { updateSession } from '@/lib/supabase/middleware';
import { type NextRequest } from 'next/server';
import { routing } from '@/i18n/routing'; // Importa la config di routing

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  // 1. Prima gestiamo la lingua
  const response = intlMiddleware(request);

  // 2. Poi gestiamo la sessione Supabase INIETTANDO la risposta di intl
  return await updateSession(request, response);
}

export const config = {
  matcher: [
    // Matcher che esclude file statici, immagini, e cartelle interne di Next
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};