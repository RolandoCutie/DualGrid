'use client';

import SectionHeading from '@/components/landing/SectionHeading';
import { useLanguage } from '@/components/ui/LanguageProvider';
import Reveal from '@/components/ui/Reveal';

// Real client testimonials
const TESTIMONIALS = [
  {
    id: 1,
    quote:
      'DualGrid transformó completamente mi presencia digital. Tenía dos necesidades muy distintas — un sitio para mis tours en Cuba y visibilidad para mis artículos científicos — y lograron unificar todo con un diseño coherente y profesional. La experiencia fue impecable.',
    author: 'Nils Navarro',
    role: 'Fotógrafo, guía de tours y divulgador científico',
    initial: 'N',
    color: 'var(--primary)',
  },
  {
    id: 2,
    quote:
      'Gracias a DualGrid, Cubaway tiene ahora un sitio que realmente vende. Mis clientes pueden ver la flotilla, filtrar por especificaciones y contactarme por WhatsApp en segundos. Las reservas aumentaron notablemente desde el lanzamiento.',
    author: 'Yandy Dopico',
    role: 'Fundador de Cubaway — renta de autos en Cuba',
    initial: 'Y',
    color: 'var(--accent)',
  },
];

export default function TestimonialsSection() {
  const { t } = useLanguage();

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden bg-transparent">
      {/* Ambient glows */}
      <div
        className="absolute -top-20 right-1/4 w-[500px] h-[400px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(0,217,255,0.06) 0%, transparent 65%)',
          filter: 'blur(60px)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <SectionHeading
          eyebrow={t('testimonials.eyebrow')}
          title={t('testimonials.title')}
          subtitle={t('testimonials.subtitle')}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((item) => (
            <Reveal key={item.id} className="h-full">
              <figure className="flex flex-col rounded-2xl border border-border bg-card p-7 h-full gap-5">
                {/* Stars */}
                <div className="flex gap-0.5" aria-label="5 estrellas">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="var(--primary)"
                      stroke="none"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>

                <blockquote className="text-sm text-muted-foreground leading-relaxed flex-1 italic">
                  "{item.quote}"
                </blockquote>

                <figcaption className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: item.color }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#000"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-card-foreground">{item.author}</p>
                    <p className="text-xs text-muted-foreground">{item.role}</p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
