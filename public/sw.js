// CubaWay Service Worker
// Provides offline support and caching for PWA functionality.
// Registered in production only via instrumentation-client.ts.
//
// VERSIONING: Bump CACHE_VERSION after every production deploy so that
// pre-cached static assets (logo, icons, offline page) are refreshed.
// Next.js JS/CSS chunks in /_next/static/ are auto-invalidated via
// content-hash URLs — no version bump needed for those.

const CACHE_VERSION = 'cubaway-v14';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

// Assets to pre-cache on install (app shell)
// Do NOT precache '/' — it's a dynamic Next.js page whose HTML changes on every
// deploy.  Caching it here would lock users into an outdated app shell until
// CACHE_VERSION is bumped AND the SW activates.  The navigation fetch handler
// already uses network-first, so the homepage loads fresh every time.
const PRECACHE_ASSETS = [
  './sinconexion.svg',
  './sinconexioncarro.svg',
  '/offline.html',
  '/cubawayicon-192.png',
  '/cubawayicon-512.png',
  '/cubawayicon-maskable-192.png',
  '/cubawayicon-maskable-512.png',
  '/apple-touch-icon.png',
  '/logo.svg',
  '/cubawayicon.jpg',
];

// ── Message ───────────────────────────────────────────────────────────────────
// Allows clients to explicitly trigger SW promotion (e.g. when a waiting SW
// is detected and the user is informed or the page is auto-refreshed).
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// ── Install ──────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting()),
  );
});

// ── Activate ─────────────────────────────────────────────────────────────────
// NUCLEAR CLEANUP: delete ALL caches that are not the current version.
// This guarantees that stale Workbox caches, old cubaway-* caches, and any
// other leftover storage from the removed @ducanh2912/next-pwa plugin are
// entirely purged — regardless of their naming convention.
self.addEventListener('activate', (event) => {
  const KEEP = new Set([STATIC_CACHE, RUNTIME_CACHE]);
  event.waitUntil(
    Promise.all([
      // Enable navigation preload for faster navigations
      self.registration.navigationPreload && self.registration.navigationPreload.enable(),
      // Delete stale caches
      caches
        .keys()
        .then((keys) => Promise.all(keys.filter((k) => !KEEP.has(k)).map((k) => caches.delete(k)))),
    ])
      .then(() => self.clients.claim())
      .then(() =>
        // Notify every open tab/window to reload so users see the latest deploy
        self.clients.matchAll({ type: 'window' }).then((clients) => {
          clients.forEach((client) => client.postMessage({ type: 'SW_UPDATED' }));
        }),
      ),
  );
});

// ── Fetch ─────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin and GET requests
  if (request.method !== 'GET') return;
  if (url.origin !== self.location.origin) return;

  // Skip: API routes, admin area, analytics ingest — always network
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/admin/') ||
    url.pathname.startsWith('/ingest/')
  ) {
    return;
  }

  // Navigation requests (HTML pages) — network first with preload, offline fallback to '/offline.html'
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          // Use navigation preload response if available, else fetch normally
          const preloadResponse = event.preloadResponse ? await event.preloadResponse : undefined;
          return preloadResponse || (await fetch(request));
        } catch {
          const cached = await caches.match('/offline.html');
          return cached || Response.error();
        }
      })(),
    );
    return;
  }

  // Static assets (_next/static, fonts, images, icons) — cache first
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/_next/image/') ||
    /\.(png|jpg|jpeg|svg|gif|webp|woff|woff2|ttf|otf|ico)$/.test(url.pathname)
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        });
      }),
    );
    return;
  }

  // Everything else — network-first, fall back to cache (user always sees fresh content)
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => caches.match(request).then((cached) => cached || Response.error())),
  );
});
