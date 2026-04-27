# CubaWay – PWA Documentation

## Overview

CubaWay is configured as a Progressive Web App (PWA) that enables:

- **Installability**: Users can add CubaWay to their home screen on Android, iOS, and desktop.
- **Offline support**: Core app shell loads even without a network connection.
- **Native-like experience**: Standalone display mode, splash screen, notification permissions, and status-bar theming.

---

## PWA Components

| Component        | File                                       | Status    |
| ---------------- | ------------------------------------------ | --------- |
| Service Worker   | `public/sw.js` _(manually authored)_       | ✅ Active |
| SW Registration  | `instrumentation-client.ts`                | ✅ Active |
| Web App Manifest | `app/manifest.ts`                          | ✅ Active |
| Viewport config  | `app/layout.tsx` (`export const viewport`) | ✅ Active |
| Install Banner   | `components/PWAInstallBanner.tsx`          | ✅ Active |
| Manifest Link    | `app/layout.tsx` (via `metadata.manifest`) | ✅ Active |

---

## Service Worker

### Architecture

`public/sw.js` is a **manually authored** service worker — no Workbox or plugin. It is committed to git and served directly. Registered in production only via `instrumentation-client.ts`.

### Update Propagation (controllerchange + skipWaiting)

The SW calls `self.skipWaiting()` in the install event and responds to `{ type: 'SKIP_WAITING' }` messages. `self.clients.claim()` is called after activation.

In `instrumentation-client.ts`, a `controllerchange` listener on `navigator.serviceWorker` triggers `window.location.reload()` (once, guarded by a `swRefreshed` flag) when a new SW takes control. This is more reliable than checking `statechange === 'installed'` because the new SW may transition directly to `activating` without a detectable pause in `installed` state.

### HTTP Cache Headers

`sw.js` is served with `Cache-Control: no-cache, no-store, must-revalidate` (configured in `next.config.ts` via `headers()`). This ensures the browser always fetches the latest SW file on every page load, never serving a cached copy.

### Cache Architecture

Two named caches:

- `cubaway-v12-static` — precached app shell assets installed on SW activation
- `cubaway-v12-runtime` — runtime-cached responses

### Nuclear Cache Cleanup

The activate handler deletes ALL caches that are not the current version — not just known prefixes. This guarantees complete cleanup of stale Workbox caches, old cubaway-\* versions, and any other leftover storage.

### Navigation Preload

The SW enables the Navigation Preload API during activation. This allows the browser to start fetching the navigation request in parallel with SW boot, reducing time-to-first-byte for page navigations. The fetch handler checks for `event.preloadResponse` before falling back to `fetch(request)`.

### Security Headers

`next.config.ts` defines security headers for all routes:

- `X-Content-Type-Options: nosniff` — prevents MIME type sniffing
- `X-Frame-Options: DENY` — protects against clickjacking
- `Referrer-Policy: strict-origin-when-cross-origin` — limits referrer info

The SW file also has `Content-Security-Policy: default-src 'self'; script-src 'self'`.

### Fetch Strategies

| Type                                                    | Strategy                | Details                                                    |
| ------------------------------------------------------- | ----------------------- | ---------------------------------------------------------- |
| HTML navigation (`navigate` mode)                       | Network First + Preload | Uses Navigation Preload API; falls back to `/offline.html` |
| `/_next/static/**` chunks                               | Cache First             | Content-hash URLs auto-invalidate on each Next.js build    |
| `/_next/image/**`                                       | Cache First             | Runtime cache with clone                                   |
| Images / fonts (`.png`, `.jpg`, `.svg`, `.woff2`, etc.) | Cache First             | Runtime cache with clone                                   |
| Everything else (same-origin GET)                       | Network First           | Falls back to cache on network failure                     |
| `/api/**`                                               | Bypass (Network Only)   | SW does nothing — always fresh                             |
| `/admin/**`                                             | Bypass (Network Only)   | SW does nothing — always fresh                             |
| `/ingest/**` (PostHog analytics)                        | Bypass (Network Only)   | SW does nothing                                            |

### Version Management

Bump `CACHE_VERSION` in `public/sw.js` after each production deploy. This invalidates the precached assets (logo, icons, offline page). Current version: **`cubaway-v12`**.

> Next.js JS/CSS chunks in `/_next/static/` are auto-invalidated via content-hash URLs — no version bump needed for those.

---

## Web App Manifest

### File

`app/manifest.ts` — generated by Next.js `MetadataRoute.Manifest`.

### Current Configuration

```typescript
{
  id: '/',
  name: 'CubaWay – Premium Car Rental',
  short_name: 'CubaWay',
  description: 'Rent premium vehicles quickly and easily...',
  start_url: '/',
  scope: '/',
  display: 'standalone',
  display_override: ['standalone'],
  orientation: 'portrait',
  background_color: '#ffffff',
  theme_color: '#8dc63f',
  categories: ['travel', 'business'],
  prefer_related_applications: false,
  icons: [
    { src: '/cubawayicon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: '/cubawayicon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    { src: '/cubawayicon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
  screenshots: [
    { src: '/opengraph-image', sizes: '1200x630', type: 'image/png', form_factor: 'wide', label: '...' },
    { src: '/cubawayicon-512.png', sizes: '512x512', type: 'image/png', form_factor: 'narrow', label: '...' },
  ]
}
```

### Key Fields for Native-Like Installation

