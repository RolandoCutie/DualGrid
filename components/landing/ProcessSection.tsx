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
    <section id="proceso" className="py-24 bg-muted/30">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
            {t('process.eyebrow')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-card-foreground mt-2 mb-4">
            {t('process.title')}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">{t('process.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative bg-card border border-border rounded-2xl p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">{step.icon}</span>
                <div>
                  <span className="text-xs font-bold text-primary">{step.number}</span>
                  <h3 className="text-base font-bold text-card-foreground mt-0.5">{step.title}</h3>
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
