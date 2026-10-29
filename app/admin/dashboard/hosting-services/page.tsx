import AdminBackButton from '@/components/admin/AdminBackButton';
import HostingServiceListClient, {
  type HostingServiceRow,
} from '@/components/admin/HostingServiceListClient';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import Contract from '@/database/contract.model';
import {
  HOSTING_PLAN_IDS,
  getContractPlanCategory,
  getContractPlanName,
} from '@/lib/contract-plan-metadata';
import connectDB from '@/lib/mongodb';
import { requireAdminSession } from '@/lib/require-admin-session';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: 'Hostings activos' };

const DAY_IN_MS = 1000 * 60 * 60 * 24;

function toDateOnly(value: unknown): string | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().split('T')[0];
}

function getRenewalBucket(renewalDate: string | null): 'expired' | 'soon' | 'healthy' | 'missing' {
  if (!renewalDate) return 'missing';

  const dateParts = renewalDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!dateParts) return 'missing';
  const renewal = new Date(
    Number(dateParts[1]),
    Number(dateParts[2]) - 1,
    Number(dateParts[3]),
    0,
    0,
    0,
    0,
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  renewal.setHours(0, 0, 0, 0);

  const daysLeft = Math.ceil((renewal.getTime() - today.getTime()) / DAY_IN_MS);
  if (daysLeft < 0) return 'expired';
  if (daysLeft <= 30) return 'soon';
  return 'healthy';
}

export default async function HostingServicesPage() {
  await requireAdminSession('/admin/dashboard/hosting-services');
  await connectDB();

  const rawContracts = await Contract.find({
    deletedAt: null,
    planId: { $in: [...HOSTING_PLAN_IDS] },
    status: { $in: ['active', 'pending'] },
  })
    .populate('clientId', 'name businessName')
    .sort({ renewalDate: 1, createdAt: -1 })
    .lean();

  const services: HostingServiceRow[] = rawContracts.map((contract: Record<string, unknown>) => {
    const client = contract.clientId as Record<string, unknown> | null;
    const planId = String(contract.planId);

    const renewalPeriodRaw = contract.renewalPeriodMonths;
    const renewalPeriodMonths =
      typeof renewalPeriodRaw === 'number'
        ? renewalPeriodRaw
        : renewalPeriodRaw
          ? Number(renewalPeriodRaw)
          : null;

    const notificationDaysRaw = contract.renewalNotificationDays;
    const renewalNotificationDays =
      typeof notificationDaysRaw === 'number'
        ? notificationDaysRaw
        : Number(notificationDaysRaw ?? 30) || 30;

    return {
      _id: String(contract._id),
      clientName: client?.name ? String(client.name) : '—',
      clientBusiness: client?.businessName ? String(client.businessName) : null,
      planId,
      planName: getContractPlanName(planId),
      totalAmount: Number(contract.totalAmount ?? 0),
      paidAmount: Number(contract.paidAmount ?? 0),
      status: String(contract.status),
      startDate: toDateOnly(contract.startDate),
      isRecurring: Boolean(contract.isRecurring),
      renewalDate: toDateOnly(contract.renewalDate),
      renewalPeriodMonths,
      renewalNotificationDays,
    };
  });

  const stats = services.reduce(
    (acc, service) => {
      const bucket = getRenewalBucket(service.renewalDate);
      if (bucket === 'expired') acc.expired += 1;
      if (bucket === 'soon') acc.soon += 1;
      if (bucket === 'missing') acc.missing += 1;
      if (service.status === 'active') acc.active += 1;
      if (!service.isRecurring) acc.nonRecurring += 1;
      const pendingAmount = Math.max(0, service.totalAmount - service.paidAmount);
      acc.pendingRevenue += pendingAmount;
      return acc;
    },
    { active: 0, expired: 0, soon: 0, missing: 0, nonRecurring: 0, pendingRevenue: 0 },
  );

  return (
    <AdminPageLayout>
      <AdminBackButton href="/admin/dashboard" />
      <AdminPageHeader
        title="Hostings activos"
        description={`${services.length} servicios · ${stats.soon} por vencer · ${stats.expired} vencidos`}
      />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Activos</p>
          <p className="text-2xl font-bold text-primary">{stats.active}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Vencen en 30 días</p>
          <p className="text-2xl font-bold text-amber-600">{stats.soon}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Vencidos</p>
          <p className="text-2xl font-bold text-red-600">{stats.expired}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Sin fecha</p>
          <p className="text-2xl font-bold text-muted-foreground">{stats.missing}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Pendiente por cobrar</p>
          <p className="text-2xl font-bold text-card-foreground">
            ${stats.pendingRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          {stats.nonRecurring > 0 && (
            <p className="text-xs text-amber-600 mt-1">
              {stats.nonRecurring} contrato{stats.nonRecurring !== 1 ? 's' : ''} sin recurrencia
            </p>
          )}
        </div>
      </div>

      <div className="mb-4 rounded-xl border border-border bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
        Esta vista muestra contratos de categoría{' '}
        <strong className="text-card-foreground">{getContractPlanCategory('hosting_annual')}</strong>{' '}
        y <strong className="text-card-foreground">{getContractPlanCategory('domain')}</strong> con
        estado activo o pendiente para controlar renovaciones sin perder vencimientos.
      </div>

      <HostingServiceListClient services={services} />
    </AdminPageLayout>
  );
}
