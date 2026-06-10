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
}

const BRANDING_PLANS: BrandingPlan[] = [
  { id: 'essential', price: 100, highlighted: false },
  { id: 'corporate', price: 300, highlighted: true },
  { id: 'global', price: 550, highlighted: false },
];

export default function BrandingPlansSection() {
  const [wizardOpen, setWizardOpen] = useState(false);
  const { locale, t } = useLanguage();

  const bp = DICTS[locale].branding_plans as Record<string, string | string[]>;

  return (
    <section id="branding" className="py-24 bg-muted/30">
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

          {/* CTA quiz button */}
          <button
            onClick={() => setWizardOpen(true)}
            className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white shadow-md hover:shadow-lg hover:opacity-90 transition-all duration-200 cursor-pointer"
            style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}
          >
            <span>🎨</span>
            {t('branding_plans.cta_quiz')}
          </button>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BRANDING_PLANS.map((plan) => {
            const features = bp[`${plan.id}_features`] as string[];
            const name = bp[`${plan.id}_name`] as string;
            const tagline = bp[`${plan.id}_tagline`] as string;
            const ctaLabel = bp[`${plan.id}_cta`] as string;

            return (
              <div
                key={plan.id}
                className={cn(
                  'relative flex flex-col rounded-2xl border-2 p-7 sm:p-8 transition-all duration-300 bg-card',
                  plan.highlighted
                    ? 'shadow-2xl scale-[1.03]'
                    : 'border-border hover:border-primary/30 hover:shadow-lg',
                )}
                style={
                  plan.highlighted
                    ? {
                        background: `linear-gradient(var(--card), var(--card)) padding-box, linear-gradient(135deg, var(--primary), var(--accent)) border-box`,
                        border: '2px solid transparent',
                      }
                    : undefined
                }
              >
                {/* Popular badge */}
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span
                      className="px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-lg"
                      style={{
                        background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                      }}
                    >
                      {t('branding_plans.popular')}
                    </span>
                  </div>
                )}

                {/* Plan name & tagline */}
                <div className="mb-6">
                  <h3
                    className={cn(
                      'text-xl font-extrabold',
                      plan.highlighted ? 'text-gradient' : 'text-card-foreground',
                    )}
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {name}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-1">{tagline}</p>
                </div>

                {/* Price */}
                <div className="mb-6 pb-6 border-b border-border">
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm text-muted-foreground">
                      {t('branding_plans.from')}
                    </span>
                    <span
                      className={cn(
                        'text-5xl font-extrabold tracking-tight',
                        plan.highlighted ? 'text-gradient' : 'text-card-foreground',
                      )}
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      ${plan.price}
                    </span>
                    <span className="text-sm text-muted-foreground">USD</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="flex-1 space-y-3 mb-8">
                  {features?.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm text-card-foreground"
                    >
                      <span
                        className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{
                          background:
                            'linear-gradient(135deg, color-mix(in srgb, var(--primary) 15%, transparent), color-mix(in srgb, var(--accent) 15%, transparent))',
                        }}
                      >
                        <svg
                          className="w-2.5 h-2.5 text-primary"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => setWizardOpen(true)}
                  className={cn(
                    'w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer',
                    plan.highlighted
                      ? 'text-white shadow-md hover:shadow-lg hover:opacity-90'
                      : 'border-2 border-border text-card-foreground hover:border-primary/50 hover:text-primary',
                  )}
                  style={
                    plan.highlighted
                      ? { background: 'linear-gradient(135deg, var(--primary), var(--accent))' }
                      : undefined
                  }
                >
                  {ctaLabel}
                </button>
              </div>
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
