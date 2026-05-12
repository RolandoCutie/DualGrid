import AdminBackButton from '@/components/admin/AdminBackButton';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import ExpenseForm from '@/components/admin/ExpenseForm';
import Expense from '@/database/expense.model';
import connectDB from '@/lib/mongodb';
import { requireAdminSession } from '@/lib/require-admin-session';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = { title: 'Editar gasto' };

export default async function EditExpensePage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminSession();
  const { id } = await params;
  await connectDB();

  const expense = await Expense.findById(id).lean();
  if (!expense) notFound();

  const dateStr =
    expense.date instanceof Date
      ? expense.date.toISOString().split('T')[0]
      : String(expense.date).split('T')[0];

  return (
    <AdminPageLayout maxWidth="5xl">
      <AdminBackButton href="/admin/dashboard/expenses" />
      <AdminPageHeader
        title={`Editar: ${expense.description}`}
        description={`$${Number(expense.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
      />
      <div className="mt-6">
        <ExpenseForm
          expenseId={id}
          defaultValues={{
            description: expense.description,
            amount: String(expense.amount),
            category: expense.category,
            date: dateStr,
            notes: expense.notes ?? '',
          }}
        />
      </div>
    </AdminPageLayout>
  );
}
