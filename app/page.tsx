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
  title: 'DualGrid — Diseño web, branding y desarrollo digital',
  description:
    'Creamos sitios web, identidades visuales y soluciones digitales con criterio, oficio y una ejecución sólida. Cuba · USA · España.',
  alternates: { canonical: baseUrl },
  openGraph: {
    title: 'DualGrid — Diseño web, branding y desarrollo digital',
    description:
      'Sitios web, branding, identidades visuales y hosting gestionado con una ejecución cuidada y profesional.',
    url: baseUrl,
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'DualGrid — Diseño web, branding y desarrollo digital',
      },
    ],
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
