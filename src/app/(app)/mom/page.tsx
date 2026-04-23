'use client';

import { getDemoMoM } from '@/lib/data/demo-data';
import { formatCurrency } from '@/lib/utils';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend,
} from 'recharts';

const mom = getDemoMoM();

const CARD_STYLE = {
  background: 'var(--color-surf)',
  borderRadius: 'var(--card-radius)',
  boxShadow: 'var(--card-shadow)',
  border: '1px solid var(--color-border)',
};

const TOOLTIP_STYLE = {
  background: '#1E2236',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: 8,
  color: '#FFFFFF',
  fontSize: 12,
  boxShadow: '0 1px 4px rgba(0,0,0,0.30), 0 4px 16px rgba(0,0,0,0.25)',
};

function Card({ children, className = '', style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`p-5 ${className}`} style={{ ...CARD_STYLE, ...style }}>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="text-[12px] font-bold uppercase tracking-[0.10em] mb-2"
      style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-muted)' }}
    >
      {children}
    </div>
  );
}

function Badge({ children, color, bg }: { children: React.ReactNode; color: string; bg: string }) {
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 text-[13px] font-bold rounded"
      style={{ background: bg, color, fontFamily: 'var(--font-condensed)', letterSpacing: '0.04em' }}
    >
      {children}
    </span>
  );
}

