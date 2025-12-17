import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export async function middleware(request: NextRequest) {
  // 1. Eseguiamo prima next-intl per gestire la lingua
  let response = createMiddleware(routing)(request);

  // 2. Setup Supabase Client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Aggiorna i cookie nella richiesta
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          
          // Aggiorna i cookie nella risposta (IL FIX È QUI)
          // Aggiorniamo l'oggetto 'response' creato da next-intl
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 3. Controllo Utente
  // IMPORTANTE: Non usiamo 'await supabase.auth.getUser()' direttamente qui per evitare 
  // conflitti complessi tra middleware intl e supabase.
  // Invece, verifichiamo solo se esiste il cookie di sessione per le rotte protette.
  // Se vuoi una sicurezza totale, usa getUser, ma assicurati che response sia gestita bene.
  
  const { data: { user } } = await supabase.auth.getUser()

  // 4. Logica di Protezione Route
  const path = request.nextUrl.pathname;

  const isProtectedRoute = 
    path.includes('/contribuisci') || 
    path.includes('/profilo');

  const isAuthRoute = 
    path.includes('/login') || 
    path.includes('/register');

  if (isProtectedRoute && !user) {
    const locale = request.nextUrl.pathname.split('/')[1] || 'it'; 
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}/login`
    return NextResponse.redirect(url)
  }

  if (isAuthRoute && user) {
    const locale = request.nextUrl.pathname.split('/')[1] || 'it';
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}/contribuisci`
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: ['/', '/(it|en)/:path*', '/((?!_next|_vercel|.*\\..*).*)']
};