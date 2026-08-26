import AboutSection from '@/components/landing/AboutSection';
import AuroraBackground from '@/components/landing/AuroraBackground';
import BrandingPlansSection from '@/components/landing/BrandingPlansSection';
import ClosingCTA from '@/components/landing/ClosingCTA';
import HeroSection from '@/components/landing/HeroSection';
import HostingSection from '@/components/landing/HostingSection';
import PlansSection from '@/components/landing/PlansSection';
import PortfolioSection from '@/components/landing/PortfolioSection';
import ProcessSection from '@/components/landing/ProcessSection';
import ServicesOverview from '@/components/landing/ServicesOverview';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import WhySection from '@/components/landing/WhySection';
import Project from '@/database/project.model';
import { getBaseUrl } from '@/lib/base-url';
import connectDB from '@/lib/mongodb';
import type { Metadata } from 'next';

const baseUrl = getBaseUrl();

export const metadata: Metadata = {
  title: 'DualGrid — Estudio digital | Diseño web, Branding e Identidad Visual',
  description:
    'Estudio digital especializado en sitios web a medida, identidad visual y hosting gestionado. Diseño personalizado, código limpio y comunicación directa en español.',
  alternates: { canonical: baseUrl },
  openGraph: {
    title: 'DualGrid — Estudio digital | Diseño web, Branding e Identidad Visual',
    description:
      'Diseñamos marcas, construimos webs y gestionamos hosting. Un estudio digital completo para negocios que quieren crecer online.',
    url: baseUrl,
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'DualGrid Studio' }],
  },
};

export const dynamic = 'force-dynamic';

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<{ wizard?: string }>;
}) {
  const sp = await searchParams;
  const autoOpenWizard = sp?.wizard === 'open';
  let projects: {
    _id: string;
    name: string;
    description: string;
    category: string;
    technologies: string[];
    images: string[];
    link: string;
    featured: boolean;
    problem?: string;
    solution?: string;
    result?: string;
    clientType?: string;
  }[] = [];

  try {
    await connectDB();
    const rawProjects = await Project.find({}).sort({ order: 1, createdAt: -1 }).lean();
    projects = rawProjects.map((p) => ({
      _id: String(p._id),
      name: p.name,
      description: p.description,
      category: (p as { category?: string }).category ?? 'custom',
      technologies: p.technologies ?? [],
      images: p.images ?? [],
      link: p.link ?? '',
      featured: p.featured ?? false,
      problem: (p as { problem?: string }).problem,
      solution: (p as { solution?: string }).solution,
      result: (p as { result?: string }).result,
      clientType: (p as { clientType?: string }).clientType,
    }));
  } catch {
    // DB unavailable — render page without projects
  }

  return (
    <div className="relative overflow-x-hidden">
      <AuroraBackground />
      <div className="relative z-10">
        <HeroSection autoOpen={autoOpenWizard} />
        <ServicesOverview />
        <PortfolioSection projects={projects} />
        <WhySection />
        <ProcessSection />
        <PlansSection />
        <BrandingPlansSection />
        <HostingSection />
        <AboutSection />
        <TestimonialsSection />
        <ClosingCTA />
      </div>
    </div>
  );
}
