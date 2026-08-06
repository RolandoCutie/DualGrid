'use client';

import QuestionnaireWizard from '@/components/questionnaire/QuestionnaireWizard';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/components/ui/LanguageProvider';
import Image from 'next/image';
import { useState } from 'react';


const HERO_TRUST_ICONS = [
  '/assets/icons/hero/entrega-rapida.svg',
  '/assets/icons/hero/codigo-limpio.svg',
  '/assets/icons/hero/responsive.svg',
  '/assets/icons/hero/diseno-unico.svg',
];

interface HeroSectionProps {
  /** If true, opens the questionnaire wizard immediately on mount (used by ?wizard=open URL) */
  autoOpen?: boolean;
}

export default function HeroSection({ autoOpen = false }: HeroSectionProps) {
  const [wizardOpen, setWizardOpen] = useState(false);
  const [prevAutoOpen, setPrevAutoOpen] = useState<boolean | null>(null);
  const { t, tArray } = useLanguage();

  if (prevAutoOpen !== autoOpen) {
    setPrevAutoOpen(autoOpen);
    if (autoOpen) setWizardOpen(true);
  }

  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden bg-background dark:bg-transparent grain-overlay">
      {/* ── Background: blueprint grid ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="w-full h-full opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(var(--color-card-foreground) 1px, transparent 1px), linear-gradient(90deg, var(--color-card-foreground) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      {/* ── Background: gradient orbs — neon lamp effect ── */}
      {/* Cyan glow — top center */}
      <div
        className="absolute -top-20 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(0,217,255,0.18) 0%, transparent 65%)',
          filter: 'blur(40px)',
        }}
        aria-hidden="true"
      />
      {/* Green neon lamp — bottom center (main glow like in design) */}
      <div
        className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(0,255,157,0.28) 0%, rgba(0,255,157,0.08) 40%, transparent 70%)',
          filter: 'blur(30px)',
        }}
        aria-hidden="true"
      />
      {/* Secondary cyan accent — top left */}
      <div
        className="absolute -top-32 -left-24 w-[500px] h-[500px] rounded-full pointer-events-none opacity-50"
        style={{
          background: 'radial-gradient(circle, rgba(0,217,255,0.12) 0%, transparent 65%)',
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
            {HERO_TRUST_ICONS.map((src, key) => (
              <div
                key={key}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border/70 text-sm text-muted-foreground shadow-sm"
              >
                <Image src={src} alt="" width={16} height={16} className="w-4 h-4 object-contain" />
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
