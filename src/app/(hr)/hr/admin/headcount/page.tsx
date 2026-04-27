'use client';

import Link from 'next/link';
import {
  HEADCOUNT_SUMMARY,
  HEADCOUNT_BY_DEPT,
  HEADCOUNT_TREND,
} from '@/lib/data/hr-data';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

const fmt$ = (n: number) =>
  n >= 1000 ? `$${(n / 1000).toFixed(0)}K` : `$${n.toLocaleString()}`;

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

export default function HeadcountPage() {
  const h = HEADCOUNT_SUMMARY;
  const gapColor = h.gapToPlan < -4 ? '#8A1C16' : h.gapToPlan < 0 ? '#8A5A0F' : '#165E36';

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
        <Link href="/hr/admin/dashboard" style={{ color: 'var(--color-muted)' }}>
          HR Admin
        </Link>{' '}
        &middot; Headcount
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
          Headcount Plan vs Actual
        </h1>
        <div style={{ color: 'var(--color-muted)', fontSize: 14 }}>
          {h.actualFte} FTE &middot; plan {h.planFte} &middot; {h.openReqs} open reqs &middot; {h.hiresYtd} hires YTD /{' '}
          {h.attritionYtd} attrition
        </div>
      </header>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 20 }}>
        {[
          { label: 'Actual FTE',         value: String(h.actualFte), sub: `Plan ${h.planFte}` },
          { label: 'Gap to plan',        value: `${h.gapToPlan}`, sub: `${h.openReqs} open reqs`, color: gapColor },
          { label: 'Voluntary attrition',value: `${h.voluntaryAttritionAnnualized}%`, sub: 'Annualized · bench 14%' },
          { label: 'Labor cost (mo)',    value: fmt$(h.laborCostMonthly), sub: `Budget ${fmt$(h.laborCostBudgetMonthly)}` },
          { label: 'Hires YTD',          value: String(h.hiresYtd), sub: `Net +${h.hiresYtd - h.attritionYtd}` },
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
            <div style={{ fontSize: 26, fontWeight: 900, marginTop: 4, color: kpi.color ?? 'var(--color-text)' }}>
              {kpi.value}
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 4 }}>{kpi.sub}</div>
          </Card>
        ))}
      </div>

      {/* Trend + dept breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 20, marginBottom: 20 }}>
        <Card>
          <SectionTitle>Trend · plan vs actual</SectionTitle>
          <div style={{ height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={HEADCOUNT_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-chart-grid)" />
                <XAxis dataKey="month" tick={{ fill: 'var(--color-chart-text)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'var(--color-chart-text)', fontSize: 11 }} domain={[70, 100]} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--color-surf)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 8,
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="plan"   name="Plan FTE"   stroke="#4FA8FF" strokeWidth={2.5} strokeDasharray="6 4" dot={{ r: 3 }} />
                <Line type="monotone" dataKey="actual" name="Actual FTE" stroke="#1D44BF" strokeWidth={3}   dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <SectionTitle>By department</SectionTitle>
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
                <th style={{ padding: '8px 6px' }}>Department</th>
                <th style={{ padding: '8px 6px', textAlign: 'right' }}>Plan</th>
                <th style={{ padding: '8px 6px', textAlign: 'right' }}>Actual</th>
                <th style={{ padding: '8px 6px', textAlign: 'right' }}>Gap</th>
                <th style={{ padding: '8px 6px', textAlign: 'right' }}>Open</th>
                <th style={{ padding: '8px 6px', textAlign: 'right' }}>Tenure</th>
                <th style={{ padding: '8px 6px', textAlign: 'right' }}>Attrit YTD</th>
              </tr>
            </thead>
            <tbody>
              {HEADCOUNT_BY_DEPT.map((d) => {
                const gap = d.actualFte - d.planFte;
                return (
                  <tr key={d.dept} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '10px 6px', fontWeight: 600 }}>{d.dept}</td>
                    <td style={{ padding: '10px 6px', textAlign: 'right', fontFamily: 'var(--font-condensed)' }}>
                      {d.planFte}
                    </td>
                    <td
                      style={{
                        padding: '10px 6px',
                        textAlign: 'right',
                        fontFamily: 'var(--font-condensed)',
                        fontWeight: 700,
                      }}
                    >
                      {d.actualFte}
                    </td>
                    <td
                      style={{
                        padding: '10px 6px',
                        textAlign: 'right',
                        fontFamily: 'var(--font-condensed)',
                        fontWeight: 700,
                        color: gap < 0 ? '#8A5A0F' : gap > 0 ? '#165E36' : 'var(--color-muted)',
                      }}
                    >
                      {gap > 0 ? '+' : ''}
                      {gap}
                    </td>
                    <td style={{ padding: '10px 6px', textAlign: 'right', fontFamily: 'var(--font-condensed)' }}>
                      {d.openReqs || '—'}
                    </td>
                    <td style={{ padding: '10px 6px', textAlign: 'right', fontFamily: 'var(--font-condensed)' }}>
                      {d.avgTenureYears}y
                    </td>
                    <td
                      style={{
                        padding: '10px 6px',
                        textAlign: 'right',
                        fontFamily: 'var(--font-condensed)',
                        color: d.attritionYtd >= 2 ? '#8A5A0F' : 'var(--color-text)',
                      }}
                    >
                      {d.attritionYtd}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      </div>

      <Card>
        <SectionTitle>Recommendation</SectionTitle>
        <div style={{ display: 'grid', gap: 12, fontSize: 14, lineHeight: 1.55 }}>
          <div>
            <strong>CS and Retail are the two-headed shortage.</strong> CS is 2 below plan against a stockout-driven
            ticket spike (see Support Queue trend). Retail is 2 below just as the Atlanta store ramps. Prioritize
            filling R-4215 (CS Lead) and R-4245/R-4248 (Atlanta retail) this month.
          </div>
          <div>
            <strong>We&apos;re $67.5K/mo under labor budget.</strong> That&apos;s capacity to accelerate the Engineering
            L5 backfill (R-4201) without needing a budget adjustment — which also unlocks the Q3 roadmap we promised
            the board.
          </div>
          <div>
            <strong>11% voluntary attrition is well inside bench (14%).</strong> Holds as a green signal as long as
            eNPS stays above 30 (see Engagement page — currently 42).
          </div>
        </div>
      </Card>
    </div>
  );
}
