'use client';

import Link from 'next/link';
import { useState } from 'react';

const CATEGORY_LABELS: Record<string, string> = {
  landing: 'Landing Page',
  ecommerce: 'Tienda Online',
  restaurant: 'Restaurante',
  portfolio: 'Portafolio',
  blog: 'Blog',
  corporate: 'Sitio Empresarial',
  menu_qr: 'Menú QR',
  custom: 'Proyecto Personalizado',
};

export interface ProjectRow {
  _id: string;
  name: string;
  category: string;
  link: string | null;
  featured: boolean;
}

interface Props {
  projects: ProjectRow[];
}

export default function ProjectListClient({ projects }: Props) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [featuredFilter, setFeaturedFilter] = useState('');

  const filtered = projects.filter((p) => {
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (CATEGORY_LABELS[p.category] ?? p.category).toLowerCase().includes(search.toLowerCase());
    const matchCategory = !categoryFilter || p.category === categoryFilter;
    const matchFeatured = !featuredFilter || (featuredFilter === 'yes' ? p.featured : !p.featured);
    return matchSearch && matchCategory && matchFeatured;
  });

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-lg border border-border bg-background text-card-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-border bg-background text-card-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Todas las categorías</option>
          {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
            <option key={val} value={val}>
              {label}
            </option>
          ))}
        </select>
        <select
          value={featuredFilter}
          onChange={(e) => setFeaturedFilter(e.target.value)}
          className="rounded-lg border border-border bg-background text-card-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Todos los proyectos</option>
          <option value="yes">⭐ Solo destacados</option>
          <option value="no">Sin destacar</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-card-foreground">Nombre</th>
              <th className="text-left px-4 py-3 font-semibold text-card-foreground">Categoría</th>
              <th className="text-left px-4 py-3 font-semibold text-card-foreground">Enlace</th>
              <th className="text-left px-4 py-3 font-semibold text-card-foreground">Destacado</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-8 text-muted-foreground">
                  No hay proyectos que coincidan con el filtro.
                </td>
              </tr>
            )}
            {filtered.map((p) => (
              <tr key={p._id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-medium text-card-foreground">{p.name}</td>
                <td className="px-4 py-3">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/8 text-primary border border-primary/20">
                    {CATEGORY_LABELS[p.category] ?? p.category ?? '—'}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {p.link ? (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Ver sitio
                    </a>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="px-4 py-3">
                  {p.featured ? (
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      ⭐ Destacado
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/dashboard/projects/${p._id}`}
                    className="text-primary text-xs hover:underline"
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
