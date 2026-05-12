'use client';

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
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string, description: string) => {
    if (!confirm(`¿Eliminar el gasto "${description}"? Esta acción no se puede deshacer.`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
      if (res.ok) setRows((prev) => prev.filter((e) => e._id !== id));
    } finally {
      setDeleting(null);
    }
  };

  const filtered = rows.filter((e) => {
    const matchSearch = !search || e.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !categoryFilter || e.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const totalFiltered = filtered.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Buscar por descripción…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
            {filtered.map((e) => (
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
                    onClick={() => handleDelete(e._id, e.description)}
                    disabled={deleting === e._id}
                    className="text-red-500 text-xs hover:underline disabled:opacity-40"
                  >
                    {deleting === e._id ? '…' : 'Eliminar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
