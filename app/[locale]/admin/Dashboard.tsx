'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type PendingVideo = {
  id: number
  video_url: string
  created_at: string
  signedUrl: string
  words: {
    text: string
  }
}

export default function AdminDashboard({ initialData }: { initialData: PendingVideo[] }) {
  const [videos, setVideos] = useState(initialData)
  const [loadingId, setLoadingId] = useState<number | null>(null)
  const supabase = createClient()
  const router = useRouter()

  // --- AZIONE: APPROVA ---
  const handleApprove = async (id: number) => {
    setLoadingId(id)
    const { error } = await supabase
      .from('contributions')
      .update({ is_approved: true })
      .eq('id', id)

    if (error) {
      alert('Errore aggiornamento: ' + error.message)
    } else {
      setVideos(videos.filter(v => v.id !== id))
      router.refresh()
    }
    setLoadingId(null)
  }

  // --- AZIONE: SCARTA E PULISCI SPAZIO ---
  const handleReject = async (id: number, videoPath: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo video? Questa azione libererà spazio nello storage.')) return

    setLoadingId(id)

    try {
      // 1. CANCELLA IL FILE FISICO (Storage)
      // È importante farlo PRIMA o INSIEME al database per non perdere il riferimento.
      const { error: storageError } = await supabase
        .storage
        .from('contributi_video')
        .remove([videoPath])

      if (storageError) {
        console.error('Errore cancellazione file:', storageError)
        alert('Attenzione: Il file non è stato cancellato dallo storage. Controlla i permessi.')
        // Non blocchiamo l'operazione, proviamo comunque a pulire il DB
      }

      // 2. CANCELLA LA RIGA (Database)
      const { error: dbError } = await supabase
        .from('contributions')
        .delete()
        .eq('id', id)

      if (dbError) throw dbError

      // 3. Aggiorna la UI
      setVideos(videos.filter(v => v.id !== id))
      router.refresh()
      console.log('Video eliminato e spazio liberato.')

    } catch (error: any) {
      alert('Errore durante l\'eliminazione: ' + error.message)
    } finally {
      setLoadingId(null)
    }
  }

  if (videos.length === 0) {
    return <div className="text-center text-gray-400 py-20">Nessun video in attesa di approvazione! 🎉</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video) => (
        <div key={video.id} className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg">
          
          {/* PLAYER VIDEO */}
          <div className="aspect-video bg-black relative">
            <video 
              src={video.signedUrl} 
              controls 
              className="w-full h-full object-contain"
            />
          </div>

          {/* INFO E CONTROLLI */}
          <div className="p-4">
            <h3 className="text-xl font-bold text-blue-400 mb-1">
              {video.words.text}
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Caricato il: {new Date(video.created_at).toLocaleDateString()}
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => handleApprove(video.id)}
                disabled={loadingId === video.id}
                className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg font-bold transition-colors disabled:opacity-50"
              >
                ✅ Approva
              </button>
              <button
                onClick={() => handleReject(video.id, video.video_url)}
                disabled={loadingId === video.id}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg font-bold transition-colors disabled:opacity-50"
              >
                ❌ Scarta
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}