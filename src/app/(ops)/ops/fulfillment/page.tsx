'use client';

import Link from 'next/link';
import {
  FULFILLMENT_SLA,
  SLA_TREND_14D,
  CARRIER_PERF,
  FULFILLMENT_EXCEPTIONS,
} from '@/lib/data/ops-extras';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

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

function StatusDot({ ok }: { ok: boolean }) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: 8,
        height: 8,
        borderRadius: '50%',
        marginRight: 8,
        background: ok ? '#2DB47A' : '#1B4DE6',
      }}
    />
  );
}

const PRIORITY_COLOR = { high: '#8A1C16', med: '#8A5A0F', low: '#4A5464' };

export default function FulfillmentPage() {
  const sla = FULFILLMENT_SLA;

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
          CS Ops
        </Link>{' '}
        &middot; Fulfillment SLA
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
          Fulfillment SLA
        </h1>
        <div style={{ color: 'var(--color-muted)', fontSize: 14 }}>
          {sla.ordersMtd.toLocaleString()} orders MTD &middot; {sla.ordersYesterday.toLocaleString()} yesterday
          &middot; 5 open exceptions
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
          {
            label: 'Same-day ship',
            value: `${sla.actualSameDayPct}%`,
            target: `target ${sla.targetSameDayPct}%`,
            ok: sla.actualSameDayPct >= sla.targetSameDayPct,
          },
          {
            label: 'On-time delivery',
            value: `${sla.actualOnTimeDeliveryPct}%`,
            target: `target ${sla.targetOnTimeDeliveryPct}%`,
            ok: sla.actualOnTimeDeliveryPct >= sla.targetOnTimeDeliveryPct,
          },
          {
            label: 'Pick accuracy',
            value: `${sla.actualPickAccuracyPct}%`,
            target: `target ${sla.targetPickAccuracyPct}%`,
            ok: sla.actualPickAccuracyPct >= sla.targetPickAccuracyPct,
          },
          {
            label: 'Ship cost / order',
            value: `$${sla.avgShipCost.toFixed(2)}`,
            target: `budget $${sla.shipCostBudget.toFixed(2)}`,
            ok: sla.avgShipCost <= sla.shipCostBudget,
          },
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
            <div style={{ fontSize: 28, fontWeight: 900, marginTop: 4 }}>
              <StatusDot ok={kpi.ok} />
              {kpi.value}
            </div>
            <div
              style={{
                fontSize: 12,
                color: kpi.ok ? '#165E36' : '#8A1C16',
                marginTop: 4,
                fontWeight: 700,
              }}
            >
              {kpi.ok ? '✓ meeting' : '⚠ below'} {kpi.target}
            </div>
          </Card>
        ))}
      </div>

      {/* Trend chart */}
      <Card>
        <SectionTitle>14-day SLA trend</SectionTitle>
        <div style={{ height: 280 }}>
          <ResponsiveContainer>
            <ComposedChart data={SLA_TREND_14D}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-chart-grid)" />
              <XAxis dataKey="day" tick={{ fill: 'var(--color-chart-text)', fontSize: 11 }} />
              <YAxis yAxisId="left" domain={[85, 100]} tick={{ fill: 'var(--color-chart-text)', fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: 'var(--color-chart-text)', fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: 'var(--color-surf)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 8,
                }}
              />
              <Legend />
              <Bar yAxisId="right" dataKey="volume" name="Orders" fill="#E3F0FC" />
              <Line yAxisId="left" type="monotone" dataKey="sameDay" name="Same-day %" stroke="#1B4DE6" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line yAxisId="left" type="monotone" dataKey="otd" name="OTD %" stroke="#4FA8FF" strokeWidth={2.5} dot={{ r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Carrier perf + Exceptions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 20, marginTop: 20 }}>
        <Card>
          <SectionTitle>Carrier performance</SectionTitle>
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
                <th style={{ padding: '8px 6px' }}>Carrier</th>
                <th style={{ padding: '8px 6px', textAlign: 'right' }}>Vol %</th>
                <th style={{ padding: '8px 6px', textAlign: 'right' }}>OTD %</th>
                <th style={{ padding: '8px 6px', textAlign: 'right' }}>Avg days</th>
                <th style={{ padding: '8px 6px', textAlign: 'right' }}>$/order</th>
              </tr>
            </thead>
            <tbody>
              {CARRIER_PERF.map((c) => (
                <tr key={c.carrier} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '10px 6px', fontWeight: 600 }}>{c.carrier}</td>
                  <td style={{ padding: '10px 6px', textAlign: 'right', fontFamily: 'var(--font-condensed)' }}>
                    {c.volumeShare}%
                  </td>
                  <td
                    style={{
                      padding: '10px 6px',
                      textAlign: 'right',
                      fontFamily: 'var(--font-condensed)',
                      fontWeight: 700,
                      color: c.otdPct >= 96 ? '#165E36' : '#8A5A0F',
                    }}
                  >
                    {c.otdPct}%
                  </td>
                  <td style={{ padding: '10px 6px', textAlign: 'right', fontFamily: 'var(--font-condensed)' }}>
                    {c.avgDays}
                  </td>
                  <td style={{ padding: '10px 6px', textAlign: 'right', fontFamily: 'var(--font-condensed)' }}>
                    ${c.costPerOrder.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card>
          <SectionTitle>Active exceptions</SectionTitle>
          <div style={{ display: 'grid', gap: 10 }}>
            {FULFILLMENT_EXCEPTIONS.map((ex) => (
              <div
                key={ex.id}
                style={{
                  border: '1px solid var(--color-border)',
                  borderLeft: `3px solid ${PRIORITY_COLOR[ex.priority]}`,
                  borderRadius: 8,
                  padding: '12px 14px',
                  background: 'var(--color-surf2)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div style={{ fontFamily: 'var(--font-condensed)', fontWeight: 700 }}>
                    {ex.orderId} &middot; {ex.customer}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      fontFamily: 'var(--font-condensed)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: PRIORITY_COLOR[ex.priority],
                      fontWeight: 700,
                    }}
                  >
                    {ex.priority} &middot; {ex.age}
                  </div>
                </div>
                <div style={{ fontSize: 13, marginTop: 4 }}>{ex.issue}</div>
                <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 4, fontFamily: 'var(--font-condensed)' }}>
                  {ex.carrier} &middot; {ex.state}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
