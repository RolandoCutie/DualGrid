'use client';

import { Input } from '@/components/ui/Input';
import { useLanguage } from '@/components/ui/LanguageProvider';
import { Textarea } from '@/components/ui/Textarea';
import type { QuestionnaireAnswers } from '@/types';

interface Step1Props {
  answers: QuestionnaireAnswers;
  onChange: (partial: Partial<QuestionnaireAnswers>) => void;
}

export default function Step1Contact({ answers, onChange }: Step1Props) {
  const { t } = useLanguage();
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-bold text-card-foreground">{t('questionnaire.step1_title')}</h3>
        <p className="text-sm text-muted-foreground mt-1">{t('questionnaire.step1_subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label={t('questionnaire.step1_name_label')}
          required
          placeholder={t('questionnaire.step1_name_placeholder')}
          value={answers.fullName}
          onChange={(e) => onChange({ fullName: e.target.value })}
        />
        <Input
          label={t('questionnaire.step1_business_label')}
          placeholder={t('questionnaire.step1_business_placeholder')}
          value={answers.businessName}
          onChange={(e) => onChange({ businessName: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label={t('questionnaire.step1_email_label')}
          type="email"
          required
          placeholder={t('questionnaire.step1_email_placeholder')}
          value={answers.email}
          onChange={(e) => onChange({ email: e.target.value })}
        />
        <Input
          label={t('questionnaire.step1_phone_label')}
          placeholder={t('questionnaire.step1_phone_placeholder')}
          value={answers.phone}
          onChange={(e) => onChange({ phone: e.target.value })}
        />
      </div>

      <Textarea
        label={t('questionnaire.step1_desc_label')}
        placeholder={t('questionnaire.step1_desc_placeholder')}
        value={answers.businessDescription}
        onChange={(e) => onChange({ businessDescription: e.target.value })}
        rows={3}
      />
    </div>
  );
}
