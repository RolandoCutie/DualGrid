'use client';

import { Button } from '@/components/ui/Button';
import { DICTS, useLanguage } from '@/components/ui/LanguageProvider';
import { PLAN_MAP } from '@/lib/plans';
import { cn } from '@/lib/utils';
import type { PlanId } from '@/types';

// ─── Helper: renders a plan card identical to the homepage PlanCard ───────────
function ResultPlanCard({
  planId,
  isRecommended,
  onSelect,
}: {
  planId: PlanId;
  isRecommended: boolean;
  onSelect?: () => void;
}) {
  const { locale, t } = useLanguage();
  const plansData = DICTS[locale].plans_data as Record<
    string,
    { name: string; tagline: string; features: string[]; ctaLabel: string }
  >;
  const plan = PLAN_MAP[planId];
  const planTr = plansData[planId];
  if (!plan || !planTr) return null;

  return (
    <div
      className={cn(
        'relative flex flex-col rounded-2xl border-2 p-7 transition-all duration-300',
        isRecommended
          ? 'border-transparent bg-card shadow-2xl scale-[1.02] glow-primary'
          : 'border-border bg-card',
      )}
      style={
        isRecommended
          ? {
              background: `linear-gradient(var(--card), var(--card)) padding-box, linear-gradient(135deg, var(--primary), var(--accent)) border-box`,
              border: '2px solid transparent',
            }
          : undefined
      }
    >
      {/* Recommended badge */}
      {isRecommended && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span
            className="px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-lg"
            style={{
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
            }}
          >
            {t('questionnaire.result_badge')}
          </span>
        </div>
      )}

      {/* Plan name & tagline */}
      <div className="mb-6">
        <h3
          className={cn(
            'text-xl font-extrabold',
            isRecommended ? 'text-gradient' : 'text-card-foreground',
          )}
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {planTr.name}
        </h3>
        <p className="text-muted-foreground text-sm mt-1">{planTr.tagline}</p>
      </div>

      {/* Price */}
      <div className="mb-6 pb-6 border-b border-border">
        <div className="flex items-baseline gap-1">
          <span className="text-sm text-muted-foreground">{t('plans.from')}</span>
          <span
            className={cn(
              'text-5xl font-extrabold tracking-tight',
              isRecommended ? 'text-gradient' : 'text-card-foreground',
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
        {planTr.features.map((feature) => (
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

      {/* CTA */}
      {onSelect && (
        <Button
          size="lg"
          onClick={onSelect}
          className={cn('w-full font-bold', !isRecommended && 'variant-outline')}
        >
          {t('questionnaire.result_cta')} →
        </Button>
      )}
    </div>
  );
}

// ─── Main exported component ──────────────────────────────────────────────────

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
  const { t } = useLanguage();

  const firstName = clientName.split(' ')[0];

  // Top 2 alternatives (excluding recommended), sorted by score
  const alternatives = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .filter(([id]) => id !== recommendedPlan)
    .slice(0, 2)
    .map(([id]) => id as PlanId)
    .filter((id) => PLAN_MAP[id]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3
          className="text-2xl font-extrabold text-card-foreground"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {firstName
            ? t('questionnaire.result_found_name').replace('{name}', firstName)
            : t('questionnaire.result_found')}
        </h3>
        <p className="text-muted-foreground mt-1 text-sm">{t('questionnaire.result_subtitle')}</p>
      </div>

      {/* Recommended plan — same visual as homepage PlanCard */}
      <ResultPlanCard planId={recommendedPlan} isRecommended onSelect={onContactClick} />

      {/* Alternatives */}
      {alternatives.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            {t('questionnaire.result_alternatives_title')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {alternatives.map((id) => (
              <ResultPlanCard key={id} planId={id} isRecommended={false} />
            ))}
          </div>
        </div>
      )}

      <p className="text-center text-xs text-muted-foreground">{t('questionnaire.done_wait')}</p>
    </div>
  );
}
