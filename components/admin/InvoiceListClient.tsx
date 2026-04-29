'use client';

import Badge from '@/components/ui/Badge';
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

  const filtered = rows.filter((inv) => {
    const matchSearch =
      !search ||
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.clientName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || inv.status === statusFilter;
    return matchSearch && matchStatus;
  });

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
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Buscar por N° o cliente…"
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
            {filtered.map((inv) => (
              <tr key={inv._id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-primary font-semibold">
                  {inv.invoiceNumber}
                </td>
                <td className="px-4 py-3 font-medium text-card-foreground">{inv.clientName}</td>
                <td className="px-4 py-3 font-semibold text-card-foreground">
                  ${inv.totalAmount} USD
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
