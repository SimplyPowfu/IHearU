'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState, useRef } from 'react'
import { ArrowLeft, X, ShieldCheck } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Link, useRouter } from '@/i18n/routing'
import { useTranslations, useLocale } from 'next-intl'

export default function RegisterPage() {
  const t = useTranslations('Auth');
  const tPolicy = useTranslations('Policy');
  const locale = useLocale();
  
  const supabase = createClient()
  const router = useRouter()
  
  const [isChecking, setIsChecking] = useState(true)
  const [showPolicy, setShowPolicy] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.replace('/contribuisci')
      } else {
        setIsChecking(false)
        intervalRef.current = setInterval(async () => {
          const { data: { session: newSession } } = await supabase.auth.getSession()
          if (newSession) {
            if (intervalRef.current) clearInterval(intervalRef.current)
            router.replace('/contribuisci')
          }
        }, 3000)
      }
    }
    checkSession()
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [supabase, router])

  if (isChecking) return <div className="min-h-screen bg-background" />

  return (
    <main className="min-h-screen bg-background text-white flex flex-col items-center justify-center px-4 py-10 relative overflow-hidden">
      
      {/* SFONDO STATICO (Stile Homepage - Purple/Pink Theme) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Gradiente Viola in alto a sinistra (Statico, leggero) */}
        <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px]" />
        {/* Gradiente Pink in basso a destra (Statico, leggero) */}
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-neon-pink/5 rounded-full blur-[120px]" />
      </div>

      <div className="absolute top-8 left-4 md:left-8 z-20">
        <Link href="/" className="text-gray-400 hover:text-white flex items-center gap-2 text-sm font-bold transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> {t('back_home')}
        </Link>
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-display text-white">{t('register_title')}</h1>
          <p className="text-gray-400 text-sm">{t('register_subtitle')}</p>
        </div>

        <Card className="bg-surface/60 backdrop-blur-xl border-white/10 shadow-2xl p-6">
          <Auth
            supabaseClient={supabase}
            view="sign_up"
            redirectTo={`${origin}/auth/callback?next=/${locale}/contribuisci`}
            showLinks={false}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#9333ea', // Viola per register
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
                message: 'text-green-400 text-sm text-center mt-4 p-4 bg-green-500/10 rounded-xl border border-green-500/20 font-bold',
              }
            }}
            providers={['google']}
            theme="dark"
            localization={{
              variables: {
                sign_up: {
                  email_label: t('supabase.email_label'),
                  password_label: t('supabase.password_label'),
                  button_label: t('supabase.register_button_label'),
                  confirmation_text: t('supabase.confirmation_text'),
                  social_provider_text: t('supabase.social_provider_text'),
                }
              }
            }}
          />
        </Card>
        
        <div className="mt-6 text-center space-y-4">
           <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors block">
             {t('have_account')} <span className="text-neon-cyan font-bold">{t('login_link')}</span>
           </Link>

           <p className="text-xs text-gray-500 text-center max-w-xs mx-auto leading-relaxed">
            {t('policy_text')}{' '}
            <button 
                onClick={() => setShowPolicy(true)} 
                className="text-gray-300 hover:text-purple-400 underline underline-offset-2 transition-colors outline-none focus:text-purple-400"
            >
                {t('policy_link')}
            </button>.
            </p>
        </div>

      </div>

      {/* POLICY MODAL */}
      {showPolicy && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setShowPolicy(false)} />
          
          <div className="relative bg-surface border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden">
            
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-surfaceHighlight/50">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-neon-cyan" />
                <h2 className="text-xl font-bold font-display">{tPolicy('title')}</h2>
              </div>
              <button onClick={() => setShowPolicy(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto text-sm text-gray-300 leading-relaxed font-sans space-y-4">
               {tPolicy.rich('content', {
                  title: (chunks) => <h3 className="text-white font-bold text-lg mt-4 mb-2 font-display">{chunks}</h3>,
                  p: (chunks) => <p className="mb-2">{chunks}</p>,
                  strong: (chunks) => <strong className="text-neon-pink">{chunks}</strong>,
                  sep: () => <div className="h-4" />, 
                  small: (chunks) => <p className="text-xs text-gray-500 mt-8 border-t border-white/10 pt-4 italic">{chunks}</p>
               })}
            </div>

            <div className="p-4 border-t border-white/5 bg-background/50 text-right">
              <button onClick={() => setShowPolicy(false)} className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full font-bold text-sm transition-colors">
                {tPolicy('close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}