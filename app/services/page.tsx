import AuroraBackground from '@/components/landing/AuroraBackground';
import BrandingPlansSection from '@/components/landing/BrandingPlansSection';
import ClosingCTA from '@/components/landing/ClosingCTA';
import HostingSection from '@/components/landing/HostingSection';
import PlansSection from '@/components/landing/PlansSection';
import ServicesOverview from '@/components/landing/ServicesOverview';
import { getBaseUrl } from '@/lib/base-url';
import type { Metadata } from 'next';

const baseUrl = getBaseUrl();
const servicesUrl = `${baseUrl}/services`;

export const metadata: Metadata = {
  title: 'Servicios de diseño web, branding y hosting',
  description:
    'Explora nuestros servicios: desarrollo web, identidad visual y hosting gestionado para construir una presencia digital clara, sólida y profesional.',
  alternates: { canonical: servicesUrl },
  openGraph: {
    title: 'Servicios de diseño web, branding y hosting | DualGrid',
    description:
      'Planes y soluciones de desarrollo web, branding y hosting para negocios que quieren crecer con una presencia digital mejor construida.',
    url: servicesUrl,
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Servicios de DualGrid',
      },
    ],
  },
};

export default function ServicesPage() {
  return (
    <div className="relative overflow-x-hidden">
      <AuroraBackground />
      <div className="relative z-10">
        <ServicesOverview />
        <PlansSection />
        <BrandingPlansSection />
        <HostingSection />
        <ClosingCTA />
      </div>
    </div>
  );
}
