'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { UploadCloud, Video, CheckCircle, FileVideo, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const WebcamRecorder = dynamic(
  () => import('@/components/WebcamRecorder'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-64 bg-surface/50 rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-gray-500 animate-pulse">
        <Video className="w-8 h-8 mb-2 opacity-50"/>
        <span className="text-sm font-medium">Inizializzazione Modulo Ottico...</span>
      </div>
    )
  }
);

type Word = {
  id: number;
  text: string;
};

export default function ContribuisciPage() {
  const supabase = createClient();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'upload' | 'webcam'>('upload');
  const [loading, setLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  const [words, setWords] = useState<Word[]>([]);
  const [selectedWordId, setSelectedWordId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  useEffect(() => {
    const initPage = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      const { data: wordsData } = await supabase
        .from('words')
        .select('id, text')
        .order('text');
      setWords(wordsData || []);
      setIsCheckingAuth(false);
    };
    initPage();
  }, [supabase, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleWebcamRecording = (recordedFile: File) => {
    setFile(recordedFile);
  };

  const handleSubmit = async () => {
    if (!selectedWordId) return alert('Seleziona una parola!');
    if (!file) return alert('Manca il video! Caricalo o registralo.');
    if (!acceptedTerms) return alert('Devi accettare l\'uso dei dati.');
    
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utente non loggato');

      const fileToUpload = file!;
      const fileExt = fileToUpload.name.split('.').pop() || 'mp4';
      const fileName = `${user.id}/${Date.now()}_word${selectedWordId}.${fileExt}`;

      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('contributi_video')
        .upload(fileName, fileToUpload);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from('contributions')
        .insert({
          user_id: user.id,
          word_id: parseInt(selectedWordId),
          video_url: uploadData.path,
          is_approved: false
        });

      if (dbError) throw dbError;

      alert('Video inviato con successo! Grazie.');
      setFile(null);
      setSelectedWordId('');
      setAcceptedTerms(false);
      router.refresh();

    } catch (error: any) {
      console.error('Errore:', error);
      alert('Errore: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (isCheckingAuth) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      {/* SPINNER ROSA */}
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-pink"></div>
    </div>
  );

  return (
    <main className="min-h-screen bg-background text-white py-20 px-6 flex justify-center relative overflow-hidden">
      
      {/* SFONDO ROSA SOFFUSO */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-neon-pink/10 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="max-w-2xl w-full relative z-10">
        
        <div className="mb-8">
          <Link href="/" className="text-gray-400 hover:text-neon-pink flex items-center gap-2 text-sm font-bold transition-colors w-fit">
            <ArrowLeft className="w-4 h-4" /> Torna alla Home
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 font-display tracking-tight">
            Insegna un <span className="text-neon-pink drop-shadow-[0_0_15px_rgba(255,42,109,0.5)]">Nuovo Segno</span>
          </h1>
          <p className="text-gray-400 text-lg font-sans">
            Il tuo contributo è fondamentale. Carica un video o registralo ora.
          </p>
        </div>

        <Card className="border-white/10 bg-surface/60 backdrop-blur-xl hover:border-neon-pink/30 transition-colors">
          <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            
            {/* 1. SELEZIONE (Focus Rosa) */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-300 uppercase tracking-wider">
                1. Quale parola vuoi registrare?
              </label>
              <div className="relative group">
                <select 
                  value={selectedWordId}
                  onChange={(e) => setSelectedWordId(e.target.value)}
                  className="w-full bg-background/50 border border-white/20 rounded-xl p-4 text-white appearance-none outline-none focus:border-neon-pink focus:ring-1 focus:ring-neon-pink transition-all font-sans cursor-pointer group-hover:border-white/30"
                >
                  <option value="" className="bg-surface">-- Seleziona una parola dal dizionario --</option>
                  {words.map((word) => (
                    <option key={word.id} value={word.id} className="bg-surface">
                      {word.text}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-white transition-colors">
                  ▼
                </div>
              </div>
            </div>

            {/* 2. TABS (Accento Rosa) */}
            <div className="bg-background/50 p-1 rounded-xl flex border border-white/10">
              <button
                type="button"
                onClick={() => { setActiveTab('upload'); setFile(null); }}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'upload' 
                    ? 'bg-surfaceHighlight text-neon-pink shadow-lg border border-neon-pink/20' 
                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                }`}
              >
                <UploadCloud className="w-4 h-4" />
                Carica File
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('webcam'); setFile(null); }}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'webcam' 
                    ? 'bg-surfaceHighlight text-neon-pink shadow-lg border border-neon-pink/20' 
                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                }`}
              >
                <Video className="w-4 h-4" />
                Registra Ora
              </button>
            </div>

            {/* 3. AREA DROP (Hover Rosa) */}
            <div className="min-h-[300px] bg-black/20 rounded-2xl border border-white/5 p-4 flex flex-col justify-center relative overflow-hidden">
              
              {activeTab === 'upload' ? (
                <div className="animate-fade-in h-full">
                  <div className="relative h-64 border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center text-center hover:border-neon-pink/50 hover:bg-neon-pink/5 transition-all cursor-pointer group">
                    <input 
                      type="file" 
                      accept="video/*" 
                      onChange={handleFileChange} 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                    />
                    <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-xl">
                      <UploadCloud className="w-8 h-8 text-gray-400 group-hover:text-neon-pink transition-colors" />
                    </div>
                    <p className="text-gray-300 font-medium group-hover:text-white">
                      {file ? file.name : 'Clicca o trascina il video qui'}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">MP4, MOV, WEBM (Max 50MB)</p>
                  </div>
                </div>
              ) : (
                <div className="animate-fade-in w-full">
                  <WebcamRecorder onRecordingComplete={handleWebcamRecording} />
                </div>
              )}

              {file && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full border border-green-500/50 animate-pulse-slow backdrop-blur-md">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wide">Video Pronto</span>
                </div>
              )}
            </div>

            {/* 4. CHECKBOX (Accento Rosa) */}
            <div className="bg-surfaceHighlight/50 p-4 rounded-xl border border-white/5 flex gap-4 items-start group hover:border-neon-pink/30 transition-colors">
              <div className="pt-1">
                <input 
                  type="checkbox" 
                  checked={acceptedTerms} 
                  onChange={(e) => setAcceptedTerms(e.target.checked)} 
                  className="w-5 h-5 rounded border-gray-600 bg-surface text-neon-pink focus:ring-neon-pink cursor-pointer accent-neon-pink" 
                />
              </div>
              <div className="text-xs text-gray-400 leading-relaxed">
                <strong className="text-gray-200 block mb-1">Autorizzazione Dati</strong>
                Confermando, autorizzi l'analisi tramite algoritmi per l'estrazione dei 
                <span className="text-neon-pink font-bold"> landmark biometrici</span>. 
              </div>
            </div>

            {/* 5. SUBMIT (Bottone Rosa) */}
            <div className="pt-2">
              <Button 
                variant="neon-pink" 
                size="lg" 
                type="submit" 
                disabled={loading}
                className="w-full shadow-lg shadow-neon-pink/20"
              >
                {loading ? 'Caricamento...' : 'Invia Contributo'}
              </Button>
            </div>

          </form>
        </Card>
      </div>
    </main>
  );
}