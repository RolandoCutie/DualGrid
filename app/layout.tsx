import Footer from '@/components/Footer';
import NavBar from '@/components/NavBar';
import LanguageProvider from '@/components/ui/LanguageProvider';
import ThemeProvider from '@/components/ui/ThemeProvider';
import { getBaseUrl } from '@/lib/base-url';
import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const baseUrl = getBaseUrl();

const inter = localFont({
  variable: '--font-inter',
  display: 'swap',
  weight: '100 900',
  src: '../fonts/inter-latin-wght-normal.woff2',
});

const syne = localFont({
  variable: '--font-syne',
  display: 'swap',
  weight: '400 800',
  src: '../fonts/syne-latin-wght-normal.woff2',
});

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${baseUrl}/#organization`,
      name: 'DualGrid',
      url: baseUrl,
      description:
        'Agencia de diseño y desarrollo digital. Creamos sitios web, identidades de marca y experiencias digitales con diseño con criterio y código con precisión.',
      sameAs: [],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        availableLanguage: ['Spanish', 'English'],
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${baseUrl}/#website`,
      url: baseUrl,
      name: 'DualGrid',
      publisher: { '@id': `${baseUrl}/#organization` },
      inLanguage: ['es', 'en'],
    },
    {
      '@type': 'Service',
      '@id': `${baseUrl}/#service-web`,
      name: 'Desarrollo Web',
      provider: { '@id': `${baseUrl}/#organization` },
      serviceType: 'Web Development',
      description:
        'Sitios web a medida: landing pages, portfolios, tiendas online, restaurantes y sistemas digitales.',
      areaServed: ['Cuba', 'United States', 'Spain'],
    },
    {
      '@type': 'Service',
      '@id': `${baseUrl}/#service-branding`,
      name: 'Identidad Visual y Branding',
      provider: { '@id': `${baseUrl}/#organization` },
      serviceType: 'Graphic Design',
      description:
        'Diseño de logotipos, identidad visual corporativa, manual de marca y sistemas gráficos.',
      areaServed: ['Cuba', 'United States', 'Spain'],
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'DualGrid — Agencia de diseño y desarrollo digital',
    template: '%s | DualGrid',
  },
  description:
    'Agencia de diseño y desarrollo digital formada por una diseñadora y un ingeniero. Creamos sitios web, identidades de marca y soluciones digitales con diseño con criterio y código con precisión.',
  keywords: [
    'diseño web',
    'desarrollo web',
    'branding',
    'identidad visual',
    'agencia digital',
    'diseño de logotipos',
    'landing page',
    'tienda online',
    'Cuba',
    'Estados Unidos',
    'España',
  ],
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: baseUrl,
    siteName: 'DualGrid',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DualGrid — Agencia de diseño y desarrollo digital',
    description:
      'Diseño y tecnología bajo el mismo techo. Sitios web, identidades de marca y soluciones digitales.',
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
            __html: `(function(){try{localStorage.setItem('theme','dark');document.documentElement.classList.add('dark');}catch(e){}})()`,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${syne.variable} font-sans min-h-screen antialiased bg-background text-foreground`}
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
