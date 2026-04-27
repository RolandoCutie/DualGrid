# DualGrid – Project Overview

## What the project does

**DualGrid** is a full-stack web development agency platform. It presents DualGrid's services publicly via a professional landing page and provides an internal admin panel to manage clients, contracts, invoices, and questionnaire responses.

---

## Main Features

| Feature | Description |
|---|---|
| **Landing Page** | Hero, plans section, process section, differentials. |
| **Questionnaire Wizard** | 6-step interactive wizard. Collects client info, business type, goals, budget, style, content availability. Recommends a plan automatically. |
| **Plan Recommendation Engine** | Scoring system in `lib/recommendation.ts`. Weights by business type, budget, goals, desired pages. |
| **Plans Catalog** | 5 plans defined in `lib/plans.ts`: Landing, Menú QR, Portfolio, Restaurant, Custom. |
| **Admin Dashboard** | Protected area. Manages clients, contracts, invoices, questionnaires. |
| **Bilingual UI (i18n)** | EN/ES via `LanguageProvider`. Strings in `app/i18n/[locale].json`. |
| **Dark / Light Mode** | ThemeProvider with CSS variables. |

---

## Business Logic Rules

1. The public CTA opens a 6-step questionnaire wizard modal.
2. The wizard scores answers and recommends one of 5 plans.
3. On submission the questionnaire is saved to MongoDB (`Questionnaire` collection).
4. The admin can view questionnaire submissions, create clients, contracts, and invoices.
5. Invoice numbers auto-increment with format `DG-0001`.
6. Admin access protected by HMAC-SHA256 session tokens via `ADMIN_SECRET_PATH`.

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
