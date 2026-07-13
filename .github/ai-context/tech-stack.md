# DualGrid – Tech Stack

## Core

| Technology   | Version     | Usage                                       |
| ------------ | ----------- | ------------------------------------------- |
| Next.js      | 16.1.6      | App Router, Turbopack dev, React Compiler   |
| React        | 19.2.3      | Server Components default                   |
| TypeScript   | 5 strict    | Path alias `@/*` → root                     |
| Tailwind CSS | 4           | CSS-variable design tokens in `globals.css` |
| MongoDB      | Atlas / any | Main database                               |
| Mongoose     | 9           | Models in `database/`                       |

Mongoose note:

- Models that use `ref` relations must import their dependent models for side effects (for example, `contract.model.ts` imports `client.model.ts`, and `invoice.model.ts` imports both `client.model.ts` and `contract.model.ts`). This keeps refs registered in isolated Next.js/Turbopack server chunks and prevents `MissingSchemaError` during `populate()` or `mongoose.model()` lookups.

## UI Libraries

| Library                          | Usage                                                                                                                                                  |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `class-variance-authority` (CVA) | Button variants in `components/ui/Button.tsx`                                                                                                          |
| `lucide-react`                   | Icons throughout the app                                                                                                                               |
| `clsx` + `tailwind-merge`        | Via `cn()` in `lib/utils.ts`                                                                                                                           |
| `@react-pdf/renderer`            | Server-side PDF generation for invoices, contracts, and questionnaire exports (`renderToBuffer` + `ReactElement<DocumentProps>` casting in API routes) |

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
/* Light */
--background: #f5f7ff;
--card: #ffffff;
--primary: #4f46e5;
--accent: #0891b2;

/* Dark neon palette */
--background: #000000;
--card: #2b303a;
--primary: #00d9ff;
--accent: #00ff9d;
--purple: #a594f9;
```

Dark mode uses a cinematic multi-layer gradient background (base linear gradient + radial cyan/green glows) applied globally on `body`, and landing sections switch to transparent in dark mode so the global effect remains visible.

## Key Utility Functions

| Function                     | File                           | Purpose                                                                                        |
| ---------------------------- | ------------------------------ | ---------------------------------------------------------------------------------------------- |
| `cn(...classes)`             | `lib/utils.ts`                 | Merge Tailwind classes safely                                                                  |
| `connectDB()`                | `lib/mongodb.ts`               | Cached Mongoose connection                                                                     |
| `recommendPlan(answers)`     | `lib/recommendation.ts`        | Returns `{ recommended, scores }`                                                              |
| `PLANS` / `PLAN_MAP`         | `lib/plans.ts`                 | Catalog of 8 plans with `detailedFeatures` matrix                                              |
| `getBaseUrl()`               | `lib/base-url.ts`              | Canonical URL for SEO metadata                                                                 |
| `requireAdminSession()`      | `lib/require-admin-session.ts` | Redirect guard for admin pages                                                                 |
| `isAdminSessionTokenValid()` | `lib/admin-auth.ts`            | Guard for admin API routes                                                                     |
| Zod schemas                  | `lib/schemas.ts`               | Validation schemas for all API routes (Client, Contract, Invoice, Expense, Questionnaire)      |
| `nextSeq(name)`              | `database/counter.model.ts`    | Atomic counter for invoice numbers — uses `findOneAndUpdate + $inc` to prevent race conditions |

## Removed from Original Stack

- PostHog analytics (`posthog-js`, `posthog-node`) — removed from all source files
- PWA PWAInstallBanner component — removed
- Cloudinary active usage — removed
- `lib/season.ts`, `lib/category-utils.ts`, `lib/api-client.ts`, `lib/posthog-server.ts` — deleted
