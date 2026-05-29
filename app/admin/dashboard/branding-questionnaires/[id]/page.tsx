import AdminBackButton from '@/components/admin/AdminBackButton';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import BrandingQuestionnaireDetail from '@/components/admin/BrandingQuestionnaireDetail';
import BrandingQuestionnaire from '@/database/branding-questionnaire.model';
import { getBaseUrl } from '@/lib/base-url';
import connectDB from '@/lib/mongodb';
import { requireAdminSession } from '@/lib/require-admin-session';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = { title: 'Detalle Cuestionario de Branding' };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BrandingDetailPage({ params }: Props) {
  await requireAdminSession('/admin/dashboard/branding-questionnaires');

  const { id } = await params;
  await connectDB();

  let doc: Record<string, unknown> | null = null;
  try {
    doc = (await BrandingQuestionnaire.findById(id).lean()) as Record<string, unknown> | null;
  } catch {
    return notFound();
  }

  if (!doc) return notFound();

  const clientName = doc.clientName ? String(doc.clientName) : undefined;
  const answers = doc.answers as Record<string, string> | undefined;
  const score = doc.score as Record<string, number> | undefined;

  return (
    <AdminPageLayout>
      <AdminBackButton href="/admin/dashboard/branding-questionnaires" />
      <AdminPageHeader
        title={`Cuestionario de ${clientName ?? 'cliente'}`}
        description="Respuestas del test de identidad visual"
      />
      <div className="mt-6">
        <BrandingQuestionnaireDetail
          id={String(doc._id)}
          token={String(doc.token ?? '')}
          clientName={clientName}
          clientEmail={doc.clientEmail ? String(doc.clientEmail) : undefined}
          status={String(doc.status ?? 'pending')}
          answers={answers}
          score={score}
          recommendedPlan={doc.recommendedPlan ? String(doc.recommendedPlan) : undefined}
          adminNotes={doc.adminNotes ? String(doc.adminNotes) : undefined}
          createdAt={doc.createdAt ? String(doc.createdAt) : null}
          baseUrl={getBaseUrl()}
        />
      </div>
    </AdminPageLayout>
  );
}
