'use client';

import { useLanguage } from '@/components/ui/LanguageProvider';
import Image from 'next/image';
import { useMemo, useState } from 'react';

interface Project {
  _id: string;
  name: string;
  description: string;
  technologies: string[];
  images: string[];
  link?: string;
  featured: boolean;
}

interface PortfolioSectionProps {
  projects: Project[];
}

export default function PortfolioSection({ projects }: PortfolioSectionProps) {
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('all');

  // Collect unique technologies across all projects
  const allTechs = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => p.technologies.forEach((tech) => set.add(tech)));
    return Array.from(set).sort();
  }, [projects]);

  const filtered = useMemo(
    () =>
      activeFilter === 'all'
        ? projects
        : projects.filter((p) => p.technologies.includes(activeFilter)),
    [projects, activeFilter],
  );

  return (
    <section id="portafolio" className="py-24 bg-muted/20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
            {t('portfolio.eyebrow')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-card-foreground mt-2 mb-4">
            {t('portfolio.title')}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">{t('portfolio.subtitle')}</p>
        </div>

        {/* Filter pills */}
        {allTechs.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors duration-150 ${
                activeFilter === 'all'
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-card-foreground'
              }`}
            >
              {t('portfolio.filter_all')}
            </button>
            {allTechs.map((tech) => (
              <button
                key={tech}
                onClick={() => setActiveFilter(tech)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors duration-150 ${
                  activeFilter === tech
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-card-foreground'
                }`}
              >
                {tech}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">{t('portfolio.no_projects')}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project) => (
              <ProjectCard key={project._id} project={project} t={t} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ProjectCard({ project, t }: { project: Project; t: (key: string) => string }) {
  const [imgIdx, setImgIdx] = useState(0);
  const hasImages = project.images.length > 0;

  return (
    <article className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-200">
      {/* Image */}
      <div className="relative w-full aspect-video bg-muted overflow-hidden">
        {hasImages ? (
          <>
            <Image
              src={project.images[imgIdx]}
              alt={project.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Prev/Next dots for multiple images */}
            {project.images.length > 1 && (
              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
                {project.images.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Imagen ${i + 1}`}
                    onClick={() => setImgIdx(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      i === imgIdx ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl opacity-20">🖥️</span>
          </div>
        )}
        {project.featured && (
          <span className="absolute top-2 right-2 text-xs font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
            ⭐
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-5 flex-1">
        <h3 className="font-bold text-card-foreground text-base leading-tight">{project.name}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {project.description}
        </p>

        {/* Tech badges */}
        {project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-primary/8 text-primary border border-primary/20"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Link */}
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            {t('portfolio.visit_site')}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        )}
      </div>
    </article>
  );
}
