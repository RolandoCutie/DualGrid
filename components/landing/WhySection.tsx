'use client';

import { DICTS, useLanguage } from '@/components/ui/LanguageProvider';

export default function WhySection() {
  const { locale, t } = useLanguage();
  const items = DICTS[locale].why.items as Array<{ emoji: string; title: string; desc: string }>;

  return (
    <section id="por-que" className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
            {t('why.eyebrow')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-card-foreground mt-2 mb-4">
            {t('why.title')}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">{t('why.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.title}
              className="flex flex-col gap-3 p-6 rounded-2xl border border-border bg-card hover:border-primary/40 transition-colors duration-200 hover:shadow-sm"
            >
              <span className="text-3xl">{item.emoji}</span>
              <h3 className="font-bold text-card-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
