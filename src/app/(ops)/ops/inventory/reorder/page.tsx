'use client';

import Link from 'next/link';
import { useState } from 'react';
import { INVENTORY_SKUS, getReorderSuggestions, type InventorySku } from '@/lib/data/inventory';

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

// Build the planner rows by joining SKU data with any reorder suggestion
function buildRows() {
  const suggestedSkus = new Set(getReorderSuggestions().map((r) => r.sku));
  return INVENTORY_SKUS.map((s) => {
    const safetyStock = Math.round(s.avgDailySales * 7);          // 1 week safety
    const demandDuringLead = Math.round(s.avgDailySales * s.leadTimeDays);
    const rop = safetyStock + demandDuringLead;
    const needsReorder = suggestedSkus.has(s.sku);
    const urgency: 'critical' | 'high' | 'medium' | 'none' =
      s.status === 'stockout' ? 'critical' :
      s.daysOfCover < 14 && needsReorder ? 'high' :
      needsReorder ? 'medium' : 'none';
    return {
      sku: s,
      safetyStock,
      demandDuringLead,
      rop,
      needsReorder,
      urgency,
    };
  }).sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2, none: 3 };
    return order[a.urgency] - order[b.urgency];
  });
}

const URGENCY_COLORS = {
  critical: { bg: 'rgba(27,77,230,0.18)',  fg: '#1D44BF', label: 'Critical' },
  high:     { bg: 'rgba(245,138,31,0.20)', fg: '#D97706', label: 'High' },
  medium:   { bg: 'rgba(75,155,232,0.18)', fg: '#4B9BE8', label: 'Plan' },
  none:     { bg: 'rgba(45,180,122,0.15)', fg: '#2DB47A', label: 'OK' },
};

