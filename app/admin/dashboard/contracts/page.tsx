import AdminBackButton from '@/components/admin/AdminBackButton';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import Badge from '@/components/ui/Badge';
import Contract from '@/database/contract.model';
import connectDB from '@/lib/mongodb';
import { PLAN_MAP } from '@/lib/plans';
import { requireAdminSession } from '@/lib/require-admin-session';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Contratos' };

const STATUS_COLORS: Record<string, 'secondary' | 'warning' | 'success' | 'primary' | 'error'> = {
  draft: 'secondary',
  pending: 'warning',
  active: 'primary',
  completed: 'success',
  cancelled: 'error',
};

const STATUS_LABELS: Record<string, string> = {
  draft: 'Borrador',
  pending: 'Pendiente',
  active: 'Activo',
  completed: 'Completado',
  cancelled: 'Cancelado',
};

export default async function ContractsPage() {
  await requireAdminSession('/admin/dashboard/contracts');
  await connectDB();
  const contracts = await Contract.find({})
    .populate('clientId', 'name businessName')
    .sort({ createdAt: -1 })
    .lean();

  return (
    <AdminPageLayout>
      <AdminBackButton href="/admin/dashboard" />
      <AdminPageHeader
        title="Contratos"
        description={`${contracts.length} contratos`}
        action={{ label: 'Nuevo contrato', href: '/admin/dashboard/contracts/new' }}
      />

      <div className="mt-6 overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-card-foreground">Cliente</th>
              <th className="text-left px-4 py-3 font-semibold text-card-foreground">Plan</th>
              <th className="text-left px-4 py-3 font-semibold text-card-foreground">Total</th>
              <th className="text-left px-4 py-3 font-semibold text-card-foreground">Estado</th>
              <th className="text-left px-4 py-3 font-semibold text-card-foreground">Entrega</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {contracts.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-muted-foreground">
                  No hay contratos aún.
                </td>
              </tr>
            )}
            {contracts.map((c: Record<string, unknown>) => {
              const client = c.clientId as Record<string, unknown> | null;
              const planId = String(c.planId);
              const plan = PLAN_MAP[planId];
              const status = String(c.status);
              return (
                <tr key={String(c._id)} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-card-foreground">
                    {client ? String(client.name) : '—'}
                    {client?.businessName && (
                      <span className="block text-xs text-muted-foreground">
                        {String(client.businessName)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{plan?.name || planId}</td>
                  <td className="px-4 py-3 font-semibold text-card-foreground">
                    ${String(c.totalAmount)} USD
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={STATUS_COLORS[status] || 'secondary'}>
                      {STATUS_LABELS[status] || status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {c.deliveryDate
                      ? new Date(String(c.deliveryDate)).toLocaleDateString('es')
                      : '—'}
                  </td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <Link
                      href={`/admin/dashboard/contracts/${String(c._id)}`}
                      className="text-primary text-xs hover:underline"
                    >
                      Editar
                    </Link>
                    <Link
                      href={`/api/contracts/${String(c._id)}/pdf`}
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
