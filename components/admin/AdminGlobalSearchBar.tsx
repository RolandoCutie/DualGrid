'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';

type SearchGroupKey = 'clients' | 'contracts' | 'invoices' | 'expenses';

interface SearchItem {
  id: string;
  href: string;
  title: string;
  subtitle: string;
  meta?: string;
}

interface SearchPayload {
  query: string;
  results: Record<SearchGroupKey, SearchItem[]>;
}

const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 240;

const SEARCH_GROUPS: Array<{ key: SearchGroupKey; label: string }> = [
  { key: 'clients', label: 'Clientes' },
  { key: 'contracts', label: 'Contratos' },
  { key: 'invoices', label: 'Facturas' },
  { key: 'expenses', label: 'Gastos' },
];

export default function AdminGlobalSearchBar() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payload, setPayload] = useState<SearchPayload | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < MIN_QUERY_LENGTH) {
      setPayload(null);
      setError(null);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/admin/search?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          if (res.status === 401) {
            throw new Error('Tu sesión de admin expiró. Recarga para volver a entrar.');
          }
          throw new Error('No se pudo completar la búsqueda global.');
        }

        const data = (await res.json()) as SearchPayload;
        setPayload(data);
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        setPayload(null);
        setError(err instanceof Error ? err.message : 'Error desconocido en la búsqueda.');
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  const totalResults = useMemo(() => {
    if (!payload) return 0;
    return SEARCH_GROUPS.reduce((sum, group) => sum + (payload.results[group.key]?.length ?? 0), 0);
  }, [payload]);

  const shouldShowPanel = isOpen && query.trim().length >= MIN_QUERY_LENGTH;

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </span>
        <input
          type="search"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          placeholder="Búsqueda global: clientes, contratos, facturas, gastos…"
          className="w-full rounded-xl border border-border bg-card px-10 py-2.5 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {shouldShowPanel && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-border bg-card shadow-xl">
          <div className="max-h-[420px] overflow-y-auto">
            {loading && (
              <div className="px-4 py-4 text-sm text-muted-foreground">Buscando coincidencias…</div>
            )}

            {!loading && error && <div className="px-4 py-4 text-sm text-red-500">{error}</div>}

            {!loading && !error && payload && totalResults === 0 && (
              <div className="px-4 py-4 text-sm text-muted-foreground">
                Sin resultados para “{payload.query}”.
              </div>
            )}

            {!loading && !error && payload && totalResults > 0 && (
              <div className="divide-y divide-border">
                {SEARCH_GROUPS.map((group) => {
                  const items = payload.results[group.key] ?? [];
                  if (items.length === 0) return null;

                  return (
                    <section key={group.key} className="px-3 py-2.5">
                      <p className="mb-1.5 px-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        {group.label}
                      </p>
                      <div className="space-y-1">
                        {items.map((item) => (
                          <Link
                            key={`${group.key}-${item.id}`}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className="block rounded-lg px-2.5 py-2 transition-colors hover:bg-muted/70"
                          >
                            <p className="text-sm font-medium text-card-foreground">{item.title}</p>
                            <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                            {item.meta && <p className="text-[11px] text-muted-foreground/80">{item.meta}</p>}
                          </Link>
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
