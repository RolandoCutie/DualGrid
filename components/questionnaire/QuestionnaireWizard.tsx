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

const DEFAULT_ANSWERS: QuestionnaireAnswers = {
  fullName: '',
  businessName: '',
  email: '',
  phone: '',
  businessType: '',
  businessDescription: '',
  onlinePresence: '',
  primaryGoal: '',
  primaryAction: '',
  desiredPages: [],
  budget: '',
  deadline: '',
  hasDomain: false,
  visualStyle: [],
  hasLogo: false,
  brandColors: '',
  referenceWebsites: '',
  hasPhotos: false,
  hasTexts: false,
  extraNotes: '',
};

interface QuestionnaireWizardProps {
  open: boolean;
  onClose: () => void;
  /** When the user clicked a specific plan's CTA, pass its ID here */
  selectedPlan?: PlanId;
}

function buildWhatsAppMessage(answers: QuestionnaireAnswers, planId: PlanId | string): string {
  const lines: string[] = [];
  lines.push(`🌐 *Nueva consulta – DualGrid*`);
  lines.push('');
  lines.push(`📋 *Plan de interés:* ${planId}`);
  lines.push('');
  lines.push(`👤 *Datos de contacto*`);
  lines.push(`• Nombre: ${answers.fullName}`);
  if (answers.businessName) lines.push(`• Empresa/Negocio: ${answers.businessName}`);
  if (answers.email) lines.push(`• Email: ${answers.email}`);
  if (answers.phone) lines.push(`• Teléfono: ${answers.phone}`);
  lines.push('');
  lines.push(`🏢 *Negocio*`);
  if (answers.businessType) lines.push(`• Tipo: ${answers.businessType}`);
  if (answers.onlinePresence) lines.push(`• Presencia online: ${answers.onlinePresence}`);
  if (answers.businessDescription) lines.push(`• Descripción: ${answers.businessDescription}`);
  lines.push('');
  lines.push(`🎯 *Objetivos*`);
  if (answers.primaryGoal) lines.push(`• Objetivo principal: ${answers.primaryGoal}`);
  if (answers.desiredPages.length)
    lines.push(`• Páginas deseadas: ${answers.desiredPages.join(', ')}`);
  lines.push('');
  lines.push(`💰 *Presupuesto y plazos*`);
  if (answers.budget) lines.push(`• Presupuesto: ${answers.budget}`);
  if (answers.deadline) lines.push(`• Plazo: ${answers.deadline}`);
  lines.push(`• Tiene dominio: ${answers.hasDomain ? 'Sí' : 'No'}`);
  lines.push('');
  lines.push(`🎨 *Estilo y marca*`);
  if (answers.visualStyle.length) lines.push(`• Estilo visual: ${answers.visualStyle.join(', ')}`);
  lines.push(`• Tiene logo: ${answers.hasLogo ? 'Sí' : 'No'}`);
  if (answers.brandColors) lines.push(`• Colores de marca: ${answers.brandColors}`);
  if (answers.referenceWebsites) lines.push(`• Referencias: ${answers.referenceWebsites}`);
  lines.push('');
  lines.push(`📁 *Contenido disponible*`);
  lines.push(`• Fotos profesionales: ${answers.hasPhotos ? 'Sí' : 'No'}`);
  lines.push(`• Textos redactados: ${answers.hasTexts ? 'Sí' : 'No'}`);
  if (answers.extraNotes) lines.push(`• Notas: ${answers.extraNotes}`);
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
    try {
      if (selectedPlan) {
        plan = selectedPlan;
      } else {
        const { recommended } = recommendPlan(answers);
        plan = recommended;
      }

      await fetch('/api/questionnaires', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers,
          recommendedPlan: plan,
          selectedPlan: selectedPlan ?? null,
        }),
      });
    } catch {
      plan = selectedPlan ?? recommendPlan(answers).recommended;
    } finally {
      setSubmitting(false);
    }
    setFinalPlan(plan!);
    setDone(true);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setAnswers(DEFAULT_ANSWERS);
      setDone(false);
      setFinalPlan(null);
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
    if (step === 3) return answers.primaryGoal !== '';
    if (step === 4) return answers.budget !== '';
    return true;
  };

  const stepComponent = () => {
    if (done) {
      const plansData = DICTS[locale].plans_data as Record<string, { name: string }>;
      const planName = finalPlan
        ? (plansData[finalPlan]?.name ?? PLAN_MAP[finalPlan]?.name ?? finalPlan)
        : t('questionnaire.done_plan_label');
      const firstName = answers.fullName.split(' ')[0];
      const greeting = firstName
        ? t('questionnaire.done_greeting_name').replace('{name}', firstName)
        : t('questionnaire.done_greeting');
      const bodyText = selectedPlan
        ? t('questionnaire.done_body_plan').replace('{plan}', planName)
        : t('questionnaire.done_body');
      return (
        <div className="text-center py-6 space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-2">
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-primary"
            >
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-card-foreground">{greeting}</h3>
            <p className="text-muted-foreground mt-2 max-w-sm mx-auto text-sm">{bodyText}</p>
          </div>
          <div className="bg-muted/50 rounded-2xl p-4 text-left max-w-xs mx-auto">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              {t('questionnaire.done_plan_label')}
            </p>
            <p className="text-base font-bold text-card-foreground">{planName}</p>
          </div>
          <Button size="lg" onClick={handleContactClick} className="w-full sm:w-auto">
            {t('questionnaire.btn_whatsapp')}
          </Button>
          <p className="text-xs text-muted-foreground">
            {t('questionnaire.done_wait')} <span className="font-medium">{answers.email}</span>
          </p>
        </div>
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
