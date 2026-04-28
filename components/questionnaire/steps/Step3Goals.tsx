'use client';

import { DICTS, useLanguage } from '@/components/ui/LanguageProvider';
import { cn } from '@/lib/utils';
import type { PrimaryGoal, QuestionnaireAnswers } from '@/types';

interface Step3Props {
  answers: QuestionnaireAnswers;
  onChange: (partial: Partial<QuestionnaireAnswers>) => void;
}

const GOAL_ICONS: Record<string, string> = {
  more_clients: '📈',
  show_work: '🖼️',
  give_info: 'ℹ️',
  credibility: '⭐',
  sell_online: '🛒',
  reservations: '📅',
};

export default function Step3Goals({ answers, onChange }: Step3Props) {
  const { locale, t } = useLanguage();
  const q = DICTS[locale].questionnaire as Record<string, unknown>;
  const goalsMap = q.step3_goals as Record<string, string>;
  const pagesMap = q.step3_pages as Record<string, string>;

  const togglePage = (id: string) => {
    const current = answers.desiredPages;
    onChange({
      desiredPages: current.includes(id) ? current.filter((p) => p !== id) : [...current, id],
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-card-foreground">{t('questionnaire.step3_title')}</h3>
        <p className="text-sm text-muted-foreground mt-1">{t('questionnaire.step3_subtitle')}</p>
      </div>

      {/* Primary Goal */}
      <div>
        <p className="text-sm font-medium text-card-foreground mb-3">
          {t('questionnaire.step3_goal_label')} <span className="text-destructive">*</span>
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {Object.entries(goalsMap).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => onChange({ primaryGoal: id as PrimaryGoal })}
              className={cn(
                'flex items-center gap-2 p-3 rounded-xl border-2 text-left text-sm transition-all duration-200 cursor-pointer',
                answers.primaryGoal === id
                  ? 'border-primary bg-primary/5 font-medium text-primary'
                  : 'border-border text-card-foreground hover:border-primary/50',
              )}
            >
              <span>{GOAL_ICONS[id] ?? '🎯'}</span>
              <span className="leading-tight">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Desired Pages */}
      <div>
        <p className="text-sm font-medium text-card-foreground mb-3">
          {t('questionnaire.step3_pages_label')}
        </p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(pagesMap).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => togglePage(id)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 cursor-pointer',
                answers.desiredPages.includes(id)
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border text-muted-foreground hover:border-primary/50 hover:text-card-foreground',
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
