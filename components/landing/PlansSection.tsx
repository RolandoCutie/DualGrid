'use client';

import SectionHeading from '@/components/landing/SectionHeading';
import QuestionnaireWizard from '@/components/questionnaire/QuestionnaireWizard';
import { DICTS, useLanguage } from '@/components/ui/LanguageProvider';
import Reveal from '@/components/ui/Reveal';
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
    { name: string; tagline: string; features: string[]; ctaLabel: string; target?: string }
  >;
  const translatedPlans: Plan[] = PLANS.map((p) => {
    const tr = plansData[p.id];
    return tr
      ? {
          ...p,
          name: tr.name,
          tagline: tr.tagline,
          features: tr.features,
          ctaLabel: tr.ctaLabel,
          target: tr.target,
        }
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
    <section
      id="planes"
      className="relative py-24 sm:py-32 overflow-hidden bg-transparent scroll-mt-28 lg:scroll-mt-32"
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-6 relative z-10">
        <SectionHeading
          eyebrow={t('plans.eyebrow')}
          title={t('plans.section_title')}
          subtitle={t('plans.section_subtitle')}
        />

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {translatedPlans.map((plan) => (
            <Reveal key={plan.id} className="h-full">
              <PlanCard plan={plan} onSelect={handleSelectPlan} />
            </Reveal>
          ))}
        </div>

        {/* Custom note */}
        <div className="gradient-border mt-12 text-center p-5 sm:p-6 rounded-2xl border border-dashed border-border bg-card/40 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
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
