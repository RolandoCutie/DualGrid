import AdminBackButton from '@/components/admin/AdminBackButton';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import BrandingPageClient from '@/components/admin/BrandingPageClient';
import BrandingQuestionnaire from '@/database/branding-questionnaire.model';
import Client from '@/database/client.model';
import { getBaseUrl } from '@/lib/base-url';
import connectDB from '@/lib/mongodb';
import { requireAdminSession } from '@/lib/require-admin-session';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Cuestionarios de Branding' };

export default async function BrandingQuestionnairesPage() {
  await requireAdminSession('/admin/dashboard/branding-questionnaires');
  await connectDB();

  const [docs, clientDocs] = await Promise.all([
    BrandingQuestionnaire.find({}).sort({ createdAt: -1 }).lean(),
    Client.find({}).sort({ name: 1 }).select('name email').lean(),
  ]);

  const rows = docs.map((q: Record<string, unknown>) => ({
    _id: String(q._id),
    token: String(q.token ?? ''),
    clientId: q.clientId ? String(q.clientId) : undefined,
    clientName: q.clientName ? String(q.clientName) : undefined,
    clientEmail: q.clientEmail ? String(q.clientEmail) : undefined,
    status: String(q.status ?? 'pending'),
    recommendedPlan: q.recommendedPlan ? String(q.recommendedPlan) : undefined,
    createdAt: q.createdAt ? String(q.createdAt) : null,
  }));

  const clients = clientDocs.map((c: Record<string, unknown>) => ({
    _id: String(c._id),
    name: String(c.name ?? ''),
    email: String(c.email ?? ''),
  }));

  const pendingCount = rows.filter((r) => r.status === 'pending').length;
  const completedCount = rows.filter((r) => r.status === 'completed').length;

  return (
    <AdminPageLayout>
      <AdminBackButton href="/admin/dashboard" />
      <AdminPageHeader
        title="Cuestionarios de Branding"
        description={`${rows.length} asignaciones totales · ${completedCount} completadas · ${pendingCount} pendientes`}
      />
      <div className="mt-6">
        <BrandingPageClient initialRows={rows} clients={clients} baseUrl={getBaseUrl()} />
      </div>
    </AdminPageLayout>
  );
}
