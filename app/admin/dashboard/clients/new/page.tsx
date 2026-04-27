import AdminBackButton from '@/components/admin/AdminBackButton';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import ClientForm from '@/components/admin/ClientForm';
import { requireAdminSession } from '@/lib/require-admin-session';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Nuevo cliente' };

export default async function NewClientPage() {
  await requireAdminSession('/admin/dashboard/clients/new');

  return (
    <AdminPageLayout maxWidth="5xl">
      <AdminBackButton href="/admin/dashboard/clients" />
      <AdminPageHeader
        title="Nuevo cliente"
        description="Registra un nuevo cliente en el sistema."
      />
      <ClientForm />
    </AdminPageLayout>
  );
}
