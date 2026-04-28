'use client';

import { DICTS, useLanguage } from '@/components/ui/LanguageProvider';

export default function WhySection() {
  const { locale, t } = useLanguage();
  const items = DICTS[locale].why.items as Array<{ emoji: string; title: string; desc: string }>;

  return (
    <section id="por-que" className="py-28 bg-background relative overflow-hidden">
      {/* Subtle background orb */}
      <div
        className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full pointer-events-none opacity-40"
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--accent) 8%, transparent), transparent 70%)',
          filter: 'blur(60px)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="section-badge mx-auto mb-4">{t('why.eyebrow')}</div>
          <h2
            className="text-3xl sm:text-5xl font-extrabold text-card-foreground mt-2 mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {t('why.title')}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">{t('why.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, i) => (
            <div
              key={item.title}
              className="gradient-border group flex flex-col gap-4 p-7 rounded-2xl border border-border bg-card hover:shadow-xl transition-all duration-300"
            >
              {/* Icon container with gradient bg */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                style={{
                  background: `linear-gradient(135deg, color-mix(in srgb, var(--primary) ${i % 2 === 0 ? '15' : '10'}%, transparent), color-mix(in srgb, var(--accent) ${i % 2 === 0 ? '10' : '15'}%, transparent))`,
                  border: `1px solid color-mix(in srgb, var(--primary) 20%, transparent)`,
                }}
              >
                {item.emoji}
              </div>
              <h3
                className="font-bold text-card-foreground text-lg group-hover:text-primary transition-colors duration-200"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>

              {/* Bottom accent line */}
              <div
                className="h-0.5 w-0 group-hover:w-full rounded-full transition-all duration-500 mt-auto"
                style={{
                  background: 'linear-gradient(90deg, var(--primary), var(--accent))',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
