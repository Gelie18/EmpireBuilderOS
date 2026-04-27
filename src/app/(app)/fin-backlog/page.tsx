'use client';

import { useState } from 'react';
import {
  ComposedChart, Bar, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

// ── Design tokens ────────────────────────────────────────────────────────────
const CARD: React.CSSProperties = {
  background: 'var(--color-surf)',
  borderRadius: 'var(--card-radius)',
  boxShadow: 'var(--card-shadow)',
  border: '1px solid var(--color-border)',
};
const TT: React.CSSProperties = {
  background: '#1E2236',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: 8,
  color: '#FFFFFF',
  fontSize: 12,
  boxShadow: '0 1px 4px rgba(0,0,0,0.30), 0 4px 16px rgba(0,0,0,0.25)',
};

// ── KPI Data ─────────────────────────────────────────────────────────────────
const KPIS = [
  { label: 'Total Backlog',     value: '$2.84M', sub: 'Contracted, unrecognized',    color: '#1D44BF' },
  { label: 'WIP Value',         value: '$847K',  sub: 'In-progress work incurred',   color: '#D97706' },
  { label: 'Unbilled Revenue',  value: '$412K',  sub: 'Earned but not invoiced',     color: '#7C3AED' },
  { label: 'Avg Days to Bill',  value: '18 days',sub: 'Invoice cycle time',          color: '#0A8A5C' },
];

// ── Backlog Burn Timeline ────────────────────────────────────────────────────
const BURN_DATA = [
  { month: "Apr '26", backlog: 2_840_000, revenue: 420_000 },
  { month: "May '26", backlog: 2_420_000, revenue: 485_000 },
  { month: "Jun '26", backlog: 1_935_000, revenue: 510_000 },
  { month: "Jul '26", backlog: 1_425_000, revenue: 380_000 },
  { month: "Aug '26", backlog: 1_045_000, revenue: 320_000 },
  { month: "Sep '26", backlog:   725_000, revenue: 290_000 },
];

// ── WIP Items ────────────────────────────────────────────────────────────────
const WIP_ITEMS = [
  { id: 'WIP-001', customer: 'Mercer Mfg',      contract: 380_000, wip: 214_000, pct: 56, days: 32, bottleneck: 'Awaiting inspection', status: 'At Risk'  },
  { id: 'WIP-002', customer: 'Hawthorne Steel',  contract: 275_000, wip: 189_000, pct: 69, days: 18, bottleneck: 'On track',            status: 'On Track' },
  { id: 'WIP-003', customer: 'Bellco Systems',   contract: 490_000, wip: 127_000, pct: 26, days:  8, bottleneck: 'Material delay',      status: 'Blocked'  },
  { id: 'WIP-004', customer: 'Titan Energy',     contract: 620_000, wip:  98_000, pct: 16, days: 44, bottleneck: 'Scope change order',  status: 'Blocked'  },
  { id: 'WIP-005', customer: 'Ridge Partners',   contract: 185_000, wip: 145_000, pct: 78, days: 12, bottleneck: 'Final sign-off',      status: 'On Track' },
  { id: 'WIP-006', customer: 'Coastal Dist.',    contract: 198_000, wip:  74_000, pct: 37, days: 21, bottleneck: 'On track',            status: 'At Risk'  },
];

// ── Unbilled Aging ───────────────────────────────────────────────────────────
const UNBILLED = [
  { bucket: '0–14 days',  amount: 148_000, label: 'Normal',   color: '#0A8A5C', bg: 'rgba(10,138,92,0.08)'  },
  { bucket: '15–30 days', amount: 164_000, label: 'Monitor',  color: '#D97706', bg: 'rgba(217,119,6,0.08)'  },
  { bucket: '31–60 days', amount:  78_000, label: '⚠ Action', color: '#C13333', bg: 'rgba(193,51,51,0.08)'  },
  { bucket: '60+ days',   amount:  22_000, label: 'Urgent',   color: '#991B1B', bg: 'rgba(153,27,27,0.10)'  },
];

// ── Bottleneck data ───────────────────────────────────────────────────────────
const BOTTLENECKS = [
  { cause: 'Material/Supply delays',    contracts: 1, impacted: 490_000, status: 'blocked'  },
  { cause: 'Scope change orders',       contracts: 1, impacted: 620_000, status: 'blocked'  },
  { cause: 'Awaiting client approval',  contracts: 1, impacted: 380_000, status: 'at-risk'  },
  { cause: 'On track',                  contracts: 3, impacted: 658_000, status: 'on-track' },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
function fmtK(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}
function fmtFull(n: number) {
  return '$' + n.toLocaleString('en-US');
}

// ── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    'Blocked':  { bg: 'rgba(193,51,51,0.10)',  color: '#C13333' },
    'At Risk':  { bg: 'rgba(217,119,6,0.10)',  color: '#D97706' },
    'On Track': { bg: 'rgba(10,138,92,0.10)',  color: '#0A8A5C' },
  };
  const s = map[status] ?? { bg: 'rgba(255,255,255,0.06)', color: 'var(--color-chart-text)' };
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: 4,
      background: s.bg,
      color: s.color,
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.04em',
    }}>
      {status}
    </span>
  );
}

