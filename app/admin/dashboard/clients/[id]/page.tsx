import AdminBackButton from '@/components/admin/AdminBackButton';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import ClientForm from '@/components/admin/ClientForm';
import Client from '@/database/client.model';
import connectDB from '@/lib/mongodb';
import { requireAdminSession } from '@/lib/require-admin-session';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = { title: 'Editar cliente' };

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminSession();
  const { id } = await params;
  await connectDB();

  const client = await Client.findById(id).lean();
  if (!client) notFound();

  return (
    <AdminPageLayout maxWidth="5xl">
      <AdminBackButton href="/admin/dashboard/clients" />
      <AdminPageHeader
        title={`Editar: ${client.name}`}
        description={client.businessName ?? client.email}
      />
      <ClientForm
        clientId={id}
        defaultValues={{
          name: client.name,
          email: client.email,
          phone: client.phone ?? '',
          businessName: client.businessName ?? '',
          businessType: client.businessType ?? '',
          notes: client.notes ?? '',
        }}
      />
    </AdminPageLayout>
  );
}
