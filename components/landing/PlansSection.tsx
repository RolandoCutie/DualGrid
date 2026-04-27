'use client';

import QuestionnaireWizard from '@/components/questionnaire/QuestionnaireWizard';
import { PLANS } from '@/lib/plans';
import type { Plan } from '@/types';
import { useState } from 'react';
import PlanCard from './PlanCard';

export default function PlansSection() {
  const [wizardOpen, setWizardOpen] = useState(false);

  const handleSelectPlan = (_plan: Plan) => {
    setWizardOpen(true);
  };

  return (
    <section id="planes" className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-14">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
            Planes y precios
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-card-foreground mt-2 mb-4">
            Soluciones para cada tipo de negocio
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Desde landing pages hasta sistemas personalizados. Cada plan incluye diseño único,
            código limpio y soporte post-lanzamiento.
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <PlanCard key={plan.id} plan={plan} onSelect={handleSelectPlan} />
          ))}
        </div>

        {/* Custom note */}
        <div className="mt-12 text-center p-6 rounded-2xl border border-dashed border-border">
          <p className="text-muted-foreground text-sm">
            ¿No encuentras lo que buscas?{' '}
            <button
              onClick={() => setWizardOpen(true)}
              className="text-primary font-semibold hover:underline cursor-pointer"
            >
              Completa el cuestionario
            </button>{' '}
            y te prepararemos una propuesta a medida.
          </p>
        </div>
      </div>

      <QuestionnaireWizard open={wizardOpen} onClose={() => setWizardOpen(false)} />
    </section>
  );
}
