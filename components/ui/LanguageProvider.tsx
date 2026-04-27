'use client';

import enRaw from '@/app/i18n/en.json';
import esRaw from '@/app/i18n/es.json';
import { createContext, useContext, useEffect, useSyncExternalStore } from 'react';

export type Locale = 'en' | 'es';

// Typed JSON dicts
export const DICTS = { en: enRaw, es: esRaw } as const;

// Resolves a dot-notation key against a nested JSON object
function resolve(obj: Record<string, unknown>, key: string): unknown {
  return key.split('.').reduce<unknown>((cur, part) => {
    if (cur !== null && typeof cur === 'object') {
      return (cur as Record<string, unknown>)[part];
    }
    return undefined;
  }, obj);
}

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
  /** Resolves a dot-notation key to a translated string */
  t: (key: string) => string;
  /** Resolves a dot-notation key to a string array */
  tArray: (key: string) => string[];
};

const defaultT = (key: string): string => {
  const val = resolve(enRaw as Record<string, unknown>, key);
  if (typeof val === 'string') return val;
  if (Array.isArray(val) && typeof val[0] === 'string') return val[0] as string;
  return key;
};

const LanguageContext = createContext<LanguageContextValue>({
  locale: 'en',
  setLocale: () => {},
  t: defaultT,
  tArray: (key: string) => {
    const val = resolve(enRaw as Record<string, unknown>, key);
    if (Array.isArray(val)) return val as string[];
    return typeof val === 'string' ? [val] : [key];
  },
});

export function useLanguage() {
  return useContext(LanguageContext);
}

export default function LanguageProvider({ children }: { children: React.ReactNode }) {
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
    window.dispatchEvent(new StorageEvent('storage', { key: 'locale', newValue: l }));
  };

  const dict = DICTS[locale] as Record<string, unknown>;

  const t = (key: string): string => {
    const val = resolve(dict, key);
    if (typeof val === 'string') return val;
    if (Array.isArray(val) && typeof val[0] === 'string') return val[0] as string;
    return key;
  };

  const tArray = (key: string): string[] => {
    const val = resolve(dict, key);
    if (Array.isArray(val)) return val as string[];
    return typeof val === 'string' ? [val] : [key];
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, tArray }}>
      {children}
    </LanguageContext.Provider>
  );
}
