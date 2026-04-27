# DualGrid – Tech Stack

## Core

| Technology | Version | Usage |
|---|---|---|
| Next.js | 16.1.6 | App Router, Turbopack dev, React Compiler |
| React | 19.2.3 | Server Components default |
| TypeScript | 5 strict | Path alias `@/*` → root |
| Tailwind CSS | 4 | CSS-variable design tokens in `globals.css` |
| MongoDB | Atlas / any | Main database |
| Mongoose | 9 | Models in `database/` |

## UI Libraries

| Library | Usage |
|---|---|
| `class-variance-authority` (CVA) | Button variants in `components/ui/Button.tsx` |
| `lucide-react` | Icons throughout the app |
| `clsx` + `tailwind-merge` | Via `cn()` in `lib/utils.ts` |

## Auth

- Custom HMAC-SHA256 tokens — `lib/admin-auth.ts`
- Session stored in HTTP-only cookie
- No third-party auth library

## Image Hosting

- Cloudinary remote patterns still in `next.config.ts` (if images reintroduced)
- No active Cloudinary usage in DualGrid yet

## Fonts

- **Inter** — loaded via `next/font/google` in `app/layout.tsx`

## Design Tokens (CSS Variables)

Defined in `app/globals.css`:

```css
--background: #fafafa
--foreground: #18181b
--card: #ffffff
--card-foreground: #18181b
--primary: #6366f1  (indigo-500)
--primary-foreground: #ffffff
--secondary: #f4f4f5
--muted: #f4f4f5
--border: #e4e4e7
--ring: #6366f1
```

Dark mode mirrors with zinc-900 backgrounds.

## Key Utility Functions

| Function | File | Purpose |
|---|---|---|
| `cn(...classes)` | `lib/utils.ts` | Merge Tailwind classes safely |
| `connectDB()` | `lib/mongodb.ts` | Cached Mongoose connection |
| `recommendPlan(answers)` | `lib/recommendation.ts` | Returns `{ recommended, scores }` |
| `PLANS` / `PLAN_MAP` | `lib/plans.ts` | Catalog of 5 DualGrid plans |
| `getBaseUrl()` | `lib/base-url.ts` | Canonical URL for SEO metadata |
| `requireAdminSession()` | `lib/require-admin-session.ts` | Redirect guard for admin pages |
| `isAdminSessionTokenValid()` | `lib/admin-auth.ts` | Guard for admin API routes |

## Removed from Original Stack

- PostHog analytics (`posthog-js`, `posthog-node`) — removed from all source files
- PWA PWAInstallBanner component — removed
- Cloudinary active usage — removed
- `lib/season.ts`, `lib/category-utils.ts`, `lib/api-client.ts`, `lib/posthog-server.ts` — deleted
