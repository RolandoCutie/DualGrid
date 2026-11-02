'use client';

import RevenueBarChart, { type MonthlyRevenue } from '@/components/admin/RevenueBarChart';
import { useRef, useState } from 'react';

interface Props {
  initialYear: number;
  initialData: MonthlyRevenue[];
}

export default function RevenueChartWrapper({ initialYear, initialData }: Props) {
  const [year, setYear] = useState(initialYear);
  const [fetchedData, setFetchedData] = useState<MonthlyRevenue[]>([]);
  const [loading, setLoading] = useState(false);
  const requestSequence = useRef(0);

  const handleYearChange = async (nextYear: number) => {
    if (nextYear === year) return;
    setYear(nextYear);

    if (nextYear === initialYear) {
      setLoading(false);
      return;
    }

    const currentRequest = ++requestSequence.current;
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/revenue?year=${nextYear}`, { cache: 'no-store' });
      if (!res.ok) {
        throw new Error(`Failed to fetch revenue for year ${nextYear}: ${res.status}`);
      }

      const nextData = (await res.json()) as MonthlyRevenue[];
      if (requestSequence.current === currentRequest) {
        setFetchedData(nextData);
      }
    } catch {
      if (requestSequence.current === currentRequest) {
        setFetchedData([]);
      }
    } finally {
      if (requestSequence.current === currentRequest) {
        setLoading(false);
      }
    }
  };

  const data = year === initialYear ? initialData : fetchedData;

  return (
    <div
      className={
        loading ? 'opacity-60 pointer-events-none transition-opacity' : 'transition-opacity'
      }
    >
      <RevenueBarChart data={data} year={year} onYearChange={handleYearChange} />
    </div>
  );
}
