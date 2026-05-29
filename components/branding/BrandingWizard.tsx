'use client';

import type { BrandingPlanId } from '@/database/branding-questionnaire.model';
import { cn } from '@/lib/utils';
import { useState } from 'react';

// ─── Questions data ───────────────────────────────────────────────────────────

const QUESTIONS = [
  {
    id: 'q1',
    title: '¿En qué etapa se encuentra tu proyecto o empresa?',
    block: 'Bloque 1: El Momento Actual de tu Negocio',
    options: {
      A: 'Es una idea nueva, un proyecto personal o un negocio local que necesita empezar a rodar ya.',
      B: 'Es una empresa o PYME ya establecida (o que nace con fuerza) que busca diferenciarse de la competencia y posicionarse con seriedad en el mercado.',
      C: 'Es un modelo de negocio complejo que abarca o abarcará diferentes ramas, productos independientes o subdivisiones bajo un mismo nombre.',
    },
  },
  {
    id: 'q2',
    title:
      'Más allá del logotipo, ¿qué elementos visuales consideras indispensables para operar hoy?',
    block: 'Bloque 2: Las Necesidades Visuales',
    options: {
      A: 'Solo necesito el logo bien hecho, los colores correctos y las tipografías para combinarlos yo mismo en mis publicaciones básicas.',
      B: 'Necesito un universo visual completo: iconos propios, texturas, estilos fotográficos y el diseño de mis primeras aplicaciones (tarjetas, plantillas para redes o papelería).',
      C: 'Necesito todo lo anterior, además de un sistema que defina cómo convive mi marca principal con sus submarcas, con guías de diseño avanzadas para programadores y diseño de merchandising o señalética.',
    },
  },
  {
    id: 'q3',
    title:
      '¿Quién se encargará de diseñar los contenidos del día a día de tu marca una vez te entreguemos el proyecto?',
    block: 'Bloque 3: Gestión y Autonomía',
    options: {
      A: 'Yo mismo o una persona interna del equipo de forma muy empírica; con una guía de uso rápida y clara en PDF nos basta.',
      B: 'Un diseñador in-house o una agencia externa; necesitamos un Manual de Identidad completo y profesional para asegurar que nadie deforme la marca.',
      C: 'Múltiples equipos, programadores, impresores y creadores de contenido a gran escala; necesitamos un manual técnico riguroso de normas gráficas y producción.',
    },
  },
  {
    id: 'q4',
    title:
      '¿Qué rango de inversión tienes proyectado exclusivamente para la creación de tu identidad visual?',
    block: 'Bloque 4: Realidad Presupuestaria',
    options: {
      A: 'Alrededor de $100 USD. Estoy priorizando un arranque rápido y económico.',
      B: 'Entre $300 y $500 USD. Entiendo el diseño como una inversión estratégica a mediano/largo plazo para mi empresa.',
      C: 'Más de $550 USD. Busco un despliegue total, asesoría en arquitectura de marca y un blindaje de diseño premium.',
    },
  },
] as const;

// ─── Plan result data ─────────────────────────────────────────────────────────

const PLAN_RESULTS: Record<
  BrandingPlanId,
  {
    name: string;
    price: string;
    deliveryDays: string;
    description: string;
    color: string;
    borderColor: string;
    includes: string[];
  }
