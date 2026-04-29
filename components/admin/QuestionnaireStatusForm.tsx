'use client';

import { useState } from 'react';

interface QuestionnaireStatusFormProps {
  id: string;
  currentStatus: string;
  currentNotes: string;
}

const STATUS_OPTIONS = [
  { value: 'new', label: 'Nuevo' },
  { value: 'reviewed', label: 'Revisado' },
  { value: 'contacted', label: 'Contactado' },
];

export default function QuestionnaireStatusForm({
  id,
  currentStatus,
  currentNotes,
}: QuestionnaireStatusFormProps) {
  const [status, setStatus] = useState(currentStatus);
  const [notes, setNotes] = useState(currentNotes);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      await fetch(`/api/questionnaires/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNotes: notes }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5 mt-4">
      <h3 className="font-semibold text-card-foreground mb-4">Gestión interna</h3>

      <div className="mb-4">
        <label className="text-sm text-muted-foreground block mb-1.5">Estado</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full rounded-lg border border-border bg-background text-card-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="text-sm text-muted-foreground block mb-1.5">Notas internas</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Notas visibles solo para administradores..."
          className="w-full rounded-lg border border-border bg-background text-card-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary resize-none placeholder:text-muted-foreground"
        />
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-60 text-primary-foreground font-semibold px-5 py-2 rounded-xl transition-colors text-sm"
      >
        {saving ? 'Guardando…' : saved ? '✓ Guardado' : 'Guardar cambios'}
      </button>
    </div>
  );
}
