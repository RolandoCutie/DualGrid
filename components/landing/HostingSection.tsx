'use client';

import HostingLeadModal from '@/components/landing/HostingLeadModal';
import SectionHeading from '@/components/landing/SectionHeading';
import { useLanguage } from '@/components/ui/LanguageProvider';
import Reveal from '@/components/ui/Reveal';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useState } from 'react';

type HostingPlanId = 'annual' | 'biennial' | 'triennial' | 'domain_only' | 'hosting_domain';

interface HostingPlan {
  id: HostingPlanId;
  labelKey: string;
  price: number;
  perYear?: boolean;
  highlighted?: boolean;
  features: string[];
  badgeKey?: string;
}

// Maps feature index to its SVG icon in /public/assets/icons/hosting/
const HOSTING_FEATURES = [
  { icon: '/assets/icons/hosting/nvme.svg', labelKey: 'feat_speed' },
  { icon: '/assets/icons/hosting/ssl.svg', labelKey: 'feat_security' },
  { icon: '/assets/icons/hosting/backups.svg', labelKey: 'feat_backup' },
  { icon: '/assets/icons/hosting/cdn.svg', labelKey: 'feat_cdn' },
];

const HOSTING_PLANS: HostingPlan[] = [
  {
    id: 'annual',
    labelKey: 'annual',
    price: 120,
    features: ['feature_nvme', 'feature_ssl', 'feature_backup', 'feature_cdn', 'feature_whatsapp'],
  },
  {
    id: 'biennial',
    labelKey: 'biennial',
    price: 110,

    features: [
      'feature_nvme',
      'feature_ssl',
      'feature_backup',
      'feature_cdn',
      'feature_whatsapp',
      'feature_monitoring',
    ],
  },
  {
    id: 'triennial',
    labelKey: 'triennial',
    price: 100,
    perYear: true,
    highlighted: true,
    badgeKey: 'badge_recommended',
    features: [
      'feature_nvme',
      'feature_ssl',
      'feature_backup',
      'feature_cdn',
      'feature_whatsapp',
      'feature_monitoring',
      'feature_best_price',
    ],
  },
];

