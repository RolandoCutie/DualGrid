import AdminBackButton from '@/components/admin/AdminBackButton';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import Project from '@/database/project.model';
import connectDB from '@/lib/mongodb';
import { requireAdminSession } from '@/lib/require-admin-session';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Proyectos' };

export default async function ProjectsPage() {
  await requireAdminSession('/admin/dashboard/projects');
  await connectDB();
  const projects = await Project.find({}).sort({ order: 1, createdAt: -1 }).lean();

  return (
    <AdminPageLayout>
      <AdminBackButton href="/admin/dashboard" />
      <AdminPageHeader
        title="Proyectos"
        description={`${projects.length} proyecto${projects.length !== 1 ? 's' : ''} registrado${projects.length !== 1 ? 's' : ''}`}
        action={{ label: 'Nuevo proyecto', href: '/admin/dashboard/projects/new' }}
      />

      <div className="mt-6 overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-card-foreground">Nombre</th>
              <th className="text-left px-4 py-3 font-semibold text-card-foreground">
                Tecnologías
              </th>
              <th className="text-left px-4 py-3 font-semibold text-card-foreground">Enlace</th>
              <th className="text-left px-4 py-3 font-semibold text-card-foreground">Destacado</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {projects.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-8 text-muted-foreground">
                  No hay proyectos aún.{' '}
                  <Link
                    href="/admin/dashboard/projects/new"
                    className="text-primary hover:underline"
                  >
                    Crear el primero
                  </Link>
                </td>
              </tr>
            )}
            {projects.map((p: Record<string, unknown>) => (
              <tr key={String(p._id)} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-medium text-card-foreground">{String(p.name)}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {Array.isArray(p.technologies) && p.technologies.length > 0
                    ? (p.technologies as string[]).join(', ')
                    : '—'}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {p.link ? (
                    <a
                      href={String(p.link)}
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
                    href={`/admin/dashboard/projects/${String(p._id)}`}
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
    </AdminPageLayout>
  );
}
