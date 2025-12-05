'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState, useRef } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Card } from '@/components/ui/Card'

// I18N IMPORTS
import { Link, useRouter } from '@/i18n/routing'
import { useTranslations } from 'next-intl'

export default function RegisterPage() {
  const t = useTranslations('Auth'); // Hook traduzioni
  const supabase = createClient()
  const router = useRouter() // Router localizzato
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
        <Link href="/" className="text-gray-400 hover:text-white flex items-center gap-2 text-sm font-bold transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> {t('back_home')}
        </Link>
      </div>

      <div className="w-full max-w-md relative z-10">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-display text-white">
            {t('register_title')}
          </h1>
          <p className="text-gray-400 text-sm">{t('register_subtitle')}</p>
        </div>

        <Card className="bg-surface/60 backdrop-blur-xl border-white/10 shadow-2xl p-6">
          <Auth
            supabaseClient={supabase}
            view="sign_up"
            // Il callback gestirà il redirect base, il middleware aggiusterà la lingua se necessario
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
                  email_label: t('supabase.email_label'), // Riutilizziamo la chiave del login
                  password_label: t('supabase.password_label'), // Riutilizziamo la chiave del login
                  button_label: t('supabase.register_button_label'),
                  confirmation_text: t('supabase.confirmation_text'),
                  social_provider_text: t('supabase.social_provider_text'),
                }
              }
            }}
          />
        </Card>
        
        <div className="mt-6 text-center">
           <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">
             {t('have_account')} <span className="text-neon-cyan font-bold">{t('login_link')}</span>
           </Link>
        </div>

      </div>
    </main>
  )
}