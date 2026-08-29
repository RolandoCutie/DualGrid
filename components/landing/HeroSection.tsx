'use client';

import BrandingQuizModal from '@/components/landing/BrandingQuizModal';
import QuestionnaireWizard from '@/components/questionnaire/QuestionnaireWizard';
import { useLanguage } from '@/components/ui/LanguageProvider';
import { useState } from 'react';

// Inline SVG marquee items — consistent 1.8 stroke, round linecap, 16×16
const MARQUEE_ICONS = [
  // Web design — browser grid
  <svg
    key="wd"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18M9 21V9" />
  </svg>,
  // Visual identity — diamond star
  <svg
    key="vi"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>,
  // Web dev — code brackets
  <svg
    key="dev"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>,
  // Logo design — pen nib
  <svg
    key="logo"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
  </svg>,
  // UX/UI — cursor hand
  <svg
    key="ux"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M9 12V5a2 2 0 114 0v7" />
    <path d="M13 6a2 2 0 114 0v6" />
    <path d="M17 7a2 2 0 114 0v7a6 6 0 01-6 6h-2a6 6 0 01-6-6v-1a2 2 0 114 0" />
  </svg>,
  // Landing pages — rocket
  <svg
    key="lp"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z" />
    <path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>,
  // Hosting — server
  <svg
    key="host"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="2" y="2" width="20" height="8" rx="2" />
    <rect x="2" y="14" width="20" height="8" rx="2" />
    <circle cx="7" cy="6" r="1" fill="currentColor" stroke="none" />
    <circle cx="7" cy="18" r="1" fill="currentColor" stroke="none" />
  </svg>,
  // Branding strategy — layers
  <svg
    key="br"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>,
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
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              {/* Path 1: Web */}
              <div className="flex flex-col items-center gap-1.5">
                <button
                  onClick={() => setWizardOpen(true)}
                  className="cursor-pointer inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-bold transition-all duration-200 hover:brightness-110 hover:scale-[1.02] hover:shadow-[0_0_32px_-4px_rgba(0,217,255,0.55)] active:scale-[0.98] animate-pulse-glow"
                  style={{
                    background: 'linear-gradient(135deg, var(--primary), rgba(0,217,255,0.7))',
                    color: '#000',
                    boxShadow: '0 0 20px -6px rgba(0,217,255,0.35)',
                  }}
                >
                  {t('hero.cta_primary')}
                </button>
                <span className="text-xs text-muted-foreground">{t('hero.cta_primary_sub')}</span>
              </div>

              {/* Path 2: Branding */}
              <div className="flex flex-col items-center gap-1.5">
                <button
                  onClick={() => setBrandingOpen(true)}
                  className="cursor-pointer inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-bold transition-all duration-200 hover:opacity-80 hover:scale-[1.02] hover:shadow-[0_0_32px_-4px_rgba(165,148,249,0.5)] active:scale-[0.98]"
                  style={{
                    border: '1.5px solid color-mix(in srgb, var(--purple) 45%, transparent)',
                    color: 'var(--purple)',
                    background: 'color-mix(in srgb, var(--purple) 10%, transparent)',
                  }}
                >
                  {t('hero.cta_branding')}
                </button>
                <span className="text-xs text-muted-foreground">{t('hero.cta_branding_sub')}</span>
              </div>
            </div>
            <span className="text-xs text-muted-foreground mt-1">{t('hero.time_estimate')}</span>
          </div>

          {/* Trust indicators — infinite marquee with 8 inline SVG icons */}
          <div
            className="marquee w-full max-w-2xl overflow-hidden"
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
                  {MARQUEE_ICONS[idx % MARQUEE_ICONS.length]}
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
