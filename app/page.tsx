import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

// Forza aggiornamento dati a ogni visita
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const supabase = await createClient();

  // --- NUOVA LOGICA DI CONTEGGIO (XP TOTALE) ---
  // Invece di contare le righe nella tabella video (che possono essere cancellate),
  // sommiamo i contatori 'total_uploads' di tutti i profili utente.
  const { data: sumData } = await supabase
    .from('profiles')
    .select('total_uploads');

  // Calcola la somma totale (riduce l'array di oggetti a un numero unico)
  const totalVideosSent = sumData?.reduce((acc, curr) => acc + (curr.total_uploads || 0), 0) || 0;

  return (
    <main className="flex flex-col items-center">
      
      {/* HERO SECTION */}
      <section className="text-center w-full py-32 px-6 bg-gray-900">
        <h1 className="text-5xl font-bold mb-4">
          Un Interprete LIS IA, sempre in tasca.
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Abbattere le barriere della comunicazione per un'autonomia completa.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/contribuisci" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-500">
            Contribuisci Ora
          </Link>
          <Link href="/progetto" className="bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600">
            Scopri il Progetto
          </Link>
        </div>
      </section>

      {/* DEMO SECTION */}
      <section className="w-full max-w-5xl py-24 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">
          Come Funziona
        </h2>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-center font-semibold mb-2">Da Voce a LIS</p>
            <div className="aspect-video bg-gray-700 rounded text-center leading-[250px] text-gray-500">
              [GIF: Avatar che segna]
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-center font-semibold mb-2">Da LIS a Voce/Testo</p>
            <div className="aspect-video bg-gray-700 rounded text-center leading-[250px] text-gray-500">
              [GIF: LIS a testo]
            </div>
          </div>
        </div>
      </section>

      {/* GOAL SECTION (CON COUNTER IMMORTALE) */}
      <section className="text-center w-full py-24 px-6 bg-gray-900 border-t border-gray-800">
        <h2 className="text-3xl font-bold mb-4">
          Aiutaci a insegnare all'IA
        </h2>
        <p className="text-lg text-gray-300 mb-8">
          Ogni segno che raccogliamo migliora l'interprete per tutti.
        </p>
        
        {/* IL CONTATORE CLICCABILE */}
        <Link href="/community" className="group inline-block">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 transition-all transform group-hover:scale-105 group-hover:border-blue-500 group-hover:shadow-[0_0_20px_rgba(37,99,235,0.3)]">
            <div className="text-6xl font-bold text-blue-500 mb-2">
              {totalVideosSent} {/* Usa la variabile calcolata dai profili */}
            </div>
            <div className="text-gray-400 uppercase tracking-wider text-sm font-semibold group-hover:text-white">
              Segni Ricevuti
            </div>
            <div className="mt-4 text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
              Guarda la Hall of Fame →
            </div>
          </div>
        </Link>

      </section>

    </main>
  );
}