> = {
  essential: {
    name: 'PLAN ESENCIAL',
    price: '$100 USD',
    deliveryDays: '5 a 7 días hábiles',
    description:
      'Ideal para emprendedores individuales o pequeños negocios locales que necesitan empezar rápido y con buena imagen. Construcción de los elementos visuales mínimos y obligatorios para existir en el mercado.',
    color: 'text-emerald-500',
    borderColor: 'border-emerald-500/30',
    includes: [
      '1 propuesta conceptual fuerte + 1 ronda de ajustes menores (color, tipografía)',
      'Variantes del logo: versión horizontal, vertical e isotipo para redes sociales',
      'Paleta de colores (códigos HEX, RGB y CMYK)',
      'Tipografía corporativa (fuentes principales y secundarias)',
      'Guía de Uso Básica en PDF: cómo aplicar el logo, fondos correctos y errores a evitar',
    ],
  },
  corporate: {
    name: 'PLAN CORPORATIVO',
    price: '$300 USD',
    deliveryDays: '15 a 20 días hábiles',
    description:
      'Diseñado para PYMEs o marcas que buscan posicionarse con fuerza y diferenciarse de la competencia. Sistema visual completo con universo gráfico y manual de identidad.',
    color: 'text-primary',
    borderColor: 'border-primary/30',
    includes: [
      '2 propuestas conceptuales diferentes + 2 rondas de revisiones sobre la elegida',
      'Variantes del logo: versión horizontal, vertical e isotipo para redes sociales',
      'Paleta de colores (códigos HEX, RGB y CMYK)',
      'Tipografía corporativa (fuentes principales y secundarias)',
      'Universo Visual: patrones, texturas o iconografía propia que complementa la marca',
      'Manual de Identidad Visual Completo (dirección de arte, tono visual, retículas y áreas de restricción)',
      'Aplicaciones de Marca a elegir 3 o 4: papelería corporativa, plantillas para redes sociales o packaging básico',
    ],
  },
  global: {
    name: 'PLAN GLOBAL / PREMIUM',
    price: '$550 USD',
    deliveryDays: '60 días hábiles',
    description:
      'Para empresas consolidadas o proyectos con múltiples subdivisiones. Arquitectura de marca compleja y blindaje visual para grandes proyectos con submarcas, guías avanzadas y aplicaciones complejas.',
    color: 'text-amber-500',
    borderColor: 'border-amber-500/30',
    includes: [
      'Todo lo incluido en el Plan Corporativo',
      '2 o 3 propuestas conceptuales + 3 rondas de revisiones detalladas',
      'Arquitectura de Marca: diseño del sistema de submarcas y cómo conviven con la marca madre',
      'Manual de Identidad Visual Completo con normas gráficas para producción a gran escala',
      'Universo Visual: patrones, texturas o iconografía propia que complementa la marca',
      'Aplicaciones de Marca a elegir 10 piezas: papelería, redes sociales, packaging, merchandising, señalética y más',
    ],
  },
};

// ─── Types ────────────────────────────────────────────────────────────────────

type Answers = Partial<Record<'q1' | 'q2' | 'q3' | 'q4', 'A' | 'B' | 'C'>>;
type WizardState = 'quiz' | 'submitting' | 'result' | 'error';

