/**
 * Next.js instrumentation hook — runs once when the server starts.
 * Used to initialise Sentry for both Node.js (API routes, Server Components)
 * and Edge runtimes.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    // Edge runtime uses the same server config
    await import('./sentry.server.config');
  }
}
