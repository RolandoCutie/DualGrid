import AboutSection from '@/components/landing/AboutSection';
import AuroraBackground from '@/components/landing/AuroraBackground';
import ClosingCTA from '@/components/landing/ClosingCTA';
import ProcessSection from '@/components/landing/ProcessSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import WhySection from '@/components/landing/WhySection';
import { getBaseUrl } from '@/lib/base-url';
import type { Metadata } from 'next';

const baseUrl = getBaseUrl();
const aboutUrl = `${baseUrl}/about`;

export const metadata: Metadata = {
  title: 'Quiénes somos y cómo trabajamos',
  description:
    'Conoce al equipo de DualGrid, nuestra forma de trabajo y por qué combinamos diseño, branding y desarrollo para crear resultados sólidos.',
  alternates: { canonical: aboutUrl },
  openGraph: {
    title: 'Quiénes somos y cómo trabajamos | DualGrid',
    description:
      'Descubre nuestra metodología, valores y testimonios de clientes sobre proyectos reales.',
    url: aboutUrl,
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Sobre DualGrid',
      },
    ],
  },
};

export default function AboutPage() {
  return (
    <div className="relative overflow-x-hidden">
      <AuroraBackground />
      <div className="relative z-10">
        <WhySection />
        <ProcessSection />
        <AboutSection />
        <TestimonialsSection />
        <ClosingCTA />
      </div>
    </div>
  );
}
