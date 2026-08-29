'use client';

import { useLanguage } from '@/components/ui/LanguageProvider';
import LogoDualGrid from '@/components/ui/LogoDualGrid';

const WHATSAPP_NUM = process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? '';
const INSTAGRAM_URL = process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? '#';
const FACEBOOK_URL = process.env.NEXT_PUBLIC_FACEBOOK_URL ?? '#';

const QUICK_LINKS = [
  { href: '#planes', labelKey: 'footer.link_web' },
  { href: '#branding', labelKey: 'footer.link_branding' },
  { href: '#hosting', labelKey: 'footer.link_hosting' },
];

const INTEREST_LINKS = [
  { href: '#portafolio', labelKey: 'footer.link_portfolio' },
  { href: '#nosotros', labelKey: 'footer.link_about' },
  { href: '#testimonios', labelKey: 'footer.link_testimonials' },
];

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();
  const waLink = WHATSAPP_NUM ? `https://wa.me/${WHATSAPP_NUM.replace(/\D/g, '')}` : '#';

  const scrollTo = (href: string) => {
    const id = href.replace('#', '');
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="relative overflow-hidden border-t border-border">
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent, var(--primary), var(--accent), transparent)',
        }}
        aria-hidden="true"
      />

      <div className="bg-card">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-12 sm:py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-10">
            {/* Brand */}
            <div className="flex flex-col items-center sm:items-start gap-3 text-center sm:text-left max-w-[280px] mx-auto sm:mx-0">
              <LogoDualGrid width={160} />
              <p className="text-sm text-muted-foreground max-w-xs">{t('footer.tagline')}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs text-muted-foreground font-medium">
                  {t('footer.follow_us')}:
                </span>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
                <a
                  href={FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Services */}
            <div className="flex flex-col items-center sm:items-start gap-2 text-center sm:text-left">
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">
                {t('footer.links_title')}
              </p>
              {QUICK_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="text-sm text-muted-foreground hover:text-card-foreground transition-colors cursor-pointer"
                >
                  {t(link.labelKey)}
                </button>
              ))}
            </div>

            {/* Interest links */}
            <div className="flex flex-col items-center sm:items-start gap-2 text-center sm:text-left">
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">
                {t('footer.enlaces_title')}
              </p>
              {INTEREST_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="text-sm text-muted-foreground hover:text-card-foreground transition-colors cursor-pointer"
                >
                  {t(link.labelKey)}
                </button>
              ))}
            </div>

            {/* Contact */}
            <div className="flex flex-col items-center sm:items-start gap-3 text-center sm:text-left">
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">
                {t('footer.contact_us')}
              </p>
              {WHATSAPP_NUM && (
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-accent shrink-0"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  {t('footer.whatsapp_cta')}
                </a>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-border/40">
            <p className="text-xs text-muted-foreground text-center">
              © {year} DualGrid · {t('footer.rights')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
