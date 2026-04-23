'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  INVENTORY_POS,
  INVENTORY_SKUS,
  type PurchaseOrder,
} from '@/lib/data/inventory';

const fmt$ = (n: number) =>
  n >= 1000
    ? `$${(n / 1000).toFixed(n >= 10_000 ? 0 : 1)}K`
    : `$${n.toLocaleString()}`;

const STATUS_STYLE: Record<
  PurchaseOrder['status'],
  { bg: string; fg: string; label: string }
> = {
  draft:        { bg: '#E9EDF3', fg: '#4A5464', label: 'Draft' },
  sent:         { bg: '#DCE9FF', fg: '#1B4DA8', label: 'Sent' },
  'in-transit': { bg: '#E3F2E8', fg: '#206A3F', label: 'In transit' },
  arrived:      { bg: '#D9F0E3', fg: '#165E36', label: 'Arrived' },
  late:         { bg: '#FDE2E0', fg: '#8A1C16', label: 'Late' },
};

function Card({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={className}
      style={{
        background: 'var(--color-surf)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--card-radius)',
        boxShadow: 'var(--card-shadow)',
        padding: 20,
      }}
    >
      {children}
    </section>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontFamily: 'var(--font-condensed)',
        fontSize: 14,
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'var(--color-muted)',
        margin: '0 0 16px 0',
      }}
    >
      {children}
    </h2>
  );
}

