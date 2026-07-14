'use client';

import Badge from '@/components/ui/Badge';
import ConfirmModal from '@/components/ui/ConfirmModal';
import Link from 'next/link';
import { Fragment, useMemo, useState } from 'react';

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

const METHOD_LABELS: Record<string, string> = {
  cash: 'Efectivo',
  bank_transfer: 'Transferencia',
  paypal: 'PayPal',
  card: 'Tarjeta',
  crypto: 'Cripto',
  other: 'Otro',
};

const ALL_STATUSES = Object.keys(STATUS_LABELS);
const PAGE_SIZE = 25;

const MONTHS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

export interface InvoiceRow {
  _id: string;
  invoiceNumber: string;
  clientName: string;
  contractName: string | null;
  description: string;
  totalAmount: number;
  status: string;
  issueDate: string | null;
  dueDate: string | null;
  paymentMethod: string | null;
}

interface Props {
  invoices: InvoiceRow[];
}

function fmt(amount: number) {
  return (
    '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  );
}

function fmtDate(d: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function InvoiceListClient({ invoices }: Props) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [rows, setRows] = useState<InvoiceRow[]>(invoices);
  const [updating, setUpdating] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [page, setPage] = useState(1);
  const [confirm, setConfirm] = useState<{ id: string; name: string } | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const availableYears = useMemo(() => {
    const years = new Set(
      rows
        .map((r) => (r.issueDate ? new Date(r.issueDate).getFullYear().toString() : null))
        .filter(Boolean) as string[],
    );
    return Array.from(years).sort((a, b) => Number(b) - Number(a));
  }, [rows]);

  const filtered = useMemo(() => {
    return rows.filter((inv) => {
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        inv.invoiceNumber.toLowerCase().includes(q) ||
        inv.clientName.toLowerCase().includes(q) ||
        inv.description.toLowerCase().includes(q) ||
        (inv.contractName ?? '').toLowerCase().includes(q);
      const matchStatus = !statusFilter || inv.status === statusFilter;
      const matchMethod = !methodFilter || inv.paymentMethod === methodFilter;
      const issueMonth = inv.issueDate ? String(new Date(inv.issueDate).getMonth() + 1) : null;
      const issueYear = inv.issueDate ? String(new Date(inv.issueDate).getFullYear()) : null;
      const matchMonth = !monthFilter || issueMonth === monthFilter;
      const matchYear = !yearFilter || issueYear === yearFilter;
      return matchSearch && matchStatus && matchMethod && matchMonth && matchYear;
    });
  }, [rows, search, statusFilter, methodFilter, monthFilter, yearFilter]);

  const stats = useMemo(() => {
    const totalBilled = filtered.reduce((s, r) => s + r.totalAmount, 0);
    const totalPaid = filtered
      .filter((r) => r.status === 'paid')
      .reduce((s, r) => s + r.totalAmount, 0);
    const totalPending = filtered
      .filter((r) => r.status === 'sent')
      .reduce((s, r) => s + r.totalAmount, 0);
    const totalOverdue = filtered
      .filter((r) => r.status === 'overdue')
      .reduce((s, r) => s + r.totalAmount, 0);
    const overdueCount = filtered.filter((r) => r.status === 'overdue').length;
    return { totalBilled, totalPaid, totalPending, totalOverdue, overdueCount };
  }, [filtered]);

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

  const resetFilters = () => {
    setSearch('');
    setStatusFilter('');
    setMethodFilter('');
    setMonthFilter('');
    setYearFilter('');
    setPage(1);
  };

  const hasFilters = search || statusFilter || methodFilter || monthFilter || yearFilter;

  return (
    <div className="space-y-5">
      <ConfirmModal
        open={!!confirm}
        title="Eliminar factura"
        message={`¿Eliminar la factura "${confirm?.name}"? Esta acción no se puede deshacer.`}
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirm(null)}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Total facturado</p>
          <p className="text-lg font-bold text-card-foreground">{fmt(stats.totalBilled)}</p>
          <p className="text-xs text-muted-foreground">{filtered.length} facturas</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Total cobrado</p>
          <p className="text-lg font-bold text-green-500">{fmt(stats.totalPaid)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Por cobrar</p>
          <p className="text-lg font-bold text-amber-500">{fmt(stats.totalPending)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Vencidas</p>
          <p className="text-lg font-bold text-red-500">{fmt(stats.totalOverdue)}</p>
          {stats.overdueCount > 0 && (
            <p className="text-xs text-red-400">
              {stats.overdueCount} factura{stats.overdueCount > 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Buscar por N°, cliente, descripción o contrato…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="flex-1 rounded-lg border border-border bg-background text-card-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
          />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
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
        <div className="flex flex-wrap gap-3">
          <select
            value={methodFilter}
            onChange={(e) => {
              setMethodFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-border bg-background text-card-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Método de pago</option>
            {Object.entries(METHOD_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
          <select
            value={monthFilter}
            onChange={(e) => {
              setMonthFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-border bg-background text-card-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Todos los meses</option>
            {MONTHS.map((m, i) => (
              <option key={i + 1} value={String(i + 1)}>
                {m}
              </option>
            ))}
          </select>
          <select
            value={yearFilter}
            onChange={(e) => {
              setYearFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-border bg-background text-card-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Todos los años</option>
            {availableYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          {hasFilters && (
            <button
              onClick={resetFilters}
              className="text-xs text-muted-foreground hover:text-foreground underline px-2 py-2 transition-colors"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-card-foreground whitespace-nowrap">
                N°
              </th>
              <th className="text-left px-4 py-3 font-semibold text-card-foreground">
                Descripción
              </th>
              <th className="text-left px-4 py-3 font-semibold text-card-foreground whitespace-nowrap">
                Cliente
              </th>
              <th className="text-left px-4 py-3 font-semibold text-card-foreground whitespace-nowrap hidden md:table-cell">
                Contrato
              </th>
              <th className="text-left px-4 py-3 font-semibold text-card-foreground whitespace-nowrap hidden lg:table-cell">
                Emisión
              </th>
              <th className="text-left px-4 py-3 font-semibold text-card-foreground whitespace-nowrap">
                Vencimiento
              </th>
              <th className="text-right px-4 py-3 font-semibold text-card-foreground whitespace-nowrap">
                Monto
              </th>
              <th className="text-left px-4 py-3 font-semibold text-card-foreground whitespace-nowrap">
                Estado
              </th>
              <th className="text-left px-4 py-3 font-semibold text-card-foreground whitespace-nowrap hidden lg:table-cell">
                Método
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={10} className="text-center py-12 text-muted-foreground">
                  No hay facturas que coincidan con los filtros.
                </td>
              </tr>
            )}
            {paginated.map((inv) => (
              <Fragment key={inv._id}>
                <tr
                  className={`hover:bg-muted/30 transition-colors cursor-pointer ${inv.status === 'overdue' ? 'bg-red-500/5' : ''}`}
                  onClick={() => setExpandedId(expandedId === inv._id ? null : inv._id)}
                >
                  <td className="px-4 py-3 font-mono text-xs text-primary font-semibold whitespace-nowrap">
                    {inv.invoiceNumber}
                  </td>
                  <td className="px-4 py-3 text-card-foreground max-w-[200px]">
                    <span className="line-clamp-2 leading-snug text-xs">
                      {inv.description || '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-card-foreground whitespace-nowrap">
                    {inv.clientName}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs hidden md:table-cell max-w-[160px]">
                    <span className="line-clamp-1">{inv.contractName ?? '—'}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap text-xs hidden lg:table-cell">
                    {fmtDate(inv.issueDate)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap text-xs">
                    {fmtDate(inv.dueDate)}
                  </td>
                  <td className="px-4 py-3 font-semibold text-card-foreground text-right whitespace-nowrap">
                    {fmt(inv.totalAmount)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={STATUS_COLORS[inv.status] || 'secondary'}>
                      {STATUS_LABELS[inv.status] || inv.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs hidden lg:table-cell whitespace-nowrap">
                    {inv.paymentMethod
                      ? (METHOD_LABELS[inv.paymentMethod] ?? inv.paymentMethod)
                      : '—'}
                  </td>
                  <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
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
                      <Link
                        href={`/admin/dashboard/invoices/${inv._id}`}
                        className="text-primary text-xs hover:underline whitespace-nowrap"
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
                    </div>
                  </td>
                </tr>
                {expandedId === inv._id && (
                  <tr key={`${inv._id}-exp`} className="bg-muted/20">
                    <td colSpan={10} className="px-6 py-4">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground mb-0.5">
                            Descripción completa
                          </p>
                          <p className="text-card-foreground">{inv.description || '—'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-0.5">Contrato asociado</p>
                          <p className="text-card-foreground">{inv.contractName ?? '—'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-0.5">Método de pago</p>
                          <p className="text-card-foreground">
                            {inv.paymentMethod
                              ? (METHOD_LABELS[inv.paymentMethod] ?? inv.paymentMethod)
                              : '—'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-0.5">Monto total</p>
                          <p className="text-lg font-bold text-card-foreground">
                            {fmt(inv.totalAmount)}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {filtered.length} factura{filtered.length !== 1 ? 's' : ''}
          {hasFilters ? ' (filtradas)' : ''}
        </span>
        {totalPages > 1 && (
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
        )}
      </div>
    </div>
  );
}
