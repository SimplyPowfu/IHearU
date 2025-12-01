'use client';

import { useReactMediaRecorder } from 'react-media-recorder';
import { useEffect, useState, useRef } from 'react';

interface WebcamRecorderProps {
  onRecordingComplete: (file: File) => void;
}

export default function WebcamRecorder({ onRecordingComplete }: WebcamRecorderProps) {
  // Stream manuale per vedersi sempre (Specchio)
  const [liveStream, setLiveStream] = useState<MediaStream | null>(null);
  
  // Stati logici
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isReviewing, setIsReviewing] = useState(false); // True = Ho premuto stop (aspetto il video)

  const { status, startRecording, stopRecording, mediaBlobUrl, clearBlobUrl } =
    useReactMediaRecorder({ 
      video: true, 
      audio: false,
      customMediaStream: liveStream || undefined
    });

  const liveVideoRef = useRef<HTMLVideoElement>(null);

  // 1. ACCENSIONE FOTOCAMERA
  useEffect(() => {
    async function enableStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        setLiveStream(stream);
      } catch (err) {
        console.error("Errore accesso fotocamera:", err);
      }
    }
    enableStream();

    return () => {
      if (liveStream) liveStream.getTracks().forEach(track => track.stop());
    };
  }, []);

  // 2. COLLEGAMENTO SPECCHIO (Solo se NON stiamo rivedendo)
  useEffect(() => {
    if (liveVideoRef.current && liveStream && !isReviewing) {
      liveVideoRef.current.srcObject = liveStream;
    }
  }, [liveStream, isReviewing]);

  // 3. CONVERSIONE FILE
  useEffect(() => {
    if (mediaBlobUrl && isReviewing) {
      const saveFile = async () => {
        const response = await fetch(mediaBlobUrl);
        const blob = await response.blob();
        const file = new File([blob], `webcam-recording-${Date.now()}.mp4`, { type: 'video/mp4' });
        onRecordingComplete(file);
      };
      saveFile();
    }
  }, [mediaBlobUrl, isReviewing]);

  // LOGICA TIMER E AVVIO
  const startSequence = () => {
    clearBlobUrl();
    setIsReviewing(false);
    setCountdown(5);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          startRecording();
          return null;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);
  };

  // Tasto STOP: Forza immediatamente la modalità revisione
  const handleStop = () => {
    stopRecording();
    setIsReviewing(true); // <--- Questo impedisce di tornare allo specchio
  };

  const handleRetry = () => {
    clearBlobUrl();
    setIsReviewing(false); // Torna allo specchio solo ora
  };

  return (
    <div className="space-y-4">
      
      {/* SCHERMO VIDEO */}
      <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-gray-700 shadow-2xl flex items-center justify-center">
        
        {/* --- LOGICA VISUALIZZAZIONE BLINDATA --- */}
        
        {isReviewing ? (
          // 1. MODALITÀ REVISIONE
          mediaBlobUrl ? (
            // A. Video Pronto -> Lo mostriamo
            <video 
              src={mediaBlobUrl} 
              controls 
              autoPlay 
              className="w-full h-full object-cover" // Niente specchio qui!
            />
          ) : (
            // B. Video in elaborazione -> Spinner (NON mostrare lo specchio)
            <div className="flex flex-col items-center text-gray-400 gap-2">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
              <p>Elaborazione video...</p>
            </div>
          )
        ) : (
          // 2. MODALITÀ LIVE (Specchio)
          // Visibile in: Idle, Countdown, Recording
          liveStream ? (
            <video 
              ref={liveVideoRef} 
              autoPlay 
              muted 
              className="w-full h-full object-cover scale-x-[-1]" // Specchiato
            />
          ) : (
            <div className="text-gray-500 text-sm">Caricamento camera...</div>
          )
        )}

        {/* OVERLAYS */}
        
        {countdown !== null && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] z-20">
            <span className="text-9xl font-bold text-white drop-shadow-lg animate-pulse">
              {countdown}
            </span>
          </div>
        )}

        {status === 'recording' && (
          <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600/90 px-3 py-1 rounded-full z-10 animate-pulse shadow-lg">
            <div className="w-3 h-3 bg-white rounded-full"></div>
            <span className="text-xs font-bold text-white tracking-wider">REC</span>
          </div>
        )}

      </div>

      {/* CONTROLLI */}
      <div className="flex justify-center gap-4">
        
        {/* AVVIA */}
        {!isReviewing && status === 'idle' && countdown === null && (
          <button
            type="button"
            onClick={startSequence}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-full font-bold transition-all transform hover:scale-105 shadow-lg"
          >
            <div className="w-3 h-3 bg-white rounded-full"></div>
            Avvia (5s)
          </button>
        )}

        {/* STOP */}
        {(status === 'recording' || countdown !== null) && (
          <button
            type="button"
            onClick={status === 'recording' ? handleStop : () => window.location.reload()}
            className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold transition-all border ${
              status === 'recording'
                ? 'bg-gray-800 hover:bg-gray-700 text-white border-gray-600'
                : 'bg-gray-800/50 text-gray-400 border-transparent cursor-wait'
            }`}
            disabled={countdown !== null}
          >
            <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
            {countdown !== null ? 'Preparati...' : 'Stop'}
          </button>
        )}

        {/* RIPROVA */}
        {isReviewing && mediaBlobUrl && (
          <button
            type="button"
            onClick={handleRetry}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-full font-bold transition-all"
          >
            🔄 Registra
          </button>
        )}

      </div>
    </div>
  );
}