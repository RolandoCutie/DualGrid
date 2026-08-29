import { useLanguage } from '@/components/ui/LanguageProvider';
import Modal from '@/components/ui/Modal';
import { calcBrandingScore } from '@/lib/branding-recommendation';
import { cn } from '@/lib/utils';
import { useState } from 'react';

type Answer = 'A' | 'B' | 'C';
type Answers = Partial<Record<'q1' | 'q2' | 'q3' | 'q4', Answer>>;
type Phase = 'quiz' | 'contact' | 'result';

const PLAN_INFO = {
  essential: {
    key: 'essential',
    color: 'text-emerald-500',
    borderColor: 'border-emerald-500/40',
    bgColor: 'bg-emerald-500/5',
  },
  corporate: {
    key: 'corporate',
    color: 'text-primary',
    borderColor: 'border-primary/40',
    bgColor: 'bg-primary/5',
  },
  global: {
    key: 'global',
    color: 'text-amber-500',
    borderColor: 'border-amber-500/40',
    bgColor: 'bg-amber-500/5',
  },
} as const;

interface BrandingQuizModalProps {
  open: boolean;
  onClose: () => void;
}

export default function BrandingQuizModal({ open, onClose }: BrandingQuizModalProps) {
  const { t } = useLanguage();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [result, setResult] = useState<keyof typeof PLAN_INFO | null>(null);
  const [phase, setPhase] = useState<Phase>('quiz');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const questionIds = ['q1', 'q2', 'q3', 'q4'] as const;
  const currentQuestionId = questionIds[step];
  const currentAnswer = answers[currentQuestionId];
  const isLastQuestion = step === questionIds.length - 1;
  const currentQuestionNumber = String(step + 1);

  const getPlanInfo = (planKey: string) => {
    return {
      name: t(`branding_quiz.plan_${planKey}_name`),
      price: t(`branding_quiz.plan_${planKey}_price`),
      delivery: t(`branding_quiz.plan_${planKey}_delivery`),
      description: t(`branding_quiz.plan_${planKey}_desc`),
      includes: [
        t(`branding_quiz.plan_${planKey}_includes_1`),
        t(`branding_quiz.plan_${planKey}_includes_2`),
        t(`branding_quiz.plan_${planKey}_includes_3`),
        t(`branding_quiz.plan_${planKey}_includes_4`),
        t(`branding_quiz.plan_${planKey}_includes_5`),
      ],
    };
  };

  const getQuestion = (qId: string) => {
    return {
      block: t(`branding_quiz.question_${qId}_block`),
      title: t(`branding_quiz.question_${qId}_title`),
      options: {
        A: t(`branding_quiz.question_${qId}_a`),
        B: t(`branding_quiz.question_${qId}_b`),
        C: t(`branding_quiz.question_${qId}_c`),
      },
    };
  };

  const currentQuestion = getQuestion(currentQuestionNumber);

  const handleSelect = (option: Answer) => {
    setAnswers((prev) => ({ ...prev, [currentQuestionId]: option }));
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
      setSubmitted(true);
    } catch {
      // Fail silently — still show result to the user
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} size="lg">
      <div className="p-8">
        {/* Quiz Phase */}
        {phase === 'quiz' && (
          <div className="space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-primary uppercase tracking-widest">
                  {t('branding_quiz.step_label')} {step + 1} {t('branding_quiz.step_of')}{' '}
                  {questionIds.length}
                </span>
                <span className="text-xs text-muted-foreground">
                  {step + 1}/{questionIds.length}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-card-foreground leading-snug">
                {currentQuestion.title}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {(['A', 'B', 'C'] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleSelect(opt)}
                  className={cn(
                    'w-full p-4 rounded-lg border-2 text-left transition-all duration-200',
                    currentAnswer === opt
                      ? 'border-primary bg-primary/10 text-card-foreground'
                      : 'border-border bg-card hover:border-primary/40 text-card-foreground',
                  )}
                >
                  <span className="font-semibold text-primary mr-3">{opt}</span>
                  {currentQuestion.options[opt]}
                </button>
              ))}
            </div>

            {/* Progress indicator */}
            <div className="flex gap-2">
              {questionIds.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'h-1 flex-1 rounded-full transition-all',
                    i <= step ? 'bg-primary' : 'bg-border',
                  )}
                />
              ))}
            </div>

            {/* Navigation buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleBack}
                disabled={step === 0}
                className="px-6 py-3 rounded-xl border border-border text-card-foreground hover:border-primary/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                {t('branding_quiz.back_button')}
              </button>
              <button
                onClick={handleNext}
                disabled={!currentAnswer}
                className="ml-auto px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                {isLastQuestion ? t('branding_quiz.submit_button') : t('branding_quiz.next_button')}
              </button>
            </div>
          </div>
        )}

        {/* Contact Phase */}
        {phase === 'contact' && result && !submitted && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-card-foreground">
                {t('branding_quiz.contact_title')}
              </h2>
              <p className="text-muted-foreground mt-2">{t('branding_quiz.contact_description')}</p>
            </div>

            {/* Recommended plan preview */}
            {result && (
              <div
                className={cn(
                  'p-6 rounded-lg border-2',
                  PLAN_INFO[result].borderColor,
                  PLAN_INFO[result].bgColor,
                )}
              >
                {(() => {
                  const plan = getPlanInfo(result);
                  return (
                    <div>
                      <h3 className={cn('text-xl font-bold', PLAN_INFO[result].color)}>
                        {plan.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                      <div className="mt-3 text-sm text-card-foreground">
                        <div className="font-semibold">{plan.price}</div>
                        <div className="text-xs text-muted-foreground">{plan.delivery}</div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Contact form */}
            <div className="space-y-4">
              <input
                type="text"
                placeholder={t('branding_quiz.name_label')}
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border bg-card text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
              <input
                type="email"
                placeholder={t('branding_quiz.email_label')}
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border bg-card text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
              <input
                type="tel"
                placeholder={t('branding_quiz.phone_label')}
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border bg-card text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleBack}
                disabled={saving}
                className="px-6 py-3 rounded-xl border border-border text-card-foreground hover:border-primary/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                {t('branding_quiz.back_button')}
              </button>
              <button
                onClick={handleContactSubmit}
                disabled={!contactName.trim() || !contactEmail.trim() || saving}
                className="ml-auto px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                {saving ? '...' : t('branding_quiz.submit_button')}
              </button>
            </div>
          </div>
        )}

        {/* Success Phase */}
        {phase === 'contact' && submitted && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-primary"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-card-foreground">
                {t('branding_quiz.success_title')}
              </h3>
              <p className="text-muted-foreground mt-2">{t('branding_quiz.success_message')}</p>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all cursor-pointer"
            >
              {t('branding_quiz.back_button')}
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
