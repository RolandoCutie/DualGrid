'use client';

import Badge from '@/components/ui/Badge';
import { PLAN_MAP } from '@/lib/plans';
import Link from 'next/link';
import { useState } from 'react';

interface QuestionnaireListRow {
  _id: string;
  status: string;
  recommendedPlan: string;
  createdAt: string | null;
  answers: {
    fullName: string;
    email: string;
    phone: string;
    businessName: string;
    budget: string;
    deadline: string;
  };
}

interface QuestionnaireListClientProps {
  questionnaires: QuestionnaireListRow[];
}

const STATUS_LABELS: Record<string, { label: string; variant: 'primary' | 'warning' | 'success' }> =
  {
    new: { label: 'Nuevo', variant: 'primary' },
    reviewed: { label: 'Revisado', variant: 'warning' },
    contacted: { label: 'Contactado', variant: 'success' },
  };

const FILTER_OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: 'new', label: 'Nuevos' },
  { value: 'reviewed', label: 'Revisados' },
  { value: 'contacted', label: 'Contactados' },
];

export default function QuestionnaireListClient({
  questionnaires: initialQuestionnaires,
}: QuestionnaireListClientProps) {
  const [questionnaires, setQuestionnaires] = useState(initialQuestionnaires);
  const [filter, setFilter] = useState<string>('all');
  const [deleting, setDeleting] = useState<string | null>(null);

  const filtered =
    filter === 'all' ? questionnaires : questionnaires.filter((q) => q.status === filter);

  const handleDelete = async (id: string) => {
    if (
      !confirm('¿Seguro que quieres eliminar este cuestionario? Esta acción no se puede deshacer.')
    )
      return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/questionnaires/${id}`, { method: 'DELETE' });
      if (res.ok) setQuestionnaires((prev) => prev.filter((q) => q._id !== id));
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {FILTER_OPTIONS.map((opt) => {
          const count =
            opt.value === 'all'
              ? questionnaires.length
              : questionnaires.filter((q) => q.status === opt.value).length;
          return (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                filter === opt.value
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card text-card-foreground border-border hover:border-primary/50'
              }`}
            >
              {opt.label}
              <span className="ml-1.5 text-xs opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <p className="text-center py-8 text-muted-foreground">
            No hay cuestionarios con este estado.
          </p>
        )}
        {filtered.map((q) => {
          const plan = PLAN_MAP[q.recommendedPlan];
          const statusInfo = STATUS_LABELS[q.status] || STATUS_LABELS.new;

          return (
            <div
              key={q._id}
              className="border border-border rounded-xl p-5 bg-card flex flex-col sm:flex-row sm:items-center gap-4"
            >
              <Link
                href={`/admin/dashboard/questionnaires/${q._id}`}
                className="flex-1 min-w-0 hover:opacity-80 transition-opacity"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-card-foreground text-sm">
                    {q.answers.fullName || 'Sin nombre'}
                  </span>
                  <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {q.answers.email} · {q.answers.phone}
                </p>
                {q.answers.businessName && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Negocio: <span className="font-medium">{q.answers.businessName}</span>
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Presupuesto: <span className="font-medium">{q.answers.budget || '—'}</span> ·
                  Plazo: <span className="font-medium">{q.answers.deadline || '—'}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Plan:{' '}
                  <span className="font-bold text-primary">{plan?.name || q.recommendedPlan}</span>
                  {q.createdAt && <> · {new Date(q.createdAt).toLocaleDateString('es')}</>}
                </p>
              </Link>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  href={`/admin/dashboard/questionnaires/${q._id}`}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-primary text-primary bg-background hover:bg-primary/10 transition-colors"
                >
                  Ver respuestas
                </Link>
                <button
                  onClick={() => handleDelete(q._id)}
                  disabled={deleting === q._id}
                  title="Eliminar cuestionario"
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-destructive text-destructive bg-background hover:bg-destructive/10 disabled:opacity-50 transition-colors"
                >
                  {deleting === q._id ? '...' : 'Eliminar'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
