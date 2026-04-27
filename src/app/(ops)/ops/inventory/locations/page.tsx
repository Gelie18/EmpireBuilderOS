'use client';

import Link from 'next/link';
import { INVENTORY_LOCATIONS, INVENTORY_SKUS, type InventoryLocation } from '@/lib/data/inventory';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

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

// Suggested transfers — imbalances where one location is heavy & another light
function getSuggestedTransfers() {
  const out: { sku: string; name: string; from: string; to: string; qty: number; reason: string }[] = [];
  for (const sku of INVENTORY_SKUS) {
    const slc = sku.locations.find((l) => l.loc === 'SLC')?.qty ?? 0;
    const atl = sku.locations.find((l) => l.loc === 'ATL')?.qty ?? 0;
    const rno = sku.locations.find((l) => l.loc === 'RNO')?.qty ?? 0;
    const total = slc + atl + rno;
    if (total < 100) continue;
    // ATL demand runs higher east-of-Mississippi, so it runs lighter faster.
    if (sku.status === 'low' || sku.status === 'stockout') continue;

    // If RNO is overweight vs demand share, rebalance to ATL
    if (rno > total * 0.35 && sku.avgDailySales >= 20) {
      out.push({
        sku: sku.sku,
        name: sku.name,
        from: 'RNO',
        to: 'ATL',
        qty: Math.round(rno * 0.25),
        reason: 'Eastern demand share underweight',
      });
    }
    // If SLC carries >65% of total for a C-class SKU, push some to ATL as ballast
    if (sku.abc === 'C' && slc > total * 0.60 && sku.status !== 'deadstock') {
      out.push({
        sku: sku.sku,
        name: sku.name,
        from: 'SLC',
        to: 'ATL',
        qty: Math.round((slc - total * 0.45) * 0.4),
        reason: 'Reduce west-coast holding concentration',
      });
    }
  }
  return out.slice(0, 5);
}

