'use client';

import Badge from '@/components/ui/Badge';
import Link from 'next/link';
import { useMemo, useState } from 'react';

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline';
type RenewalFilter = 'all' | 'expired' | 'soon' | 'healthy' | 'missing';

const PAGE_SIZE = 20;
const DAY_IN_MS = 1000 * 60 * 60 * 24;

const STATUS_META: Record<string, { label: string; variant: BadgeVariant }> = {
  draft: { label: 'Borrador', variant: 'secondary' },
  pending: { label: 'Pendiente', variant: 'warning' },
  active: { label: 'Activo', variant: 'primary' },
  completed: { label: 'Completado', variant: 'success' },
  cancelled: { label: 'Cancelado', variant: 'error' },
};

const RENEWAL_FILTER_OPTIONS: Array<{ value: RenewalFilter; label: string }> = [
  { value: 'all', label: 'Todas las renovaciones' },
  { value: 'expired', label: 'Vencidos' },
  { value: 'soon', label: 'Vencen en 30 días' },
  { value: 'healthy', label: 'Con margen (>30 días)' },
  { value: 'missing', label: 'Sin fecha' },
];

export interface HostingServiceRow {
  _id: string;
  clientName: string;
  clientBusiness: string | null;
  planId: string;
  planName: string;
  totalAmount: number;
  paidAmount: number;
  status: string;
  startDate: string | null;
  isRecurring: boolean;
  renewalDate: string | null;
  renewalPeriodMonths: number | null;
  renewalNotificationDays: number;
}

interface RenewalMeta {
  key: Exclude<RenewalFilter, 'all'>;
  label: string;
  variant: BadgeVariant;
  daysLeft: number | null;
}

function fmtCurrency(amount: number): string {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
}

