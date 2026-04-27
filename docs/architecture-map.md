# CubaWay – Architecture Map

## Full Folder Structure

```
ride4go/                                   ← Repository root
│
├── app/                                   ← Next.js App Router
│   ├── layout.tsx                         ← Root layout (fonts, metadata, JSON-LD, providers)
│   ├── page.tsx                           ← Home page (Server Component)
│   ├── globals.css                        ← Tailwind v4 + CSS variable design tokens
│   ├── manifest.ts                        ← Web App Manifest
│   ├── sitemap.ts                         ← /sitemap.xml
│   ├── robots.ts                          ← /robots.txt
│   ├── opengraph-image.tsx                ← /opengraph-image (dynamic OG image)
│   ├── error.tsx                          ← Global error boundary
│   ├── not-found.tsx                      ← 404 page
│   ├── loading.tsx                        ← Root Suspense loading state
│   ├── loader.tsx                         ← Reusable loader/spinner UI
│   │
│   ├── i18n/
│   │   ├── en.json                        ← English translation strings
│   │   └── es.json                        ← Spanish translation strings
│   │
│   ├── admin/
│   │   ├── [secret]/
│   │   │   └── page.tsx                   ← Hidden admin login page
│   │   └── dashboard/
│   │       ├── page.tsx                   ← Admin dashboard (protected)
│   │       ├── cars/
│   │       │   ├── page.tsx               ← Admin car list
│   │       │   ├── new/
│   │       │   │   └── page.tsx           ← Create new car form
│   │       │   └── edit/
│   │       │       └── [slug]/
│   │       │           └── page.tsx       ← Edit existing car form
│   │       └── seasons/
│   │           └── page.tsx               ← Season management
│   │
│   └── api/
│       ├── cars/
│       │   ├── route.ts                   ← GET /api/cars | POST /api/cars (admin)
│       │   └── [slug]/
│       │       └── route.ts               ← GET | PATCH | DELETE /api/cars/[slug]
│       ├── seasons/
│       │   ├── route.ts                   ← GET /api/seasons | POST (admin)
│       │   └── [id]/
│       │       └── route.ts               ← PATCH | DELETE /api/seasons/[id] (admin)
│       └── admin/
│           ├── login/
│           │   └── route.ts               ← POST credentials → set session cookie
│           ├── logout/
│           │   └── route.ts               ← POST → clear session cookie
│           └── session/
│               └── route.ts               ← GET → validate current session
│
├── components/                            ← Public-facing UI components
│   ├── NavBar.tsx                         ← Server wrapper → renders NavBarClient
│   ├── NavBarClient.tsx                   ← Client: responsive nav, theme & lang toggles
│   ├── Footer.tsx                         ← Site footer
│   ├── HeroSection.tsx                    ← Landing hero (gradient, car image, CTA)
│   ├── HomePageContent.tsx                ← Client wrapper: hero + car grid section
│   ├── CarGrid.tsx                        ← Client: fetches cars API, filter state, modal
│   ├── CarCard.tsx                        ← Car tile (image, specs, price, CTA)
│   ├── CarModal.tsx                       ← Booking modal (carousel, calculator, WhatsApp CTA)
│   ├── FilterBar.tsx                      ← Car grid filter controls
│   ├── CustomButton.tsx                   ← Reusable button component
│   ├── PWAInstallBanner.tsx               ← PWA install prompt banner
│   │
│   ├── admin/                            ← Admin-only UI components
│   │   ├── AdminBackButton.tsx            ← Reusable back-arrow link for admin pages
│   │   ├── AdminPageHeader.tsx            ← Page title + description + optional add button
│   │   ├── AdminPageLayout.tsx            ← Outer layout wrapper (min-h-screen + max-w + padding)
│   │   ├── AdminCarModelFilters.tsx       ← Filter bar for car model list
│   │   ├── AdminCategoryFilters.tsx       ← Filter bar for category list
│   │   ├── AdminCarList.tsx               ← Admin table of all cars (legacy)
│   │   ├── AdminCarModelList.tsx          ← Admin car model list (uses AdminCarModelFilters)
│   │   ├── AdminCategoryList.tsx          ← Admin category list (uses AdminCategoryFilters)
│   │   ├── AdminLoginForm.tsx             ← Admin login UI
│   │   ├── CarForm.tsx                    ← Legacy create/edit car form
│   │   ├── CarModelForm.tsx               ← Create/edit car model form
│   │   ├── CategoryForm.tsx               ← Create/edit category form with multi-select cars
│   │   ├── ReserveForm.tsx                ← Reserve creation/edit form
│   │   ├── ReservesAdmin.tsx              ← Reserves CRUD UI with filters and PDF export
│   │   └── SeasonsAdmin.tsx               ← Season CRUD UI
│   │
│   └── ui/                               ← Generic UI primitives (no domain logic)
│       ├── LanguageProvider.tsx           ← i18n context: locale state, t(), tArray()
│       ├── LanguageToggle.tsx             ← EN/ES language switcher button
│       ├── ThemeProvider.tsx              ← Dark/light mode context
│       ├── ThemeToggle.tsx                ← Dark/light theme switcher button
│       ├── LocationSelector.tsx           ← Reusable province→location 2-step selector
│       ├── RichTextEditor.tsx            ← TipTap WYSIWYG editor (Bold, Italic, Lists, H3)
│       └── ScrollReveal.tsx              ← IntersectionObserver reveal animation wrapper
│
├── database/                              ← Mongoose models
│   ├── car.model.ts                       ← ICar interface + CarSchema
│   ├── season.model.ts                    ← ISeasonRange interface + SeasonSchema
│   └── index.ts                           ← Re-exports all models
│
├── lib/                                   ← Utility functions and server helpers
│   ├── mongodb.ts                         ← Mongoose connection with global hot-reload cache
│   ├── admin-auth.ts                      ← HMAC-SHA256 session token create/validate
│   ├── require-admin-session.ts           ← Route guard: redirects to login if no session
│   ├── base-url.ts                        ← getBaseUrl() → reads NEXT_PUBLIC_BASE_URL
│   ├── season.ts                          ← Season types, getSeasonType(), calculateRentalPrice()
│   ├── posthog-server.ts                  ← Server-side PostHog singleton
│   └── utils.ts                           ← cn() (clsx + tailwind-merge), normalizeImageSrc()
│
├── public/                                ← Static assets (served at root)
│   ├── sw.js                              ← Service Worker (manually authored)
│   ├── hero.png                           ← Hero section car image
│   ├── logo.svg                           ← CubaWay logo
│   ├── icon.png                           ← App icon (used by manifest, favicon)
│   ├── cubawayicon.jpg                    ← PWA icon 192×192 / 512×512
│   ├── cubawayicon-512-maskable.jpg       ← PWA maskable icon 512×512
│   └── fonts/
│       ├── SQCQAN+GoodlyBold.cff          ← Custom Goodly Bold font (subset)
│       └── SQCQAN+GoodlyRegular.cff       ← Custom Goodly Regular font (subset)
│
├── docs/                                  ← Human-readable project documentation
│   ├── architecture-map.md                ← This file
│   ├── seo-strategy.md                    ← SEO approach and recommendations
│   └── pwa.md                             ← PWA configuration and audit
│
├── .github/
│   ├── copilot-instructions.md            ← AI assistant coding instructions
│   ├── ai-context/
│   │   ├── project-overview.md            ← Business logic, features, env vars
│   │   ├── architecture.md                ← Architecture detail
│   │   └── tech-stack.md                  ← Technology usage patterns
│   └── skills/
│       ├── create-page.skill.md           ← Skill: add a new page
│       ├── create-component.skill.md      ← Skill: add a new component
│       ├── seo-optimization.skill.md      ← Skill: SEO improvements
│       └── pwa-maintenance.skill.md       ← Skill: PWA updates
│
├── next.config.ts                         ← Next.js configuration
├── tsconfig.json                          ← TypeScript configuration
├── eslint.config.mjs                      ← ESLint rules
├── postcss.config.mjs                     ← PostCSS / Tailwind v4 processing
├── instrumentation-client.ts              ← Client-side PostHog initialization
├── components.json                        ← Shadcn UI configuration
└── package.json                           ← Dependencies and scripts
```

