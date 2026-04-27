import AdminBackButton from '@/components/admin/AdminBackButton';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import Client from '@/database/client.model';
import connectDB from '@/lib/mongodb';
import { requireAdminSession } from '@/lib/require-admin-session';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Clientes' };

export default async function ClientsPage() {
  await requireAdminSession('/admin/dashboard/clients');
  await connectDB();
  const clients = await Client.find({}).sort({ createdAt: -1 }).lean();

  return (
    <AdminPageLayout>
      <AdminBackButton href="/admin/dashboard" />
      <AdminPageHeader
        title="Clientes"
        description={`${clients.length} clientes registrados`}
        action={{ label: 'Nuevo cliente', href: '/admin/dashboard/clients/new' }}
      />

      <div className="mt-6 overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-card-foreground">Nombre</th>
              <th className="text-left px-4 py-3 font-semibold text-card-foreground">Negocio</th>
              <th className="text-left px-4 py-3 font-semibold text-card-foreground">Email</th>
              <th className="text-left px-4 py-3 font-semibold text-card-foreground">Teléfono</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {clients.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-8 text-muted-foreground">
                  No hay clientes aún.{' '}
                  <Link
                    href="/admin/dashboard/clients/new"
                    className="text-primary hover:underline"
                  >
                    Crear el primero
                  </Link>
                </td>
              </tr>
            )}
            {clients.map((c: Record<string, unknown>) => (
              <tr key={String(c._id)} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-medium text-card-foreground">{String(c.name)}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {c.businessName ? String(c.businessName) : '—'}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{String(c.email)}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {c.phone ? String(c.phone) : '—'}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/dashboard/clients/${String(c._id)}`}
                    className="text-primary text-xs hover:underline"
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminPageLayout>
  );
}
