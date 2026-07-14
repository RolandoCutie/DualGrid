'use client';

import RevenueBarChart, { type MonthlyRevenue } from '@/components/admin/RevenueBarChart';
import { useEffect, useState } from 'react';

interface Props {
  initialYear: number;
  initialData: MonthlyRevenue[];
}

export default function RevenueChartWrapper({ initialYear, initialData }: Props) {
  const [year, setYear] = useState(initialYear);
  const [data, setData] = useState<MonthlyRevenue[]>(initialData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (year === initialYear) {
      setData(initialData);
      return;
    }
    setLoading(true);
    fetch(`/api/admin/revenue?year=${year}`)
      .then((r) => r.json())
      .then((d: MonthlyRevenue[]) => setData(d))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [year, initialYear, initialData]);

  const availableYears = Array.from({ length: 60 }, (_, i) => 2026 + i);

  return (
    <div
      className={
        loading ? 'opacity-60 pointer-events-none transition-opacity' : 'transition-opacity'
      }
    >
      <RevenueBarChart
        data={data}
        year={year}
        availableYears={availableYears}
        onYearChange={setYear}
      />
    </div>
  );
}
