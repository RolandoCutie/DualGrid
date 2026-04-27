# GitHub Copilot Instructions

## ⚠️ READ FIRST — MANDATORY

**Before making any change**, read these files in order:

1. `.github/ai-context/project-overview.md` — business logic, features, env vars
2. `.github/ai-context/architecture.md` — folder structure, routing, component hierarchy
3. `.github/ai-context/tech-stack.md` — technologies and usage patterns

> **🔴 NON-NEGOTIABLE RULE — ALWAYS UPDATE DOCS AFTER ANY SIGNIFICANT CHANGE**
>
> After finishing any task that adds, modifies, or removes files, patterns, libraries, or conventions,
> **immediately** update the affected documentation files below — without waiting to be asked:
>
> | What changed                 | Update this file                         |
> | ---------------------------- | ---------------------------------------- |
> | New/moved files or folders   | `.github/ai-context/architecture.md`     |
> | New lib utility or pattern   | `.github/ai-context/tech-stack.md`       |
> | New feature or business rule | `.github/ai-context/project-overview.md` |
> | New env var                  | `.github/ai-context/project-overview.md` |
> | New i18n keys                | `.github/ai-context/architecture.md`     |
> | PWA changes                  | `docs/pwa.md`                            |
> | SEO changes                  | `docs/seo-strategy.md`                   |
> | Folder structure changes     | `docs/architecture-map.md`               |
>
> **Do this every time. Do not batch it. Do not skip it. Do not wait to be asked.**

---

## Project Overview

**CubaWay** is a production full-stack **bilingual (EN/ES) car rental platform** for Cuba.

- Users browse vehicles, filter by specs/price, and book via **WhatsApp deep-link**.
- Admins manage fleet, pricing, and seasonal rates through a **protected dashboard**.
- Built with Next.js 16.1.6 App Router, React 19, TypeScript 5 strict, Tailwind CSS 4, MongoDB + Mongoose, Cloudinary, PostHog analytics, and a manual PWA service worker.

## Architecture

Full architecture documented in `.github/ai-context/architecture.md`.

```
app/          → Pages, layouts, API routes (App Router)
components/   → Public-facing UI components
components/admin/ → Admin-only UI components (forms, lists, layout primitives)
components/ui/→ Providers, toggles, animation primitives
database/     → Mongoose models (car, season)
lib/          → Utilities, auth, DB connection, SEO helpers
public/       → Static assets + sw.js (Service Worker)
```

### Key Technologies

- **Next.js 16.1.6** App Router • React Compiler enabled • Turbopack in dev
- **React 19.2.3** Server Components by default
- **TypeScript 5** strict mode • path alias `@/*` → root
- **Tailwind CSS 4** CSS-variable design tokens in `globals.css`
- **MongoDB + Mongoose** — connection cached in `lib/mongodb.ts`
- **Cloudinary** — car image hosting; admin uploads via API route
- **Custom HMAC-SHA256 auth** — session cookie, no third-party auth library
- **PostHog** — analytics, proxied through `/ingest/` rewrites
- **PWA** — manual service worker at `public/sw.js` + manifest at `app/manifest.ts`

## Development Commands

```bash
npm run dev       # Start dev server (Turbopack) on localhost:3000
npm run build     # Production build
npm run start     # Run production server
npm run lint      # ESLint
npm run format    # Prettier format
```

---

## Mandatory Pre-Work Before Any Change

1. Read `.github/ai-context/project-overview.md`, `architecture.md`, `tech-stack.md`
2. Check existing patterns in similar files before writing anything
3. Confirm Server vs Client boundary before adding hooks or browser APIs
4. Add i18n keys to **both** `app/i18n/en.json` and `app/i18n/es.json` before using `t()`

---

## Coding Patterns

### TypeScript — absolute imports only

```typescript
import { cn } from '@/lib/utils'; // ✅
import CarCard from '@/components/CarCard'; // ✅
import CarCard from '../../components/...'; // ❌
```

### Tailwind — semantic tokens only

