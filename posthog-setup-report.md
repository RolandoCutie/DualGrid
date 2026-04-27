# PostHog post-wizard report

The wizard has completed a deep integration of your Next.js 16 App Router project with PostHog analytics. The integration uses the modern `instrumentation-client.ts` approach (recommended for Next.js 15.3+), which provides lightweight client-side initialization without the need for a provider wrapper component. A reverse proxy is configured via Next.js rewrites to improve tracking reliability by avoiding ad blockers. A server-side PostHog singleton (`lib/posthog-server.ts`) is used in API routes to capture backend events with `posthog-node`.

In this update, three new server-side reservation events were added to close the gap between client-side rental scheduling and backend confirmation tracking.

## Events

| Event Name | Description | File |
|------------|-------------|------|
| `category_details_viewed` | User clicks 'View Details' on a category card to open the car modal | `components/CarCard.tsx` |
| `category_rental_scheduled` | User clicks 'Schedule Rental' and is redirected to WhatsApp to book a car | `components/CarModal.tsx` |
| `category_filter_applied` | User applies a filter in the car catalog (category, transmission, fuel type, price, seats) | `components/FilterBar.tsx` |
| `category_filter_applied` | User selects a car category filter on the home page | `components/FilterBarHome.tsx` |
| `admin_logged_in` | Admin successfully logs in via the login form (client-side identify + capture) | `components/admin/AdminLoginForm.tsx` |
| `admin_logged_out` | Admin logs out from the navbar (capture + posthog.reset()) | `components/NavBarClient.tsx` |
| `admin_login` | Server-side: Admin login API call succeeds, server-side identify and event capture | `app/api/admin/login/route.ts` |
| `car_created` | Server-side: A new car is created successfully via the admin API | `app/api/cars/route.ts` |
| `car_deleted` | Server-side: A car is deleted successfully via the admin API | `app/api/cars/[slug]/route.ts` |
| `reserve_created` | Server-side: A new car reservation is created when a customer schedules via WhatsApp | `app/api/reserves/route.ts` |
| `reserve_confirmed` | Server-side: Admin marks a reservation as confirmed | `app/api/reserves/[id]/route.ts` |
| `reserve_deleted` | Server-side: Admin deletes a reservation | `app/api/reserves/[id]/route.ts` |

## Files Modified/Created

| File | Change |
|------|--------|
| `instrumentation-client.ts` | Pre-existing — PostHog client-side initialization with `capture_exceptions: true` |
| `next.config.ts` | Pre-existing — Reverse proxy rewrites for PostHog already configured |
| `.env.local` | Updated — `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` |
| `lib/posthog-server.ts` | Pre-existing — Server-side PostHog singleton using `posthog-node` |
| `components/CarCard.tsx` | Pre-existing — `category_details_viewed` capture on "View Details" click |
| `components/CarModal.tsx` | Pre-existing — `category_rental_scheduled` capture on "Schedule Rental" click |
| `components/FilterBar.tsx` | Pre-existing — `category_filter_applied` capture on each filter change |
| `components/FilterBarHome.tsx` | Pre-existing — `category_filter_applied` capture on category selection |
| `components/admin/AdminLoginForm.tsx` | Pre-existing — `posthog.identify()` and `admin_logged_in` capture on successful login |
| `components/NavBarClient.tsx` | Pre-existing — `admin_logged_out` capture and `posthog.reset()` on logout |
| `app/api/admin/login/route.ts` | Pre-existing — Server-side identify and `admin_login` capture |
| `app/api/cars/route.ts` | Pre-existing — `car_created` capture after successful car creation |
| `app/api/cars/[slug]/route.ts` | Pre-existing — `car_deleted` capture after successful car deletion |
| `app/api/reserves/route.ts` | **Modified** — Added `reserve_created` server-side event after reserve creation |
| `app/api/reserves/[id]/route.ts` | **Modified** — Added `reserve_confirmed` on admin confirmation and `reserve_deleted` on deletion |

## Next steps

We've built insights and a dashboard for you to keep an eye on user behavior:

### Dashboard
- [Analytics basics](https://us.posthog.com/project/336796/dashboard/1344751)

### Insights
- [Car Views vs Rental Scheduled](https://us.posthog.com/project/336796/insights/CWdxddBH) — Daily trend from viewing a car to scheduling a rental
- [Rental Conversion Funnel](https://us.posthog.com/project/336796/insights/BHZmsUYT) — Funnel from viewing car details to scheduling a rental via WhatsApp
- [Most Used Filters by Type](https://us.posthog.com/project/336796/insights/d2WEmN8G) — Track which filters users apply most frequently
- [Fleet Changes: Cars Created vs Deleted](https://us.posthog.com/project/336796/insights/255eoPgx) — Weekly comparison of cars added and removed from the fleet
- [Admin Login Activity](https://us.posthog.com/project/336796/insights/j6ggxCMW) — Daily admin login trend to monitor dashboard access
- [Reservations: Created vs Confirmed](https://us.posthog.com/project/336796/insights/X1sfgAq7) — Daily trend of reservations created (via WhatsApp) vs confirmed by admin

### Agent skill

A skill folder has been left in your project at `.claude/skills/integration-nextjs-app-router/`. This provides context for further agent development when using Claude Code.
