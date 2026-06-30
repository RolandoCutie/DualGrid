import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import Client from '@/database/client.model';
import Contract from '@/database/contract.model';
import Expense from '@/database/expense.model';
import Invoice from '@/database/invoice.model';
import Questionnaire from '@/database/questionnaire.model';
import connectDB from '@/lib/mongodb';
import { requireAdminSession } from '@/lib/require-admin-session';
import Link from 'next/link';
import { Suspense } from 'react';

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
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-3 mt-6">
      <div className="rounded-2xl border border-border bg-card p-4">
        <p className="text-xs text-muted-foreground mb-1">Clientes</p>
        <p className="text-2xl font-bold text-card-foreground">{totalClients}</p>
      </div>
      <div className="rounded-2xl border border-border bg-card p-4">
        <p className="text-xs text-muted-foreground mb-1">Contratos activos</p>
        <p className="text-2xl font-bold text-primary">{activeContracts}</p>
      </div>
      <div className="rounded-2xl border border-border bg-card p-4">
        <p className="text-xs text-muted-foreground mb-1">Leads nuevos</p>
        <p className="text-2xl font-bold text-amber-500">{totalQuestionnaires}</p>
        <p className="text-xs text-muted-foreground">sin revisar</p>
      </div>
      <div className="rounded-2xl border border-border bg-card p-4">
        <p className="text-xs text-muted-foreground mb-1">Ingresos cobrados</p>
        <p className="text-xl font-bold text-green-500">
          ${paidRevenue.toLocaleString('en-US', { minimumFractionDigits: 0 })}
        </p>
      </div>
      <div className="rounded-2xl border border-border bg-card p-4">
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
      <div className="rounded-2xl border border-border bg-card p-4">
        <p className="text-xs text-muted-foreground mb-1">Ganancia neta</p>
        <p className={`text-xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          ${netProfit.toLocaleString('en-US', { minimumFractionDigits: 0 })}
        </p>
        <p className="text-xs text-muted-foreground">cobrado − gastos</p>
      </div>
    </div>
  );
}

/** Skeleton shown while stats are loading */
function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-3 mt-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-border bg-card p-4 animate-pulse">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        {MENU_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-start gap-4 p-5 rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all duration-200 group"
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
