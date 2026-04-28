'use client';

import { DICTS, useLanguage } from '@/components/ui/LanguageProvider';
import { cn } from '@/lib/utils';
import type { BudgetRange, QuestionnaireAnswers } from '@/types';

interface Step4Props {
  answers: QuestionnaireAnswers;
  onChange: (partial: Partial<QuestionnaireAnswers>) => void;
}

export default function Step4Budget({ answers, onChange }: Step4Props) {
  const { locale, t } = useLanguage();
  const q = DICTS[locale].questionnaire as Record<string, unknown>;
  const budgetsMap = q.step4_budgets as Record<string, { label: string; range: string }>;
  const deadlinesMap = q.step4_deadlines as Record<string, string>;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-card-foreground">{t('questionnaire.step4_title')}</h3>
        <p className="text-sm text-muted-foreground mt-1">{t('questionnaire.step4_subtitle')}</p>
      </div>

      {/* Budget */}
      <div>
        <p className="text-sm font-medium text-card-foreground mb-3">
          {t('questionnaire.step4_budget_label')} <span className="text-destructive">*</span>
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Object.entries(budgetsMap).map(([id, b]) => (
            <button
              key={id}
              type="button"
              onClick={() => onChange({ budget: id as BudgetRange })}
              className={cn(
                'flex flex-col items-start p-3 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer',
                answers.budget === id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50',
              )}
            >
              <span className="text-sm font-semibold text-card-foreground">{b.label}</span>
              <span className="text-xs text-muted-foreground">{b.range}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Deadline */}
      <div>
        <p className="text-sm font-medium text-card-foreground mb-3">
          {t('questionnaire.step4_deadline_label')}
        </p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(deadlinesMap).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => onChange({ deadline: id })}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium border-2 transition-all duration-200 cursor-pointer',
                answers.deadline === id
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border text-card-foreground hover:border-primary/50',
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Domain */}
      <div>
        <p className="text-sm font-medium text-card-foreground mb-3">
          {t('questionnaire.step4_domain_label')}
        </p>
        <div className="flex gap-3">
          {[t('questionnaire.step4_domain_yes'), t('questionnaire.step4_domain_no')].map(
            (opt, i) => (
              <button
                key={opt}
                type="button"
                onClick={() => onChange({ hasDomain: i === 0 })}
                className={cn(
                  'flex-1 py-2.5 rounded-xl border-2 text-sm font-medium transition-all duration-200 cursor-pointer',
                  answers.hasDomain === (i === 0)
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border text-card-foreground hover:border-primary/50',
                )}
              >
                {opt}
              </button>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
