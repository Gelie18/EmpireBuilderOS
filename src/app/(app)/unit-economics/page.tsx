'use client';

import Link from 'next/link';
import { UNIT_ECONOMICS, UE_BY_CHANNEL, UE_COHORTS } from '@/lib/data/finance-extras';

const fmt$ = (n: number) => `$${n.toLocaleString()}`;

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

export default function UnitEconomicsPage() {
  const u = UNIT_ECONOMICS;

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
        <Link href="/dashboard" style={{ color: 'var(--color-muted)' }}>
          Finance
        </Link>{' '}
        &middot; Unit Economics
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
          Unit Economics · CAC & LTV
        </h1>
        <div style={{ color: 'var(--color-muted)', fontSize: 14 }}>
          {u.periodLabel} &middot; blended CAC {fmt$(u.blendedCac)} &middot; LTV {fmt$(u.ltv)} &middot; payback {u.paybackMonths.toFixed(1)} months
        </div>
      </header>

      {/* Top-level KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
        {[
          { label: 'Blended CAC', value: fmt$(u.blendedCac), sub: `Paid ${fmt$(u.paidCac)} · Organic ${fmt$(u.organicCac)}` },
          { label: 'LTV (contribution)', value: fmt$(u.ltv), sub: `${(u.lifetimeGrossMargin * 100).toFixed(0)}% lifetime margin` },
          { label: 'LTV : CAC', value: `${u.ltvCacRatio.toFixed(1)}x`, sub: 'target ≥ 3.0x', tone: (u.ltvCacRatio >= 3 ? 'good' : 'warn') as 'good' | 'warn' },
          { label: 'Payback', value: `${u.paybackMonths.toFixed(1)} mo`, sub: `target ≤ ${u.targetPaybackMonths.toFixed(0)} mo`, tone: (u.paybackMonths <= u.targetPaybackMonths ? 'good' : 'warn') as 'good' | 'warn' },
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
                color: kpi.tone === 'good' ? '#165E36' : kpi.tone === 'warn' ? '#8A5A0F' : 'var(--color-text)',
              }}
            >
              {kpi.value}
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 4 }}>{kpi.sub}</div>
          </Card>
        ))}
      </div>

      {/* LTV build */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <Card>
          <SectionTitle>LTV build</SectionTitle>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <tbody>
              {[
                ['AOV',                             fmt$(u.aov) + '' ],
                ['First-order gross margin',        `${(u.firstOrderMargin * 100).toFixed(0)}%`],
                ['Avg orders per customer',         u.avgOrdersPerCustomer.toFixed(1) + 'x'],
                ['Lifetime gross margin (blended)', `${(u.lifetimeGrossMargin * 100).toFixed(0)}%`],
                ['Repeat rate (12 mo)',             `${(u.repeatRate * 100).toFixed(0)}%`],
                ['Resulting LTV (contribution)',    fmt$(u.ltv)],
              ].map(([label, val], i, arr) => (
                <tr key={label} style={{ borderBottom: i === arr.length - 1 ? 'none' : '1px solid var(--color-border)' }}>
                  <td style={{ padding: '10px 0', fontWeight: i === arr.length - 1 ? 700 : 500 }}>{label}</td>
                  <td style={{ padding: '10px 0', textAlign: 'right', fontFamily: 'var(--font-condensed)', fontWeight: i === arr.length - 1 ? 900 : 600, fontSize: i === arr.length - 1 ? 16 : 13 }}>
                    {val}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card>
          <SectionTitle>CAC payback build</SectionTitle>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <tbody>
              {[
                ['CAC (blended)',                 fmt$(u.blendedCac)],
                ['Contribution per first order',  fmt$(Math.round(u.aov * u.firstOrderMargin))],
                ['First-order payback',           `${(u.blendedCac / (u.aov * u.firstOrderMargin)).toFixed(2)} orders`],
                ['Annualized contribution / cust',fmt$(Math.round(u.aov * u.firstOrderMargin * u.avgOrdersPerCustomer))],
                ['Payback months',                `${u.paybackMonths.toFixed(1)} mo`],
              ].map(([label, val], i, arr) => (
                <tr key={label} style={{ borderBottom: i === arr.length - 1 ? 'none' : '1px solid var(--color-border)' }}>
                  <td style={{ padding: '10px 0', fontWeight: i === arr.length - 1 ? 700 : 500 }}>{label}</td>
                  <td style={{ padding: '10px 0', textAlign: 'right', fontFamily: 'var(--font-condensed)', fontWeight: i === arr.length - 1 ? 900 : 600, fontSize: i === arr.length - 1 ? 16 : 13 }}>
                    {val}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {/* By channel */}
      <Card>
        <SectionTitle>Unit economics by channel</SectionTitle>
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
              <th style={{ padding: '8px 10px' }}>Channel</th>
              <th style={{ padding: '8px 10px', textAlign: 'right' }}>CAC</th>
              <th style={{ padding: '8px 10px', textAlign: 'right' }}>LTV</th>
              <th style={{ padding: '8px 10px', textAlign: 'right' }}>Ratio</th>
              <th style={{ padding: '8px 10px', textAlign: 'right' }}>Spend share</th>
              <th style={{ padding: '8px 10px', textAlign: 'right' }}>Orders (TTM)</th>
              <th style={{ padding: '8px 10px' }}>Verdict</th>
            </tr>
          </thead>
          <tbody>
            {UE_BY_CHANNEL.map((c) => {
              const ratioColor = c.ratio >= 3 ? '#165E36' : c.ratio >= 1.5 ? '#8A5A0F' : '#8A1C16';
              const verdict = c.ratio >= 5 ? 'Scale up' : c.ratio >= 3 ? 'Healthy' : c.ratio >= 1.5 ? 'Watch' : 'Cut';
              const verdictColor = c.ratio >= 3 ? '#165E36' : c.ratio >= 1.5 ? '#8A5A0F' : '#8A1C16';
              return (
                <tr key={c.channel} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '10px 10px', fontWeight: 600 }}>{c.channel}</td>
                  <td style={{ padding: '10px 10px', textAlign: 'right', fontFamily: 'var(--font-condensed)' }}>{fmt$(c.cac)}</td>
                  <td style={{ padding: '10px 10px', textAlign: 'right', fontFamily: 'var(--font-condensed)' }}>{fmt$(c.ltv)}</td>
                  <td style={{ padding: '10px 10px', textAlign: 'right', fontFamily: 'var(--font-condensed)', fontWeight: 700, color: ratioColor }}>
                    {c.ratio.toFixed(1)}x
                  </td>
                  <td style={{ padding: '10px 10px', textAlign: 'right', fontFamily: 'var(--font-condensed)' }}>
                    {(c.spendShare * 100).toFixed(0)}%
                  </td>
                  <td style={{ padding: '10px 10px', textAlign: 'right', fontFamily: 'var(--font-condensed)' }}>
                    {c.orders.toLocaleString()}
                  </td>
                  <td style={{ padding: '10px 10px' }}>
                    <span
                      style={{
                        background: 'var(--color-surf2)',
                        color: verdictColor,
                        padding: '2px 10px',
                        borderRadius: 999,
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        border: `1px solid ${verdictColor}40`,
                      }}
                    >
                      {verdict}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      {/* Cohort retention */}
      <div style={{ marginTop: 20 }}>
        <Card>
          <SectionTitle>Cohort retention (% of initial customers still active)</SectionTitle>
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
                <th style={{ padding: '8px 10px' }}>Cohort</th>
                <th style={{ padding: '8px 10px', textAlign: 'right' }}>M0</th>
                <th style={{ padding: '8px 10px', textAlign: 'right' }}>M3</th>
                <th style={{ padding: '8px 10px', textAlign: 'right' }}>M6</th>
                <th style={{ padding: '8px 10px', textAlign: 'right' }}>M12</th>
                <th style={{ padding: '8px 10px', textAlign: 'right' }}>Rev / customer</th>
              </tr>
            </thead>
            <tbody>
              {UE_COHORTS.map((r) => {
                const cell = (v: number | null) => {
                  if (v === null) return <span style={{ color: 'var(--color-muted)' }}>—</span>;
                  const intensity = Math.min(1, v / 100);
                  return (
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '2px 12px',
                        borderRadius: 4,
                        background: `rgba(27, 77, 230, ${intensity * 0.22})`,
                        fontFamily: 'var(--font-condensed)',
                        fontWeight: 700,
                      }}
                    >
                      {v}%
                    </span>
                  );
                };
                return (
                  <tr key={r.cohort} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '10px 10px', fontFamily: 'var(--font-condensed)', fontWeight: 700 }}>{r.cohort}</td>
                    <td style={{ padding: '10px 10px', textAlign: 'right' }}>{cell(r.m0)}</td>
                    <td style={{ padding: '10px 10px', textAlign: 'right' }}>{cell(r.m3)}</td>
                    <td style={{ padding: '10px 10px', textAlign: 'right' }}>{cell(r.m6)}</td>
                    <td style={{ padding: '10px 10px', textAlign: 'right' }}>{cell(r.m12)}</td>
                    <td style={{ padding: '10px 10px', textAlign: 'right', fontFamily: 'var(--font-condensed)', fontWeight: 700 }}>
                      {r.revPerCust !== null ? fmt$(r.revPerCust) : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      </div>

      <div style={{ marginTop: 20 }}>
        <Card>
          <SectionTitle>So what?</SectionTitle>
          <div style={{ display: 'grid', gap: 12, fontSize: 14, lineHeight: 1.55 }}>
            <div>
              <strong>Scale email/SMS and organic hard.</strong> Both deliver 12–32x LTV:CAC — every dollar shifted from paid social (2.3x)
              grows contribution. Current spend split (42% paid social vs 4% email) leaves money on the table.
            </div>
            <div>
              <strong>Paid social (2.3x LTV:CAC) is underwater on blended margin.</strong> Not catastrophic — retention recovers the unit —
              but payback at 6.2 months on that channel exceeds the 6-month target. Audit creative fatigue and consider a 20% cut.
            </div>
            <div>
              <strong>Cohort retention is steadily improving.</strong> 2025 Q1 retained 70% at M3 vs 62% in 2024 Q2. Product quality and
              post-purchase email flow improvements are compounding — protect that work.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