---

## Key Directory Explanations

### `app/`

The entirety of the Next.js App Router. Every `page.tsx` becomes a route, every `layout.tsx` wraps child routes, and every `route.ts` is an API endpoint. Admin pages are under `app/admin/`, protected by session validation. API routes are under `app/api/`.

### `components/`

Two tiers:

1. **Root-level components** (`components/*.tsx`): domain-aware components that contain business logic (car data, admin forms, booking modals).
2. **`components/ui/`**: pure UI primitives with no domain knowledge (theme provider, language provider, animation wrappers, toggle buttons).

### `database/`

Mongoose model definitions only. No business logic lives here — models define schema, types, and validation. Querying logic lives in API route handlers.

### `lib/`

Server-side and shared utility functions. Key exports:

- `connectDB()` — must be called before any Mongoose query.
- `isAdminSessionTokenValid()` — must be called in every admin API route.
- `requireAdminSession()` — used by admin page server components.
- `getBaseUrl()` — canonical URL for SEO metadata.
- `cn()` — class merging utility used by all components.

### `public/`

Static files served at `/`. The `sw.js` service worker is here because it must be served from the root to control the entire origin scope.

---

## Routing Flow

```
Browser Request
     │
     ▼
Next.js Router (App Router)
     │
     ├─ / ──────────────────────── app/page.tsx (Server Component)
     │                                 └─ renders HomePageContent (Client)
     │                                       ├─ HeroSection
     │                                       └─ CarGrid → fetches /api/cars
     │
     ├─ /admin/[secret] ─────────── app/admin/[secret]/page.tsx
     │                                 └─ Shows login form if path matches ADMIN_SECRET_PATH
     │
     ├─ /admin/dashboard/** ──────── app/admin/dashboard/**/page.tsx
     │                                 └─ All protected by requireAdminSession()
     │
     ├─ /api/cars ────────────────── app/api/cars/route.ts
     │                                 ├─ GET: returns filtered car list
     │                                 └─ POST: creates car (admin session required)
     │
     ├─ /api/admin/login ─────────── app/api/admin/login/route.ts
     │                                 └─ POST: validates credentials, sets cookie
     │
     └─ /opengraph-image ─────────── app/opengraph-image.tsx (ImageResponse)
```

---

## Component Organization Philosophy

Components are organized by their **dependency direction**:

```
UI Primitives (components/ui/)
       ↑  consumed by
Domain Components (components/)
       ↑  consumed by
Page Components (app/**/page.tsx)
```

- UI primitives have zero knowledge of car data, admin, or routing.
- Domain components can use UI primitives and hooks but not page-level concerns.
- Pages compose domain components and set metadata — no business logic in pages themselves.

---

## State Management

CubaWay uses **React Context** for global state — no Redux, Zustand, or Jotai.

| Context            | Provider           | Consumers                                                  |
| ------------------ | ------------------ | ---------------------------------------------------------- |
| Theme (dark/light) | `ThemeProvider`    | `ThemeToggle`, any component with dark-mode classes        |
| Language (en/es)   | `LanguageProvider` | Any component with user-visible text (via `useLanguage()`) |

Local state (`useState`, `useRef`) is used for component-specific concerns like modal open state, filter values, image carousel index.
