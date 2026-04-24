'use client';

import Link from 'next/link';
import {
  RETURNS_SNAPSHOT,
  RETURN_REASON_MIX,
  RMA_LIST,
  type RmaRecord,
} from '@/lib/data/ops-extras';

const fmt$ = (n: number) =>
  n >= 1000 ? `$${(n / 1000).toFixed(1)}K` : `$${n.toLocaleString()}`;

function Card({ children }: { children: React.ReactNode }) {
  return (
    <section
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

const STATUS_STYLE: Record<RmaRecord['status'], { bg: string; fg: string; label: string }> = {
  requested:          { bg: '#E9EDF3', fg: '#4A5464', label: 'Requested' },
  'label-sent':       { bg: '#DCE9FF', fg: '#1B4DA8', label: 'Label sent' },
  'in-transit':       { bg: '#FFF0D9', fg: '#8A5A0F', label: 'In transit' },
  received:           { bg: '#E3F2E8', fg: '#206A3F', label: 'Received' },
  inspecting:         { bg: '#FFF0D9', fg: '#8A5A0F', label: 'Inspecting' },
  refunded:           { bg: '#D9F0E3', fg: '#165E36', label: 'Refunded' },
  denied:             { bg: '#FDE2E0', fg: '#8A1C16', label: 'Denied' },
};

export default function ReturnsPage() {
  const r = RETURNS_SNAPSHOT;
  const rateChange = r.mtdReturnRate - r.mtdReturnRatePriorMonth;

  return (
    <div style={{ padding: '24px 28px 60px', maxWidth: 1400, margin: '0 auto' }}>
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
        <Link href="/ops" style={{ color: 'var(--color-muted)' }}>
          Ops OS
        </Link>{' '}
        &middot; Returns / RMA
      </div>

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
          Returns & RMA
        </h1>
        <div style={{ color: 'var(--color-muted)', fontSize: 14 }}>
          {r.activeRmas} active RMAs &middot; {r.mtdReturnRate}% return rate &middot; avg processing{' '}
          {r.avgProcessingDays} days
        </div>
      </header>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
        {[
          { label: 'Active RMAs', value: String(r.activeRmas), sub: 'all stages' },
          {
            label: 'Return rate (MTD)',
            value: `${r.mtdReturnRate}%`,
            sub: `${rateChange > 0 ? '+' : ''}${rateChange.toFixed(1)}pp vs prior`,
            tone: (rateChange < 0 ? 'good' : 'warn') as 'good' | 'warn',
          },
          { label: 'Refunds issued', value: fmt$(r.refundsMtd), sub: 'MTD', tone: 'danger' as const },
          { label: 'Restocked value', value: fmt$(r.restockedValueMtd), sub: `${fmt$(r.destroyedValueMtd)} destroyed`, tone: 'good' as const },
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
                color:
                  kpi.tone === 'good'
                    ? '#165E36'
                    : kpi.tone === 'warn'
                    ? '#8A5A0F'
                    : kpi.tone === 'danger'
                    ? '#8A1C16'
                    : 'var(--color-text)',
              }}
            >
              {kpi.value}
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 4 }}>{kpi.sub}</div>
          </Card>
        ))}
      </div>

      {/* Reason mix + pipeline */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <Card>
          <SectionTitle>Return reason mix (MTD)</SectionTitle>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <tbody>
              {RETURN_REASON_MIX.map((row) => (
                <tr key={row.reason} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '10px 0', fontWeight: 600, width: '45%' }}>{row.reason}</td>
                  <td style={{ padding: '10px 0', width: '40%' }}>
                    <div style={{ height: 8, background: 'var(--color-surf2)', borderRadius: 4 }}>
                      <div
                        style={{
                          width: `${row.share * 2.5}%`,
                          height: '100%',
                          background: '#1B4DE6',
                          borderRadius: 4,
                        }}
                      />
                    </div>
                  </td>
                  <td
                    style={{
                      padding: '10px 0',
                      textAlign: 'right',
                      fontFamily: 'var(--font-condensed)',
                      fontWeight: 700,
                      width: '8%',
                    }}
                  >
                    {row.share}%
                  </td>
                  <td
                    style={{
                      padding: '10px 0',
                      textAlign: 'right',
                      fontFamily: 'var(--font-condensed)',
                      fontSize: 11,
                      color: 'var(--color-muted)',
                      width: '12%',
                    }}
                  >
                    {row.avgDaysToReturn}d avg
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card>
          <SectionTitle>Pipeline funnel</SectionTitle>
          <div style={{ display: 'grid', gap: 10 }}>
            {[
              { stage: 'Requested',   count: 32, pct: 100 },
              { stage: 'Label sent',  count: 28, pct: 87 },
              { stage: 'In transit',  count: 24, pct: 75 },
              { stage: 'Received',    count: 20, pct: 62 },
              { stage: 'Inspected',   count: 17, pct: 53 },
              { stage: 'Refunded',    count: 16, pct: 50 },
            ].map((stage) => (
              <div
                key={stage.stage}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 100,
                    fontSize: 13,
                    fontWeight: 600,
                    fontFamily: 'var(--font-condensed)',
                  }}
                >
                  {stage.stage}
                </div>
                <div
                  style={{
                    flex: 1,
                    height: 22,
                    background: 'var(--color-surf2)',
                    borderRadius: 4,
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      width: `${stage.pct}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #1B4DE6, #4FA8FF)',
                      borderRadius: 4,
                    }}
                  />
                </div>
                <div
                  style={{
                    width: 40,
                    textAlign: 'right',
                    fontFamily: 'var(--font-condensed)',
                    fontWeight: 700,
                  }}
                >
                  {stage.count}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* RMA table */}
      <Card>
        <SectionTitle>Active RMAs</SectionTitle>
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
              <th style={{ padding: '8px 10px' }}>RMA</th>
              <th style={{ padding: '8px 10px' }}>Order</th>
              <th style={{ padding: '8px 10px' }}>Customer</th>
              <th style={{ padding: '8px 10px' }}>SKU</th>
              <th style={{ padding: '8px 10px', textAlign: 'right' }}>Qty</th>
              <th style={{ padding: '8px 10px' }}>Reason</th>
              <th style={{ padding: '8px 10px' }}>Status</th>
              <th style={{ padding: '8px 10px', textAlign: 'right' }}>Refund</th>
              <th style={{ padding: '8px 10px' }}>Age</th>
            </tr>
          </thead>
          <tbody>
            {RMA_LIST.map((rma) => {
              const s = STATUS_STYLE[rma.status];
              return (
                <tr key={rma.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '12px 10px', fontFamily: 'var(--font-condensed)', fontWeight: 700 }}>
                    {rma.id}
                  </td>
                  <td style={{ padding: '12px 10px', fontFamily: 'var(--font-condensed)', fontSize: 12 }}>
                    {rma.orderId}
                  </td>
                  <td style={{ padding: '12px 10px' }}>{rma.customer}</td>
                  <td style={{ padding: '12px 10px', fontFamily: 'var(--font-condensed)', fontSize: 12 }}>
                    {rma.sku}
                  </td>
                  <td style={{ padding: '12px 10px', textAlign: 'right', fontFamily: 'var(--font-condensed)' }}>
                    {rma.qty}
                  </td>
                  <td style={{ padding: '12px 10px', fontSize: 12 }}>{rma.reason}</td>
                  <td style={{ padding: '12px 10px' }}>
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
                      }}
                    >
                      {s.label}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: '12px 10px',
                      textAlign: 'right',
                      fontFamily: 'var(--font-condensed)',
                      fontWeight: 700,
                      color: rma.refundAmount === 0 ? 'var(--color-muted)' : '#8A1C16',
                    }}
                  >
                    {rma.refundAmount ? fmt$(rma.refundAmount) : '—'}
                  </td>
                  <td style={{ padding: '12px 10px', fontFamily: 'var(--font-condensed)', color: 'var(--color-muted)' }}>
                    {rma.age}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
