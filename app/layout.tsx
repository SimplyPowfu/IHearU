import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import AuthButton from "@/components/AuthButton";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

// Font Configuration
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "IHearU - The AI Sign Language Interpreter",
  description: "La prima piattaforma open-source per tradurre la Lingua dei Segni Italiana (LIS) in voce tramite Intelligenza Artificiale.",
  keywords: ["AI", "LIS", "Accessibilità", "Startup", "Computer Vision", "Machine Learning"],
  authors: [{ name: "Tuo Nome" }], // Metti il tuo nome!
  openGraph: {
    title: "IHearU - Dare voce al silenzio",
    description: "Contribuisci ad addestrare l'IA che abbatterà le barriere della comunicazione.",
    url: "https://ihearu.vercel.app",
    siteName: "IHearU Project",
    locale: "it_IT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IHearU - AI Sign Language",
    description: "Contribuisci al futuro dell'accessibilità.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="it" className="dark">
      <body className={cn(
        "bg-background text-white min-h-screen flex flex-col antialiased selection:bg-neon-pink selection:text-white relative",
        outfit.variable,
        inter.variable
      )}>
        
        {/* --- SFONDO LIQUIDO (Manteniamo l'estetica bella) --- */}
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-background" />
          <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(5,217,232,0.15)_0%,transparent_60%)] blur-[150px] animate-[spin_60s_linear_infinite] opacity-70" style={{ transformOrigin: '60% 40%' }} />
          <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(255,42,109,0.15)_0%,transparent_60%)] blur-[150px] animate-[spin_50s_linear_infinite_reverse] opacity-70" style={{ transformOrigin: '40% 60%' }} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,42,109,0.05),rgba(5,217,232,0.05),transparent)] blur-[100px] animate-pulse-slow" />
        </div>

        {/* NAVBAR */}
        <nav className="w-full fixed top-0 z-50 border-b border-white/5 bg-background/70 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
            
            {/* LOGO */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-neon-pink to-neon-cyan flex items-center justify-center text-background font-bold font-display text-lg shadow-[0_0_15px_rgba(255,42,109,0.5)]">
                I
              </div>
              <span className="text-xl font-bold font-display tracking-wide group-hover:text-neon-cyan transition-colors">
                IHearU
              </span>
            </Link>

            {/* MENU DESKTOP (Colori Custom Richiesti) */}
            <div className="hidden md:flex gap-8 text-sm font-medium text-gray-300 font-sans">
              <Link href="/progetto" className="hover:text-neon-cyan hover:drop-shadow-[0_0_5px_rgba(5,217,232,0.8)] transition-all">
                Mission
              </Link>
              {/* Community Gialla come richiesto */}
              <Link href="/community" className="hover:text-neon-yellow hover:drop-shadow-[0_0_5px_rgba(255,195,0,0.8)] transition-all">
                Community
              </Link>
            </div>

            {/* AZIONI */}
            <div className="flex items-center gap-4">
              {/* Contribuisci Rosa come richiesto */}
              <Link 
                href="/contribuisci" 
                className="hidden md:block text-sm font-bold font-display text-neon-pink border border-neon-pink/30 px-4 py-2 rounded-full hover:bg-neon-pink/10 hover:border-neon-pink transition-all shadow-[0_0_10px_rgba(255,42,109,0.1)] hover:shadow-[0_0_20px_rgba(255,42,109,0.3)]"
              >
                Contribuisci
              </Link>
              
              {/* Il bottone Auth ora gestisce Azzurro/Rosso internamente */}
              <AuthButton session={user} />
            </div>

          </div>
        </nav>

        {/* CONTENUTO PAGINE */}
        <div className="flex-grow pt-20 relative z-10">
          {children}
        </div>

        {/* FOOTER */}
        <footer className="w-full py-10 text-center text-gray-500 text-sm border-t border-white/5 bg-background/80 backdrop-blur-sm relative z-10">
          <p>&copy; {new Date().getFullYear()} IHearU. Costruito con l'IA, per l'IA.</p>
        </footer>

      </body>
    </html>
  );
}