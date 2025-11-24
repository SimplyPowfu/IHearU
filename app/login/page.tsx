'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        router.push('/contribuisci')
        router.refresh()
      }
    })
    return () => subscription.unsubscribe()
  }, [supabase, router])

  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4 py-10">
      
      <div className="absolute top-8 left-4 md:left-8">
        <Link href="/" className="text-gray-400 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors">
          ← Torna alla Home
        </Link>
      </div>

      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-8 animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-blue-400 mb-2">Benvenuto in IHearU</h1>
          <p className="text-gray-400 text-sm">
            Accedi o registrati per iniziare a contribuire al progetto.
          </p>
        </div>

        <Auth
          supabaseClient={supabase}
          redirectTo={`${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#2563eb',
                  brandAccent: '#1d4ed8',
                  inputText: 'white',
                  inputBackground: '#111827',
                  inputBorder: '#374151',
                },
                radii: {
                  borderRadiusButton: '8px',
                  buttonBorderRadius: '8px',
                  inputBorderRadius: '8px',
                },
              },
            },
            className: {
              container: 'w-full',
              button: 'font-bold',
              label: 'text-gray-400 text-xs uppercase font-bold',
            }
          }}
          providers={['google']}
          theme="dark"
        />
      </div>
      
      <p className="mt-8 text-xs text-gray-600 text-center max-w-xs">
        Effettuando l'accesso accetti i nostri Termini di Servizio e la Privacy Policy per la raccolta dei dati video.
      </p>

    </main>
  )
}