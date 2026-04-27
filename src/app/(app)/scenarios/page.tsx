'use client';

import { useState } from 'react';
import { getDemoScenarios } from '@/lib/data/demo-data';
import { formatCurrency } from '@/lib/utils';
import {
  ResponsiveContainer, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from 'recharts';

const TOOLTIP_STYLE = {
  background: '#1E2236',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: 8,
  color: '#FFFFFF',
  fontSize: 12,
  boxShadow: '0 1px 4px rgba(0,0,0,0.30), 0 4px 16px rgba(0,0,0,0.25)',
};

const SCENARIO_META: Record<string, { description: string; narrative: string }> = {
  base: {
    description: '3% MoM organic growth, marketing normalized to budget',
    narrative: 'Maintains current trajectory with marketing spend corrected to the $124K budget. ShipBob savings fully realized. No new client wins assumed.',
  },
  best: {
    description: '$6M net new ARR from new client wins, ramping Jul–Dec 2026',
    narrative: 'New wholesale/enterprise clients secured in Q3 2026 contribute an additional $500K/month at full ramp by December. Two sales hires support the new book of business. DTC mix improvement drives COGS down to 53%.',
  },
  conservative: {
    description: '1% MoM growth, COGS rising to 57% from freight pressure',
    narrative: 'Scheels pull-forward creates a May wholesale gap. El Paso freight surcharge spreads. Marketing held at budget. Growth slows but business remains profitable — runway stays above 6 months.',
  },
  downside: {
    description: '-2% MoM revenue decline + 10% wholesale churn, COGS 60%',
    narrative: 'Requires both revenue weakness and channel concentration risk to materialize simultaneously. If wholesale churn hits in Q3 2026 and freight costs aren\'t renegotiated, margins compress significantly by Q4 2026.',
  },
};

export default function ScenariosPage() {
  const allScenarios = getDemoScenarios();
  const [selected, setSelected] = useState<Set<string>>(new Set(allScenarios.map((s) => s.id)));
  const [chartMetric, setChartMetric] = useState<'revenue' | 'netIncome' | 'grossProfit'>('revenue');

  const toggleScenario = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { if (next.size > 1) next.delete(id); }
      else next.add(id);
      return next;
    });
  };

  const active = allScenarios.filter((s) => selected.has(s.id));

  // Build chart data — all scenarios share the same month labels
  const chartData = allScenarios[0].results.map((_, i) => {
    const point: Record<string, string | number> = { month: allScenarios[0].results[i].label };
    allScenarios.forEach((s) => {
      if (selected.has(s.id)) point[s.name] = s.results[i][chartMetric];
    });
    return point;
  });

  // Summary stats for each active scenario
  const summaries = active.map((s) => {
    const last      = s.results[s.results.length - 1];
    const totalRev  = s.results.reduce((sum, m) => sum + m.revenue, 0);
    const totalNI   = s.results.reduce((sum, m) => sum + m.netIncome, 0);
    const avgMargin = (s.results.reduce((sum, m) => sum + m.netIncome / m.revenue, 0) / s.results.length) * 100;
    return { s, totalRev, totalNI, avgMargin, exitRevARR: last.revenue * 12, exitNIARR: last.netIncome * 12 };
  });

  const metricLabel: Record<string, string> = {
    revenue:     'Revenue',
    netIncome:   'Net Income',
    grossProfit: 'Gross Profit',
  };

  return (
    <div className="flex flex-col gap-5">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div
            className="text-[24px] font-black uppercase tracking-[0.04em]"
            style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-text)' }}
          >
            Scenario Planning
          </div>
          <div className="text-[13px] mt-0.5" style={{ color: 'var(--color-muted)' }}>
            May '26 → Apr '27 · 12-month forward projections from Apr actuals
          </div>
        </div>
        <div
          className="text-[12px] px-3 py-2 border"
          style={{ borderColor: 'var(--color-border2)', background: 'var(--color-blue-d)', color: 'var(--color-blue)', fontFamily: 'var(--font-condensed)' }}
        >
          💬 Ask the AI CFO to modify any scenario assumption
        </div>
      </div>

      {/* ── Scenario selector ── */}
      <div className="flex flex-wrap gap-2">
        {allScenarios.map((s) => {
          const on = selected.has(s.id);
          return (
            <button
              key={s.id}
              onClick={() => toggleScenario(s.id)}
              className="flex items-center gap-2 px-4 py-2 text-[13px] font-bold uppercase tracking-[0.06em] border cursor-pointer transition-all"
              style={{
                fontFamily: 'var(--font-condensed)',
                borderColor: on ? s.color : 'var(--color-border2)',
                color: on ? s.color : 'var(--color-muted)',
                background: on ? `${s.color}14` : 'transparent',
              }}
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: on ? s.color : 'var(--color-border2)' }}
              />
              {s.name}
            </button>
          );
        })}
      </div>

      {/* ── Summary KPI cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {allScenarios.map((s) => {
          const on = selected.has(s.id);
          const totalRev = s.results.reduce((sum, m) => sum + m.revenue, 0);
          const totalNI  = s.results.reduce((sum, m) => sum + m.netIncome, 0);
          const avgMargin = (s.results.reduce((sum, m) => sum + m.netIncome / m.revenue, 0) / s.results.length) * 100;
          return (
            <div
              key={s.id}
              className="border p-4 cursor-pointer transition-all"
              style={{
                background: 'var(--color-surf)',
                borderColor: on ? s.color : 'var(--color-border)',
                borderLeftWidth: 3,
                opacity: on ? 1 : 0.4,
              }}
              onClick={() => toggleScenario(s.id)}
            >
              <div
                className="text-[11px] font-black uppercase tracking-[0.1em] mb-2"
                style={{ fontFamily: 'var(--font-condensed)', color: s.color }}
              >
                {s.name}
              </div>
              <div
                className="text-[22px] font-black leading-none"
                style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-text)' }}
              >
                {formatCurrency(totalRev, true)}
              </div>
              <div className="text-[11px] mt-0.5 mb-3" style={{ color: 'var(--color-muted)' }}>12-month revenue</div>
              <div className="pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
                <div
                  className="text-[16px] font-black"
                  style={{
                    fontFamily: 'var(--font-condensed)',
                    color: totalNI >= 0 ? 'var(--color-green)' : 'var(--color-red)',
                  }}
                >
                  {formatCurrency(totalNI, true)}
                </div>
                <div className="text-[11px] mt-0.5" style={{ color: 'var(--color-muted)' }}>
                  Net income · {avgMargin.toFixed(1)}% avg margin
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Chart ── */}
      <div
        className="border"
        style={{ background: 'var(--color-surf)', borderColor: 'var(--color-border)' }}
      >
        <div
          className="px-4 py-3 border-b flex items-center justify-between"
          style={{ borderColor: 'var(--color-border)', background: 'var(--color-surf2)' }}
        >
          <span
            className="text-[12px] font-bold uppercase tracking-[0.10em]"
            style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-muted)' }}
          >
            {metricLabel[chartMetric]} by Scenario — May '26 → Apr '27
          </span>
          <div className="flex gap-1.5">
            {(['revenue', 'grossProfit', 'netIncome'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setChartMetric(m)}
                className="text-[11px] px-2.5 py-1 cursor-pointer border transition-all"
                style={{
                  fontFamily: 'var(--font-condensed)',
                  fontWeight: 700,
                  background: chartMetric === m ? 'var(--color-blue-d)' : 'transparent',
                  borderColor: chartMetric === m ? 'var(--color-blue)' : 'var(--color-border2)',
                  color: chartMetric === m ? 'var(--color-blue)' : 'var(--color-muted)',
                }}
              >
                {metricLabel[m]}
              </button>
            ))}
          </div>
        </div>
        <div className="p-4">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: 5, bottom: 5 }}>
              <CartesianGrid stroke="var(--color-chart-grid)" strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tick={{ fill: 'var(--color-chart-text)', fontSize: 11 }}
                axisLine={false} tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
                tick={{ fill: 'var(--color-chart-text)', fontSize: 11 }}
                axisLine={false} tickLine={false} width={60}
              />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                formatter={(val) => [`$${Number(val).toLocaleString()}`, '']}
              />
              <Legend wrapperStyle={{ fontSize: 12, color: 'var(--color-chart-text)' }} />
              {active.map((s) => (
                <Line
                  key={s.id}
                  type="monotone"
                  dataKey={s.name}
                  stroke={s.color}
                  strokeWidth={s.id === 'base' ? 2.5 : 2}
                  dot={false}
                  strokeDasharray={s.id === 'downside' ? '6 3' : s.id === 'conservative' ? '3 2' : undefined}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Comparison table ── */}
      <div
        className="border overflow-hidden"
        style={{ background: 'var(--color-surf)', borderColor: 'var(--color-border)' }}
      >
        <div
          className="px-4 py-3 border-b"
          style={{ borderColor: 'var(--color-border)', background: 'var(--color-surf2)' }}
        >
          <span
            className="text-[12px] font-bold uppercase tracking-[0.10em]"
            style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-muted)' }}
          >
            Scenario Comparison — 12-Month Summary
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr>
                {['Scenario', '12M Revenue', '12M Net Income', 'Avg Net Margin', 'Exit ARR', 'Exit NI (Ann.)'].map((h, i) => (
                  <th
                    key={h}
                    className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.08em] border-b"
                    style={{
                      textAlign: i === 0 ? 'left' : 'right',
                      fontFamily: 'var(--font-condensed)',
                      color: 'var(--color-muted)',
                      borderColor: 'var(--color-border)',
                      background: 'var(--color-surf2)',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {summaries.map(({ s, totalRev, totalNI, avgMargin, exitRevARR, exitNIARR }) => (
                <tr
                  key={s.id}
                  style={{
                    borderBottom: '1px solid var(--color-border)',
                    borderLeft: `3px solid ${s.color}`,
                    opacity: selected.has(s.id) ? 1 : 0.45,
                  }}
                >
                  <td className="px-4 py-3 font-bold" style={{ fontFamily: 'var(--font-condensed)', color: s.color }}>
                    {s.name}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold tabular-nums" style={{ fontFamily: 'var(--font-condensed)' }}>
                    {formatCurrency(totalRev, true)}
                  </td>
                  <td
                    className="px-4 py-3 text-right font-bold tabular-nums"
                    style={{ fontFamily: 'var(--font-condensed)', color: totalNI >= 0 ? 'var(--color-green)' : 'var(--color-red)' }}
                  >
                    {formatCurrency(totalNI, true)}
                  </td>
                  <td
                    className="px-4 py-3 text-right font-semibold tabular-nums"
                    style={{
                      fontFamily: 'var(--font-condensed)',
                      color: avgMargin >= 12 ? 'var(--color-green)' : avgMargin >= 6 ? 'var(--color-orange)' : 'var(--color-red)',
                    }}
                  >
                    {avgMargin.toFixed(1)}%
                  </td>
                  <td className="px-4 py-3 text-right font-semibold tabular-nums" style={{ fontFamily: 'var(--font-condensed)' }}>
                    {formatCurrency(exitRevARR, true)}
                  </td>
                  <td
                    className="px-4 py-3 text-right font-semibold tabular-nums"
                    style={{ fontFamily: 'var(--font-condensed)', color: exitNIARR >= 0 ? 'var(--color-green)' : 'var(--color-red)' }}
                  >
                    {formatCurrency(exitNIARR, true)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Scenario narrative + assumptions ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {active.map((s) => {
          const meta = SCENARIO_META[s.id];
          return (
            <div
              key={s.id}
              className="border p-4 flex flex-col gap-3"
              style={{ background: 'var(--color-surf)', borderColor: 'var(--color-border)', borderLeft: `3px solid ${s.color}` }}
            >
              <div>
                <div
                  className="text-[13px] font-black uppercase tracking-[0.08em] mb-1"
                  style={{ fontFamily: 'var(--font-condensed)', color: s.color }}
                >
                  {s.name}
                </div>
                <div className="text-[12px] font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
                  {meta?.description}
                </div>
                <div className="text-[12px] leading-relaxed" style={{ color: 'var(--color-muted)' }}>
                  {meta?.narrative}
                </div>
              </div>

              {/* Assumptions */}
              <div className="border-t pt-3" style={{ borderColor: 'var(--color-border)' }}>
                <div
                  className="text-[10px] font-bold uppercase tracking-[0.1em] mb-2"
                  style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-muted)' }}
                >
                  Key assumptions vs base
                </div>
                {s.assumptions.map((a) => (
                  <div
                    key={a.id}
                    className="flex justify-between text-[12px] py-1.5 border-b last:border-b-0"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <span style={{ color: 'var(--color-muted)' }}>{a.label}</span>
                    <div className="flex items-center gap-2.5 font-semibold" style={{ fontFamily: 'var(--font-condensed)' }}>
                      <span className="line-through text-[11px]" style={{ color: 'var(--color-muted)' }}>
                        {a.unit === 'percent'   ? `${a.baseValue}%`
                         : a.unit === 'currency' ? formatCurrency(a.baseValue, true)
                         : a.baseValue}
                      </span>
                      <span style={{ color: s.color }}>
                        {a.unit === 'percent'   ? `${a.adjustedValue}%`
                         : a.unit === 'currency' ? formatCurrency(a.adjustedValue, true)
                         : `${a.adjustedValue} HC`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
