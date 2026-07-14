import AdminBackButton from '@/components/admin/AdminBackButton';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import InvoiceForm from '@/components/admin/InvoiceForm';
import Client from '@/database/client.model';
import Contract from '@/database/contract.model';
import connectDB from '@/lib/mongodb';
import { PLAN_MAP } from '@/lib/plans';
import { requireAdminSession } from '@/lib/require-admin-session';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Nueva factura' };

export default async function NewInvoicePage() {
  await requireAdminSession('/admin/dashboard/invoices/new');
  await connectDB();

  const [clients, contracts] = await Promise.all([
    Client.find({}).sort({ name: 1 }).lean(),
    Contract.find({ status: { $in: ['active', 'pending'] } })
      .populate('clientId', 'name businessName')
      .lean(),
  ]);

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
        contracts={contracts.map((c) => {
          const client = c.clientId as Record<string, unknown>;
          const clientName = client
            ? client.businessName
              ? String(client.businessName)
              : String(client.name ?? '')
            : '—';
          return {
            _id: c._id.toString(),
            clientId:
              typeof c.clientId === 'object' && c.clientId !== null
                ? ((c.clientId as { _id: unknown })._id?.toString() ?? '')
                : c.clientId.toString(),
            clientName,
            planName: PLAN_MAP[c.planId]?.name ?? c.planId,
            status: c.status,
            totalAmount: c.totalAmount,
          };
        })}
      />
    </AdminPageLayout>
  );
}
