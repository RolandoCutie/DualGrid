'use client';

import { useEffect } from 'react';
import { useLanguage } from './LanguageProvider';

const STORAGE_KEY = 'rc_locale';

export default function LanguageToggle() {
  const { locale, setLocale } = useLanguage();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && stored !== locale) setLocale(stored as 'en' | 'es');
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {}
  }, [locale]);

  return (
    <div className="flex items-center">
      <div
        role="tablist"
        aria-label="Language selector"
        className="relative flex h-9 w-20 items-center rounded-full bg-surface/60 p-0.5 shadow-sm"
      >
        <div
          aria-hidden
          className={`absolute top-1 px-[3%] h-8 w-9 transform rounded-full bg-primary transition-transform duration-200 ease-out ${
            locale === 'en' ? 'translate-x-0 items-center justify-center' : 'translate-x-11'
          }`}
        />

        <button
          role="tab"
          aria-selected={locale === 'en'}
          onClick={() => setLocale('en')}
          className={`relative z-10 flex h-8 w-9 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
            locale === 'en' ? 'text-white' : 'text-foreground/60'
          }`}
        >
          EN
        </button>

        <button
          role="tab"
          aria-selected={locale === 'es'}
          onClick={() => setLocale('es')}
          className={`relative z-10 ml-1 flex h-8 w-9 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
            locale === 'es' ? 'text-white' : 'text-foreground/60'
          }`}
        >
          ES
        </button>
      </div>
    </div>
  );
}
