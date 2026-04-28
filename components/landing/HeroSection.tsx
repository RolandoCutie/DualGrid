'use client';

import QuestionnaireWizard from '@/components/questionnaire/QuestionnaireWizard';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/components/ui/LanguageProvider';
import { useState } from 'react';

export default function HeroSection() {
  const [wizardOpen, setWizardOpen] = useState(false);
  const { t, tArray } = useLanguage();

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-background">
      {/* Background grid pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" aria-hidden="true">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              'linear-gradient(var(--color-card-foreground) 1px, transparent 1px), linear-gradient(90deg, var(--color-card-foreground) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Gradient blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-24 sm:py-32">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              {t('hero.eyebrow')}
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-card-foreground leading-[1.1] tracking-tight mb-6">
            {t('hero.title_before')}{' '}
            <span className="relative inline-block">
              <span className="relative z-10 text-primary">{t('hero.title_highlight')}</span>
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 300 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 10C50 4 100 2 150 4C200 6 250 8 298 4"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="text-primary"
                />
              </svg>
            </span>{' '}
            {t('hero.title_after')}
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-10">
            {t('hero.subtitle')}
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Button
              size="xl"
              onClick={() => setWizardOpen(true)}
              rightIcon={
                <svg
                  width="20"
                  height="20"
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
            >
              {t('hero.cta_secondary')}
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-14 text-muted-foreground">
            {(
              [
                { icon: '⚡', key: 0 },
                { icon: '🔒', key: 1 },
                { icon: '📱', key: 2 },
                { icon: '🎨', key: 3 },
              ] as const
            ).map(({ icon, key }) => (
              <div key={key} className="flex items-center gap-2 text-sm">
                <span>{icon}</span>
                <span>{tArray('hero.trust')[key]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <QuestionnaireWizard open={wizardOpen} onClose={() => setWizardOpen(false)} />
    </section>
  );
}
