import AdminBackButton from '@/components/admin/AdminBackButton';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import ClientListClient, { type ClientRow } from '@/components/admin/ClientListClient';
import Client from '@/database/client.model';
import connectDB from '@/lib/mongodb';
import { requireAdminSession } from '@/lib/require-admin-session';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Clientes' };

export default async function ClientsPage() {
  await requireAdminSession('/admin/dashboard/clients');
  await connectDB();
  const clients = await Client.find({}).sort({ createdAt: -1 }).lean();

  const rows: ClientRow[] = clients.map((c: Record<string, unknown>) => ({
    _id: String(c._id),
    name: String(c.name),
    businessName: c.businessName ? String(c.businessName) : null,
    email: String(c.email),
    phone: c.phone ? String(c.phone) : null,
  }));

  return (
    <AdminPageLayout>
      <AdminBackButton href="/admin/dashboard" />
      <AdminPageHeader
        title="Clientes"
        description={`${clients.length} clientes registrados`}
        action={{ label: 'Nuevo cliente', href: '/admin/dashboard/clients/new' }}
      />
      <div className="mt-6">
        <ClientListClient clients={rows} />
      </div>
    </AdminPageLayout>
  );
}
