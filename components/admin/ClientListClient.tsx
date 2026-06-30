'use client';

import ConfirmModal from '@/components/ui/ConfirmModal';
import Link from 'next/link';
import { useState } from 'react';

export interface ClientRow {
  _id: string;
  name: string;
  businessName: string | null;
  email: string;
  phone: string | null;
}

interface Props {
  clients: ClientRow[];
}

const PAGE_SIZE = 20;

export default function ClientListClient({ clients }: Props) {
  const [search, setSearch] = useState('');
  const [rows, setRows] = useState<ClientRow[]>(clients);
  const [deleting, setDeleting] = useState(false);
  const [page, setPage] = useState(1);
  const [confirm, setConfirm] = useState<{ id: string; name: string } | null>(null);

  const filtered = rows.filter(
    (c) =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.businessName && c.businessName.toLowerCase().includes(search.toLowerCase())),
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleDeleteConfirm = async () => {
    if (!confirm) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/clients/${confirm.id}`, { method: 'DELETE' });
      if (res.ok) setRows((prev) => prev.filter((c) => c._id !== confirm.id));
    } finally {
      setDeleting(false);
      setConfirm(null);
    }
  };

  return (
    <div>
      <ConfirmModal
        open={!!confirm}
        title="Eliminar cliente"
        message={`¿Eliminar al cliente "${confirm?.name}"? Esta acción no se puede deshacer.`}
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirm(null)}
      />

      {/* Filter */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre, negocio o email…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full sm:w-80 rounded-lg border border-border bg-background text-card-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-card-foreground">Nombre</th>
              <th className="text-left px-4 py-3 font-semibold text-card-foreground">Negocio</th>
              <th className="text-left px-4 py-3 font-semibold text-card-foreground">Email</th>
              <th className="text-left px-4 py-3 font-semibold text-card-foreground">Teléfono</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginated.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-8 text-muted-foreground">
                  No hay clientes que coincidan con la búsqueda.
                </td>
              </tr>
            )}
            {paginated.map((c) => (
              <tr key={c._id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-medium text-card-foreground">{c.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.businessName ?? '—'}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.email}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.phone ?? '—'}</td>
                <td className="px-4 py-3 text-right space-x-3">
                  <Link
                    href={`/admin/dashboard/clients/${c._id}/overview`}
                    className="text-primary text-xs hover:underline"
                  >
                    Ver perfil
                  </Link>
                  <Link
                    href={`/admin/dashboard/clients/${c._id}`}
                    className="text-muted-foreground text-xs hover:underline"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => setConfirm({ id: c._id, name: c.name })}
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
          <span>{filtered.length} clientes</span>
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
