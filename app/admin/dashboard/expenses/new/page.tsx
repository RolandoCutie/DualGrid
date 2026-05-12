import AdminBackButton from '@/components/admin/AdminBackButton';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import ExpenseForm from '@/components/admin/ExpenseForm';
import { requireAdminSession } from '@/lib/require-admin-session';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Registrar gasto' };

export default async function NewExpensePage() {
  await requireAdminSession('/admin/dashboard/expenses/new');

  return (
    <AdminPageLayout maxWidth="5xl">
      <AdminBackButton href="/admin/dashboard/expenses" />
      <AdminPageHeader title="Registrar gasto" description="Añade un nuevo gasto al registro." />
      <div className="mt-6">
        <ExpenseForm />
      </div>
    </AdminPageLayout>
  );
}
