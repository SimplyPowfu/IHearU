import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server' // Usa il nostro server client

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/contribuisci'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Login riuscito, rimanda l'utente alla pagina corretta
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Se qualcosa va storto, rimanda alla home con un errore
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}