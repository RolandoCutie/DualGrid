'use client';

import { Input } from '@/components/ui/Input';
import { DICTS, useLanguage } from '@/components/ui/LanguageProvider';
import { Textarea } from '@/components/ui/Textarea';
import { cn } from '@/lib/utils';
import type { QuestionnaireAnswers, VisualStyle } from '@/types';

interface Step5Props {
  answers: QuestionnaireAnswers;
  onChange: (partial: Partial<QuestionnaireAnswers>) => void;
}

export default function Step5Style({ answers, onChange }: Step5Props) {
  const { locale, t } = useLanguage();
  const q = DICTS[locale].questionnaire as Record<string, unknown>;
  const stylesMap = q.step5_styles as Record<string, { label: string; desc: string }>;

  const toggleStyle = (id: VisualStyle) => {
    const current = answers.visualStyle;
    if (current.includes(id)) {
      onChange({ visualStyle: current.filter((s) => s !== id) });
    } else if (current.length < 3) {
      onChange({ visualStyle: [...current, id] });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-card-foreground">{t('questionnaire.step5_title')}</h3>
        <p className="text-sm text-muted-foreground mt-1">{t('questionnaire.step5_subtitle')}</p>
      </div>

      {/* Visual styles grid */}
      <div className="grid grid-cols-3 gap-2">
        {Object.entries(stylesMap).map(([id, s]) => {
          const selected = answers.visualStyle.includes(id as VisualStyle);
          const maxReached = answers.visualStyle.length >= 3;
          return (
            <button
              key={id}
              type="button"
              onClick={() => toggleStyle(id as VisualStyle)}
              disabled={!selected && maxReached}
              className={cn(
                'flex flex-col items-start p-3 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer',
                selected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50',
                !selected && maxReached && 'opacity-40 cursor-not-allowed',
              )}
            >
              <span className="text-sm font-semibold text-card-foreground">{s.label}</span>
              <span className="text-xs text-muted-foreground">{s.desc}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-card-foreground">
            {t('questionnaire.step5_logo_label')}
          </p>
          <div className="flex gap-3">
            {[t('questionnaire.step5_yes'), t('questionnaire.step5_no')].map((opt, i) => (
              <button
                key={opt}
                type="button"
                onClick={() => onChange({ hasLogo: i === 0 })}
                className={cn(
                  'flex-1 py-2 rounded-xl border-2 text-sm font-medium transition-all cursor-pointer',
                  answers.hasLogo === (i === 0)
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border text-card-foreground hover:border-primary/50',
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
        <Input
          label={t('questionnaire.step5_colors_label')}
          placeholder={t('questionnaire.step5_colors_placeholder')}
          value={answers.brandColors}
          onChange={(e) => onChange({ brandColors: e.target.value })}
        />
      </div>

      <Textarea
        label={t('questionnaire.step5_references_label')}
        placeholder={t('questionnaire.step5_references_placeholder')}
        value={answers.referenceWebsites}
        onChange={(e) => onChange({ referenceWebsites: e.target.value })}
        rows={2}
      />

      <Textarea
        label={t('questionnaire.step5_feeling_label')}
        placeholder={t('questionnaire.step5_feeling_placeholder')}
        value={answers.visualFeeling}
        onChange={(e) => onChange({ visualFeeling: e.target.value })}
        rows={2}
      />

      {/* ─── Identidad Visual / Branding ─────────────────────────────── */}
      <div className="border-t border-border pt-5">
        <h4 className="text-base font-bold text-card-foreground mb-1">
          {t('questionnaire.step5_branding_title')}
        </h4>
        <p className="text-xs text-muted-foreground mb-4">
          {t('questionnaire.step5_branding_subtitle')}
        </p>

        <div className="space-y-4">
          <Input
            label={t('questionnaire.step5_brand_essence_label')}
            placeholder={t('questionnaire.step5_brand_essence_placeholder')}
            value={answers.brandEssence}
            onChange={(e) => onChange({ brandEssence: e.target.value })}
          />

          <Textarea
            label={t('questionnaire.step5_brand_values_label')}
            placeholder={t('questionnaire.step5_brand_values_placeholder')}
            value={answers.brandValues}
            onChange={(e) => onChange({ brandValues: e.target.value })}
            rows={2}
          />

          <Textarea
            label={t('questionnaire.step5_brand_nodos_label')}
            placeholder={t('questionnaire.step5_brand_nodos_placeholder')}
            value={answers.brandNoDos}
            onChange={(e) => onChange({ brandNoDos: e.target.value })}
            rows={2}
          />

          <Input
            label={t('questionnaire.step5_logo_words_label')}
            placeholder={t('questionnaire.step5_logo_words_placeholder')}
            value={answers.logoWords}
            onChange={(e) => onChange({ logoWords: e.target.value })}
          />

          <Textarea
            label={t('questionnaire.step5_logo_elements_label')}
            placeholder={t('questionnaire.step5_logo_elements_placeholder')}
            value={answers.logoSpecificElements}
            onChange={(e) => onChange({ logoSpecificElements: e.target.value })}
            rows={2}
          />

          <Textarea
            label={t('questionnaire.step5_prior_brand_label')}
            placeholder={t('questionnaire.step5_prior_brand_placeholder')}
            value={answers.priorBrandPresence}
            onChange={(e) => onChange({ priorBrandPresence: e.target.value })}
            rows={2}
          />

          <Textarea
            label={t('questionnaire.step5_logo_inspiration_label')}
            placeholder={t('questionnaire.step5_logo_inspiration_placeholder')}
            value={answers.logoInspiration}
            onChange={(e) => onChange({ logoInspiration: e.target.value })}
            rows={2}
          />
        </div>
      </div>
    </div>
  );
}
