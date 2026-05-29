'use client';

import Badge from '@/components/ui/Badge';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const QUESTION_TITLES = [
  '¿En qué etapa se encuentra tu proyecto o empresa?',
  'Más allá del logotipo, ¿qué elementos visuales son indispensables?',
  '¿Quién diseñará los contenidos del día a día de tu marca?',
  '¿Qué rango de inversión tienes proyectado para tu identidad visual?',
];

const OPTION_LABELS: Record<'A' | 'B' | 'C', Record<string, string>> = {
  A: {
    q1: 'Idea nueva / proyecto personal / negocio local',
    q2: 'Solo el logo, colores y tipografías básicas',
    q3: 'Yo mismo con guía rápida en PDF',
    q4: 'Alrededor de $100 USD (arranque rápido)',
  },
  B: {
    q1: 'PYME establecida buscando diferenciarse',
    q2: 'Universo visual completo + primeras aplicaciones',
    q3: 'Diseñador in-house o agencia externa (Manual completo)',
    q4: 'Entre $300 y $500 USD (inversión estratégica)',
  },
  C: {
    q1: 'Negocio complejo con múltiples subdivisiones',
    q2: 'Sistema completo + submarcas + guías avanzadas',
    q3: 'Múltiples equipos, producción a gran escala',
    q4: 'Más de $550 USD (despliegue premium)',
  },
};

const PLAN_LABELS: Record<string, string> = {
  essential: 'Grid Essential ($100)',
  corporate: 'Grid Corporate ($300)',
  global: 'Grid Ecosystem ($550)',
};

const PLAN_COLORS: Record<string, string> = {
  essential: 'text-emerald-500',
  corporate: 'text-primary',
  global: 'text-amber-500',
};

interface BrandingDetailProps {
  id: string;
  clientName?: string;
  clientEmail?: string;
  status: string;
  answers?: Record<string, string>;
  score?: Record<string, number>;
  recommendedPlan?: string;
  adminNotes?: string;
  createdAt: string | null;
  baseUrl: string;
  token: string;
}

export default function BrandingQuestionnaireDetail({
  id,
  clientName,
  clientEmail,
  status,
  answers,
  score,
  recommendedPlan,
  adminNotes: initialNotes,
  createdAt,
  baseUrl,
  token,
}: BrandingDetailProps) {
  const router = useRouter();
  const [notes, setNotes] = useState(initialNotes ?? '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (
      !confirm('¿Seguro que quieres eliminar este cuestionario? Esta acción no se puede deshacer.')
    )
      return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/branding-questionnaires/${id}`, { method: 'DELETE' });
      if (res.ok) router.push('/admin/dashboard/branding-questionnaires');
    } finally {
      setDeleting(false);
    }
  };

  const saveNotes = async () => {
    setSaving(true);
    try {
      await fetch(`/api/branding-questionnaires/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminNotes: notes }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(`${baseUrl}/branding/${token}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header info */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-3">
        <div className="flex items-start justify-between flex-wrap gap-2">
          <div>
            <h2 className="font-semibold text-foreground text-lg">{clientName || 'Sin nombre'}</h2>
            {clientEmail && <p className="text-sm text-muted-foreground">{clientEmail}</p>}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={status === 'completed' ? 'success' : 'warning'}>
              {status === 'completed' ? 'Completado' : 'Pendiente'}
            </Badge>
            {recommendedPlan && (
              <span className={`font-bold text-sm ${PLAN_COLORS[recommendedPlan] ?? ''}`}>
                {PLAN_LABELS[recommendedPlan] ?? recommendedPlan}
              </span>
            )}
          </div>
        </div>
        {createdAt && (
          <p className="text-xs text-muted-foreground">
            Creado el{' '}
            {new Date(createdAt).toLocaleDateString('es-ES', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        )}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <button onClick={copyLink} className="text-xs text-primary hover:underline">
            {copied ? '✓ Enlace copiado' : '🔗 Copiar enlace del cuestionario'}
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-destructive text-destructive bg-background hover:bg-destructive/10 disabled:opacity-50 transition-colors"
          >
            {deleting ? 'Eliminando...' : 'Eliminar cuestionario'}
          </button>
        </div>
      </div>

      {/* Score summary */}
      {score && (
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-semibold text-foreground mb-3">Distribución de respuestas</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { key: 'essential', label: 'Essential', color: 'bg-emerald-500' },
              { key: 'corporate', label: 'Corporate', color: 'bg-primary' },
              { key: 'global', label: 'Ecosystem', color: 'bg-amber-500' },
            ].map(({ key, label, color }) => (
              <div key={key} className="text-center">
                <div className="text-2xl font-bold text-foreground">{score[key] ?? 0}</div>
                <div className={`w-full h-1.5 rounded-full mt-1 ${color} opacity-70`} />
                <div className="text-xs text-muted-foreground mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Answers */}
      {answers && (
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <h3 className="font-semibold text-foreground">Respuestas del cliente</h3>
          {(['q1', 'q2', 'q3', 'q4'] as const).map((key, i) => {
            const answer = answers[key] as 'A' | 'B' | 'C' | undefined;
            return (
              <div key={key} className="border-b border-border last:border-0 pb-4 last:pb-0">
                <p className="text-xs text-muted-foreground mb-1">Pregunta {i + 1}</p>
                <p className="text-sm font-medium text-foreground mb-1">{QUESTION_TITLES[i]}</p>
                {answer ? (
                  <p className="text-sm text-foreground bg-primary/10 border border-primary/30 rounded-lg px-3 py-2">
                    <span className="font-bold text-primary mr-2">{answer}.</span>
                    {OPTION_LABELS[answer]?.[key] ?? answer}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">Sin respuesta</p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Admin notes */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-foreground mb-3">Notas internas</h3>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder="Notas sobre este cliente o cuestionario..."
          className="w-full rounded-lg border border-border bg-background text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        />
        <div className="flex justify-end mt-2">
          <button
            onClick={saveNotes}
            disabled={saving}
            className="px-4 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-60 transition-opacity"
          >
            {saving ? 'Guardando...' : saved ? '✓ Guardado' : 'Guardar notas'}
          </button>
        </div>
      </div>
    </div>
  );
}
