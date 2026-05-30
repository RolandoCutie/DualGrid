'use client';

import { Button } from '@/components/ui/Button';
import { DICTS, useLanguage } from '@/components/ui/LanguageProvider';
import Modal from '@/components/ui/Modal';
import { PLAN_MAP } from '@/lib/plans';
import { recommendPlan } from '@/lib/recommendation';
import type { PlanId, QuestionnaireAnswers } from '@/types';
import { useState } from 'react';
import StepIndicator from './StepIndicator';
import Step1Contact from './steps/Step1Contact';
import Step2Business from './steps/Step2Business';
import Step3Goals from './steps/Step3Goals';
import Step4Budget from './steps/Step4Budget';
import Step5Style from './steps/Step5Style';
import Step6Content from './steps/Step6Content';
import StepResult from './steps/StepResult';

const DEFAULT_ANSWERS: QuestionnaireAnswers = {
  fullName: '',
  businessName: '',
  email: '',
  phone: '',
  referralSource: '',
  businessType: '',
  businessDescription: '',
  businessAge: '',
  mainServices: '',
  onlinePresence: '',
  targetAudience: '',
  primaryGoal: [],
  primaryAction: [],
  desiredPages: [],
  specialFeatures: [],
  differentiation: '',
  budget: '',
  deadline: '',
  hasDomain: false,
  needsCMS: '',
  successDefinition: '',
  visualStyle: [],
  hasLogo: null,
  brandColors: '',
  referenceWebsites: '',
  visualFeeling: '',
  brandEssence: '',
  brandValues: '',
  brandNoDos: '',
  logoSpecificElements: '',
  priorBrandPresence: '',
  logoWords: '',
  logoInspiration: '',
  hasPhotos: false,
  hasTexts: false,
  clientContentDeadline: '',
  socialMedia: '',
  siteLanguages: '',
  priorWebExperience: '',
  concerns: '',
  extraNotes: '',
};

interface QuestionnaireWizardProps {
  open: boolean;
  onClose: () => void;
  /** When the user clicked a specific plan's CTA, pass its ID here */
  selectedPlan?: PlanId;
}

// ─── Label maps for human-readable WhatsApp message ───────────────────────────

const WA_BUSINESS_TYPE: Record<string, string> = {
  creative: 'Artista / Creativo',
  restaurant: 'Restaurante / Bar',
  entrepreneur: 'Emprendedor',
  professional: 'Profesional (médico, abogado, etc.)',
  ecommerce: 'Tienda / E-commerce',
  blogger: 'Creador de contenido / Blogger',
  other: 'Otro',
};
const WA_BUSINESS_AGE: Record<string, string> = {
  new: 'Nuevo / idea',
  under_1: 'Menos de 1 año',
  '1_3': '1–3 años',
  '3_5': '3–5 años',
  over_5: 'Más de 5 años',
};
const WA_ONLINE_PRESENCE: Record<string, string> = {
  none: 'Sin presencia online',
  social_only: 'Solo redes sociales',
  has_website: 'Ya tiene sitio web',
};
const WA_GOAL: Record<string, string> = {
  more_clients: 'Conseguir más clientes',
  show_work: 'Mostrar mi trabajo',
  give_info: 'Dar información del negocio',
  credibility: 'Generar credibilidad',
  sell_online: 'Vender productos / servicios',
  reservations: 'Gestionar reservas / citas',
  grow_audience: 'Crecer mi audiencia',
};
const WA_ACTION: Record<string, string> = {
  whatsapp_contact: 'Contactar por WhatsApp',
  contact_form: 'Llenar formulario de contacto',
  call: 'Llamar por teléfono',
  book_appointment: 'Reservar cita / mesa',
  buy_product: 'Comprar producto / servicio',
  view_portfolio: 'Ver portafolio',
  download: 'Descargar (menú, catálogo...)',
  request_quote: 'Solicitar cotización',
  subscribe: 'Suscribirse al newsletter',
};
const WA_PAGES: Record<string, string> = {
  home: 'Inicio',
  about: 'Sobre mí / Nosotros',
  services: 'Servicios',
  portfolio: 'Portafolio / Galería',
  pricing: 'Precios',
  testimonials: 'Testimonios',
  blog: 'Blog',
  contact: 'Contacto',
  faq: 'Preguntas frecuentes',
  menu: 'Menú (restaurante)',
  shop: 'Tienda online',
  reservations: 'Reservas / Citas',
  location: 'Ubicación / Mapa',
};
const WA_FEATURES: Record<string, string> = {
  whatsapp_btn: 'Botón WhatsApp',
  contact_form: 'Formulario de contacto',
  map: 'Mapa de ubicación',
  gallery: 'Galería de fotos/videos',
  video_banner: 'Video en portada',
  newsletter: 'Newsletter',
  booking: 'Reservas / citas online',
  live_chat: 'Chat en vivo',
  multilang: 'Sitio multiidioma',
  reviews: 'Reseñas / testimonios',
  social_feed: 'Feed de Instagram/redes',
  faq: 'Preguntas frecuentes',
};
const WA_BUDGET: Record<string, string> = {
  under_150: 'Menos de $150 USD',
  '150_300': '$150 – $300 USD',
  '300_500': '$300 – $500 USD',
  '500_800': '$500 – $800 USD',
  '800_1500': '$800 – $1,500 USD',
  over_1500: 'Más de $1,500 USD',
};
const WA_DEADLINE: Record<string, string> = {
  urgent: 'Lo antes posible',
  '2_weeks': 'En 2 semanas',
  '1_month': 'En 1 mes',
  '2_3_months': 'En 2–3 meses',
  no_rush: 'Sin prisa / flexible',
};
const WA_CMS: Record<string, string> = {
  frequently: 'Sí, frecuentemente (menú, blog, precios...)',
  occasionally: 'Sí, ocasionalmente',
  no: 'No, ustedes se encargan',
};
const WA_STYLE: Record<string, string> = {
  minimal: 'Minimalista',
  modern: 'Moderno',
  elegant: 'Elegante',
  colorful: 'Colorido',
  rustic: 'Rústico',
  corporate: 'Corporativo',
  creative: 'Creativo',
  vintage: 'Vintage',
  fun: 'Divertido',
};
const WA_SITE_LANG: Record<string, string> = {
  es: 'Solo español 🇪🇸',
  en: 'Solo inglés 🇺🇸',
  both: 'Bilingüe (ES + EN) 🌐',
};
const WA_REFERRAL: Record<string, string> = {
  social_media: 'Redes sociales',
  referral: 'Recomendación de alguien',
  google: 'Google',
  other: 'Otro',
};

