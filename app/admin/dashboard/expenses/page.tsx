import AdminBackButton from '@/components/admin/AdminBackButton';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import ExpenseListClient, { type ExpenseRow } from '@/components/admin/ExpenseListClient';
import Expense from '@/database/expense.model';
import connectDB from '@/lib/mongodb';
import { requireAdminSession } from '@/lib/require-admin-session';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Gastos' };

export default async function ExpensesPage() {
  await requireAdminSession('/admin/dashboard/expenses');
  await connectDB();
  const expenses = await Expense.find({ deletedAt: null }).sort({ date: -1 }).lean();

  const totalExpenses = expenses.reduce(
    (sum: number, e: Record<string, unknown>) => sum + (Number(e.amount) || 0),
    0,
  );

  const rows: ExpenseRow[] = expenses.map((e: Record<string, unknown>) => ({
    _id: String(e._id),
    description: String(e.description),
    amount: Number(e.amount),
    category: String(e.category),
    date: String(e.date),
    notes: e.notes ? String(e.notes) : undefined,
  }));

  return (
    <AdminPageLayout>
      <AdminBackButton href="/admin/dashboard" />
      <AdminPageHeader
        title="Gastos"
        description={`${expenses.length} gastos registrados — Total: $${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
        action={{ label: 'Registrar gasto', href: '/admin/dashboard/expenses/new' }}
      />
      <div className="mt-6">
        <ExpenseListClient expenses={rows} />
      </div>
    </AdminPageLayout>
  );
}
