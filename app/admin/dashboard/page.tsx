import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import RevenueChartWrapper from '@/components/admin/RevenueChartWrapper';
import BrandingQuestionnaire from '@/database/branding-questionnaire.model';
import Client from '@/database/client.model';
import Contract from '@/database/contract.model';
import Expense from '@/database/expense.model';
import HostingLead from '@/database/hosting-lead.model';
import Invoice from '@/database/invoice.model';
import Questionnaire from '@/database/questionnaire.model';
import { getContractPlanName } from '@/lib/contract-plan-metadata';
import connectDB from '@/lib/mongodb';
import { requireAdminSession } from '@/lib/require-admin-session';
import Link from 'next/link';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';
const DAY_IN_MS = 1000 * 60 * 60 * 24;

const MENU_ITEMS = [
  {
    title: 'Clientes',
    description: 'Gestiona tu cartera de clientes y contactos.',
    href: '/admin/dashboard/clients',
    emoji: '👥',
    color: 'text-blue-500',
  },
  {
    title: 'Contratos',
    description: 'Crea y administra contratos de proyectos.',
    href: '/admin/dashboard/contracts',
    emoji: '📋',
    color: 'text-green-500',
  },
  {
    title: 'Facturas',
    description: 'Facturación y seguimiento de pagos.',
    href: '/admin/dashboard/invoices',
    emoji: '💳',
    color: 'text-purple-500',
  },
  {
    title: 'Gastos',
    description: 'Registra y controla los gastos del negocio.',
    href: '/admin/dashboard/expenses',
    emoji: '💸',
    color: 'text-red-500',
  },
  {
    title: 'Cuestionarios',
    description: 'Respuestas recibidas del formulario de la landing.',
    href: '/admin/dashboard/questionnaires',
    emoji: '📊',
    color: 'text-amber-500',
  },
  {
    title: 'Proyectos',
    description: 'Gestiona el portafolio de proyectos del sitio.',
    href: '/admin/dashboard/projects',
    emoji: '🖥️',
    color: 'text-indigo-500',
  },
  {
    title: 'Branding',
    description: 'Genera y gestiona cuestionarios de identidad visual para clientes.',
    href: '/admin/dashboard/branding-questionnaires',
    emoji: '🎨',
    color: 'text-pink-500',
  },
  {
    title: 'Hostings activos',
    description: 'Controla renovaciones, vencimientos y estado de hostings activos.',
    href: '/admin/dashboard/hosting-services',
    emoji: '🗂️',
    color: 'text-cyan-500',
  },
  {
    title: 'Leads de Hosting',
    description: 'Solicitudes de hosting y dominio desde la landing.',
    href: '/admin/dashboard/hosting-leads',
    emoji: '🖥️',
    color: 'text-sky-500',
  },
];

interface AggResult {
  _id: string;
  count: number;
  total: number;
}

