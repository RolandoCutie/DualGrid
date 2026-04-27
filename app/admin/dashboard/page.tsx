import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import { requireAdminSession } from '@/lib/require-admin-session';
import Link from 'next/link';

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
];

export default async function AdminDashboard() {
  await requireAdminSession('/admin/dashboard');

  return (
    <AdminPageLayout>
      <AdminPageHeader
        title="Panel de DualGrid"
        description="Gestiona clientes, contratos, facturas y cuestionarios."
      />

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
