import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Video, Mic, Hand, Globe, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing'; 
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({locale, namespace: 'Home.hero'});
  
  return {
    title: `IHearU | ${t('badge')}`,
    description: t('subtitle').substring(0, 160),
  };
}

export default async function HomePage() {
  const t = await getTranslations('Home');
  const supabase = await createClient();
  
  // 1. Fetch Parallelo (Ottimizzato)
  const [sumRes, wordsRes] = await Promise.all([
    supabase.from('profiles').select('total_uploads'),
    supabase.from('words').select('*', { count: 'exact', head: true })
  ]);

  const totalVideosSent = sumRes.data?.reduce((acc, curr) => acc + (curr.total_uploads || 0), 0) || 0;
  const totalWordsCount = wordsRes.count || 0;

  return (
    <main className="flex flex-col items-center overflow-hidden min-h-screen bg-background text-white relative">
      
      {/* SFONDO STATICO (Blue/Cyan Theme - Leggero) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-neon-cyan/5 rounded-full blur-[120px]" />
         <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-neon-pink/5 rounded-full blur-[120px]" />
      </div>
      
      {/* HERO SECTION */}
      <section className="relative z-10 w-full flex flex-col items-center justify-center text-center px-6 pt-32 pb-20">
        
        {/* Badge Crowdsourcing (Verde Success) */}
        <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface/80 border border-white/10 backdrop-blur-sm text-sm font-medium text-success shadow-lg animate-fade-in-up">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
          </span>
          {t('hero.badge')}
        </div>

        <h1 className="max-w-5xl text-5xl md:text-7xl font-extrabold font-display tracking-tight mb-8 leading-[1.1] animate-fade-in-up animation-delay-100">
          {t('hero.title_prefix')} 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-cyan">
            {t('hero.title_highlight')}
          </span>
        </h1>
        
        <p className="max-w-2xl text-lg md:text-xl text-gray-400 mb-10 leading-relaxed font-sans whitespace-pre-line animate-fade-in-up animation-delay-200">
          {t('hero.subtitle')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-fade-in-up animation-delay-300">
          <Link href="/contribuisci">
            {/* Bottone Neon Pink (Tasto Principale) */}
            <Button size="lg" className="w-full sm:w-auto group font-display bg-neon-pink text-white hover:bg-neon-pink/90 shadow-[0_0_20px_rgba(255,42,109,0.4)] border border-transparent transition-all hover:scale-105">
              <Hand className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
              {t('hero.cta_contribute')}
            </Button>
          </Link>
          <Link href="/progetto">
            <Button variant="glass" size="lg" className="w-full sm:w-auto font-display border-white/10 hover:bg-surfaceHighlight">
              {t('hero.cta_tech')}
            </Button>
          </Link>
        </div>

      </section>

      {/* STATISTICHE */}
      <div className="relative z-10 w-full border-y border-white/5 bg-surface/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-around items-center gap-8">
          
          <div className="text-center group cursor-default">
            <div className="text-5xl font-bold mb-1 font-display text-neon-pink drop-shadow-[0_0_15px_rgba(255,42,109,0.3)] group-hover:scale-110 transition-transform duration-300">
              {totalVideosSent}
            </div>
            <div className="text-sm text-gray-400 uppercase tracking-widest font-semibold font-sans group-hover:text-neon-pink transition-colors">
              {t('stats.collected_signs')}
            </div>
          </div>
          
          <div className="hidden md:block w-px h-16 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
          
          <div className="text-center group cursor-default">
            <div className="text-5xl font-bold mb-1 font-display text-neon-cyan drop-shadow-[0_0_15px_rgba(5,217,232,0.3)] group-hover:scale-110 transition-transform duration-300">
              {totalWordsCount || 0}
            </div>
            <div className="text-sm text-gray-400 uppercase tracking-widest font-semibold font-sans group-hover:text-neon-cyan transition-colors">
              {t('stats.learned_gestures')}
            </div>
          </div>
          
          <div className="hidden md:block w-px h-16 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
          
          <Link href="/community" className="group text-center cursor-pointer hover:scale-105 transition-transform">
            <div className="flex items-center justify-center gap-2 text-neon-yellow font-bold text-lg font-display drop-shadow-[0_0_10px_rgba(255,195,0,0.3)]">
              {t('stats.hall_of_fame')} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform"/>
            </div>
            <div className="text-sm text-gray-400 uppercase tracking-widest font-semibold mt-1 font-sans transition-colors">
              {t('stats.view_ranking')}
            </div>
          </Link>

        </div>
      </div>

      {/* HOW IT WORKS */}
      <section className="relative z-10 w-full max-w-7xl px-6 py-32">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 font-display">{t('how_it_works.title')}</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg font-sans">
            {t('how_it_works.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="hover:border-neon-pink/50 transition-colors group bg-surface border-white/5">
            <div className="w-14 h-14 rounded-2xl bg-neon-pink/10 flex items-center justify-center text-neon-pink mb-6 border border-neon-pink/20 shadow-[0_0_15px_rgba(255,42,109,0.1)] group-hover:shadow-[0_0_25px_rgba(255,42,109,0.3)] transition-shadow">
              <Video className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white font-display group-hover:text-neon-pink transition-colors">{t('how_it_works.step1_title')}</h3>
            <p className="text-gray-400 leading-relaxed font-sans">
              {t('how_it_works.step1_desc')}
            </p>
          </Card>

          <Card className="hover:border-neon-cyan/50 transition-colors group bg-surface border-white/5">
            <div className="w-14 h-14 rounded-2xl bg-neon-cyan/10 flex items-center justify-center text-neon-cyan mb-6 border border-neon-cyan/20 shadow-[0_0_15px_rgba(5,217,232,0.1)] group-hover:shadow-[0_0_25px_rgba(5,217,232,0.3)] transition-shadow">
              <Globe className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white font-display group-hover:text-neon-cyan transition-colors">{t('how_it_works.step2_title')}</h3>
            <p className="text-gray-400 leading-relaxed font-sans">
              {t('how_it_works.step2_desc')}
            </p>
          </Card>

          <Card className="hover:border-success/50 transition-colors group bg-surface border-white/5">
            <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center text-success mb-6 border border-success/20 shadow-[0_0_15px_rgba(16,185,129,0.1)] group-hover:shadow-[0_0_25px_rgba(16,185,129,0.3)] transition-shadow">
              <Mic className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white font-display group-hover:text-success transition-colors">{t('how_it_works.step3_title')}</h3>
            <p className="text-gray-400 leading-relaxed font-sans">
              {t('how_it_works.step3_desc')}
            </p>
          </Card>
        </div>
      </section>

    </main>
  );
}