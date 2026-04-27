import AdminBackButton from '@/components/admin/AdminBackButton';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import InvoiceForm from '@/components/admin/InvoiceForm';
import Client from '@/database/client.model';
import connectDB from '@/lib/mongodb';
import { requireAdminSession } from '@/lib/require-admin-session';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Nueva factura' };

export default async function NewInvoicePage() {
  await requireAdminSession();
  await connectDB();

  const clients = await Client.find({}).sort({ name: 1 }).lean();

  return (
    <AdminPageLayout maxWidth="5xl">
      <AdminBackButton href="/admin/dashboard/invoices" />
      <AdminPageHeader
        title="Nueva factura"
        description="El número de factura se asigna automáticamente."
      />
      <InvoiceForm
        clients={clients.map((c) => ({
          _id: c._id.toString(),
          name: c.name,
          businessName: c.businessName ?? undefined,
        }))}
      />
    </AdminPageLayout>
  );
}
