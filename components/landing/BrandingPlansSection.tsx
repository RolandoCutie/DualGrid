'use client';

import BrandingQuizModal from '@/components/landing/BrandingQuizModal';
import { DICTS, useLanguage } from '@/components/ui/LanguageProvider';
import { cn } from '@/lib/utils';
import { useState } from 'react';

type BrandingPlanId = 'essential' | 'corporate' | 'global';

interface BrandingPlan {
  id: BrandingPlanId;
  price: number;
  highlighted: boolean;
  deliveryDays: string;
  icon: string;
}

const BRANDING_PLANS: BrandingPlan[] = [
  { id: 'essential', price: 100, highlighted: false, deliveryDays: '7', icon: '☕' },
  { id: 'corporate', price: 300, highlighted: true, deliveryDays: '20', icon: '🏢' },
  { id: 'global', price: 550, highlighted: false, deliveryDays: '60', icon: '🌐' },
];

interface BrandingPlanCardProps {
  plan: BrandingPlan;
  name: string;
  tagline: string;
  targetText: string;
  features: string[];
  ctaLabel: string;
  seeLabel: string;
  hideLabel: string;
  fromLabel: string;
  popularLabel: string;
  deliveryLabel: string;
  daysLabel: string;
  onCta: () => void;
}

function BrandingPlanCard({
  plan,
  name,
  tagline,
  targetText,
  features,
  ctaLabel,
  seeLabel,
  hideLabel,
  fromLabel,
  popularLabel,
  deliveryLabel,
  daysLabel,
  onCta,
}: BrandingPlanCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={cn(
        'relative flex flex-col rounded-2xl transition-all duration-300',
        plan.highlighted ? 'plan-card-highlight shadow-2xl scale-[1.03]' : 'hover:shadow-xl',
      )}
      style={
        plan.highlighted
          ? {
              background: `linear-gradient(var(--card), var(--card)) padding-box, linear-gradient(135deg, var(--primary), var(--accent)) border-box`,
              border: '1.5px solid transparent',
            }
          : {
              background: 'var(--card)',
              border: '1.5px solid var(--border)',
            }
      }
    >
      {/* Popular badge */}
      {plan.highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <span
            className="px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-black shadow-lg"
            style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}
          >
            {popularLabel}
          </span>
        </div>
      )}

      <div className="p-7 sm:p-8 flex flex-col flex-1">
        {/* Icon + Plan name + tagline */}
        <div className="mb-5">
          <div className="text-3xl mb-3">{plan.icon}</div>
          <h3
            className={cn(
              'text-xl font-extrabold mb-1',
              plan.highlighted ? 'text-gradient' : 'text-card-foreground',
            )}
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {name}
          </h3>
          <p className="text-muted-foreground text-sm">{tagline}</p>
        </div>

        {/* Price */}
        <div className="mb-5 pb-5 border-b border-border">
          <div className="flex items-baseline gap-1">
            <span className="text-sm text-muted-foreground">{fromLabel}</span>
            <span
              className={cn(
                'text-5xl font-extrabold tracking-tight',
                plan.highlighted ? 'text-gradient' : 'text-card-foreground',
              )}
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              ${plan.price}
            </span>
            <span className="text-sm font-semibold text-muted-foreground">USD</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-accent shrink-0"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {deliveryLabel} {plan.deliveryDays} {daysLabel}
          </p>
        </div>

        {/* Ideal para */}
        <div className="mb-6 text-card-foreground">
          <div className="flex items-start gap-3 text-sm leading-relaxed">
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
              style={{
                border: '2px solid var(--purple)',
                color: 'var(--purple)',
              }}
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <span>{targetText}</span>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={onCta}
          className="w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer mb-4 hover:opacity-90"
          style={{
            border: '2px solid var(--purple)',
            color: 'var(--card-foreground)',
            background: 'transparent',
          }}
        >
          {ctaLabel}
        </button>

        {/* Collapsible features toggle */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center justify-between w-full text-sm font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer py-1 px-1 rounded-lg hover:bg-primary/5"
          aria-expanded={expanded}
        >
          <span
            className="underline underline-offset-2"
            style={{ textDecorationColor: 'color-mix(in srgb, var(--primary) 50%, transparent)' }}
          >
            {expanded ? hideLabel : seeLabel}
          </span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className={cn('shrink-0 transition-transform duration-300', expanded && 'rotate-180')}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {/* Features list — collapsible */}
        <div
          className={cn(
            'overflow-hidden transition-all duration-500 ease-in-out',
            expanded ? 'max-h-[800px] opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0',
          )}
        >
          <ul className="space-y-3">
            {features?.map((feature, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-card-foreground">
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{
                    background:
                      'linear-gradient(135deg, color-mix(in srgb, var(--primary) 18%, transparent), color-mix(in srgb, var(--accent) 18%, transparent))',
                  }}
                >
                  <svg
                    className="w-2.5 h-2.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    style={{ color: 'var(--primary)' }}
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function BrandingPlansSection() {
  const [wizardOpen, setWizardOpen] = useState(false);
  const { locale, t } = useLanguage();

  const bp = DICTS[locale].branding_plans as Record<string, string | string[]>;

  return (
    <section
      id="branding"
      className="py-24 bg-muted/30 dark:bg-transparent relative overflow-hidden"
    >
      {/* Orb 1 — purple dominant top-right (branding palette) */}
      <div
        className="absolute -top-32 -right-32 w-[650px] h-[650px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--purple) 9%, transparent) 0%, transparent 65%)',
          filter: 'blur(90px)',
        }}
        aria-hidden="true"
      />
      {/* Orb 2 — accent (green) bottom-left */}
      <div
        className="absolute -bottom-24 -left-16 w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--accent) 8%, transparent) 0%, transparent 65%)',
          filter: 'blur(75px)',
        }}
        aria-hidden="true"
      />
      {/* Orb 3 — primary (cyan) center-left diffuse */}
      <div
        className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[340px] h-[340px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--primary) 5%, transparent) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        aria-hidden="true"
      />
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="section-badge mx-auto mb-4">{t('branding_plans.eyebrow')}</div>
          <h2
            className="text-3xl sm:text-5xl font-extrabold text-card-foreground mt-2 mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {t('branding_plans.section_title')}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            {t('branding_plans.section_subtitle')}
          </p>

          <button
            onClick={() => setWizardOpen(true)}
            className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-black shadow-md hover:shadow-lg hover:opacity-90 transition-all duration-200 cursor-pointer"
            style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}
          >
            <span>🎨</span>
            {t('branding_plans.cta_quiz')}
          </button>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {BRANDING_PLANS.map((plan) => {
            const features = bp[`${plan.id}_features`] as string[];
            const name = bp[`${plan.id}_name`] as string;
            const tagline = bp[`${plan.id}_tagline`] as string;
            const targetText = bp[`${plan.id}_target`] as string;
            const ctaLabel = bp[`${plan.id}_cta`] as string;

            return (
              <BrandingPlanCard
                key={plan.id}
                plan={plan}
                name={name}
                tagline={tagline}
                targetText={targetText}
                features={features}
                ctaLabel={ctaLabel}
                seeLabel={t('branding_plans.see_features')}
                hideLabel={t('branding_plans.hide_features')}
                fromLabel={t('branding_plans.from')}
                popularLabel={t('branding_plans.popular')}
                deliveryLabel={t('plans.delivery')}
                daysLabel={t('plans.days')}
                onCta={() => setWizardOpen(true)}
              />
            );
          })}
        </div>

        {/* Custom note */}
        <div className="mt-12 text-center p-6 rounded-2xl border border-dashed border-border">
          <p className="text-muted-foreground text-sm">
            {t('branding_plans.custom_note')}{' '}
            <button
              onClick={() => setWizardOpen(true)}
              className="text-primary font-semibold hover:underline cursor-pointer"
            >
              {t('branding_plans.custom_link')}
            </button>{' '}
            {t('branding_plans.custom_suffix')}
          </p>
        </div>
      </div>

      <BrandingQuizModal open={wizardOpen} onClose={() => setWizardOpen(false)} />
    </section>
  );
}
