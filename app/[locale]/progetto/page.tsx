import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ArrowLeft, Cpu, Eye, Zap, Network, Database, Fingerprint } from 'lucide-react';

// I18N IMPORTS
import { Link } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';

export default async function ProgettoPage() {
  const t = await getTranslations('Project');

  return (
    <main className="min-h-screen bg-background text-white py-20 px-6 relative overflow-hidden">
      
      {/* SFONDO CIANO/BLU SOFFUSO */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-neon-cyan/10 rounded-full blur-[128px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[128px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* NAVIGAZIONE */}
        <div className="mb-12">
          <Link href="/" className="text-gray-400 hover:text-neon-cyan flex items-center gap-2 text-sm font-bold transition-colors w-fit group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
            {t('back_home')}
          </Link>
        </div>

        {/* HEADER */}
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan text-xs font-bold uppercase tracking-widest mb-6">
            <Cpu className="w-4 h-4" />
            {t('header.badge')}
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 font-display tracking-tight">
            {t('header.title_prefix')} 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-primary">
              {t('header.title_highlight')}
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-sans leading-relaxed">
            {t('header.subtitle')}
          </p>
        </div>

        {/* SEZIONE 1: IL CORE (Card Gigante) */}
        <div className="mb-24">
          <Card className="border-neon-cyan/30 bg-neon-cyan/5 relative overflow-hidden group">
            <div className="absolute top-1/2 right-10 -translate-y-1/2 p-10 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
              <Fingerprint className="w-64 h-64 text-neon-cyan" />
            </div>
            
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4 font-display text-white">{t('core.title')}</h2>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {/* RICH TEXT RENDERING */}
                  {t.rich('core.description', {
                    bold: (chunks) => <strong className="text-neon-cyan">{chunks}</strong>,
                    br: () => <><br/><br/></>
                  })}
                </p>
                <ul className="space-y-3 text-gray-400">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-neon-cyan rounded-full shadow-[0_0_10px_#05D9E8]"></div>
                    {t('core.list.privacy')}
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-neon-cyan rounded-full shadow-[0_0_10px_#05D9E8]"></div>
                    {t('core.list.precision')}
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-neon-cyan rounded-full shadow-[0_0_10px_#05D9E8]"></div>
                    {t('core.list.light')}
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* SEZIONE 2: LE SFIDE (Grid) */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          <Card className="hover:border-neon-cyan/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-surfaceHighlight flex items-center justify-center text-neon-cyan mb-4 border border-white/10">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2 font-display">{t('grid.data_problem.title')}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              {t('grid.data_problem.desc')}
            </p>
          </Card>

          <Card className="hover:border-neon-cyan/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-surfaceHighlight flex items-center justify-center text-neon-cyan mb-4 border border-white/10">
              <Network className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2 font-display">{t('grid.crowdsourcing.title')}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              {t('grid.crowdsourcing.desc')}
            </p>
          </Card>

          <Card className="hover:border-neon-cyan/50 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-surfaceHighlight flex items-center justify-center text-neon-cyan mb-4 border border-white/10">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2 font-display">{t('grid.training.title')}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              {t('grid.training.desc')}
            </p>
          </Card>
        </div>

        {/* CTA FINALE */}
        <div className="text-center py-12 border-t border-white/5">
          <h2 className="text-3xl font-bold mb-6 font-display">{t('cta.title')}</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            {t('cta.desc')}
          </p>
          <Link href="/contribuisci">
            <Button variant="neon-cyan" size="lg" className="shadow-[0_0_20px_rgba(5,217,232,0.3)]">
              {t('cta.button')}
            </Button>
          </Link>
        </div>

      </div>
    </main>
  );
}