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
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        scrolled
          ? 'bg-card/95 backdrop-blur-md border-b border-border shadow-sm'
          : 'bg-transparent',
      )}
    >
      <nav className="max-w-6xl mx-auto px-6 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-extrabold text-xl text-card-foreground"
        >
          <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-sm font-black">
            DG
          </span>
          DualGrid
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="text-sm font-medium text-muted-foreground hover:text-card-foreground transition-colors cursor-pointer"
            >
              {t(link.labelKey)}
            </button>
          ))}
          <LanguageToggle />
          <button
            onClick={() => scrollTo('#planes')}
            className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer"
          >
            {t('nav.cta')}
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg border border-border text-card-foreground"
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
        <div className="md:hidden bg-card border-b border-border px-6 py-4 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="text-sm font-medium text-card-foreground py-2 text-left cursor-pointer"
            >
              {t(link.labelKey)}
            </button>
          ))}
          <div className="pt-1">
            <LanguageToggle />
          </div>
          <button
            onClick={() => scrollTo('#planes')}
            className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold text-center cursor-pointer"
          >
            {t('nav.cta')}
          </button>
        </div>
      )}
    </header>
  );
}
