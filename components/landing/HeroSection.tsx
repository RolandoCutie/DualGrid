'use client';

import QuestionnaireWizard from '@/components/questionnaire/QuestionnaireWizard';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/components/ui/LanguageProvider';
import { useState } from 'react';

export default function HeroSection() {
  const [wizardOpen, setWizardOpen] = useState(false);
  const { t, tArray } = useLanguage();

  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden bg-background grain-overlay">
      {/* ── Background: blueprint grid ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="w-full h-full opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(var(--color-card-foreground) 1px, transparent 1px), linear-gradient(90deg, var(--color-card-foreground) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      {/* ── Background: gradient orbs ── */}
      <div
        className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--primary) 12%, transparent) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--accent) 10%, transparent) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none opacity-30"
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--primary) 6%, transparent) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        aria-hidden="true"
      />

      {/* ── Content ── */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-28 sm:py-36">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Eyebrow badge */}
          <div className="section-badge mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            {t('hero.eyebrow')}
          </div>

          {/* Headline */}
          <h1
            className="text-[clamp(2.5rem,8vw,5rem)] font-extrabold text-card-foreground leading-[1.05] tracking-tight mb-7"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {t('hero.title_before')}{' '}
            <span className="text-gradient">{t('hero.title_highlight')}</span>{' '}
            {t('hero.title_after')}
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-12">
            {t('hero.subtitle')}
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
            <Button
              size="xl"
              onClick={() => setWizardOpen(true)}
              className="animate-pulse-glow"
              rightIcon={
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              }
            >
              {t('hero.cta_primary')}
            </Button>
            <Button
              size="xl"
              variant="outline"
              onClick={() =>
                document.getElementById('planes')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="border-border/70 hover:border-primary/50 hover:text-primary"
            >
              {t('hero.cta_secondary')}
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {(
              [
                { icon: '⚡', key: 0 },
                { icon: '🔒', key: 1 },
                { icon: '📱', key: 2 },
                { icon: '🎨', key: 3 },
              ] as const
            ).map(({ icon, key }) => (
              <div
                key={key}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border/70 text-sm text-muted-foreground shadow-sm"
              >
                <span className="text-base">{icon}</span>
                <span>{tArray('hero.trust')[key]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom fade gradient ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent, var(--background))',
        }}
        aria-hidden="true"
      />

      <QuestionnaireWizard open={wizardOpen} onClose={() => setWizardOpen(false)} />
    </section>
  );
}
