# DualGrid – PWA Documentation

## Overview

DualGrid uses a manually authored PWA setup focused on installability, offline fallback, fast static asset reuse and branded continuity with the live site.

## Current components

| Component              | File                        | Status |
| ---------------------- | --------------------------- | ------ |
| Service Worker         | `public/sw.js`              | Active |
| SW registration        | `instrumentation-client.ts` | Active |
| Manifest               | `app/manifest.ts`           | Active |
| Offline fallback       | `public/offline.html`       | Active |
| Viewport / theme color | `app/layout.tsx`            | Active |

## Service Worker

`public/sw.js` is maintained manually and registered only in production.

### Current cache version

- `dualgrid-v3-static`
- `dualgrid-v3-runtime`

### Precached assets

- `/offline.html`
- `/icon-192x192.png`
- `/icon-512x512.png`
- `/apple-touch-icon.png`

### Fetch strategy summary

| Request type                         | Strategy                                   |
| ------------------------------------ | ------------------------------------------ |
| HTML navigations                     | Network first, fallback to `/offline.html` |
| `/_next/static/**`                   | Cache first                                |
| Images, fonts, icons                 | Cache first                                |
| Same-origin GET fallback             | Network first                              |
| `/api/**`, `/admin/**`, `/ingest/**` | Network only                               |

### Offline experience

The offline screen in `public/offline.html` is designed to match the current DualGrid brand language:

- dark neon background,
- grid overlay,
- cyan and green glows,
- DualGrid mark and small-studio messaging,
- retry action for quick reconnection attempts.

## Manifest

`app/manifest.ts` defines the installable app metadata.

Current direction:

- brand name: `DualGrid`
- display: `standalone`
- theme color: `#00d9ff`
- background color: `#050912`
- screenshot source: `/opengraph-image`
- description aligned with the current positioning around web design, branding and digital development.

## Update propagation

The service worker uses:

- `self.skipWaiting()`
- `self.clients.claim()`
- `controllerchange` reload logic in `instrumentation-client.ts`

That ensures users receive the latest offline shell after deployment.

## Maintenance rules

1. Bump `CACHE_VERSION` in `public/sw.js` whenever `offline.html`, icons or other precached shell assets change.
2. Keep `offline.html` visually aligned with the live site.
3. Keep the manifest description and screenshot label aligned with the current marketing positioning.

## Local testing

```bash
npm run build
npm run start
```

Then verify in Chrome DevTools:

1. Service worker is active.
2. Cache Storage contains `dualgrid-v3-static` and `dualgrid-v3-runtime`.
3. Manifest loads without warnings.
4. Offline navigation falls back to the branded offline screen.
