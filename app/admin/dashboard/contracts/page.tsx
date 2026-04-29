import AdminBackButton from '@/components/admin/AdminBackButton';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import ContractListClient, { type ContractRow } from '@/components/admin/ContractListClient';
import Contract from '@/database/contract.model';
import connectDB from '@/lib/mongodb';
import { PLAN_MAP } from '@/lib/plans';
import { requireAdminSession } from '@/lib/require-admin-session';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Contratos' };

export default async function ContractsPage() {
  await requireAdminSession('/admin/dashboard/contracts');
  await connectDB();
  const contracts = await Contract.find({})
    .populate('clientId', 'name businessName')
    .sort({ createdAt: -1 })
    .lean();

  const rows: ContractRow[] = contracts.map((c: Record<string, unknown>) => {
    const client = c.clientId as Record<string, unknown> | null;
    const planId = String(c.planId);
    const plan = PLAN_MAP[planId];
    return {
      _id: String(c._id),
      clientName: client ? String(client.name) : '—',
      clientBusiness: client?.businessName ? String(client.businessName) : null,
      planName: plan?.name || planId,
      totalAmount: Number(c.totalAmount),
      status: String(c.status),
      deliveryDate: c.deliveryDate ? String(c.deliveryDate) : null,
    };
  });

  return (
    <AdminPageLayout>
      <AdminBackButton href="/admin/dashboard" />
      <AdminPageHeader
        title="Contratos"
        description={`${contracts.length} contratos`}
        action={{ label: 'Nuevo contrato', href: '/admin/dashboard/contracts/new' }}
      />
      <div className="mt-6">
        <ContractListClient contracts={rows} />
      </div>
    </AdminPageLayout>
  );
}
