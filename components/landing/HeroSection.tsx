'use client';

import BrandingQuizModal from '@/components/landing/BrandingQuizModal';
import QuestionnaireWizard from '@/components/questionnaire/QuestionnaireWizard';
import { useLanguage } from '@/components/ui/LanguageProvider';
import Image from 'next/image';
import { useState } from 'react';

// Reuse local SVG assets so the hero language matches the rest of the site's icon style.
const MARQUEE_ICONS = [
  '/assets/icons/planes/landing.svg',
  '/assets/icons/branding/plan-esencial.svg',
  '/assets/icons/planes/custom.svg',
  '/assets/icons/branding/plan-corporativo.svg',
  '/assets/icons/planes/portfolio.svg',
  '/assets/icons/planes/menu-qr.svg',
  '/assets/icons/hosting/dominio.svg',
  '/assets/icons/branding/plan-global.svg',
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
  const trustItems = tArray('hero.trust');
  const marqueeLabels = trustItems.length > 0 ? [...trustItems, ...trustItems] : [];

  if (prevAutoOpen !== autoOpen) {
    setPrevAutoOpen(autoOpen);
    if (autoOpen) setWizardOpen(true);
  }

  return (
    <section className="relative min-h-[100svh] flex items-center bg-transparent grain-overlay">
      {/* ── Background: neon gradient orbs ── */}
      {/* Cyan glow — FIXED so it covers navbar area seamlessly (z-[1] = above aurora z-0, below navbar z-40) */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full pointer-events-none"
        style={{
          zIndex: 1,
          background:
            'radial-gradient(ellipse at center, rgba(0,217,255,0.16) 0%, transparent 65%)',
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
      <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-6 py-24 sm:py-32 lg:py-36">
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
          <p className="text-base sm:text-xl text-muted-foreground max-w-3xl leading-relaxed mb-10 sm:mb-12 text-balance">
            {t('hero.subtitle')}
          </p>

          {/* CTA buttons — two clear paths */}
          <div className="flex flex-col items-center gap-3 mb-14 sm:mb-16 w-full">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full sm:w-auto">
              {/* Path 1: Web */}
              <div className="flex flex-col items-center gap-1.5 w-full sm:w-auto max-w-sm">
                <button
                  onClick={() => setWizardOpen(true)}
                  className="cursor-pointer inline-flex w-full sm:w-auto items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl text-[15px] sm:text-base font-bold transition-all duration-200 hover:brightness-110 hover:scale-[1.02] hover:shadow-[0_0_32px_-4px_rgba(0,217,255,0.55)] active:scale-[0.98] animate-pulse-glow"
                  style={{
                    background: 'linear-gradient(135deg, var(--primary), rgba(0,217,255,0.7))',
                    color: '#000',
                    boxShadow: '0 0 20px -6px rgba(0,217,255,0.35)',
                  }}
                >
                  {t('hero.cta_primary')}
                </button>
                <span className="text-[11px] sm:text-xs text-muted-foreground text-center">
                  {t('hero.cta_primary_sub')}
                </span>
              </div>

              {/* Path 2: Branding */}
              <div className="flex flex-col items-center gap-1.5 w-full sm:w-auto max-w-sm">
                <button
                  onClick={() => setBrandingOpen(true)}
                  className="cursor-pointer inline-flex w-full sm:w-auto items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl text-[15px] sm:text-base font-bold transition-all duration-200 hover:opacity-80 hover:scale-[1.02] hover:shadow-[0_0_32px_-4px_rgba(165,148,249,0.5)] active:scale-[0.98]"
                  style={{
                    border: '1.5px solid color-mix(in srgb, var(--purple) 45%, transparent)',
                    color: 'var(--purple)',
                    background: 'color-mix(in srgb, var(--purple) 10%, transparent)',
                  }}
                >
                  {t('hero.cta_branding')}
                </button>
                <span className="text-[11px] sm:text-xs text-muted-foreground text-center">
                  {t('hero.cta_branding_sub')}
                </span>
              </div>
            </div>
            <span className="text-xs text-muted-foreground mt-1">{t('hero.time_estimate')}</span>
          </div>

          {/* Trust indicators — infinite marquee with 8 inline SVG icons */}
          <div
            className="marquee w-full max-w-full sm:max-w-2xl overflow-hidden"
            style={{
              maskImage: 'linear-gradient(90deg, transparent, black 12%, black 88%, transparent)',
              WebkitMaskImage:
                'linear-gradient(90deg, transparent, black 12%, black 88%, transparent)',
            }}
          >
            <div className="marquee-track gap-3 pr-3">
              {marqueeLabels.map((label, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 border border-border/70 text-sm text-muted-foreground shadow-sm backdrop-blur-sm whitespace-nowrap"
                >
                  <Image
                    src={MARQUEE_ICONS[idx % MARQUEE_ICONS.length]}
                    alt=""
                    width={16}
                    height={16}
                    className="w-4 h-4 object-contain"
                  />
                  <span>{label}</span>
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
