'use client';

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

export default function ClientListClient({ clients }: Props) {
  const [search, setSearch] = useState('');

  const filtered = clients.filter(
    (c) =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.businessName && c.businessName.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <div>
      {/* Filter */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre, negocio o email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-8 text-muted-foreground">
                  No hay clientes que coincidan con la búsqueda.
                </td>
              </tr>
            )}
            {filtered.map((c) => (
              <tr key={c._id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-medium text-card-foreground">{c.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.businessName ?? '—'}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.email}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.phone ?? '—'}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/dashboard/clients/${c._id}`}
                    className="text-primary text-xs hover:underline"
                  >
                    Editar
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
