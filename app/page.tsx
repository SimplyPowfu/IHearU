import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Video, Mic, Hand, Globe, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const supabase = await createClient();
  
  // 1. VIDEO TOTALI (Rosa)
  const { data: sumData } = await supabase
    .from('profiles')
    .select('total_uploads');
  const totalVideosSent = sumData?.reduce((acc, curr) => acc + (curr.total_uploads || 0), 0) || 0;

  // 2. GESTI IMPARATI (Ciano)
  const { count: totalWordsCount } = await supabase
    .from('words')
    .select('*', { count: 'exact', head: true });

  return (
    <main className="flex flex-col items-center overflow-hidden bg-background text-white min-h-screen">
      
      {/* --- HERO BACKGROUND --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-neon-pink/20 rounded-full blur-[128px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-neon-cyan/10 rounded-full blur-[128px] animate-pulse-slow" />
      </div>

      {/* --- HERO CONTENT --- */}
      <section className="relative z-10 w-full flex flex-col items-center justify-center text-center px-6 pt-32 pb-20">
        
        <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface/80 border border-white/10 backdrop-blur-sm text-sm font-medium text-green-400 shadow-lg animate-float">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
          </span>
          Crowdsourcing Attivo: Unisciti alla rivoluzione
        </div>

        <h1 className="max-w-5xl text-5xl md:text-7xl font-extrabold font-display tracking-tight mb-8 leading-[1.1]">
          Dare voce al <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-cyan">silenzio.</span>
        </h1>
        
        <p className="max-w-2xl text-lg md:text-xl text-gray-400 mb-10 leading-relaxed font-sans">
          Costruiamo insieme il primo traduttore universale LIS ↔ Voce.
          <br /> Un'Intelligenza Artificiale addestrata dalle persone, per le persone.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link href="/contribuisci">
            <Button size="lg" className="w-full sm:w-auto group font-display">
              <Hand className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
              Insegna un Segno
            </Button>
          </Link>
          <Link href="/progetto">
            <Button variant="glass" size="lg" className="w-full sm:w-auto font-display">
              Scopri la Tecnologia
            </Button>
          </Link>
        </div>

      </section>

      {/* --- STATS STRIP --- */}
      <div className="relative z-10 w-full border-y border-white/5 bg-surface/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-around items-center gap-8">
          
          {/* COLONNA 1: Video totali (ROSA NEON) */}
          <div className="text-center group cursor-default">
            <div className="text-5xl font-bold mb-1 font-display text-neon-pink drop-shadow-[0_0_15px_rgba(255,42,109,0.5)] group-hover:scale-110 transition-transform duration-300">
              {totalVideosSent}
            </div>
            <div className="text-sm text-gray-400 uppercase tracking-widest font-semibold font-sans group-hover:text-neon-pink transition-colors">
              Segni Raccolti
            </div>
          </div>
          
          <div className="hidden md:block w-px h-16 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
          
          {/* COLONNA 2: Gesti Imparati (CIANO NEON) */}
          <div className="text-center group cursor-default">
            <div className="text-5xl font-bold mb-1 font-display text-neon-cyan drop-shadow-[0_0_15px_rgba(5,217,232,0.5)] group-hover:scale-110 transition-transform duration-300">
              {totalWordsCount || 0}
            </div>
            <div className="text-sm text-gray-400 uppercase tracking-widest font-semibold font-sans group-hover:text-neon-cyan transition-colors">
              Gesti Imparati
            </div>
          </div>
          
          <div className="hidden md:block w-px h-16 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
          
          {/* COLONNA 3: Link Hall of Fame (GIALLO NEON / BIANCO) */}
          <Link href="/community" className="group text-center cursor-pointer hover:scale-105 transition-transform">
            <div className="flex items-center justify-center gap-2 text-neon-yellow font-bold text-lg font-display drop-shadow-[0_0_10px_rgba(255,195,0,0.4)]">
              Hall of Fame <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform"/>
            </div>
            <div className="text-sm text-gray-400 uppercase tracking-widest font-semibold mt-1 font-sans transition-colors">
              Vedi Classifica
            </div>
          </Link>

        </div>
      </div>

      {/* --- HOW IT WORKS --- */}
      <section className="relative z-10 w-full max-w-7xl px-6 py-32">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 font-display">Come Funziona</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg font-sans">
            Un ciclo virtuoso tra uomo e macchina per abbattere le barriere linguistiche.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="hover:border-neon-pink/50 transition-colors group">
            <div className="w-14 h-14 rounded-2xl bg-neon-pink/10 flex items-center justify-center text-neon-pink mb-6 border border-neon-pink/20 shadow-[0_0_15px_rgba(255,42,109,0.15)] group-hover:shadow-[0_0_25px_rgba(255,42,109,0.4)] transition-shadow">
              <Video className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white font-display group-hover:text-neon-pink transition-colors">1. Registra</h3>
            <p className="text-gray-400 leading-relaxed font-sans">
              Usa la webcam o carica un video. Il nostro sistema estrae i punti chiave delle mani proteggendo la tua privacy.
            </p>
          </Card>

          <Card className="hover:border-neon-cyan/50 transition-colors group">
            <div className="w-14 h-14 rounded-2xl bg-neon-cyan/10 flex items-center justify-center text-neon-cyan mb-6 border border-neon-cyan/20 shadow-[0_0_15px_rgba(5,217,232,0.15)] group-hover:shadow-[0_0_25px_rgba(5,217,232,0.4)] transition-shadow">
              <Globe className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white font-display group-hover:text-neon-cyan transition-colors">2. Addestra</h3>
            <p className="text-gray-400 leading-relaxed font-sans">
              I dati anonimizzati vengono usati per insegnare alla rete neurale a riconoscere i movimenti complessi della LIS.
            </p>
          </Card>

          <Card className="hover:border-success/50 transition-colors group">
            <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 mb-6 border border-green-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)] group-hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-shadow">
              <Mic className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white font-display group-hover:text-green-400 transition-colors">3. Traduci</h3>
            <p className="text-gray-400 leading-relaxed font-sans">
              L'IA diventa capace di tradurre in tempo reale da video a voce e viceversa tramite Avatar 3D.
            </p>
          </Card>
        </div>
      </section>

    </main>
  );
}