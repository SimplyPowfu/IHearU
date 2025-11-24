'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { LogOut, User, AlertTriangle, X } from 'lucide-react'
import { User as SupabaseUser } from '@supabase/supabase-js'

export default function AuthButton({ session }: { session: SupabaseUser | null }) {
  const router = useRouter()
  const supabase = createClient()
  
  const [user, setUser] = useState<SupabaseUser | null>(session)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    setUser(session)
  }, [session])

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (event === 'SIGNED_IN') {
        setUser(newSession?.user ?? null)
        router.refresh()
      }
    })
    return () => subscription.unsubscribe()
  }, [supabase, router])

  const confirmLogout = async () => {
    setShowModal(false)
    await supabase.auth.signOut()
    // Ricarica completa per pulire lo stato
    window.location.href = '/'
  }

  // 1. SE LOGGATO
  if (user) {
    return (
      <>
        {/* TASTO NAVBAR */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-400 font-medium font-sans">
            <User className="w-4 h-4 text-neon-cyan" />
            <span className="max-w-[150px] truncate">
              {user.user_metadata?.username || user.email?.split('@')[0]}
            </span>
          </div>
          
          <button 
            onClick={() => setShowModal(true)}
            title="Esci"
            className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center text-white transition-all shadow-[0_0_15px_rgba(220,38,38,0.5)] hover:scale-110 hover:shadow-[0_0_25px_rgba(220,38,38,0.8)]"
          >
            <LogOut className="w-5 h-5 ml-0.5" />
          </button>
        </div>

        {/* --- POPUP MODALE --- */}
        {showModal && (
          // CONTAINER: Occupa TUTTO lo schermo, Z-index massimo, Flex Center perfetto
          <div className="fixed inset-0 z-[99999] h-screen w-screen flex items-center justify-center px-4 overflow-hidden">
            
            {/* BACKDROP: Sfondo scuro sfocato con animazione fade-in */}
            <div 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
              onClick={() => setShowModal(false)}
            />

            {/* CARD: Centrata, con animazione POP-UP (Zoom In) */}
            <div className="relative bg-surface border border-white/10 rounded-2xl shadow-2xl p-8 w-full max-w-sm z-10 animate-in zoom-in-95 duration-200">
              
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 border border-red-500/20">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-white font-display mb-2">Vuoi uscire?</h3>
                <p className="text-gray-400 font-sans">
                  Verrai disconnesso dal tuo account.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-white/5 text-white hover:bg-white/10 transition-colors border border-white/5"
                >
                  Annulla
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-red-600 text-white hover:bg-red-500 transition-all shadow-lg shadow-red-900/20 hover:scale-[1.02]"
                >
                  Sì, esci
                </button>
              </div>

              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

            </div>
          </div>
        )}
      </>
    )
  }

  // 2. SE ANONIMO
  return (
    <Link 
      href="/login" 
      className="text-sm font-bold font-display text-neon-cyan border border-neon-cyan/30 px-6 py-2 rounded-full hover:bg-neon-cyan/10 hover:border-neon-cyan transition-all shadow-[0_0_10px_rgba(5,217,232,0.1)] hover:shadow-[0_0_20px_rgba(5,217,232,0.3)]"
    >
      Accedi
    </Link>
  )
}