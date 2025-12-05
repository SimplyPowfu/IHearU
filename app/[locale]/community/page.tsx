import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/Card'; 
import { Trophy, ArrowLeft, Video, BookOpen, Clock } from 'lucide-react';

// I18N IMPORTS
import { Link } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

export default async function CommunityPage() {
  // 1. Setup parallelo (Supabase + Traduzioni)
  const t = await getTranslations('Community');
  const supabase = await createClient();

  // SCARICA DATI
  const { data: profiles } = await supabase
    .from('profiles')
    .select('username, avatar_url, total_uploads')
    .gt('total_uploads', 0)
    .order('total_uploads', { ascending: false })
    .limit(10);

  const { data: sumData } = await supabase.from('profiles').select('total_uploads');
  const totalVideosSent = sumData?.reduce((acc, curr) => acc + (curr.total_uploads || 0), 0) || 0;

  const { count: totalWordsCount } = await supabase.from('words').select('*', { count: 'exact', head: true });
  const estimatedMinutes = Math.floor((totalVideosSent * 5) / 60);

  return (
    <main className="min-h-screen bg-background text-white py-20 px-6 relative overflow-hidden">
      
      {/* SFONDO GIALLO/ORO SOFFUSO */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-neon-yellow/10 rounded-full blur-[150px] pointer-events-none z-0 translate-x-1/3 -translate-y-1/3" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        <div className="mb-8">
          <Link href="/" className="text-gray-400 hover:text-neon-yellow flex items-center gap-2 text-sm font-bold transition-colors w-fit">
            <ArrowLeft className="w-4 h-4" /> {t('back_home')}
          </Link>
        </div>

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 font-display tracking-tight">
            {t('title_prefix')} <span className="text-neon-yellow drop-shadow-[0_0_20px_rgba(255,195,0,0.5)]">{t('title_highlight')}</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto font-sans">
            {t('subtitle')}
          </p>
        </div>

        {/* STATISTICHE (Card Gialle/Oro) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          
          <Card className="text-center hover:border-neon-yellow/50 border-neon-yellow/10">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-neon-yellow/10 rounded-full text-neon-yellow">
                <Video className="w-8 h-8" />
              </div>
            </div>
            <div className="text-5xl font-bold text-white mb-2 font-display">{totalVideosSent}</div>
            <div className="text-sm text-neon-yellow uppercase tracking-widest font-bold">{t('stats.videos_sent')}</div>
          </Card>

          <Card className="text-center hover:border-neon-pink/50 border-neon-pink/10">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-neon-pink/10 rounded-full text-neon-pink">
                <BookOpen className="w-8 h-8" />
              </div>
            </div>
            <div className="text-5xl font-bold text-white mb-2 font-display">{totalWordsCount || 0}</div>
            <div className="text-sm text-gray-400 uppercase tracking-widest font-bold">{t('stats.learned_gestures')}</div>
          </Card>

          <Card className="text-center hover:border-neon-cyan/50 border-neon-cyan/10">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-neon-cyan/10 rounded-full text-neon-cyan">
                <Clock className="w-8 h-8" />
              </div>
            </div>
            <div className="text-5xl font-bold text-white mb-2 font-display">{estimatedMinutes}</div>
            <div className="text-sm text-gray-400 uppercase tracking-widest font-bold">{t('stats.data_minutes')}</div>
          </Card>
        </div>

        {/* CLASSIFICA */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Trophy className="w-8 h-8 text-neon-yellow" />
            <h2 className="text-2xl font-bold font-display text-white">{t('ranking.title')}</h2>
          </div>
          
          {(!profiles || profiles.length === 0) ? (
            <div className="text-center text-gray-500 py-20 bg-surface/50 rounded-2xl border border-white/5 border-dashed">
              <p className="mb-2 text-lg">{t('ranking.empty_title')}</p>
              <p className="text-sm">{t('ranking.empty_desc')}</p>
            </div>
          ) : (
            <div className="bg-surface/40 backdrop-blur-md rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              {profiles.map((user, index) => {
                 const initial = (user.username || "A").charAt(0).toUpperCase();
                 // Traduzione nome se anonimo
                 const displayName = user.username || t('ranking.anonymous');
                 
                 // Stili speciali per il podio
                 let rankStyle = "text-gray-500 font-mono text-lg";
                 let rowBg = "hover:bg-white/5";
                 let medal = null;

                 if (index === 0) {
                   rankStyle = "text-neon-yellow text-3xl drop-shadow-md";
                   rowBg = "bg-neon-yellow/10 hover:bg-neon-yellow/20 border-b border-neon-yellow/20";
                   medal = "👑";
                 } else if (index === 1) {
                   rankStyle = "text-gray-300 text-2xl";
                   medal = "🥈";
                 } else if (index === 2) {
                   rankStyle = "text-orange-400 text-2xl";
                   medal = "🥉";
                 }

                 return (
                  <div 
                    key={index} 
                    className={`flex items-center justify-between p-6 border-b border-white/5 last:border-0 transition-all ${rowBg}`}
                  >
                    <div className="flex items-center gap-6">
                      <span className={`font-bold w-12 text-center ${rankStyle}`}>
                        {index + 1}
                      </span>
                      
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt={displayName} className="w-12 h-12 rounded-full border-2 border-white/10" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-surfaceHighlight to-background border border-white/20 flex items-center justify-center font-bold text-white text-lg">
                          {initial}
                        </div>
                      )}
                      
                      <div>
                        <p className="font-bold text-lg text-white font-display flex items-center gap-2">
                          @{displayName} {medal && <span className="text-lg">{medal}</span>}
                        </p>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">{t('ranking.role_label')}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <span className="text-2xl font-bold text-neon-cyan font-display">{user.total_uploads}</span>
                      <span className="text-xs text-gray-500 uppercase tracking-wider">{t('ranking.video_label')}</span>
                    </div>
                  </div>
                 )
              })}
            </div>
          )}
        </section>

        <div className="text-center mt-20">
          <Link href="/contribuisci" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-background bg-neon-yellow rounded-full hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(255,195,0,0.4)]">
            {t('cta')}
          </Link>
        </div>

      </div>
    </main>
  )
}