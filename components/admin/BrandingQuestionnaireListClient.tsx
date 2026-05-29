'use client';

import Badge from '@/components/ui/Badge';
import Link from 'next/link';
import { useState } from 'react';

const PLAN_LABELS: Record<string, string> = {
  essential: 'Grid Essential ($100)',
  corporate: 'Grid Corporate ($300)',
  global: 'Grid Ecosystem ($550)',
};

const STATUS_VARIANTS: Record<string, 'primary' | 'warning' | 'success'> = {
  pending: 'warning',
  completed: 'success',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  completed: 'Completado',
};

export interface BrandingRow {
  _id: string;
  token: string;
  clientId?: string;
  clientName?: string;
  clientEmail?: string;
  status: string;
  recommendedPlan?: string;
  createdAt: string | null;
}

interface BrandingQuestionnaireListClientProps {
  rows: BrandingRow[];
  baseUrl: string;
}

const FILTER_OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'completed', label: 'Completados' },
];

export default function BrandingQuestionnaireListClient({
  rows: initialRows,
  baseUrl,
}: BrandingQuestionnaireListClientProps) {
  const [rows, setRows] = useState(initialRows);
  const [filter, setFilter] = useState('all');
  const [copied, setCopied] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const filtered = filter === 'all' ? rows : rows.filter((r) => r.status === filter);

  const handleDelete = async (id: string) => {
    if (
      !confirm('¿Seguro que quieres eliminar este cuestionario? Esta acción no se puede deshacer.')
    )
      return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/branding-questionnaires/${id}`, { method: 'DELETE' });
      if (res.ok) setRows((prev) => prev.filter((r) => r._id !== id));
    } finally {
      setDeleting(null);
    }
  };

  const copyLink = async (token: string) => {
    const url = `${baseUrl}/branding/${token}`;
    await navigator.clipboard.writeText(url);
    setCopied(token);
    setTimeout(() => setCopied(null), 2000);
  };

  const openWhatsApp = (token: string, clientName?: string) => {
    const url = `${baseUrl}/branding/${token}`;
    const name = clientName ? ` ${clientName}` : '';
    const msg = encodeURIComponent(
      `Hola${name}! 👋 Te comparto el siguiente enlace para que completes el test de identidad visual de DualGrid Studio. Solo son 4 preguntas rápidas y al final verás el plan de branding que mejor se adapta a tu proyecto 🎨\n\n${url}`,
    );
    const phone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '';
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  };

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {FILTER_OPTIONS.map((opt) => {
          const count =
            opt.value === 'all' ? rows.length : rows.filter((r) => r.status === opt.value).length;
          return (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                filter === opt.value
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-muted-foreground border-border hover:border-primary/50'
              }`}
            >
              {opt.label} <span className="opacity-60 text-xs">({count})</span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground text-sm py-8 text-center">
          No hay cuestionarios en este estado.
        </p>
      ) : (
        <div className="space-y-3">
          {filtered.map((row) => (
            <div
              key={row._id}
              className="border border-border rounded-xl p-4 bg-card flex flex-col sm:flex-row sm:items-center gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-semibold text-foreground truncate">
                    {row.clientName || 'Sin nombre'}
                  </span>
                  {row.clientEmail && (
                    <span className="text-xs text-muted-foreground truncate">
                      {row.clientEmail}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={STATUS_VARIANTS[row.status] ?? 'primary'}>
                    {STATUS_LABELS[row.status] ?? row.status}
                  </Badge>
                  {row.recommendedPlan && (
                    <Badge variant="primary">
                      {PLAN_LABELS[row.recommendedPlan] ?? row.recommendedPlan}
                    </Badge>
                  )}
                  {row.createdAt && (
                    <span className="text-xs text-muted-foreground">
                      {new Date(row.createdAt).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => copyLink(row.token)}
                  title="Copiar enlace del cuestionario"
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-background hover:bg-muted transition-colors"
                >
                  {copied === row.token ? '✓ Copiado' : '🔗 Copiar enlace'}
                </button>
                <button
                  onClick={() => openWhatsApp(row.token, row.clientName)}
                  title="Enviar por WhatsApp"
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-background hover:bg-emerald-500/10 transition-colors"
                >
                  WhatsApp
                </button>
                {row.status === 'completed' && (
                  <Link
                    href={`/admin/dashboard/branding-questionnaires/${row._id}`}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg border border-primary text-primary bg-background hover:bg-primary/10 transition-colors"
                  >
                    Ver respuestas
                  </Link>
                )}
                <button
                  onClick={() => handleDelete(row._id)}
                  disabled={deleting === row._id}
                  title="Eliminar cuestionario"
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-destructive text-destructive bg-background hover:bg-destructive/10 disabled:opacity-50 transition-colors"
                >
                  {deleting === row._id ? '...' : 'Eliminar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
