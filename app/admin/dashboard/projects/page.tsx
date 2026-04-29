import AdminBackButton from '@/components/admin/AdminBackButton';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import ProjectListClient, { type ProjectRow } from '@/components/admin/ProjectListClient';
import Project from '@/database/project.model';
import connectDB from '@/lib/mongodb';
import { requireAdminSession } from '@/lib/require-admin-session';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Proyectos' };

export default async function ProjectsPage() {
  await requireAdminSession('/admin/dashboard/projects');
  await connectDB();
  const projects = await Project.find({}).sort({ order: 1, createdAt: -1 }).lean();

  const rows: ProjectRow[] = projects.map((p: Record<string, unknown>) => ({
    _id: String(p._id),
    name: String(p.name),
    technologies: Array.isArray(p.technologies) ? (p.technologies as string[]) : [],
    link: p.link ? String(p.link) : null,
    featured: Boolean(p.featured),
  }));

  return (
    <AdminPageLayout>
      <AdminBackButton href="/admin/dashboard" />
      <AdminPageHeader
        title="Proyectos"
        description={`${projects.length} proyecto${projects.length !== 1 ? 's' : ''} registrado${projects.length !== 1 ? 's' : ''}`}
        action={{ label: 'Nuevo proyecto', href: '/admin/dashboard/projects/new' }}
      />
      <div className="mt-6">
        <ProjectListClient projects={rows} />
      </div>
    </AdminPageLayout>
  );
}