/** Translate a single key using a label map, falling back to the raw key */
function l(map: Record<string, string>, key: string): string {
  return map[key] ?? key;
}
/** Translate an array of keys and join them with ", " */
function lArr(map: Record<string, string>, keys: string[]): string {
  return keys.map((k) => map[k] ?? k).join(', ');
}

function buildWhatsAppMessage(answers: QuestionnaireAnswers, planId: PlanId | string): string {
  const plan = PLAN_MAP[planId as PlanId];
  const planName = plan?.name ?? planId;

  const lines: string[] = [];
  lines.push(`🌐 *Nueva consulta – DualGrid*`);
  lines.push('');
  lines.push(`📋 *Plan de interés:* ${planName}`);
  lines.push('');
  lines.push(`👤 *Datos de contacto*`);
  lines.push(`• Nombre: ${answers.fullName}`);
  if (answers.businessName) lines.push(`• Empresa/Negocio: ${answers.businessName}`);
  if (answers.email) lines.push(`• Email: ${answers.email}`);
  if (answers.phone) lines.push(`• Teléfono: ${answers.phone}`);
  if (answers.referralSource)
    lines.push(`• Nos encontró por: ${l(WA_REFERRAL, answers.referralSource)}`);
  lines.push('');
  lines.push(`🏢 *Negocio*`);
  if (answers.businessType)
    lines.push(`• Tipo de negocio: ${l(WA_BUSINESS_TYPE, answers.businessType)}`);
  if (answers.businessAge) lines.push(`• Antigüedad: ${l(WA_BUSINESS_AGE, answers.businessAge)}`);
  if (answers.onlinePresence)
    lines.push(`• Presencia online actual: ${l(WA_ONLINE_PRESENCE, answers.onlinePresence)}`);
  if (answers.businessDescription)
    lines.push(`• Descripción del negocio: ${answers.businessDescription}`);
  if (answers.mainServices) lines.push(`• Servicios principales: ${answers.mainServices}`);
  if (answers.targetAudience) lines.push(`• Público objetivo: ${answers.targetAudience}`);
  lines.push('');
  lines.push(`🎯 *Objetivos y funcionalidades*`);
  if (answers.primaryGoal.length)
    lines.push(`• Objetivo(s) principal(es): ${lArr(WA_GOAL, answers.primaryGoal)}`);
  if (answers.primaryAction.length)
    lines.push(
      `• Acción que quiero que hagan los visitantes: ${lArr(WA_ACTION, answers.primaryAction)}`,
    );
  if (answers.desiredPages.length)
    lines.push(`• Páginas deseadas: ${lArr(WA_PAGES, answers.desiredPages)}`);
  if (answers.specialFeatures.length)
    lines.push(`• Funcionalidades especiales: ${lArr(WA_FEATURES, answers.specialFeatures)}`);
  if (answers.differentiation)
    lines.push(`• ¿Qué te diferencia de la competencia?: ${answers.differentiation}`);
  lines.push('');
  lines.push(`💰 *Presupuesto y plazos*`);
  if (answers.budget) lines.push(`• Presupuesto aproximado: ${l(WA_BUDGET, answers.budget)}`);
  if (answers.deadline) lines.push(`• Plazo deseado: ${l(WA_DEADLINE, answers.deadline)}`);
  lines.push(`• ¿Ya tiene dominio?: ${answers.hasDomain ? 'Sí' : 'No'}`);
  if (answers.needsCMS)
    lines.push(`• ¿Necesita actualizar contenido él mismo?: ${l(WA_CMS, answers.needsCMS)}`);
  if (answers.successDefinition)
    lines.push(`• Cómo define el éxito del proyecto: ${answers.successDefinition}`);
  lines.push('');
  lines.push(`🎨 *Estilo y marca*`);
  if (answers.visualStyle.length)
    lines.push(`• Estilo visual preferido: ${lArr(WA_STYLE, answers.visualStyle)}`);
  lines.push(`• ¿Tiene logo?: ${answers.hasLogo ? 'Sí' : 'No'}`);
  if (answers.brandColors) lines.push(`• Colores de marca: ${answers.brandColors}`);
  if (answers.referenceWebsites)
    lines.push(`• Sitios web de referencia: ${answers.referenceWebsites}`);
  if (answers.visualFeeling)
    lines.push(`• Sensación que quiere transmitir: ${answers.visualFeeling}`);
  if (answers.brandEssence)
    lines.push(`• Esencia del negocio en 3 palabras: ${answers.brandEssence}`);
  if (answers.brandValues) lines.push(`• Valores / sensaciones de marca: ${answers.brandValues}`);
  if (answers.brandNoDos) lines.push(`• Lo que definitivamente NO quiere: ${answers.brandNoDos}`);
  if (answers.logoSpecificElements)
    lines.push(`• Elementos específicos para el logo: ${answers.logoSpecificElements}`);
  if (answers.priorBrandPresence)
    lines.push(`• Identidad visual previa: ${answers.priorBrandPresence}`);
  if (answers.logoWords) lines.push(`• Palabras que debe llevar el logo: ${answers.logoWords}`);
  if (answers.logoInspiration)
    lines.push(`• Logos / marcas de inspiración: ${answers.logoInspiration}`);
  lines.push('');
  lines.push(`📁 *Contenido disponible*`);
  lines.push(`• ¿Tiene fotos profesionales?: ${answers.hasPhotos ? 'Sí' : 'No'}`);
  lines.push(`• ¿Tiene textos redactados?: ${answers.hasTexts ? 'Sí' : 'No'}`);
  if (answers.clientContentDeadline)
    lines.push(`• Contenido que aportará y cuándo: ${answers.clientContentDeadline}`);
  if (answers.siteLanguages)
    lines.push(`• Idioma(s) del sitio: ${l(WA_SITE_LANG, answers.siteLanguages)}`);
  if (answers.socialMedia) lines.push(`• Redes sociales del negocio: ${answers.socialMedia}`);
  if (answers.priorWebExperience)
    lines.push(
      `• ¿Ha trabajado antes con un desarrollador web?: ${answers.priorWebExperience === 'yes' ? 'Sí' : 'No, es su primera vez'}`,
    );
  if (answers.concerns) lines.push(`• Preocupaciones / dudas: ${answers.concerns}`);
  if (answers.extraNotes) lines.push(`• Notas adicionales: ${answers.extraNotes}`);
  return lines.join('\n');
}

