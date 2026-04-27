'use client';

import { Button } from '@/components/ui/Button';
import { PLAN_MAP } from '@/lib/plans';
import { cn } from '@/lib/utils';
import type { PlanId } from '@/types';

interface StepResultProps {
  recommendedPlan: PlanId;
  scores: Record<PlanId, number>;
  clientName: string;
  onContactClick: () => void;
}

export default function StepResult({
  recommendedPlan,
  scores,
  clientName,
  onContactClick,
}: StepResultProps) {
  const plan = PLAN_MAP[recommendedPlan];
  if (!plan) return null;

  // Sort plans by score descending for display
  const ranked = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([id]) => PLAN_MAP[id as PlanId])
    .filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-primary"
          >
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-card-foreground">
          {clientName ? `¡Perfecto, ${clientName.split(' ')[0]}!` : '¡Perfecto!'}
        </h3>
        <p className="text-muted-foreground mt-2 text-sm">
          Analizamos tus respuestas. Esta es nuestra recomendación:
        </p>
      </div>

      {/* Recommended plan */}
      <div className="rounded-2xl border-2 border-primary bg-primary/5 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Recomendado para ti
            </span>
            <h4 className="text-xl font-bold text-card-foreground mt-1">{plan.name}</h4>
            <p className="text-muted-foreground text-sm mt-1">{plan.tagline}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs text-muted-foreground">Desde</p>
            <p className="text-2xl font-bold text-primary">${plan.price}</p>
            <p className="text-xs text-muted-foreground">USD</p>
          </div>
        </div>
        <ul className="mt-4 space-y-1.5">
          {plan.features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-card-foreground">
              <svg
                className="w-4 h-4 text-primary mt-0.5 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* Other options */}
      {ranked.length > 1 && (
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
            También podrían interesarte
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ranked.slice(1).map((p) => (
              <div
                key={p.id}
                className={cn(
                  'p-3 rounded-xl border border-border',
                  p.id === recommendedPlan && 'hidden',
                )}
              >
                <p className="text-sm font-semibold text-card-foreground">{p.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Desde ${p.price} USD · {p.deliveryDays} días
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 pt-2">
        <Button size="lg" onClick={onContactClick} className="w-full">
          Solicitar propuesta personalizada
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Te contactaremos en menos de 24 horas por WhatsApp o email.
        </p>
      </div>
    </div>
  );
}
