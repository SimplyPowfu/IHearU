import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ArrowLeft, Cpu, Eye, Zap, Network, Database, Fingerprint } from 'lucide-react';

export default function ProgettoPage() {
  return (
    <main className="min-h-screen bg-background text-white py-20 px-6 relative overflow-hidden">
      
      {/* SFONDO CIANO/BLU SOFFUSO */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-neon-cyan/10 rounded-full blur-[128px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[128px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* NAVIGAZIONE */}
        <div className="mb-12">
          <Link href="/" className="text-gray-400 hover:text-neon-cyan flex items-center gap-2 text-sm font-bold transition-colors w-fit group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
            Torna alla Home
          </Link>
        </div>

        {/* HEADER */}
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan text-xs font-bold uppercase tracking-widest mb-6">
            <Cpu className="w-4 h-4" />
            Architettura neurale
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 font-display tracking-tight">
            Tecnologia <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-primary">Invisibile</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-sans leading-relaxed">
            Non usiamo semplici video. Trasformiamo il movimento umano in dati matematici puri per addestrare un'intelligenza artificiale senza precedenti.
          </p>
        </div>

        {/* SEZIONE 1: IL CORE (Card Gigante) */}
        <div className="mb-24">
          <Card className="border-neon-cyan/30 bg-neon-cyan/5 relative overflow-hidden group">
            <div className="absolute top-1/2 right-10 -translate-y-1/2 p-10 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
              <Fingerprint className="w-64 h-64 text-neon-cyan" />
            </div>
            
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4 font-display text-white">Computer Vision & Landmark</h2>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Al cuore del sistema c'è un motore avanzato che traccia <strong className="text-neon-cyan"> punti chiave per ogni mano</strong> e la struttura facciale.
                  <br/><br/>
                  Quando carichi un video, noi non guardiamo la tua immagine. L'algoritmo estrae solo le coordinate (X, Y, Z) delle articolazioni. È questo scheletro digitale che l'IA impara a leggere.
                </p>
                <ul className="space-y-3 text-gray-400">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-neon-cyan rounded-full shadow-[0_0_10px_#05D9E8]"></div>
                    Privacy by Design (Dati anonimizzati alla fonte)
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-neon-cyan rounded-full shadow-[0_0_10px_#05D9E8]"></div>
                    Precisione millimetrica del tracking
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-neon-cyan rounded-full shadow-[0_0_10px_#05D9E8]"></div>
                    Indipendente dalle condizioni di luce
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* SEZIONE 2: LE SFIDE (Grid) */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          <Card className="hover:border-neon-cyan/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-surfaceHighlight flex items-center justify-center text-neon-cyan mb-4 border border-white/10">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2 font-display">Il Problema dei Dati</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Le IA imparano dagli esempi. Per l'inglese esistono miliardi di testi, per la LIS i dataset erano scarsi e frammentati. Dovevamo crearne uno nuovo.
            </p>
          </Card>

          <Card className="hover:border-neon-cyan/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-surfaceHighlight flex items-center justify-center text-neon-cyan mb-4 border border-white/10">
              <Network className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2 font-display">Crowdsourcing</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Abbiamo capito che non potevamo farlo da soli. Questa piattaforma trasforma ogni utente in un "insegnante" per la macchina.
            </p>
          </Card>

          <Card className="hover:border-neon-cyan/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-surfaceHighlight flex items-center justify-center text-neon-cyan mb-4 border border-white/10">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2 font-display">Training Loop</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Ogni video validato entra nel ciclo di addestramento, migliorando la capacità di riconoscimento del modello.
            </p>
          </Card>
        </div>

        {/* CTA FINALE */}
        <div className="text-center py-12 border-t border-white/5">
          <h2 className="text-3xl font-bold mb-6 font-display">Fai parte del progresso</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Non serve essere esperti di tecnologia. Basta conoscere un segno e condividerlo.
          </p>
          <Link href="/contribuisci">
            <Button variant="neon-cyan" size="lg" className="shadow-[0_0_20px_rgba(5,217,232,0.3)]">
              Contribuisci al Dataset
            </Button>
          </Link>
        </div>

      </div>
    </main>
  );
}