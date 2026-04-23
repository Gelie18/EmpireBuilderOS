'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import { INVENTORY_SKUS, INVENTORY_MOVEMENTS, type InventorySku, type StockStatus } from '@/lib/data/inventory';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const TOOLTIP_STYLE = {
  background: '#1E2236',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: 8,
  color: '#FFFFFF',
  fontSize: 12,
  boxShadow: '0 1px 4px rgba(0,0,0,0.30), 0 4px 16px rgba(0,0,0,0.25)',
};

const STATUS_COLORS: Record<StockStatus, { bg: string; fg: string; label: string }> = {
  healthy:   { bg: 'rgba(45,180,122,0.18)',  fg: '#2DB47A', label: 'Healthy'   },
  low:       { bg: 'rgba(245,138,31,0.20)',  fg: '#D97706', label: 'Low'       },
  stockout:  { bg: 'rgba(27,77,230,0.20)',   fg: '#1B4DE6', label: 'Stockout'  },
  overstock: { bg: 'rgba(136,132,128,0.20)', fg: '#8B5CF6', label: 'Overstock' },
  deadstock: { bg: 'rgba(136,132,128,0.20)', fg: '#6B7280', label: 'Deadstock' },
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
    <div style={{
      background: 'var(--color-surf)',
      borderRadius: 'var(--card-radius)',
      boxShadow: 'var(--card-shadow)',
      border: '1px solid var(--color-border)',
      padding: '20px 22px',
      ...style,
    }}>
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

// Simulated 90-day velocity history for a SKU (seeded off unit velocity + noise).
function buildVelocityHistory(sku: InventorySku) {
  const out: { day: string; units: number; onHand: number }[] = [];
  const base = sku.avgDailySales;
  let running = sku.onHand + 90 * base + (sku.inTransit === 0 ? 200 : 0);
  for (let d = 89; d >= 0; d--) {
    const dayLabel = d === 0 ? 'Today' : `-${d}d`;
    // Weekly oscillation + noise
    const weekend = (d % 7 === 0 || d % 7 === 6) ? 0.75 : 1.05;
    const noise = 0.85 + (Math.sin(d * 0.57) + Math.cos(d * 0.31)) * 0.1;
    const units = Math.max(0, Math.round(base * weekend * noise));
    running = Math.max(0, running - units);
    out.push({ day: dayLabel, units, onHand: running });
  }
  return out;
}

export default function SkuDetailPage() {
  // Default to SSK-Z7-BLK-M (the low-stock hero)
  const defaultIdx = INVENTORY_SKUS.findIndex((s) => s.sku === 'SSK-Z7-BLK-M');
  const [selectedSku, setSelectedSku] = useState(INVENTORY_SKUS[defaultIdx === -1 ? 0 : defaultIdx].sku);
  const sku = INVENTORY_SKUS.find((s) => s.sku === selectedSku) || INVENTORY_SKUS[0];
  const velocity = useMemo(() => buildVelocityHistory(sku), [sku]);
  const history = INVENTORY_MOVEMENTS.filter((m) => m.sku === sku.sku).slice(0, 8);

  const retailValue = sku.onHand * sku.unitPrice;
  const costValue = sku.onHand * sku.unitCost;
  const inTransitValue = sku.inTransit * sku.unitCost;
  const marginPct = sku.unitCost && sku.unitPrice
    ? ((sku.unitPrice - sku.unitCost) / sku.unitPrice) * 100
    : 0;

  return (
    <div className="flex flex-col gap-5">
      {/* Breadcrumb */}
      <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>
        <Link href="/ops/inventory" style={{ color: 'var(--color-muted)' }}>Inventory</Link>
        <span style={{ margin: '0 8px' }}>·</span>
        <span style={{ color: 'var(--color-text)' }}>SKU Detail</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="uppercase tracking-[0.04em]"
            style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-text)', fontSize: 32, fontWeight: 900 }}>
            {sku.name}
          </div>
          <div className="flex items-center gap-2 mt-1" style={{ fontSize: 12, color: 'var(--color-muted)' }}>
            <span style={{ fontFamily: 'var(--font-condensed)', letterSpacing: '0.04em', fontWeight: 700, color: 'var(--color-text)' }}>
              {sku.sku}
            </span>
            <span>·</span>
            <span>{sku.category}</span>
            <span>·</span>
            <span>ABC class {sku.abc}</span>
            <span>·</span>
            <StatusPill status={sku.status} />
          </div>
        </div>
        {/* SKU switcher */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '6px 10px', borderRadius: 8,
          background: 'var(--color-surf)', border: '1px solid var(--color-border)',
        }}>
          <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
            Switch SKU
          </label>
          <select
            value={selectedSku}
            onChange={(e) => setSelectedSku(e.target.value)}
            style={{
              background: 'var(--color-surf2)', color: 'var(--color-text)',
              border: '1px solid var(--color-border)', borderRadius: 6,
              padding: '6px 10px', fontSize: 13, fontFamily: 'inherit',
            }}
          >
            {INVENTORY_SKUS.map((s) => (
              <option key={s.sku} value={s.sku}>{s.sku} — {s.name.split(' · ')[0]}</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'On-hand',           value: `${sku.onHand.toLocaleString()}`, sub: `${fmt$(costValue)} at cost · ${fmt$(retailValue)} retail`, color: 'var(--color-blue)' },
          { label: 'Available to sell', value: `${sku.available.toLocaleString()}`, sub: `${sku.reserved.toLocaleString()} reserved`, color: 'var(--color-green)' },
          { label: 'Days of cover',     value: `${sku.daysOfCover.toFixed(0)}d`, sub: `${sku.avgDailySales}/day · ROP ${sku.reorderPoint.toLocaleString()}`, color: sku.status === 'stockout' ? '#1B4DE6' : 'var(--color-text)' },
          { label: 'In-transit',        value: `${sku.inTransit.toLocaleString()}`, sub: sku.inTransit > 0 ? `${fmt$(inTransitValue)} on water` : 'No open inbound', color: 'var(--color-orange)' },
        ].map((c) => (
          <Card key={c.label} style={{ position: 'relative', overflow: 'hidden', padding: '18px 20px 16px' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: c.color, opacity: 0.85, borderRadius: 'var(--card-radius) var(--card-radius) 0 0' }} />
            <div className="uppercase tracking-[0.08em] mb-1.5"
              style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-muted)', fontSize: 11, fontWeight: 700 }}>{c.label}</div>
            <div className="leading-none"
              style={{ fontFamily: 'var(--font-condensed)', color: c.color, fontSize: 30, fontWeight: 900 }}>{c.value}</div>
            <div className="mt-1" style={{ color: 'var(--color-muted)', fontSize: 12 }}>{c.sub}</div>
          </Card>
        ))}
      </div>

      {/* Velocity + economics in 2 cols */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card style={{ gridColumn: 'span 2' }}>
          <SectionTitle>90-day velocity & on-hand</SectionTitle>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={velocity}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-chart-grid)" />
              <XAxis dataKey="day"
                interval={11}
                tick={{ fill: 'var(--color-chart-text)', fontSize: 10 }}
                axisLine={false} tickLine={false} />
              <YAxis yAxisId="left"  tick={{ fill: 'var(--color-chart-text)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: 'var(--color-chart-text)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Line yAxisId="left"  type="monotone" dataKey="units"  name="Units sold" stroke="#F58A1F" strokeWidth={2} dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="onHand" name="On-hand"    stroke="#1B4DE6" strokeWidth={2.5} dot={false} />
              <ReferenceLine yAxisId="right" y={sku.reorderPoint} stroke="#D97706" strokeDasharray="3 3" label={{ value: 'Reorder point', fill: '#D97706', fontSize: 10, position: 'insideTopRight' }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <SectionTitle>Unit economics</SectionTitle>
          <div className="flex flex-col gap-3">
            {[
              { k: 'Unit cost',     v: fmt$(sku.unitCost), s: 'Landed · incl duty' },
              { k: 'Unit price',    v: fmt$(sku.unitPrice), s: 'MSRP · DTC' },
              { k: 'Gross margin',  v: `${marginPct.toFixed(1)}%`, s: `${fmt$(sku.unitPrice - sku.unitCost)}/unit` },
              { k: 'Lead time',     v: `${sku.leadTimeDays}d`, s: `${sku.supplier}` },
              { k: 'EOQ',           v: sku.reorderQty.toLocaleString(), s: `Next PO ≈ ${fmt$(sku.reorderQty * sku.unitCost)}` },
              { k: 'Last received', v: sku.lastReceived, s: sku.inTransit > 0 ? `${sku.inTransit.toLocaleString()} on order` : '—' },
            ].map((row) => (
              <div key={row.k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--color-muted)', fontFamily: 'var(--font-condensed)', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 700 }}>{row.k}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 2 }}>{row.s}</div>
                </div>
                <div style={{ fontFamily: 'var(--font-condensed)', fontSize: 15, fontWeight: 800, color: 'var(--color-text)', whiteSpace: 'nowrap' }}>{row.v}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Location split + Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <SectionTitle>By location</SectionTitle>
          <div className="flex flex-col gap-2">
            {sku.locations.map((l) => {
              const pct = sku.onHand > 0 ? (l.qty / sku.onHand) * 100 : 0;
              return (
                <div key={l.loc} style={{
                  display: 'grid', gridTemplateColumns: '44px 1fr auto', gap: 12, alignItems: 'center',
                  padding: '10px 12px', borderRadius: 8,
                  background: 'var(--color-surf2)', border: '1px solid var(--color-border)',
                }}>
                  <div style={{
                    background: 'rgba(27,77,230,0.20)', color: '#FFAAAA',
                    fontFamily: 'var(--font-condensed)', fontSize: 12, fontWeight: 800,
                    letterSpacing: '0.06em', textAlign: 'center',
                    padding: '6px 0', borderRadius: 4,
                  }}>{l.loc}</div>
                  <div>
                    <div style={{ height: 8, borderRadius: 4, background: 'var(--color-border)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${Math.max(2, pct)}%`, background: '#1B4DE6', borderRadius: 4 }} />
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 4 }}>
                      {pct.toFixed(1)}% of on-hand
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', fontFamily: 'var(--font-condensed)', fontSize: 15, fontWeight: 800, color: 'var(--color-text)' }}>
                    {l.qty.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <SectionTitle>Recent activity</SectionTitle>
          {history.length === 0 ? (
            <div style={{ color: 'var(--color-muted)', fontSize: 13, padding: '14px 0' }}>
              No recent movements for this SKU in the last 7 days.
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {history.map((m) => {
                const isNegative = m.qty < 0;
                const typeColor =
                  m.type === 'sale'       ? '#2DB47A' :
                  m.type === 'receipt'    ? '#F58A1F' :
                  m.type === 'transfer'   ? '#8B5CF6' :
                  m.type === 'return'     ? '#4B9BE8' :
                  m.type === 'write-off'  ? '#1B4DE6' :
                                            '#6B7280';
                return (
                  <div key={m.id} style={{
                    display: 'grid', gridTemplateColumns: '100px 84px 1fr auto', gap: 10, alignItems: 'center',
                    padding: '8px 10px', borderBottom: '1px solid var(--color-border)',
                  }}>
                    <div style={{ fontSize: 11, fontFamily: 'var(--font-condensed)', color: 'var(--color-muted)', letterSpacing: '0.04em' }}>{m.ts}</div>
                    <div style={{
                      fontFamily: 'var(--font-condensed)', fontSize: 10, fontWeight: 800,
                      letterSpacing: '0.08em', textTransform: 'uppercase',
                      color: typeColor, padding: '2px 8px', borderRadius: 3,
                      background: typeColor.replace('rgb', 'rgba').replace(')', ', 0.12)'),
                      border: `1px solid ${typeColor}33`,
                      textAlign: 'center', width: 'fit-content',
                    }}>{m.type}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>
                      {m.ref && <span style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-text)', marginRight: 6 }}>{m.ref}</span>}
                      {m.from && <span>from {m.from}</span>}
                      {m.to && <span>{m.from ? ' → ' : 'to '}{m.to}</span>}
                      {m.note && <div style={{ fontSize: 11, marginTop: 2 }}>{m.note}</div>}
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-condensed)', fontSize: 14, fontWeight: 800,
                      color: isNegative ? '#1B4DE6' : '#2DB47A',
                      textAlign: 'right',
                    }}>
                      {isNegative ? '' : '+'}{m.qty.toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Recommendation */}
      <Card style={{ borderLeft: `4px solid ${sku.status === 'stockout' || sku.status === 'low' ? '#1B4DE6' : sku.status === 'deadstock' || sku.status === 'overstock' ? '#D97706' : '#2DB47A'}` }}>
        <SectionTitle>AI recommendation</SectionTitle>
        <div style={{ fontSize: 14, color: 'var(--color-text)', lineHeight: 1.5 }}>
          {sku.status === 'stockout' && (
            <>
              <strong>Escalate to supplier</strong>. Stocked out with ${(sku.avgDailySales * sku.unitPrice * 30).toLocaleString()}/mo in lost velocity. Next inbound ({sku.inTransit.toLocaleString()} units on PO) is late — explore temporary substitution (Z7 Black M) in email/PDP copy while the shipment clears customs.
            </>
          )}
          {sku.status === 'low' && (
            <>
              <strong>Expedite or split-ship</strong>. Cover sits at {sku.daysOfCover.toFixed(1)}d vs a {sku.leadTimeDays}d lead time; the {sku.inTransit > 0 ? 'in-transit PO covers ' + (sku.inTransit / sku.avgDailySales).toFixed(0) + ' days' : 'next PO has not been placed yet'}. Flag to ops for air freight top-up if there&rsquo;s any slippage.
            </>
          )}
          {sku.status === 'healthy' && (
            <>
              <strong>Hold steady</strong>. Velocity trending at forecast, cover within healthy band. No action needed this week — next check-in when on-hand drops below {sku.reorderPoint.toLocaleString()}.
            </>
          )}
          {sku.status === 'overstock' && (
            <>
              <strong>Block new orders; plan markdown</strong>. Cover at {sku.daysOfCover.toFixed(0)} days is &gt;3× lead time. Hold the next PO and run a 20–25% targeted promo in the next email cycle — frees ~{fmt$(sku.onHand * sku.unitCost * 0.35, true)} of working capital.
            </>
          )}
          {sku.status === 'deadstock' && (
            <>
              <strong>Clear or write down</strong>. Last sale {INVENTORY_MOVEMENTS.find(m => m.sku === sku.sku && m.type === 'sale')?.ts ?? 'not in recent history'}. Recommend bundling with higher-velocity SKUs or marking down 40%+ — book value at risk: {fmt$(sku.onHand * sku.unitCost)}.
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
