'use client';

import { DICTS, useLanguage } from '@/components/ui/LanguageProvider';
import SectionHeading from '@/components/landing/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import Image from 'next/image';

// Maps position index to the corresponding SVG icon in /public/assets/icons/proceso/
const PROCESS_ICONS = [
  '/assets/icons/proceso/descubrimiento.svg',
  '/assets/icons/proceso/propuesta.svg',
  '/assets/icons/proceso/diseno.svg',
  '/assets/icons/proceso/desarrollo.svg',
  '/assets/icons/proceso/lanzamiento.svg',
  '/assets/icons/proceso/soporte.svg',
];

export default function ProcessSection() {
  const { locale, t } = useLanguage();
  const steps = DICTS[locale].process.steps as Array<{
    number: string;
    icon: string;
    title: string;
    desc: string;
  }>;

  return (
    <section id="proceso" className="relative py-24 sm:py-32 overflow-hidden bg-transparent">
      {/* Cyan glow — bottom left */}
      <div
        className="absolute -bottom-16 -left-16 w-[550px] h-[450px] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(0,217,255,0.14) 0%, transparent 65%)',
          filter: 'blur(55px)',
        }}
        aria-hidden="true"
      />
      {/* Green glow — top right */}
      <div
        className="absolute -top-24 -right-20 w-[600px] h-[460px] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(0,255,157,0.14) 0%, transparent 65%)',
          filter: 'blur(60px)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <SectionHeading
          eyebrow={t('process.eyebrow')}
          title={t('process.title')}
          subtitle={t('process.subtitle')}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {steps.map((step, i) => (
            <Reveal key={step.number} className="h-full">
              <div className="relative group bg-card border border-border rounded-2xl p-7 hover:border-primary/30 hover:shadow-xl card-elevate transition-all duration-300 h-full">
                {/* Step number as large ghost text */}
                <div
                  className="absolute -top-3 -right-1 text-7xl font-black select-none pointer-events-none leading-none"
                  style={{
                    color: `color-mix(in srgb, var(--primary) ${10 - i}%, transparent)`,
                    fontFamily: 'var(--font-heading)',
                  }}
                  aria-hidden="true"
                >
                  {step.number}
                </div>

                <div className="flex items-start gap-4 relative z-10">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 p-2"
                    style={{
                      background:
                        'linear-gradient(135deg, color-mix(in srgb, var(--primary) 14%, transparent), color-mix(in srgb, var(--accent) 10%, transparent))',
                      border: '1px solid color-mix(in srgb, var(--primary) 20%, transparent)',
                    }}
                  >
                    {PROCESS_ICONS[i] ? (
                      <Image
                        src={PROCESS_ICONS[i]}
                        alt={step.title}
                        width={28}
                        height={28}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-xl">{step.icon}</span>
                    )}
                  </div>
                  <div>
                    <h3
                      className="text-base font-bold text-card-foreground group-hover:text-primary transition-colors duration-200"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
