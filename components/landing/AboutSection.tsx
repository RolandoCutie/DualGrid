'use client';

import SectionHeading from '@/components/landing/SectionHeading';
import { useLanguage } from '@/components/ui/LanguageProvider';
import Reveal from '@/components/ui/Reveal';

const VALUE_ICONS = [
  // Focus / target — same 1.8 stroke, round caps as WhySection icons
  <svg
    key="v1"
    width="30"
    height="30"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>,
  // Direct team / no middlemen
  <svg
    key="v2"
    width="30"
    height="30"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87" />
    <path d="M16 3.13a4 4 0 010 7.75" />
  </svg>,
  // Results / bar chart
  <svg
    key="v3"
    width="30"
    height="30"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
    <line x1="2" y1="20" x2="22" y2="20" />
  </svg>,
];

const VALUE_KEYS = ['value_1', 'value_2', 'value_3'] as const;

export default function AboutSection() {
  const { t } = useLanguage();

  return (
    <section
      id="nosotros"
      className="relative py-24 sm:py-32 overflow-hidden bg-transparent scroll-mt-28 lg:scroll-mt-32"
    >
      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(165,148,249,0.07) 0%, transparent 65%)',
          filter: 'blur(60px)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <SectionHeading
          eyebrow={t('about.eyebrow')}
          title={t('about.title')}
          subtitle={t('about.subtitle')}
        />

        {/* Description */}
        <Reveal>
          <p className="text-center text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-14 text-lg">
            {t('about.description')}
          </p>
        </Reveal>

        {/* Values grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {VALUE_KEYS.map((key, i) => (
            <Reveal key={key} className="h-full">
              <div className="gradient-border group flex flex-col gap-4 p-7 rounded-2xl border border-border bg-card h-full">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 p-2.5"
                  style={{
                    background: `linear-gradient(135deg, color-mix(in srgb, var(--purple) 15%, transparent), color-mix(in srgb, var(--primary) ${i % 2 === 0 ? '8' : '12'}%, transparent))`,
                    border: '1px solid color-mix(in srgb, var(--purple) 20%, transparent)',
                    color: 'var(--purple)',
                  }}
                >
                  {VALUE_ICONS[i]}
                </div>
                <h3
                  className="font-bold text-card-foreground text-lg"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {t(`about.${key}_title`)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(`about.${key}_desc`)}
                </p>
                <div className="reveal-line h-0.5 w-full rounded-full mt-auto" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
