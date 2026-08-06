'use client';

import { DICTS, useLanguage } from '@/components/ui/LanguageProvider';
import SectionHeading from '@/components/landing/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import Image from 'next/image';

// Maps position index to the corresponding SVG icon in /public/assets/icons/porqueus/
const WHY_ICONS = [
  '/assets/icons/porqueus/diseno-personalizado.svg',
  '/assets/icons/porqueus/servicio-integral.svg',
  '/assets/icons/porqueus/comunicacion-directa.svg',
  '/assets/icons/porqueus/creamos-lo-que-necesitas.svg',
  '/assets/icons/porqueus/perfecto-dispositivos.svg',
  '/assets/icons/porqueus/codigo-limpio.svg',
];

export default function WhySection() {
  const { locale, t } = useLanguage();
  const items = DICTS[locale].why.items as Array<{ emoji: string; title: string; desc: string }>;

  return (
    <section id="por-que" className="relative py-24 sm:py-32 overflow-hidden bg-transparent">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <SectionHeading
          eyebrow={t('why.eyebrow')}
          title={t('why.title')}
          subtitle={t('why.subtitle')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, i) => (
            <Reveal key={item.title} className="h-full">
              <div className="gradient-border group flex flex-col gap-4 p-7 rounded-2xl border border-border bg-card h-full">
                {/* SVG Icon */}
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 p-2.5"
                  style={{
                    background: `linear-gradient(135deg, color-mix(in srgb, var(--primary) ${i % 2 === 0 ? '15' : '10'}%, transparent), color-mix(in srgb, var(--accent) ${i % 2 === 0 ? '10' : '15'}%, transparent))`,
                    border: `1px solid color-mix(in srgb, var(--primary) 20%, transparent)`,
                  }}
                >
                  {WHY_ICONS[i] ? (
                    <Image
                      src={WHY_ICONS[i]}
                      alt={item.title}
                      width={36}
                      height={36}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-2xl">{item.emoji}</span>
                  )}
                </div>
                <h3
                  className="font-bold text-card-foreground text-lg"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>

                {/* Bottom accent line — neutral, fills with gradient on hover */}
                <div className="reveal-line h-0.5 w-full rounded-full mt-auto" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
