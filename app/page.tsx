import HeroSection from '@/components/landing/HeroSection';
import PlansSection from '@/components/landing/PlansSection';
import PortfolioSection from '@/components/landing/PortfolioSection';
import ProcessSection from '@/components/landing/ProcessSection';
import WhySection from '@/components/landing/WhySection';
import Project from '@/database/project.model';
import { getBaseUrl } from '@/lib/base-url';
import connectDB from '@/lib/mongodb';
import type { Metadata } from 'next';

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

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let projects: {
    _id: string;
    name: string;
    description: string;
    technologies: string[];
    images: string[];
    link: string;
    featured: boolean;
  }[] = [];

  try {
    await connectDB();
    const rawProjects = await Project.find({}).sort({ order: 1, createdAt: -1 }).lean();
    projects = rawProjects.map((p) => ({
      _id: String(p._id),
      name: p.name,
      description: p.description,
      technologies: p.technologies ?? [],
      images: p.images ?? [],
      link: p.link ?? '',
      featured: p.featured ?? false,
    }));
  } catch {
    // DB unavailable — render page without projects
  }

  return (
    <>
      <HeroSection />
      <WhySection />
      <PortfolioSection projects={projects} />
      <PlansSection />
      <ProcessSection />
    </>
  );
}
