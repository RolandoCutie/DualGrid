'use client';

import { useMemo } from 'react';

interface Location {
  _id: string;
  name: string;
  province: string;
  dropOffPrice?: number;
}

interface LocationSelectorProps {
  locations: Location[];
  value: string;
  onChange: (locationId: string) => void;
  label: string;
}

const PROVINCE_LABELS: Record<string, string> = {
  pinar_del_rio: 'Pinar del Río',
  la_habana: 'La Habana',
  mayabeque: 'Mayabeque',
  artemisa: 'Artemisa',
  matanzas: 'Matanzas',
  cienfuegos: 'Cienfuegos',
  villa_clara: 'Villa Clara',
  santa_clara: 'Santa Clara',
  camaguey: 'Camagüey',
  las_tunas: 'Las Tunas',
  holguin: 'Holguín',
  santiago_de_cuba: 'Santiago de Cuba',
  guantanamo: 'Guantánamo',
  granma: 'Granma',
  isla_de_la_juventud: 'Isla de la Juventud',
  ciego_de_avila: 'Ciego de Ávila',
  sancti_spiritus: 'Sancti Spíritus',
};

// Orden de provincias de oeste a este (coincidir con los valores de `location.province`)
const PROVINCE_ORDER = [
  'pinar_del_rio',
  'artemisa',
  'la_habana',
  'mayabeque',
  'matanzas',
  'villa_clara',
  'santa_clara',
  'cienfuegos',
  'sancti_spiritus',
  'ciego_de_avila',
  'camaguey',
  'las_tunas',
  'holguin',
  'granma',
  'santiago_de_cuba',
  'guantanamo',
  'isla_de_la_juventud',
];

const LocationSelector = ({ locations, value, onChange, label }: LocationSelectorProps) => {
  const provinces = useMemo(() => {
    const set = new Set(locations.map((l) => l.province));
    return Array.from(set).sort((a, b) => {
      const ia = PROVINCE_ORDER.indexOf(a);
      const ib = PROVINCE_ORDER.indexOf(b);
      if (ia === -1 && ib === -1) {
        return (PROVINCE_LABELS[a] || a).localeCompare(PROVINCE_LABELS[b] || b);
      }
      if (ia === -1) return 1; // los desconocidos van al final
      if (ib === -1) return -1;
      return ia - ib;
    });
  }, [locations]);

  // Group locations by province for optgroup rendering
  const groupedLocations = useMemo(
    () =>
      provinces.map((prov) => ({
        province: prov,
        label: PROVINCE_LABELS[prov] || prov,
        locations: locations.filter((l) => l.province === prov),
      })),
    [provinces, locations],
  );

  return (
    <div>
      <label className="block text-sm font-medium text-secondary-foreground mb-1.5">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-border bg-input px-4 py-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
      >
        {provinces.length <= 1
          ? locations.map((loc) => (
              <option key={loc._id} value={loc._id}>
                {loc.name}
              </option>
            ))
          : groupedLocations.map((group) => (
              <optgroup key={group.province} label={group.label}>
                {group.locations.map((loc) => (
                  <option key={loc._id} value={loc._id}>
                    {loc.name}
                  </option>
                ))}
              </optgroup>
            ))}
      </select>
    </div>
  );
};

export default LocationSelector;
