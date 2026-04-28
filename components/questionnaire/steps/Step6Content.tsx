'use client';

import { useLanguage } from '@/components/ui/LanguageProvider';
import { Textarea } from '@/components/ui/Textarea';
import { cn } from '@/lib/utils';
import type { QuestionnaireAnswers } from '@/types';

interface Step6Props {
  answers: QuestionnaireAnswers;
  onChange: (partial: Partial<QuestionnaireAnswers>) => void;
}

export default function Step6Content({ answers, onChange }: Step6Props) {
  const { t } = useLanguage();
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-card-foreground">{t('questionnaire.step6_title')}</h3>
        <p className="text-sm text-muted-foreground mt-1">{t('questionnaire.step6_subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Photos */}
        <div>
          <p className="text-sm font-medium text-card-foreground mb-3">
            {t('questionnaire.step6_photos_label')}
          </p>
          <div className="flex gap-3">
            {[t('questionnaire.step6_yes'), t('questionnaire.step6_no')].map((opt, i) => (
              <button
                key={opt}
                type="button"
                onClick={() => onChange({ hasPhotos: i === 0 })}
                className={cn(
                  'flex-1 py-2.5 rounded-xl border-2 text-sm font-medium transition-all cursor-pointer',
                  answers.hasPhotos === (i === 0)
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border text-card-foreground hover:border-primary/50',
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Texts */}
        <div>
          <p className="text-sm font-medium text-card-foreground mb-3">
            {t('questionnaire.step6_texts_label')}
          </p>
          <div className="flex gap-3">
            {[t('questionnaire.step6_yes'), t('questionnaire.step6_no')].map((opt, i) => (
              <button
                key={opt}
                type="button"
                onClick={() => onChange({ hasTexts: i === 0 })}
                className={cn(
                  'flex-1 py-2.5 rounded-xl border-2 text-sm font-medium transition-all cursor-pointer',
                  answers.hasTexts === (i === 0)
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border text-card-foreground hover:border-primary/50',
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Textarea
        label={t('questionnaire.step6_notes_label')}
        placeholder={t('questionnaire.step6_notes_placeholder')}
        value={answers.extraNotes}
        onChange={(e) => onChange({ extraNotes: e.target.value })}
        rows={4}
      />
    </div>
  );
}
