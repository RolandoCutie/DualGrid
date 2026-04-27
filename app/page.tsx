import HeroSection from '@/components/landing/HeroSection';
import PlansSection from '@/components/landing/PlansSection';
import ProcessSection from '@/components/landing/ProcessSection';
import WhySection from '@/components/landing/WhySection';
import type { Metadata } from 'next';
import { getBaseUrl } from '@/lib/base-url';

const baseUrl = getBaseUrl();

export const metadata: Metadata = {
  title: 'DualGrid – Sitios web que convierten visitas en clientes',
  description:
    'Agencia de desarrollo web especializada en diseño único y funcional. Portafolios, restaurantes, landing pages y sistemas personalizados.',
  alternates: { canonical: baseUrl },
  openGraph: {
    title: 'DualGrid – Sitios web que convierten visitas en clientes',
    description:
      'Combinamos diseño artístico con ingeniería precisa. Presencia digital profesional para creativos, restaurantes y emprendedores.',
    url: baseUrl,
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'DualGrid' }],
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <WhySection />
      <PlansSection />
      <ProcessSection />
    </>
  );
}
