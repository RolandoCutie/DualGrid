import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  // Disable in development to avoid noise
  enabled: process.env.NODE_ENV === 'production',
  // Capture 10 % of traces to stay within free tier
  tracesSampleRate: 0.1,
  // Session replay — capture 5 % of sessions, 100 % of sessions with errors
  replaysSessionSampleRate: 0.05,
  replaysOnErrorSampleRate: 1.0,
  integrations: [],
});
