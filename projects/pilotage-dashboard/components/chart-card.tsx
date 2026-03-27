'use client';

import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line, ReferenceLine } from 'recharts';
import { formatPeriodLabel } from '@/lib/periods';
import { KpiRow } from '@/lib/types';
import { formatKpiLabel, formatValue, KPI_UNIT } from '@/lib/dashboard';

export function ChartCard({ title, rows }: { title: string; rows: KpiRow[] }) {
  const unit = KPI_UNIT[title];
  const lastPoint = rows[rows.length - 1];

  return (
    <div className="chart-panel">
      <div className="chart-panel__head">
        <div>
          <p className="chart-panel__eyebrow">Historique KPI</p>
          <h3>{formatKpiLabel(title)}</h3>
        </div>
        <div className="chart-panel__meta">
          <span>{rows.length} périodes</span>
          <strong>{lastPoint ? formatValue(lastPoint.value, unit) : '—'}</strong>
        </div>
      </div>
      <div className="chart-panel__body">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows} margin={{ top: 8, right: 18, left: 0, bottom: 8 }}>
            <CartesianGrid stroke="#273142" vertical={false} />
            <XAxis dataKey="period" tickFormatter={formatPeriodLabel} stroke="#7f8ea3" tick={{ fontSize: 11 }} />
            <YAxis stroke="#7f8ea3" tick={{ fontSize: 11 }} width={80} tickFormatter={(value) => formatValue(value, unit)} />
            <Tooltip
              formatter={(value: unknown) => formatValue(Number(value ?? 0), unit)}
              labelFormatter={(label) => formatPeriodLabel(String(label))}
              contentStyle={{ background: '#0f1722', border: '1px solid #334155', borderRadius: 12 }}
            />
            <ReferenceLine y={0} stroke="#415066" strokeDasharray="4 4" />
            <Line type="monotone" dataKey="value" stroke="#5cc8ff" strokeWidth={3} dot={{ r: 2 }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
