'use client';

import SectionHeading from '@/components/landing/SectionHeading';
import { useLanguage } from '@/components/ui/LanguageProvider';
import Reveal from '@/components/ui/Reveal';

const SERVICE_ICONS = [
  <svg key="web" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="2.5"/>
    <path d="M3 9h18"/>
    <path d="M9 21V9"/>
  </svg>,
  <svg key="brand" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z"/>
  </svg>,
  <svg key="host" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="8" rx="2"/>
    <rect x="2" y="14" width="20" height="8" rx="2"/>
    <circle cx="7" cy="6" r="1" fill="currentColor" stroke="none"/>
    <circle cx="7" cy="18" r="1" fill="currentColor" stroke="none"/>
  </svg>,
];

const ACCENTS = [
  { bg: 'linear-gradient(135deg, color-mix(in srgb, var(--primary) 15%, transparent), color-mix(in srgb, var(--accent) 10%, transparent))', border: 'color-mix(in srgb, var(--primary) 20%, transparent)', text: 'var(--primary)' },
  { bg: 'linear-gradient(135deg, color-mix(in srgb, var(--purple) 15%, transparent), color-mix(in srgb, var(--primary) 8%, transparent))', border: 'color-mix(in srgb, var(--purple) 20%, transparent)', text: 'var(--purple)' },
  { bg: 'linear-gradient(135deg, color-mix(in srgb, var(--accent) 12%, transparent), color-mix(in srgb, var(--primary) 8%, transparent))', border: 'color-mix(in srgb, var(--accent) 20%, transparent)', text: 'var(--accent)' },
];

const TARGET_IDS = ['planes', 'branding', 'hosting'];
const SERVICE_IDS = ['web', 'brand', 'hosting'] as const;

export default function ServicesOverview() {
  const { t } = useLanguage();

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="relative py-20 sm:py-28 overflow-hidden bg-transparent">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <SectionHeading
          eyebrow={t('services_overview.eyebrow')}
          title={t('services_overview.title')}
          subtitle={t('services_overview.subtitle')}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {SERVICE_IDS.map((id, i) => {
            const c = ACCENTS[i];
            return (
              <Reveal key={id} className="h-full">
                <div
                  className="gradient-border group flex flex-col gap-4 p-7 rounded-2xl border border-border bg-card h-full cursor-pointer"
                  onClick={() => scrollTo(TARGET_IDS[i])}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && scrollTo(TARGET_IDS[i])}
                  style={{ outline: 'none' }}
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 p-2.5"
                    style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.text }}
                  >
                    {SERVICE_ICONS[i]}
                  </div>
                  <h3 className="font-bold text-card-foreground text-lg" style={{ fontFamily: 'var(--font-heading)' }}>
                    {t(`services_overview.${id}_title`)}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                    {t(`services_overview.${id}_desc`)}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold mt-1" style={{ color: c.text }}>
                    {t(`services_overview.${id}_cta`)}
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </span>
                  <div className="reveal-line h-0.5 w-full rounded-full mt-auto" />
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
