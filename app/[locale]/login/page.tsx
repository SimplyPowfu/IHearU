'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Card } from '@/components/ui/Card'

// I18N IMPORTS
import { Link, useRouter } from '@/i18n/routing' // Usa il router e link localizzati
import { useTranslations } from 'next-intl' // Hook per client components

export default function LoginPage() {
  const t = useTranslations('Auth'); // Inizializza le traduzioni
  const supabase = createClient()
  const router = useRouter() // Questo router gestisce automaticamente i locali (es. /en/contribuisci)
  
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    // 1. Controllo Sessione Iniziale
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setIsRedirecting(true)
        router.replace('/contribuisci')
      }
    }
    checkSession()

    // 2. Ascolto Evento Login
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setIsRedirecting(true)
        router.refresh()
        setTimeout(() => {
          router.replace('/contribuisci')
        }, 500)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase, router])

  if (isRedirecting) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-cyan"></div>
        <p className="mt-4 text-gray-400 font-sans animate-pulse">{t('loading')}</p>
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
          {t('back_home')}
        </Link>
      </div>

      {/* Card Centrale */}
      <div className="w-full max-w-md relative z-10">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-neon-pink to-neon-cyan mb-4 shadow-[0_0_20px_rgba(255,42,109,0.4)]">
            <span className="font-display font-bold text-2xl text-background">I</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 font-display">
            {t('welcome_title')} <span className="text-neon-cyan">{t('welcome_highlight')}</span>
          </h1>
          <p className="text-gray-400 text-sm font-sans">
            {t('welcome_desc')}
          </p>
        </div>

        <Card className="bg-surface/60 backdrop-blur-xl border-white/10 shadow-2xl p-6">
          <Auth
            supabaseClient={supabase}
            // Manteniamo window.location.origin, il middleware gestirà il redirect se necessario
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
            // INIEZIONE TRADUZIONI IN SUPABASE
            localization={{
              variables: {
                sign_in: {
                  email_label: t('supabase.email_label'),
                  password_label: t('supabase.password_label'),
                  button_label: t('supabase.button_label'),
                  loading_button_label: t('supabase.loading_button_label'),
                  social_provider_text: t('supabase.social_provider_text'),
                },
                // Se usi anche la registrazione diretta, puoi mappare anche sign_up qui sotto
              }
            }}
          />

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-sm text-gray-400">
              {t('no_account')}{' '}
              <Link href="/register" className="text-white font-bold hover:text-neon-pink underline decoration-neon-pink/30 underline-offset-4 transition-colors">
                {t('create_account')}
              </Link>
            </p>
          </div>
        </Card>
        
        <p className="mt-8 text-xs text-gray-500 text-center max-w-xs mx-auto leading-relaxed">
          {t('policy_text')} <span className="text-gray-300 hover:text-neon-pink cursor-pointer transition-colors">{t('policy_link')}</span>.
        </p>

      </div>
    </main>
  )
}