function formatDateInput(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate(),
  ).padStart(2, '0')}`;
}

function parseCalendarDate(dateLike: string | null): Date | null {
  if (!dateLike) return null;

  const dateOnlyMatch = dateLike.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (dateOnlyMatch) {
    const year = Number(dateOnlyMatch[1]);
    const month = Number(dateOnlyMatch[2]);
    const day = Number(dateOnlyMatch[3]);
    const parsed = new Date(year, month - 1, day);
    parsed.setHours(0, 0, 0, 0);
    return parsed;
  }

  const parsed = new Date(dateLike);
  if (Number.isNaN(parsed.getTime())) return null;

  const normalized = new Date(parsed.getUTCFullYear(), parsed.getUTCMonth(), parsed.getUTCDate());
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

function fmtDate(dateLike: string | null): string {
  const date = parseCalendarDate(dateLike);
  if (!date) return '—';
  return date.toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric' });
}

function toDateInput(dateLike: string | null): string {
  const date = parseCalendarDate(dateLike);
  if (!date) return '';
  return formatDateInput(date);
}

function getRenewalMeta(renewalDate: string | null): RenewalMeta {
  if (!renewalDate) {
    return { key: 'missing', label: 'Sin fecha de renovación', variant: 'secondary', daysLeft: null };
  }

  const renewal = parseCalendarDate(renewalDate);
  if (!renewal) {
    return { key: 'missing', label: 'Fecha inválida', variant: 'secondary', daysLeft: null };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  renewal.setHours(0, 0, 0, 0);

  const daysLeft = Math.ceil((renewal.getTime() - today.getTime()) / DAY_IN_MS);

  if (daysLeft < 0) {
    const daysOverdue = Math.abs(daysLeft);
    return {
      key: 'expired',
      label: `Vencido hace ${daysOverdue} día${daysOverdue === 1 ? '' : 's'}`,
      variant: 'error',
      daysLeft,
    };
  }

  if (daysLeft <= 30) {
    if (daysLeft === 0) {
      return { key: 'soon', label: 'Vence hoy', variant: 'warning', daysLeft };
    }
    return {
      key: 'soon',
      label: `Vence en ${daysLeft} día${daysLeft === 1 ? '' : 's'}`,
      variant: 'warning',
      daysLeft,
    };
  }

  return {
    key: 'healthy',
    label: `${daysLeft} días restantes`,
    variant: 'success',
    daysLeft,
  };
}

function getPeriodLabel(months: number | null): string {
  if (!months) return 'Sin período definido';
  if (months === 1) return 'Mensual';
  if (months === 3) return 'Trimestral';
  if (months === 6) return 'Semestral';
  if (months === 12) return 'Anual';
  if (months === 24) return 'Bienal';
  if (months === 36) return 'Trienal';
  return `${months} meses`;
}

function getPeriodShortLabel(months: number | null): string {
  if (!months) return '12m';
  if (months >= 12 && months % 12 === 0) return `${months / 12}a`;
  return `${months}m`;
}

function parseResponseBody(rawBody: string): unknown {
  if (!rawBody) return null;
  try {
    return JSON.parse(rawBody) as unknown;
  } catch {
    throw new Error('El servidor respondió en un formato inválido.');
  }
}

function parseApiError(payload: unknown): string {
  if (!payload || typeof payload !== 'object') {
    return 'No se pudo actualizar el hosting.';
  }

  const maybeError = (payload as { error?: unknown }).error;
  if (typeof maybeError === 'string') return maybeError;

  if (Array.isArray(maybeError)) {
    const firstIssue = maybeError.find(
      (issue): issue is { message: string } =>
        typeof issue === 'object' &&
        issue !== null &&
        'message' in issue &&
        typeof (issue as { message?: unknown }).message === 'string',
    );
    if (firstIssue) return firstIssue.message;
  }

  return 'No se pudo actualizar el hosting.';
}

export default function HostingServiceListClient({ services }: { services: HostingServiceRow[] }) {
  const [rows, setRows] = useState<HostingServiceRow[]>(services);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [renewalFilter, setRenewalFilter] = useState<RenewalFilter>('all');
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const [busyById, setBusyById] = useState<Record<string, boolean>>({});
  const [renewalDraftById, setRenewalDraftById] = useState<Record<string, string>>(() =>
    Object.fromEntries(services.map((service) => [service._id, toDateInput(service.renewalDate)])),
  );

  const filtered = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return rows.filter((row) => {
      const renewalMeta = getRenewalMeta(row.renewalDate);

      const matchesSearch =
        !normalizedSearch ||
        row.clientName.toLowerCase().includes(normalizedSearch) ||
        (row.clientBusiness ?? '').toLowerCase().includes(normalizedSearch) ||
        row.planName.toLowerCase().includes(normalizedSearch);

      const matchesStatus = !statusFilter || row.status === statusFilter;
      const matchesRenewal = renewalFilter === 'all' || renewalMeta.key === renewalFilter;

      return matchesSearch && matchesStatus && matchesRenewal;
    });
  }, [rows, search, statusFilter, renewalFilter]);

  const summary = useMemo(() => {
    return filtered.reduce(
      (acc, row) => {
        const meta = getRenewalMeta(row.renewalDate);
        acc.total += 1;
        if (meta.key === 'expired') acc.expired += 1;
        if (meta.key === 'soon') acc.soon += 1;
        if (meta.key === 'missing') acc.missing += 1;
        if (row.status === 'active') acc.active += 1;
        return acc;
      },
      { total: 0, expired: 0, soon: 0, missing: 0, active: 0 },
    );
  }, [filtered]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const hasFilters = search || statusFilter || renewalFilter !== 'all';

  const setBusy = (id: string, isBusy: boolean) => {
    setBusyById((prev) => ({ ...prev, [id]: isBusy }));
  };

  const patchContract = async (id: string, payload: Record<string, unknown>) => {
    const res = await fetch(`/api/contracts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const rawBody = await res.text();
    const responseBody = parseResponseBody(rawBody);

    if (!res.ok) {
      throw new Error(parseApiError(responseBody));
    }

    return responseBody;
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    setError('');
    setBusy(id, true);
    try {
      await patchContract(id, { status: newStatus });
      setRows((prev) => prev.map((row) => (row._id === id ? { ...row, status: newStatus } : row)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo actualizar el estado.');
    } finally {
      setBusy(id, false);
    }
  };

  const handleSaveRenewalDate = async (id: string) => {
    setError('');
    const renewalDate = renewalDraftById[id];

    if (!renewalDate) {
      setError('Selecciona una fecha de renovación antes de guardar.');
      return;
    }

    setBusy(id, true);
    try {
      await patchContract(id, { isRecurring: true, renewalDate });
      setRows((prev) =>
        prev.map((row) =>
          row._id === id ? { ...row, isRecurring: true, renewalDate } : row,
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar la fecha de renovación.');
    } finally {
      setBusy(id, false);
    }
  };

  const handleRenewOnePeriod = async (id: string) => {
    setError('');
    const row = rows.find((service) => service._id === id);
    if (!row) return;

    const periodMonths = row.renewalPeriodMonths ?? 12;
    const now = new Date();
    const baseDate = row.renewalDate ? new Date(row.renewalDate) : now;
    const validBaseDate = Number.isNaN(baseDate.getTime()) ? now : baseDate;
    const anchorDate = validBaseDate.getTime() < now.getTime() ? now : validBaseDate;
    const nextRenewalDate = new Date(anchorDate);
    nextRenewalDate.setMonth(nextRenewalDate.getMonth() + periodMonths);
    const nextRenewalDateInput = formatDateInput(nextRenewalDate);

    setBusy(id, true);
    try {
      await patchContract(id, {
        isRecurring: true,
        status: 'active',
        renewalPeriodMonths: periodMonths,
        renewalDate: nextRenewalDateInput,
      });

      setRows((prev) =>
        prev.map((service) =>
          service._id === id
            ? {
                ...service,
                isRecurring: true,
                status: 'active',
                renewalPeriodMonths: periodMonths,
                renewalDate: nextRenewalDateInput,
              }
            : service,
        ),
      );

      setRenewalDraftById((prev) => ({ ...prev, [id]: nextRenewalDateInput }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo registrar la renovación.');
    } finally {
      setBusy(id, false);
    }
  };

  const resetFilters = () => {
    setSearch('');
    setStatusFilter('');
    setRenewalFilter('all');
    setPage(1);
  };

  return (
    <div className="space-y-4">
      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-4 py-2">{error}</p>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="rounded-xl border border-border bg-card p-3">
          <p className="text-xs text-muted-foreground">Servicios visibles</p>
          <p className="text-xl font-semibold text-card-foreground">{summary.total}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3">
          <p className="text-xs text-muted-foreground">Activos</p>
          <p className="text-xl font-semibold text-primary">{summary.active}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3">
          <p className="text-xs text-muted-foreground">Vencen ≤ 30 días</p>
          <p className="text-xl font-semibold text-amber-600">{summary.soon}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3">
          <p className="text-xs text-muted-foreground">Vencidos</p>
          <p className="text-xl font-semibold text-red-600">{summary.expired}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3">
          <p className="text-xs text-muted-foreground">Sin fecha</p>
          <p className="text-xl font-semibold text-muted-foreground">{summary.missing}</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-3">
        <input
          type="text"
          placeholder="Buscar cliente o plan..."
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
          {Object.entries(STATUS_META).map(([value, meta]) => (
            <option key={value} value={value}>
              {meta.label}
            </option>
          ))}
        </select>
        <select
          value={renewalFilter}
          onChange={(e) => {
            setRenewalFilter(e.target.value as RenewalFilter);
            setPage(1);
          }}
          className="rounded-lg border border-border bg-background text-card-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {RENEWAL_FILTER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
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

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm min-w-[1100px]">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-card-foreground">Cliente</th>
              <th className="text-left px-4 py-3 font-semibold text-card-foreground">Plan</th>
              <th className="text-left px-4 py-3 font-semibold text-card-foreground">Renovación</th>
              <th className="text-left px-4 py-3 font-semibold text-card-foreground">Estado</th>
              <th className="text-right px-4 py-3 font-semibold text-card-foreground">Cobro</th>
              <th className="text-right px-4 py-3 font-semibold text-card-foreground">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginated.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-10 text-muted-foreground">
                  No hay hostings que coincidan con los filtros.
                </td>
              </tr>
            )}
            {paginated.map((service) => {
              const renewalMeta = getRenewalMeta(service.renewalDate);
              const isBusy = Boolean(busyById[service._id]);
              const statusMeta = STATUS_META[service.status] ?? {
                label: service.status,
                variant: 'secondary' as const,
              };
              const pendingAmount = Math.max(0, service.totalAmount - service.paidAmount);

              return (
                <tr key={service._id} className="hover:bg-muted/20 transition-colors align-top">
                  <td className="px-4 py-3">
                    <p className="font-medium text-card-foreground">{service.clientName}</p>
                    {service.clientBusiness && (
                      <p className="text-xs text-muted-foreground">{service.clientBusiness}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Inicio: {fmtDate(service.startDate)}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-card-foreground">{service.planName}</p>
                    <p className="text-xs text-muted-foreground">
                      Período: {getPeriodLabel(service.renewalPeriodMonths)}
                    </p>
                    {!service.isRecurring && (
                      <p className="text-xs text-amber-600 mt-1">Sin marcar como recurrente</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={renewalMeta.variant}>{renewalMeta.label}</Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      Fecha: {fmtDate(service.renewalDate)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Aviso: {service.renewalNotificationDays} días antes
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-2">
                      <Badge variant={statusMeta.variant}>{statusMeta.label}</Badge>
                      <select
                        value={service.status}
                        disabled={isBusy}
                        onChange={(e) => handleStatusChange(service._id, e.target.value)}
                        className="text-xs rounded-md border border-border bg-background text-muted-foreground px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                      >
                        {Object.entries(STATUS_META).map(([value, meta]) => (
                          <option key={value} value={value}>
                            {meta.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <p className="text-green-600 font-semibold">{fmtCurrency(service.paidAmount)}</p>
                    <p className="text-xs text-muted-foreground">de {fmtCurrency(service.totalAmount)}</p>
                    <p className="text-xs text-amber-600">Pendiente: {fmtCurrency(pendingAmount)}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col items-end gap-2 min-w-[300px]">
                      <div className="flex items-center gap-2 w-full justify-end">
                        <input
                          type="date"
                          value={renewalDraftById[service._id] ?? ''}
                          onChange={(e) =>
                            setRenewalDraftById((prev) => ({
                              ...prev,
                              [service._id]: e.target.value,
                            }))
                          }
                          disabled={isBusy}
                          className="rounded-md border border-border bg-background text-card-foreground text-xs px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                        />
                        <button
                          onClick={() => handleSaveRenewalDate(service._id)}
                          disabled={isBusy}
                          className="rounded-md border border-border px-2.5 py-1.5 text-xs text-card-foreground hover:bg-muted/50 disabled:opacity-50 transition-colors"
                        >
                          Guardar fecha
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRenewOnePeriod(service._id)}
                          disabled={isBusy}
                          className="rounded-md bg-primary text-primary-foreground px-2.5 py-1.5 text-xs font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
                        >
                          Renovar +{getPeriodShortLabel(service.renewalPeriodMonths)}
                        </button>
                        <Link
                          href={`/admin/dashboard/contracts/${service._id}?back=/admin/dashboard/hosting-services`}
                          className="text-xs text-primary hover:underline"
                        >
                          Editar contrato
                        </Link>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          {filtered.length} hosting{filtered.length !== 1 ? 's' : ''}
          {hasFilters ? ' (filtrados)' : ''}
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
