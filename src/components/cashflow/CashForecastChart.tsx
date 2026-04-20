'use client';

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts';
import type { DailyForecastPoint } from '@/lib/data/types';

interface CashForecastChartProps {
  data: DailyForecastPoint[];
}

export default function CashForecastChart({ data }: CashForecastChartProps) {
  const historicalData = data.filter((d) => !d.isProjected);
  const projectedData = data.filter((d) => d.isProjected);
  const todayDate = historicalData[historicalData.length - 1]?.date;

  // Combine with overlap point for smooth line
  const combined = data.map((d) => ({
    date: d.date,
    historical: !d.isProjected ? d.balance : undefined,
    projected: d.isProjected || d.date === todayDate ? d.balance : undefined,
  }));

  const formatTick = (date: string) => {
    const d = new Date(date + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatBalance = (val: number) => `$${(val / 1000).toFixed(0)}K`;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={combined} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
        <defs>
          <linearGradient id="histGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#c8f060" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#c8f060" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="projGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ffb340" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#ffb340" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="date"
          tickFormatter={formatTick}
          tick={{ fill: '#7a7870', fontSize: 10 }}
          axisLine={{ stroke: 'rgba(0,0,0,0.08)' }}
          tickLine={false}
          interval={14}
        />
        <YAxis
          tickFormatter={formatBalance}
          tick={{ fill: '#7a7870', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          width={55}
        />
        <Tooltip
          contentStyle={{
            background: '#1e1f1c',
            border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: 8,
            fontSize: 12,
            color: '#e8e6de',
          }}
          formatter={(val) => [`$${Number(val).toLocaleString()}`, '']}
          labelFormatter={(label) => formatTick(String(label))}
        />
        {todayDate && (
          <ReferenceLine
            x={todayDate}
            stroke="rgba(255,255,255,0.2)"
            strokeDasharray="3 3"
            label={{ value: 'Today', fill: '#7a7870', fontSize: 10, position: 'top' }}
          />
        )}
        <Area
          type="monotone"
          dataKey="historical"
          stroke="#c8f060"
          fill="url(#histGrad)"
          strokeWidth={2}
          dot={false}
          connectNulls={false}
        />
        <Area
          type="monotone"
          dataKey="projected"
          stroke="#ffb340"
          fill="url(#projGrad)"
          strokeWidth={2}
          strokeDasharray="5 3"
          dot={false}
          connectNulls={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
