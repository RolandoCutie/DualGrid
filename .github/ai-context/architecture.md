# DualGrid – Architecture

## Folder Structure

```
app/
├── layout.tsx              # Root layout: Inter font, ThemeProvider, LanguageProvider, NavBar, Footer
├── page.tsx                # Home (Server): HeroSection + WhySection + PlansSection + ProcessSection
├── globals.css             # Tailwind v4 + CSS variables design tokens (zinc/indigo palette)
├── manifest.ts             # PWA manifest
├── sitemap.ts / robots.ts
├── i18n/
│   ├── en.json
│   └── es.json
├── constanst/constanst.ts  # SITE_NAME, AUTHOR, DEFAULT_SEO
├── admin/
│   ├── [secret]/page.tsx   # Hidden admin login
│   └── dashboard/
│       ├── page.tsx                        # Dashboard index with 4 cards
│       ├── clients/page.tsx                # Clients list (table)
│       ├── contracts/page.tsx              # Contracts list (table)
│       ├── invoices/page.tsx               # Invoices list (table)
│       └── questionnaires/page.tsx         # Questionnaire submissions list
└── api/
    ├── admin/login|logout|session/route.ts
    ├── clients/route.ts + [id]/route.ts
    ├── contracts/route.ts
    ├── invoices/route.ts
    └── questionnaires/route.ts

components/
├── NavBar.tsx              # Thin server wrapper → NavBarClient
├── NavBarClient.tsx        # Sticky header, DG logo, scroll behavior, mobile menu
├── Footer.tsx              # Simple footer with DualGrid branding
├── landing/
│   ├── HeroSection.tsx     # Hero with CTA that opens QuestionnaireWizard
│   ├── PlansSection.tsx    # Grid of PlanCards
│   ├── PlanCard.tsx        # Single plan card (reusable)
│   ├── ProcessSection.tsx  # 6-step process grid
│   └── WhySection.tsx      # 6 differentials grid
├── questionnaire/
│   ├── QuestionnaireWizard.tsx   # Orchestrates 6 steps + result
│   ├── StepIndicator.tsx         # Progress bar dots + labels
│   └── steps/
│       ├── Step1Contact.tsx      # Name, email, phone, business description
│       ├── Step2Business.tsx     # Business type + online presence
│       ├── Step3Goals.tsx        # Primary goal + desired pages
│       ├── Step4Budget.tsx       # Budget range + deadline + domain
│       ├── Step5Style.tsx        # Visual style (up to 3) + logo + colors
│       ├── Step6Content.tsx      # Photos, texts, extra notes
│       └── StepResult.tsx        # Recommended plan + ranked alternatives
├── admin/
│   ├── AdminLoginForm.tsx
│   ├── AdminPageHeader.tsx       # Title + description + optional action button
│   ├── AdminPageLayout.tsx
│   └── AdminBackButton.tsx
├── shared/                 # (reserved for cross-feature shared components)
└── ui/
    ├── Button.tsx           # CVA variants: primary|secondary|outline|ghost|destructive|link
    ├── Card.tsx             # Simple card wrapper with padding variants
    ├── Badge.tsx            # Status badges (primary|secondary|success|warning|error|outline)
    ├── Input.tsx            # Label + error + hint + leftIcon
    ├── Textarea.tsx         # Label + error + hint
    ├── Select.tsx           # Label + error + options array
    ├── Modal.tsx            # Portal modal with backdrop, ESC close, size variants
    ├── ThemeProvider.tsx
    ├── LanguageProvider.tsx
    ├── LanguageToggle.tsx
    ├── ThemeToggle.tsx
    ├── DateInput.tsx
    ├── ScrollReveal.tsx
    └── RichTextEditor.tsx

database/
├── client.model.ts
├── contract.model.ts
├── invoice.model.ts
├── questionnaire.model.ts
└── index.ts                # Re-exports all models

lib/
├── plans.ts                # PLANS array + PLAN_MAP
├── recommendation.ts       # recommendPlan() scoring function
├── mongodb.ts              # connectDB() with connection cache
├── admin-auth.ts           # HMAC session tokens
├── require-admin-session.ts
├── base-url.ts
└── utils.ts                # cn()

types/
└── index.ts                # All TypeScript interfaces and types

hooks/                      # (reserved for custom hooks)
```

## Key Design Decisions

- Landing is a **Server Component** page; interactive sections are Client Components.
- `QuestionnaireWizard` is fully client-side (no server round-trip until submission).
- All admin routes call `requireAdminSession()` before rendering.
- All admin API routes validate `isAdminSessionTokenValid(token)` before any logic.
- Plan recommendation is a pure scoring function — no AI/ML, simple weight-based rules.
