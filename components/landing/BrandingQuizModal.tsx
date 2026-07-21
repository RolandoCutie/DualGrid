'use client';

import Modal from '@/components/ui/Modal';
import { calcBrandingScore } from '@/lib/branding-recommendation';
import { cn } from '@/lib/utils';
import { useState } from 'react';

// ─── Questions data ───────────────────────────────────────────────────────────
const QUESTIONS = [
  {
    id: 'q1' as const,
    block: 'Bloque 1: El Momento Actual de tu Negocio',
    title: '¿En qué etapa se encuentra tu proyecto o empresa?',
    options: {
      A: 'Es una idea nueva, un proyecto personal o un negocio local que necesita empezar a rodar ya.',
      B: 'Es una empresa o PYME ya establecida que busca diferenciarse de la competencia y posicionarse con seriedad.',
      C: 'Es un modelo de negocio complejo que abarca diferentes ramas, productos independientes o subdivisiones bajo un mismo nombre.',
    },
  },
  {
    id: 'q2' as const,
    block: 'Bloque 2: Las Necesidades Visuales',
    title: 'Más allá del logotipo, ¿qué elementos visuales son indispensables para operar hoy?',
    options: {
      A: 'Solo necesito el logo bien hecho, los colores correctos y las tipografías para combinarlos yo mismo.',
      B: 'Necesito un universo visual completo: iconos propios, texturas, estilos fotográficos y el diseño de mis primeras aplicaciones.',
      C: 'Necesito todo lo anterior, además de un sistema que defina cómo convive mi marca principal con sus submarcas y guías avanzadas.',
    },
  },
  {
    id: 'q3' as const,
    block: 'Bloque 3: Gestión y Autonomía',
    title:
      '¿Quién se encargará de diseñar los contenidos del día a día de tu marca una vez entreguemos el proyecto?',
    options: {
      A: 'Yo mismo; con una guía de uso rápida y clara en PDF nos basta.',
      B: 'Un diseñador in-house o una agencia externa; necesitamos un Manual de Identidad completo.',
      C: 'Múltiples equipos, programadores, impresores y creadores de contenido a gran escala.',
    },
  },
  {
    id: 'q4' as const,
    block: 'Bloque 4: Realidad Presupuestaria',
    title: '¿Qué rango de inversión tienes proyectado para la creación de tu identidad visual?',
    options: {
      A: 'Alrededor de $100 USD. Estoy priorizando un arranque rápido y económico.',
      B: 'Entre $300 y $500 USD. Entiendo el diseño como una inversión estratégica.',
      C: 'Más de $550 USD. Busco un despliegue total y asesoría en arquitectura de marca.',
    },
  },
];

const PLAN_INFO = {
  essential: {
    name: 'Grid Essential',
    price: '$100 USD',
    delivery: '20 a 30 días hábiles',
    color: 'text-emerald-500',
    borderColor: 'border-emerald-500/40',
    bgColor: 'bg-emerald-500/5',
    description:
      'Ideal para emprendedores y pequeños negocios locales que necesitan empezar rápido y con buena imagen.',
    includes: [
      'Logo personalizado diseñado desde cero',
      'Paleta de colores de marca (HEX, RGB, CMYK)',
      'Tipografía corporativa principal y secundaria',
      '3 variantes de logo: horizontal, vertical e isotipo',
      'Guía de Uso Básica en PDF',
    ],
  },
  corporate: {
    name: 'Grid Corporate',
    price: '$300 USD',
    delivery: '30 a 45 días hábiles',
    color: 'text-primary',
    borderColor: 'border-primary/40',
    bgColor: 'bg-primary/5',
    description:
      'Para PYMEs o marcas que buscan posicionarse con fuerza. Sistema visual completo con manual de identidad.',
    includes: [
      'Todo lo del Plan Essential',
      'Universo visual: patrones, texturas, iconografía propia',
      'Manual de Identidad Visual Completo (PDF)',
      'Aplicaciones de marca a elegir 3: papelería, plantillas, packaging',
      'Revisiones ilimitadas durante la fase de diseño',
    ],
  },
  global: {
    name: 'Grid Ecosystem',
    price: '$550 USD',
    delivery: '50 a 65 días hábiles',
    color: 'text-amber-500',
    borderColor: 'border-amber-500/40',
    bgColor: 'bg-amber-500/5',
    description:
      'Para empresas consolidadas o proyectos con múltiples subdivisiones. Arquitectura de marca compleja.',
    includes: [
      'Todo lo del Plan Corporate',
      'Arquitectura de Marca: sistema de submarcas',
      'Manual técnico avanzado para desarrolladores e impresores',
      'Aplicaciones de marca a elegir 10 piezas',
      'Sesión dedicada de estrategia de marca',
    ],
  },
} as const;

