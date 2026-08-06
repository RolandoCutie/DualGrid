'use client';

import QuestionnaireWizard from '@/components/questionnaire/QuestionnaireWizard';
import { Button } from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import { useLanguage } from '@/components/ui/LanguageProvider';
import { useState } from 'react';

export default function ClosingCTA() {
  const { t } = useLanguage();
  const [wizardOpen, setWizardOpen] = useState(false);

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Ambient glows behind the panel */}
      <div
        className="absolute -bottom-32 left-1/4 w-[500px] h-[420px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,255,157,0.14) 0%, transparent 65%)',
          filter: 'blur(60px)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute -top-24 right-1/4 w-[450px] h-[380px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,217,255,0.14) 0%, transparent 65%)',
          filter: 'blur(60px)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <Reveal>
          <div
            className="rounded-[2rem] p-[1.5px] overflow-hidden"
            style={{
              background:
                'linear-gradient(135deg, var(--primary), var(--purple), var(--accent))',
            }}
          >
            <div
              className="relative rounded-[calc(2rem-1.5px)] px-8 py-16 sm:px-16 sm:py-20 text-center overflow-hidden"
              style={{
                background: 'linear-gradient(180deg, var(--card) 0%, #0a1322 100%)',
              }}
            >
              {/* Inner glows */}
              <div
                className="absolute -top-20 -left-20 w-[320px] h-[320px] rounded-full pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle, rgba(0,217,255,0.16) 0%, transparent 65%)',
                  filter: 'blur(50px)',
                }}
                aria-hidden="true"
              />
              <div
                className="absolute -bottom-24 -right-16 w-[340px] h-[320px] rounded-full pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle, rgba(0,255,157,0.15) 0%, transparent 65%)',
                  filter: 'blur(50px)',
                }}
                aria-hidden="true"
              />

              <div className="relative z-10">
                <div className="section-badge mx-auto mb-4">{t('final_cta.eyebrow')}</div>
                <h2
                  className="text-3xl sm:text-5xl font-extrabold text-card-foreground tracking-tight mb-5"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {t('final_cta.title')}
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto text-lg leading-relaxed mb-10">
                  {t('final_cta.subtitle')}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button
                    size="xl"
                    onClick={() => setWizardOpen(true)}
                    className="animate-pulse-glow"
                    rightIcon={
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    }
                  >
                    {t('final_cta.primary')}
                  </Button>
                  <Button
                    size="xl"
                    variant="outline"
                    onClick={() =>
                      document.getElementById('planes')?.scrollIntoView({ behavior: 'smooth' })
                    }
                    className="border-border/70 hover:border-primary/50 hover:text-primary"
                  >
                    {t('final_cta.secondary')}
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground mt-7">{t('final_cta.note')}</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      <QuestionnaireWizard open={wizardOpen} onClose={() => setWizardOpen(false)} />
    </section>
  );
}
