# Skill: SEO Optimization

Use this skill when improving or auditing SEO in CubaWay pages and components.

---

## SEO Architecture Overview

CubaWay uses the **Next.js Metadata API** exclusively — no third-party SEO libraries.

| Asset            | File                             | Purpose                                  |
| ---------------- | -------------------------------- | ---------------------------------------- |
| Global metadata  | `app/layout.tsx`                 | Title template, default OG, Twitter Card |
| Page metadata    | `app/[page]/page.tsx`            | Page-specific overrides                  |
| Dynamic OG Image | `app/opengraph-image.tsx`        | Auto-generated 1200×630 image            |
| Sitemap          | `app/sitemap.ts`                 | `/sitemap.xml`                           |
| Robots           | `app/robots.ts`                  | `/robots.txt`                            |
| JSON-LD          | `app/layout.tsx` + page files    | Structured data                          |
| Canonical URL    | `lib/base-url.ts → getBaseUrl()` | Canonical URL source of truth            |

---

## Step 1 — Every Page Must Export Metadata

```typescript
// app/[page]/page.tsx
import { getBaseUrl } from '@/lib/base-url';
import type { Metadata } from 'next';

const baseUrl = getBaseUrl();

export const metadata: Metadata = {
  // Title — the template in layout.tsx adds " | CubaWay" automatically
  title: 'Page Title',

  // Description — 120–160 characters, active voice, includes target keyword
  description: 'Exactly what users get from this page in 1–2 sentences.',

  // Keywords — helpful context, not a ranking signal but good for AI understanding
  keywords: ['keyword 1', 'keyword 2'],

  // Canonical URL — prevents duplicate content penalties
  alternates: {
    canonical: `${baseUrl}/page-path`,
  },

  // Open Graph — controls social sharing previews
  openGraph: {
    title: 'Page Title',
    description: 'Description for social sharing.',
    url: `${baseUrl}/page-path`,
    images: [
      {
        url: '/opengraph-image', // Dynamic OG image from app/opengraph-image.tsx
        width: 1200,
        height: 630,
        alt: 'Descriptive alt text for image',
        type: 'image/png',
      },
    ],
  },
};
```

---

## Step 2 — Title Convention

The root layout sets a title template: `'%s | CubaWay'`.

```typescript
// layout.tsx (already set — do not change)
title: {
  default: 'CubaWay – Premium Car Rental',
  template: '%s | CubaWay',
}

// In a page — only provide the unique fragment:
title: 'Our Fleet'           // → "Our Fleet | CubaWay"
title: 'About Us'            // → "About Us | CubaWay"

// ❌ Don't duplicate the brand suffix
title: 'Our Fleet | CubaWay' // → "Our Fleet | CubaWay | CubaWay"
```

---

## Step 3 — Description Best Practices

- Length: **120–160 characters**.
- Include the **primary keyword** naturally.
- Use **active voice**: "Browse our fleet..." not "Vehicles can be browsed..."
- Be **specific**: what does the user actually find on this page?

```typescript
// ✅ Good
description: 'Explore our curated fleet of premium rental cars in Cuba. Compare seasonal prices and book instantly via WhatsApp.';

// ❌ Too generic
description: 'Welcome to CubaWay. We have cars.';

// ❌ Keyword stuffing
description: 'car rental Cuba, rent car Cuba, cheap car rental Cuba, Cuba car rent...';
```

---

## Step 4 — Structured Data (JSON-LD)

Add JSON-LD to page Server Components for rich results eligibility.

### WebPage (every public page)

```typescript
const pageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Page Title',
  description: 'Page description.',
  url: `${baseUrl}/page-path`,
  isPartOf: { '@id': `${baseUrl}/#website` },
};

export default function MyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />
      {/* page content */}
    </>
  );
}
```

### Product / Car listing (future enhancement)

```typescript
const carJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: `${car.brand} ${car.carModel}`,
  description: car.description,
  image: car.images[0],
  offers: {
    '@type': 'Offer',
    priceCurrency: 'USD',
    price: car.priceHighSeason,
    availability: 'https://schema.org/InStock',
  },
};
```

---

## Step 5 — Images and Alt Text

Every image must have meaningful alt text:

```tsx
// ✅ Descriptive alt text
<Image
  src={imageSrc}
  alt={`${brand} ${carModel} – available for rent in Cuba`}
  fill
  sizes="(max-width: 640px) 100vw, 25vw"
/>

// ❌ Empty or useless alt
<Image src={imageSrc} alt="" />
<Image src={imageSrc} alt="image" />
```

---

## Step 6 — Sitemap

Add new public, indexable pages to `app/sitemap.ts`:

```typescript
{
  url: `${baseUrl}/page-path`,
  lastModified: now,
  changeFrequency: 'monthly',
  priority: 0.6,          // 1.0 = home, 0.9 = primary sections, 0.6–0.7 = detail pages
}
```

**Never add:**

- `/admin/**` routes
- `/api/**` routes
- Pages with `noindex` intent

---

## Step 7 — Robots

`app/robots.ts` already disallows admin and API routes. Add new sensitive path segments there if needed:

```typescript
disallow: ['/admin/', '/api/', '/new-private-path/'],
```

---

## Audit Checklist

Run through this before marking SEO work complete:

- [ ] `metadata` exported from every public page
- [ ] Title follows template pattern (no brand suffix duplication)
- [ ] Description is 120–160 chars, active voice, includes target keyword
- [ ] `alternates.canonical` set with `getBaseUrl()` + page path
- [ ] `openGraph` has title, description, url, and image
- [ ] Images have descriptive alt text
- [ ] New page added to `app/sitemap.ts` (if public and indexable)
- [ ] Admin and API routes confirmed absent from sitemap
- [ ] JSON-LD added for pages with structured content
- [ ] No broken canonical URLs (verify `NEXT_PUBLIC_BASE_URL` env var is set correctly)

---

## SEO Improvement Opportunities

### Missing from current implementation

1. **Individual car detail pages** — currently resolved via a modal, not a dedicated URL. Adding `/cars/[slug]` pages would allow Google to index individual vehicles.
2. **FAQ / content sections** — FAQ structured data (`FAQPage`) could be added to increase SERP features.
3. **Dynamic sitemap** — sitemap currently only lists static routes; pulling car slugs from MongoDB would add car pages.
4. **Hreflang** — bilingual content is available but no `hreflang` language alternates are declared.
