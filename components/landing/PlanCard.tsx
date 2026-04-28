'use client';

import { useLanguage } from '@/components/ui/LanguageProvider';
import { cn } from '@/lib/utils';
import type { Plan } from '@/types';

interface PlanCardProps {
  plan: Plan;
  onSelect: (plan: Plan) => void;
}

export default function PlanCard({ plan, onSelect }: PlanCardProps) {
  const { t } = useLanguage();
  return (
    <div
      className={cn(
        'relative flex flex-col rounded-2xl border-2 p-6 sm:p-8 transition-all duration-300 hover:shadow-xl',
        plan.highlighted
          ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10 scale-[1.02]'
          : 'border-border bg-card hover:border-primary/40',
      )}
    >
      {plan.highlighted && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider shadow">
            {t('plans.popular')}
          </span>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-xl font-bold text-card-foreground">{plan.name}</h3>
        <p className="text-muted-foreground text-sm mt-1">{plan.tagline}</p>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-sm text-muted-foreground">{t('plans.from')}</span>
          <span className="text-4xl font-extrabold text-card-foreground">${plan.price}</span>
          <span className="text-sm text-muted-foreground">USD</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          ⏱ {t('plans.delivery')} {plan.deliveryDays} {t('plans.days')}
        </p>
      </div>

      <ul className="flex-1 space-y-2.5 mb-8">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm text-card-foreground">
            <svg
              className="w-4 h-4 text-primary mt-0.5 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>

      <button
        onClick={() => onSelect(plan)}
        className={cn(
          'w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer',
          plan.highlighted
            ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg'
            : 'border-2 border-border text-card-foreground hover:border-primary hover:text-primary',
        )}
      >
        {plan.ctaLabel}
      </button>
    </div>
  );
}
