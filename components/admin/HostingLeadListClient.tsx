'use client';

import ConfirmModal from '@/components/ui/ConfirmModal';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export interface HostingLeadRow {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  hasWebsite: boolean;
  hasDomain: boolean;
  planId: string;
  notes?: string;
  status: string;
  adminNotes?: string;
  createdAt: string;
}

const PLAN_LABELS: Record<string, string> = {
  annual: 'Hosting Anual ($120)',
  biennial: 'Hosting Bianual ($110/año)',
  triennial: 'Hosting Trienal ($100/año)',
  domain_only: 'Solo dominio',
  hosting_domain: 'Hosting + Dominio',
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  new: { label: 'Nuevo', color: 'text-primary bg-primary/10' },
  contacted: { label: 'Contactado', color: 'text-amber-600 bg-amber-50' },
  converted: { label: 'Convertido', color: 'text-green-600 bg-green-50' },
};

const PAGE_SIZE = 20;

export default function HostingLeadListClient({ leads }: { leads: HostingLeadRow[] }) {
  const router = useRouter();
  const [rows, setRows] = useState<HostingLeadRow[]>(leads);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [convertingId, setConvertingId] = useState<string | null>(null);
  const [convertError, setConvertError] = useState('');
  const [confirm, setConfirm] = useState<{ id: string; name: string } | null>(null);

  const filtered = rows.filter((r) => {
    const matchSearch =
      !search ||
      r.fullName.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/hosting-leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setRows((prev) => prev.map((r) => (r._id === id ? { ...r, status: newStatus } : r)));
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!confirm) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/hosting-leads/${confirm.id}`, { method: 'DELETE' });
      if (res.ok) setRows((prev) => prev.filter((r) => r._id !== confirm.id));
    } finally {
      setDeleting(false);
      setConfirm(null);
    }
  };

  const handleConvert = async (id: string) => {
    if (!window.confirm('¿Crear un cliente a partir de este lead de hosting?')) return;
    setConvertingId(id);
    setConvertError('');
    try {
      const res = await fetch(`/api/hosting-leads/${id}/convert`, { method: 'POST' });
      const data = await res.json();
      if (res.status === 409) {
        setConvertError(`Ya existe un cliente con ese email.`);
        return;
      }
      if (!res.ok) {
        setConvertError(data.error || 'Error al convertir.');
        return;
      }
      setRows((prev) => prev.map((r) => (r._id === id ? { ...r, status: 'converted' } : r)));
      router.push('/admin/dashboard/clients');
      router.refresh();
    } catch {
      setConvertError('Error de red. Inténtalo de nuevo.');
    } finally {
      setConvertingId(null);
    }
  };

  return (
    <div>
      {convertError && (
        <p className="mb-3 text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
          {convertError}
        </p>
      )}
      <ConfirmModal
        open={!!confirm}
        title="Eliminar lead"
        message={`¿Eliminar la solicitud de "${confirm?.name}"?`}
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirm(null)}
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre o email…"
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
          {Object.entries(STATUS_LABELS).map(([v, s]) => (
            <option key={v} value={v}>
              {s.label}
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
              <th className="text-left px-4 py-3 font-semibold text-card-foreground">
                Web / Dominio
              </th>
              <th className="text-left px-4 py-3 font-semibold text-card-foreground">Estado</th>
              <th className="text-left px-4 py-3 font-semibold text-card-foreground">Fecha</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginated.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-muted-foreground">
                  No hay solicitudes de hosting.
                </td>
              </tr>
            )}
            {paginated.map((r) => {
              const statusInfo = STATUS_LABELS[r.status] ?? STATUS_LABELS.new;
              return (
                <tr key={r._id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-card-foreground">{r.fullName}</p>
                    <p className="text-xs text-muted-foreground">{r.email}</p>
                    {r.phone && <p className="text-xs text-muted-foreground">{r.phone}</p>}
                    {r.notes && (
                      <p className="text-xs text-muted-foreground italic mt-0.5">
                        &ldquo;{r.notes}&rdquo;
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-card-foreground">
                    {PLAN_LABELS[r.planId] ?? r.planId}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mr-1 ${r.hasWebsite ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}`}
                    >
                      Web: {r.hasWebsite ? 'Sí' : 'No'}
                    </span>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${r.hasDomain ? 'bg-blue-100 text-blue-700' : 'bg-muted text-muted-foreground'}`}
                    >
                      Dom: {r.hasDomain ? 'Sí' : 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1.5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${statusInfo.color}`}
                      >
                        {statusInfo.label}
                      </span>
                      <select
                        value={r.status}
                        disabled={updatingId === r._id}
                        onChange={(e) => handleStatusChange(r._id, e.target.value)}
                        className="text-xs rounded-md border border-border bg-background text-muted-foreground px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                      >
                        {Object.entries(STATUS_LABELS).map(([v, s]) => (
                          <option key={v} value={v}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(r.createdAt).toLocaleDateString('es')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex flex-col items-end gap-1.5">
                      {r.status === 'converted' ? (
                        <span className="text-xs text-green-600 font-semibold">✓ Convertido</span>
                      ) : (
                        <button
                          onClick={() => handleConvert(r._id)}
                          disabled={convertingId === r._id}
                          className="text-xs text-green-600 hover:text-green-700 font-semibold hover:underline disabled:opacity-50 whitespace-nowrap"
                        >
                          {convertingId === r._id ? 'Creando…' : '👤 Convertir en cliente'}
                        </button>
                      )}
                      <button
                        onClick={() => setConfirm({ id: r._id, name: r.fullName })}
                        className="text-red-500 text-xs hover:underline"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
          <span>{filtered.length} solicitudes</span>
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