```tsx
<div className="bg-background text-foreground border border-border"> // ✅
<div className="bg-[#f9fafb] text-[#111827]">                        // ❌
```

### i18n — never hard-code user-visible text

```tsx
const { t } = useLanguage();
return <h1>{t('hero.title')}</h1>; // ✅
return <h1>Welcome to CubaWay</h1>; // ❌
```

### Images — always next/image

```tsx
import Image from 'next/image';
<Image src={normalizeImageSrc(url)} alt="descriptive text" fill sizes="..." /> // ✅
<img src={url} />                                                               // ❌
```

### Class merging — always cn()

```typescript
import { cn } from '@/lib/utils';
<div className={cn('base', isActive && 'active', className)} /> // ✅
```

### Server vs Client

```tsx
// Server Component (default — no directive needed)
export default function Page() { ... }

// Client Component — only add when using hooks or browser APIs
'use client';
export default function Interactive() { ... }
```

---

## SEO — Required on Every Page

```typescript
export const metadata: Metadata = {
  title: 'Page Title', // becomes "Page Title | CubaWay" via template
  description: '...',
  alternates: { canonical: `${baseUrl}/path` },
  openGraph: {
    title: '...',
    description: '...',
    url: `${baseUrl}/path`,
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: '...' }],
  },
};
```

- Use `getBaseUrl()` from `@/lib/base-url` for canonical URLs.
- Admin and API routes must NOT appear in the sitemap.
- JSON-LD belongs in the page Server Component, not in child components.

---

## PWA Maintenance

- Service worker: `public/sw.js` — manually authored, no Workbox.
- Add new `public/` static assets to `PRECACHE_ASSETS` in `sw.js`.
- Bump `CACHE_VERSION` in `sw.js` after breaking app-shell changes.
- API and admin routes are auto-skipped by the SW — no changes needed.
- Manifest: edit `app/manifest.ts`.

---

## Admin Panel

- Admin pages call `requireAdminSession()` before rendering.
- Admin API mutations call `isAdminSessionTokenValid(token)` before any logic.
- Never hardcode the admin login URL segment — it's `ADMIN_SECRET_PATH` from env.

---

## Database

- Always `await connectDB()` before Mongoose operations.
- Import from `@/database/car.model` and `@/database/season.model`.
- Use `slug` (not `_id`) as the public car identifier.

---

## Do NOT

- ❌ Add a `pages/` directory
- ❌ Use `getServerSideProps` / `getStaticProps`
- ❌ Call `connectDB()` from a Client Component
- ❌ Hard-code user-visible text
- ❌ Use raw hex colors in Tailwind classes
- ❌ Use `<img>` tags
- ❌ Skip admin auth checks in API routes
- ❌ Add third-party auth libraries
- ❌ Create pages without `metadata` export

---

## Quick Reference

| Task                   | Where                                     |
| ---------------------- | ----------------------------------------- |
| New public page        | `app/[route]/page.tsx`                    |
| New API endpoint       | `app/api/[resource]/route.ts`             |
| New public component   | `components/ComponentName.tsx`            |
| New admin component    | `components/admin/ComponentName.tsx`      |
| New UI primitive       | `components/ui/ComponentName.tsx`         |
| New translation string | `app/i18n/en.json` + `app/i18n/es.json`   |
| New DB model           | `database/model.ts` + `database/index.ts` |
| Update PWA manifest    | `app/manifest.ts`                         |
| Update service worker  | `public/sw.js`                            |
| Update sitemap         | `app/sitemap.ts`                          |
| Update robots rules    | `app/robots.ts`                           |

---

## After Making Changes

> **This step is mandatory and automatic — do it without being asked.**

Update the relevant docs:

- `.github/ai-context/project-overview.md` — features, env vars
- `.github/ai-context/architecture.md` — structure, routing, new utilities
- `.github/ai-context/tech-stack.md` — dependencies, patterns, utilities
- `docs/architecture-map.md` — folder structure
- `docs/seo-strategy.md` — SEO metadata changes
- `docs/pwa.md` — PWA configuration changes