export default function MoMPage() {
  const latest = mom.latestMonth;
  const prior  = mom.priorMonth;

  const pct = (cur: number, pri: number) => ((cur - pri) / pri) * 100;

  const revPct  = pct(latest.revenue,     prior.revenue);
  const niPct   = pct(latest.netIncome,   prior.netIncome);
  const gmDelta = latest.grossMargin - prior.grossMargin;

  const areaData = mom.months.map((m) => ({ month: m.label, Revenue: m.revenue }));
  const trendData = mom.months.map((m) => ({
    month: m.label,
    Revenue: m.revenue,
    'Net Income': m.netIncome,
  }));

  return (
    <div className="flex flex-col gap-5">
      {/* ── HEADER CARD ── */}
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div
              className="text-[32px] font-black uppercase leading-none"
              style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-text)', letterSpacing: '0.04em' }}
            >
              Month-over-Month
            </div>
            <div className="text-[15px] mt-1" style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-condensed)' }}>
              Nov 2025–April 2026
            </div>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <Badge color="var(--color-green)" bg="var(--color-green-d)">
              Apr Revenue {formatCurrency(latest.revenue, true)} ({revPct >= 0 ? '+' : ''}{revPct.toFixed(1)}%)
            </Badge>
            <Badge color="var(--color-red)" bg="var(--color-red-d)">
              Apr NI {formatCurrency(latest.netIncome, true)} ({niPct.toFixed(0)}% MoM)
            </Badge>
            <Badge color="var(--color-blue)" bg="var(--color-blue-d)">
              Gross Margin {latest.grossMargin.toFixed(1)}% ({gmDelta >= 0 ? '+' : ''}{gmDelta.toFixed(1)}pp)
            </Badge>
          </div>
        </div>
      </Card>

      {/* ── 3 KPI CHANGE CARDS ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Revenue MoM */}
        <Card>
          <Label>Revenue MoM</Label>
          <div
            className="text-[40px] font-black leading-none"
            style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-green)' }}
          >
            +{revPct.toFixed(1)}%
          </div>
          <div className="text-[15px] mt-2" style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-condensed)' }}>
            {formatCurrency(latest.revenue, true)} vs {formatCurrency(prior.revenue, true)}
          </div>
          <div className="mt-2">
            <Badge color="var(--color-green)" bg="var(--color-green-d)">
              +{formatCurrency(latest.revenue - prior.revenue, true)} vs Sep
            </Badge>
          </div>
        </Card>

        {/* Net Income MoM */}
        <Card>
          <Label>Net Income MoM</Label>
          <div
            className="text-[40px] font-black leading-none"
            style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-red)' }}
          >
            {niPct.toFixed(0)}%
          </div>
          <div className="text-[15px] mt-2" style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-condensed)' }}>
            {formatCurrency(latest.netIncome, true)} vs {formatCurrency(prior.netIncome, true)}
          </div>
          <div className="mt-2">
            <Badge color="var(--color-red)" bg="var(--color-red-d)">
              Marketing overage $47K
            </Badge>
          </div>
        </Card>

        {/* Gross Margin */}
        <Card>
          <Label>Gross Margin</Label>
          <div
            className="text-[40px] font-black leading-none"
            style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-blue)' }}
          >
            {latest.grossMargin.toFixed(1)}%
          </div>
          <div className="text-[15px] mt-2" style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-condensed)' }}>
            Prior: {prior.grossMargin.toFixed(1)}%
          </div>
          <div className="mt-2">
            <Badge color="var(--color-blue)" bg="var(--color-blue-d)">
              {gmDelta >= 0 ? '+' : ''}{gmDelta.toFixed(1)}pp vs Sep
            </Badge>
          </div>
        </Card>
      </div>

      {/* ── 6-MONTH REVENUE AREA CHART ── */}
      <Card>
        <Label>Revenue — 6-Month Trend (Nov '25–Apr '26)</Label>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={areaData}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#1B4DE6" stopOpacity={0.28} />
                <stop offset="95%" stopColor="#1B4DE6" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-chart-grid)" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: 'var(--color-muted)', fontSize: 12, fontFamily: 'var(--font-condensed)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
              tick={{ fill: 'var(--color-muted)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={54}
            />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              formatter={(val) => [`$${Number(val).toLocaleString()}`, 'Revenue']}
              cursor={{ stroke: 'rgba(27,77,230,0.20)', strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="Revenue"
              stroke="#1B4DE6"
              strokeWidth={2.5}
              fill="url(#revGrad)"
              dot={{ r: 4, fill: '#1B4DE6', strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#1B4DE6', stroke: '#1E2236', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* ── MONTH-BY-MONTH COMPARISON TABLE ── */}
      <Card style={{ padding: 0 }}>
        <div className="px-5 pt-5 pb-3">
          <Label>Month-by-Month Detail</Label>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[680px]">
            <thead>
              <tr style={{ background: 'var(--color-surf2)' }}>
                {['Month', 'Revenue', 'Gross Profit', 'Gross Margin', 'OpEx', 'Net Income'].map((h, i) => (
                  <th
                    key={h}
                    className="px-[14px] py-3 text-[12px] font-bold uppercase tracking-[0.09em] border-b"
                    style={{
                      textAlign: i === 0 ? 'left' : 'right',
                      fontFamily: 'var(--font-condensed)',
                      color: 'var(--color-muted)',
                      borderColor: 'var(--color-border)',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mom.months.map((m, idx) => {
                const isOct = idx === mom.months.length - 1;
                const gmColor = m.grossMargin >= 46.5 ? 'var(--color-green)' : m.grossMargin < 45.5 ? 'var(--color-orange)' : 'var(--color-text)';
                const niColor = m.netIncome < 80000 ? 'var(--color-red)' : m.netIncome >= 100000 ? 'var(--color-green)' : 'var(--color-text)';
                return (
                  <tr
                    key={m.month}
                    style={{
                      borderBottom: '1px solid var(--color-border)',
                      background: isOct ? 'var(--color-blue-d)' : 'transparent',
                    }}
                  >
                    <td
                      className="px-[14px] py-[14px] text-[15px] font-bold"
                      style={{ fontFamily: 'var(--font-condensed)', color: isOct ? 'var(--color-blue)' : 'var(--color-text)' }}
                    >
                      {m.label}
                      {isOct && (
                        <span
                          className="ml-2 text-[10px] px-1.5 py-0.5 rounded font-bold"
                          style={{ background: 'var(--color-blue)', color: '#FFFFFF', verticalAlign: 'middle' }}
                        >
                          LATEST
                        </span>
                      )}
                    </td>
                    <td
                      className="px-[14px] py-[14px] text-[15px] text-right font-bold"
                      style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-text)' }}
                    >
                      {formatCurrency(m.revenue, true)}
                    </td>
                    <td
                      className="px-[14px] py-[14px] text-[15px] text-right font-bold"
                      style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-text)' }}
                    >
                      {formatCurrency(m.grossProfit, true)}
                    </td>
                    <td
                      className="px-[14px] py-[14px] text-[15px] text-right font-bold"
                      style={{ fontFamily: 'var(--font-condensed)', color: gmColor }}
                    >
                      {m.grossMargin.toFixed(1)}%
                    </td>
                    <td
                      className="px-[14px] py-[14px] text-[15px] text-right font-bold"
                      style={{ fontFamily: 'var(--font-condensed)', color: isOct ? 'var(--color-orange)' : 'var(--color-text)' }}
                    >
                      {formatCurrency(m.opex, true)}
                    </td>
                    <td
                      className="px-[14px] py-[14px] text-[15px] text-right font-bold"
                      style={{ fontFamily: 'var(--font-condensed)', color: niColor }}
                    >
                      {formatCurrency(m.netIncome, true)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ── WHAT CHANGED IN OCTOBER ── */}
      <div
        style={{
          ...CARD_STYLE,
          borderLeft: '4px solid var(--color-blue)',
          padding: '20px 24px',
        }}
      >
        <div
          className="text-[12px] font-bold uppercase tracking-[0.10em] mb-3"
          style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-blue)' }}
        >
          What Changed in April
        </div>
        <ul className="flex flex-col gap-2.5" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {[
            'Revenue +3.1% driven by DTC email campaign on Apr 12 — a 14% conversion spike with no discounting required, adding $39.7K above March. Wholesale also contributed via an accelerated Scheels reorder for their Q4 floor reset.',
            'Net Income dropped 34% MoM due entirely to a $47K marketing overage — Altitude Creative ($18K) and WestCoast Influencers ($13K) were not mapped to any approved campaign. Excluding the overage, net income would have been approximately $118K, a new 6-month high.',
            'Gross margin improved 0.4pp from 45.7% to 45.1% (Apr vs Mar blended) from DTC channel mix shift and the ShipBob renegotiation taking effect mid-April at a lower per-unit fulfillment rate. Full ShipBob savings hit in May.',
          ].map((bullet, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span
                className="flex-shrink-0 w-1.5 h-1.5 rounded-full"
                style={{ background: 'var(--color-blue)', marginTop: 7 }}
              />
              <span className="text-[14px] leading-relaxed" style={{ color: 'var(--color-text)' }}>
                {bullet}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
