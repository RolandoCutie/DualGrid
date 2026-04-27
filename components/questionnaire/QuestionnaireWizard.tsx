'use client';

import { Button } from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
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

const STEP_LABELS = ['Contacto', 'Negocio', 'Objetivos', 'Presupuesto', 'Estilo', 'Contenido'];

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
}

export default function QuestionnaireWizard({ open, onClose }: QuestionnaireWizardProps) {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<QuestionnaireAnswers>(DEFAULT_ANSWERS);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ plan: PlanId; scores: Record<PlanId, number> } | null>(
    null,
  );

  const totalSteps = 6;
  const isLastStep = step === totalSteps;
  const isResult = result !== null;

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
    if (isResult) {
      setResult(null);
      setStep(totalSteps);
    } else {
      setStep((s) => Math.max(s - 1, 1));
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const { recommended, scores } = recommendPlan(answers);

      await fetch('/api/questionnaires', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, recommendedPlan: recommended, score: scores }),
      });

      setResult({ plan: recommended, scores });
    } catch {
      // Still show result even if save fails
      const { recommended, scores } = recommendPlan(answers);
      setResult({ plan: recommended, scores });
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset after animation
    setTimeout(() => {
      setStep(1);
      setAnswers(DEFAULT_ANSWERS);
      setResult(null);
    }, 300);
  };

  const handleContactClick = () => {
    const phone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '';
    const msg = encodeURIComponent(
      `Hola! Completé el cuestionario de DualGrid y me interesa el plan *${result?.plan}*. Mi nombre es ${answers.fullName}.`,
    );
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
    if (isResult && result) {
      return (
        <StepResult
          recommendedPlan={result.plan}
          scores={result.scores}
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

  return (
    <Modal open={open} onClose={handleClose} size="xl">
      <div className="p-6 sm:p-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              {isResult ? 'Tu recomendación' : `Paso ${step} de ${totalSteps}`}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-card-foreground">
            {isResult ? 'Resultados del análisis' : 'Cuestionario de proyecto'}
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            {isResult
              ? 'Basado en tus respuestas, encontramos la solución ideal para ti.'
              : 'Responde unas preguntas para que podamos recomendarte el mejor plan.'}
          </p>
        </div>

        {/* Step indicator */}
        {!isResult && (
          <div className="mb-6">
            <StepIndicator currentStep={step} totalSteps={totalSteps} labels={STEP_LABELS} />
          </div>
        )}

        {/* Step content */}
        <div className="min-h-[300px]">{stepComponent()}</div>

        {/* Navigation */}
        {!isResult && (
          <div className="flex items-center justify-between gap-4 mt-8 pt-5 border-t border-border">
            <Button variant="outline" size="md" onClick={handleBack} disabled={step === 1}>
              Anterior
            </Button>
            <Button size="md" onClick={handleNext} loading={submitting} disabled={!canProceed()}>
              {isLastStep ? 'Ver mi recomendación →' : 'Siguiente →'}
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
