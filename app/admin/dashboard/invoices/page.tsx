import AdminBackButton from '@/components/admin/AdminBackButton';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import InvoiceListClient, { type InvoiceRow } from '@/components/admin/InvoiceListClient';
import Invoice from '@/database/invoice.model';
import connectDB from '@/lib/mongodb';
import { PLAN_MAP } from '@/lib/plans';
import { requireAdminSession } from '@/lib/require-admin-session';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Facturas' };

export default async function InvoicesPage() {
  await requireAdminSession('/admin/dashboard/invoices');
  await connectDB();
  const invoices = await Invoice.find({ deletedAt: null })
    .populate('clientId', 'name')
    .populate('contractId', 'planId')
    .sort({ createdAt: -1 })
    .lean();

  const rows: InvoiceRow[] = invoices.map((inv: Record<string, unknown>) => {
    const client = inv.clientId as Record<string, unknown> | null;
    const contract = inv.contractId as Record<string, unknown> | null;
    const items = (inv.items as Array<Record<string, unknown>>) ?? [];
    const description = items
      .map((it) => String(it.description ?? ''))
      .filter(Boolean)
      .join(' · ');
    const planId = contract ? String(contract.planId ?? '') : '';
    const contractName = planId ? (PLAN_MAP[planId]?.name ?? planId) : null;
    return {
      _id: String(inv._id),
      invoiceNumber: String(inv.invoiceNumber),
      clientName: client ? String(client.name) : '—',
      contractName,
      description,
      totalAmount: Number(inv.totalAmount),
      status: String(inv.status),
      issueDate: inv.issueDate ? String(inv.issueDate) : null,
      dueDate: inv.dueDate ? String(inv.dueDate) : null,
      paymentMethod: inv.paymentMethod ? String(inv.paymentMethod) : null,
    };
  });

  const totalPaid = rows
    .filter((r) => r.status === 'paid')
    .reduce((sum, r) => sum + r.totalAmount, 0);

  return (
    <AdminPageLayout>
      <AdminBackButton href="/admin/dashboard" />
      <AdminPageHeader
        title="Facturas"
        description={`${invoices.length} facturas · $${totalPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD cobrados`}
        action={{ label: 'Nueva factura', href: '/admin/dashboard/invoices/new' }}
      />
      <div className="mt-6">
        <InvoiceListClient invoices={rows} />
      </div>
    </AdminPageLayout>
  );
}