type Answer = 'A' | 'B' | 'C';
type Answers = Partial<Record<'q1' | 'q2' | 'q3' | 'q4', Answer>>;
type Phase = 'quiz' | 'contact' | 'result';

interface BrandingQuizModalProps {
  open: boolean;
  onClose: () => void;
}

export default function BrandingQuizModal({ open, onClose }: BrandingQuizModalProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [result, setResult] = useState<keyof typeof PLAN_INFO | null>(null);
  const [phase, setPhase] = useState<Phase>('quiz');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [saving, setSaving] = useState(false);

  const currentQuestion = QUESTIONS[step];
  const currentAnswer = answers[currentQuestion?.id];
  const isLastQuestion = step === QUESTIONS.length - 1;

  const handleSelect = (option: Answer) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: option }));
  };

  const handleNext = () => {
    if (!currentAnswer) return;
    if (isLastQuestion) {
      const finalAnswers = {
        q1: answers.q1!,
        q2: answers.q2!,
        q3: answers.q3!,
        q4: currentAnswer,
      };
      const { recommendedPlan } = calcBrandingScore(finalAnswers);
      setResult(recommendedPlan as keyof typeof PLAN_INFO);
      setPhase('contact');
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (phase === 'contact') {
      setPhase('quiz');
      setResult(null);
    } else if (step > 0) {
      setStep((s) => s - 1);
    }
  };

  const handleContactSubmit = async () => {
    if (!contactName.trim() || !contactEmail.trim()) return;
    setSaving(true);
    try {
      await fetch('/api/branding-questionnaires/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: contactName.trim(),
          clientEmail: contactEmail.trim(),
          clientPhone: contactPhone.trim() || undefined,
          answers: {
            q1: answers.q1!,
            q2: answers.q2!,
            q3: answers.q3!,
            q4: answers.q4!,
          },
        }),
      });
    } catch {
      // Fail silently — still show result to the user
    } finally {
      setSaving(false);
    }
    setPhase('result');
  };

  const handleWhatsApp = () => {
    if (!result) return;
    const plan = PLAN_INFO[result];
    const phone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '';
    const msg = encodeURIComponent(
      `¡Hola DualGrid! Completé el test de identidad visual en su sitio web y mi plan recomendado es *${plan.name}* (${plan.price}). Me gustaría saber más y empezar el proceso. 🎨`,
    );
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep(0);
      setAnswers({});
      setResult(null);
      setPhase('quiz');
      setContactName('');
      setContactEmail('');
      setContactPhone('');
    }, 300);
  };

  return (
    <Modal open={open} onClose={handleClose} size="lg" hideCloseButton>
      <div className="p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-semibold text-primary uppercase tracking-wider">
              {phase === 'result'
                ? '✨ Tu plan recomendado'
                : phase === 'contact'
                  ? '📋 Casi listo'
                  : `Pregunta ${step + 1} de ${QUESTIONS.length}`}
            </p>
            {phase === 'quiz' && (
              <p className="text-xs text-muted-foreground mt-0.5">{currentQuestion.block}</p>
            )}
          </div>
          <button
            onClick={handleClose}
            className="text-muted-foreground hover:text-card-foreground transition-colors text-xl leading-none cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Progress bar */}
        {phase === 'quiz' && (
          <div className="w-full bg-muted rounded-full h-1.5 mb-6">
            <div
              className="h-1.5 rounded-full transition-all duration-500"
              style={{
                width: `${((step + 1) / QUESTIONS.length) * 100}%`,
                background: 'linear-gradient(90deg, var(--primary), var(--accent))',
              }}
            />
          </div>
        )}

        {/* Quiz phase */}
        {phase === 'quiz' && (
          <>
            <h3 className="text-lg font-bold text-card-foreground mb-5 leading-snug">
              {currentQuestion.title}
            </h3>
            <div className="space-y-3 mb-8">
              {(Object.entries(currentQuestion.options) as [Answer, string][]).map(
                ([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleSelect(key)}
                    className={cn(
                      'w-full text-left p-4 rounded-xl border-2 text-sm transition-all duration-200 cursor-pointer',
                      currentAnswer === key
                        ? 'border-primary bg-primary/5 text-primary font-medium'
                        : 'border-border text-card-foreground hover:border-primary/40 hover:bg-muted/50',
                    )}
                  >
                    <span className="font-bold mr-2">{key}.</span>
                    {label}
                  </button>
                ),
              )}
            </div>

            {/* Navigation */}
            <div className="flex gap-3">
              {step > 0 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2.5 rounded-xl border-2 border-border text-sm font-medium text-card-foreground hover:border-primary/50 transition-colors cursor-pointer"
                >
                  ← Atrás
                </button>
              )}
              <button
                type="button"
                onClick={handleNext}
                disabled={!currentAnswer}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}
              >
                {isLastQuestion ? 'Ver mi plan recomendado →' : 'Siguiente →'}
              </button>
            </div>
          </>
        )}

        {/* Contact phase */}
        {phase === 'contact' && result && (
          <>
            <div
              className={cn(
                'rounded-xl border px-4 py-3 mb-6 flex items-center gap-3',
                PLAN_INFO[result].borderColor,
                PLAN_INFO[result].bgColor,
              )}
            >
              <span className={cn('text-xl', PLAN_INFO[result].color)}>🎨</span>
              <div>
                <p className="text-xs text-muted-foreground">Tu plan recomendado</p>
                <p className={cn('font-bold text-sm', PLAN_INFO[result].color)}>
                  {PLAN_INFO[result].name} — {PLAN_INFO[result].price}
                </p>
              </div>
            </div>

            <h3 className="text-lg font-bold text-card-foreground mb-1">
              ¿A quién le enviamos el resultado?
            </h3>
            <p className="text-sm text-muted-foreground mb-5">
              Déjanos tus datos para guardar tu plan y que podamos contactarte cuando estés listo.
            </p>

            <div className="space-y-3 mb-6">
              <input
                type="text"
                placeholder="Tu nombre *"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full rounded-xl border border-border bg-background text-foreground px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="email"
                placeholder="Tu email *"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full rounded-xl border border-border bg-background text-foreground px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="tel"
                placeholder="Teléfono / WhatsApp (opcional)"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full rounded-xl border border-border bg-background text-foreground px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2.5 rounded-xl border-2 border-border text-sm font-medium text-card-foreground hover:border-primary/50 transition-colors cursor-pointer"
              >
                ← Atrás
              </button>
              <button
                type="button"
                onClick={handleContactSubmit}
                disabled={saving || !contactName.trim() || !contactEmail.trim()}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}
              >
                {saving ? 'Guardando...' : 'Ver mi plan completo →'}
              </button>
            </div>
          </>
        )}

        {/* Result phase */}
        {phase === 'result' &&
          result &&
          (() => {
            const plan = PLAN_INFO[result];
            return (
              <div>
                <div
                  className={cn('rounded-2xl border-2 p-6 mb-5', plan.borderColor, plan.bgColor)}
                >
                  <p className={cn('text-xs font-bold uppercase tracking-widest mb-1', plan.color)}>
                    Plan recomendado para ti
                  </p>
                  <h3
                    className={cn('text-2xl font-extrabold mb-1', plan.color)}
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {plan.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-3">{plan.description}</p>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className={cn('text-4xl font-extrabold', plan.color)}>{plan.price}</span>
                    <span className="text-xs text-muted-foreground">
                      · Entrega: {plan.delivery}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {plan.includes.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-card-foreground"
                      >
                        <svg
                          className={cn('w-4 h-4 shrink-0 mt-0.5', plan.color)}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={handleWhatsApp}
                  className="w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 cursor-pointer mb-3"
                  style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}
                >
                  💬 Quiero empezar — Contactar por WhatsApp
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full py-2.5 rounded-xl border border-border text-sm text-muted-foreground hover:text-card-foreground transition-colors cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            );
          })()}
      </div>
    </Modal>
  );
}
