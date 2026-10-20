---
applyTo: '**'
---

# Coding Preferences
- Next.js 16.1.6 with App Router (Server Components by default)
- TypeScript 5 with strict mode
- Tailwind CSS 4 for styling
- Performance-first: eliminate waterfalls, optimize bundle size
- Follow Vercel React best practices

# Project Architecture
- `/app` - Next.js App Router pages and layouts
- `/components` - Reusable React components
- `/database` - Database models (MongoDB with Mongoose)
- `/lib` - Utilities, constants, and shared logic
- API routes in `/app/api`

# Solutions Repository
- **Data fetching in Server Components**: Always use `cache: 'no-store'` or `revalidate` option in fetch to avoid blocking rendering
- **Streaming with Suspense**: Wrap async data fetching in separate components with `<Suspense>` boundary for instant page loads
- **External images**: Add domains to `remotePatterns` in `next.config.ts` (already configured: res.cloudinary.com, images.unsplash.com)
- **Typo patterns**: Watch for `lenght` → `length` and `Cant` → `Can't`
- **React Compiler**: No direct `setState` inside `useEffect` body — triggers cascading render warning. Move state resets into event handlers or callbacks
- **CarCard design**: Category-level card with colored banner (categoryColor), auto-rotating car model carousel (3 desktop / 1 mobile), specs row with icons, price badge. Cars cycle every 2s
- **Admin PDF exports**: Use server-only routes under `/app/api/.../[id]/pdf/route.ts` with `isAdminSessionTokenValid` + `renderToBuffer` from `@react-pdf/renderer`, then return `application/pdf` with `Content-Disposition` attachment
- **Landing split into multi-page IA**: Move dense single-page sections into dedicated routes (`/services`, `/about`) and update shared components (navbar, footer, CTA cards) to route-first links (`/route#anchor`) with local smooth-scroll fallback only when already on that route
- **Admin UI isolation**: Hide public chrome (header/footer) on `/admin*` routes and use `app/admin/layout.tsx` for admin-only controls; add a two-step exit button to prevent accidental navigation back to the public site
