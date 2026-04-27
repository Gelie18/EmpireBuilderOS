'use client';

import Link from 'next/link';
import {
  INVENTORY_SKUS,
  INVENTORY_LOCATIONS,
  getInventoryRollup,
  getInventoryTrend,
  getReorderSuggestions,
  DEADSTOCK_ITEMS,
  type StockStatus,
} from '@/lib/data/inventory';
import {
  ComposedChart, Area, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const rollup = getInventoryRollup();
const trend = getInventoryTrend();
const reorders = getReorderSuggestions();

const TOOLTIP_STYLE = {
  background: '#1E2236',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: 8,
  color: '#FFFFFF',
  fontSize: 12,
  boxShadow: '0 1px 4px rgba(0,0,0,0.30), 0 4px 16px rgba(0,0,0,0.25)',
};

function fmt$(n: number, compact = false): string {
  if (compact) {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
    if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  }
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
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

function SectionTitle({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="uppercase tracking-[0.10em]"
        style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-muted)', fontSize: 13, fontWeight: 700 }}>
        {children}
      </div>
      {right}
    </div>
  );
}

const STATUS_COLORS: Record<StockStatus, { bg: string; fg: string; label: string }> = {
  healthy:   { bg: 'rgba(45,180,122,0.18)',  fg: '#2DB47A', label: 'Healthy'   },
  low:       { bg: 'rgba(245,138,31,0.20)',  fg: '#D97706', label: 'Low'       },
  stockout:  { bg: 'rgba(27,77,230,0.20)',   fg: '#1D44BF', label: 'Stockout'  },
  overstock: { bg: 'rgba(136,132,128,0.20)', fg: '#8B5CF6', label: 'Overstock' },
  deadstock: { bg: 'rgba(136,132,128,0.20)', fg: '#6B7280', label: 'Deadstock' },
};

function StatusPill({ status }: { status: StockStatus }) {
  const s = STATUS_COLORS[status];
  return (
    <span style={{
      display: 'inline-block',
      background: s.bg, color: s.fg,
      fontFamily: 'var(--font-condensed)', fontSize: 10, fontWeight: 800,
      letterSpacing: '0.08em', textTransform: 'uppercase',
      padding: '3px 8px', borderRadius: 4,
    }}>{s.label}</span>
  );
}

export default function InventoryDashboardPage() {
  const sortedBySales = [...INVENTORY_SKUS].sort((a, b) => b.avgDailySales - a.avgDailySales);

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-2">
        <div>
          <div className="uppercase tracking-[0.04em]"
            style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-text)', fontSize: 32, fontWeight: 900 }}>
            Inventory Command
          </div>
          <div className="text-[12px] mt-0.5" style={{ color: 'var(--color-muted)' }}>
            Wednesday, April 22, 2026 · 3 locations · 8 active SKUs
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link href="/ops/inventory/reorder" className="no-underline">
            <div className="font-bold uppercase tracking-[0.06em]"
              style={{ background: 'var(--color-blue-d)', color: 'var(--color-blue)', fontFamily: 'var(--font-condensed)', fontSize: 13, padding: '6px 14px', borderRadius: 4 }}>
              Reorder queue · {reorders.length}
            </div>
          </Link>
          {rollup.stockouts > 0 && (
            <div className="font-bold uppercase tracking-[0.06em]"
              style={{ background: 'rgba(27,77,230,0.18)', color: '#1D44BF', fontFamily: 'var(--font-condensed)', fontSize: 13, padding: '6px 14px', borderRadius: 4 }}>
              {rollup.stockouts} stockout{rollup.stockouts !== 1 ? 's' : ''}
            </div>
          )}
          {rollup.latePOs > 0 && (
            <div className="font-bold uppercase tracking-[0.06em]"
              style={{ background: 'rgba(245,138,31,0.20)', color: '#D97706', fontFamily: 'var(--font-condensed)', fontSize: 13, padding: '6px 14px', borderRadius: 4 }}>
              {rollup.latePOs} late PO
            </div>
          )}
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Inventory on hand',  value: fmt$(rollup.totalOnHandValue, true), sub: `${rollup.totalUnits.toLocaleString()} units across ${INVENTORY_LOCATIONS.length} locations`, color: 'var(--color-blue)' },
          { label: 'Weighted days cover', value: `${rollup.weightedDoC.toFixed(0)} days`, sub: `Avg lead time 33d · ${rollup.lowStock} at or below ROP`, color: 'var(--color-green)' },
          { label: 'Deadstock exposure', value: fmt$(rollup.deadstockValue, true), sub: `${rollup.deadstock} SKUs flagged · markdown in flight`, color: 'var(--color-orange)' },
          { label: 'Open PO commitments', value: fmt$(rollup.openPoValue, true), sub: `${rollup.latePOs} late · receipts due this week`, color: 'var(--color-text)' },
        ].map((c) => (
          <Card key={c.label} style={{ position: 'relative', overflow: 'hidden', padding: '20px 22px 18px' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: c.color, opacity: 0.85, borderRadius: 'var(--card-radius) var(--card-radius) 0 0' }} />
            <div className="uppercase tracking-[0.08em] mb-1.5"
              style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-muted)', fontSize: 12, fontWeight: 700 }}>{c.label}</div>
            <div className="leading-none"
              style={{ fontFamily: 'var(--font-condensed)', color: c.color, fontSize: 32, fontWeight: 900 }}>{c.value}</div>
            <div className="mt-1" style={{ color: 'var(--color-muted)', fontSize: 13 }}>{c.sub}</div>
          </Card>
        ))}
      </div>

      {/* Alerts row */}
      <Card>
        <SectionTitle right={
          <Link href="/ops/inventory/reorder" className="no-underline"
            style={{ color: 'var(--color-blue)', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em' }}>
            Open reorder planner →
          </Link>
        }>
          What needs action today
        </SectionTitle>
        <div className="flex flex-col gap-2">
          {[
            { tone: 'critical', title: 'SSK-Z7-NVY-L — stocked out 68 days', body: 'PO-2043 (800 units) still in transit; port delay LA/LB. Est. lost sales $58K MTD. Consider air freight top-up or temporary substitution.', href: '/ops/inventory/sku' },
            { tone: 'critical', title: 'SSK-Z7-BLK-M — 8.7 days cover vs 42-day lead time', body: 'Available 18 units after allocations. PO-2042 (600 units) arriving Apr 23; expedite if any slippage.', href: '/ops/inventory/sku' },
            { tone: 'warn',     title: 'SHUG-SOCK-3PK — 130 days cover; deadstock risk', body: 'Suggested 25% markdown frees $38.6K of working capital. Hold new PO until depletion.', href: '/ops/inventory/deadstock' },
            { tone: 'warn',     title: 'SSK-RAIN-GRN-L — $2.6K write-down if unsold by Q3', body: 'Recommend seasonal clearance bundle with hoodies in May email.', href: '/ops/inventory/deadstock' },
          ].map((a) => {
            const tone = a.tone === 'critical'
              ? { bar: '#1D44BF', bg: 'rgba(27,77,230,0.08)', tag: 'CRITICAL', tagBg: 'rgba(27,77,230,0.18)', tagFg: '#1D44BF' }
              : { bar: '#D97706', bg: 'rgba(245,138,31,0.08)', tag: 'WATCH',    tagBg: 'rgba(245,138,31,0.18)', tagFg: '#D97706' };
            return (
              <Link key={a.title} href={a.href} className="no-underline">
                <div style={{
                  display: 'flex', gap: 12, padding: '12px 14px',
                  background: tone.bg,
                  border: '1px solid var(--color-border)',
                  borderLeft: `3px solid ${tone.bar}`,
                  borderRadius: 8,
                }}>
                  <div style={{
                    flexShrink: 0,
                    background: tone.tagBg, color: tone.tagFg,
                    fontFamily: 'var(--font-condensed)', fontSize: 10, fontWeight: 800,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    padding: '4px 8px', borderRadius: 3, height: 22,
                  }}>{tone.tag}</div>
                  <div>
                    <div style={{ color: 'var(--color-text)', fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{a.title}</div>
                    <div style={{ color: 'var(--color-muted)', fontSize: 13 }}>{a.body}</div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </Card>

      {/* 6-month trend */}
      <Card>
        <SectionTitle>6-month inventory value & days-of-cover</SectionTitle>
        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart data={trend}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-chart-grid)" />
            <XAxis dataKey="month" tick={{ fill: 'var(--color-chart-text)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left"  tickFormatter={(v) => `$${(v / 1_000_000).toFixed(1)}M`} tick={{ fill: 'var(--color-chart-text)', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `${v}d`} tick={{ fill: 'var(--color-chart-text)', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Legend wrapperStyle={{ fontSize: 11, color: 'var(--color-chart-text)' }} />
            <Area  yAxisId="left"  dataKey="onHand"    name="Inventory $"    fill="rgba(27,77,230,0.18)" stroke="#1D44BF" strokeWidth={2} />
            <Line  yAxisId="right" dataKey="doc"       name="Days of cover"  stroke="#E8B84B" strokeWidth={2.5} dot={{ r: 3 }} />
            <Bar   yAxisId="right" dataKey="stockouts" name="Stockouts"      fill="#1D44BF" barSize={16} />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>

      {/* Locations + ABC in 2 cols */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <SectionTitle right={
            <Link href="/ops/inventory/locations" className="no-underline"
              style={{ color: 'var(--color-blue)', fontSize: 12, fontWeight: 700 }}>All locations →</Link>
          }>By location</SectionTitle>
          <div className="flex flex-col gap-2">
            {INVENTORY_LOCATIONS.map((l) => (
              <div key={l.code} style={{
                display: 'grid', gridTemplateColumns: '44px 1fr auto auto', gap: 12, alignItems: 'center',
                padding: '10px 12px', borderRadius: 8,
                background: 'var(--color-surf2)', border: '1px solid var(--color-border)',
              }}>
                <div style={{
                  background: 'rgba(27,77,230,0.20)', color: '#FFAAAA',
                  fontFamily: 'var(--font-condensed)', fontSize: 12, fontWeight: 800,
                  letterSpacing: '0.06em', textAlign: 'center',
                  padding: '6px 0', borderRadius: 4,
                }}>{l.code}</div>
                <div>
                  <div style={{ color: 'var(--color-text)', fontSize: 14, fontWeight: 700 }}>{l.name}</div>
                  <div style={{ color: 'var(--color-muted)', fontSize: 12 }}>
                    {l.city} · {l.type} · {l.unitsOnHand.toLocaleString()} units
                  </div>
                </div>
                <div style={{ textAlign: 'right', fontFamily: 'var(--font-condensed)', fontSize: 15, fontWeight: 800, color: 'var(--color-text)' }}>
                  {fmt$(l.onHandValue, true)}
                </div>
                <div style={{
                  fontFamily: 'var(--font-condensed)', fontSize: 11, fontWeight: 700,
                  color: l.onTimeShipPct >= 97 ? '#2DB47A' : '#D97706',
                  padding: '3px 8px', borderRadius: 4,
                  background: l.onTimeShipPct >= 97 ? 'rgba(45,180,122,0.14)' : 'rgba(245,138,31,0.18)',
                }}>
                  {l.onTimeShipPct.toFixed(1)}% OTS
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle>Top SKUs by velocity</SectionTitle>
          <div className="flex flex-col gap-2">
            {sortedBySales.slice(0, 6).map((s) => (
              <Link key={s.sku} href="/ops/inventory/sku" className="no-underline">
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 12, alignItems: 'center',
                  padding: '10px 12px', borderRadius: 8,
                  background: 'var(--color-surf2)', border: '1px solid var(--color-border)',
                }}>
                  <div>
                    <div style={{ color: 'var(--color-text)', fontSize: 13, fontWeight: 700 }}>{s.name}</div>
                    <div style={{ color: 'var(--color-muted)', fontSize: 11, fontFamily: 'var(--font-condensed)', letterSpacing: '0.04em' }}>
                      {s.sku} · ABC {s.abc} · {s.avgDailySales.toFixed(0)}/day
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--font-condensed)', fontSize: 14, fontWeight: 800, color: 'var(--color-text)' }}>
                      {s.daysOfCover.toFixed(0)}d
                    </div>
                    <div style={{ color: 'var(--color-muted)', fontSize: 10, fontFamily: 'var(--font-condensed)' }}>
                      cover
                    </div>
                  </div>
                  <StatusPill status={s.status} />
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>

      {/* Deadstock preview */}
      <Card>
        <SectionTitle right={
          <Link href="/ops/inventory/deadstock" className="no-underline"
            style={{ color: 'var(--color-blue)', fontSize: 12, fontWeight: 700 }}>Markdown console →</Link>
        }>Deadstock · markdown candidates</SectionTitle>
        <table className="w-full border-collapse">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              {['SKU','Book value','Days on hand','Suggested markdown','Est. recovery','Write-down risk'].map((h, i) => (
                <th key={h} className="px-3 py-2 font-bold uppercase tracking-[0.08em]"
                  style={{ textAlign: i === 0 ? 'left' : 'right', fontFamily: 'var(--font-condensed)', color: 'var(--color-muted)', fontSize: 11 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DEADSTOCK_ITEMS.map((d) => (
              <tr key={d.sku} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td className="px-3 py-3" style={{ fontSize: 13 }}>
                  <div style={{ fontWeight: 700, color: 'var(--color-text)' }}>{d.name}</div>
                  <div style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-muted)', fontSize: 11, letterSpacing: '0.04em' }}>{d.sku} · {d.qty} units</div>
                </td>
                <td className="px-3 py-3 text-right" style={{ fontFamily: 'var(--font-condensed)', fontSize: 14, fontWeight: 700 }}>{fmt$(d.bookValue)}</td>
                <td className="px-3 py-3 text-right" style={{ fontSize: 13, color: 'var(--color-muted)' }}>{d.daysOnHand}d</td>
                <td className="px-3 py-3 text-right" style={{ fontFamily: 'var(--font-condensed)', fontSize: 14, fontWeight: 700, color: '#D97706' }}>−{d.suggestedMarkdown}%</td>
                <td className="px-3 py-3 text-right" style={{ fontFamily: 'var(--font-condensed)', fontSize: 14, fontWeight: 700, color: '#2DB47A' }}>{fmt$(d.estRecovery)}</td>
                <td className="px-3 py-3 text-right" style={{ fontFamily: 'var(--font-condensed)', fontSize: 14, fontWeight: 700, color: '#1D44BF' }}>−{fmt$(d.writeDownIfUnsold)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Deep-dive tile row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { href: '/ops/inventory/sku',        t: 'SKU DETAIL',         s: 'Velocity, history, locations' },
          { href: '/ops/inventory/locations',  t: 'MULTI-LOCATION',     s: 'Warehouse split & transfers' },
          { href: '/ops/inventory/po',         t: 'PURCHASE ORDERS',    s: '6 open · 1 late' },
          { href: '/ops/inventory/movements',  t: 'STOCK MOVEMENTS',    s: 'Receipts, sales, adjustments' },
          { href: '/ops/inventory/reorder',    t: 'REORDER PLANNER',    s: 'Auto ROP + EOQ' },
          { href: '/ops/inventory/deadstock',  t: 'DEADSTOCK CONSOLE',  s: '$18.9K at risk' },
          { href: '/ops/inventory/cogs',       t: 'FINANCE TIE-IN',     s: 'COGS · valuation · write-offs' },
          { href: '/ops',                      t: 'CS DASHBOARD',       s: 'Tickets · returns · SLA' },
        ].map((x) => (
          <Link key={x.href} href={x.href} className="no-underline">
            <div style={{
              background: 'var(--color-surf)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--card-radius)',
              padding: '14px 16px',
              transition: 'background 0.12s',
            }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--color-surf2)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--color-surf)'; }}
            >
              <div className="uppercase tracking-[0.10em]" style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-muted)', fontSize: 11, fontWeight: 700 }}>{x.t}</div>
              <div className="mt-1" style={{ color: 'var(--color-text)', fontSize: 13, fontWeight: 600 }}>
                {x.s} <span style={{ color: 'var(--color-blue)' }}>→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
