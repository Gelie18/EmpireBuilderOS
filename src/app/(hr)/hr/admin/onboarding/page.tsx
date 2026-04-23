'use client';

import Link from 'next/link';
import { ONBOARDING_COHORT, type OnboardingHire } from '@/lib/data/hr-data';

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

const STATUS_STYLE: Record<OnboardingHire['status'], { bg: string; fg: string; label: string }> = {
  'on-track': { bg: '#DCF2E4', fg: '#165E36', label: 'On track' },
  'at-risk':  { bg: '#FBE0DE', fg: '#8A1C16', label: 'At risk' },
  complete:   { bg: '#E9EDF3', fg: '#4A5464', label: 'Complete' },
};

const CHECKLIST = [
  'I-9 + W4',
  'Benefits enrollment',
  'Laptop + accounts',
  'Handbook ack',
  'Manager 1:1 #1',
  'Manager 1:1 #2 (wk 2)',
  'Buddy assigned',
  '30-day goals set',
  '60-day check-in',
  '90-day review',
];

export default function OnboardingTrackerPage() {
  const onTrack = ONBOARDING_COHORT.filter((h) => h.status === 'on-track').length;
  const atRisk = ONBOARDING_COHORT.filter((h) => h.status === 'at-risk').length;
  const complete = ONBOARDING_COHORT.filter((h) => h.status === 'complete').length;

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
        &middot; Onboarding
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
          Onboarding Tracker
        </h1>
        <div style={{ color: 'var(--color-muted)', fontSize: 14 }}>
          {ONBOARDING_COHORT.length} recent hires &middot; {onTrack} on track &middot; {atRisk} at risk &middot;{' '}
          {complete} complete
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
        {[
          { label: 'In progress', value: String(ONBOARDING_COHORT.length - complete), sub: `${atRisk} at risk`, tone: (atRisk > 0 ? 'warn' : 'good') as 'warn' | 'good' },
          { label: 'Completed 90d', value: String(complete), sub: '100% completed' },
          { label: 'Avg 30-day checklist', value: '82%', sub: 'target 95%', tone: 'warn' as const },
          { label: '90-day retention', value: '100%', sub: 'trailing 6 months', tone: 'good' as const },
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

      <div style={{ display: 'grid', gap: 14 }}>
        {ONBOARDING_COHORT.map((h) => {
          const s = STATUS_STYLE[h.status];
          const barColor = h.status === 'at-risk' ? '#1B4DE6' : h.status === 'complete' ? '#5D6B7F' : '#2DB47A';
          return (
            <Card key={h.id}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  gap: 24,
                  marginBottom: 14,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
                    <h3 style={{ fontSize: 20, fontWeight: 900, margin: 0 }}>{h.name}</h3>
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
                  </div>
                  <div style={{ color: 'var(--color-muted)', fontSize: 13, marginTop: 4 }}>
                    {h.title} · {h.dept} · started {h.startDate} (day {h.dayInJob})
                  </div>
                </div>
                <div style={{ minWidth: 200 }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-condensed)',
                      fontSize: 11,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'var(--color-muted)',
                      marginBottom: 4,
                    }}
                  >
                    Checklist · {h.checklistPct}%
                  </div>
                  <div
                    style={{
                      height: 10,
                      background: 'var(--color-surf2)',
                      borderRadius: 5,
                    }}
                  >
                    <div
                      style={{
                        width: `${h.checklistPct}%`,
                        height: '100%',
                        background: barColor,
                        borderRadius: 5,
                      }}
                    />
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 6 }}>
                    Manager check-ins: {h.mgrCheckins} / {h.mgrCheckinsTarget}
                  </div>
                </div>
              </div>

              {/* Checklist rows */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, 1fr)',
                  gap: 6,
                  marginTop: 8,
                }}
              >
                {CHECKLIST.map((item, i) => {
                  const pct = h.checklistPct;
                  const stepPct = (i + 1) * 10;
                  const complete = pct >= stepPct;
                  const blocked = h.blockers.some((b) => item.toLowerCase().includes(b.toLowerCase().split(' ')[0]));
                  return (
                    <div
                      key={item}
                      style={{
                        padding: '6px 10px',
                        borderRadius: 6,
                        fontSize: 11,
                        fontFamily: 'var(--font-condensed)',
                        background: blocked
                          ? 'rgba(27, 77, 230, 0.1)'
                          : complete
                          ? 'rgba(45, 180, 122, 0.1)'
                          : 'var(--color-surf2)',
                        color: blocked
                          ? '#8A1C16'
                          : complete
                          ? '#165E36'
                          : 'var(--color-muted)',
                        border: blocked
                          ? '1px solid rgba(27, 77, 230, 0.3)'
                          : '1px solid transparent',
                        fontWeight: complete || blocked ? 700 : 400,
                      }}
                    >
                      {complete ? '✓ ' : blocked ? '! ' : '○ '}
                      {item}
                    </div>
                  );
                })}
              </div>

              {h.blockers.length > 0 && (
                <div
                  style={{
                    marginTop: 10,
                    padding: '8px 12px',
                    background: 'rgba(27, 77, 230, 0.05)',
                    borderLeft: '3px solid #1B4DE6',
                    borderRadius: 4,
                    fontSize: 12,
                  }}
                >
                  <strong style={{ color: '#8A1C16' }}>Blocker:</strong> {h.blockers.join(' · ')}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