interface BrandingWizardProps {
  token: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function BrandingWizard({ token }: BrandingWizardProps) {
  const [step, setStep] = useState(0); // 0-3 for questions, then result
  const [answers, setAnswers] = useState<Answers>({});
  const [wizardState, setWizardState] = useState<WizardState>('quiz');
  const [result, setResult] = useState<BrandingPlanId | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const currentQuestion = QUESTIONS[step];
  const currentAnswer = answers[currentQuestion?.id as keyof Answers];
  const isLastQuestion = step === QUESTIONS.length - 1;
  const totalSteps = QUESTIONS.length;

  const selectAnswer = (option: 'A' | 'B' | 'C') => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: option }));
  };

  const handleNext = async () => {
    if (!currentAnswer) return;

    if (!isLastQuestion) {
      setStep((s) => s + 1);
      return;
    }

    // Submit
    const finalAnswers = {
      q1: answers.q1!,
      q2: answers.q2!,
      q3: answers.q3!,
      q4: currentAnswer,
    };

    setWizardState('submitting');

    try {
      const res = await fetch(`/api/branding/${token}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: finalAnswers }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al enviar');
      }

      const data = await res.json();
      setResult(data.recommendedPlan as BrandingPlanId);
      setWizardState('result');
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Error inesperado');
      setWizardState('error');
    }
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const handleWhatsApp = () => {
    const plan = result ? PLAN_RESULTS[result] : null;
    const phone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '';
    const msg = encodeURIComponent(
      `Hola DualGrid! Acabo de completar el test de identidad visual y mi plan recomendado es *${plan?.name ?? ''}* (${plan?.price ?? ''}). Me gustaría agendar una sesión para arrancar. 🚀`,
    );
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  };

  // ── Result screen ────────────────────────────────────────────────────────────
  if (wizardState === 'result' && result) {
    const plan = PLAN_RESULTS[result];
    return (
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
              Tu plan ideal es
            </p>
            <h1 className={cn('text-4xl font-bold', plan.color)}>{plan.name}</h1>
            <p className="text-2xl font-semibold text-foreground">{plan.price}</p>
            <p className="text-sm text-muted-foreground">{plan.deliveryDays}</p>
          </div>

          {/* Description */}
          <div className="bg-muted/50 border border-border rounded-2xl p-5">
            <p className="text-base text-foreground leading-relaxed text-center">
              {plan.description}
            </p>
          </div>

          {/* Includes */}
          <div className={cn('border rounded-2xl p-5 space-y-3', plan.borderColor)}>
            <p className="text-sm font-semibold text-foreground uppercase tracking-wide">
              ¿Qué incluye?
            </p>
            <ul className="space-y-2">
              {plan.includes.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                  <span className={cn('mt-0.5 shrink-0 text-base leading-none', plan.color)}>
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <button
            onClick={handleWhatsApp}
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors w-full justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.134.558 4.132 1.533 5.864L.053 23.61a.5.5 0 0 0 .612.612l5.796-1.457A11.934 11.934 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.895 0-3.672-.502-5.21-1.38l-.375-.214-3.89.979.998-3.823-.235-.385A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
            </svg>
            Quiero agendar una sesión para arrancar este plan
          </button>
        </div>
      </div>
    );
  }

  // ── Error screen ─────────────────────────────────────────────────────────────
  if (wizardState === 'error') {
    return (
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="text-center space-y-4 max-w-md">
          <p className="text-destructive font-semibold">Hubo un error al enviar tus respuestas.</p>
          <p className="text-sm text-muted-foreground">{errorMsg}</p>
          <button onClick={() => setWizardState('quiz')} className="text-primary underline text-sm">
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  // ── Quiz screen ───────────────────────────────────────────────────────────────
  return (
    <div className="flex-1 flex flex-col items-center px-4 py-8">
      {/* Progress bar */}
      <div className="w-full max-w-2xl mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground font-medium">
            Pregunta {step + 1} de {totalSteps}
          </span>
          <span className="text-xs text-muted-foreground">
            {Math.round(((step + 1) / totalSteps) * 100)}%
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-500"
            style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="w-full max-w-2xl space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
            {currentQuestion.block}
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground leading-snug">
            {currentQuestion.title}
          </h2>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {(Object.entries(currentQuestion.options) as [string, string][]).map(([key, label]) => {
            const isSelected = currentAnswer === key;
            return (
              <button
                key={key}
                onClick={() => selectAnswer(key as 'A' | 'B' | 'C')}
                className={cn(
                  'w-full text-left p-4 rounded-xl border-2 transition-all duration-150 flex items-start gap-3',
                  isSelected
                    ? 'border-primary bg-primary/10 text-foreground'
                    : 'border-border bg-card text-foreground hover:border-primary/50 hover:bg-muted/50',
                )}
              >
                <span
                  className={cn(
                    'flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold mt-0.5',
                    isSelected
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border text-muted-foreground',
                  )}
                >
                  {key}
                </span>
                <span className="text-sm leading-relaxed">{label}</span>
              </button>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handleBack}
            disabled={step === 0}
            className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
          >
            ← Atrás
          </button>

          <button
            onClick={handleNext}
            disabled={!currentAnswer || wizardState === 'submitting'}
            className={cn(
              'px-6 py-2.5 rounded-xl font-semibold text-sm transition-all',
              currentAnswer && wizardState !== 'submitting'
                ? 'bg-primary text-primary-foreground hover:opacity-90'
                : 'bg-muted text-muted-foreground cursor-not-allowed',
            )}
          >
            {wizardState === 'submitting'
              ? 'Calculando...'
              : isLastQuestion
                ? 'Ver mi Plan Ideal'
                : 'Siguiente →'}
          </button>
        </div>
      </div>
    </div>
  );
}
