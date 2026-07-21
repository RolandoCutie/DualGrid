'use client';

import { Button } from '@/components/ui/Button';
import { DICTS, useLanguage } from '@/components/ui/LanguageProvider';
import { PLAN_MAP } from '@/lib/plans';
import { recommendPlan } from '@/lib/recommendation';
import type { PlanId, QuestionnaireAnswers } from '@/types';
import { useEffect, useState } from 'react';
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

export default function PublicQuestionnairePageClient() {
  const { t, tArray, locale } = useLanguage();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<QuestionnaireAnswers>(() => {
    if (typeof window === 'undefined') return DEFAULT_ANSWERS;
    try {
      const saved = localStorage.getItem('dg_questionnaire_draft');
      if (saved) return { ...DEFAULT_ANSWERS, ...JSON.parse(saved) };
    } catch {
      // ignore
    }
    return DEFAULT_ANSWERS;
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [finalPlan, setFinalPlan] = useState<PlanId | null>(null);
  const [finalScores, setFinalScores] = useState<Record<PlanId, number> | null>(null);

  // Persist draft on every change
  useEffect(() => {
    if (done) return;
    try {
      localStorage.setItem('dg_questionnaire_draft', JSON.stringify(answers));
    } catch {
      // storage unavailable
    }
  }, [answers, done]);

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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (done) {
      setDone(false);
      setStep(totalSteps);
    } else {
      setStep((s) => Math.max(s - 1, 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    let plan: PlanId;
    let scores: Record<PlanId, number> | null = null;
    try {
      const { recommended, scores: s } = recommendPlan(answers);
      plan = recommended;
      scores = s;

      await fetch('/api/questionnaires', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers,
          recommendedPlan: plan,
          selectedPlan: null,
          score: scores ?? {},
        }),
      });
    } catch {
      const result = recommendPlan(answers);
      plan = result.recommended;
      scores = result.scores;
    } finally {
      setSubmitting(false);
    }

    try {
      localStorage.removeItem('dg_questionnaire_draft');
    } catch {
      // noop
    }

    setFinalPlan(plan!);
    setFinalScores(scores);
    setDone(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContactClick = () => {
    const phone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '';
    const plansData = DICTS[locale].plans_data as Record<string, { name: string }>;
    const planLabel = finalPlan
      ? (plansData[finalPlan]?.name ?? PLAN_MAP[finalPlan]?.name ?? finalPlan)
      : t('questionnaire.done_plan_label');
    const msg = encodeURIComponent(planLabel);
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  };

  const canProceed = (): boolean => {
    if (step === 1) return answers.fullName.length > 0 && answers.email.length > 0;
    if (step === 2) return answers.businessType !== '';
    if (step === 3) return answers.primaryGoal.length > 0;
    if (step === 4) return answers.budget !== '';
    return true;
  };

  const stepLabels = tArray('questionnaire.step_labels');

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

  return (
    <div className="min-h-screen py-12 px-4">
      {/* Background glow */}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -10%, #00d9ff15 0%, transparent 70%),
            radial-gradient(ellipse 60% 60% at 80% 90%, #00ff9d10 0%, transparent 60%),
            #000000
          `,
        }}
      />

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          {!done && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                {t('questionnaire.step')} {step} {t('questionnaire.of')} {totalSteps}
              </span>
            </div>
          )}
          <h1
            className="text-3xl font-bold text-card-foreground"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {done ? t('questionnaire.done_title') : t('questionnaire.title')}
          </h1>
          <p className="text-muted-foreground text-sm mt-2 max-w-md mx-auto">
            {done ? t('questionnaire.done_subtitle') : t('questionnaire.subtitle')}
          </p>
        </div>

        {/* Step indicator */}
        {!done && (
          <div className="mb-8">
            <StepIndicator currentStep={step} totalSteps={totalSteps} labels={stepLabels} />
          </div>
        )}

        {/* Card with step content */}
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="min-h-[320px]">{stepComponent()}</div>

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

        {/* Progress bar */}
        {!done && (
          <div className="mt-4 h-1 w-full bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 rounded-full"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
