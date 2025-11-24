'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

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
  
  // Stati del form
  const [words, setWords] = useState<Word[]>([]);
  const [selectedWordId, setSelectedWordId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false); // Checkbox

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

  const handleSubmit = async () => {
    if (!selectedWordId) return alert('Seleziona una parola!');
    if (activeTab === 'upload' && !file) return alert('Seleziona un file video!');
    if (!acceptedTerms) return alert('Devi accettare l\'uso dei dati per continuare.');
    
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utente non loggato');

      const fileToUpload = file!;
      const fileExt = fileToUpload.name.split('.').pop();
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

      alert('Video caricato con successo!');
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

  if (isCheckingAuth) {
    return (
      <main className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Controllo permessi in corso...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white py-20 px-6">
      <div className="max-w-2xl mx-auto">
        
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-blue-400">
            Insegna un nuovo segno
          </h1>
          <p className="text-gray-300">
            Contribuisci al database open source per la LIS.
          </p>
        </div>

        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-xl">
          <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            
            {/* SELEZIONE PAROLA */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                Quale parola vuoi registrare?
              </label>
              <select 
                value={selectedWordId}
                onChange={(e) => setSelectedWordId(e.target.value)}
                className="w-full bg-gray-900 border border-gray-600 rounded-lg p-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">-- Seleziona una parola --</option>
                {words.map((word) => (
                  <option key={word.id} value={word.id}>
                    {word.text}
                  </option>
                ))}
              </select>
            </div>

            {/* TABS */}
            <div className="flex p-1 bg-gray-900 rounded-lg mb-6">
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-bold transition-all ${
                  activeTab === 'upload' ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                📁 Carica File
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('webcam')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-bold transition-all ${
                  activeTab === 'webcam' ? 'bg-blue-900/50 text-blue-200 shadow border border-blue-800' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                🔴 Registra Ora
              </button>
            </div>

            {/* UPLOAD */}
            {activeTab === 'upload' && (
              <div className="animate-fade-in">
                <label className="block text-sm font-bold text-gray-300 mb-2">
                  Carica il tuo video
                </label>
                <div className="relative border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:bg-gray-750 transition-colors">
                  <input 
                    type="file" 
                    accept="video/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="text-5xl mb-4">📂</div>
                  <p className="text-sm text-gray-400 font-medium">
                    {file ? `File selezionato: ${file.name}` : 'Clicca o trascina il file qui'}
                  </p>
                  <p className="text-xs text-gray-600 mt-2">MP4, MOV, WEBM (Max 50MB)</p>
                </div>
              </div>
            )}

            {/* WEBCAM MOCKUP */}
            {activeTab === 'webcam' && (
              <div className="animate-fade-in text-center p-8 bg-gray-900 rounded border border-gray-700">
                <p className="text-yellow-500 font-bold">🚧 Work in Progress</p>
                <p className="text-gray-400 text-sm mt-2">Stiamo abilitando la registrazione diretta.</p>
              </div>
            )}

            {/* CHECKBOX LEGALE SPECIFICA */}
            <div className="mt-6 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
              <label className="flex items-start gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 w-5 h-5 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
                />
                <span className="text-xs text-gray-300 leading-relaxed">
                  <strong>Autorizzo l'uso dei dati per il Training IA.</strong>
                  <br/>
                  Sono consapevole che il video inviato verrà analizzato da algoritmi di Computer Vision (es. MediaPipe) al solo scopo di <strong>estrarre i punti di snodo (landmark) delle mani</strong> e trasformarli in dati numerici anonimi.
                  <br/>
                  Acconsento alla pubblicazione del mio Username nella classifica pubblica.
                </span>
              </label>
            </div>

            {/* SUBMIT */}
            <div className="pt-4 border-t border-gray-700">
              <button 
                type="submit"
                disabled={loading}
                className={`w-full font-bold py-4 rounded-lg transition-all shadow-lg ${
                  loading 
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-500 hover:scale-[1.01] shadow-blue-900/20'
                }`}
              >
                {loading ? 'Caricamento in corso...' : 'Invia Contributo'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </main>
  );
}