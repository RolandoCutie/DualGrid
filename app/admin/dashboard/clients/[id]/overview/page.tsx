import AdminBackButton from '@/components/admin/AdminBackButton';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import ClientOverview from '@/components/admin/ClientOverview';
import BrandingQuestionnaire from '@/database/branding-questionnaire.model';
import Client from '@/database/client.model';
import Contract from '@/database/contract.model';
import Expense from '@/database/expense.model';
import Invoice from '@/database/invoice.model';
import Questionnaire from '@/database/questionnaire.model';
import connectDB from '@/lib/mongodb';
import { requireAdminSession } from '@/lib/require-admin-session';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = { title: 'Perfil de cliente' };

export default async function ClientOverviewPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminSession();
  const { id } = await params;
  await connectDB();

  const client = await Client.findById(id).lean();
  if (!client) notFound();

  const [contracts, invoices, brandingQuestionnaires, webQuestionnaires, expenses] =
    await Promise.all([
      Contract.find({ clientId: id }).sort({ createdAt: -1 }).lean(),
      Invoice.find({ clientId: id }).sort({ createdAt: -1 }).lean(),
      BrandingQuestionnaire.find({ clientId: id }).sort({ createdAt: -1 }).lean(),
      Questionnaire.find({ 'answers.email': client.email }).sort({ createdAt: -1 }).lean(),
      Expense.find({ clientId: id, deletedAt: null }).sort({ date: -1 }).lean(),
    ]);

  // Financial summary
  const totalContracted = contracts.reduce((sum, c) => sum + (c.totalAmount ?? 0), 0);
  const totalCollected = invoices
    .filter((inv) => inv.status === 'paid')
    .reduce((sum, inv) => sum + (inv.totalAmount ?? 0), 0);
  const totalPending = invoices
    .filter((inv) => inv.status === 'sent' || inv.status === 'overdue')
    .reduce((sum, inv) => sum + (inv.totalAmount ?? 0), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount ?? 0), 0);
  const netProfit = totalCollected - totalExpenses;

  return (
    <AdminPageLayout maxWidth="5xl">
      <AdminBackButton href="/admin/dashboard/clients" />
      <ClientOverview
        client={{
          id,
          name: client.name,
          email: client.email,
          phone: client.phone ?? null,
          businessName: client.businessName ?? null,
          businessType: (client.businessType as string | undefined) ?? null,
          notes: client.notes ?? null,
          status: (client as { status?: string }).status ?? 'prospect',
          website: (client as { website?: string }).website ?? null,
          instagram: (client as { instagram?: string }).instagram ?? null,
          facebook: (client as { facebook?: string }).facebook ?? null,
          twitter: (client as { twitter?: string }).twitter ?? null,
          linkedin: (client as { linkedin?: string }).linkedin ?? null,
          tiktok: (client as { tiktok?: string }).tiktok ?? null,
          youtube: (client as { youtube?: string }).youtube ?? null,
          city: (client as { city?: string }).city ?? null,
          country: (client as { country?: string }).country ?? null,
          createdAt: client.createdAt.toISOString(),
        }}
        summary={{ totalContracted, totalCollected, totalPending, totalExpenses, netProfit }}
        contracts={contracts.map((c) => ({
          id: c._id.toString(),
          planId: c.planId,
          totalAmount: c.totalAmount,
          paidAmount: c.paidAmount,
          status: c.status,
          startDate: c.startDate?.toISOString() ?? null,
          deliveryDate: c.deliveryDate?.toISOString() ?? null,
        }))}
        invoices={invoices.map((inv) => ({
          id: inv._id.toString(),
          invoiceNumber: inv.invoiceNumber,
          totalAmount: inv.totalAmount,
          status: inv.status,
          issueDate: inv.issueDate?.toISOString() ?? null,
          dueDate: inv.dueDate?.toISOString() ?? null,
        }))}
        brandingQuestionnaires={brandingQuestionnaires.map((bq) => ({
          id: bq._id.toString(),
          token: bq.token,
          status: bq.status,
          recommendedPlan: bq.recommendedPlan ?? null,
          createdAt: bq.createdAt.toISOString(),
        }))}
        webQuestionnaires={webQuestionnaires.map((wq) => {
          const answers = wq.answers as Record<string, string> | undefined;
          return {
            id: wq._id.toString(),
            fullName: answers?.fullName ?? answers?.name ?? '',
            status: wq.status as string,
            recommendedPlan: wq.recommendedPlan ?? null,
            createdAt: (wq.createdAt as Date).toISOString(),
          };
        })}
        expenses={expenses.map((e) => ({
          id: e._id.toString(),
          description: e.description,
          amount: e.amount,
          category: e.category,
          date: (e.date as Date).toISOString(),
          notes: e.notes ?? null,
          currency: e.currency,
        }))}
      />
    </AdminPageLayout>
  );
}
