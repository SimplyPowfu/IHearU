import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest, response: NextResponse) {
  // 1. Creiamo il client Supabase usando la risposta passata da next-intl
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Impostiamo i cookie sia sulla richiesta (per uso immediato) che sulla risposta
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // 2. Recuperiamo l'utente
  // ATTENZIONE: getUser è più sicuro di getSession per i middleware
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 3. Definizione Percorsi
  const path = request.nextUrl.pathname;

  // Questa Regex controlla se il percorso è pubblico, supportando i prefissi lingua opzionali
  // Es: /login, /it/login, /en/login, /register, /it/register...
  const isPublicPath = 
    path === '/' || 
    /^\/(it|en)?\/?$/.test(path) ||               // Home page (/ o /it o /en)
    /^\/(it|en)?\/login/.test(path) ||            // Login
    /^\/(it|en)?\/register/.test(path) ||         // Register
    /^\/(it|en)?\/auth/.test(path) ||             // Auth callback
    /^\/(it|en)?\/community/.test(path) ||        // Community (accessibile a tutti)
    /^\/(it|en)?\/progetto/.test(path) ||         // Progetto (accessibile a tutti)
    path.includes('favicon.ico');

  // 4. Logica di Protezione
  // Se l'utente NON è loggato e cerca di andare su una pagina privata (es. /contribuisci, /admin)
  if (!user && !isPublicPath) {
    // Determiniamo la lingua corrente per mantenere la coerenza nel redirect
    const locale = path.startsWith('/en') ? 'en' : 'it';
    
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/login`;
    // Passiamo anche dove voleva andare l'utente come parametro (opzionale ma utile)
    url.searchParams.set('next', path);
    
    return NextResponse.redirect(url);
  }

  // 5. Ritorna la risposta (che contiene già i cookie e header di next-intl)
  return response
}