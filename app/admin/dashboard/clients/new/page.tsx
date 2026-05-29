import AdminBackButton from '@/components/admin/AdminBackButton';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import ClientForm from '@/components/admin/ClientForm';
import { requireAdminSession } from '@/lib/require-admin-session';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Nuevo cliente' };

export default async function NewClientPage({
  searchParams,
}: {
  searchParams: Promise<{ back?: string }>;
}) {
  await requireAdminSession('/admin/dashboard/clients/new');
  const { back } = await searchParams;

  return (
    <AdminPageLayout maxWidth="5xl">
      <AdminBackButton href={back ?? '/admin/dashboard/clients'} label="Volver" />
      <AdminPageHeader
        title="Nuevo cliente"
        description="Registra un nuevo cliente en el sistema."
      />
      <ClientForm redirectTo={back ?? '/admin/dashboard/clients'} />
    </AdminPageLayout>
  );
}
