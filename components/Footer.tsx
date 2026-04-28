'use client';

import { useLanguage } from '@/components/ui/LanguageProvider';

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-border">
      {/* Top gradient line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent, var(--primary), var(--accent), transparent)',
        }}
        aria-hidden="true"
      />

      <div className="bg-card">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Brand */}
            <div className="flex flex-col items-center md:items-start gap-2">
              <div className="flex items-center gap-2.5">
                <span
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-black shadow-md"
                  style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}
                >
                  DG
                </span>
                <span
                  className="font-extrabold text-xl text-card-foreground tracking-tight"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  DualGrid
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{t('footer.tagline')}</p>
            </div>

            {/* Copyright */}
            <p className="text-sm text-muted-foreground text-center md:text-right">
              © {year} DualGrid · {t('footer.rights')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
