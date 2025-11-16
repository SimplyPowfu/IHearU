/* Questo è il tuo file: app/page.tsx */

import Link from 'next/link';

// -----------------------------------------------------------------
// Componente "Contatore" (lo creeremo dopo, per ora è finto)
// -----------------------------------------------------------------
async function SignCounter() {
  // In futuro, qui leggeremo i dati da Supabase
  // per contare i segni approvati.
  const signCount = 85; // Numero finto per ora

  return (
    <div className="text-4xl font-bold text-blue-400">
      {signCount}
    </div>
  );
}

// -----------------------------------------------------------------
// La tua HOMEPAGE
// -----------------------------------------------------------------
export default function HomePage() {
  return (
    <main className="flex flex-col items-center">
      
      {/* --- 1. HERO SECTION (Il Valore) --- */}
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

      {/* --- 2. DEMO SECTION (Il Prodotto in Azione) --- */}
      <section className="w-full max-w-5xl py-24 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">
          Come Funziona
        </h2>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* GIF 1: Da Voce a LIS */}
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-center font-semibold mb-2">Da Voce a LIS</p>
            {/* Qui metterai la tua GIF */}
            <div className="aspect-video bg-gray-700 rounded text-center leading-[250px]">
              [GIF: Avatar che segna]
            </div>
          </div>
          {/* GIF 2: Da LIS a Testo */}
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-center font-semibold mb-2">Da LIS a Voce/Testo</p>
            {/* Qui metterai la tua GIF */}
            <div className="aspect-video bg-gray-700 rounded text-center leading-[250px]">
              [GIF: LIS a testo]
            </div>
          </div>
        </div>
      </section>

      {/* --- 3. GOAL SECTION (Il tuo "Counter") --- */}
      <section className="text-center w-full py-24 px-6 bg-gray-900">
        <h2 className="text-3xl font-bold mb-4">
          Aiutaci a insegnare all'IA
        </h2>
        <p className="text-lg text-gray-300 mb-6">
          Ogni segno che raccogliamo migliora l'interprete.
        </p>
        <SignCounter /> {/* Ecco il contatore! */}
        <p className="text-lg text-gray-400 mt-2">Segni già raccolti</p>
      </section>

    </main>
  );
}