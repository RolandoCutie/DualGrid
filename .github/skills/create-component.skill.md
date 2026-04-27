# Skill: Create a New Component

Use this skill when adding a shared UI component to CubaWay.

---

## Pre-Checks

1. Read `.github/ai-context/architecture.md` for the component hierarchy.
2. Confirm no similar component already exists — reuse before creating.
3. Decide: is this a **shared component** (`components/`) or a **UI primitive** (`components/ui/`)?
   - Shared component: has domain logic, renders car data, admin forms, etc.
   - UI primitive: generic utility — providers, animation wrappers, toggles, icon buttons.

---

## Server vs Client Decision

```
Does the component use React hooks (useState, useEffect, useRef…)?
  YES → Add 'use client' directive
  NO  → Default Server Component — no directive needed

Does it use browser APIs (localStorage, window, document…)?
  YES → Add 'use client' directive

Does it need the useLanguage() i18n hook?
  YES → Add 'use client' directive
```

---

## Template — Client Component

```tsx
// components/MyComponent.tsx
'use client';

import { cn } from '@/lib/utils';
import { useLanguage } from '@/components/ui/LanguageProvider';

// ── Types ─────────────────────────────────────────────────────────────────────
export interface MyComponentProps {
  title: string;
  className?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function MyComponent({ title, className }: MyComponentProps) {
  const { t } = useLanguage();

  return (
    <div className={cn('rounded-xl bg-card border border-border p-4 shadow-sm', className)}>
      <h2 className="text-lg font-bold text-foreground">{title}</h2>
      <p className="text-sm text-muted-foreground">{t('component.description')}</p>
    </div>
  );
}
```

## Template — Server Component

```tsx
// components/StaticBanner.tsx
import { cn } from '@/lib/utils';

interface StaticBannerProps {
  message: string;
  className?: string;
}

export default function StaticBanner({ message, className }: StaticBannerProps) {
  return (
    <div className={cn('bg-primary text-primary-foreground rounded-lg px-4 py-2', className)}>
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
```

## Template — Server Wrapper + Client Implementation

Use when the component needs RSC benefits at the parent level but has interactive children.

```tsx
// components/FancyWidget.tsx  ← Server wrapper
import FancyWidgetClient from './FancyWidgetClient';

const FancyWidget = () => <FancyWidgetClient />;

export default FancyWidget;
```

```tsx
// components/FancyWidgetClient.tsx  ← Client implementation
'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function FancyWidgetClient() {
  const [open, setOpen] = useState(false);

  return (
    <button
      onClick={() => setOpen(!open)}
      className={cn(
        'rounded-full px-4 py-2 bg-primary text-primary-foreground',
        open && 'opacity-80',
      )}
    >
      Toggle
    </button>
  );
}
```

---

## Styling Rules

```tsx
// ✅ Use semantic design tokens
<div className="bg-card text-card-foreground border border-border rounded-xl shadow-sm">

// ✅ Use cn() for conditional and merged classes
<div className={cn('base-class', isActive && 'active-class', className)}>

// ❌ Never use raw hex colors
<div className="bg-[#ffffff] text-[#111827]">

// ❌ Avoid fixed Tailwind palette colors except in special brand sections
<div className="bg-blue-600">  // Only in hero/brand sections
```

---

## Image Rules

```tsx
// ✅ Always next/image with explicit sizes
import Image from 'next/image';
import { normalizeImageSrc } from '@/lib/utils';

<Image
  src={normalizeImageSrc(imageUrl)}
  alt="Descriptive alt text for accessibility and SEO"
  fill
  className="object-cover"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
/>

// ✅ Static known-size images
<Image src="/icon.png" alt="CubaWay logo" width={120} height={40} />

// ❌ Never raw <img>
<img src={imageUrl} />
```

---

## i18n Rules

```tsx
// ✅ Always use t() for user-visible text
const { t } = useLanguage();
<h1>{t('section.heading')}</h1>

// ✅ Add key to BOTH locale files before using
// app/i18n/en.json → "section.heading": "Heading text"
// app/i18n/es.json → "section.heading": "Texto del encabezado"

// ❌ Never hard-code visible text
<h1>Heading text</h1>
```

---

## Checklist

- [ ] File is in `components/` (domain) or `components/ui/` (primitive)
- [ ] `'use client'` directive added only if truly needed
- [ ] TypeScript interface defined for all props
- [ ] `className?: string` prop accepted and merged with `cn()`
- [ ] Only semantic Tailwind tokens used
- [ ] `next/image` used for all images
- [ ] All user-visible strings go through `t()` from `useLanguage()`
- [ ] i18n keys added to both locale files
- [ ] No `connectDB()` calls — only in Server Components or API routes
