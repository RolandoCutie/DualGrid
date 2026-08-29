'use client';

import BrandingQuizModal from '@/components/landing/BrandingQuizModal';
import SectionHeading from '@/components/landing/SectionHeading';
import { DICTS, useLanguage } from '@/components/ui/LanguageProvider';
import Reveal from '@/components/ui/Reveal';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useState } from 'react';

type BrandingPlanId = 'essential' | 'corporate' | 'global';

interface BrandingPlan {
  id: BrandingPlanId;
  price: number;
  highlighted: boolean;
  deliveryDays: string;
  icon: string;
  svgIcon: string;
}

const BRANDING_PLANS: BrandingPlan[] = [
  {
    id: 'essential',
    price: 100,
    highlighted: false,
    deliveryDays: '7',
    icon: '☕',
    svgIcon: '/assets/icons/branding/plan-esencial.svg',
  },
  {
    id: 'corporate',
    price: 300,
    highlighted: true,
    deliveryDays: '20',
    icon: '🏢',
    svgIcon: '/assets/icons/branding/plan-corporativo.svg',
  },
  {
    id: 'global',
    price: 550,
    highlighted: false,
    deliveryDays: '60',
    icon: '🌐',
    svgIcon: '/assets/icons/branding/plan-global.svg',
  },
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
        'relative flex flex-col rounded-2xl border-2 p-7 sm:p-8 transition-all duration-300 h-full',
        plan.highlighted
          ? 'border-transparent bg-card shadow-2xl scale-[1.03] glow-purple'
          : 'border-border bg-card hover:border-primary/30 hover:shadow-lg card-glow-purple',
      )}
      style={
        plan.highlighted
          ? {
              background: `linear-gradient(var(--card), var(--card)) padding-box, linear-gradient(135deg, var(--purple), var(--primary)) border-box`,
              border: '2px solid transparent',
            }
          : undefined
      }
    >
      {/* Popular badge */}
      {plan.highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <span
            className="inline-block px-3 sm:px-5 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white shadow-lg whitespace-nowrap"
            style={{ background: 'linear-gradient(135deg, var(--purple), var(--primary))' }}
          >
            {popularLabel}
          </span>
        </div>
      )}

      {/* Icon + name + tagline */}
      <div className="mb-6">
        <div
          className="w-14 h-14 mb-3 rounded-xl flex items-center justify-center p-2.5"
          style={{
            background: 'color-mix(in srgb, var(--purple) 12%, transparent)',
            border: '1px solid color-mix(in srgb, var(--purple) 22%, transparent)',
          }}
        >
          <Image
            src={plan.svgIcon}
            alt={name}
            width={40}
            height={40}
            className="w-full h-full object-contain"
          />
        </div>
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
          <span className="text-sm text-muted-foreground">USD</span>
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
      <div className="mb-6">
        <div className="flex items-start gap-3 text-sm text-card-foreground leading-relaxed">
          <span
            className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
            style={{ border: '2px solid var(--purple)', color: 'var(--purple)' }}
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
        className={cn(
          'w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer mb-4',
          plan.highlighted
            ? 'text-white shadow-md hover:shadow-lg hover:opacity-90'
            : 'border-2 border-border text-card-foreground hover:border-primary/50 hover:text-primary',
        )}
        style={
          plan.highlighted
            ? { background: 'linear-gradient(135deg, var(--purple), var(--primary))' }
            : undefined
        }
      >
        {ctaLabel}
      </button>

      {/* Expand toggle */}
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

      {/* Features — collapsible */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-500 ease-in-out',
          expanded ? 'max-h-[800px] opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0',
        )}
      >
        <ul className="space-y-3">
          {features?.map((feature, i) => (
            <li
              key={`${plan.id}-${i}`}
              className="flex items-start gap-3 text-sm text-card-foreground"
            >
              <span
                className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                style={{
                  background:
                    'linear-gradient(135deg, color-mix(in srgb, var(--purple) 20%, transparent), color-mix(in srgb, var(--primary) 15%, transparent))',
                }}
              >
                <svg
                  className="w-2.5 h-2.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  style={{ color: 'var(--purple)' }}
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
  );
}

export default function BrandingPlansSection() {
  const [wizardOpen, setWizardOpen] = useState(false);
  const { locale, t } = useLanguage();

  const bp = DICTS[locale].branding_plans as Record<string, string | string[]>;

  return (
    <section
      id="branding"
      className="relative py-24 sm:py-32 overflow-hidden bg-transparent scroll-mt-28 lg:scroll-mt-32"
    >
      {/* Purple glow — top right (branding palette) */}
      <div
        className="absolute -top-32 -right-32 w-[500px] h-[420px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(165,148,249,0.16) 0%, transparent 65%)',
          filter: 'blur(60px)',
        }}
        aria-hidden="true"
      />
      {/* Green glow — bottom left */}
      <div
        className="absolute -bottom-24 -left-16 w-[450px] h-[380px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(0,255,157,0.14) 0%, transparent 65%)',
          filter: 'blur(55px)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <SectionHeading
          eyebrow={t('branding_plans.eyebrow')}
          title={t('branding_plans.section_title')}
          subtitle={t('branding_plans.section_subtitle')}
        />

        {/* Quiz CTA */}
        <Reveal className="mb-14 text-center">
          <button
            onClick={() => setWizardOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-black shadow-md hover:shadow-lg hover:opacity-90 transition-all duration-200 cursor-pointer animate-pulse-glow"
            style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}
          >
            <Image
              src="/assets/icons/branding/test-rapido-dark.svg"
              alt=""
              width={18}
              height={18}
              className="w-4 h-4 object-contain"
            />
            {t('branding_plans.cta_quiz')}
          </button>
        </Reveal>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {BRANDING_PLANS.map((plan) => {
            const features = bp[`${plan.id}_features`] as string[];
            const name = bp[`${plan.id}_name`] as string;
            const tagline = bp[`${plan.id}_tagline`] as string;
            const targetText = bp[`${plan.id}_target`] as string;
            const ctaLabel = bp[`${plan.id}_cta`] as string;

            return (
              <Reveal key={plan.id} className="h-full">
                <BrandingPlanCard
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
              </Reveal>
            );
          })}
        </div>

        {/* Custom note */}
        <Reveal className="mt-12">
          <div className="text-center p-6 rounded-2xl border border-dashed border-border bg-card/40 backdrop-blur-sm">
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
        </Reveal>
      </div>

      <BrandingQuizModal open={wizardOpen} onClose={() => setWizardOpen(false)} />
    </section>
  );
}
