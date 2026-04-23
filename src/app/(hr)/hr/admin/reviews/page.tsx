'use client';

import Link from 'next/link';
import { REVIEW_CYCLE, REVIEW_BY_DEPT } from '@/lib/data/hr-data';

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

export default function ReviewCyclePage() {
  const c = REVIEW_CYCLE;
  const selfPct = Math.round((c.selfReviewsSubmitted / c.totalEmployees) * 100);
  const mgrPct = Math.round((c.managerReviewsSubmitted / c.totalEmployees) * 100);
  const distLabels: Array<keyof typeof c.distributionActual> = ['exceptional', 'exceeds', 'meets', 'partiallyMeets', 'belowExpect'];
  const distTitles = {
    exceptional: 'Exceptional',
    exceeds: 'Exceeds',
    meets: 'Meets',
    partiallyMeets: 'Partially meets',
    belowExpect: 'Below',
  };

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
        &middot; Performance Review
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
          Performance Review · {c.cycleName}
        </h1>
        <div style={{ color: 'var(--color-muted)', fontSize: 14 }}>
          Opened {c.startedOn} &middot; closes {c.closesOn} &middot; {c.totalEmployees} reviews
        </div>
      </header>

      {/* Progress KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
        {[
          { label: 'Self-reviews in', value: `${selfPct}%`, sub: `${c.selfReviewsSubmitted} / ${c.totalEmployees}` },
          { label: 'Manager reviews in', value: `${mgrPct}%`, sub: `${c.managerReviewsSubmitted} / ${c.totalEmployees}`, tone: (mgrPct < 60 ? 'warn' : 'good') as 'warn' | 'good' },
          { label: 'Peer reviews submitted', value: String(c.peerReviewsSubmitted), sub: `target ${c.totalEmployees * 3}` },
          { label: 'Calibration meetings', value: `${c.calibrationMeetingsHeld} / ${c.calibrationMeetingsScheduled}`, sub: 'By dept' },
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

      {/* By dept + distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 20, marginBottom: 20 }}>
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
                <th style={{ padding: '8px 6px' }}>Dept</th>
                <th style={{ padding: '8px 6px', textAlign: 'right' }}># Emp</th>
                <th style={{ padding: '8px 6px' }}>Self</th>
                <th style={{ padding: '8px 6px' }}>Peer</th>
                <th style={{ padding: '8px 6px' }}>Manager</th>
              </tr>
            </thead>
            <tbody>
              {REVIEW_BY_DEPT.map((d) => (
                <tr key={d.dept} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '10px 6px', fontWeight: 600 }}>{d.dept}</td>
                  <td style={{ padding: '10px 6px', textAlign: 'right', fontFamily: 'var(--font-condensed)' }}>
                    {d.totalEmployees}
                  </td>
                  {(['selfReviewsPct', 'peerReviewsPct', 'managerReviewsPct'] as const).map((k) => {
                    const v = d[k];
                    const color = v >= 80 ? '#165E36' : v >= 50 ? '#8A5A0F' : '#8A1C16';
                    return (
                      <td key={k} style={{ padding: '10px 6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div
                            style={{
                              flex: 1,
                              height: 7,
                              background: 'var(--color-surf2)',
                              borderRadius: 4,
                            }}
                          >
                            <div
                              style={{
                                width: `${v}%`,
                                height: '100%',
                                background: color,
                                borderRadius: 4,
                              }}
                            />
                          </div>
                          <span
                            style={{
                              width: 32,
                              fontFamily: 'var(--font-condensed)',
                              fontWeight: 700,
                              fontSize: 12,
                              color,
                              textAlign: 'right',
                            }}
                          >
                            {v}%
                          </span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card>
          <SectionTitle>Rating distribution (manager calibrated)</SectionTitle>
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
                <th style={{ padding: '8px 0' }}>Rating</th>
                <th style={{ padding: '8px 0', textAlign: 'right' }}>Target</th>
                <th style={{ padding: '8px 0', textAlign: 'right' }}>Actual</th>
                <th style={{ padding: '8px 0', textAlign: 'right' }}>Δ</th>
              </tr>
            </thead>
            <tbody>
              {distLabels.map((k) => {
                const target = c.distributionTarget[k];
                const actual = c.distributionActual[k];
                const delta = actual - target;
                const deltaColor = Math.abs(delta) <= 3 ? 'var(--color-muted)' : delta > 0 ? '#165E36' : '#8A1C16';
                return (
                  <tr key={k} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '10px 0', fontWeight: 600 }}>{distTitles[k]}</td>
                    <td style={{ padding: '10px 0', textAlign: 'right', fontFamily: 'var(--font-condensed)', color: 'var(--color-muted)' }}>
                      {target}%
                    </td>
                    <td
                      style={{
                        padding: '10px 0',
                        textAlign: 'right',
                        fontFamily: 'var(--font-condensed)',
                        fontWeight: 700,
                      }}
                    >
                      {actual}%
                    </td>
                    <td
                      style={{
                        padding: '10px 0',
                        textAlign: 'right',
                        fontFamily: 'var(--font-condensed)',
                        fontWeight: 700,
                        color: deltaColor,
                      }}
                    >
                      {delta > 0 ? '+' : ''}
                      {delta}pp
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      </div>

      <Card>
        <SectionTitle>What needs attention this week</SectionTitle>
        <div style={{ display: 'grid', gap: 12, fontSize: 14, lineHeight: 1.55 }}>
          <div>
            <strong>Retail and Marketing are lagging.</strong> Retail self-review completion is 38% and Marketing is
            57% with 22 days left. Send automated reminders Friday, then manager nudges Monday.
          </div>
          <div>
            <strong>Marketing manager reviews are critically behind (28%).</strong> Only 2 of 7 managers have
            submitted. Escalate to the VP — calibration can&apos;t happen without these.
          </div>
          <div>
            <strong>Calibration schedule: 4 meetings still need to book.</strong> Engineering and Product are held;
            Ops, CS, Retail, and Marketing are still outstanding. Target all four on calendar by end of week.
          </div>
        </div>
      </Card>
    </div>
  );
}
