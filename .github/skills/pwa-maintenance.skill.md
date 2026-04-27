# Skill: PWA Maintenance

Use this skill when updating or auditing the Progressive Web App configuration of CubaWay.

---

## PWA Architecture Overview

| Asset           | Location                          | Purpose                          |
| --------------- | --------------------------------- | -------------------------------- |
| Service Worker  | `public/sw.js`                    | Offline support, asset caching   |
| Web Manifest    | `app/manifest.ts`                 | App metadata, icons, theme color |
| Install Banner  | `components/PWAInstallBanner.tsx` | Prompts users to install the app |
| SW Registration | `app/layout.tsx`                  | Script tag that registers the SW |

CubaWay uses a **manually authored service worker** — no Workbox, no build-time generation. This gives precise control over caching strategies.

---

## Service Worker: Cache Versioning

The SW has a top-level version constant:

```javascript
// public/sw.js
const CACHE_VERSION = 'cubaway-v1';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;
```

### When to bump CACHE_VERSION

Bump the version when:

- The app shell (`/`, nav, footer) has changed significantly.
- New core dependencies are cached.
- The caching strategy itself changes.

**How to bump:**

```javascript
const CACHE_VERSION = 'cubaway-v2'; // Increment the number
```

When `CACHE_VERSION` changes, the `activate` event handler automatically purges all previous caches.

---

## Service Worker: Pre-Cache Assets

The `PRECACHE_ASSETS` array defines what gets cached during the `install` event (before any user navigation):

```javascript
// public/sw.js
const PRECACHE_ASSETS = [
  '/',
  '/manifest.webmanifest',
  '/icon.png',
  '/logo.svg',
  '/hero.png',
  // Add new static files here
];
```

### When to update PRECACHE_ASSETS

Add a file when:

- A new static image is added to `public/` and is part of the app shell.
- A new font file is added to `public/fonts/`.

**Do NOT add:**

- Cloudinary URLs (external, managed independently).
- API routes or data endpoints.
- Next.js static chunks (`/_next/static/**`) — these are handled by runtime cache.

---

## Service Worker: Fetch Strategies

The SW implements three caching strategies:

### 1. Navigation (HTML pages) — Network First + Offline Fallback

```javascript
if (request.mode === 'navigate') {
  event.respondWith(
    fetch(request).catch(() => caches.match('/').then((cached) => cached || Response.error())),
  );
  return;
}
```

Users always get fresh HTML. On network failure, they see the cached home page.

### 2. Static Assets — Cache First

```javascript
if (
  url.pathname.startsWith('/_next/static/') ||
  url.pathname.startsWith('/_next/image/') ||
  /\.(png|jpg|jpeg|svg|gif|webp|woff|woff2|ttf|otf|ico)$/.test(url.pathname)
) {
  // cache-first → populate runtime cache on miss
}
```

Fast loads from cache; network is only hit on a cache miss.

### 3. API / Admin / Analytics — Bypass (Always Network)

```javascript
if (
  url.pathname.startsWith('/api/') ||
  url.pathname.startsWith('/admin/') ||
  url.pathname.startsWith('/ingest/')
) {
  return; // SW does nothing — browser fetches normally
}
```

**These routes are already excluded.** Adding new API routes does not require updating the SW.

---

## Web Manifest: Updating Fields

Edit `app/manifest.ts` for:

| Field            | How to update                                                                          |
| ---------------- | -------------------------------------------------------------------------------------- |
| App name         | `name` and `short_name` fields                                                         |
| Description      | `description` field                                                                    |
| Theme color      | `theme_color` (also update in `app/layout.tsx` `<meta name="theme-color">` if present) |
| Background color | `background_color`                                                                     |
| Icons            | `icons` array — provide correct `src`, `sizes`, `type`, `purpose`                      |
| Screenshots      | `screenshots` array — used in app store-style install UI                               |

### Current icon configuration issue

The manifest currently uses JPEG icons (`image/jpeg`). For best PWA installability:

- Use PNG icons (`image/png`) — better alpha channel support.
- Provide separate `maskable` icon with safe zone (content in center 80%).
- Ideal sizes: 192×192 (any), 512×512 (any), 512×512 (maskable).

```typescript
// ✅ Recommended improvement in app/manifest.ts
icons: [
  {
    src: '/icon-192.png',
    sizes: '192x192',
    type: 'image/png',
    purpose: 'any',
  },
  {
    src: '/icon-512.png',
    sizes: '512x512',
    type: 'image/png',
    purpose: 'any',
  },
  {
    src: '/icon-512-maskable.png',
    sizes: '512x512',
    type: 'image/png',
    purpose: 'maskable',
  },
],
```

---

## Install Banner: PWAInstallBanner Component

The `PWAInstallBanner` component:

1. Listens for the `beforeinstallprompt` event on mount.
2. Stores the deferred prompt.
3. Shows a banner with an Install button.
4. Calls `prompt.prompt()` on button click.
5. Hides itself after the user responds.

No changes needed to this component unless:

- You want to change the install banner design.
- You need to add analytics tracking on install.

---

## PWA Audit Checklist

Run through this to verify PWA compliance:

- [ ] Service worker registered in HTML (`layout.tsx` or `instrumentation-client.ts`).
- [ ] `manifest.webmanifest` linked in `<head>` via `metadata.manifest` in `layout.tsx` ✅ (already set)
- [ ] Manifest has `name`, `short_name`, `description`, `start_url: '/'` ✅
- [ ] Manifest has `display: 'standalone'` ✅
- [ ] `theme_color` in manifest matches brand primary color ✅ (#2563eb)
- [ ] Icons: at least 192×192 and 512×512 provided ✅
- [ ] Icons: at least one with `purpose: 'maskable'` ✅
- [ ] Icons use PNG format (JPEG icons lack alpha transparency) ⚠️ (currently JPEG — see improvement note)
- [ ] HTTPS in production (required for SW registration) — verify deployment config
- [ ] Navigation offline fallback works (SW caches `/`) ✅
- [ ] `PRECACHE_ASSETS` updated when new shell assets are added (manual step)
- [ ] `CACHE_VERSION` bumped after breaking app-shell changes (manual step)
- [ ] PWA tested in Chrome DevTools → Application → Service Workers

---

## Testing the Service Worker Locally

1. Run `npm run build && npm run start`.
2. Open Chrome DevTools → Application tab.
3. Check **Service Workers** section: SW should show as "Activated and running".
4. Check **Cache Storage**: `cubaway-v1-static` and `cubaway-v1-runtime` should appear.
5. Enable **Offline** checkbox → navigate to `/` — page should load from cache.
6. Check **Manifest** section: all fields should validate correctly.
