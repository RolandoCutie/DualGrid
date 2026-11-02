'use client';

import { useEffect, useState } from 'react';

type TableDensity = 'comfortable' | 'compact';

const STORAGE_KEY = 'dualgrid-admin-table-density';

function isTableDensity(value: string | null): value is TableDensity {
  return value === 'comfortable' || value === 'compact';
}

function applyTableDensity(density: TableDensity) {
  document.documentElement.dataset.adminDensity = density;
}

export default function AdminTableDensityToggle() {
  const [density, setDensity] = useState<TableDensity>(() => {
    if (typeof window === 'undefined') {
      return 'comfortable';
    }
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isTableDensity(stored) ? stored : 'comfortable';
  });

  useEffect(() => {
    applyTableDensity(density);
    window.localStorage.setItem(STORAGE_KEY, density);
    return () => {
      delete document.documentElement.dataset.adminDensity;
    };
  }, [density]);

  const buttonBaseClass =
    'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border border-transparent';

  return (
    <div className="fixed top-[4.5rem] right-4 z-40 rounded-xl border border-border bg-card/95 backdrop-blur px-3 py-2 shadow-lg">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">
        Densidad tabla
      </p>
      <div className="inline-flex items-center gap-1 rounded-lg bg-muted/60 p-1">
        <button
          type="button"
          onClick={() => setDensity('comfortable')}
          className={`${buttonBaseClass} ${
            density === 'comfortable'
              ? 'bg-background text-card-foreground border-border shadow-sm'
              : 'text-muted-foreground hover:text-card-foreground'
          }`}
          aria-pressed={density === 'comfortable'}
        >
          Cómodo
        </button>
        <button
          type="button"
          onClick={() => setDensity('compact')}
          className={`${buttonBaseClass} ${
            density === 'compact'
              ? 'bg-background text-card-foreground border-border shadow-sm'
              : 'text-muted-foreground hover:text-card-foreground'
          }`}
          aria-pressed={density === 'compact'}
        >
          Compacto
        </button>
      </div>
    </div>
  );
}
