'use client';

import { getDemoDailyRevenue } from '@/lib/data/demo-data';
import { formatCurrency } from '@/lib/utils';
import {
  ComposedChart, Bar, Line, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts';

const data = getDemoDailyRevenue();

const TOOLTIP_STYLE = {
  background: '#FFFFFF',
  border: '1px solid rgba(0,0,0,0.10)',
  borderRadius: 8,
  color: '#1A1A1A',
  fontSize: 12,
  boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
};

function Card({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={className}
      style={{
        background: 'var(--color-surf)',
        borderRadius: 'var(--card-radius)',
        boxShadow: 'var(--card-shadow)',
        border: '1px solid var(--color-border)',
        padding: '20px 22px',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="uppercase tracking-[0.10em] mb-3"
      style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-muted)', fontSize: 13, fontWeight: 700 }}>
      {children}
    </div>
  );
}

// Aggregate by week for summary
function getWeeklySummary() {
  const weeks: { label: string; total: number; dtc: number; wholesale: number }[] = [];
  for (let w = 0; w < 4; w++) {
    const slice = data.slice(w * 7, (w + 1) * 7);
    const last = data.slice(28);
    const rows = w < 4 ? slice : last;
    weeks.push({
      label: `Wk ${w + 1}`,
      total: rows.reduce((s, r) => s + r.total, 0),
      dtc: rows.reduce((s, r) => s + r.dtc, 0),
      wholesale: rows.reduce((s, r) => s + r.wholesale, 0),
    });
  }
  return weeks;
}

const weeklySummary = getWeeklySummary();
const totalRevenue = data.reduce((s, r) => s + r.total, 0);
const totalDtc = data.reduce((s, r) => s + r.dtc, 0);
const totalWholesale = data.reduce((s, r) => s + r.wholesale, 0);
const totalBudget = data[data.length - 1].runningBudget;
const budgetPace = ((totalRevenue / totalBudget) - 1) * 100;

// Best day
const bestDay = data.reduce((max, r) => (r.total > max.total ? r : max), data[0]);

// Running totals chart (every 3 days for readability)
const runningData = data
  .filter((_, i) => i % 2 === 0 || i === data.length - 1)
  .map((r) => ({
    day: r.dayLabel,
    'Actual': r.runningTotal,
    'Budget Pace': r.runningBudget,
  }));

// Daily stacked bar (every other day for spacing)
const dailyBar = data
  .filter((_, i) => i % 2 === 0 || i === data.length - 1)
  .map((r) => ({
    day: r.dayLabel.replace('Oct ', ''),
    DTC: r.dtc,
    Wholesale: r.wholesale,
    Budget: r.budget,
  }));

export default function DailyRevenuePage() {
  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-2">
        <div>
          <div className="uppercase tracking-[0.04em]"
            style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-text)', fontSize: 32, fontWeight: 900 }}>
            Daily Revenue Report
          </div>
          <div className="text-[12px] mt-0.5" style={{ color: 'var(--color-muted)' }}>
            October 2024 — 31 days closed
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="font-bold uppercase tracking-[0.06em]"
            style={{ background: 'var(--color-green-d)', color: 'var(--color-green)', fontFamily: 'var(--font-condensed)', fontSize: 13, padding: '6px 14px' }}>
            {budgetPace >= 0 ? '+' : ''}{budgetPace.toFixed(1)}% vs Budget Pace
          </div>
          <div className="font-bold uppercase tracking-[0.06em]"
            style={{ background: 'var(--color-blue-d)', color: 'var(--color-blue)', fontFamily: 'var(--font-condensed)', fontSize: 13, padding: '6px 14px' }}>
            {((totalDtc / totalRevenue) * 100).toFixed(0)}% DTC Mix
          </div>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Revenue', value: formatCurrency(totalRevenue, true), sub: `vs ${formatCurrency(totalBudget, true)} budget`, color: 'var(--color-blue)' },
          { label: 'DTC Revenue', value: formatCurrency(totalDtc, true), sub: `${((totalDtc / totalRevenue) * 100).toFixed(0)}% of total`, color: 'var(--color-green)' },
          { label: 'Wholesale Revenue', value: formatCurrency(totalWholesale, true), sub: `${((totalWholesale / totalRevenue) * 100).toFixed(0)}% of total`, color: 'var(--color-text)' },
          { label: 'Best Day', value: bestDay.dayLabel, sub: formatCurrency(bestDay.total) + ' — campaign spike', color: 'var(--color-orange)' },
        ].map((c) => (
          <Card key={c.label} className="relative overflow-hidden" style={{ padding: '20px 22px 18px' }}>
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: c.color,
                opacity: 0.8,
                borderRadius: 'var(--card-radius) var(--card-radius) 0 0',
              }}
            />
            <div className="uppercase tracking-[0.08em] mb-1.5"
              style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-muted)', fontSize: 12, fontWeight: 700 }}>{c.label}</div>
            <div className="leading-none"
              style={{ fontFamily: 'var(--font-condensed)', color: c.color, fontSize: 36, fontWeight: 900 }}>{c.value}</div>
            <div className="mt-1" style={{ color: 'var(--color-muted)', fontSize: 13 }}>{c.sub}</div>
          </Card>
        ))}
      </div>

      {/* Running total vs budget */}
      <Card>
        <SectionTitle>Running Revenue vs Budget Pace — October</SectionTitle>
        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart data={runningData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
            <XAxis dataKey="day" tick={{ fill: '#6B7A8D', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} tick={{ fill: '#6B7A8D', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [`$${Number(v).toLocaleString()}`, '']} />
            <Legend wrapperStyle={{ fontSize: 11, color: '#6B7A8D' }} />
            <Area type="monotone" dataKey="Budget Pace" fill="rgba(136,132,128,0.08)" stroke="rgba(136,132,128,0.4)" strokeDasharray="4 3" strokeWidth={1.5} dot={false} />
            <Line type="monotone" dataKey="Actual" stroke="#1D44BF" strokeWidth={2.5} dot={false} />
            <ReferenceLine x="Oct 12" stroke="#FF6B35" strokeDasharray="3 2" label={{ value: 'Campaign', fill: '#FF6B35', fontSize: 10 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>

      {/* Daily DTC + Wholesale bars */}
      <Card>
        <SectionTitle>Daily DTC vs Wholesale Breakdown</SectionTitle>
        <ResponsiveContainer width="100%" height={200}>
          <ComposedChart data={dailyBar}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
            <XAxis dataKey="day" tick={{ fill: '#6B7A8D', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} tick={{ fill: '#6B7A8D', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [`$${Number(v).toLocaleString()}`, '']} />
            <Legend wrapperStyle={{ fontSize: 11, color: '#6B7A8D' }} />
            <Bar dataKey="DTC" stackId="a" fill="#1D44BF" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Wholesale" stackId="a" fill="#0085CA" radius={[2, 2, 0, 0]} />
            <Line type="monotone" dataKey="Budget" stroke="#FF6B35" strokeWidth={1.5} strokeDasharray="4 3" dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>

      {/* Weekly summary */}
      <Card>
        <SectionTitle>Weekly Summary</SectionTitle>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {['Week', 'Total Revenue', 'DTC', 'Wholesale', 'DTC Mix'].map((h, i) => (
                  <th key={h} className="px-3 font-bold uppercase tracking-[0.08em] border-b"
                    style={{
                      textAlign: i === 0 ? 'left' : 'right',
                      fontFamily: 'var(--font-condensed)',
                      color: 'var(--color-muted)',
                      borderColor: 'var(--color-border)',
                      background: 'var(--color-surf2)',
                      fontSize: 11,
                      paddingTop: 12,
                      paddingBottom: 12,
                    }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weeklySummary.map((w) => (
                <tr key={w.label} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td className="px-3" style={{ fontFamily: 'var(--font-condensed)', fontSize: 14, fontWeight: 700, paddingTop: 12, paddingBottom: 12 }}>{w.label}</td>
                  <td className="px-3 text-right" style={{ fontFamily: 'var(--font-condensed)', fontSize: 14, fontWeight: 700, paddingTop: 12, paddingBottom: 12 }}>{formatCurrency(w.total)}</td>
                  <td className="px-3 text-right" style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-blue)', fontSize: 14, fontWeight: 700, paddingTop: 12, paddingBottom: 12 }}>{formatCurrency(w.dtc)}</td>
                  <td className="px-3 text-right" style={{ fontFamily: 'var(--font-condensed)', fontSize: 14, fontWeight: 700, paddingTop: 12, paddingBottom: 12 }}>{formatCurrency(w.wholesale)}</td>
                  <td className="px-3 text-right" style={{ color: 'var(--color-muted)', fontSize: 14, paddingTop: 12, paddingBottom: 12 }}>
                    {((w.dtc / w.total) * 100).toFixed(0)}%
                  </td>
                </tr>
              ))}
              <tr style={{ borderTop: '2px solid var(--color-border2)', background: 'var(--color-surf2)' }}>
                <td className="px-3" style={{ fontFamily: 'var(--font-condensed)', fontSize: 15, fontWeight: 700, paddingTop: 12, paddingBottom: 12 }}>Total</td>
                <td className="px-3 text-right" style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-blue)', fontSize: 15, fontWeight: 700, paddingTop: 12, paddingBottom: 12 }}>{formatCurrency(totalRevenue)}</td>
                <td className="px-3 text-right" style={{ fontFamily: 'var(--font-condensed)', fontSize: 15, fontWeight: 700, paddingTop: 12, paddingBottom: 12 }}>{formatCurrency(totalDtc)}</td>
                <td className="px-3 text-right" style={{ fontFamily: 'var(--font-condensed)', fontSize: 15, fontWeight: 700, paddingTop: 12, paddingBottom: 12 }}>{formatCurrency(totalWholesale)}</td>
                <td className="px-3 text-right" style={{ color: 'var(--color-muted)', fontSize: 15, paddingTop: 12, paddingBottom: 12 }}>{((totalDtc / totalRevenue) * 100).toFixed(0)}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Key event annotations */}
      <Card>
        <SectionTitle>Key Revenue Events — October</SectionTitle>
        <div className="flex flex-col gap-2">
          {[
            { date: 'Oct 12', icon: '◉', color: 'var(--color-blue)', label: 'Email Campaign Launch', detail: 'Targeted DTC email sent 9am — 14% conversion, no discount. DTC revenue 2.4× daily avg.' },
            { date: 'Oct 22', icon: '◆', color: 'var(--color-orange)', label: 'Scheels Wholesale PO', detail: 'Q4 floor reset pull-forward order: $131K in a single day. Creates November reorder risk.' },
            { date: 'Oct 15', icon: '◈', color: 'var(--color-green)', label: 'ShipBob Contract Live', detail: 'New 3PL rates effective — saving $14K/mo vs prior carrier. Full benefit hits November.' },
          ].map((e) => (
            <div key={e.date} className="flex gap-3 items-start"
              style={{ padding: '14px 16px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-surf2)' }}>
              <span style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-muted)', fontSize: 13, fontWeight: 700, width: 44, flexShrink: 0, marginTop: 2 }}>{e.date}</span>
              <span style={{ color: e.color, fontSize: 13, flexShrink: 0 }}>{e.icon}</span>
              <div>
                <div className="mb-0.5" style={{ color: e.color, fontFamily: 'var(--font-condensed)', fontSize: 14, fontWeight: 700 }}>{e.label}</div>
                <div style={{ color: 'var(--color-muted)', fontSize: 13 }}>{e.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
