'use client' // I componenti di errore devono essere Client

import { useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { AlertTriangle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Qui potresti inviare l'errore a un servizio di log (es. Sentry)
    console.error(error)
  }, [error])

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center text-white px-6">
      <div className="bg-surface/50 border border-red-500/30 p-8 rounded-3xl text-center max-w-md backdrop-blur-xl shadow-[0_0_50px_rgba(220,38,38,0.2)]">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 border border-red-500/20">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold mb-2 font-display">Errore di Sistema</h2>
        <p className="text-gray-400 mb-8 font-sans">
          Non siamo riusciti a contattare il database neurale. Potrebbe essere un problema temporaneo.
        </p>
        <Button 
          onClick={() => reset()} 
          variant="neon-pink"
        >
          Riprova la connessione
        </Button>
      </div>
    </main>
  )
}