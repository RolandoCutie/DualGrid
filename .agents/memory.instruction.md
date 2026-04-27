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