function Pill({ status }: { status: PurchaseOrder['status'] }) {
  const s = STATUS_STYLE[status];
  return (
    <span
      style={{
        background: s.bg,
        color: s.fg,
        padding: '3px 10px',
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}
    >
      {s.label}
    </span>
  );
}

const SUPPLIER_PERF: { supplier: string; onTimePct: number; avgLeadDays: number; openValue: number; openCount: number }[] = [
  { supplier: 'Shenzhen Apparel Co.', onTimePct: 78, avgLeadDays: 45, openValue: 131_600, openCount: 2 },
  { supplier: 'Portland Stitchworks', onTimePct: 96, avgLeadDays: 29, openValue: 0,       openCount: 0 },
  { supplier: 'Midwest Knitting',     onTimePct: 99, avgLeadDays: 22, openValue: 0,       openCount: 0 },
  { supplier: 'Guangzhou Drinkware',  onTimePct: 88, avgLeadDays: 34, openValue: 13_200,  openCount: 1 },
  { supplier: 'Vancouver Outdoor',    onTimePct: 92, avgLeadDays: 54, openValue: 0,       openCount: 0 },
];

export default function POTrackerPage() {
  const [filter, setFilter] = useState<'all' | PurchaseOrder['status']>('all');

  const rows = useMemo(() => {
    const order: Record<PurchaseOrder['status'], number> = {
      late: 0,
      'in-transit': 1,
      sent: 2,
      draft: 3,
      arrived: 4,
    };
    const filtered =
      filter === 'all' ? INVENTORY_POS : INVENTORY_POS.filter((p) => p.status === filter);
    return [...filtered].sort((a, b) => order[a.status] - order[b.status]);
  }, [filter]);

  const totals = useMemo(() => {
    const open = INVENTORY_POS.filter((p) =>
      ['sent', 'in-transit', 'late'].includes(p.status),
    );
    const draft = INVENTORY_POS.filter((p) => p.status === 'draft');
    const late = INVENTORY_POS.filter((p) => p.status === 'late');
    const committed = open.reduce((s, p) => s + p.total, 0);
    const arrivingNext30 = open.reduce((s, p) => s + p.total, 0); // all shown open arrive <30d
    const lateValue = late.reduce((s, p) => s + p.total, 0);
    return {
      openCount: open.length,
      draftCount: draft.length,
      lateCount: late.length,
      committed,
      arrivingNext30,
      lateValue,
    };
  }, []);

  const skuName = (sku: string) =>
    INVENTORY_SKUS.find((s) => s.sku === sku)?.name ?? sku;

  return (
    <div style={{ padding: '24px 28px 60px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Breadcrumb */}
      <div
        style={{
          fontSize: 12,
          color: 'var(--color-muted)',
          marginBottom: 8,
          fontFamily: 'var(--font-condensed)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        <Link href="/ops/inventory" style={{ color: 'var(--color-muted)' }}>
          Inventory
        </Link>{' '}
        &middot; PO Tracker
      </div>

      {/* Header */}
      <header style={{ marginBottom: 28 }}>
        <h1
          style={{
            fontSize: 32,
            fontWeight: 900,
            letterSpacing: '-0.01em',
            textTransform: 'uppercase',
            margin: '0 0 6px 0',
            lineHeight: 1.05,
          }}
        >
          Purchase Orders
        </h1>
        <div style={{ color: 'var(--color-muted)', fontSize: 14 }}>
          {totals.openCount} open &middot; {fmt$(totals.committed)} committed &middot;{' '}
          <span style={{ color: 'var(--color-danger, #8A1C16)', fontWeight: 700 }}>
            {totals.lateCount} late ({fmt$(totals.lateValue)})
          </span>
        </div>
      </header>

      {/* KPI strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16,
          marginBottom: 20,
        }}
      >
        {[
          { label: 'Open POs', value: String(totals.openCount), sub: `${totals.draftCount} drafts awaiting approval` },
          { label: 'Committed $', value: fmt$(totals.committed), sub: 'arriving within 30 days' },
          { label: 'Late POs', value: String(totals.lateCount), sub: `${fmt$(totals.lateValue)} at risk`, tone: 'danger' as const },
          { label: 'Avg lead time', value: '36 d', sub: 'weighted by open value' },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <div
              style={{
                fontFamily: 'var(--font-condensed)',
                fontSize: 11,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--color-muted)',
              }}
            >
              {kpi.label}
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 900,
                marginTop: 4,
                color: kpi.tone === 'danger' ? '#8A1C16' : 'var(--color-text)',
              }}
            >
              {kpi.value}
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 4 }}>{kpi.sub}</div>
          </Card>
        ))}
      </div>

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {([
          ['all', `All (${INVENTORY_POS.length})`],
          ['late', `Late (${INVENTORY_POS.filter((p) => p.status === 'late').length})`],
          ['in-transit', `In transit (${INVENTORY_POS.filter((p) => p.status === 'in-transit').length})`],
          ['sent', `Sent (${INVENTORY_POS.filter((p) => p.status === 'sent').length})`],
          ['draft', `Draft (${INVENTORY_POS.filter((p) => p.status === 'draft').length})`],
          ['arrived', `Arrived (${INVENTORY_POS.filter((p) => p.status === 'arrived').length})`],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            style={{
              padding: '6px 14px',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              borderRadius: 999,
              border: '1px solid var(--color-border)',
              background:
                filter === key ? 'var(--color-text)' : 'var(--color-surf)',
              color: filter === key ? 'var(--color-surf)' : 'var(--color-text)',
              cursor: 'pointer',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* PO Table */}
      <Card>
        <SectionTitle>Purchase orders</SectionTitle>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr
                style={{
                  textAlign: 'left',
                  fontFamily: 'var(--font-condensed)',
                  fontSize: 11,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--color-muted)',
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                <th style={{ padding: '10px 12px' }}>PO #</th>
                <th style={{ padding: '10px 12px' }}>Supplier</th>
                <th style={{ padding: '10px 12px' }}>SKU</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Qty</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Unit cost</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Total</th>
                <th style={{ padding: '10px 12px' }}>Ordered</th>
                <th style={{ padding: '10px 12px' }}>ETA</th>
                <th style={{ padding: '10px 12px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((po) => (
                <tr
                  key={po.id}
                  style={{
                    borderBottom: '1px solid var(--color-border)',
                    background:
                      po.status === 'late' ? 'rgba(27, 77, 230, 0.04)' : 'transparent',
                  }}
                >
                  <td style={{ padding: '12px', fontFamily: 'var(--font-condensed)', fontWeight: 700 }}>
                    {po.id}
                  </td>
                  <td style={{ padding: '12px' }}>{po.supplier}</td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ fontFamily: 'var(--font-condensed)', fontSize: 12 }}>{po.sku}</div>
                    <div style={{ color: 'var(--color-muted)', fontSize: 11 }}>{skuName(po.sku)}</div>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', fontFamily: 'var(--font-condensed)' }}>
                    {po.qty ? po.qty.toLocaleString() : '—'}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', fontFamily: 'var(--font-condensed)' }}>
                    ${po.unitCost.toFixed(2)}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', fontFamily: 'var(--font-condensed)', fontWeight: 700 }}>
                    {po.total ? fmt$(po.total) : '—'}
                  </td>
                  <td style={{ padding: '12px', fontFamily: 'var(--font-condensed)', color: 'var(--color-muted)' }}>
                    {po.orderedOn}
                  </td>
                  <td style={{ padding: '12px', fontFamily: 'var(--font-condensed)' }}>
                    <span
                      style={{
                        color: po.status === 'late' ? '#8A1C16' : 'var(--color-text)',
                        fontWeight: po.status === 'late' ? 700 : 400,
                      }}
                    >
                      {po.expectedArrival}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <Pill status={po.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Notes row */}
        <div style={{ marginTop: 16, display: 'grid', gap: 8 }}>
          {rows
            .filter((p) => p.notes)
            .map((p) => (
              <div
                key={`${p.id}-note`}
                style={{
                  fontSize: 12,
                  color: 'var(--color-muted)',
                  padding: '8px 12px',
                  background: 'var(--color-surf2)',
                  borderRadius: 8,
                  borderLeft: `3px solid ${p.status === 'late' ? '#1B4DE6' : '#4FA8FF'}`,
                }}
              >
                <span style={{ fontFamily: 'var(--font-condensed)', fontWeight: 700, color: 'var(--color-text)' }}>
                  {p.id}:
                </span>{' '}
                {p.notes}
              </div>
            ))}
        </div>
      </Card>

      {/* Supplier performance */}
      <div style={{ marginTop: 20 }}>
        <Card>
          <SectionTitle>Supplier performance (trailing 90 days)</SectionTitle>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr
                  style={{
                    textAlign: 'left',
                    fontFamily: 'var(--font-condensed)',
                    fontSize: 11,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--color-muted)',
                    borderBottom: '1px solid var(--color-border)',
                  }}
                >
                  <th style={{ padding: '10px 12px' }}>Supplier</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>On-time %</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>Avg lead (days)</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>Open POs</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>Open $</th>
                  <th style={{ padding: '10px 12px' }}>Signal</th>
                </tr>
              </thead>
              <tbody>
                {SUPPLIER_PERF.map((s) => {
                  const flag =
                    s.onTimePct < 85
                      ? { bg: '#FDE2E0', fg: '#8A1C16', label: 'Reliability risk' }
                      : s.onTimePct < 95
                      ? { bg: '#FFF0D9', fg: '#8A5A0F', label: 'Watch' }
                      : { bg: '#DCF2E4', fg: '#165E36', label: 'Healthy' };
                  return (
                    <tr key={s.supplier} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '12px', fontWeight: 700 }}>{s.supplier}</td>
                      <td
                        style={{
                          padding: '12px',
                          textAlign: 'right',
                          fontFamily: 'var(--font-condensed)',
                          color: s.onTimePct < 85 ? '#8A1C16' : 'var(--color-text)',
                          fontWeight: 700,
                        }}
                      >
                        {s.onTimePct}%
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right', fontFamily: 'var(--font-condensed)' }}>
                        {s.avgLeadDays}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right', fontFamily: 'var(--font-condensed)' }}>
                        {s.openCount}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right', fontFamily: 'var(--font-condensed)' }}>
                        {s.openValue ? fmt$(s.openValue) : '—'}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span
                          style={{
                            background: flag.bg,
                            color: flag.fg,
                            padding: '3px 10px',
                            borderRadius: 999,
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                          }}
                        >
                          {flag.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Recommendation */}
      <div style={{ marginTop: 20 }}>
        <Card>
          <SectionTitle>Recommendation</SectionTitle>
          <div style={{ display: 'grid', gap: 10, fontSize: 14, lineHeight: 1.55 }}>
            <div>
              <strong>Escalate PO-2043 immediately.</strong> $75.2K stuck at LA/LB is the direct cause of the SSK-Z7-NVY-L
              stockout (11 days out). Every day of delay is an estimated{' '}
              <strong>$8.6K of lost gross profit</strong> on that SKU alone.
            </div>
            <div>
              <strong>Diversify Shenzhen Apparel Co.</strong> 78% on-time is concentrated in our top-revenue A-class SKUs.
              A secondary supplier on Z7 Tee (even at +8% unit cost) would de-risk Q3 buying.
            </div>
            <div>
              <strong>Hold the two draft POs.</strong> PO-2044 (Boundary Hoodie) and PO-2041 (Socks) are auto-suggested but
              flagged — both SKUs are already overstocked. Releasing them adds{' '}
              <strong>$196K in unnecessary inventory</strong> against the markdown plan.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
