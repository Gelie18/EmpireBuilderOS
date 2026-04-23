'use client';

import Link from 'next/link';
import {
  CUSTOMER_HEALTH,
  CUSTOMER_RISK_LIST,
  type CustomerRow,
} from '@/lib/data/ops-extras';

const fmt$ = (n: number) =>
  n >= 1000 ? `$${(n / 1000).toFixed(1)}K` : `$${n.toFixed(0)}`;

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

const RISK_COLOR: Record<CustomerRow['risk'], { bg: string; fg: string; label: string }> = {
  low:      { bg: '#DCF2E4', fg: '#165E36', label: 'Low risk' },
  medium:   { bg: '#FFF0D9', fg: '#8A5A0F', label: 'Watch' },
  high:     { bg: '#FBE0DE', fg: '#8A1C16', label: 'High risk' },
  critical: { bg: '#8A1C16', fg: '#FFFFFF', label: 'Critical' },
};

const TREND_ICON = { up: '↑', flat: '→', down: '↓' };

export default function CustomerHealthPage() {
  const h = CUSTOMER_HEALTH;

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
        &middot; Customer Health
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
          Customer Health & Churn
        </h1>
        <div style={{ color: 'var(--color-muted)', fontSize: 14 }}>
          {h.totalActive.toLocaleString()} active &middot; {h.newMtd.toLocaleString()} new MTD &middot;{' '}
          {h.churnedMtd} churned &middot; {h.cohortNetRevRetention12mo}% NRR
        </div>
      </header>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 20 }}>
        {[
          { label: 'Active customers', value: h.totalActive.toLocaleString(), sub: `+${h.newMtd.toLocaleString()} new MTD` },
          { label: 'LTV · DTC avg',    value: fmt$(h.ltvAvg),       sub: `${h.repeatPct}% repeat rate` },
          { label: 'LTV · B2B avg',    value: fmt$(h.ltvB2bAvg),    sub: '15.4× vs DTC' },
          { label: 'Churned (MTD)',    value: String(h.churnedMtd), sub: `${((h.churnedMtd / h.totalActive) * 100).toFixed(2)}% monthly`, tone: 'danger' as const },
          { label: 'NRR (12mo cohort)',value: `${h.cohortNetRevRetention12mo}%`, sub: 'bench: 100% flat', tone: 'good' as const },
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
                fontSize: 24,
                fontWeight: 900,
                marginTop: 4,
                color:
                  kpi.tone === 'good'
                    ? '#165E36'
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

      {/* At-risk list */}
      <Card>
        <SectionTitle>At-risk accounts (ranked by expected lost LTV)</SectionTitle>
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
              <th style={{ padding: '10px 12px' }}>Customer</th>
              <th style={{ padding: '10px 12px' }}>Segment</th>
              <th style={{ padding: '10px 12px', textAlign: 'right' }}>LTV</th>
              <th style={{ padding: '10px 12px' }}>Last order</th>
              <th style={{ padding: '10px 12px', textAlign: 'right' }}>Days idle</th>
              <th style={{ padding: '10px 12px', textAlign: 'right' }}>Orders L12M</th>
              <th style={{ padding: '10px 12px', textAlign: 'center' }}>Health</th>
              <th style={{ padding: '10px 12px', textAlign: 'center' }}>Trend</th>
              <th style={{ padding: '10px 12px' }}>Risk</th>
            </tr>
          </thead>
          <tbody>
            {CUSTOMER_RISK_LIST
              .sort((a, b) => {
                const riskOrder = { critical: 0, high: 1, medium: 2, low: 3 };
                if (riskOrder[a.risk] !== riskOrder[b.risk]) return riskOrder[a.risk] - riskOrder[b.risk];
                return b.ltv - a.ltv;
              })
              .map((c) => {
                const risk = RISK_COLOR[c.risk];
                const scoreColor =
                  c.healthScore >= 80
                    ? '#165E36'
                    : c.healthScore >= 60
                    ? '#8A5A0F'
                    : '#8A1C16';
                return (
                  <tr key={c.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: 700 }}>{c.name}</div>
                      <div style={{ color: 'var(--color-muted)', fontSize: 11, fontFamily: 'var(--font-condensed)' }}>
                        {c.id}
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span
                        style={{
                          background: 'var(--color-surf2)',
                          padding: '3px 10px',
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                        }}
                      >
                        {c.segment}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: '12px',
                        textAlign: 'right',
                        fontFamily: 'var(--font-condensed)',
                        fontWeight: 700,
                      }}
                    >
                      {fmt$(c.ltv)}
                    </td>
                    <td style={{ padding: '12px', fontFamily: 'var(--font-condensed)', fontSize: 12 }}>
                      {c.lastOrder}
                    </td>
                    <td
                      style={{
                        padding: '12px',
                        textAlign: 'right',
                        fontFamily: 'var(--font-condensed)',
                        color: c.daysSinceLast > 30 ? '#8A1C16' : 'var(--color-text)',
                        fontWeight: c.daysSinceLast > 30 ? 700 : 400,
                      }}
                    >
                      {c.daysSinceLast}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', fontFamily: 'var(--font-condensed)' }}>
                      {c.ordersL12M}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <div
                        style={{
                          fontFamily: 'var(--font-condensed)',
                          fontWeight: 900,
                          fontSize: 18,
                          color: scoreColor,
                        }}
                      >
                        {c.healthScore}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: '12px',
                        textAlign: 'center',
                        fontSize: 18,
                        fontWeight: 700,
                        color:
                          c.trend === 'up'
                            ? '#165E36'
                            : c.trend === 'down'
                            ? '#8A1C16'
                            : 'var(--color-muted)',
                      }}
                    >
                      {TREND_ICON[c.trend]}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span
                        style={{
                          background: risk.bg,
                          color: risk.fg,
                          padding: '3px 10px',
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                        }}
                      >
                        {risk.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </Card>

      {/* Action cards */}
      <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card>
          <SectionTitle>Recommended saves (this week)</SectionTitle>
          <div style={{ display: 'grid', gap: 12, fontSize: 14, lineHeight: 1.55 }}>
            <div>
              <strong>Flagstaff Field (C-1031) — critical.</strong> $12.9K LTV, 53 days idle, historically orders every
              28 days. Trigger a CEO-signed re-engagement with a 10% B2B credit + a look at the new Z7 Navy restock
              ETA. Expected recovery probability: 55%.
            </div>
            <div>
              <strong>Yost Sporting (C-1042) — high.</strong> Bulk order RMA still open (CS-8811). Resolve that ticket
              first — nothing else matters until the damaged case is credited. Then schedule a QBR for next week.
            </div>
            <div>
              <strong>D. Alvarez (C-4182) — high.</strong> VIP who hasn&apos;t ordered in 51 days. Send a personal
              hoodie restock note — they&apos;ve bought BGL-HOOD-GRY in every size over the last 18 months.
            </div>
          </div>
        </Card>

        <Card>
          <SectionTitle>Cohort retention snapshot</SectionTitle>
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
                <th style={{ padding: '8px 4px' }}>Cohort</th>
                <th style={{ padding: '8px 4px', textAlign: 'right' }}>M0</th>
                <th style={{ padding: '8px 4px', textAlign: 'right' }}>M3</th>
                <th style={{ padding: '8px 4px', textAlign: 'right' }}>M6</th>
                <th style={{ padding: '8px 4px', textAlign: 'right' }}>M12</th>
              </tr>
            </thead>
            <tbody>
              {[
                { c: 'Oct 2024', m0: 100, m3: 62, m6: 48, m12: 38 },
                { c: 'Nov 2024', m0: 100, m3: 64, m6: 51, m12: 41 },
                { c: 'Dec 2024', m0: 100, m3: 68, m6: 54, m12: 44 },
                { c: 'Jan 2025', m0: 100, m3: 66, m6: 52, m12: 42 },
                { c: 'Feb 2025', m0: 100, m3: 70, m6: 58, m12: 46 },
              ].map((row) => (
                <tr key={row.c} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '8px 4px', fontWeight: 600 }}>{row.c}</td>
                  <td style={{ padding: '8px 4px', textAlign: 'right', fontFamily: 'var(--font-condensed)' }}>{row.m0}%</td>
                  <td style={{ padding: '8px 4px', textAlign: 'right', fontFamily: 'var(--font-condensed)' }}>{row.m3}%</td>
                  <td style={{ padding: '8px 4px', textAlign: 'right', fontFamily: 'var(--font-condensed)' }}>{row.m6}%</td>
                  <td
                    style={{
                      padding: '8px 4px',
                      textAlign: 'right',
                      fontFamily: 'var(--font-condensed)',
                      fontWeight: 700,
                      color: row.m12 >= 43 ? '#165E36' : '#8A5A0F',
                    }}
                  >
                    {row.m12}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: 10, fontSize: 12, color: 'var(--color-muted)' }}>
            Feb 2025 cohort is our best since launch — 46% still ordering a year later. That&apos;s the profile to
            model Q3 acquisition against.
          </div>
        </Card>
      </div>
    </div>
  );
}
