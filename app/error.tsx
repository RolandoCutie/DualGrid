'use client';

import { useLanguage } from '@/components/ui/LanguageProvider';
import Link from 'next/link';
import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[CubaWay Error]', error);
  }, [error]);
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-destructive/10 opacity-40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-primary/10 opacity-40 blur-3xl" />
      </div>

      <div className="relative z-10 text-center max-w-lg w-full">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-red-50 border border-red-100 text-red-500 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          {t('error.somethingWentWrong')}
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-800 flex items-center justify-center shadow-inner">
            <svg
              className="w-12 h-12 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              />
            </svg>
          </div>
        </div>

        {/* Brand */}
        <div className="flex items-center justify-center gap-1 mb-3">
          <span className="text-2xl font-extrabold tracking-tight text-foreground">
            Cuba<span className="text-primary">Way</span>
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-3">
          {t('error.unexpectedError')}
        </h2>
        <p className="text-muted-foreground text-base sm:text-lg mb-3 leading-relaxed">
          {t('error.somethingWentWrongLoadThePage')}
        </p>

        {/* Error digest (técnico, discreto) */}
        {error.digest && (
          <p className="text-xs text-muted-foreground font-mono mb-8">
            {t('error.code')}: {error.digest}
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-br from-blue-600 to-blue-400 text-white font-bold py-3 px-7 rounded-full transition-all duration-200 hover:opacity-90 active:scale-95 shadow-md shadow-blue-200 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {t('error.tryAgain')}
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-card border border-border text-foreground font-semibold py-3 px-7 rounded-full transition-all duration-200 hover:bg-surface active:scale-95 shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            {t('error.goHome')}
          </Link>
        </div>
      </div>
    </div>
  );
}