// ── Custom tooltip ────────────────────────────────────────────────────────────
function BurnTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={TT}>
      <div style={{ fontWeight: 700, marginBottom: 6, fontFamily: 'var(--font-condensed)' }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} style={{ color: p.color, marginBottom: 2 }}>
          {p.name}: {fmtK(p.value)}
        </div>
      ))}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function FinBacklogPage() {
  const [expandAI, setExpandAI] = useState(false);

  return (
    <div className="flex flex-col gap-5">

      {/* ── 1. Header ─────────────────────────────────────────────────────── */}
      <div style={{ ...CARD, padding: '20px 24px' }}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div style={{
              fontFamily: 'var(--font-condensed)',
              fontSize: 30,
              fontWeight: 900,
              letterSpacing: '0.03em',
              color: 'var(--color-text)',
              lineHeight: 1,
              textTransform: 'uppercase',
            }}>
              Financial Backlog
            </div>
            <div style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 5 }}>
              Contracted revenue not yet recognized · April 2026
            </div>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(27,77,230,0.08)', border: '1px solid rgba(27,77,230,0.25)',
              borderRadius: 8, padding: '6px 14px',
              fontFamily: 'var(--font-condensed)', fontSize: 13, fontWeight: 700,
              color: '#1D44BF', letterSpacing: '0.04em',
            }}>
              <span style={{ fontWeight: 400, color: 'var(--color-muted)', fontSize: 11 }}>BACKLOG</span>
              $2.84M
            </span>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(217,119,6,0.08)', border: '1px solid rgba(217,119,6,0.25)',
              borderRadius: 8, padding: '6px 14px',
              fontFamily: 'var(--font-condensed)', fontSize: 13, fontWeight: 700,
              color: '#D97706', letterSpacing: '0.04em',
            }}>
              <span style={{ fontWeight: 400, color: 'var(--color-muted)', fontSize: 11 }}>WIP</span>
              $847K
            </span>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(193,51,51,0.08)', border: '1px solid rgba(193,51,51,0.25)',
              borderRadius: 8, padding: '6px 14px',
              fontFamily: 'var(--font-condensed)', fontSize: 13, fontWeight: 700,
              color: '#C13333', letterSpacing: '0.04em',
            }}>
              <span style={{ fontWeight: 400, color: 'var(--color-muted)', fontSize: 11 }}>BLOCKED</span>
              $1.11M
            </span>
          </div>
        </div>
      </div>

      {/* ── 2. KPI Strip ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {KPIS.map((kpi) => (
          <div key={kpi.label} style={{ ...CARD, padding: '18px 20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '0.09em',
                textTransform: 'uppercase', fontFamily: 'var(--font-condensed)',
                color: 'var(--color-muted)', marginBottom: 8,
              }}>
                {kpi.label}
              </div>
              <div style={{
                fontFamily: 'var(--font-condensed)', fontSize: 32, fontWeight: 900,
                color: 'var(--color-text)', lineHeight: 1, letterSpacing: '-0.01em',
              }}>
                {kpi.value}
              </div>
              <div style={{ fontSize: 12, color: kpi.color, marginTop: 6, fontWeight: 500 }}>
                {kpi.sub}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── 3. Backlog Burn Timeline ──────────────────────────────────────── */}
      <div style={{ ...CARD, padding: '20px 24px' }}>
        <div style={{
          fontFamily: 'var(--font-condensed)', fontSize: 13, fontWeight: 700,
          letterSpacing: '0.07em', textTransform: 'uppercase',
          color: 'var(--color-text)', marginBottom: 16,
        }}>
          Backlog Burn Timeline
        </div>
        <ResponsiveContainer width="100%" height={340}>
          <ComposedChart data={BURN_DATA} margin={{ top: 4, right: 16, left: 4, bottom: 0 }}>
            <CartesianGrid stroke="var(--color-chart-grid)" strokeDasharray="4 4" />
            <XAxis
              dataKey="month"
              tick={{ fill: 'var(--color-muted)', fontSize: 11, fontFamily: 'var(--font-condensed)' }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              yAxisId="left"
              tick={{ fill: 'var(--color-muted)', fontSize: 11, fontFamily: 'var(--font-condensed)' }}
              axisLine={false} tickLine={false} width={60}
              tickFormatter={(v) => fmtK(v)}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: 'var(--color-muted)', fontSize: 11, fontFamily: 'var(--font-condensed)' }}
              axisLine={false} tickLine={false} width={60}
              tickFormatter={(v) => fmtK(v)}
            />
            <Tooltip content={<BurnTooltip />} />
            <Legend
              iconType="circle" iconSize={8}
              wrapperStyle={{ fontSize: 11, fontFamily: 'var(--font-condensed)', paddingTop: 8 }}
            />
            <Bar
              yAxisId="left"
              dataKey="revenue"
              name="Expected Revenue"
              fill="#1D44BF"
              opacity={0.85}
              radius={[3, 3, 0, 0]}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="backlog"
              name="Remaining Backlog"
              stroke="#E8B84B"
              strokeWidth={2.5}
              dot={{ r: 4, fill: '#E8B84B', strokeWidth: 0 }}
            />
          </ComposedChart>
        </ResponsiveContainer>

        {/* Summary table below chart */}
        <div style={{ overflowX: 'auto', marginTop: 16 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                {['Month', 'Backlog ($)', 'Expected Revenue', 'Burn Rate'].map((h) => (
                  <th key={h} style={{
                    padding: '8px 12px', textAlign: h === 'Month' ? 'left' : 'right',
                    fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                    fontFamily: 'var(--font-condensed)', color: 'var(--color-muted)',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BURN_DATA.map((row, i) => {
                const burnRate = ((row.revenue / row.backlog) * 100).toFixed(1);
                return (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '9px 12px', fontWeight: 600, color: 'var(--color-text)' }}>{row.month}</td>
                    <td style={{ padding: '9px 12px', textAlign: 'right', fontFamily: 'var(--font-condensed)', color: '#1D44BF', fontWeight: 600 }}>{fmtK(row.backlog)}</td>
                    <td style={{ padding: '9px 12px', textAlign: 'right', fontFamily: 'var(--font-condensed)', color: '#0A8A5C', fontWeight: 600 }}>{fmtK(row.revenue)}</td>
                    <td style={{ padding: '9px 12px', textAlign: 'right', fontFamily: 'var(--font-condensed)', color: 'var(--color-muted)', fontWeight: 500 }}>{burnRate}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 4. WIP Items Table ────────────────────────────────────────────── */}
      <div style={{ ...CARD, padding: 0, overflow: 'hidden' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 20px', borderBottom: '1px solid var(--color-border)',
          background: 'var(--color-surf2)',
        }}>
          <span style={{
            fontFamily: 'var(--font-condensed)', fontSize: 13, fontWeight: 700,
            letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--color-text)',
          }}>
            WIP Contract Items
          </span>
          <span style={{ fontSize: 11, color: 'var(--color-muted)', fontWeight: 500 }}>
            6 active contracts · {fmtK(WIP_ITEMS.reduce((s, r) => s + r.wip, 0))} total WIP
          </span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 700 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                {['ID', 'Customer', 'Contract', 'WIP $', '% Done', 'Days in WIP', 'Bottleneck', 'Status'].map((h) => (
                  <th key={h} style={{
                    padding: '10px 14px',
                    textAlign: ['Contract', 'WIP $', '% Done', 'Days in WIP'].includes(h) ? 'right' : 'left',
                    fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                    fontFamily: 'var(--font-condensed)', color: 'var(--color-muted)',
                    background: 'var(--color-surf2)',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {WIP_ITEMS.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '10px 14px', fontFamily: 'var(--font-condensed)', fontWeight: 700, color: '#1D44BF', fontSize: 12 }}>
                    {item.id}
                  </td>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: 'var(--color-text)' }}>
                    {item.customer}
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', fontFamily: 'var(--font-condensed)', color: 'var(--color-text)', fontWeight: 500 }}>
                    {fmtFull(item.contract)}
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', fontFamily: 'var(--font-condensed)', color: '#D97706', fontWeight: 600 }}>
                    {fmtK(item.wip)}
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                      <div style={{ width: 50, height: 5, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${item.pct}%`, height: '100%', background: item.pct >= 70 ? '#0A8A5C' : item.pct >= 40 ? '#D97706' : '#C13333', borderRadius: 3 }} />
                      </div>
                      <span style={{ fontFamily: 'var(--font-condensed)', fontWeight: 600, fontSize: 12 }}>{item.pct}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', fontFamily: 'var(--font-condensed)', fontWeight: 600 }}>
                    <span style={{ color: item.days > 30 ? '#C13333' : 'var(--color-text)' }}>
                      {item.days > 30 && '⚠ '}{item.days}d
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px', color: 'var(--color-muted)', fontSize: 12 }}>
                    {item.bottleneck}
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <StatusBadge status={item.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 5. Unbilled Revenue Aging + Bottleneck Analysis (2 cols) ─────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Unbilled Aging */}
        <div style={{ ...CARD, padding: '20px 24px' }}>
          <div style={{
            fontFamily: 'var(--font-condensed)', fontSize: 13, fontWeight: 700,
            letterSpacing: '0.07em', textTransform: 'uppercase',
            color: 'var(--color-text)', marginBottom: 16,
          }}>
            Unbilled Revenue Aging
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {UNBILLED.map((u) => (
              <div key={u.bucket} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 16px',
                background: u.bg,
                borderRadius: 8,
                border: `1px solid ${u.color}22`,
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>{u.bucket}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: u.color, marginTop: 2 }}>{u.label}</div>
                </div>
                <div style={{ fontFamily: 'var(--font-condensed)', fontSize: 22, fontWeight: 800, color: u.color }}>
                  {fmtK(u.amount)}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, fontSize: 12, color: 'var(--color-muted)', textAlign: 'right' }}>
            Total unbilled: <strong style={{ color: 'var(--color-text)' }}>{fmtK(UNBILLED.reduce((s, u) => s + u.amount, 0))}</strong>
          </div>
        </div>

        {/* Bottleneck Analysis */}
        <div style={{ ...CARD, padding: '20px 24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{
            fontFamily: 'var(--font-condensed)', fontSize: 13, fontWeight: 700,
            letterSpacing: '0.07em', textTransform: 'uppercase',
            color: 'var(--color-text)', marginBottom: 16,
          }}>
            Bottleneck Analysis
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
            {BOTTLENECKS.map((b) => {
              const colorMap: Record<string, string> = {
                'blocked': '#C13333',
                'at-risk': '#D97706',
                'on-track': '#0A8A5C',
              };
              const color = colorMap[b.status];
              return (
                <div key={b.cause} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '11px 14px',
                  borderRadius: 8,
                  background: b.status === 'on-track' ? 'rgba(10,138,92,0.05)' : b.status === 'blocked' ? 'rgba(193,51,51,0.05)' : 'rgba(217,119,6,0.05)',
                  border: `1px solid ${color}20`,
                }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>{b.cause}</div>
                    <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 2 }}>
                      {b.contracts} contract{b.contracts !== 1 ? 's' : ''} · {fmtK(b.impacted)} impacted
                    </div>
                  </div>
                  <div style={{ fontFamily: 'var(--font-condensed)', fontSize: 18, fontWeight: 800, color }}>
                    {fmtK(b.impacted)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Insight */}
          <div
            onClick={() => setExpandAI((v) => !v)}
            style={{
              marginTop: 16,
              padding: '12px 16px',
              background: 'rgba(27,77,230,0.05)',
              borderLeft: '3px solid #1D44BF',
              borderRadius: '0 6px 6px 0',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: expandAI ? 8 : 0 }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#1D44BF' }}>
                AI CFO Insight
              </span>
              <span style={{ fontSize: 10, color: '#1D44BF', transform: expandAI ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.15s', display: 'inline-block' }}>▸</span>
            </div>
            {expandAI && (
              <div style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--color-chart-text)' }}>
                <strong>$1.49M</strong> (52% of WIP) is blocked or at risk. Titan Energy ($620K, scope CO) and Bellco Systems ($490K, material delay) are the highest-priority escalations. Resolving these two alone would accelerate <strong>$810K</strong> in billing recognition.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── 6. AR & AP Aging Report ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AgingCard
          title="Accounts Receivable Aging"
          subtitle="Money owed to us"
          rows={AR_AGING}
          accent="#2DB47A"
          type="ar"
        />
        <AgingCard
          title="Accounts Payable Aging"
          subtitle="Money we owe vendors"
          rows={AP_AGING}
          accent="#E06060"
          type="ap"
        />
      </div>

      {/* ── 7. Top aged receivables (action queue) ─────────────────────────── */}
      <div style={{ ...CARD, padding: 0, overflow: 'hidden' }}>
        <div style={{
          padding: '14px 20px', borderBottom: '1px solid var(--color-border)',
          background: 'var(--color-surf2)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--color-text)' }}>
            Top Overdue Receivables — Action Queue
          </span>
          <span style={{ fontSize: 11, color: '#E06060', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            ⚠ {TOP_OVERDUE_AR.length} accounts &gt; 30d
          </span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
            <thead>
              <tr style={{ background: 'var(--color-surf2)' }}>
                {['Customer', 'Subco', 'Invoice #', 'Amount', 'Days Outstanding', 'Last Contact', 'Action'].map((h, i) => (
                  <th key={h} style={{
                    padding: '11px 16px', textAlign: i === 3 || i === 4 ? 'right' : 'left',
                    fontSize: 10, fontWeight: 800, letterSpacing: '0.09em',
                    textTransform: 'uppercase', color: 'var(--color-muted)',
                    borderBottom: '1px solid var(--color-border)',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TOP_OVERDUE_AR.map((r, i) => {
                const agingColor = r.days >= 90 ? '#C13333' : r.days >= 60 ? '#E06060' : r.days >= 30 ? '#F7A500' : '#8E9BB8';
                return (
                  <tr key={r.invoice} style={{
                    borderTop: i === 0 ? 'none' : '1px solid var(--color-divider)',
                  }}>
                    <td style={{ padding: '12px 16px', fontSize: 14, color: 'var(--color-text)', fontWeight: 600 }}>{r.customer}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--color-muted)' }}>{r.subco}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, fontFamily: 'ui-monospace,monospace', color: 'var(--color-muted)' }}>{r.invoice}</td>
                    <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 800, color: 'var(--color-text)', textAlign: 'right' }}>${r.amount.toLocaleString()}</td>
                    <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 800, color: agingColor, textAlign: 'right' }}>{r.days}d</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--color-muted)' }}>{r.lastContact}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase',
                        background: `${agingColor}18`, color: agingColor, border: `1px solid ${agingColor}50`,
                        borderRadius: 5, padding: '3px 9px',
                      }}>
                        {r.action}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 8. Top AP — near-due payables ──────────────────────────────────── */}
      <div style={{ ...CARD, padding: 0, overflow: 'hidden' }}>
        <div style={{
          padding: '14px 20px', borderBottom: '1px solid var(--color-border)',
          background: 'var(--color-surf2)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--color-text)' }}>
            Payables — Next 30 Days
          </span>
          <span style={{ fontSize: 11, color: 'var(--color-muted)', fontWeight: 700 }}>
            Total due: <strong style={{ color: 'var(--color-text)' }}>${TOP_AP.reduce((s, p) => s + p.amount, 0).toLocaleString()}</strong>
          </span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
            <thead>
              <tr style={{ background: 'var(--color-surf2)' }}>
                {['Vendor', 'Subco', 'Bill #', 'Amount', 'Due In', 'Terms', 'Priority'].map((h, i) => (
                  <th key={h} style={{
                    padding: '11px 16px', textAlign: i === 3 || i === 4 ? 'right' : 'left',
                    fontSize: 10, fontWeight: 800, letterSpacing: '0.09em',
                    textTransform: 'uppercase', color: 'var(--color-muted)',
                    borderBottom: '1px solid var(--color-border)',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TOP_AP.map((p, i) => {
                const dueColor = p.dueInDays <= 3 ? '#C13333' : p.dueInDays <= 10 ? '#F7A500' : '#2DB47A';
                const pColor = p.priority === 'Critical' ? '#C13333' : p.priority === 'High' ? '#F7A500' : '#8E9BB8';
                return (
                  <tr key={p.bill} style={{ borderTop: i === 0 ? 'none' : '1px solid var(--color-divider)' }}>
                    <td style={{ padding: '12px 16px', fontSize: 14, color: 'var(--color-text)', fontWeight: 600 }}>{p.vendor}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--color-muted)' }}>{p.subco}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, fontFamily: 'ui-monospace,monospace', color: 'var(--color-muted)' }}>{p.bill}</td>
                    <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 800, color: 'var(--color-text)', textAlign: 'right' }}>${p.amount.toLocaleString()}</td>
                    <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 800, color: dueColor, textAlign: 'right' }}>
                      {p.dueInDays === 0 ? 'Today' : `${p.dueInDays}d`}
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--color-muted)' }}>{p.terms}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase',
                        background: `${pColor}18`, color: pColor, border: `1px solid ${pColor}50`,
                        borderRadius: 5, padding: '3px 9px',
                      }}>
                        {p.priority}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

// ── AR & AP Aging data + helper ─────────────────────────────────────────────
const AR_AGING = [
  { bucket: 'Current (0–30)',  days: 0,  amount: 612_000, pct: 61, tone: 'good' as const },
  { bucket: '31–60 days',      days: 31, amount: 182_000, pct: 18, tone: 'warn' as const },
  { bucket: '61–90 days',      days: 61, amount:  84_000, pct:  8, tone: 'bad' as const  },
  { bucket: '> 90 days',       days: 91, amount:  56_000, pct:  6, tone: 'bad' as const  },
  { bucket: 'Disputed / Hold', days: 0,  amount:  66_000, pct:  7, tone: 'warn' as const },
];

const AP_AGING = [
  { bucket: 'Not yet due',     days: 0,  amount: 268_000, pct: 65, tone: 'good' as const },
  { bucket: '1–15 days due',   days: 1,  amount:  82_000, pct: 20, tone: 'warn' as const },
  { bucket: '16–30 days due',  days: 16, amount:  42_000, pct: 10, tone: 'warn' as const },
  { bucket: 'Past due',        days: 31, amount:  20_000, pct:  5, tone: 'bad' as const  },
];

const TOP_OVERDUE_AR = [
  { customer: 'Hilltop Gift Co',    subco: 'DDW',  invoice: 'INV-4821', amount: 14_600, days: 68, lastContact: 'Apr 12 · email', action: 'Credit Hold' },
  { customer: 'North Shore Novelty',subco: 'DDW',  invoice: 'INV-4792', amount:  8_200, days: 62, lastContact: 'Apr 15 · call',  action: 'Escalate'    },
  { customer: 'Berry Street Gifts', subco: 'DDW',  invoice: 'INV-4766', amount:  6_400, days: 61, lastContact: 'Apr 10 · email', action: 'Escalate'    },
  { customer: 'Metro Sports Co-op', subco: 'SSK',  invoice: 'INV-5118', amount: 28_400, days: 47, lastContact: 'Apr 18 · call',  action: '2nd Notice'  },
  { customer: 'Field & Glove Pro',  subco: 'BGL',  invoice: 'INV-5201', amount: 11_800, days: 42, lastContact: 'Apr 14 · email', action: '2nd Notice'  },
  { customer: 'Western Team Sports',subco: 'SSK',  invoice: 'INV-5089', amount: 18_200, days: 38, lastContact: 'Apr 19 · call',  action: '1st Reminder'},
  { customer: 'Cleat Market Inc',   subco: 'AAS',  invoice: 'INV-5240', amount:  9_600, days: 33, lastContact: 'Apr 20 · email', action: '1st Reminder'},
];

const TOP_AP = [
  { vendor: 'SSK Japan',             subco: 'SSK',  bill: 'SSK-2026-04-12', amount: 186_000, dueInDays:  3, terms: 'Net 30',  priority: 'Critical' as const },
  { vendor: 'BGL Leather Supply',    subco: 'BGL',  bill: 'BLS-1842',       amount:  42_400, dueInDays:  7, terms: 'Net 30',  priority: 'High'     as const },
  { vendor: 'Amazon FBA Fees',       subco: 'BL',   bill: 'AMZN-APR',       amount:  38_600, dueInDays:  0, terms: 'Auto-pay',priority: 'Critical' as const },
  { vendor: 'Louisville Mfg (AAS)',  subco: 'AAS',  bill: 'LVM-804',        amount:  28_000, dueInDays: 12, terms: 'Net 30',  priority: 'High'     as const },
  { vendor: 'Shopify Plus',          subco: 'BL',   bill: 'SHOP-APR',       amount:   9_200, dueInDays:  5, terms: 'Monthly', priority: 'High'     as const },
  { vendor: 'QuickBooks Enterprise', subco: 'BL',   bill: 'QB-2026-05',     amount:   1_840, dueInDays: 18, terms: 'Annual',  priority: 'Low'      as const },
  { vendor: 'Print Fulfillment Svc', subco: 'Shug0',bill: 'PFS-412',        amount:   6_800, dueInDays: 14, terms: 'Net 15',  priority: 'Medium'   as const },
  { vendor: 'Gift Box Co-pack',      subco: 'DDW',  bill: 'GBC-294',        amount:  11_400, dueInDays: 22, terms: 'Net 30',  priority: 'Medium'   as const },
];

function AgingCard({ title, subtitle, rows, accent, type }: {
  title: string; subtitle: string;
  rows: Array<{ bucket: string; amount: number; pct: number; tone: 'good' | 'warn' | 'bad' }>;
  accent: string;
  type: 'ar' | 'ap';
}) {
  const toneColor = { good: '#2DB47A', warn: '#F7A500', bad: '#E06060' };
  const total = rows.reduce((s, r) => s + r.amount, 0);
  const overdue = rows.filter((r) => r.tone === 'bad').reduce((s, r) => s + r.amount, 0);
  const overduePct = total > 0 ? (overdue / total) * 100 : 0;

  return (
    <div style={{ ...CARD, padding: 0, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px', borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-surf2)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--color-text)' }}>
            {title}
          </div>
          <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 3 }}>{subtitle}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 20, fontWeight: 900, color: accent, lineHeight: 1 }}>
            ${(total / 1000).toFixed(0)}K
          </div>
          <div style={{ fontSize: 10, color: overduePct > 10 ? '#E06060' : 'var(--color-muted)', marginTop: 4, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {type === 'ar' ? `${overduePct.toFixed(0)}% aged >60d` : `${overduePct.toFixed(0)}% past due`}
          </div>
        </div>
      </div>

      {/* Rows */}
      <div style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {rows.map((r) => {
          const c = toneColor[r.tone];
          return (
            <div key={r.bucket} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />
                  <span style={{ fontSize: 13, color: 'var(--color-text)', fontWeight: 600 }}>{r.bucket}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 12, color: 'var(--color-muted)', fontWeight: 600, minWidth: 36, textAlign: 'right' }}>
                    {r.pct}%
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: c, minWidth: 64, textAlign: 'right' }}>
                    ${(r.amount / 1000).toFixed(0)}K
                  </span>
                </div>
              </div>
              {/* Progress bar */}
              <div style={{ height: 4, background: 'var(--color-surf2)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${Math.min(100, r.pct * 2)}%`, background: c, borderRadius: 3 }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
