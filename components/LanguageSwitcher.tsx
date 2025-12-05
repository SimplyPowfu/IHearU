'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing'; // Importa dal file creato al passo 1
import { Globe } from 'lucide-react';
import { useTransition } from 'react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const toggleLanguage = () => {
    const nextLocale = locale === 'it' ? 'en' : 'it';
    
    startTransition(() => {
      // Sostituisce la lingua corrente nell'URL mantenendo la pagina
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <button
      onClick={toggleLanguage}
      disabled={isPending}
      className={`
        flex items-center gap-2 px-3 py-1.5 rounded-full 
        border transition-all duration-300
        text-sm font-medium
        ${locale === 'it' 
          ? 'border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10 hover:shadow-[0_0_10px_rgba(5,217,232,0.3)]' 
          : 'border-neon-pink/30 text-neon-pink hover:bg-neon-pink/10 hover:shadow-[0_0_10px_rgba(255,42,109,0.3)]'
        }
        ${isPending ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <Globe className="w-4 h-4" />
      <span className="uppercase">{locale}</span>
    </button>
  );
}