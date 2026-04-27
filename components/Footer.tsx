'use client';

import { useLanguage } from '@/components/ui/LanguageProvider';

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 font-extrabold text-lg text-card-foreground">
            <span className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-xs font-black">
              DG
            </span>
            DualGrid
          </div>
          <p className="text-sm text-muted-foreground text-center">
            © {year} DualGrid · {t('footer.tagline')}
          </p>
          <p className="text-sm text-muted-foreground">{t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
}
