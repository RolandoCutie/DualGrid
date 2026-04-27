import AdminBackButton from '@/components/admin/AdminBackButton';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import Badge from '@/components/ui/Badge';
import Invoice from '@/database/invoice.model';
import connectDB from '@/lib/mongodb';
import { requireAdminSession } from '@/lib/require-admin-session';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Facturas' };

const STATUS_COLORS: Record<string, 'secondary' | 'warning' | 'success' | 'primary' | 'error'> = {
  draft: 'secondary',
  sent: 'primary',
  paid: 'success',
  overdue: 'error',
  cancelled: 'secondary',
};

const STATUS_LABELS: Record<string, string> = {
  draft: 'Borrador',
  sent: 'Enviada',
  paid: 'Pagada',
  overdue: 'Vencida',
  cancelled: 'Cancelada',
};

export default async function InvoicesPage() {
  await requireAdminSession('/admin/dashboard/invoices');
  await connectDB();
  const invoices = await Invoice.find({})
    .populate('clientId', 'name businessName')
    .sort({ createdAt: -1 })
    .lean();

  const totalPaid = invoices
    .filter((i: Record<string, unknown>) => i.status === 'paid')
    .reduce((sum: number, i: Record<string, unknown>) => sum + Number(i.totalAmount), 0);

  return (
    <AdminPageLayout>
      <AdminBackButton href="/admin/dashboard" />
      <AdminPageHeader
        title="Facturas"
        description={`${invoices.length} facturas · $${totalPaid} USD cobrados`}
        action={{ label: 'Nueva factura', href: '/admin/dashboard/invoices/new' }}
      />

      <div className="mt-6 overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-card-foreground">N°</th>
              <th className="text-left px-4 py-3 font-semibold text-card-foreground">Cliente</th>
              <th className="text-left px-4 py-3 font-semibold text-card-foreground">Total</th>
              <th className="text-left px-4 py-3 font-semibold text-card-foreground">Estado</th>
              <th className="text-left px-4 py-3 font-semibold text-card-foreground">
                Vencimiento
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {invoices.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-muted-foreground">
                  No hay facturas aún.
                </td>
              </tr>
            )}
            {invoices.map((inv: Record<string, unknown>) => {
              const client = inv.clientId as Record<string, unknown> | null;
              const status = String(inv.status);
              return (
                <tr key={String(inv._id)} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-primary font-semibold">
                    {String(inv.invoiceNumber)}
                  </td>
                  <td className="px-4 py-3 font-medium text-card-foreground">
                    {client ? String(client.name) : '—'}
                  </td>
                  <td className="px-4 py-3 font-semibold text-card-foreground">
                    ${String(inv.totalAmount)} USD
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={STATUS_COLORS[status] || 'secondary'}>
                      {STATUS_LABELS[status] || status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {inv.dueDate ? new Date(String(inv.dueDate)).toLocaleDateString('es') : '—'}
                  </td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <Link
                      href={`/admin/dashboard/invoices/${String(inv._id)}`}
                      className="text-primary text-xs hover:underline"
                    >
                      Editar
                    </Link>
                    <Link
                      href={`/api/invoices/${String(inv._id)}/pdf`}
                      className="text-muted-foreground text-xs hover:underline"
                      target="_blank"
                    >
                      PDF
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AdminPageLayout>
  );
}
