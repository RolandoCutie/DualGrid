'use client';

import { DICTS, useLanguage } from '@/components/ui/LanguageProvider';

export default function ProcessSection() {
  const { locale, t } = useLanguage();
  const steps = DICTS[locale].process.steps as Array<{
    number: string;
    icon: string;
    title: string;
    desc: string;
  }>;

  return (
    <section
      id="proceso"
      className="py-28 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, var(--muted) 0%, var(--background) 100%)' }}
    >
      {/* Orb */}
      <div
        className="absolute bottom-0 left-0 w-[500px] h-[500px] pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--primary) 7%, transparent), transparent 70%)',
          filter: 'blur(60px)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="section-badge mx-auto mb-4">{t('process.eyebrow')}</div>
          <h2
            className="text-3xl sm:text-5xl font-extrabold text-card-foreground mt-2 mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {t('process.title')}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">{t('process.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="relative group bg-card border border-border rounded-2xl p-7 hover:border-primary/30 hover:shadow-xl transition-all duration-300"
            >
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
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{
                    background:
                      'linear-gradient(135deg, color-mix(in srgb, var(--primary) 14%, transparent), color-mix(in srgb, var(--accent) 10%, transparent))',
                    border: '1px solid color-mix(in srgb, var(--primary) 20%, transparent)',
                  }}
                >
                  {step.icon}
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
          ))}
        </div>
      </div>
    </section>
  );
}
