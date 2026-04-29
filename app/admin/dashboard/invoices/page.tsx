import AdminBackButton from '@/components/admin/AdminBackButton';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import InvoiceListClient, { type InvoiceRow } from '@/components/admin/InvoiceListClient';
import Invoice from '@/database/invoice.model';
import connectDB from '@/lib/mongodb';
import { requireAdminSession } from '@/lib/require-admin-session';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Facturas' };

export default async function InvoicesPage() {
  await requireAdminSession('/admin/dashboard/invoices');
  await connectDB();
  const invoices = await Invoice.find({})
    .populate('clientId', 'name')
    .sort({ createdAt: -1 })
    .lean();

  const totalPaid = invoices
    .filter((i: Record<string, unknown>) => i.status === 'paid')
    .reduce((sum: number, i: Record<string, unknown>) => sum + Number(i.totalAmount), 0);

  const rows: InvoiceRow[] = invoices.map((inv: Record<string, unknown>) => {
    const client = inv.clientId as Record<string, unknown> | null;
    return {
      _id: String(inv._id),
      invoiceNumber: String(inv.invoiceNumber),
      clientName: client ? String(client.name) : '—',
      totalAmount: Number(inv.totalAmount),
      status: String(inv.status),
      dueDate: inv.dueDate ? String(inv.dueDate) : null,
    };
  });

  return (
    <AdminPageLayout>
      <AdminBackButton href="/admin/dashboard" />
      <AdminPageHeader
        title="Facturas"
        description={`${invoices.length} facturas · $${totalPaid} USD cobrados`}
        action={{ label: 'Nueva factura', href: '/admin/dashboard/invoices/new' }}
      />
      <div className="mt-6">
        <InvoiceListClient invoices={rows} />
      </div>
    </AdminPageLayout>
  );
}
