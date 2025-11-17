import Link from 'next/link';

export default function ProgettoPage() {
  return (
    <main className="min-h-screen bg-gray-900 text-white py-20 px-6">
      
      {/* --- HEADER --- */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-blue-400">
          Oltre la traduzione, verso la comprensione.
        </h1>
        <p className="text-xl text-gray-300">
          IHearU non è solo un traduttore. È un ponte digitale costruito con l'Intelligenza Artificiale per unire due mondi.
        </p>
      </div>

      {/* --- LA TECNOLOGIA --- */}
      <section className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 mb-24">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">La Tecnologia</h2>
          <p className="text-gray-300 leading-relaxed">
            Al cuore del sistema c'è un motore di <strong>Computer Vision</strong> avanzato. 
            Utilizziamo algoritmi proprietari per tracciare i movimenti delle mani e le espressioni facciali con precisione millimetrica.
          </p>
          <ul className="list-disc list-inside text-gray-400 space-y-2">
            <li><span className="text-white font-semibold">Bidirezionale:</span> Traduce da Voce a LIS (Avatar) e da LIS a Voce/Testo.</li>
            <li><span className="text-white font-semibold">Real-time:</span> L'elaborazione avviene in tempo reale per conversazioni fluide.</li>
            <li><span className="text-white font-semibold">Avatar 3D:</span> Un interprete virtuale empatico, non solo sottotitoli freddi.</li>
          </ul>
        </div>
        <div className="bg-gray-800 rounded-xl p-8 flex items-center justify-center border border-gray-700">
          <p className="text-gray-500 italic text-center">
            [Qui inseriremo uno schema del tracking delle mani o uno screenshot del tuo script learn.py in azione]
          </p>
        </div>
      </section>

      {/* --- IL NOSTRO PERCORSO --- */}
      <section className="max-w-4xl mx-auto mb-24 bg-gray-800/50 p-8 rounded-2xl">
        <h2 className="text-3xl font-bold mb-8 text-center">Le Sfide che Abbiamo Superato</h2>
        <div className="space-y-8">
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 font-bold">1</div>
            <div>
              <h3 className="text-xl font-bold mb-2">Il Problema dei Dati</h3>
              <p className="text-gray-400">Le IA imparano dagli esempi, ma non esistevano dataset pubblici sufficienti per la LIS complessa. Abbiamo dovuto inventare un modo per raccoglierli.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 font-bold">2</div>
            <div>
              <h3 className="text-xl font-bold mb-2">L'Architettura di Training</h3>
              <p className="text-gray-400">Abbiamo sviluppato un sistema di training personalizzato capace di trasformare un semplice video in una matrice matematica di coordinate.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 font-bold">3</div>
            <div>
              <h3 className="text-xl font-bold mb-2">La Soluzione Community</h3>
              <p className="text-gray-400">Abbiamo capito che non potevamo farlo da soli. Questa piattaforma nasce per permettere a chiunque di contribuire a questa rivoluzione.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA FINALE (CORRETTA) --- */}
      <div className="text-center py-12 border-t border-gray-800">
        <h2 className="text-2xl font-bold mb-4">Vuoi far parte della soluzione?</h2>
        <p className="text-gray-400 mb-8">Aiutaci a rendere l'algoritmo più intelligente, un segno alla volta.</p>
        
        {/* MODIFICA QUI: Punta a /contribuisci */}
        <Link href="/contribuisci" className="bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-200 transition-all">
          Unisciti e Contribuisci
        </Link>

      </div>

    </main>
  );
}