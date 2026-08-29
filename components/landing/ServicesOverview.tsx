'use client';

import SectionHeading from '@/components/landing/SectionHeading';
import { useLanguage } from '@/components/ui/LanguageProvider';
import Reveal from '@/components/ui/Reveal';
import Image from 'next/image';

const SERVICE_ICONS = [
  '/assets/icons/planes/sitio-empresarial.svg',
  '/assets/icons/branding/plan-corporativo.svg',
  '/assets/icons/hosting/dominio.svg',
];

const ACCENTS = [
  {
    bg: 'linear-gradient(135deg, color-mix(in srgb, var(--primary) 15%, transparent), color-mix(in srgb, var(--accent) 10%, transparent))',
    border: 'color-mix(in srgb, var(--primary) 20%, transparent)',
    text: 'var(--primary)',
  },
  {
    bg: 'linear-gradient(135deg, color-mix(in srgb, var(--purple) 15%, transparent), color-mix(in srgb, var(--primary) 8%, transparent))',
    border: 'color-mix(in srgb, var(--purple) 20%, transparent)',
    text: 'var(--purple)',
  },
  {
    bg: 'linear-gradient(135deg, color-mix(in srgb, var(--accent) 12%, transparent), color-mix(in srgb, var(--primary) 8%, transparent))',
    border: 'color-mix(in srgb, var(--accent) 20%, transparent)',
    text: 'var(--accent)',
  },
];

const TARGET_IDS = ['planes', 'branding', 'hosting'];
const SERVICE_IDS = ['web', 'brand', 'hosting'] as const;

export default function ServicesOverview() {
  const { t } = useLanguage();

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="relative py-20 sm:py-28 overflow-hidden bg-transparent">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 relative z-10">
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
                    <Image
                      src={SERVICE_ICONS[i]}
                      alt=""
                      width={30}
                      height={30}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3
                    className="font-bold text-card-foreground text-lg"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {t(`services_overview.${id}_title`)}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                    {t(`services_overview.${id}_desc`)}
                  </p>
                  <span
                    className="inline-flex items-center gap-1.5 text-sm font-semibold mt-1"
                    style={{ color: c.text }}
                  >
                    {t(`services_overview.${id}_cta`)}
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
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
