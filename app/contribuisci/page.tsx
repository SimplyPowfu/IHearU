'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { UploadCloud, Video, CheckCircle, ArrowLeft, Info, Camera, X, Film, Trash2 } from 'lucide-react';
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

// --- COMPONENTE ILLUSTRAZIONE ANGOLO ---
const AngleIllustration = ({ angle, label, color }: { angle: string, label: string, color: string }) => {
  let rotation = 'rotate-0'; 
  let position = 'top-1 left-1/2 -translate-x-1/2'; 
  
  if (angle === 'left') {
    rotation = 'rotate-[335deg]'; 
    position = 'top-1 left-5';
  } else if (angle === 'right') {
    rotation = '-rotate-[335deg]';
    position = 'top-1 right-5';
  }

  const themeColorClass = color === 'cyan' ? 'text-neon-cyan' : 'text-neon-pink';

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-28 h-28 bg-surface rounded-full border border-white/10 flex items-center justify-center shadow-inner overflow-hidden">
        
        {/* Utente */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10 pt-8">
          <div className="w-8 h-8 bg-gray-400 rounded-full border-2 border-surface shadow-md relative z-20" />
          <div className="w-16 h-6 bg-gray-600 rounded-full mt-[-25px] shadow-sm relative z-10" />
        </div>

        {/* Camera + Cono */}
        <div className={`absolute ${position} transition-all duration-500 origin-center z-20`}>
           <div className={`flex flex-col items-center ${rotation}`}>
              <Camera className={`w-6 h-6 ${themeColorClass} drop-shadow-[0_0_5px_rgba(0,0,0,0.8)] relative z-20 mb-[-5px]`} />
              <svg width="60" height="80" viewBox="0 0 60 80" className={`opacity-20 ${themeColorClass} fill-current relative z-0`}>
                <path d="M30 0 L60 65 L0 65 Z" />
              </svg>
           </div>
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:10px_10px] opacity-50 pointer-events-none" />
      </div>
      <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{label}</span>
    </div>
  )
}

