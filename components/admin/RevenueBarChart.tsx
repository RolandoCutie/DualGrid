'use client';

import { useState } from 'react';

export interface MonthlyRevenue {
  month: number; // 1–12
  billed: number;
  collected: number;
}

interface Props {
  data: MonthlyRevenue[];
  year: number;
  availableYears: number[];
  onYearChange: (y: number) => void;
}

const MONTH_LABELS = [
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic',
];

function fmt(n: number) {
  if (n >= 1000) return '$' + (n / 1000).toFixed(1) + 'k';
  return '$' + n.toFixed(0);
}

export default function RevenueBarChart({ data, year, availableYears, onYearChange }: Props) {
  const [tooltip, setTooltip] = useState<{ month: number; x: number; y: number } | null>(null);

  const maxVal = Math.max(...data.flatMap((d) => [d.billed, d.collected]), 1);

  const W = 720;
  const H = 220;
  const PADDING = { top: 30, right: 20, bottom: 40, left: 52 };
  const chartW = W - PADDING.left - PADDING.right;
  const chartH = H - PADDING.top - PADDING.bottom;
  const months = 12;
  const groupW = chartW / months;
  const barW = Math.max(6, groupW * 0.32);
  const gap = barW * 0.4;

  const yTicks = 4;
  const yStep = maxVal / yTicks;

  const hovered = tooltip ? data.find((d) => d.month === tooltip.month) : null;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <div>
          <h3 className="text-sm font-semibold text-card-foreground">Ingresos mensuales</h3>
          <p className="text-xs text-muted-foreground">Facturado vs Cobrado</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onYearChange(year - 1)}
            className="p-1.5 rounded-lg border border-border hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Año anterior"
          >
            ←
          </button>
          <span className="text-sm font-semibold text-card-foreground min-w-[3.5rem] text-center">
            {year}
          </span>
          <button
            onClick={() => onYearChange(year + 1)}
            disabled={year >= new Date().getFullYear() + 1}
            className="p-1.5 rounded-lg border border-border hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground disabled:opacity-40"
            aria-label="Año siguiente"
          >
            →
          </button>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-sm bg-primary/40" />
            Facturado
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-sm bg-green-500/80" />
            Cobrado
          </span>
        </div>
      </div>

      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full"
          style={{ minWidth: 340 }}
          onMouseLeave={() => setTooltip(null)}
        >
          {/* Y-axis grid lines + labels */}
          {Array.from({ length: yTicks + 1 }).map((_, i) => {
            const val = (yTicks - i) * yStep;
            const y = PADDING.top + (i / yTicks) * chartH;
            return (
              <g key={i}>
                <line
                  x1={PADDING.left}
                  y1={y}
                  x2={W - PADDING.right}
                  y2={y}
                  stroke="currentColor"
                  strokeOpacity={0.08}
                  strokeWidth={1}
                />
                <text
                  x={PADDING.left - 6}
                  y={y}
                  textAnchor="end"
                  dominantBaseline="middle"
                  fontSize={9}
                  fill="currentColor"
                  opacity={0.45}
                >
                  {fmt(val)}
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {Array.from({ length: months }).map((_, idx) => {
            const monthNum = idx + 1;
            const d = data.find((r) => r.month === monthNum) ?? {
              month: monthNum,
              billed: 0,
              collected: 0,
            };
            const centerX = PADDING.left + groupW * idx + groupW / 2;
            const billedH = (d.billed / maxVal) * chartH;
            const collectedH = (d.collected / maxVal) * chartH;
            const isHovered = tooltip?.month === monthNum;

            return (
              <g
                key={idx}
                onMouseEnter={(e) => {
                  const rect = (e.currentTarget as SVGElement)
                    .closest('svg')!
                    .getBoundingClientRect();
                  setTooltip({ month: monthNum, x: centerX, y: PADDING.top });
                }}
                style={{ cursor: 'pointer' }}
              >
                {/* Hover background */}
                <rect
                  x={centerX - groupW / 2 + 2}
                  y={PADDING.top}
                  width={groupW - 4}
                  height={chartH}
                  fill={isHovered ? 'currentColor' : 'transparent'}
                  fillOpacity={isHovered ? 0.04 : 0}
                  rx={4}
                />
                {/* Billed bar */}
                <rect
                  x={centerX - gap / 2 - barW}
                  y={PADDING.top + chartH - billedH}
                  width={barW}
                  height={Math.max(billedH, 2)}
                  fill={isHovered ? 'rgb(var(--primary) / 0.65)' : 'rgb(var(--primary) / 0.35)'}
                  rx={3}
                />
                {/* Collected bar */}
                <rect
                  x={centerX + gap / 2}
                  y={PADDING.top + chartH - collectedH}
                  width={barW}
                  height={Math.max(collectedH, 2)}
                  fill={isHovered ? 'rgb(34 197 94 / 0.9)' : 'rgb(34 197 94 / 0.65)'}
                  rx={3}
                />
                {/* Month label */}
                <text
                  x={centerX}
                  y={PADDING.top + chartH + 14}
                  textAnchor="middle"
                  fontSize={9}
                  fill="currentColor"
                  opacity={0.55}
                >
                  {MONTH_LABELS[idx]}
                </text>
              </g>
            );
          })}

          {/* Tooltip */}
          {tooltip &&
            hovered &&
            (() => {
              const tx = Math.min(tooltip.x, W - 120);
              return (
                <g>
                  <rect
                    x={tx - 10}
                    y={tooltip.y - 5}
                    width={120}
                    height={58}
                    rx={6}
                    fill="var(--card)"
                    stroke="var(--border)"
                    strokeWidth={1}
                  />
                  <text
                    x={tx}
                    y={tooltip.y + 13}
                    fontSize={10}
                    fontWeight="600"
                    fill="currentColor"
                  >
                    {MONTH_LABELS[hovered.month - 1]} {year}
                  </text>
                  <text x={tx} y={tooltip.y + 27} fontSize={9} fill="currentColor" opacity={0.6}>
                    Facturado:
                  </text>
                  <text
                    x={tx + 55}
                    y={tooltip.y + 27}
                    fontSize={9}
                    fill="currentColor"
                    fontWeight="600"
                  >
                    {fmt(hovered.billed)}
                  </text>
                  <text x={tx} y={tooltip.y + 41} fontSize={9} fill="currentColor" opacity={0.6}>
                    Cobrado:
                  </text>
                  <text
                    x={tx + 55}
                    y={tooltip.y + 41}
                    fontSize={9}
                    fill="rgb(34 197 94)"
                    fontWeight="600"
                  >
                    {fmt(hovered.collected)}
                  </text>
                </g>
              );
            })()}
        </svg>
      </div>
    </div>
  );
}
