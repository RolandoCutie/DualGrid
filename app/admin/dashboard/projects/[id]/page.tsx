import AdminBackButton from '@/components/admin/AdminBackButton';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import ProjectForm from '@/components/admin/ProjectForm';
import Project from '@/database/project.model';
import connectDB from '@/lib/mongodb';
import { requireAdminSession } from '@/lib/require-admin-session';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = { title: 'Editar proyecto' };

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminSession();
  const { id } = await params;
  await connectDB();

  const project = await Project.findById(id).lean();
  if (!project) notFound();

  return (
    <AdminPageLayout>
      <AdminBackButton href="/admin/dashboard/projects" />
      <AdminPageHeader title={`Editar: ${project.name}`} description={project.slug} />
      <div className="mt-6">
        <ProjectForm
          projectId={id}
          defaultValues={{
            name: project.name,
            slug: project.slug,
            description: project.description,
            technologies: project.technologies,
            images: project.images,
            link: project.link ?? '',
            featured: project.featured,
            order: String(project.order),
          }}
        />
      </div>
    </AdminPageLayout>
  );
}
