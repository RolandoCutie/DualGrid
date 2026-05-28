import AdminBackButton from '@/components/admin/AdminBackButton';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import QuestionnaireListClient from '@/components/admin/QuestionnaireListClient';
import Questionnaire from '@/database/questionnaire.model';
import connectDB from '@/lib/mongodb';
import { requireAdminSession } from '@/lib/require-admin-session';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Cuestionarios' };

export default async function QuestionnairesPage() {
  await requireAdminSession('/admin/dashboard/questionnaires');
  await connectDB();
  const docs = await Questionnaire.find({}).sort({ createdAt: -1 }).lean();

  const rows = docs.map((q: Record<string, unknown>) => {
    const answers = (q.answers as Record<string, unknown>) ?? {};
    return {
      _id: String(q._id),
      status: String(q.status ?? 'new'),
      recommendedPlan: String(q.recommendedPlan ?? ''),
      createdAt: q.createdAt ? String(q.createdAt) : null,
      answers: {
        fullName: String(answers.fullName ?? ''),
        email: String(answers.email ?? ''),
        phone: String(answers.phone ?? ''),
        businessName: String(answers.businessName ?? ''),
        budget: String(answers.budget ?? ''),
        deadline: String(answers.deadline ?? ''),
      },
    };
  });

  const newCount = rows.filter((r) => r.status === 'new').length;

  return (
    <AdminPageLayout>
      <AdminBackButton href="/admin/dashboard" />
      <AdminPageHeader
        title="Cuestionarios recibidos"
        description={`${docs.length} respuestas totales${newCount > 0 ? ` · ${newCount} sin revisar` : ''}`}
      />
      <div className="mt-6">
        <QuestionnaireListClient questionnaires={rows} />
      </div>
    </AdminPageLayout>
  );
}
