'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { ArrowLeft, X, ShieldCheck } from 'lucide-react' // Aggiunti X e ShieldCheck
import { Card } from '@/components/ui/Card'

// I18N IMPORTS
import { Link, useRouter } from '@/i18n/routing'
import { useTranslations, useLocale } from 'next-intl' // Aggiunto useLocale

export default function LoginPage() {
  const t = useTranslations('Auth');
  const tPolicy = useTranslations('Policy'); // Hook per i testi della Policy
  const locale = useLocale(); // Recupera la lingua corrente (it o en)
  
  const supabase = createClient()
  const router = useRouter()
  
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [showPolicy, setShowPolicy] = useState(false) // Stato per il modale

  // Calcolo sicuro dell'origine per evitare errori lato server
  const origin = typeof window !== 'undefined' ? window.location.origin : '';

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
            // MODIFICA IMPORTANTE: Passiamo il parametro next con la lingua corrente
            redirectTo={`${origin}/auth/callback?next=/${locale}/contribuisci`}
            
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
                  email_label: t('supabase.email_label'),
                  password_label: t('supabase.password_label'),
                  button_label: t('supabase.button_label'),
                  loading_button_label: t('supabase.loading_button_label'),
                  social_provider_text: t('supabase.social_provider_text'),
                },
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
        
        {/* LINK POLICY (Ora apre il modale) */}
        <p className="mt-8 text-xs text-gray-500 text-center max-w-xs mx-auto leading-relaxed">
          {t('policy_text')}{' '}
          <button 
            onClick={() => setShowPolicy(true)} 
            className="text-gray-300 hover:text-neon-pink underline underline-offset-2 transition-colors outline-none focus:text-neon-pink"
          >
            {t('policy_link')}
          </button>.
        </p>

      </div>

      {/* --- MODALE POLICY --- */}
      {showPolicy && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setShowPolicy(false)}
          />
          
          {/* Card Modale */}
          <div className="relative bg-surface border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden">
            
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-surfaceHighlight/50">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-neon-cyan" />
                <h2 className="text-xl font-bold font-display">{tPolicy('title')}</h2>
              </div>
              <button 
                onClick={() => setShowPolicy(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Scrollabile */}
            <div className="p-6 overflow-y-auto text-sm text-gray-300 leading-relaxed font-sans space-y-4">
               {tPolicy.rich('content', {
                  title: (chunks) => <h3 className="text-white font-bold text-lg mt-4 mb-2 font-display">{chunks}</h3>,
                  p: (chunks) => <p className="mb-2">{chunks}</p>,
                  strong: (chunks) => <strong className="text-neon-pink">{chunks}</strong>,
                  // IMPORTANTE: Mappiamo <sep> a un div vuoto per spaziare, risolvendo il problema XML
                  sep: () => <div className="h-4" />, 
                  small: (chunks) => <p className="text-xs text-gray-500 mt-8 border-t border-white/10 pt-4 italic">{chunks}</p>
               })}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/5 bg-background/50 text-right">
              <button
                onClick={() => setShowPolicy(false)}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full font-bold text-sm transition-colors"
              >
                {tPolicy('close')}
              </button>
            </div>

          </div>
        </div>
      )}

    </main>
  )
}