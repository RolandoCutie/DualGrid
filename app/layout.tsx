import Footer from '@/components/Footer';
import NavBar from '@/components/NavBar';
import LanguageProvider from '@/components/ui/LanguageProvider';
import ThemeProvider from '@/components/ui/ThemeProvider';
import { getBaseUrl } from '@/lib/base-url';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const baseUrl = getBaseUrl();

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${baseUrl}/#organization`,
      name: 'DualGrid',
      url: baseUrl,
      description: 'Web development agency. Sitios web que convierten visitas en clientes.',
    },
    {
      '@type': 'WebSite',
      '@id': `${baseUrl}/#website`,
      url: baseUrl,
      name: 'DualGrid',
      publisher: { '@id': `${baseUrl}/#organization` },
      inLanguage: ['es', 'en'],
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'DualGrid – Sitios web que convierten visitas en clientes',
    template: '%s | DualGrid',
  },
  description:
    'Agencia de desarrollo web. Portafolios, restaurantes, landing pages y sistemas personalizados.',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: baseUrl,
    siteName: 'DualGrid',
  },
  manifest: '/manifest.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#6366f1',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme — runs before paint, suppressed from hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var v=localStorage.getItem('theme-v');if(v!=='dg1'){localStorage.setItem('theme','light');localStorage.setItem('theme-v','dg1');}var t=localStorage.getItem('theme');if(t==='dark')document.documentElement.classList.add('dark');}catch(e){}})()`,
          }}
        />
      </head>
      <body
        className={`${inter.variable} font-sans min-h-screen antialiased bg-background text-foreground`}
      >
        <ThemeProvider>
          <LanguageProvider>
            <NavBar />
            <main className="pt-[72px]">{children}</main>
            <Footer />
          </LanguageProvider>
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