export default function HostingSection() {
  const { t } = useLanguage();
  const [selectedPlan, setSelectedPlan] = useState<HostingPlanId | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = (planId: HostingPlanId) => {
    setSelectedPlan(planId);
    setModalOpen(true);
  };

  return (
    <section
      id="hosting"
      className="relative py-24 sm:py-32 px-5 sm:px-6 overflow-hidden bg-transparent scroll-mt-28 lg:scroll-mt-32"
    >
      {/* Cyan glow — top right (tech/server vibe) */}
      <div
        className="absolute -top-20 -right-20 w-[600px] h-[460px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(0,217,255,0.16) 0%, transparent 65%)',
          filter: 'blur(60px)',
        }}
        aria-hidden="true"
      />
      {/* Green glow — bottom left */}
      <div
        className="absolute -bottom-24 -left-20 w-[550px] h-[440px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(0,255,157,0.14) 0%, transparent 65%)',
          filter: 'blur(60px)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <SectionHeading
          eyebrow={t('hosting.eyebrow')}
          title={t('hosting.title')}
          subtitle={t('hosting.subtitle')}
        />

        {/* Features strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10 sm:mb-12">
          {HOSTING_FEATURES.map((f) => (
            <Reveal key={f.labelKey}>
              <div className="flex items-center gap-2 bg-card border border-border rounded-2xl px-4 py-3">
                <Image
                  src={f.icon}
                  alt=""
                  width={20}
                  height={20}
                  className="w-5 h-5 object-contain"
                />
                <span className="text-xs font-medium text-card-foreground">
                  {t(`hosting.${f.labelKey}`)}
                </span>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Hosting plan cards — same visual design as web plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-8 mt-2">
          {HOSTING_PLANS.map((plan) => (
            <Reveal key={plan.id} className="h-full">
              <div
                className={cn(
                  'relative flex flex-col rounded-2xl p-7 sm:p-8 transition-all duration-300 h-full',
                  plan.highlighted
                    ? 'border-2 border-transparent bg-card shadow-2xl scale-[1.03] glow-primary card-glow-primary'
                    : 'gradient-border bg-card hover:shadow-lg card-glow-primary',
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
                {plan.badgeKey && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <span
                      className="inline-block px-3 sm:px-5 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white shadow-lg whitespace-nowrap"
                      style={{
                        background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                      }}
                    >
                      {t(`hosting.${plan.badgeKey}`)}
                    </span>
                  </div>
                )}

                {/* Icon + name + tagline */}
                <div className="mb-6">
                  <div
                    className="w-14 h-14 mb-3 rounded-xl flex items-center justify-center p-2.5"
                    style={{
                      background: 'color-mix(in srgb, var(--primary) 12%, transparent)',
                      border: '1px solid color-mix(in srgb, var(--primary) 22%, transparent)',
                    }}
                  >
                    <svg
                      width="30"
                      height="30"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ color: 'var(--primary)' }}
                      aria-hidden="true"
                    >
                      <rect x="2" y="2" width="20" height="8" rx="2" />
                      <rect x="2" y="14" width="20" height="8" rx="2" />
                      <circle cx="7" cy="6" r="1" fill="currentColor" stroke="none" />
                      <circle cx="7" cy="18" r="1" fill="currentColor" stroke="none" />
                    </svg>
                  </div>
                  <h3
                    className={cn(
                      'text-xl font-extrabold',
                      plan.highlighted ? 'text-gradient' : 'text-card-foreground',
                    )}
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {t(`hosting.plan_${plan.labelKey}`)}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    {plan.perYear
                      ? t('hosting.billed_multi')
                      : `$${plan.price} USD / ${t('hosting.per_year')}`}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-6 pb-6 border-b border-border">
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm text-muted-foreground">{t('plans.from')}</span>
                    <span
                      className={cn(
                        'text-5xl font-extrabold tracking-tight',
                        plan.highlighted ? 'text-gradient' : 'text-card-foreground',
                      )}
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      ${plan.price}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {plan.perYear ? `USD/${t('hosting.per_year')}` : 'USD'}
                    </span>
                  </div>
                  {plan.perYear && (
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
                      {t('hosting.billed_multi')}
                    </p>
                  )}
                </div>

                {/* Feature list */}
                <ul className="space-y-2.5 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-card-foreground">
                      <span
                        className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                        style={{
                          background:
                            'linear-gradient(135deg, color-mix(in srgb, var(--primary) 18%, transparent), color-mix(in srgb, var(--accent) 15%, transparent))',
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
                      {t(`hosting.${f}`)}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={() => openModal(plan.id)}
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
                  {t('hosting.cta')}
                </button>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Domain add-on card */}
        <Reveal>
          <div className="gradient-border relative rounded-[4rem] border border-border bg-card p-7 sm:p-8 transition-all duration-300 card-glow-primary hover:border-primary/30 hover:shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.9fr] gap-8 items-start">
              <div>
                <div className="mb-6">
                  <div
                    className="w-14 h-14 mb-3 rounded-xl flex items-center justify-center p-2.5"
                    style={{
                      background: 'color-mix(in srgb, var(--primary) 12%, transparent)',
                      border: '1px solid color-mix(in srgb, var(--primary) 22%, transparent)',
                    }}
                  >
                    <Image
                      src="/assets/icons/hosting/dominio.svg"
                      alt=""
                      width={40}
                      height={40}
                      className="w-full h-full object-contain shrink-0"
                    />
                  </div>
                  <h3
                    className="text-xl font-extrabold text-card-foreground"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {t('hosting.domain_title')}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
                    {t('hosting.domain_desc')}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['.com', '.net', '.org', '.io', '.es', '.co'].map((ext) => (
                    <span
                      key={ext}
                      className="px-2 py-0.5 bg-muted rounded text-xs font-mono text-muted-foreground"
                    >
                      {ext}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col h-full">
                <div className="mb-6 pb-6 border-b border-border text-left lg:text-center">
                  <p className="text-sm text-muted-foreground">{t('hosting.domain_from')}</p>
                  <div className="flex items-baseline gap-1 lg:justify-center mt-1">
                    <span
                      className="text-5xl font-extrabold tracking-tight text-card-foreground"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      $15
                    </span>
                    <span className="text-sm text-muted-foreground">
                      USD/{t('hosting.per_year')}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-3 mt-auto">
                  <button
                    onClick={() => openModal('domain_only')}
                    className="w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer border-2 border-border text-card-foreground hover:border-primary/50 hover:text-primary"
                  >
                    {t('hosting.domain_cta')}
                  </button>
                  <button
                    onClick={() => openModal('hosting_domain')}
                    className="w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer text-white shadow-md hover:shadow-lg hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}
                  >
                    {t('hosting.hosting_domain_cta')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Trust note */}
        <p className="text-center text-xs text-muted-foreground mt-8">{t('hosting.trust_note')}</p>
      </div>

      <HostingLeadModal
        open={modalOpen}
        initialPlan={selectedPlan}
        onClose={() => setModalOpen(false)}
      />
    </section>
  );
}
