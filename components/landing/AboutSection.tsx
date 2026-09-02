'use client';

import SectionHeading from '@/components/landing/SectionHeading';
import { useLanguage } from '@/components/ui/LanguageProvider';
import Reveal from '@/components/ui/Reveal';
import Image from 'next/image';

const VALUE_ICONS = [
  '/assets/icons/porqueus/diseno-personalizado.svg',
  '/assets/icons/porqueus/codigo-limpio.svg',
  '/assets/icons/porqueus/servicio-integral.svg',
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

      <div className="max-w-6xl mx-auto px-5 sm:px-6 relative z-10">
        <SectionHeading
          eyebrow={t('about.eyebrow')}
          title={t('about.title')}
          subtitle={t('about.subtitle')}
        />

        {/* Description */}
        <Reveal>
          <p className="text-center text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-12 sm:mb-14 text-base sm:text-lg">
            {t('about.description')}
          </p>
        </Reveal>

        {/* Values grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {VALUE_KEYS.map((key, i) => (
            <Reveal key={key} className="h-full">
              <div className="gradient-border group flex flex-col gap-4 p-6 sm:p-7 rounded-2xl border border-border bg-card h-full">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 p-2.5"
                  style={{
                    background: `linear-gradient(135deg, color-mix(in srgb, var(--purple) 15%, transparent), color-mix(in srgb, var(--primary) ${i % 2 === 0 ? '8' : '12'}%, transparent))`,
                    border: '1px solid color-mix(in srgb, var(--purple) 20%, transparent)',
                  }}
                >
                  <Image
                    src={VALUE_ICONS[i]}
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
