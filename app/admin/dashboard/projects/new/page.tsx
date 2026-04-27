import AdminBackButton from '@/components/admin/AdminBackButton';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import ProjectForm from '@/components/admin/ProjectForm';
import { requireAdminSession } from '@/lib/require-admin-session';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Nuevo proyecto' };

export default async function NewProjectPage() {
  await requireAdminSession('/admin/dashboard/projects/new');

  return (
    <AdminPageLayout>
      <AdminBackButton href="/admin/dashboard/projects" />
      <AdminPageHeader title="Nuevo proyecto" description="Agrega un proyecto a tu portafolio." />
      <div className="mt-6">
        <ProjectForm />
      </div>
    </AdminPageLayout>
  );
}
