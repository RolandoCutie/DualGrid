import AdminBackButton from '@/components/admin/AdminBackButton';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import ContractForm from '@/components/admin/ContractForm';
import Client from '@/database/client.model';
import connectDB from '@/lib/mongodb';
import { requireAdminSession } from '@/lib/require-admin-session';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Nuevo contrato' };

export default async function NewContractPage() {
  await requireAdminSession();
  await connectDB();

  const clients = await Client.find({}).sort({ name: 1 }).lean();

  return (
    <AdminPageLayout maxWidth="5xl">
      <AdminBackButton href="/admin/dashboard/contracts" />
      <AdminPageHeader
        title="Nuevo contrato"
        description="Crea un contrato de servicio para un cliente."
      />
      <ContractForm
        clients={clients.map((c) => ({
          _id: c._id.toString(),
          name: c.name,
          businessName: c.businessName ?? undefined,
        }))}
      />
    </AdminPageLayout>
  );
}
