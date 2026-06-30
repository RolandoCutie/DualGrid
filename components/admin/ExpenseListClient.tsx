'use client';

import ConfirmModal from '@/components/ui/ConfirmModal';
import Link from 'next/link';
import { useState } from 'react';

const CATEGORY_LABELS: Record<string, string> = {
  software: 'Software / Suscripciones',
  hardware: 'Hardware / Equipos',
  hosting: 'Hosting / Dominios',
  marketing: 'Marketing / Publicidad',
  tools: 'Herramientas',
  services: 'Servicios externos',
  taxes: 'Impuestos / Tasas',
  education: 'Educación / Cursos',
  other: 'Otro',
};

const PAGE_SIZE = 20;

export interface ExpenseRow {
  _id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  notes?: string;
}

interface Props {
  expenses: ExpenseRow[];
}

export default function ExpenseListClient({ expenses }: Props) {
  const [rows, setRows] = useState<ExpenseRow[]>(expenses);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [page, setPage] = useState(1);
  const [confirm, setConfirm] = useState<{ id: string; name: string } | null>(null);

  const handleDeleteConfirm = async () => {
    if (!confirm) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/expenses/${confirm.id}`, { method: 'DELETE' });
      if (res.ok) setRows((prev) => prev.filter((e) => e._id !== confirm.id));
    } finally {
      setDeleting(false);
      setConfirm(null);
    }
  };

  const filtered = rows.filter((e) => {
    const matchSearch = !search || e.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !categoryFilter || e.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const totalFiltered = filtered.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div>
      <ConfirmModal
        open={!!confirm}
        title="Eliminar gasto"
        message={`¿Eliminar el gasto "${confirm?.name}"? Esta acción no se puede deshacer.`}
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirm(null)}
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Buscar por descripción…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="flex-1 rounded-lg border border-border bg-background text-card-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-border bg-background text-card-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Todas las categorías</option>
          {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Summary */}
      {filtered.length > 0 && (
        <div className="mb-4 rounded-xl border border-border bg-card px-4 py-3 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {filtered.length} gasto{filtered.length !== 1 ? 's' : ''} mostrado
            {filtered.length !== 1 ? 's' : ''}
          </span>
          <span className="text-sm font-semibold text-card-foreground">
            Total:{' '}
            <span className="text-red-500">
              ${totalFiltered.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </span>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-card-foreground">Fecha</th>
              <th className="text-left px-4 py-3 font-semibold text-card-foreground">
                Descripción
              </th>
              <th className="text-left px-4 py-3 font-semibold text-card-foreground">Categoría</th>
              <th className="text-left px-4 py-3 font-semibold text-card-foreground">Monto</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-8 text-muted-foreground">
                  No hay gastos que coincidan con el filtro.
                </td>
              </tr>
            )}
            {paginated.map((e) => (
              <tr key={e._id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                  {new Date(e.date).toLocaleDateString('es')}
                </td>
                <td className="px-4 py-3 font-medium text-card-foreground">
                  {e.description}
                  {e.notes && (
                    <span className="block text-xs text-muted-foreground">{e.notes}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {CATEGORY_LABELS[e.category] ?? e.category}
                </td>
                <td className="px-4 py-3 font-semibold text-red-500">
                  ${e.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-4 py-3 text-right space-x-3">
                  <Link
                    href={`/admin/dashboard/expenses/${e._id}`}
                    className="text-primary text-xs hover:underline"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => setConfirm({ id: e._id, name: e.description })}
                    className="text-red-500 text-xs hover:underline"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
          <span>{filtered.length} gastos</span>
          <div className="flex gap-2 items-center">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className="px-3 py-1 rounded-lg border border-border hover:bg-muted/50 disabled:opacity-40 transition-colors"
            >
              ← Anterior
            </button>
            <span className="px-2">
              {safePage} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
              className="px-3 py-1 rounded-lg border border-border hover:bg-muted/50 disabled:opacity-40 transition-colors"
            >
              Siguiente →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
