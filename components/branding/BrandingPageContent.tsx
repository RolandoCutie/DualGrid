'use client';

import { useLanguage } from '@/components/ui/LanguageProvider';

interface BrandingPageContentProps {
  completed?: boolean;
}

export default function BrandingPageContent({ completed = false }: BrandingPageContentProps) {
  const { t } = useLanguage();

  if (completed) {
    return (
      <div className="flex-1 flex items-center justify-center px-4 py-20 text-center">
        <div className="space-y-4 max-w-md">
          <div className="text-5xl">✅</div>
          <h1 className="text-2xl font-bold text-foreground">
            {t('branding_page.completed_title')}
          </h1>
          <p className="text-muted-foreground">{t('branding_page.completed_body')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center px-4 pt-8 pb-4 max-w-2xl mx-auto w-full">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
        {t('branding_page.eyebrow')}
      </p>
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
        {t('branding_page.title')}
      </h1>
      <p className="text-muted-foreground text-sm">{t('branding_page.subtitle')}</p>
    </div>
  );
}
