'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Card } from '@/components/ui/Card'

export default function RegisterPage() {
  const supabase = createClient()
  const router = useRouter()
  
  // Stato per evitare flash del contenuto mentre controlliamo
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      // 1. Controlla se l'utente è già loggato
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        // SE LOGGATO: Non sloggare, ma rimanda alla pagina protetta o home
        router.replace('/contribuisci') 
      } else {
        // SE NON LOGGATO: Mostra il form
        setIsChecking(false)
      }
    }

    checkSession()
  }, [supabase, router])

  // Se stiamo ancora controllando, mostra un loading vuoto o uno spinner
  if (isChecking) {
    return <div className="min-h-screen bg-background" />
  }

  return (
    <main className="min-h-screen bg-background text-white flex flex-col items-center justify-center px-4 py-10 relative overflow-hidden">
      
      {/* SFONDO */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[128px] animate-pulse-slow" />
      </div>

      <div className="absolute top-8 left-4 md:left-8 z-20">
        <Link href="/" className="text-gray-400 hover:text-white flex items-center gap-2 text-sm font-bold transition-colors">
          <ArrowLeft className="w-4 h-4" /> Home
        </Link>
      </div>

      <div className="w-full max-w-md relative z-10">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-display text-white">
            Registrati
          </h1>
          <p className="text-gray-400 text-sm">Crea un account per contribuire</p>
        </div>

        <Card className="bg-surface/60 backdrop-blur-xl border-white/10 shadow-2xl p-6">
          <Auth
            supabaseClient={supabase}
            view="sign_up"
            redirectTo={`${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`}
            showLinks={false}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#9333ea', 
                    brandAccent: '#a855f7',
                    inputText: 'white',
                    inputBackground: '#130f25',
                    inputBorder: '#2d2645',
                    inputLabelText: '#94a3b8',
                  }
                },
              },
              className: {
                container: 'w-full',
                button: 'font-bold mt-2',
                label: 'text-xs uppercase font-bold tracking-wider mb-1',
                input: 'focus:border-purple-500 transition-colors',
                // MESSAGGIO DI ERRORE:
                // Ora che hai disabilitato la protezione, se l'utente esiste 
                // apparirà qui in rosso grazie a queste classi.
                message: 'text-red-400 text-sm text-center mt-4 p-3 bg-red-500/10 rounded-lg border border-red-500/20 font-bold',
              }
            }}
            providers={['google']}
            theme="dark"
            localization={{
              variables: {
                sign_up: {
                  email_label: 'Email',
                  password_label: 'Password',
                  button_label: 'Registrati Ora',
                }
              }
            }}
          />
        </Card>
        
        <div className="mt-6 text-center">
           <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">
             Hai già un account? <span className="text-neon-cyan font-bold">Accedi</span>
           </Link>
        </div>

      </div>
    </main>
  )
}