function LocationCard({ loc }: { loc: InventoryLocation }) {
  const skuMix = INVENTORY_SKUS
    .map((s) => ({ sku: s.sku, name: s.name, qty: s.locations.find((x) => x.loc === loc.code)?.qty ?? 0, unitCost: s.unitCost }))
    .filter((s) => s.qty > 0)
    .sort((a, b) => b.qty * b.unitCost - a.qty * a.unitCost)
    .slice(0, 5);

  return (
    <Card style={{ padding: '18px 20px' }}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div style={{
            display: 'inline-block',
            background: 'rgba(27,77,230,0.20)', color: '#FFAAAA',
            fontFamily: 'var(--font-condensed)', fontSize: 11, fontWeight: 800,
            letterSpacing: '0.06em', padding: '3px 8px', borderRadius: 4,
            marginBottom: 6,
          }}>{loc.code} · {loc.type}</div>
          <div style={{ fontFamily: 'var(--font-condensed)', fontSize: 20, fontWeight: 900, color: 'var(--color-text)', lineHeight: 1.1 }}>
            {loc.name}
          </div>
          <div style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 2 }}>{loc.city}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--font-condensed)', fontSize: 22, fontWeight: 900, color: 'var(--color-text)', lineHeight: 1 }}>
            {fmt$(loc.onHandValue, true)}
          </div>
          <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 2 }}>{loc.unitsOnHand.toLocaleString()} units · {loc.skusCarried} SKUs</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3" style={{ marginBottom: 12 }}>
        {[
          { k: 'Received MTD', v: loc.receivedMtd.toLocaleString() },
          { k: 'Shipped MTD',  v: loc.shippedMtd.toLocaleString() },
          { k: 'On-time ship', v: `${loc.onTimeShipPct.toFixed(1)}%` },
        ].map((x) => (
          <div key={x.k} style={{ padding: '8px 10px', background: 'var(--color-surf2)', borderRadius: 6, border: '1px solid var(--color-border)' }}>
            <div style={{ fontFamily: 'var(--font-condensed)', fontSize: 10, fontWeight: 700, color: 'var(--color-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{x.k}</div>
            <div style={{ fontFamily: 'var(--font-condensed)', fontSize: 15, fontWeight: 800, color: 'var(--color-text)', marginTop: 2 }}>{x.v}</div>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 10 }}>
        <div style={{ fontFamily: 'var(--font-condensed)', fontSize: 10, fontWeight: 700, color: 'var(--color-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
          Top 5 by value
        </div>
        <div className="flex flex-col gap-1.5">
          {skuMix.map((s) => (
            <div key={s.sku} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
              <span style={{ color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</span>
              <span style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-muted)', fontWeight: 700, marginLeft: 8 }}>
                {s.qty.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

export default function LocationsPage() {
  const byLocChart = INVENTORY_LOCATIONS.map((l) => ({
    loc: l.code,
    Value: l.onHandValue,
    Units: l.unitsOnHand,
  }));
  const transfers = getSuggestedTransfers();
  const totalValue = INVENTORY_LOCATIONS.reduce((s, l) => s + l.onHandValue, 0);
  const totalUnits = INVENTORY_LOCATIONS.reduce((s, l) => s + l.unitsOnHand, 0);

  return (
    <div className="flex flex-col gap-5">
      {/* Breadcrumb */}
      <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>
        <Link href="/ops/inventory" style={{ color: 'var(--color-muted)' }}>Inventory</Link>
        <span style={{ margin: '0 8px' }}>·</span>
        <span style={{ color: 'var(--color-text)' }}>Multi-Location</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="uppercase tracking-[0.04em]"
            style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-text)', fontSize: 32, fontWeight: 900 }}>
            Multi-Location Inventory
          </div>
          <div className="text-[12px] mt-0.5" style={{ color: 'var(--color-muted)' }}>
            {INVENTORY_LOCATIONS.length} locations · {totalUnits.toLocaleString()} units · {fmt$(totalValue, true)} at cost
          </div>
        </div>
      </div>

      {/* Value distribution chart */}
      <Card>
        <SectionTitle>Distribution of inventory $ by location</SectionTitle>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={byLocChart} layout="vertical" margin={{ top: 8, right: 40, left: 12, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-chart-grid)" horizontal={false} />
            <XAxis type="number" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} tick={{ fill: 'var(--color-chart-text)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="loc" tick={{ fill: 'var(--color-chart-text)', fontSize: 12, fontWeight: 700 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v, n) => n === 'Value' ? [fmt$(Number(v)), 'At cost'] : [Number(v).toLocaleString(), 'Units']} />
            <Legend wrapperStyle={{ fontSize: 11, color: 'var(--color-chart-text)' }} />
            <Bar dataKey="Value" fill="#1D44BF" radius={[0, 4, 4, 0]} barSize={26} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Location cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {INVENTORY_LOCATIONS.map((l) => (
          <LocationCard key={l.code} loc={l} />
        ))}
      </div>

      {/* Suggested transfers */}
      <Card>
        <SectionTitle right={
          <button style={{
            background: 'transparent', border: '1px solid var(--color-border)',
            color: 'var(--color-blue)', fontSize: 12, fontWeight: 700,
            padding: '6px 12px', borderRadius: 6, cursor: 'pointer',
          }}>
            Generate draft transfers
          </button>
        }>
          Suggested inter-location transfers ({transfers.length})
        </SectionTitle>
        {transfers.length === 0 ? (
          <div style={{ color: 'var(--color-muted)', fontSize: 13 }}>No imbalances flagged — locations are stocked proportional to demand share.</div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                {['SKU','From','To','Qty','Reason'].map((h, i) => (
                  <th key={h} style={{
                    textAlign: i === 3 ? 'right' : 'left',
                    fontFamily: 'var(--font-condensed)', color: 'var(--color-muted)',
                    fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '0.08em', padding: '10px 8px',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transfers.map((t, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '12px 8px', fontSize: 13 }}>
                    <div style={{ fontWeight: 700, color: 'var(--color-text)' }}>{t.name}</div>
                    <div style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-muted)', fontSize: 11 }}>{t.sku}</div>
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    <span style={{ background: 'rgba(136,132,128,0.18)', color: 'var(--color-text)', fontFamily: 'var(--font-condensed)', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 4 }}>{t.from}</span>
                  </td>
                  <td style={{ padding: '12px 8px' }}>
                    <span style={{ background: 'rgba(27,77,230,0.20)', color: '#FFAAAA', fontFamily: 'var(--font-condensed)', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 4 }}>{t.to}</span>
                  </td>
                  <td style={{ padding: '12px 8px', textAlign: 'right', fontFamily: 'var(--font-condensed)', fontSize: 14, fontWeight: 800, color: 'var(--color-text)' }}>
                    {t.qty.toLocaleString()}
                  </td>
                  <td style={{ padding: '12px 8px', fontSize: 13, color: 'var(--color-muted)' }}>{t.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
