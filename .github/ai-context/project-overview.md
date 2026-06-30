# DualGrid – Project Overview

## What the project does

**DualGrid** is a full-stack web development agency platform. It presents DualGrid's services publicly via a professional landing page and provides an internal admin panel to manage clients, contracts, invoices, and questionnaire responses.

---

## Main Features

| Feature                        | Description                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Landing Page**               | Hero, plans section, process section, differentials. Dark mode now uses a cinematic multi-layer neon gradient background across all landing sections.                                                                                                                                                                                                                                                                       |
| **Questionnaire Wizard**       | 6-step interactive wizard. Collects: contact info (+ referral source), business type/age/services, goals + CTA action + differentiation, budget/timeline/CMS needs/success definition, visual style + feeling, content + experience + concerns. Recommends a plan automatically.                                                                                                                                            |
| **Plan Recommendation Engine** | Scoring system in `lib/recommendation.ts`. Weights by business type, budget, goals, desired pages, CMS need, primary action, and business age.                                                                                                                                                                                                                                                                              |
| **Plans Catalog**              | 8 plans in `lib/plans.ts`: Menú QR, Landing, Blog, Portfolio, Restaurante Pro, Empresarial, Tienda Online, Custom. Each plan now carries a `detailedFeatures: PlanFeatureEntry[]` matrix that explicitly marks every questionnaire option as included/excluded, with quantity limits (e.g. "2 formularios", "30 proyectos") and upgrade notes. Used internally by the team to enforce scope and avoid scope-creep disputes. |
| **Admin Dashboard**            | Protected area. Manages clients, contracts, invoices, questionnaires and branding questionnaires.                                                                                                                                                                                                                                                                                                                           |
| **Questionnaire PDF Export**   | Admin can export detailed PDF reports for both website questionnaires and branding questionnaires from their detail pages. PDF generation uses server-side React PDF and admin-protected API routes.                                                                                                                                                                                                                        |
| **Branding Questionnaire**     | 4-question scoring quiz (A/B/C per question). Recommends one of 3 branding plans: Grid Essential ($100), Grid Corporate ($300), Grid Ecosystem ($550). Admin creates shareable token links and sends them to clients via WhatsApp. Results stored in `BrandingQuestionnaire` collection.                                                                                                                                    |
| **Bilingual UI (i18n)**        | EN/ES via `LanguageProvider`. Strings in `app/i18n/[locale].json`.                                                                                                                                                                                                                                                                                                                                                          |
| **Dark / Light Mode**          | ThemeProvider with CSS variables.                                                                                                                                                                                                                                                                                                                                                                                           |

---

## Business Logic Rules

1. The public CTA opens a 6-step questionnaire wizard modal.
2. The wizard scores answers and recommends one of 8 plans.
3. On submission the questionnaire is saved to MongoDB (`Questionnaire` collection) with all 30+ answer fields.
4. The admin can view ALL questionnaire fields (contact, business age, services, audience, features, CMS needs, success definition, visual feeling, social media, concerns, score breakdown).
5. A questionnaire can be converted into a Client record via `POST /api/questionnaires/[id]/convert` — auto-marks questionnaire status as 'contacted'.
6. Questionnaire list has client-side status filter (new / reviewed / contacted).
7. Invoice numbers auto-increment with format `DG-0001`.
8. Invoices track `paidAt` (date) and `paymentMethod` (cash/bank_transfer/paypal/card/crypto/other).
9. Contracts track `paidAmount` (amount actually received, default 0) alongside `advanceAmount`.
10. Contract `planId` supports all 8 plan types: landing, portfolio, menu_qr, restaurant, wp_business, ecommerce_store, blog, custom.
11. Admin access protected by HMAC-SHA256 session tokens via `ADMIN_SECRET_PATH`.
12. Dashboard shows: clients, active contracts, new leads (unreviewed questionnaires), paid revenue, pending revenue (with overdue highlight), net profit (paid revenue − expenses).
13. Branding questionnaire logic in `lib/branding-recommendation.ts`: Q4 (budget) acts as a hard filter. Budget A → Essential, C → Global, B → Corporate (unless strong global majority). Stored in `dualgrid_branding_questionnaires` collection.
14. Admin can export both questionnaire types to PDF via `/api/questionnaires/[id]/pdf` and `/api/branding-questionnaires/[id]/pdf` (admin session required).
15. PDF API routes cast React PDF elements using `React.ReactElement<DocumentProps>` to satisfy strict TypeScript checks during production build.
16. All models include `deletedAt?: Date` for soft delete — DELETE routes set this field instead of physically removing documents; GET routes filter `{ deletedAt: null }`.
17. Invoice numbers are generated atomically using a `Counter` collection (`database/counter.model.ts`) with `$inc` to prevent race conditions in concurrent scenarios.
18. All admin API routes validate request bodies with Zod schemas (`lib/schemas.ts`) before touching the database.
19. GET list endpoints support pagination via `?page=&limit=` query params. Default limit: 50. Max: 100.
20. `Contract.paidAmount` is auto-synced from paid invoices via a `post('save')` hook on the Invoice model.

---

## Environment Variables Required

```env
MONGODB_URI=                  # MongoDB connection string
ADMIN_USERNAME=               # Admin login username
ADMIN_PASSWORD=               # Admin login password
ADMIN_SESSION_SECRET=         # HMAC signing secret
ADMIN_SECRET_PATH=            # Hidden admin login URL segment
NEXT_PUBLIC_WHATSAPP_PHONE=   # WhatsApp number for questionnaire CTA
NEXT_PUBLIC_BASE_URL=         # Canonical base URL
```
