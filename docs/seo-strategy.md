# CubaWay – SEO Strategy

## Overview

CubaWay implements SEO using **Next.js App Router's built-in Metadata API** — no third-party SEO library. All metadata, sitemaps, robots, structured data, and the dynamic Open Graph image are generated programmatically following Next.js conventions.

**Production domain**: `https://cubaway.co`
**Env variable**: `NEXT_PUBLIC_BASE_URL=https://cubaway.co`

---

## Metadata Strategy

### Title Hierarchy

| Level              | Pattern                                             | Result                                              |
| ------------------ | --------------------------------------------------- | --------------------------------------------------- |
| Default (fallback) | `'CubaWay – Car Rental Cuba \| Rent a Car in Cuba'` | Shown when no page title is set                     |
| Template           | `'%s \| CubaWay'`                                   | Applied to all page-level titles                    |
| Page override      | `title: 'Rent a Car in Cuba – Browse & Book'`       | → `"Rent a Car in Cuba – Browse & Book \| CubaWay"` |

### Description Strategy

- Global fallback (layout): general brand + Cuba geographic targeting.
- Home page: specific with action-oriented copy and target keywords.
- Rule: every page should override the description with page-specific copy (120–160 chars).

### Target Keywords

Primary (EN): `car rental cuba`, `rent a car cuba`, `cuba rental car`, `Cuba way`, `CubaWay`, `car hire cuba`
Secondary (EN): `rent car havana`, `cheap car rental cuba`, `premium car rental cuba`
Primary (ES): `alquiler de autos cuba`, `renta de carros cuba`, `alquilar auto en cuba`

---

## Canonical URLs

All canonical URLs are generated using `getBaseUrl()` from `lib/base-url.ts`:

```typescript
import { getBaseUrl } from '@/lib/base-url';
const baseUrl = getBaseUrl();

export const metadata: Metadata = {
  alternates: {
    canonical: `${baseUrl}/page-path`,
  },
};
```

`getBaseUrl()` reads `NEXT_PUBLIC_BASE_URL` from environment variables, falling back to `http://localhost:3000` in development.

**Production value must be set**: `NEXT_PUBLIC_BASE_URL=https://cubaway.co`

---

## Open Graph Configuration

### Global OG (layout.tsx)

```typescript
openGraph: {
  type: 'website',
  locale: 'en_US',
  alternateLocale: ['es_ES'],
  url: baseUrl,
  siteName: 'CubaWay',
  title: 'CubaWay – Premium Car Rental',
  description: 'Rent premium vehicles quickly and easily...',
  images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: '...', type: 'image/png' }],
},
```

### Twitter / X Card

```typescript
twitter: {
  card: 'summary_large_image',
  title: 'CubaWay – Premium Car Rental',
  description: '...',
  images: ['/opengraph-image'],
}
```

### Dynamic OG Image

- File: `app/opengraph-image.tsx`
- Generates a dynamic PNG using `ImageResponse` from `next/og`.
- Served at `/opengraph-image`.
- Size: 1200×630 pixels.
- All pages reference this same dynamic image (single global OG image approach).

**Future improvement**: Generate page-specific or car-specific OG images using dynamic `[slug]/opengraph-image.tsx` route segments when car detail pages are added.

---

## Structured Data (JSON-LD)

### Root Layout (`app/layout.tsx`)

Three Schema.org types injected globally:

- **Organization**: CubaWay brand identity with logo and social links (Instagram, Facebook).
- **WebSite**: site metadata with bilingual language declaration.
- **AutoRental**: specialized business type (more specific than LocalBusiness) with `areaServed: Cuba` and offer catalog.

### Home Page (`app/page.tsx`)

- **WebPage** with `Service` schema describing the car rental service and geographic area.

### FAQs Page (`app/faqs/page.tsx`)

- **FAQPage** JSON-LD with 7 key Q&A pairs for Google rich snippet eligibility.

---

## Sitemap

- File: `app/sitemap.ts`
- Served at: `/sitemap.xml`

### Current Sitemap Entries

| URL      | Priority | Change Frequency |
| -------- | -------- | ---------------- |
| `/`      | 1.0      | daily            |
| `/about` | 0.7      | monthly          |
| `/faqs`  | 0.7      | monthly          |

Only real page URLs are included. Fragment URLs (`/#cars`, `/#hero`) were removed — Google ignores fragment identifiers.

1. **Hash fragment URLs** (`/#cars`, `/#hero`) are **not valid sitemap entries** — Google ignores fragment identifiers in sitemaps. These should be removed or replaced with actual page URLs.
2. **No car-level URLs** — individual vehicles are currently viewed in a modal, not dedicated pages. If car detail pages (`/cars/[slug]`) are added, the sitemap should fetch all slugs from MongoDB and include them.

### Recommended Improvement

```typescript
// app/sitemap.ts — improved version
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const now = new Date();

  // Fetch car slugs from DB for individual car pages (once /cars/[slug] pages exist)
  // await connectDB();
  // const cars = await Car.find({ available: true }).select('slug updatedAt').lean();

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    // Add /cars/[slug] entries here when car detail pages exist
  ];
}
```

---

## Robots Configuration

File: `app/robots.ts`

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Sitemap: https://cubaway.com/sitemap.xml
```

Admin and API routes are correctly excluded from crawling.

---

## Icons & Favicon

Set in `app/layout.tsx` metadata:

```typescript
icons: {
  icon: '/icon.png',
  shortcut: '/icon.png',
  apple: '/icon.png',
}
```

**Improvement opportunity**: Add multiple icon sizes and an SVG favicon.

---

## SEO Recommendations

### Completed

- [x] Fix `NEXT_PUBLIC_BASE_URL` to `https://cubaway.co`
- [x] Remove fragment URLs from sitemap
- [x] Add `/faqs` to sitemap
- [x] Add FAQPage JSON-LD structured data
- [x] Fix multiple H1 tags on homepage (now single H1)
- [x] Optimize keywords for target searches ("car rental cuba", "rent a car cuba", etc.)
- [x] Replace LocalBusiness with AutoRental schema type
- [x] Add social media links to Organization schema
- [x] Complete FAQs page metadata (canonical, OG)
- [x] Optimize About page SEO copy

### High Priority (Remaining)

1. **Update Vercel env** — set `NEXT_PUBLIC_BASE_URL=https://cubaway.co` in Vercel dashboard
2. **Google Search Console** — verify ownership and submit sitemap
3. **Car detail pages** — individual `/cars/[slug]` pages for per-vehicle indexing

### Medium Priority

4. **Hreflang tags** — declare bilingual alternates (requires URL-based locale routing)
5. **BreadcrumbList** — add breadcrumb JSON-LD on inner pages
6. **Blog section** — content marketing for long-tail keywords
7. **Page-specific OG images** — car-specific opengraph images

### Low Priority

8. **Twitter/X creator handle** — add `creator: '@cubaway'` when social presence exists
9. **Article schema** — if a blog section is added in the future

---

## Multilingual SEO

The app supports English and Spanish but currently does **not** implement:

- `hreflang` HTTP headers or meta tags
- Separate URL paths per locale (`/en/`, `/es/`)

All i18n is handled client-side via localStorage. This means search engines only index one language version per URL.

### Recommended Path

If SEO is critical for both languages, migrate to Next.js i18n routing (`next.config.ts` `i18n` config or `[locale]` route segments) and add `alternates.languages` to metadata:

```typescript
alternates: {
  canonical: `${baseUrl}/`,
  languages: {
    'en': `${baseUrl}/en/`,
    'es': `${baseUrl}/es/`,
  },
},
```
