'use client';

import { useLanguage } from '@/components/ui/LanguageProvider';
import Image from 'next/image';
import { useMemo, useState } from 'react';

interface Project {
  _id: string;
  name: string;
  description: string;
  category: string;
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

  // Collect unique categories present in actual projects (preserve insertion order)
  const availableCategories = useMemo(() => {
    const seen = new Set<string>();
    const result: string[] = [];
    projects.forEach((p) => {
      if (p.category && !seen.has(p.category)) {
        seen.add(p.category);
        result.push(p.category);
      }
    });
    return result;
  }, [projects]);

  const filtered = useMemo(
    () => (activeFilter === 'all' ? projects : projects.filter((p) => p.category === activeFilter)),
    [projects, activeFilter],
  );

  // Translate a category key to the current language label
  const categoryLabel = (key: string): string => {
    const label = t(`portfolio.categories.${key}`);
    // Fallback: capitalise the raw key if translation is missing
    return label !== `portfolio.categories.${key}` ? label : key.replace(/_/g, ' ');
  };

  return (
    <section
      id="portafolio"
      className="py-24 bg-muted/20 dark:bg-transparent relative overflow-hidden"
    >
      {/* Green glow — top left */}
      <div
        className="absolute -top-24 -left-24 w-[600px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,255,157,0.22) 0%, transparent 65%)',
          filter: 'blur(55px)',
        }}
        aria-hidden="true"
      />
      {/* Cyan glow — bottom right */}
      <div
        className="absolute -bottom-20 -right-20 w-[550px] h-[450px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,217,255,0.20) 0%, transparent 65%)',
          filter: 'blur(60px)',
        }}
        aria-hidden="true"
      />
          

      {/* Orb 3 — purple center diffuse */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--purple) 5%, transparent) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
        aria-hidden="true"
      />
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

        {/* Filter pills — by project category (user-friendly) */}
        {availableCategories.length > 0 && (
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
            {availableCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors duration-150 ${
                  activeFilter === cat
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-card-foreground'
                }`}
              >
                {categoryLabel(cat)}
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
              <ProjectCard
                key={project._id}
                project={project}
                t={t}
                categoryLabel={categoryLabel}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ProjectCard({
  project,
  t,
  categoryLabel,
}: {
  project: Project;
  t: (key: string) => string;
  categoryLabel: (key: string) => string;
}) {
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
                    aria-label={t('portfolio.image_aria').replace('{n}', String(i + 1))}
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

        {/* Category badge */}
        {project.category && (
          <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-primary/8 text-primary border border-primary/20">
              {categoryLabel(project.category)}
            </span>
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
