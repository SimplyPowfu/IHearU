import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import AuthButton from "@/components/AuthButton";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IHearU - Interprete LIS IA",
  description: "Abbattere le barriere della comunicazione con l'IA.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  const cookieStore = await cookies()
  const supabase = createServerComponentClient({ 
    cookies: () => cookieStore as any 
  })
  
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html lang="it">
      <body className={`${inter.className} bg-gray-900 text-white min-h-screen flex flex-col`}>
        
        <nav className="w-full bg-gray-950/80 backdrop-blur-md border-b border-gray-800 p-4 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            
            <Link href="/" className="text-2xl font-bold text-white tracking-tighter hover:text-blue-400 transition-colors">
              IHearU
            </Link>

            <div className="hidden md:flex gap-8 text-sm font-medium text-gray-300">
              <Link href="/progetto" className="hover:text-white transition-colors">
                Il Progetto
              </Link>
              <Link href="/community" className="hover:text-white transition-colors">
                Community
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link 
                href="/contribuisci" 
                className="hidden md:block text-sm font-semibold text-gray-300 hover:text-white"
              >
                Contribuisci
              </Link>
              <AuthButton session={user} />
            </div>

          </div>
        </nav>

        <div className="flex-grow">
          {children}
        </div>

        <footer className="w-full py-8 text-center text-gray-500 text-sm border-t border-gray-800 mt-auto">
          <p>&copy; {new Date().getFullYear()} IHearU Project. Costruito con la community.</p>
        </footer>

      </body>
    </html>
  );
}