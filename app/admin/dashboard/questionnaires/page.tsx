import AdminBackButton from '@/components/admin/AdminBackButton';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import Badge from '@/components/ui/Badge';
import Questionnaire from '@/database/questionnaire.model';
import connectDB from '@/lib/mongodb';
import { PLAN_MAP } from '@/lib/plans';
import { requireAdminSession } from '@/lib/require-admin-session';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Cuestionarios' };

const STATUS_LABELS: Record<string, { label: string; variant: 'primary' | 'warning' | 'success' }> =
  {
    new: { label: 'Nuevo', variant: 'primary' },
    reviewed: { label: 'Revisado', variant: 'warning' },
    contacted: { label: 'Contactado', variant: 'success' },
  };

export default async function QuestionnairesPage() {
  await requireAdminSession('/admin/dashboard/questionnaires');
  await connectDB();
  const docs = await Questionnaire.find({}).sort({ createdAt: -1 }).lean();

  return (
    <AdminPageLayout>
      <AdminBackButton href="/admin/dashboard" />
      <AdminPageHeader
        title="Cuestionarios recibidos"
        description={`${docs.length} respuestas totales`}
      />

      <div className="mt-6 space-y-3">
        {docs.length === 0 && (
          <p className="text-center py-8 text-muted-foreground">
            Aún no se han recibido cuestionarios. Comparte el enlace de la landing.
          </p>
        )}
        {docs.map((q: Record<string, unknown>) => {
          const answers = q.answers as Record<string, unknown>;
          const status = q.status as string;
          const planId = q.recommendedPlan as string;
          const plan = PLAN_MAP[planId];
          const statusInfo = STATUS_LABELS[status] || STATUS_LABELS.new;

          return (
            <Link
              key={String(q._id)}
              href={`/admin/dashboard/questionnaires/${String(q._id)}`}
              className="flex items-start justify-between gap-4 p-5 rounded-xl border border-border bg-card cursor-pointer"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-card-foreground text-sm">
                    {String(answers.fullName || 'Sin nombre')}
                  </span>
                  <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {String(answers.email || '')} · {String(answers.phone || '')}
                </p>
                {answers.businessName && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Negocio: {String(answers.businessName)}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Presupuesto: <span className="font-medium">{String(answers.budget || '—')}</span>{' '}
                  · Plazo: <span className="font-medium">{String(answers.deadline || '—')}</span>
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-muted-foreground">Plan recomendado</p>
                <p className="text-sm font-bold text-primary mt-0.5">{plan?.name || planId}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {q.createdAt ? new Date(String(q.createdAt)).toLocaleDateString('es') : ''}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </AdminPageLayout>
  );
}
