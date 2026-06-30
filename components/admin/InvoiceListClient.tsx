'use client';

import Badge from '@/components/ui/Badge';
import ConfirmModal from '@/components/ui/ConfirmModal';
import Link from 'next/link';
import { useState } from 'react';

type BadgeVariant = 'secondary' | 'warning' | 'success' | 'primary' | 'error';

const STATUS_COLORS: Record<string, BadgeVariant> = {
  draft: 'secondary',
  sent: 'primary',
  paid: 'success',
  overdue: 'error',
  cancelled: 'secondary',
};

const STATUS_LABELS: Record<string, string> = {
  draft: 'Borrador',
  sent: 'Enviada',
  paid: 'Pagada',
  overdue: 'Vencida',
  cancelled: 'Cancelada',
};

const ALL_STATUSES = Object.keys(STATUS_LABELS);
const PAGE_SIZE = 20;

export interface InvoiceRow {
  _id: string;
  invoiceNumber: string;
  clientName: string;
  totalAmount: number;
  status: string;
  dueDate: string | null;
}

interface Props {
  invoices: InvoiceRow[];
}

export default function InvoiceListClient({ invoices }: Props) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [rows, setRows] = useState<InvoiceRow[]>(invoices);
  const [updating, setUpdating] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [page, setPage] = useState(1);
  const [confirm, setConfirm] = useState<{ id: string; name: string } | null>(null);

  const handleDeleteConfirm = async () => {
    if (!confirm) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/invoices/${confirm.id}`, { method: 'DELETE' });
      if (res.ok) setRows((prev) => prev.filter((inv) => inv._id !== confirm.id));
    } finally {
      setDeleting(false);
      setConfirm(null);
    }
  };

  const filtered = rows.filter((inv) => {
    const matchSearch =
      !search ||
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.clientName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || inv.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/invoices/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setRows((prev) =>
          prev.map((inv) => (inv._id === id ? { ...inv, status: newStatus } : inv)),
        );
      }
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div>
      <ConfirmModal
        open={!!confirm}
        title="Eliminar factura"
        message={`¿Eliminar la factura "${confirm?.name}"? Esta acción no se puede deshacer.`}
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirm(null)}
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Buscar por N° o cliente…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
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
              <th className="text-left px-4 py-3 font-semibold text-card-foreground">N°</th>
              <th className="text-left px-4 py-3 font-semibold text-card-foreground">Cliente</th>
              <th className="text-left px-4 py-3 font-semibold text-card-foreground">Total</th>
              <th className="text-left px-4 py-3 font-semibold text-card-foreground">Estado</th>
              <th className="text-left px-4 py-3 font-semibold text-card-foreground">
                Vencimiento
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-muted-foreground">
                  No hay facturas que coincidan con el filtro.
                </td>
              </tr>
            )}
            {paginated.map((inv) => (
              <tr
                key={inv._id}
                className={`hover:bg-muted/30 transition-colors ${
                  inv.status === 'overdue' ? 'bg-red-500/5' : ''
                }`}
              >
                <td className="px-4 py-3 font-mono text-xs text-primary font-semibold">
                  {inv.invoiceNumber}
                </td>
                <td className="px-4 py-3 font-medium text-card-foreground">{inv.clientName}</td>
                <td className="px-4 py-3 font-semibold text-card-foreground">
                  ${inv.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Badge variant={STATUS_COLORS[inv.status] || 'secondary'}>
                      {STATUS_LABELS[inv.status] || inv.status}
                    </Badge>
                    <select
                      value={inv.status}
                      disabled={updating === inv._id}
                      onChange={(e) => handleStatusChange(inv._id, e.target.value)}
                      className="text-xs rounded-md border border-border bg-background text-muted-foreground px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                      title="Cambiar estado"
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
                  {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString('es') : '—'}
                </td>
                <td className="px-4 py-3 text-right space-x-3">
                  <Link
                    href={`/admin/dashboard/invoices/${inv._id}`}
                    className="text-primary text-xs hover:underline"
                  >
                    Editar
                  </Link>
                  <Link
                    href={`/api/invoices/${inv._id}/pdf`}
                    className="text-muted-foreground text-xs hover:underline"
                    target="_blank"
                  >
                    PDF
                  </Link>
                  <button
                    onClick={() => setConfirm({ id: inv._id, name: inv.invoiceNumber })}
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
          <span>{filtered.length} facturas</span>
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
