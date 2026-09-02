# DualGrid – Architecture

## Folder Structure

```
app/
├── layout.tsx              # Root layout: Inter font, ThemeProvider, LanguageProvider, NavBar, Footer
├── page.tsx                # Home (Server): HeroSection + WhySection + PlansSection + ProcessSection
├── globals.css             # Tailwind v4 + CSS variables design tokens + dark neon cinematic gradient background
├── manifest.ts             # PWA manifest
├── sitemap.ts / robots.ts
├── i18n/
│   ├── en.json
│   └── es.json
├── constanst/constanst.ts  # SITE_NAME, AUTHOR, DEFAULT_SEO
├── admin/
│   ├── [secret]/page.tsx   # Hidden admin login
│   └── dashboard/
│       ├── page.tsx                        # Dashboard: <DashboardStats> async SC wrapped in <Suspense> (streaming) + menu links
│       ├── clients/page.tsx                # Clients list (soft delete filter)
│       ├── clients/[id]/page.tsx           # Edit client (includes new CRM fields)
│       ├── clients/[id]/overview/page.tsx  # Client 360°: contracts, invoices, expenses, questionnaires, profitability
│       ├── clients/new/page.tsx            # Create client
│       ├── contracts/page.tsx              # Contracts list (soft delete filter)
│       ├── expenses/page.tsx               # Expenses list (soft delete filter)
│       ├── invoices/page.tsx               # Invoices list (soft delete filter)
│       ├── questionnaires/
│           ├── page.tsx                    # Questionnaire list with status filter + text search + pagination
│       │   └── [id]/page.tsx               # Full questionnaire detail: ALL 30+ fields, score breakdown, convert-to-client, AI Prompt Generator, Export (PDF/MD/TXT/JSON/clipboard)
│       └── branding-questionnaires/
│           ├── page.tsx                    # Branding questionnaire list + "Nueva Asignación" button
│           └── [id]/page.tsx               # Branding questionnaire detail: answers, score, notes, PDF export
└── api/
    ├── admin/login|logout|session/route.ts
    ├── clients/route.ts + [id]/route.ts
    ├── contracts/route.ts + [id]/route.ts
    ├── expenses/route.ts + [id]/route.ts   # ← NEW: GET|POST|PATCH|DELETE gastos
    ├── invoices/route.ts + [id]/route.ts
    ├── questionnaires/
    │   ├── route.ts                        # POST (public submit)
    │   └── [id]/
    │       ├── route.ts                    # GET|PATCH|DELETE (admin)
    │       ├── convert/route.ts            # POST: convert questionnaire → Client record
    │       └── pdf/route.ts                # GET: export questionnaire detail PDF (admin)
    ├── branding-questionnaires/
    │   ├── route.ts                        # GET list (admin) | POST create assignment (admin)
    │   └── [id]/
    │       ├── route.ts                    # GET detail | PATCH adminNotes (admin)
    │       └── pdf/route.ts                # GET: export branding questionnaire PDF (admin)
    └── branding/
        └── [token]/route.ts                # GET by token (public) | PUT submit answers (public)

components/
├── NavBar.tsx              # Thin server wrapper → NavBarClient
├── NavBarClient.tsx        # Sticky header, DG logo, scroll behavior, mobile menu
├── Footer.tsx              # Simple footer with DualGrid branding
├── landing/
│   ├── HeroSection.tsx     # Hero with CTA that opens QuestionnaireWizard (dark mode transparent section to expose global gradient)
│   ├── PlansSection.tsx    # Grid of PlanCards (dark mode transparent section)
│   ├── PlanCard.tsx        # Single web plan card with CTA-first layout + expandable features
│   ├── ProcessSection.tsx  # 6-step process grid (dark mode transparent section)
│   └── WhySection.tsx      # 6 differentials grid (dark mode transparent section)
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
│   ├── AdminBackButton.tsx
│   ├── AdminLoginForm.tsx
│   ├── AdminPageHeader.tsx       # Title + description + optional action button
│   ├── AdminPageLayout.tsx
│   ├── AdminBackButton.tsx
│   ├── AIPromptGenerator.tsx     # Generates Super Prompt for ChatGPT from questionnaire ← NEW
│   ├── QuestionnaireExportButtons.tsx  # PDF/MD/TXT/JSON/clipboard export ← NEW
│   ├── ClientForm.tsx / ClientListClient.tsx
│   ├── ContractForm.tsx / ContractListClient.tsx
│   ├── InvoiceForm.tsx / InvoiceListClient.tsx
│   ├── ExpenseForm.tsx           # Create/edit expense form ← NEW
│   ├── ExpenseListClient.tsx     # Expense table with delete + category filter ← NEW
│   ├── QuestionnaireListClient.tsx # Client-side list with status filter tabs ← NEW
│   ├── QuestionnaireStatusForm.tsx # Change status + admin notes
│   └── ConvertToClientButton.tsx # One-click lead → client conversion ← NEW
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
├── expense.model.ts        # IExpenseDoc: description, amount, category, date, notes ← NEW
├── invoice.model.ts
├── project.model.ts        # IProjectDoc: name, slug, description, category, technologies, images, link, featured, order
├── questionnaire.model.ts
└── index.ts                # Re-exports all models

lib/
├── plans.ts                # PLANS array + PLAN_MAP
├── recommendation.ts       # recommendPlan() scoring function
├── mongodb.ts              # connectDB() with connection cache
├── admin-auth.ts           # HMAC session tokens
├── require-admin-session.ts
├── base-url.ts
├── utils.ts                # cn()
└── pdf/
    ├── ContractPDF.tsx
    ├── InvoicePDF.tsx
    ├── QuestionnairePDF.tsx
    └── BrandingQuestionnairePDF.tsx
API note:
- `app/api/questionnaires/[id]/pdf/route.ts` and `app/api/branding-questionnaires/[id]/pdf/route.ts` cast created elements to `React.ReactElement<DocumentProps>` before `renderToBuffer` for strict TS compatibility.
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
- All anchored landing sections use `scroll-mt-*` classes so `scrollIntoView()` does not hide headings behind the sticky navbar.
- Web, branding, and hosting pricing cards now share the same structural language: top badge, icon block, price divider, CTA placement, collapsible details, and outer glow on hover.
- Landing cards now use a unified hover treatment with `gradient-border` (border-only neon ring, no background fill) and a softer `rounded-[4rem]` radius for principal card surfaces, with compact supporting cards using slightly smaller radii where needed.
- Informational sections (`HeroSection`, `AboutSection`, `ServicesOverview`) now reuse local SVG assets from `public/assets/icons/*` wherever possible so iconography stays visually consistent with the pricing cards and the rest of the landing.
