'use client';

import QuestionnaireWizard from '@/components/questionnaire/QuestionnaireWizard';
import { DICTS, useLanguage } from '@/components/ui/LanguageProvider';
import { PLANS } from '@/lib/plans';
import type { Plan, PlanId } from '@/types';
import { useState } from 'react';
import PlanCard from './PlanCard';

export default function PlansSection() {
  const [wizardOpen, setWizardOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanId | undefined>(undefined);
  const { locale, t } = useLanguage();

  // Merge base plan structure (price, deliveryDays, highlighted) with translated content
  const plansData = DICTS[locale].plans_data as Record<
    string,
    { name: string; tagline: string; features: string[]; ctaLabel: string }
  >;
  const translatedPlans: Plan[] = PLANS.map((p) => {
    const tr = plansData[p.id];
    return tr
      ? { ...p, name: tr.name, tagline: tr.tagline, features: tr.features, ctaLabel: tr.ctaLabel }
      : p;
  });

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan.id);
    setWizardOpen(true);
  };

  const handleOpenGeneric = () => {
    setSelectedPlan(undefined);
    setWizardOpen(true);
  };

  return (
    <section id="planes" className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="section-badge mx-auto mb-4">{t('plans.eyebrow')}</div>
          <h2
            className="text-3xl sm:text-5xl font-extrabold text-card-foreground mt-2 mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {t('plans.title')}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">{t('plans.subtitle')}</p>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {translatedPlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} onSelect={handleSelectPlan} />
          ))}
        </div>

        {/* Custom note */}
        <div className="mt-12 text-center p-6 rounded-2xl border border-dashed border-border">
          <p className="text-muted-foreground text-sm">
            {t('plans.custom_note')}{' '}
            <button
              onClick={handleOpenGeneric}
              className="text-primary font-semibold hover:underline cursor-pointer"
            >
              {t('plans.custom_link')}
            </button>{' '}
            {t('plans.custom_suffix')}
          </p>
        </div>
      </div>

      <QuestionnaireWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        selectedPlan={selectedPlan}
      />
    </section>
  );
}
