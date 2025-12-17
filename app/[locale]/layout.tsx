import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "../globals.css";
// RIMOSSO: import { createClient } ... (Non chiamiamo Supabase qui per velocità)
import { cn } from "@/lib/utils";
import AuthButton from "@/components/AuthButton";
import LanguageSwitcher from "@/components/LanguageSwitcher";

// i18n imports
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';

// Font Configuration: 'swap' assicura che il testo si veda subito
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: 'swap' });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: 'swap' });

export const metadata: Metadata = {
  title: "IHearU - The AI Sign Language Interpreter",
  description: "La prima piattaforma open-source per tradurre la Lingua dei Segni Italiana (LIS).",
  // ... resto dei metadata invariato
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({
  children,
  params
}: Props) {
  const { locale } = await params;
  
  if (!['it', 'en'].includes(locale)) {
    notFound();
  }

  // Queste chiamate sono veloci perché next-intl le ottimizza internamente
  const t = await getTranslations('Navbar');
  const messages = await getMessages();

  // NOTA PERFORMANCE: Abbiamo rimosso la chiamata await supabase.getUser().
  // Il sito ora risponde in millisecondi (TTFB istantaneo).
  // L'AuthButton gestirà il controllo utente lato client.

  return (
    <html lang={locale} className="dark">
      <body suppressHydrationWarning={true}
        className={cn(
        "bg-background text-white min-h-screen flex flex-col antialiased selection:bg-neon-pink selection:text-white relative",
        outfit.variable,
        inter.variable
      )}>
        <NextIntlClientProvider messages={messages}>
        
          {/* --- SFONDO STATICO (ZERO CPU USAGE) --- */}
          {/* Invece di calcolare animazioni ogni frame, usiamo un gradiente fisso che simula l'effetto */}
          <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#0a0a0a]">
             <div className="absolute top-0 left-0 w-full h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neon-pink/10 via-background to-background opacity-40" />
             <div className="absolute bottom-0 right-0 w-full h-[500px] bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-neon-cyan/10 via-background to-background opacity-40" />
          </div>

          {/* NAVBAR */}
          <nav className="w-full fixed top-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
              
              {/* SINISTRA */}
              <div className="flex items-center gap-6">
                <Link href="/" className="flex items-center gap-2 group">
                  <div className="w-8 h-8 rounded bg-gradient-to-br from-neon-pink to-neon-cyan flex items-center justify-center text-background font-bold font-display text-lg shadow-[0_0_15px_rgba(255,42,109,0.3)]">
                    I
                  </div>
                  <span className="text-xl font-bold font-display tracking-wide group-hover:text-neon-cyan transition-colors">
                    IHearU
                  </span>
                </Link>

                <div className="hidden sm:block">
                  <LanguageSwitcher />
                </div>
              </div>

              {/* CENTRO */}
              <div className="hidden md:flex gap-8 text-sm font-medium text-gray-300 font-sans absolute left-1/2 transform -translate-x-1/2">
                <Link href="/progetto" className="hover:text-neon-cyan transition-colors">
                  {t('mission')}
                </Link>
                <Link href="/community" className="hover:text-neon-yellow transition-colors">
                  {t('community')}
                </Link>
              </div>

              {/* DESTRA */}
              <div className="flex items-center gap-4">
                <Link 
                  href="/contribuisci" 
                  className="hidden md:block text-sm font-bold font-display text-neon-pink border border-neon-pink/30 px-4 py-2 rounded-full hover:bg-neon-pink/10 hover:border-neon-pink transition-all"
                >
                  {t('contribute')}
                </Link>
                
                {/* Non passiamo più la sessione, il componente si arrangia (Lazy Loading) */}
                <AuthButton /> 
              </div>

            </div>
          </nav>

          {/* CONTENUTO */}
          <div className="flex-grow pt-20 relative z-10">
            {children}
          </div>

          {/* FOOTER */}
          <footer className="w-full py-10 text-center text-gray-500 text-sm border-t border-white/5 bg-background/90 relative z-10">
            <p>&copy; {new Date().getFullYear()} IHearU. Costruito con l'IA, per il mondo.</p>
          </footer>

        </NextIntlClientProvider>
      </body>
    </html>
  );
}