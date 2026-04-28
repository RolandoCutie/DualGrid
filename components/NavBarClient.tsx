'use client';

import { useLanguage } from '@/components/ui/LanguageProvider';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useEffect, useState } from 'react';

function LanguageToggle() {
  const { locale, setLocale } = useLanguage();
  return (
    <div
      role="tablist"
      aria-label="Language selector"
      className="relative flex h-8 w-[72px] items-center rounded-full bg-muted/80 p-0.5 border border-border"
    >
      <div
        aria-hidden
        className={cn(
          'absolute top-0.5 h-7 w-8 rounded-full bg-primary transition-transform duration-200 ease-out',
          locale === 'en' ? 'translate-x-0' : 'translate-x-[34px]',
        )}
      />
      {(['en', 'es'] as const).map((l) => (
        <button
          key={l}
          role="tab"
          aria-selected={locale === l}
          onClick={() => setLocale(l)}
          className={cn(
            'relative z-10 flex h-7 w-8 items-center justify-center rounded-full text-[11px] font-bold transition-colors',
            locale === l
              ? 'text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

export default function NavBarClient() {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const NAV_LINKS = [
    { href: '#por-que', labelKey: 'nav.why' },
    { href: '#portafolio', labelKey: 'nav.portfolio' },
    { href: '#planes', labelKey: 'nav.plans' },
    { href: '#proceso', labelKey: 'nav.process' },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (href: string) => {
    const id = href.replace('#', '');
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-500',
        scrolled
          ? 'bg-card/80 backdrop-blur-xl border-b border-border/60 shadow-[0_1px_20px_-5px_rgba(0,0,0,0.12)]'
          : 'bg-transparent',
      )}
    >
      <nav className="max-w-6xl mx-auto px-6 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-black shadow-md group-hover:scale-105 transition-transform duration-200">
            DG
          </span>
          <span
            className="font-extrabold text-xl text-card-foreground tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            DualGrid
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="text-sm font-medium text-muted-foreground hover:text-card-foreground underline-grow transition-colors cursor-pointer"
            >
              {t(link.labelKey)}
            </button>
          ))}
          <LanguageToggle />
          <button
            onClick={() => scrollTo('#planes')}
            className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow-[0_0_20px_-4px_var(--primary)] cursor-pointer"
          >
            {t('nav.cta')}
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl border border-border/80 text-card-foreground hover:border-primary/40 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menú"
        >
          {menuOpen ? (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-card/95 backdrop-blur-xl border-b border-border/60 px-6 py-5 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="text-sm font-semibold text-card-foreground py-2 text-left cursor-pointer hover:text-primary transition-colors"
            >
              {t(link.labelKey)}
            </button>
          ))}
          <div className="pt-1">
            <LanguageToggle />
          </div>
          <button
            onClick={() => scrollTo('#planes')}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold text-center cursor-pointer hover:bg-primary/90 transition-colors"
          >
            {t('nav.cta')}
          </button>
        </div>
      )}
    </header>
  );
}
