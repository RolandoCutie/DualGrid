'use client';

import HostingLeadModal from '@/components/landing/HostingLeadModal';
import { useLanguage } from '@/components/ui/LanguageProvider';
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
    ],
  },
  {
    id: 'triennial',
    labelKey: 'triennial',
    price: 100,
    perYear: true,
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
    <section className="py-20 px-4 relative overflow-hidden bg-muted/10 dark:bg-transparent">
      {/* Cyan glow — top right (tech/server vibe) */}
      <div
        className="absolute -top-20 -right-20 w-[650px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(0,217,255,0.22) 0%, transparent 65%)',
          filter: 'blur(60px)',
        }}
        aria-hidden="true"
      />
      {/* Green glow — bottom left */}
      <div
        className="absolute -bottom-24 -left-20 w-[600px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(0,255,157,0.20) 0%, transparent 65%)',
          filter: 'blur(65px)',
        }}
        aria-hidden="true"
      />
      {/* Purple subtle glow — bottom right */}
      <div
        className="absolute bottom-0 right-1/4 w-[350px] h-[300px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(165,148,249,0.10) 0%, transparent 65%)',
          filter: 'blur(55px)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-widest text-primary uppercase mb-3">
            {t('hosting.eyebrow')}
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t('hosting.title')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            {t('hosting.subtitle')}
          </p>
        </div>

        {/* Features strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12">
          {HOSTING_FEATURES.map((f) => (
            <div
              key={f.labelKey}
              className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-3"
            >
              <Image src={f.icon} alt="" width={20} height={20} className="w-5 h-5 object-contain" />
              <span className="text-xs font-medium text-card-foreground">{t(`hosting.${f.labelKey}`)}</span>
            </div>
          ))}
        </div>

        {/* Hosting plan cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          {HOSTING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                'relative rounded-2xl border bg-card p-6 flex flex-col transition-shadow hover:shadow-lg',
                plan.highlighted ? 'border-primary shadow-md shadow-primary/10' : 'border-border',
              )}
            >
              {plan.badgeKey && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                  {t(`hosting.${plan.badgeKey}`)}
                </span>
              )}

              <p className="text-xs font-bold tracking-widest text-primary uppercase mb-1">
                {t(`hosting.plan_${plan.labelKey}`)}
              </p>
              <div className="mb-4">
                <span className="text-4xl font-bold text-foreground">${plan.price}</span>
                <span className="text-muted-foreground text-sm ml-1">
                  {plan.perYear ? `USD/${t('hosting.per_year')}` : `USD/${t('hosting.per_year')}`}
                </span>
                {plan.perYear && (
                  <p className="text-xs text-muted-foreground mt-1">{t('hosting.billed_multi')}</p>
                )}
              </div>

              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-card-foreground">
                    <span className="text-primary text-base">✓</span>
                    {t(`hosting.${f}`)}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => openModal(plan.id)}
                className={cn(
                  'w-full py-2.5 rounded-xl text-sm font-semibold transition-colors',
                  plan.highlighted
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'border border-border text-card-foreground hover:bg-muted/50',
                )}
              >
                {t('hosting.cta')}
              </button>
            </div>
          ))}
        </div>

        {/* Domain add-on card */}
        <div className="rounded-2xl border border-border bg-card p-6 flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Image
                src="/assets/icons/hosting/dominio.svg"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6 object-contain shrink-0"
              />
              <h3 className="text-base font-bold text-card-foreground">
                {t('hosting.domain_title')}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('hosting.domain_desc')}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
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
          <div className="flex flex-col items-center gap-3 shrink-0">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">{t('hosting.domain_from')}</p>
              <span className="text-3xl font-bold text-foreground">$15</span>
              <span className="text-muted-foreground text-sm ml-1">
                USD/{t('hosting.per_year')}
              </span>
            </div>
            <button
              onClick={() => openModal('domain_only')}
              className="px-6 py-2 rounded-xl border border-primary text-primary text-sm font-semibold hover:bg-primary/10 transition-colors"
            >
              {t('hosting.domain_cta')}
            </button>
            <button
              onClick={() => openModal('hosting_domain')}
              className="px-6 py-2 rounded-xl bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors"
            >
              {t('hosting.hosting_domain_cta')}
            </button>
          </div>
        </div>

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
