'use client';

import en from '@/app/i18n/en.json';
import es from '@/app/i18n/es.json';
import { createContext, useContext, useEffect, useSyncExternalStore } from 'react';

type Locale = 'en' | 'es';

type Translations = Record<string, string | string[]>;

const dictionaries: Record<Locale, Translations> = { en, es };


function subscribeToLocale(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getLocaleSnapshot(): Locale {
  const stored = localStorage.getItem('locale');
  return stored === 'es' ? 'es' : 'en';
}

function getServerLocaleSnapshot(): Locale {
  return 'en';
}


type LanguageContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
  tArray: (key: string) => string[];
};

const LanguageContext = createContext<LanguageContextValue>({
  locale: 'en',
  setLocale: () => {},
  t: (key: string) => {
    const val = (en as Record<string, string | string[]>)[key];
    if (Array.isArray(val)) return val[0];
    return val ?? key;
  },
  tArray: (key: string) => {
    const val = (en as Record<string, string | string[]>)[key];
    if (Array.isArray(val)) return val;
    return val ? [val as string] : [key];
  },
});

export function useLanguage() {
  return useContext(LanguageContext);
}

export default function LanguageProvider({ children }: { children: React.ReactNode }) {
  // useSyncExternalStore uses getServerLocaleSnapshot during SSR/hydration ('en'),
  // then switches to getLocaleSnapshot on the client — no setState, no cascading renders.
  const locale = useSyncExternalStore(
    subscribeToLocale,
    getLocaleSnapshot,
    getServerLocaleSnapshot,
  );

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = (l: Locale) => {
    localStorage.setItem('locale', l);
    document.documentElement.lang = l;
    // Notify useSyncExternalStore to re-read the snapshot
    window.dispatchEvent(new StorageEvent('storage', { key: 'locale', newValue: l }));
  };

  const dict = dictionaries[locale];

  const t = (key: string): string => {
    const val = dict[key];
    if (Array.isArray(val)) return val[0];
    return val ?? key;
  };

  const tArray = (key: string): string[] => {
    const val = dict[key];
    if (Array.isArray(val)) return val;
    return val ? [val] : [key];
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, tArray }}>
      {children}
    </LanguageContext.Provider>
  );
}