export default function ContribuisciPage() {
  const supabase = createClient();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'upload' | 'webcam'>('upload');
  const [loading, setLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  const [words, setWords] = useState<Word[]>([]);
  const [selectedWordId, setSelectedWordId] = useState('');
  
  // MODIFICA: Array di file invece di singolo file
  const [files, setFiles] = useState<File[]>([]);
  
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

  // MODIFICA: Aggiunge i file alla lista esistente
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  // MODIFICA: Aggiunge la registrazione alla lista esistente
  const handleWebcamRecording = (recordedFile: File) => {
    setFiles((prev) => [...prev, recordedFile]);
  };

  // NUOVO: Rimuove un singolo file dalla lista
  const removeFile = (indexToRemove: number) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async () => {
    if (!selectedWordId) return alert('Seleziona una parola!');
    if (files.length === 0) return alert('La lista dei video è vuota! Carica o registra almeno un video.');
    if (!acceptedTerms) return alert('Devi accettare l\'uso dei dati.');
    
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utente non loggato');

      // MODIFICA: Ciclo su tutti i file in coda
      let uploadedCount = 0;

      for (const fileToUpload of files) {
        const fileExt = fileToUpload.name.split('.').pop() || 'mp4';
        // Aggiungiamo un random o index per evitare conflitti se i nomi sono uguali
        const uniqueId = Math.random().toString(36).substring(7);
        const fileName = `${user.id}/${Date.now()}_${uniqueId}_word${selectedWordId}.${fileExt}`;

        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('contributi_video')
          .upload(fileName, fileToUpload);

        if (uploadError) {
          console.error(`Errore upload file ${fileToUpload.name}:`, uploadError);
          continue; // Salta questo file ma prova con gli altri
        }

        const { error: dbError } = await supabase
          .from('contributions')
          .insert({
            user_id: user.id,
            word_id: parseInt(selectedWordId),
            video_url: uploadData.path,
            is_approved: false
          });

        if (dbError) {
           console.error(`Errore DB file ${fileToUpload.name}:`, dbError);
        } else {
          uploadedCount++;
        }
      }

      if (uploadedCount > 0) {
        alert(`${uploadedCount} video inviati con successo! Grazie.`);
        setFiles([]); // Pulisci la coda
        setSelectedWordId('');
        setAcceptedTerms(false);
        router.refresh();
      } else {
        throw new Error("Nessun video è stato caricato correttamente.");
      }

    } catch (error: any) {
      console.error('Errore:', error);
      alert('Errore: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (isCheckingAuth) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neon-pink"></div>
    </div>
  );

  return (
    <main className="min-h-screen bg-background text-white py-20 px-6 flex justify-center relative overflow-hidden">
      
      {/* SFONDO */}
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
            Carica più video contemporaneamente per aiutare l'IA a imparare meglio.
          </p>
        </div>

        {/* --- CARD ISTRUZIONI --- */}
        <Card className="mb-8 border-neon-cyan/20 bg-neon-cyan/5 backdrop-blur-md overflow-hidden relative">
          
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-neon-cyan/20 rounded-lg text-neon-cyan">
                <Info className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-display">Istruzioni di Registrazione</h3>
                <p className="text-xs text-gray-400">
                  Per creare avatar 3D accurati, l'IA ha bisogno di vedere il gesto da più angolazioni, registra 1 video per ogni angolazione.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* 1. SINISTRA */}
              <div className="bg-black/20 rounded-xl p-4 flex flex-col items-center text-center border border-white/5 hover:border-neon-cyan/30 transition-colors">
                <div className="mb-4">
                  <AngleIllustration angle="left" label="~30° SX" color="cyan" />
                </div>
                <p className="font-bold text-white text-sm mb-1">Angolo Sinistro</p>
                <p className="text-xs text-gray-400">
                  Camera in alto a sinistra.
                </p>
              </div>

              {/* 2. FRONTALE (Centrale per importanza) */}
              <div className="bg-black/20 rounded-xl p-4 flex flex-col items-center text-center border border-neon-cyan/30 bg-neon-cyan/5 shadow-lg transition-colors scale-105 z-10">
                <div className="mb-4">
                  <AngleIllustration angle="center" label="Frontale" color="cyan" />
                </div>
                <p className="font-bold text-white text-sm mb-1">Frontale</p>
                <p className="text-xs text-gray-400">
                  Camera dritta davanti a te.
                </p>
              </div>

              {/* 3. DESTRA */}
              <div className="bg-black/20 rounded-xl p-4 flex flex-col items-center text-center border border-white/5 hover:border-neon-cyan/30 transition-colors">
                <div className="mb-4">
                   <AngleIllustration angle="right" label="~30° DX" color="cyan" />
                </div>
                <p className="font-bold text-white text-sm mb-1">Angolo Destro</p>
                <p className="text-xs text-gray-400">
                  Camera in alto a destra.
                </p>
              </div>

            </div>
            
            <div className="mt-6 text-center">
              <span className="text-xs font-mono text-neon-cyan bg-neon-cyan/10 px-3 py-1 rounded-full border border-neon-cyan/20">
                Suggerimento: Basta ruotare leggermente il busto se la camera è fissa.
              </span>
            </div>
          </div>
        </Card>

        {/* --- FORM DI UPLOAD --- */}
        <Card className="border-white/10 bg-surface/60 backdrop-blur-xl hover:border-neon-pink/30 transition-colors">
          <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            
            {/* 1. SELEZIONE */}
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

            {/* 2. TABS */}
            <div className="bg-background/50 p-1 rounded-xl flex border border-white/10">
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
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
                onClick={() => setActiveTab('webcam')}
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

            {/* 3. AREA DROP / WEBCAM */}
            <div className="min-h-[300px] bg-black/20 rounded-2xl border border-white/5 p-4 flex flex-col justify-center relative overflow-hidden">
              
              {activeTab === 'upload' ? (
                <div className="animate-fade-in h-full">
                  <div className="relative h-64 border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center text-center hover:border-neon-pink/50 hover:bg-neon-pink/5 transition-all cursor-pointer group">
                    {/* MODIFICA: attributo multiple aggiunto */}
                    <input 
                      type="file" 
                      accept="video/*" 
                      multiple
                      onChange={handleFileChange} 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                    />
                    <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-xl">
                      <UploadCloud className="w-8 h-8 text-gray-400 group-hover:text-neon-pink transition-colors" />
                    </div>
                    <p className="text-gray-300 font-medium group-hover:text-white">
                      Clicca o trascina uno o più video qui
                    </p>
                    <p className="text-xs text-gray-500 mt-2">MP4, MOV, WEBM (Puoi caricarne più di uno)</p>
                  </div>
                </div>
              ) : (
                <div className="animate-fade-in w-full">
                  <WebcamRecorder onRecordingComplete={handleWebcamRecording} />
                  <p className="text-center text-xs text-gray-400 mt-2">
                    Ogni volta che termini una registrazione, il video viene aggiunto alla coda in basso.
                  </p>
                </div>
              )}
            </div>

            {/* NUOVO: LISTA CODA VIDEO */}
            {files.length > 0 && (
              <div className="bg-surface/40 rounded-xl p-4 border border-white/10 animate-fade-in">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Coda di Invio ({files.length})
                  </h4>
                  <button 
                    type="button"
                    onClick={() => setFiles([])} 
                    className="text-xs text-red-400 hover:text-red-300 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Svuota tutto
                  </button>
                </div>
                
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10">
                  {files.map((f, index) => (
                    <div key={index} className="flex items-center justify-between bg-black/20 p-3 rounded-lg border border-white/5 group hover:border-white/20 transition-all">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 rounded bg-surfaceHighlight flex items-center justify-center shrink-0">
                          <Film className="w-4 h-4 text-neon-pink" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-200 truncate">{f.name}</p>
                          <p className="text-[10px] text-gray-500">{(f.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="p-2 hover:bg-white/10 rounded-full text-gray-500 hover:text-red-400 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. CHECKBOX */}
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

            {/* 5. SUBMIT */}
            <div className="pt-2">
              <Button 
                variant="neon-pink" 
                size="lg" 
                type="submit" 
                disabled={loading || files.length === 0}
                className="w-full shadow-lg shadow-neon-pink/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Caricamento in corso...' : `Invia ${files.length > 0 ? files.length + ' ' : ''}Contributi`}
              </Button>
            </div>

          </form>
        </Card>
      </div>
    </main>
  );
}