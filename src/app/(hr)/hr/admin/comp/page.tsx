'use client';

import Link from 'next/link';
import { COMP_BANDS } from '@/lib/data/hr-data';

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

export default function CompBandsPage() {
  const totalEmployees = COMP_BANDS.reduce((s, b) => s + b.currentInBand, 0);
  const totalUnderMin = COMP_BANDS.reduce((s, b) => s + b.underMinCount, 0);
  const avgRatio =
    COMP_BANDS.reduce((s, b) => s + b.femalePayRatio * b.currentInBand, 0) / totalEmployees;
  const atRiskBands = COMP_BANDS.filter((b) => b.femalePayRatio < 0.96);

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
        &middot; Compensation
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
          Comp Bands & Pay Equity
        </h1>
        <div style={{ color: 'var(--color-muted)', fontSize: 14 }}>
          {COMP_BANDS.length} bands &middot; {totalEmployees} employees &middot; {totalUnderMin} below band min
          &middot; {atRiskBands.length} equity flags
        </div>
      </header>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
        {[
          { label: 'Avg F:M pay ratio', value: avgRatio.toFixed(3), sub: '1.000 = parity', tone: (avgRatio >= 0.97 ? 'good' : 'warn') as 'good' | 'warn' },
          { label: 'Below band min',    value: String(totalUnderMin), sub: 'Adjustment candidates', tone: (totalUnderMin > 0 ? 'warn' : 'good') as 'good' | 'warn' },
          { label: 'Bands with equity flag', value: String(atRiskBands.length), sub: '<0.96 F:M ratio', tone: atRiskBands.length > 0 ? 'warn' as const : 'good' as const },
          { label: 'Total employees in bands', value: String(totalEmployees), sub: `${COMP_BANDS.length} distinct levels` },
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

      {/* Bands table */}
      <Card>
        <SectionTitle>Bands · range & parity</SectionTitle>
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
              <th style={{ padding: '8px 10px' }}>Level</th>
              <th style={{ padding: '8px 10px' }}>Title</th>
              <th style={{ padding: '8px 10px' }}>Dept</th>
              <th style={{ padding: '8px 10px', textAlign: 'right' }}>Min</th>
              <th style={{ padding: '8px 10px', textAlign: 'right' }}>Mid</th>
              <th style={{ padding: '8px 10px', textAlign: 'right' }}>Max</th>
              <th style={{ padding: '8px 10px', textAlign: 'right' }}># Emp</th>
              <th style={{ padding: '8px 10px', textAlign: 'right' }}>Below min</th>
              <th style={{ padding: '8px 10px' }}>F:M ratio</th>
            </tr>
          </thead>
          <tbody>
            {COMP_BANDS.map((b) => {
              const ratioColor = b.femalePayRatio >= 0.98 ? '#165E36' : b.femalePayRatio >= 0.96 ? '#8A5A0F' : '#8A1C16';
              return (
                <tr key={b.level + b.title} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '12px 10px', fontFamily: 'var(--font-condensed)', fontWeight: 700 }}>
                    {b.level}
                  </td>
                  <td style={{ padding: '12px 10px', fontWeight: 600 }}>{b.title}</td>
                  <td style={{ padding: '12px 10px', fontFamily: 'var(--font-condensed)', color: 'var(--color-muted)' }}>
                    {b.dept}
                  </td>
                  <td style={{ padding: '12px 10px', textAlign: 'right', fontFamily: 'var(--font-condensed)' }}>
                    {fmt$(b.min)}
                  </td>
                  <td
                    style={{
                      padding: '12px 10px',
                      textAlign: 'right',
                      fontFamily: 'var(--font-condensed)',
                      fontWeight: 700,
                    }}
                  >
                    {fmt$(b.mid)}
                  </td>
                  <td style={{ padding: '12px 10px', textAlign: 'right', fontFamily: 'var(--font-condensed)' }}>
                    {fmt$(b.max)}
                  </td>
                  <td style={{ padding: '12px 10px', textAlign: 'right', fontFamily: 'var(--font-condensed)' }}>
                    {b.currentInBand}
                  </td>
                  <td
                    style={{
                      padding: '12px 10px',
                      textAlign: 'right',
                      fontFamily: 'var(--font-condensed)',
                      fontWeight: 700,
                      color: b.underMinCount > 0 ? '#8A1C16' : 'var(--color-muted)',
                    }}
                  >
                    {b.underMinCount || '—'}
                  </td>
                  <td style={{ padding: '12px 10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div
                        style={{
                          width: 80,
                          height: 6,
                          background: 'var(--color-surf2)',
                          borderRadius: 3,
                          position: 'relative',
                        }}
                      >
                        <div
                          style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            height: '100%',
                            width: `${Math.min(100, b.femalePayRatio * 100)}%`,
                            background: ratioColor,
                            borderRadius: 3,
                          }}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            left: '100%',
                            top: -2,
                            width: 1,
                            height: 10,
                            background: 'var(--color-text)',
                            opacity: 0.3,
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontFamily: 'var(--font-condensed)',
                          fontWeight: 700,
                          color: ratioColor,
                        }}
                      >
                        {b.femalePayRatio.toFixed(2)}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      <div style={{ marginTop: 20 }}>
        <Card>
          <SectionTitle>Actions</SectionTitle>
          <div style={{ display: 'grid', gap: 12, fontSize: 14, lineHeight: 1.55 }}>
            <div>
              <strong>Budget ~$68K for band-floor adjustments.</strong> 4 employees are currently below their band
              minimum (2 × CS Specialist, 1 × Ops Associate, 1 × Software Engineer). Bringing them to band min within
              the next payroll cycle closes an active legal risk.
            </div>
            <div>
              <strong>Engineering L4 pay ratio (0.94) is the top equity flag.</strong> Recommendation: audit all 7
              in-band employees for tenure-adjusted comp. Budget impact estimate $18–24K/year depending on findings.
            </div>
            <div>
              <strong>CS L3 (0.96) is on watch.</strong> Two of the 9 in this band are the below-min flags above —
              fixing the floor moves the ratio to ~0.98 automatically.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
