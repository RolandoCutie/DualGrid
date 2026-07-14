'use client';

import Badge from '@/components/ui/Badge';
import ConfirmModal from '@/components/ui/ConfirmModal';
import Link from 'next/link';
import { Fragment, useMemo, useState } from 'react';

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
const PAGE_SIZE = 25;

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

export interface ContractRow {
  _id: string;
  clientName: string;
  clientBusiness: string | null;
  planName: string;
  planCategory: string;
  totalAmount: number;
  advanceAmount: number;
  paidAmount: number;
  status: string;
  startDate: string | null;
  deliveryDate: string | null;
}

interface Props {
  contracts: ContractRow[];
}

function fmt(n: number) {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2 });
}

function fmtDate(d: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function ContractListClient({ contracts }: Props) {
  const [rows, setRows] = useState<ContractRow[]>(contracts);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [page, setPage] = useState(1);
  const [confirm, setConfirm] = useState<{ id: string; name: string } | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const availableYears = useMemo(() => {
    const years = new Set(
      rows.map((r) => (r.startDate ? new Date(r.startDate).getFullYear().toString() : null)).filter(Boolean) as string[],
    );
    return Array.from(years).sort((a, b) => Number(b) - Number(a));
  }, [rows]);

  const availableCategories = useMemo(() => {
    const cats = new Set(rows.map((r) => r.planCategory).filter(Boolean));
    return Array.from(cats).sort();
  }, [rows]);

  const filtered = useMemo(() => {
    return rows.filter((c) => {
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        c.clientName.toLowerCase().includes(q) ||
        (c.clientBusiness ?? '').toLowerCase().includes(q) ||
        c.planName.toLowerCase().includes(q);
      const matchStatus = !statusFilter || c.status === statusFilter;
      const matchCat = !categoryFilter || c.planCategory === categoryFilter;
      const startMonth = c.startDate ? String(new Date(c.startDate).getMonth() + 1) : null;
      const startYear = c.startDate ? String(new Date(c.startDate).getFullYear()) : null;
      const matchMonth = !monthFilter || startMonth === monthFilter;
      const matchYear = !yearFilter || startYear === yearFilter;
      return matchSearch && matchStatus && matchCat && matchMonth && matchYear;
    });
  }, [rows, search, statusFilter, categoryFilter, monthFilter, yearFilter]);

  const stats = useMemo(() => {
    const totalValue = filtered.reduce((s, r) => s + r.totalAmount, 0);
    const totalPaid = filtered.reduce((s, r) => s + r.paidAmount, 0);
    const totalPending = filtered.reduce((s, r) => s + Math.max(0, r.totalAmount - r.paidAmount), 0);
    const activeCount = filtered.filter((r) => r.status === 'active').length;
    return { totalValue, totalPaid, totalPending, activeCount };
  }, [filtered]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

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

  const handleDeleteConfirm = async () => {
    if (!confirm) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/contracts/${confirm.id}`, { method: 'DELETE' });
      if (res.ok) setRows((prev) => prev.filter((c) => c._id !== confirm.id));
    } finally {
      setDeleting(false);
      setConfirm(null);
    }
  };

  const resetFilters = () => {
    setSearch(''); setStatusFilter(''); setCategoryFilter(''); setMonthFilter(''); setYearFilter('');
    setPage(1);
  };

  const hasFilters = search || statusFilter || categoryFilter || monthFilter || yearFilter;

  return (
    <div className="space-y-5">
      <ConfirmModal
        open={!!confirm}
        title="Eliminar contrato"
        message={`¿Eliminar el contrato de "${confirm?.name}"? Esta acción no se puede deshacer.`}
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirm(null)}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Valor total</p>
          <p className="text-lg font-bold text-card-foreground">{fmt(stats.totalValue)}</p>
          <p className="text-xs text-muted-foreground">{filtered.length} contratos</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Cobrado</p>
          <p className="text-lg font-bold text-green-500">{fmt(stats.totalPaid)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Por cobrar</p>
          <p className="text-lg font-bold text-amber-500">{fmt(stats.totalPending)}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Activos</p>
          <p className="text-lg font-bold text-primary">{stats.activeCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Buscar por cliente o tipo de servicio…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="flex-1 rounded-lg border border-border bg-background text-card-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
          />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="rounded-lg border border-border bg-background text-card-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Todos los estados</option>
            {ALL_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </select>
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
            className="rounded-lg border border-border bg-background text-card-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Tipo de servicio</option>
            {availableCategories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <select
            value={monthFilter}
            onChange={(e) => { setMonthFilter(e.target.value); setPage(1); }}
            className="rounded-lg border border-border bg-background text-card-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Todos los meses</option>
            {MONTHS.map((m, i) => <option key={i + 1} value={String(i + 1)}>{m}</option>)}
          </select>
          <select
            value={yearFilter}
            onChange={(e) => { setYearFilter(e.target.value); setPage(1); }}
            className="rounded-lg border border-border bg-background text-card-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Todos los años</option>
            {availableYears.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          {hasFilters && (
            <button onClick={resetFilters} className="text-xs text-muted-foreground hover:text-foreground underline px-2 py-2 transition-colors">
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
              <th className="text-left px-4 py-3 font-semibold text-card-foreground">Cliente</th>
              <th className="text-left px-4 py-3 font-semibold text-card-foreground">Servicio</th>
              <th className="text-right px-4 py-3 font-semibold text-card-foreground whitespace-nowrap">Total</th>
              <th className="text-right px-4 py-3 font-semibold text-card-foreground whitespace-nowrap hidden md:table-cell">Cobrado</th>
              <th className="text-right px-4 py-3 font-semibold text-card-foreground whitespace-nowrap hidden md:table-cell">Pendiente</th>
              <th className="text-left px-4 py-3 font-semibold text-card-foreground">Estado</th>
              <th className="text-left px-4 py-3 font-semibold text-card-foreground whitespace-nowrap hidden lg:table-cell">Entrega</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-12 text-muted-foreground">
                  No hay contratos que coincidan con los filtros.
                </td>
              </tr>
            )}
            {paginated.map((c) => (
              <Fragment key={c._id}>
                <tr
                  className="hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => setExpandedId(expandedId === c._id ? null : c._id)}
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-card-foreground">{c.clientName}</p>
                    {c.clientBusiness && <p className="text-xs text-muted-foreground">{c.clientBusiness}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-card-foreground">{c.planName}</p>
                    <p className="text-xs text-muted-foreground">{c.planCategory}</p>
                  </td>
                  <td className="px-4 py-3 font-semibold text-card-foreground text-right whitespace-nowrap">
                    {fmt(c.totalAmount)}
                  </td>
                  <td className="px-4 py-3 text-green-600 font-semibold text-right whitespace-nowrap hidden md:table-cell">
                    {fmt(c.paidAmount)}
                  </td>
                  <td className="px-4 py-3 text-amber-600 font-semibold text-right whitespace-nowrap hidden md:table-cell">
                    {fmt(Math.max(0, c.totalAmount - c.paidAmount))}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={STATUS_COLORS[c.status] || 'secondary'}>
                      {STATUS_LABELS[c.status] || c.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap hidden lg:table-cell">
                    {fmtDate(c.deliveryDate)}
                  </td>
                  <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <select
                        value={c.status}
                        disabled={updating === c._id}
                        onChange={(e) => handleStatusChange(c._id, e.target.value)}
                        className="text-xs rounded-md border border-border bg-background text-muted-foreground px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                      >
                        {ALL_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                      </select>
                      <Link href={`/admin/dashboard/contracts/${c._id}`} className="text-primary text-xs hover:underline whitespace-nowrap">Editar</Link>
                      <Link href={`/api/contracts/${c._id}/pdf`} className="text-muted-foreground text-xs hover:underline" target="_blank">PDF</Link>
                      <button onClick={() => setConfirm({ id: c._id, name: c.clientName })} className="text-red-500 text-xs hover:underline">Eliminar</button>
                    </div>
                  </td>
                </tr>
                {expandedId === c._id && (
                  <tr key={`${c._id}-exp`} className="bg-muted/20">
                    <td colSpan={8} className="px-6 py-4">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground mb-0.5">Tipo de servicio</p>
                          <p className="text-card-foreground">{c.planCategory}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-0.5">Inicio</p>
                          <p className="text-card-foreground">{fmtDate(c.startDate)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-0.5">Anticipo</p>
                          <p className="text-card-foreground">{fmt(c.advanceAmount)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-0.5">Cobrado / Total</p>
                          <p className="text-card-foreground font-semibold">{fmt(c.paidAmount)} / {fmt(c.totalAmount)}</p>
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
        <span>{filtered.length} contrato{filtered.length !== 1 ? 's' : ''}{hasFilters ? ' (filtrados)' : ''}</span>
        {totalPages > 1 && (
          <div className="flex gap-2 items-center">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage <= 1} className="px-3 py-1 rounded-lg border border-border hover:bg-muted/50 disabled:opacity-40 transition-colors">← Anterior</button>
            <span className="px-2">{safePage} / {totalPages}</span>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages} className="px-3 py-1 rounded-lg border border-border hover:bg-muted/50 disabled:opacity-40 transition-colors">Siguiente →</button>
          </div>
        )}
      </div>
    </div>
  );
}
