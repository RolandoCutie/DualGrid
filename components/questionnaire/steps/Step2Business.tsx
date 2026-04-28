'use client';

import { DICTS, useLanguage } from '@/components/ui/LanguageProvider';
import { cn } from '@/lib/utils';
import type { BusinessType, QuestionnaireAnswers } from '@/types';

interface Step2Props {
  answers: QuestionnaireAnswers;
  onChange: (partial: Partial<QuestionnaireAnswers>) => void;
}

const BUSINESS_TYPE_ICONS: Record<string, string> = {
  creative: '🎨',
  restaurant: '🍽️',
  entrepreneur: '🚀',
  professional: '💼',
  ecommerce: '🛍️',
  other: '✨',
};

export default function Step2Business({ answers, onChange }: Step2Props) {
  const { locale, t } = useLanguage();
  const q = DICTS[locale].questionnaire as Record<string, unknown>;
  const businessTypes = q.step2_business_types as Record<string, { label: string; desc: string }>;
  const onlinePresenceOptions = q.step2_online_presence as Record<
    string,
    { label: string; desc: string }
  >;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-card-foreground">{t('questionnaire.step2_title')}</h3>
        <p className="text-sm text-muted-foreground mt-1">{t('questionnaire.step2_subtitle')}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {Object.entries(businessTypes).map(([id, bt]) => (
          <button
            key={id}
            type="button"
            onClick={() => onChange({ businessType: id as BusinessType })}
            className={cn(
              'flex flex-col items-start p-4 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer',
              answers.businessType === id
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50 hover:bg-muted/50',
            )}
          >
            <span className="text-2xl mb-2">{BUSINESS_TYPE_ICONS[id] ?? '✨'}</span>
            <span className="text-sm font-semibold text-card-foreground">{bt.label}</span>
            <span className="text-xs text-muted-foreground mt-0.5 leading-snug">{bt.desc}</span>
          </button>
        ))}
      </div>

      <div>
        <p className="text-sm font-medium text-card-foreground mb-3">
          {t('questionnaire.step2_presence_label')}
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          {Object.entries(onlinePresenceOptions).map(([id, op]) => (
            <button
              key={id}
              type="button"
              onClick={() =>
                onChange({ onlinePresence: id as QuestionnaireAnswers['onlinePresence'] })
              }
              className={cn(
                'flex-1 flex flex-col items-start p-3 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer',
                answers.onlinePresence === id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50',
              )}
            >
              <span className="text-sm font-semibold text-card-foreground">{op.label}</span>
              <span className="text-xs text-muted-foreground">{op.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
