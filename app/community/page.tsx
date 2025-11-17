import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function CommunityPage() {
  const cookieStore = await cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore as any })

  // 1. SCARICA I PROFILI CON I PUNTEGGI (Video Inviati)
  const { data: profiles } = await supabase
    .from('profiles')
    .select('username, avatar_url, total_uploads')
    .gt('total_uploads', 0)
    .order('total_uploads', { ascending: false })
    .limit(10)

  // 2. DATI GENERALI
  const { data: sumData } = await supabase
    .from('profiles')
    .select('total_uploads')
  
  // Calcolo totale video inviati
  const totalVideosSent = sumData?.reduce((acc, curr) => acc + (curr.total_uploads || 0), 0) || 0;

  // Calcolo totale parole nel dizionario (Segni Imparati)
  const { count: totalWordsCount } = await supabase
    .from('words')
    .select('*', { count: 'exact', head: true })

  const estimatedMinutes = Math.floor((totalVideosSent * 5) / 60);

  return (
    <main className="min-h-screen bg-gray-900 text-white py-20 px-6">
      
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-blue-400">
          La Hall of Fame
        </h1>
        <p className="text-xl text-gray-300">
          Classifica basata sui video inviati. Ogni contributo conta!
        </p>
      </div>

      {/* STATISTICHE */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
        {/* Card 1 */}
        <div className="bg-gray-800 p-8 rounded-2xl text-center border border-gray-700 shadow-lg">
          <div className="text-5xl font-bold text-blue-500 mb-2">{totalVideosSent}</div>
          <div className="text-gray-400 uppercase tracking-wider text-sm">Video Inviati</div>
        </div>
        
        {/* Card 2 - MODIFICATA QUI */}
        <div className="bg-gray-800 p-8 rounded-2xl text-center border border-gray-700 shadow-lg">
          <div className="text-5xl font-bold text-purple-500 mb-2">{totalWordsCount || 0}</div>
          <div className="text-gray-400 uppercase tracking-wider text-sm">Segni Imparati</div>
        </div>
        
        {/* Card 3 */}
        <div className="bg-gray-800 p-8 rounded-2xl text-center border border-gray-700 shadow-lg">
          <div className="text-5xl font-bold text-green-500 mb-2">{estimatedMinutes}</div>
          <div className="text-gray-400 uppercase tracking-wider text-sm">Minuti di Dati</div>
        </div>
      </div>

      {/* CLASSIFICA */}
      <section className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-8 text-center">Top Contributors 🏆</h2>
        
        {(!profiles || profiles.length === 0) ? (
          <div className="text-center text-gray-500 py-12 bg-gray-800/50 rounded-xl border border-gray-700 border-dashed">
            <p className="mb-4 text-lg">La classifica è ancora vuota.</p>
            <p className="text-sm">Invia il primo video per apparire qui!</p>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-xl">
            {profiles.map((user, index) => {
               const initial = (user.username || "A").charAt(0).toUpperCase();
               const displayName = user.username || "Utente Anonimo";

               return (
                <div 
                  key={index} 
                  className={`flex items-center justify-between p-4 border-b border-gray-700 last:border-0 hover:bg-gray-750 transition-colors ${index < 3 ? 'bg-blue-900/10' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`font-bold w-8 text-center text-xl ${
                      index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-orange-400' : 'text-gray-600'
                    }`}>
                      {index + 1}
                    </span>
                    
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt={displayName} className="w-10 h-10 rounded-full border border-gray-600" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center font-bold text-white">
                        {initial}
                      </div>
                    )}
                    
                    <div>
                      <p className="font-semibold text-lg text-blue-100">
                        {displayName}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-gray-900/50 px-3 py-1 rounded-full border border-gray-700">
                    <span className="text-blue-400 font-bold">{user.total_uploads}</span>
                    <span className="text-xs text-gray-400 uppercase">invii</span>
                  </div>
                </div>
               )
            })}
          </div>
        )}
      </section>

      <div className="text-center mt-16">
        <Link href="/contribuisci" className="inline-block bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-200 transition-all transform hover:scale-105 shadow-lg">
          Entra in classifica
        </Link>
      </div>

    </main>
  )
}