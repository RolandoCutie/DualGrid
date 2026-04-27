'use client';

import { Moon, Sun } from 'lucide-react';
import { useLanguage } from './LanguageProvider';
import { useTheme } from './ThemeProvider';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();

  const isLight = theme === 'light';

  return (
    <button
      type="button"
      onClick={() => setTheme(isLight ? 'dark' : 'light')}
      title={isLight ? t('theme.dark') : t('theme.light')}
      aria-label={isLight ? t('theme.dark') : t('theme.light')}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-foreground/70 transition-all duration-200 hover:bg-surface-modal hover:text-foreground"
    >
      {isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </button>
  );
}