/** Separate async Server Component so stats stream in independently (#34) */
async function DashboardStats() {
  await connectDB();

  const [totalClients, contractAgg, invoiceAgg, totalExpenses, totalQuestionnaires] =
    await Promise.all([
      Client.countDocuments({ deletedAt: null }),
      Contract.aggregate<AggResult>([
        { $match: { deletedAt: null } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Invoice.aggregate<AggResult>([
        { $match: { deletedAt: null } },
        { $group: { _id: '$status', count: { $sum: 1 }, total: { $sum: '$totalAmount' } } },
      ]),
      Expense.aggregate<{ total: number }>([
        { $match: { deletedAt: null } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]).then((r) => r[0]?.total ?? 0),
      Questionnaire.countDocuments({ status: 'new', deletedAt: null }),
    ]);

  const activeContracts =
    (contractAgg.find((s) => s._id === 'active')?.count ?? 0) +
    (contractAgg.find((s) => s._id === 'pending')?.count ?? 0);
  const paidRevenue = invoiceAgg.find((s) => s._id === 'paid')?.total ?? 0;
  const pendingRevenue =
    (invoiceAgg.find((s) => s._id === 'sent')?.total ?? 0) +
    (invoiceAgg.find((s) => s._id === 'overdue')?.total ?? 0);
  const overdueCount = invoiceAgg.find((s) => s._id === 'overdue')?.count ?? 0;
  const netProfit = paidRevenue - totalExpenses;

  return (
    <div className="admin-density-grid admin-density-section-offset grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-3 mt-6">
      <div className="admin-density-card rounded-2xl border border-border bg-card p-4">
        <p className="text-xs text-muted-foreground mb-1">Clientes</p>
        <p className="text-2xl font-bold text-card-foreground">{totalClients}</p>
      </div>
      <div className="admin-density-card rounded-2xl border border-border bg-card p-4">
        <p className="text-xs text-muted-foreground mb-1">Contratos activos</p>
        <p className="text-2xl font-bold text-primary">{activeContracts}</p>
      </div>
      <div className="admin-density-card rounded-2xl border border-border bg-card p-4">
        <p className="text-xs text-muted-foreground mb-1">Leads nuevos</p>
        <p className="text-2xl font-bold text-amber-500">{totalQuestionnaires}</p>
        <p className="text-xs text-muted-foreground">sin revisar</p>
      </div>
      <div className="admin-density-card rounded-2xl border border-border bg-card p-4">
        <p className="text-xs text-muted-foreground mb-1">Ingresos cobrados</p>
        <p className="text-xl font-bold text-green-500">
          ${paidRevenue.toLocaleString('en-US', { minimumFractionDigits: 0 })}
        </p>
      </div>
      <div className="admin-density-card rounded-2xl border border-border bg-card p-4">
        <p className="text-xs text-muted-foreground mb-1">Por cobrar</p>
        <p className="text-xl font-bold text-amber-500">
          ${pendingRevenue.toLocaleString('en-US', { minimumFractionDigits: 0 })}
        </p>
        {overdueCount > 0 && (
          <p className="text-xs text-red-500 mt-0.5">
            {overdueCount} vencida{overdueCount > 1 ? 's' : ''}
          </p>
        )}
      </div>
      <div className="admin-density-card rounded-2xl border border-border bg-card p-4">
        <p className="text-xs text-muted-foreground mb-1">Ganancia neta</p>
        <p className={`text-xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          ${netProfit.toLocaleString('en-US', { minimumFractionDigits: 0 })}
        </p>
        <p className="text-xs text-muted-foreground">cobrado − gastos</p>
      </div>
    </div>
  );
}

function formatDateLabel(value: unknown) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('es', { day: '2-digit', month: 'short' });
}

function getDaysFromToday(value: unknown) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) return null;

  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Math.ceil((compareDate.getTime() - today.getTime()) / DAY_IN_MS);
}

/** Smart alerts: overdue invoices, upcoming renewals and pending tasks */
async function DashboardAlerts() {
  await connectDB();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const nextThirtyDays = new Date(today);
  nextThirtyDays.setDate(nextThirtyDays.getDate() + 30);

  const overdueQuery = {
    deletedAt: null,
    status: { $in: ['sent', 'overdue'] },
    dueDate: { $lt: today },
  };

  const renewalsQuery = {
    deletedAt: null,
    isRecurring: true,
    status: { $in: ['active', 'pending', 'completed'] },
    renewalDate: { $gte: today, $lte: nextThirtyDays },
  };

  const [
    overdueInvoicesPreview,
    overdueInvoicesCount,
    renewalsPreview,
    renewalsCount,
    pendingContractsCount,
    pendingQuestionnairesCount,
    pendingBrandingCount,
    pendingHostingLeadsCount,
  ] = await Promise.all([
    Invoice.find(overdueQuery)
      .populate('clientId', 'name')
      .sort({ dueDate: 1 })
      .limit(4)
      .lean(),
    Invoice.countDocuments(overdueQuery),
    Contract.find(renewalsQuery)
      .populate('clientId', 'name')
      .sort({ renewalDate: 1 })
      .limit(4)
      .lean(),
    Contract.countDocuments(renewalsQuery),
    Contract.countDocuments({ deletedAt: null, status: 'pending' }),
    Questionnaire.countDocuments({ deletedAt: null, status: 'new' }),
    BrandingQuestionnaire.countDocuments({ deletedAt: null, status: 'pending' }),
    HostingLead.countDocuments({ deletedAt: null, status: 'new' }),
  ]);

  const pendingTaskCount =
    pendingContractsCount +
    pendingQuestionnairesCount +
    pendingBrandingCount +
    pendingHostingLeadsCount;

  const taskBreakdown = [
    {
      label: 'Contratos pendientes',
      count: pendingContractsCount,
      href: '/admin/dashboard/contracts',
    },
    {
      label: 'Cuestionarios web sin revisar',
      count: pendingQuestionnairesCount,
      href: '/admin/dashboard/questionnaires',
    },
    {
      label: 'Cuestionarios de branding pendientes',
      count: pendingBrandingCount,
      href: '/admin/dashboard/branding-questionnaires',
    },
    {
      label: 'Leads de hosting nuevos',
      count: pendingHostingLeadsCount,
      href: '/admin/dashboard/hosting-leads',
    },
  ];

  return (
    <section className="admin-density-section admin-density-section-offset mt-6 rounded-2xl border border-border bg-card p-5">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-card-foreground">Alertas inteligentes</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Seguimiento proactivo de cobros, renovaciones y pendientes del equipo.
        </p>
      </div>

      <div className="admin-density-grid grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="admin-density-card rounded-xl border border-red-200/70 bg-red-50/60 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-red-700">
              Facturas vencidas
            </p>
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700">
              {overdueInvoicesCount}
            </span>
          </div>
          <p className="mt-2 text-sm text-red-700/90">
            {overdueInvoicesCount > 0
              ? 'Requieren seguimiento inmediato para no perder flujo de caja.'
              : 'Todo al día. No hay cobros vencidos ahora mismo.'}
          </p>
          {overdueInvoicesPreview.length > 0 && (
            <ul className="mt-3 space-y-1.5 text-xs text-red-800">
              {overdueInvoicesPreview.map((invoice: Record<string, unknown>) => {
                const client = invoice.clientId as Record<string, unknown> | null;
                const dueDateLabel = formatDateLabel(invoice.dueDate);
                const overdueDays = getDaysFromToday(invoice.dueDate);

                return (
                  <li key={String(invoice._id)}>
                    <Link
                      href={`/admin/dashboard/invoices/${String(invoice._id)}`}
                      className="font-medium hover:underline"
                    >
                      {String(invoice.invoiceNumber ?? 'Factura')}
                    </Link>{' '}
                    · {String(client?.name ?? 'Cliente')}
                    {dueDateLabel && overdueDays !== null && overdueDays < 0 && (
                      <span className="text-red-600">
                        {' '}
                        ({Math.abs(overdueDays)} día{Math.abs(overdueDays) !== 1 ? 's' : ''} de
                        atraso · {dueDateLabel})
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
          <Link
            href="/admin/dashboard/invoices"
            className="mt-3 inline-flex text-xs font-semibold text-red-700 hover:underline"
          >
            Ir a facturas →
          </Link>
        </div>

        <div className="admin-density-card rounded-xl border border-amber-200/70 bg-amber-50/60 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
              Renovaciones próximas
            </p>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">
              {renewalsCount}
            </span>
          </div>
          <p className="mt-2 text-sm text-amber-800/90">
            {renewalsCount > 0
              ? 'Servicios recurrentes que vencen en los próximos 30 días.'
              : 'No hay renovaciones cercanas en la próxima ventana de 30 días.'}
          </p>
          {renewalsPreview.length > 0 && (
            <ul className="mt-3 space-y-1.5 text-xs text-amber-900">
              {renewalsPreview.map((contract: Record<string, unknown>) => {
                const client = contract.clientId as Record<string, unknown> | null;
                const renewalLabel = formatDateLabel(contract.renewalDate);
                const daysLeft = getDaysFromToday(contract.renewalDate);

                return (
                  <li key={String(contract._id)}>
                    <Link
                      href={`/admin/dashboard/contracts/${String(contract._id)}`}
                      className="font-medium hover:underline"
                    >
                      {String(client?.name ?? 'Cliente')}
                    </Link>{' '}
                    · {getContractPlanName(String(contract.planId ?? 'custom'))}
                    {renewalLabel && daysLeft !== null && (
                      <span className="text-amber-800">
                        {' '}
                        ({daysLeft <= 0 ? 'vence hoy' : `en ${daysLeft} día${daysLeft !== 1 ? 's' : ''}`} ·{' '}
                        {renewalLabel})
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
          <Link
            href="/admin/dashboard/hosting-services"
            className="mt-3 inline-flex text-xs font-semibold text-amber-800 hover:underline"
          >
            Ir a hostings activos →
          </Link>
        </div>

        <div className="admin-density-card rounded-xl border border-blue-200/80 bg-blue-50/60 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
              Tareas pendientes
            </p>
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700">
              {pendingTaskCount}
            </span>
          </div>
          <p className="mt-2 text-sm text-blue-700/90">
            Priorización rápida para mantener el pipeline comercial y operativo al día.
          </p>
          <ul className="mt-3 space-y-1.5 text-xs text-blue-900">
            {taskBreakdown.map((task) => (
              <li key={task.label} className="flex items-center justify-between gap-3">
                <Link href={task.href} className="hover:underline">
                  {task.label}
                </Link>
                <span className="rounded-full bg-blue-100 px-2 py-0.5 font-semibold">
                  {task.count}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/** Monthly revenue chart — streams independently */
async function DashboardChart() {
  await connectDB();
  const currentYear = new Date().getFullYear();
  const start = new Date(`${currentYear}-01-01T00:00:00.000Z`);
  const end = new Date(`${currentYear + 1}-01-01T00:00:00.000Z`);

  const result = await Invoice.aggregate<{ month: number; billed: number; collected: number }>([
    {
      $match: {
        deletedAt: null,
        issueDate: { $gte: start, $lt: end },
        status: { $ne: 'cancelled' },
      },
    },
    {
      $group: {
        _id: { $month: '$issueDate' },
        billed: { $sum: '$totalAmount' },
        collected: { $sum: { $cond: [{ $eq: ['$status', 'paid'] }, '$totalAmount', 0] } },
      },
    },
    { $project: { _id: 0, month: '$_id', billed: 1, collected: 1 } },
    { $sort: { month: 1 } },
  ]);

  return <RevenueChartWrapper initialYear={currentYear} initialData={result} />;
}

function AlertsSkeleton() {
  return (
    <section className="admin-density-section admin-density-section-offset mt-6 rounded-2xl border border-border bg-card p-5">
      <div className="h-4 w-44 rounded bg-muted animate-pulse mb-2" />
      <div className="h-3 w-80 max-w-full rounded bg-muted animate-pulse mb-4" />
      <div className="admin-density-grid grid grid-cols-1 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="admin-density-card rounded-xl border border-border bg-background p-4 space-y-2"
          >
            <div className="h-3 w-24 rounded bg-muted animate-pulse" />
            <div className="h-3 w-full rounded bg-muted animate-pulse" />
            <div className="h-3 w-5/6 rounded bg-muted animate-pulse" />
            <div className="h-3 w-2/3 rounded bg-muted animate-pulse" />
          </div>
        ))}
      </div>
    </section>
  );
}

/** Skeleton shown while stats are loading */
function StatsSkeleton() {
  return (
    <div className="admin-density-grid admin-density-section-offset grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-3 mt-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="admin-density-card rounded-2xl border border-border bg-card p-4 animate-pulse">
          <div className="h-3 bg-muted rounded w-3/4 mb-2" />
          <div className="h-7 bg-muted rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}

export default async function AdminDashboard() {
  await requireAdminSession('/admin/dashboard');

  return (
    <AdminPageLayout>
      <AdminPageHeader
        title="Panel de DualGrid"
        description="Gestiona clientes, contratos, facturas y cuestionarios."
      />

      {/* Stats stream independently — menu links appear immediately (#34) */}
      <Suspense fallback={<StatsSkeleton />}>
        <DashboardStats />
      </Suspense>

      <Suspense fallback={<AlertsSkeleton />}>
        <DashboardAlerts />
      </Suspense>

      {/* Revenue chart */}
      <div className="admin-density-section-offset mt-6">
        <Suspense
          fallback={
            <div className="admin-density-section rounded-xl border border-border bg-card p-5 h-[280px] animate-pulse" />
          }
        >
          <DashboardChart />
        </Suspense>
      </div>

      <div className="admin-density-grid admin-density-section-offset grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        {MENU_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="admin-density-card-lg flex items-start gap-4 p-5 rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all duration-200 group"
          >
            <span className={`text-3xl ${item.color}`}>{item.emoji}</span>
            <div>
              <h3 className="font-bold text-card-foreground group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5">{item.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </AdminPageLayout>
  );
}
