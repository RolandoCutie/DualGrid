'use client';

import { useLanguage } from '@/components/ui/LanguageProvider';
import { cn } from '@/lib/utils';
import type { Plan } from '@/types';
import Image from 'next/image';
import { useState } from 'react';

// Map plan ID to its SVG icon in public/assets/icons/planes/
const PLAN_ICONS: Record<string, string> = {
  menu_qr: '/assets/icons/planes/menu-qr.svg',
  landing: '/assets/icons/planes/landing.svg',
  portfolio: '/assets/icons/planes/portfolio.svg',
  restaurant: '/assets/icons/planes/restaurante.svg',
  wp_business: '/assets/icons/planes/sitio-empresarial.svg',
  ecommerce_store: '/assets/icons/planes/tienda-online.svg',
  blog: '/assets/icons/planes/blog.svg',
  custom: '/assets/icons/planes/custom.svg',
};

interface PlanCardProps {
  plan: Plan;
  onSelect: (plan: Plan) => void;
}

export default function PlanCard({ plan, onSelect }: PlanCardProps) {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={cn(
        'relative flex flex-col rounded-2xl p-7 sm:p-8 transition-all duration-300 h-full border border-border',
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
      {plan.highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <span
            className="inline-block px-3 sm:px-5 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white shadow-lg whitespace-nowrap"
            style={{
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
            }}
          >
            {t('plans.popular')}
          </span>
        </div>
      )}

      {/* Plan icon + name & tagline */}
      <div className="mb-6">
        {PLAN_ICONS[plan.id] && (
          <div
            className="w-14 h-14 mb-3 rounded-xl flex items-center justify-center p-2.5"
            style={{
              background: 'color-mix(in srgb, var(--primary) 12%, transparent)',
              border: '1px solid color-mix(in srgb, var(--primary) 22%, transparent)',
            }}
          >
            <Image
              src={PLAN_ICONS[plan.id]}
              alt={plan.name}
              width={40}
              height={40}
              className="w-full h-full object-contain"
            />
          </div>
        )}
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

      {/* Ideal para — before CTA */}
      {plan.target && (
        <div className="mb-6">
          <div className="flex items-start gap-3 text-sm text-card-foreground leading-relaxed">
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
              style={{
                border: '2px solid var(--primary)',
                color: 'var(--primary)',
              }}
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
            <span>{plan.target}</span>
          </div>
        </div>
      )}

      {/* CTA Button */}
      <button
        onClick={() => onSelect(plan)}
        className={cn(
          'w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200 cursor-pointer',
          plan.highlighted
            ? 'text-white shadow-md hover:shadow-lg hover:opacity-90 mb-4'
            : 'border-2 border-border text-card-foreground hover:border-primary/50 hover:text-primary mb-4',
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

      {/* Expand toggle (after CTA) */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center justify-between w-full text-sm font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer py-1 px-1 rounded-lg hover:bg-primary/5"
        aria-expanded={expanded}
      >
        <span
          className="underline underline-offset-2"
          style={{ textDecorationColor: 'color-mix(in srgb, var(--primary) 50%, transparent)' }}
        >
          {expanded ? t('plans.hide_features') : t('plans.see_features')}
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

      {/* Features (collapsible) */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-500 ease-in-out',
          expanded ? 'max-h-[760px] opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0',
        )}
      >
        <ul className="space-y-3">
          {plan.features.map((feature, i) => (
            <li
              key={`${plan.id}-${i}`}
              className="flex items-start gap-3 text-sm text-card-foreground"
            >
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
      </div>
    </div>
  );
}
