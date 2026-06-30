import * as Sentry from '@sentry/nextjs';

// ─── Sentry client init (#41) ────────────────────────────────────────────────
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: process.env.NODE_ENV === 'production',
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.05,
  replaysOnErrorSampleRate: 1.0,
  integrations: [],
});

// ─── PWA Service Worker Registration ─────────────────────────────────────────
if (
  typeof window !== 'undefined' &&
  'serviceWorker' in navigator &&
  process.env.NODE_ENV === 'production'
) {
  window.addEventListener('load', () => {
    let swRefreshed = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!swRefreshed) {
        swRefreshed = true;
        window.location.reload();
      }
    });

    navigator.serviceWorker
      .register('/sw.js', { scope: '/', updateViaCache: 'none' })
      .then((reg) => {
        if (reg.waiting) {
          reg.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (!newWorker) return;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              newWorker.postMessage({ type: 'SKIP_WAITING' });
            }
          });
        });
      })
      .catch(() => {});
  });
}
