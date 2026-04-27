# Skill: Create a New Page

Use this skill when you need to add a public-facing page to CubaWay.

---

## Pre-Checks

Before creating anything:

1. Read `.github/ai-context/architecture.md` to understand existing routing.
2. Confirm the route does not already exist.
3. If the page needs translated copy, add keys to **both** `app/i18n/en.json` and `app/i18n/es.json` first.

---

## Step 1 — Create the Page File

All pages live under `app/`. The folder name becomes the URL segment.

```
app/about/page.tsx       → /about
app/fleet/page.tsx       → /fleet
app/blog/[slug]/page.tsx → /blog/:slug
```

### Server Component Template (default — no interactivity)

```tsx
// app/about/page.tsx
import { getBaseUrl } from '@/lib/base-url';
import type { Metadata } from 'next';

const baseUrl = getBaseUrl();

// ── SEO Metadata ──────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'About CubaWay', // Becomes "About CubaWay | CubaWay" via template
  description: 'Learn more about CubaWay – your premium car rental service in Cuba.',
  alternates: {
    canonical: `${baseUrl}/about`,
  },
  openGraph: {
    title: 'About CubaWay',
    description: 'Learn more about CubaWay.',
    url: `${baseUrl}/about`,
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'CubaWay – About',
      },
    ],
  },
};

// ── Optional JSON-LD ──────────────────────────────────────────────────────────
const pageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'About CubaWay',
  url: `${baseUrl}/about`,
  isPartOf: { '@id': `${baseUrl}/#website` },
};

// ── Page Component ────────────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Page content here */}
      </main>
    </>
  );
}
```

### Client Component Template (needs hooks or browser APIs)

```tsx
// app/about/page.tsx — Server shell with metadata
import AboutContent from '@/components/AboutContent'; // Client Component
import { getBaseUrl } from '@/lib/base-url';
import type { Metadata } from 'next';

const baseUrl = getBaseUrl();

export const metadata: Metadata = {
  title: 'About CubaWay',
  description: '...',
  alternates: { canonical: `${baseUrl}/about` },
  openGraph: {
    /* ... */
  },
};

export default function AboutPage() {
  return <AboutContent />;
}
```

```tsx
// components/AboutContent.tsx — Client Component
'use client';

import { useLanguage } from '@/components/ui/LanguageProvider';

export default function AboutContent() {
  const { t } = useLanguage();
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-extrabold text-foreground">{t('about.title')}</h1>
    </main>
  );
}
```

---

## Step 2 — Add i18n Strings

If the page has any user-visible text, add translation keys to both files **before** using them in the component.

```json
// app/i18n/en.json
{
  "about.title": "About CubaWay",
  "about.description": "We are the premier car rental service ..."
}
```

```json
// app/i18n/es.json
{
  "about.title": "Sobre CubaWay",
  "about.description": "Somos el servicio de alquiler de autos líder ..."
}
```

---

## Step 3 — Update the Sitemap (if public and indexable)

```typescript
// app/sitemap.ts — add the new route
{
  url: `${baseUrl}/about`,
  lastModified: now,
  changeFrequency: 'monthly',
  priority: 0.6,
},
```

Admin pages and API routes MUST NOT appear in the sitemap.

---

## Checklist

- [ ] File created at correct `app/[route]/page.tsx` path
- [ ] `metadata` export with title, description, canonical, and openGraph
- [ ] `getBaseUrl()` used for canonical URL
- [ ] All user-visible text uses `t('key')` — never hard-coded strings
- [ ] i18n keys added to both `en.json` and `es.json`
- [ ] No raw hex colors in Tailwind — semantic tokens only
- [ ] `next/image` used for any images
- [ ] Page added to `app/sitemap.ts` if publicly indexable
- [ ] JSON-LD added if meaningful structured data is available
