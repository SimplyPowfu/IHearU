'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react' // Aggiungi useState per gestire lo stato di caricamento
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Card } from '@/components/ui/Card'

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()
  // Usiamo questo stato per nascondere il form appena avviene il login
  // Questo evita che l'utente provi a cliccare altro mentre reindirizziamo
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    // 1. Controllo Sessione Iniziale (Se arrivo già loggato)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setIsRedirecting(true) // Nasconde UI
        router.replace('/contribuisci')
      }
    }
    checkSession()

    // 2. Ascolto Evento Login
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setIsRedirecting(true) // Feedback visivo immediato (UI sparisce/carica)
        router.refresh()
        setTimeout(() => {
          router.replace('/contribuisci')
        }, 500) // 500ms sono impercettibili all'occhio ma eterni per la CPU, assicurano il sync
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase, router])
  if (isRedirecting) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-cyan"></div>
        <p className="mt-4 text-gray-400 font-sans animate-pulse">Accesso al terminale in corso...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background text-white flex flex-col items-center justify-center px-4 py-10 relative overflow-hidden">
      
      {/* SFONDO */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-neon-pink/20 rounded-full blur-[128px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-neon-cyan/10 rounded-full blur-[128px] animate-pulse-slow" />
      </div>

      {/* Link Indietro */}
      <div className="absolute top-8 left-4 md:left-8 z-20">
        <Link href="/" className="text-gray-400 hover:text-neon-cyan flex items-center gap-2 text-sm font-bold transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
          Torna alla Home
        </Link>
      </div>

      {/* Card Centrale */}
      <div className="w-full max-w-md relative z-10">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-neon-pink to-neon-cyan mb-4 shadow-[0_0_20px_rgba(255,42,109,0.4)]">
            <span className="font-display font-bold text-2xl text-background">I</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 font-display">
            Benvenuto nel <span className="text-neon-cyan">Futuro</span>
          </h1>
          <p className="text-gray-400 text-sm font-sans">
            Accedi al terminale per contribuire al dataset.
          </p>
        </div>

        <Card className="bg-surface/60 backdrop-blur-xl border-white/10 shadow-2xl p-6">
          <Auth
            supabaseClient={supabase}
            redirectTo={`${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`}
            showLinks={false} 
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#FF2A6D',
                    brandAccent: '#ff4d85',
                    inputText: 'white',
                    inputBackground: '#130f25',
                    inputBorder: '#2d2645',
                    inputLabelText: '#94a3b8',
                  },
                  radii: {
                    borderRadiusButton: '12px',
                    buttonBorderRadius: '12px',
                    inputBorderRadius: '12px',
                  },
                  borderWidths: {
                    buttonBorderWidth: '0px',
                    inputBorderWidth: '1px',
                  },
                  fonts: {
                    bodyFontFamily: `var(--font-inter)`,
                    buttonFontFamily: `var(--font-outfit)`,
                  }
                },
              },
              className: {
                container: 'w-full',
                button: 'font-bold transition-transform hover:scale-[1.02]',
                label: 'text-xs uppercase font-bold tracking-wider mb-1',
                input: 'focus:border-neon-cyan transition-colors',
              }
            }}
            providers={['google']}
            theme="dark"
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Email',
                  password_label: 'Password',
                  button_label: 'Accedi al Sistema',
                },
                sign_up: {
                  email_label: 'Email',
                  password_label: 'Crea Password',
                  button_label: 'Registra Account',
                }
              }
            }}
          />

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-sm text-gray-400">
              Non hai ancora un account?{' '}
              <Link href="/register" className="text-white font-bold hover:text-neon-pink underline decoration-neon-pink/30 underline-offset-4 transition-colors">
                Crea un account
              </Link>
            </p>
          </div>
        </Card>
        
        <p className="mt-8 text-xs text-gray-500 text-center max-w-xs mx-auto leading-relaxed">
          L'accesso comporta l'accettazione della nostra <span className="text-gray-300 hover:text-neon-pink cursor-pointer transition-colors">Data Policy</span>.
        </p>

      </div>
    </main>
  )
}