'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ExpenseFormData {
  description: string;
  amount: string;
  category: string;
  date: string;
  notes: string;
}

interface ExpenseFormProps {
  defaultValues?: Partial<ExpenseFormData>;
  expenseId?: string;
}

const CATEGORY_OPTIONS = [
  { value: 'software', label: 'Software / Suscripciones' },
  { value: 'hardware', label: 'Hardware / Equipos' },
  { value: 'hosting', label: 'Hosting / Dominios' },
  { value: 'marketing', label: 'Marketing / Publicidad' },
  { value: 'tools', label: 'Herramientas' },
  { value: 'services', label: 'Servicios externos' },
  { value: 'taxes', label: 'Impuestos / Tasas' },
  { value: 'education', label: 'Educación / Cursos' },
  { value: 'other', label: 'Otro' },
];

export default function ExpenseForm({ defaultValues, expenseId }: ExpenseFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState<ExpenseFormData>({
    description: defaultValues?.description ?? '',
    amount: defaultValues?.amount ?? '',
    category: defaultValues?.category ?? 'other',
    date: defaultValues?.date ?? today,
    notes: defaultValues?.notes ?? '',
  });

  const set =
    (key: keyof ExpenseFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const url = expenseId ? `/api/expenses/${expenseId}` : '/api/expenses';
      const method = expenseId ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: form.description,
          amount: parseFloat(form.amount),
          category: form.category,
          date: form.date,
          notes: form.notes || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Error al guardar');
      }
      router.push('/admin/dashboard/expenses');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
      <div>
        <label className="block text-sm font-medium text-card-foreground mb-1">Descripción *</label>
        <Input
          value={form.description}
          onChange={set('description')}
          placeholder="Ej: Dominio dualgrid.com, Figma Pro, etc."
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-card-foreground mb-1">
            Monto (USD) *
          </label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={form.amount}
            onChange={set('amount')}
            placeholder="0.00"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-card-foreground mb-1">Fecha *</label>
          <Input type="date" value={form.date} onChange={set('date')} required />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-card-foreground mb-1">Categoría *</label>
        <Select
          value={form.category}
          onChange={set('category')}
          options={CATEGORY_OPTIONS}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-card-foreground mb-1">
          Notas <span className="text-muted-foreground">(opcional)</span>
        </label>
        <Textarea
          value={form.notes}
          onChange={set('notes')}
          rows={3}
          placeholder="Detalles adicionales…"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? 'Guardando…' : expenseId ? 'Actualizar gasto' : 'Registrar gasto'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push('/admin/dashboard/expenses')}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
