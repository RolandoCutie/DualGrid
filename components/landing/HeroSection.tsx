'use client';

import BrandingQuizModal from '@/components/landing/BrandingQuizModal';
import QuestionnaireWizard from '@/components/questionnaire/QuestionnaireWizard';
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
  const [brandingOpen, setBrandingOpen] = useState(false);
  const [prevAutoOpen, setPrevAutoOpen] = useState<boolean | null>(null);
  const { t, tArray } = useLanguage();

  if (prevAutoOpen !== autoOpen) {
    setPrevAutoOpen(autoOpen);
    if (autoOpen) setWizardOpen(true);
  }

  return (
    <section className="relative min-h-[100svh] flex items-center bg-transparent grain-overlay">
      {/* ── Background: neon gradient orbs ── */}
      {/* Cyan glow — top center (extends above section so it blends with navbar) */}
      <div
        className="absolute -top-20 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(0,217,255,0.18) 0%, transparent 65%)',
          filter: 'blur(40px)',
        }}
        aria-hidden="true"
      />
      {/* Green neon lamp — bottom center */}
      <div
        className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(0,255,157,0.28) 0%, rgba(0,255,157,0.08) 40%, transparent 70%)',
          filter: 'blur(30px)',
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
            <span className="text-gradient-animated">{t('hero.title_highlight')}</span>{' '}
            {t('hero.title_after')}
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-12">
            {t('hero.subtitle')}
          </p>

          {/* CTA buttons — two clear paths */}
          <div className="flex flex-col items-center gap-3 mb-16">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {/* Path 1: Web */}
              <button
                onClick={() => setWizardOpen(true)}
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-bold transition-all duration-200 hover:brightness-110 hover:scale-[1.02] hover:shadow-[0_0_32px_-4px_rgba(0,217,255,0.55)] active:scale-[0.98] animate-pulse-glow"
                style={{
                  background: 'linear-gradient(135deg, var(--primary), rgba(0,217,255,0.7))',
                  color: '#000',
                  boxShadow: '0 0 20px -6px rgba(0,217,255,0.35)',
                }}
              >
                {t('hero.cta_primary')}
              </button>

              {/* Path 2: Branding */}
              <button
                onClick={() => setBrandingOpen(true)}
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-bold transition-all duration-200 hover:opacity-80 hover:scale-[1.02] hover:shadow-[0_0_32px_-4px_rgba(165,148,249,0.5)] active:scale-[0.98]"
                style={{
                  border: '1.5px solid color-mix(in srgb, var(--purple) 45%, transparent)',
                  color: 'var(--purple)',
                  background: 'color-mix(in srgb, var(--purple) 10%, transparent)',
                }}
              >
                {t('hero.cta_branding')}
              </button>
            </div>
            <span className="text-xs text-muted-foreground">{t('hero.time_estimate')}</span>
          </div>

          {/* Trust indicators — infinite marquee */}
          <div
            className="marquee w-full max-w-2xl overflow-hidden"
            style={{
              maskImage: 'linear-gradient(90deg, transparent, black 12%, black 88%, transparent)',
              WebkitMaskImage:
                'linear-gradient(90deg, transparent, black 12%, black 88%, transparent)',
            }}
          >
            <div className="marquee-track gap-3 pr-3">
              {[...HERO_TRUST_ICONS, ...HERO_TRUST_ICONS].map((src, key) => (
                <div
                  key={key}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 border border-border/70 text-sm text-muted-foreground shadow-sm backdrop-blur-sm whitespace-nowrap"
                >
                  <Image
                    src={src}
                    alt=""
                    width={16}
                    height={16}
                    className="w-4 h-4 object-contain"
                  />
                  <span>{tArray('hero.trust')[key % HERO_TRUST_ICONS.length]}</span>
                </div>
              ))}
            </div>
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
      <BrandingQuizModal open={brandingOpen} onClose={() => setBrandingOpen(false)} />
    </section>
  );
}