export default function ReorderPlannerPage() {
  const rows = buildRows();
  const [selected, setSelected] = useState<Set<string>>(new Set(rows.filter((r) => r.needsReorder).map((r) => r.sku.sku)));

  const totalCost = rows
    .filter((r) => selected.has(r.sku.sku))
    .reduce((s, r) => s + r.sku.reorderQty * r.sku.unitCost, 0);
  const totalUnits = rows
    .filter((r) => selected.has(r.sku.sku))
    .reduce((s, r) => s + r.sku.reorderQty, 0);
  const selectedCount = [...selected].length;

  function toggle(sku: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(sku)) next.delete(sku);
      else next.add(sku);
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Breadcrumb */}
      <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>
        <Link href="/ops/inventory" style={{ color: 'var(--color-muted)' }}>Inventory</Link>
        <span style={{ margin: '0 8px' }}>·</span>
        <span style={{ color: 'var(--color-text)' }}>Reorder Planner</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="uppercase tracking-[0.04em]"
            style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-text)', fontSize: 32, fontWeight: 900 }}>
            Reorder Planner
          </div>
          <div className="text-[12px] mt-0.5" style={{ color: 'var(--color-muted)' }}>
            Auto reorder-point + EOQ · sorted by urgency
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <div style={{ fontFamily: 'var(--font-condensed)', background: 'var(--color-blue-d)', color: 'var(--color-blue)', fontSize: 13, padding: '6px 14px', borderRadius: 4, fontWeight: 700, letterSpacing: '0.06em' }}>
            {selectedCount} SELECTED · {totalUnits.toLocaleString()} UNITS
          </div>
          <div style={{ fontFamily: 'var(--font-condensed)', background: 'rgba(45,180,122,0.15)', color: '#2DB47A', fontSize: 13, padding: '6px 14px', borderRadius: 4, fontWeight: 700, letterSpacing: '0.06em' }}>
            {fmt$(totalCost, true)} CASH IMPACT
          </div>
        </div>
      </div>

      {/* Formula reference */}
      <Card style={{ background: 'var(--color-surf2)' }}>
        <SectionTitle>Reorder math (applied per SKU)</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[13px]" style={{ color: 'var(--color-muted)' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-text)', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: 11, marginBottom: 4 }}>
              Safety stock
            </div>
            <div>7d × daily velocity — covers demand variability during lead time.</div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-text)', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: 11, marginBottom: 4 }}>
              Reorder point
            </div>
            <div>Safety + (velocity × lead-time days). Trigger to place next PO.</div>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-text)', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: 11, marginBottom: 4 }}>
              Order qty (EOQ)
            </div>
            <div>Optimal balance of holding cost vs order cost — pre-calculated per SKU.</div>
          </div>
        </div>
      </Card>

      {/* Planner table */}
      <Card>
        <SectionTitle right={
          <button
            onClick={() => setSelected(new Set(rows.filter(r => r.needsReorder).map(r => r.sku.sku)))}
            style={{
              background: 'transparent', border: '1px solid var(--color-border)',
              color: 'var(--color-blue)', fontSize: 12, fontWeight: 700,
              padding: '6px 12px', borderRadius: 6, cursor: 'pointer',
            }}
          >
            Reset to suggested
          </button>
        }>
          Reorder queue ({rows.length} SKUs · {rows.filter(r => r.urgency !== 'none').length} flagged)
        </SectionTitle>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" style={{ minWidth: 920 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                {['', 'SKU', 'Urgency', 'On-hand', 'Cover', 'Lead', 'ROP', 'EOQ', 'Cost', 'Supplier'].map((h, i) => (
                  <th key={h + i} style={{
                    textAlign: i <= 1 || i === 9 ? 'left' : 'right',
                    fontFamily: 'var(--font-condensed)', color: 'var(--color-muted)',
                    fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '0.08em', padding: '10px 8px',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const u = URGENCY_COLORS[r.urgency];
                const isSelected = selected.has(r.sku.sku);
                return (
                  <tr key={r.sku.sku} style={{
                    borderBottom: '1px solid var(--color-border)',
                    opacity: r.urgency === 'none' && !isSelected ? 0.6 : 1,
                  }}>
                    <td style={{ padding: '10px 8px', width: 28 }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggle(r.sku.sku)}
                        style={{ width: 16, height: 16, cursor: 'pointer' }}
                      />
                    </td>
                    <td style={{ padding: '10px 8px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--color-text)', fontSize: 13 }}>
                        {r.sku.name}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--color-muted)', fontFamily: 'var(--font-condensed)', letterSpacing: '0.04em' }}>
                        {r.sku.sku}
                      </div>
                    </td>
                    <td style={{ padding: '10px 8px', textAlign: 'right' }}>
                      <span style={{
                        display: 'inline-block', background: u.bg, color: u.fg,
                        fontFamily: 'var(--font-condensed)', fontSize: 10, fontWeight: 800,
                        letterSpacing: '0.08em', textTransform: 'uppercase',
                        padding: '3px 8px', borderRadius: 4,
                      }}>{u.label}</span>
                    </td>
                    <td style={{ padding: '10px 8px', textAlign: 'right', fontFamily: 'var(--font-condensed)', fontWeight: 700, fontSize: 13, color: r.sku.onHand === 0 ? '#1D44BF' : 'var(--color-text)' }}>
                      {r.sku.onHand.toLocaleString()}
                    </td>
                    <td style={{ padding: '10px 8px', textAlign: 'right', fontFamily: 'var(--font-condensed)', fontSize: 13, color: r.sku.daysOfCover < 14 ? '#1D44BF' : 'var(--color-muted)' }}>
                      {r.sku.daysOfCover.toFixed(0)}d
                    </td>
                    <td style={{ padding: '10px 8px', textAlign: 'right', fontFamily: 'var(--font-condensed)', fontSize: 13, color: 'var(--color-muted)' }}>
                      {r.sku.leadTimeDays}d
                    </td>
                    <td style={{ padding: '10px 8px', textAlign: 'right', fontFamily: 'var(--font-condensed)', fontSize: 13, color: 'var(--color-muted)' }}>
                      {r.rop.toLocaleString()}
                    </td>
                    <td style={{ padding: '10px 8px', textAlign: 'right', fontFamily: 'var(--font-condensed)', fontSize: 13, fontWeight: 700, color: 'var(--color-text)' }}>
                      {r.sku.reorderQty.toLocaleString()}
                    </td>
                    <td style={{ padding: '10px 8px', textAlign: 'right', fontFamily: 'var(--font-condensed)', fontSize: 13, fontWeight: 700, color: 'var(--color-text)' }}>
                      {fmt$(r.sku.reorderQty * r.sku.unitCost)}
                    </td>
                    <td style={{ padding: '10px 8px', fontSize: 12, color: 'var(--color-muted)' }}>
                      {r.sku.supplier}
                    </td>
                  </tr>
                );
              })}
              {/* Totals row */}
              <tr style={{ borderTop: '2px solid var(--color-border2)', background: 'var(--color-surf2)' }}>
                <td />
                <td style={{ padding: '12px 8px', fontFamily: 'var(--font-condensed)', fontSize: 14, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text)' }}>
                  Selected total
                </td>
                <td />
                <td />
                <td />
                <td />
                <td />
                <td style={{ padding: '12px 8px', textAlign: 'right', fontFamily: 'var(--font-condensed)', fontSize: 14, fontWeight: 800, color: 'var(--color-text)' }}>
                  {totalUnits.toLocaleString()}
                </td>
                <td style={{ padding: '12px 8px', textAlign: 'right', fontFamily: 'var(--font-condensed)', fontSize: 14, fontWeight: 800, color: 'var(--color-blue)' }}>
                  {fmt$(totalCost)}
                </td>
                <td />
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Action bar */}
      <Card style={{ background: 'linear-gradient(135deg, rgba(27,77,230,0.08), rgba(79,168,255,0.04))' }}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div style={{ fontFamily: 'var(--font-condensed)', fontSize: 16, fontWeight: 800, color: 'var(--color-text)', marginBottom: 2 }}>
              Generate {selectedCount} draft POs → send for approval
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>
              Cash impact {fmt$(totalCost)} · next cash milestone: Shenzhen PO-2043 arrival (Apr 12 late) · suppliers: {[...new Set(rows.filter(r => selected.has(r.sku.sku)).map(r => r.sku.supplier))].join(', ') || '—'}
            </div>
          </div>
          <div className="flex gap-2">
            <button style={{
              background: 'var(--color-surf)', color: 'var(--color-text)',
              border: '1px solid var(--color-border)', padding: '10px 16px',
              fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
              borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit',
            }}>
              Export CSV
            </button>
            <Link href="/ops/inventory/po" className="no-underline">
              <button style={{
                background: 'linear-gradient(135deg, #1D44BF 0%, #E8B84B 100%)',
                color: '#FFFFFF', border: 'none', padding: '10px 18px',
                fontSize: 12, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase',
                borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit',
                boxShadow: '0 2px 10px rgba(27,77,230,0.30)',
              }}>
                Send to PO tracker →
              </button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
