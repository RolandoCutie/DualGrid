# DualGrid – SEO Strategy

## Overview

DualGrid uses the built-in Next.js Metadata API for titles, descriptions, canonical URLs, robots, sitemap, structured data and the dynamic Open Graph image.

- Production domain: `https://dualgrid.co`
- Base URL env: `NEXT_PUBLIC_BASE_URL=https://dualgrid.co`
- Current positioning: web design, branding and digital development for businesses that want to communicate better, look more professional and grow with confidence.

## Metadata Strategy

### Global defaults

- Default title: `DualGrid — Diseño web, branding y desarrollo digital`
- Title template: `%s | DualGrid`
- Global description: brand positioning centered on clarity, professionalism, trust and strong execution, supported by web design, branding and digital development keywords.

### Writing rules

- Keep titles clear and commercially useful.
- Keep descriptions around 120–160 characters when page-specific metadata is added.
- Prioritize language around clarity, professionalism, trust and growth over generic agency wording.

### Target keywords

Primary ES:

- `diseño web`
- `desarrollo web`
- `branding`
- `identidad visual`
- `sitio web profesional`

Primary EN:

- `web design`
- `web development`
- `branding`
- `visual identity`
- `professional website`

## Canonicals

Canonical URLs are generated with `getBaseUrl()` from `lib/base-url.ts`.

```typescript
import { getBaseUrl } from '@/lib/base-url';

const baseUrl = getBaseUrl();

export const metadata: Metadata = {
  alternates: {
    canonical: `${baseUrl}/page-path`,
  },
};
```

## Open Graph and social sharing

### Global configuration

Global metadata lives in `app/layout.tsx` and uses:

- `openGraph.type = 'website'`
- `openGraph.locale = 'es_ES'`
- `twitter.card = 'summary_large_image'`
- shared image: `/opengraph-image`

### Dynamic Open Graph image

- File: `app/opengraph-image.tsx`
- Renderer: `ImageResponse` from `next/og`
- Size: `1200 × 630`
- Direction: dark neon background, branded glows, premium panel layout and a professional, high-trust positioning.

The site currently uses one high-quality brand-led OG image across the public experience.

## Structured Data

Structured data is injected globally in `app/layout.tsx`.

Current schema types:

- `Organization`
- `WebSite`
- `Service` for web development
- `Service` for visual identity and branding

Descriptions should stay aligned with the same positioning used in the landing copy and metadata.

## Sitemap

- File: `app/sitemap.ts`
- URL: `/sitemap.xml`

Current public entries:

| URL | Priority | Change Frequency |
| --- | -------- | ---------------- |
| `/` | `1.0`    | `weekly`         |

Only real public URLs should be included. Admin and API routes must remain excluded.

## Robots

Defined in `app/robots.ts`.

Rules:

- allow public pages,
- disallow `/admin/`,
- disallow `/api/`,
- expose the sitemap URL.

## Next SEO opportunities

1. Add page-specific metadata if web, branding and hosting get dedicated public pages.
2. Add locale-specific URLs and hreflang if the site later adopts route-based i18n.
3. Add service-specific OG images if each service line becomes its own share target.
4. Connect Google Search Console and track branded vs non-branded search queries.
