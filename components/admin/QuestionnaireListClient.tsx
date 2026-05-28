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

export default function QuestionnaireListClient({ questionnaires }: QuestionnaireListClientProps) {
  const [filter, setFilter] = useState<string>('all');

  const filtered =
    filter === 'all' ? questionnaires : questionnaires.filter((q) => q.status === filter);

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
            <Link
              key={q._id}
              href={`/admin/dashboard/questionnaires/${q._id}`}
              className="flex items-start justify-between gap-4 p-5 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors cursor-pointer"
            >
              <div className="flex-1 min-w-0">
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
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-muted-foreground">Plan recomendado</p>
                <p className="text-sm font-bold text-primary mt-0.5">
                  {plan?.name || q.recommendedPlan}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {q.createdAt ? new Date(q.createdAt).toLocaleDateString('es') : ''}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
