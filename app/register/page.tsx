'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail } from 'lucide-react' // Importiamo l'icona Mail
import { Card } from '@/components/ui/Card'

export default function RegisterPage() {
  const supabase = createClient()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)
  
  // Usiamo un ref per gestire l'intervallo ed evitare memory leak
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        // Se sei già loggato, via da qui!
        router.replace('/contribuisci')
      } else {
        setIsChecking(false)
        
        // --- INIZIO MAGIC POLLING ---
        // Se l'utente non è loggato, controlliamo ogni 3 secondi se 
        // per caso ha confermato la mail in un'altra scheda
        intervalRef.current = setInterval(async () => {
          const { data: { session: newSession } } = await supabase.auth.getSession()
          if (newSession) {
            // BOOM! Ha confermato la mail. Lo portiamo dentro.
            if (intervalRef.current) clearInterval(intervalRef.current)
            router.replace('/contribuisci')
          }
        }, 3000)
      }
    }

    checkSession()

    // Pulizia quando esci dalla pagina
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [supabase, router])

  if (isChecking) return <div className="min-h-screen bg-background" />

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
            // Importante: Passiamo il parametro ?next=/contribuisci
            redirectTo={`${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback?next=/contribuisci`}
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
                // Stile per il messaggio di conferma mail
                message: 'text-green-400 text-sm text-center mt-4 p-4 bg-green-500/10 rounded-xl border border-green-500/20 font-bold animate-pulse',
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
                  // Messaggio personalizzato
                  confirmation_text: '📧 Controlla la tua posta! Clicca il link per entrare automaticamente.',
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