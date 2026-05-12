'use client';

import Badge from '@/components/ui/Badge';
import Link from 'next/link';
import { useState } from 'react';

type BadgeVariant = 'secondary' | 'warning' | 'success' | 'primary' | 'error';

const STATUS_COLORS: Record<string, BadgeVariant> = {
  draft: 'secondary',
  pending: 'warning',
  active: 'primary',
  completed: 'success',
  cancelled: 'error',
};

const STATUS_LABELS: Record<string, string> = {
  draft: 'Borrador',
  pending: 'Pendiente',
  active: 'Activo',
  completed: 'Completado',
  cancelled: 'Cancelado',
};

const ALL_STATUSES = Object.keys(STATUS_LABELS);

export interface ContractRow {
  _id: string;
  clientName: string;
  clientBusiness: string | null;
  planName: string;
  totalAmount: number;
  advanceAmount: number;
  status: string;
  deliveryDate: string | null;
}

interface Props {
  contracts: ContractRow[];
}

export default function ContractListClient({ contracts }: Props) {
  const [rows, setRows] = useState<ContractRow[]>(contracts);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string, clientName: string) => {
    if (!confirm(`¿Eliminar el contrato de ${clientName}? Esta acción no se puede deshacer.`))
      return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/contracts/${id}`, { method: 'DELETE' });
      if (res.ok) setRows((prev) => prev.filter((c) => c._id !== id));
    } finally {
      setDeleting(null);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/contracts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setRows((prev) => prev.map((c) => (c._id === id ? { ...c, status: newStatus } : c)));
      }
    } finally {
      setUpdating(null);
    }
  };

  const filtered = rows.filter((c) => {
    const matchSearch =
      !search ||
      c.clientName.toLowerCase().includes(search.toLowerCase()) ||
      (c.clientBusiness && c.clientBusiness.toLowerCase().includes(search.toLowerCase())) ||
      c.planName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Buscar por cliente o plan…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-lg border border-border bg-background text-card-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-border bg-background text-card-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Todos los estados</option>
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-card-foreground">Cliente</th>
              <th className="text-left px-4 py-3 font-semibold text-card-foreground">Plan</th>
              <th className="text-left px-4 py-3 font-semibold text-card-foreground">Total</th>
              <th className="text-left px-4 py-3 font-semibold text-card-foreground">Saldo</th>
              <th className="text-left px-4 py-3 font-semibold text-card-foreground">Estado</th>
              <th className="text-left px-4 py-3 font-semibold text-card-foreground">Entrega</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-8 text-muted-foreground">
                  No hay contratos que coincidan con el filtro.
                </td>
              </tr>
            )}
            {filtered.map((c) => (
              <tr key={c._id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-medium text-card-foreground">
                  {c.clientName}
                  {c.clientBusiness && (
                    <span className="block text-xs text-muted-foreground">{c.clientBusiness}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{c.planName}</td>
                <td className="px-4 py-3 font-semibold text-card-foreground">
                  ${c.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-sm font-semibold ${
                      c.totalAmount - c.advanceAmount > 0 ? 'text-amber-600' : 'text-green-600'
                    }`}
                  >
                    $
                    {(c.totalAmount - c.advanceAmount).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1.5">
                    <Badge variant={STATUS_COLORS[c.status] || 'secondary'}>
                      {STATUS_LABELS[c.status] || c.status}
                    </Badge>
                    <select
                      value={c.status}
                      disabled={updating === c._id}
                      onChange={(e) => handleStatusChange(c._id, e.target.value)}
                      className="text-xs rounded-md border border-border bg-background text-muted-foreground px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                    >
                      {ALL_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {STATUS_LABELS[s]}
                        </option>
                      ))}
                    </select>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {c.deliveryDate ? new Date(c.deliveryDate).toLocaleDateString('es') : '—'}
                </td>
                <td className="px-4 py-3 text-right space-x-3">
                  <Link
                    href={`/admin/dashboard/contracts/${c._id}`}
                    className="text-primary text-xs hover:underline"
                  >
                    Editar
                  </Link>
                  <Link
                    href={`/api/contracts/${c._id}/pdf`}
                    className="text-muted-foreground text-xs hover:underline"
                    target="_blank"
                  >
                    PDF
                  </Link>
                  <button
                    onClick={() => handleDelete(c._id, c.clientName)}
                    disabled={deleting === c._id}
                    className="text-red-500 text-xs hover:underline disabled:opacity-40"
                  >
                    {deleting === c._id ? '…' : 'Eliminar'}
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
