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
        'relative flex flex-col rounded-2xl border-2 p-7 sm:p-8 transition-all duration-300',
        plan.highlighted
          ? 'border-transparent bg-card shadow-2xl scale-[1.03] glow-primary'
          : 'border-border bg-card hover:border-primary/30 hover:shadow-lg',
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
            {t('plans.popular')}
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
          {plan.name}
        </h3>
        <p className="text-muted-foreground text-sm mt-1">{plan.tagline}</p>
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
            className="text-accent"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          {t('plans.delivery')} {plan.deliveryDays} {t('plans.days')}
        </p>
      </div>

      {/* Features */}
      <ul className="flex-1 space-y-3 mb-8">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-sm text-card-foreground">
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
        onClick={() => onSelect(plan)}
        className={cn(
          'w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer',
          plan.highlighted
            ? 'text-white shadow-md hover:shadow-lg hover:opacity-90'
            : 'border-2 border-border text-card-foreground hover:border-primary/50 hover:text-primary',
        )}
        style={
          plan.highlighted
            ? {
                background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              }
            : undefined
        }
      >
        {plan.ctaLabel}
      </button>
    </div>
  );
}
