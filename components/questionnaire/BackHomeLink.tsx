'use client';

import { useLanguage } from '@/components/ui/LanguageProvider';
import Link from 'next/link';

export default function BackHomeLink() {
  const { t } = useLanguage();
  return (
    <Link
      href="/"
      className="text-sm text-muted-foreground hover:text-card-foreground transition-colors"
    >
      ← {t('questionnaire.back_home')}
    </Link>
  );
}