- **`id`**: Stable identity for Chrome to recognize the app across manifest changes. Must not change.
- **`scope`**: Defines URL boundaries of the app.
- **`display: 'standalone'`**: Required for native-like experience (no browser chrome).
- **`screenshots` with `form_factor: 'narrow'`**: Required for Chrome's "richer install UI" on mobile.

### Theme Color Behavior

- `theme_color` in manifest controls the Android splash screen and status bar color (`#8dc63f`).
- `background_color` controls the splash screen background before CSS loads — set to `#ffffff` (white).
- `prefer_related_applications: false` explicitly tells Chrome NOT to prefer a native app, ensuring WebAPK install.
- `display_override: ['standalone']` provides stronger standalone mode preference.
- Runtime browser status bar color is controlled by `<meta name="theme-color">` from `export const viewport` in `app/layout.tsx`.
- Two `<meta name="theme-color">` tags are generated: one for `prefers-color-scheme: light` and one for `dark` — both set to `#8dc63f`. This ensures Chrome Android respects the brand color even when the device is in dark mode.
- `<meta name="color-scheme" content="light dark">` tells Chrome the page supports both modes, preventing Chrome's Auto Dark Theme from overriding the status bar color.
- `ThemeProvider` updates the meta tag dynamically to the fixed brand color `#8dc63f`.

---

## Install Banner

### File

`components/PWAInstallBanner.tsx`

### Behavior

1. Waits for `navigator.serviceWorker.ready` to resolve (`swReady` state) — this ensures the SW is active and controlling the page before any install UI is shown.
2. Listens for `beforeinstallprompt` event. Stores the deferred prompt in a ref.
3. Shows the install banner.
4. On "Install" button click: calls `.prompt()` on the deferred event (only if `swReady === true`).
5. On any response: hides the banner and cleans up the event listener.

### Browser Support for `beforeinstallprompt`

- **Chrome / Edge / Samsung Internet (Android)**: Fully supported.
- **Safari (iOS)**: NOT supported — iOS shows its own "Add to Home Screen" hint in the share sheet.
- **Firefox**: Not supported.

The banner only appears in browsers that fire `beforeinstallprompt`.

---

## PWA Installability Criteria (Chrome)

| Criterion                                          | CubaWay Status |
| -------------------------------------------------- | -------------- |
| Served over HTTPS                                  | ✅             |
| Has a valid Web App Manifest                       | ✅             |
| Manifest has `name` or `short_name`                | ✅             |
| Manifest has `start_url`                           | ✅             |
| Manifest has `id` field                            | ✅             |
| Manifest has `display: standalone`                 | ✅             |
| Manifest has at least one icon ≥ 192×192 (PNG)     | ✅             |
| Manifest has maskable icon ≥ 512×512               | ✅             |
| Manifest has screenshot with `form_factor: narrow` | ✅             |
| Has a registered Service Worker with fetch handler | ✅             |

---

## Testing PWA Locally

```bash
npm run build && npm run start
# Navigate to http://localhost:3000 in Chrome
```

### Chrome DevTools Checklist

1. **Application → Service Workers**: Status "Activated and running".
2. **Application → Cache Storage**: Verify `cubaway-v11-static` and `cubaway-v11-runtime`.
3. **Application → Manifest**: All fields valid, no installability warnings.
4. **Elements → Head**: `<meta name="theme-color" content="#8dc63f">` present.
5. **Network → Offline**: Reload → page loads from cache.

---

## Troubleshooting

### App installs as shortcut instead of native app

1. Ensure manifest has `id`, `scope`, `display: standalone`, and a `narrow` screenshot.
2. Uninstall the existing PWA/shortcut from the device home screen.
3. Clear Chrome site data on Android:
   - **Method 1 (on site)**: While on the site → tap the lock/tune icon (🔒/🎛️) in the URL bar → "Configuración del sitio" → "Borrar y restablecer"
   - **Method 2 (settings)**: Chrome → ⋮ → Configuración → Privacidad y seguridad → Borrar datos de navegación → Avanzado → select "Cookies y datos de sitios" + "Imágenes y archivos en caché" → Borrar datos
   - **Method 3 (nuclear)**: Android Settings → Apps → Chrome → Storage → Clear Cache
4. Close ALL Chrome tabs, force-stop Chrome from Android Settings → Apps → Chrome → Force Stop.
5. Reopen Chrome, navigate to the site, wait for new SW to install.
6. Reinstall via the install banner or Chrome menu → "Install app".

### Status bar color not changing on Android

- Chrome Android ignores `theme-color` on devices with dark mode when the Chrome "darken websites" flag/setting is enabled.
- Solution: The layout generates `<meta name="theme-color">` tags for both light and dark `prefers-color-scheme`, plus `<meta name="color-scheme" content="light dark">`.
- If the user has `chrome://flags/#darken-websites-checkbox-in-theme-setting` enabled AND has checked "Apply dark themes to sites", Chrome may still override. The user should disable this in Chrome Settings → Theme → uncheck "Apply dark themes to sites" or reset Chrome flags.
- When the PWA is installed as standalone (not shortcut), theme-color is always respected regardless of dark mode.

### Chrome flags that can affect PWA behavior

- `#darken-websites-checkbox-in-theme-setting` — enables "Apply dark themes to sites" checkbox
- `#web-contents-dark-mode` — forces dark content rendering
- `#enable-desktop-pwas-additional-windowing-controls` — extended PWA controls

---

## Environment Requirements

- **HTTPS** in production (Service Workers only work over HTTPS or `localhost`).
- `NEXT_PUBLIC_BASE_URL` set to the production HTTPS URL for correct `start_url` resolution.