export default function QuestionnaireWizard({
  open,
  onClose,
  selectedPlan,
}: QuestionnaireWizardProps) {
  const { t, tArray, locale } = useLanguage();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<QuestionnaireAnswers>(DEFAULT_ANSWERS);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [finalPlan, setFinalPlan] = useState<PlanId | null>(null);
  const [finalScores, setFinalScores] = useState<Record<PlanId, number> | null>(null);

  const totalSteps = 6;
  const isLastStep = step === totalSteps;

  const updateAnswers = (partial: Partial<QuestionnaireAnswers>) => {
    setAnswers((prev) => ({ ...prev, ...partial }));
  };

  const handleNext = async () => {
    if (isLastStep) {
      await handleSubmit();
    } else {
      setStep((s) => Math.min(s + 1, totalSteps));
    }
  };

  const handleBack = () => {
    if (done) {
      setDone(false);
      setStep(totalSteps);
    } else {
      setStep((s) => Math.max(s - 1, 1));
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    let plan: PlanId;
    let scores: Record<PlanId, number> | null = null;
    try {
      if (selectedPlan) {
        plan = selectedPlan;
        const result = recommendPlan(answers);
        scores = result.scores;
      } else {
        const { recommended, scores: s } = recommendPlan(answers);
        plan = recommended;
        scores = s;
      }

      await fetch('/api/questionnaires', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers,
          recommendedPlan: plan,
          selectedPlan: selectedPlan ?? null,
          score: scores ?? {},
        }),
      });
    } catch {
      const result = recommendPlan(answers);
      plan = selectedPlan ?? result.recommended;
      scores = result.scores;
    } finally {
      setSubmitting(false);
    }
    setFinalPlan(plan!);
    setFinalScores(scores);
    setDone(true);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setAnswers(DEFAULT_ANSWERS);
      setDone(false);
      setFinalPlan(null);
      setFinalScores(null);
    }, 300);
  };

  const handleContactClick = () => {
    const phone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '';
    const plansData = DICTS[locale].plans_data as Record<string, { name: string }>;
    const planLabel = finalPlan
      ? (plansData[finalPlan]?.name ?? PLAN_MAP[finalPlan]?.name ?? finalPlan)
      : t('questionnaire.done_plan_label');
    const msg = encodeURIComponent(buildWhatsAppMessage(answers, planLabel));
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
    handleClose();
  };

  const canProceed = (): boolean => {
    if (step === 1) return answers.fullName.length > 0 && answers.email.length > 0;
    if (step === 2) return answers.businessType !== '';
    if (step === 3) return answers.primaryGoal.length > 0;
    if (step === 4) return answers.budget !== '';
    return true;
  };

  const stepComponent = () => {
    if (done) {
      return (
        <StepResult
          recommendedPlan={finalPlan!}
          scores={finalScores ?? ({} as Record<PlanId, number>)}
          clientName={answers.fullName}
          onContactClick={handleContactClick}
        />
      );
    }
    switch (step) {
      case 1:
        return <Step1Contact answers={answers} onChange={updateAnswers} />;
      case 2:
        return <Step2Business answers={answers} onChange={updateAnswers} />;
      case 3:
        return <Step3Goals answers={answers} onChange={updateAnswers} />;
      case 4:
        return <Step4Budget answers={answers} onChange={updateAnswers} />;
      case 5:
        return <Step5Style answers={answers} onChange={updateAnswers} />;
      case 6:
        return <Step6Content answers={answers} onChange={updateAnswers} />;
      default:
        return null;
    }
  };

  const stepLabels = tArray('questionnaire.step_labels');

  const headerSubtitle = (() => {
    if (done) return t('questionnaire.done_subtitle');
    if (selectedPlan && PLAN_MAP[selectedPlan]) {
      const plansData = DICTS[locale].plans_data as Record<string, { name: string }>;
      const planName = plansData[selectedPlan]?.name ?? PLAN_MAP[selectedPlan].name;
      return locale === 'es'
        ? `Cuéntanos sobre tu proyecto para el plan *${planName}*.`
        : `Tell us about your project for the *${planName}* plan.`;
    }
    return t('questionnaire.subtitle');
  })();

  return (
    <Modal open={open} onClose={handleClose} size="xl">
      <div className="p-6 sm:p-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              {done
                ? t('questionnaire.done_badge')
                : `${t('questionnaire.step')} ${step} ${t('questionnaire.of')} ${totalSteps}`}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-card-foreground">
            {done ? t('questionnaire.done_title') : t('questionnaire.title')}
          </h2>
          <p className="text-muted-foreground text-sm mt-1">{headerSubtitle}</p>
        </div>

        {/* Step indicator */}
        {!done && (
          <div className="mb-6">
            <StepIndicator currentStep={step} totalSteps={totalSteps} labels={stepLabels} />
          </div>
        )}

        {/* Step content */}
        <div className="min-h-[300px]">{stepComponent()}</div>

        {/* Navigation */}
        {!done && (
          <div className="flex items-center justify-between gap-4 mt-8 pt-5 border-t border-border">
            <Button variant="outline" size="md" onClick={handleBack} disabled={step === 1}>
              {t('questionnaire.btn_back')}
            </Button>
            <Button size="md" onClick={handleNext} loading={submitting} disabled={!canProceed()}>
              {isLastStep ? t('questionnaire.btn_submit') : t('questionnaire.btn_next')}
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
