'use client';

import { DICTS, useLanguage } from '@/components/ui/LanguageProvider';
import { Textarea } from '@/components/ui/Textarea';
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
  grow_audience: '📣',
};

const ACTION_ICONS: Record<string, string> = {
  whatsapp_contact: '💬',
  contact_form: '📧',
  call: '📞',
  book_appointment: '📅',
  buy_product: '🛒',
  view_portfolio: '🖼️',
  download: '📥',
  request_quote: '📋',
  subscribe: '📮',
};

export default function Step3Goals({ answers, onChange }: Step3Props) {
  const { locale, t } = useLanguage();
  const q = DICTS[locale].questionnaire as Record<string, unknown>;
  const goalsMap = q.step3_goals as Record<string, string>;
  const actionsMap = q.step3_actions as Record<string, string>;
  const pagesMap = q.step3_pages as Record<string, string>;
  const featuresMap = q.step3_features as Record<string, string>;

  const togglePage = (id: string) => {
    const current = answers.desiredPages;
    onChange({
      desiredPages: current.includes(id) ? current.filter((p) => p !== id) : [...current, id],
    });
  };

  const toggleFeature = (id: string) => {
    const current = answers.specialFeatures;
    onChange({
      specialFeatures: current.includes(id) ? current.filter((f) => f !== id) : [...current, id],
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

      {/* Primary Action */}
      <div>
        <p className="text-sm font-medium text-card-foreground mb-3">
          {t('questionnaire.step3_action_label')}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {Object.entries(actionsMap).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => onChange({ primaryAction: id })}
              className={cn(
                'flex items-center gap-2 p-3 rounded-xl border-2 text-left text-sm transition-all duration-200 cursor-pointer',
                answers.primaryAction === id
                  ? 'border-accent bg-accent/5 font-medium text-accent-foreground'
                  : 'border-border text-card-foreground hover:border-accent/50',
              )}
            >
              <span>{ACTION_ICONS[id] ?? '✅'}</span>
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

      {/* Special Features */}
      <div>
        <p className="text-sm font-medium text-card-foreground mb-3">
          {t('questionnaire.step3_features_label')}
        </p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(featuresMap).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => toggleFeature(id)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 cursor-pointer',
                answers.specialFeatures.includes(id)
                  ? 'border-accent bg-accent text-accent-foreground'
                  : 'border-border text-muted-foreground hover:border-accent/50 hover:text-card-foreground',
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Differentiation */}
      <Textarea
        label={t('questionnaire.step3_diff_label')}
        placeholder={t('questionnaire.step3_diff_placeholder')}
        value={answers.differentiation}
        onChange={(e) => onChange({ differentiation: e.target.value })}
        rows={2}
      />
    </div>
  );
}
