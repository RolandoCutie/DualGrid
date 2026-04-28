'use client';

import { createContext, useContext, useEffect, useSyncExternalStore } from 'react';

type Theme = 'light' | 'dark';

type ThemeContextValue = {
  theme: Theme;
  setTheme: (t: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

const FIXED_THEME_COLOR = '#6366f1';

function subscribeToTheme(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getThemeSnapshot(): Theme {
  // Invalidate preferences from the previous CubaWay site
  if (localStorage.getItem('theme-v') !== 'dg1') {
    localStorage.setItem('theme', 'light');
    localStorage.setItem('theme-v', 'dg1');
    return 'light';
  }
  const stored = localStorage.getItem('theme');
  if (stored === 'dark' || stored === 'light') return stored;
  localStorage.setItem('theme', 'light');
  return 'light';
}

function getServerThemeSnapshot(): Theme {
  return 'light';
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getServerThemeSnapshot);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    document.querySelectorAll('meta[name="theme-color"]').forEach((tag) => {
      tag.setAttribute('content', FIXED_THEME_COLOR);
    });
  }, [theme]);

  const setTheme = (t: Theme) => {
    localStorage.setItem('theme', t);
    window.dispatchEvent(new StorageEvent('storage', { key: 'theme', newValue: t }));
  };

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}
