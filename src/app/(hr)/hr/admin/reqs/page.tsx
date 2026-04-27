'use client';

import Link from 'next/link';
import { OPEN_REQS } from '@/lib/data/hr-data';

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

const STAGE_ORDER = ['applied', 'screened', 'phone-screen', 'on-site', 'offer', 'accepted'];

const STAGE_COLOR: Record<string, { bg: string; fg: string; label: string }> = {
  sourcing:       { bg: '#E9EDF3', fg: '#4A5464', label: 'Sourcing' },
  'phone-screen': { bg: '#E3F0FC', fg: '#1B4DA8', label: 'Phone screen' },
  'on-site':      { bg: '#FFF0D9', fg: '#8A5A0F', label: 'On-site' },
  offer:          { bg: '#DCF2E4', fg: '#165E36', label: 'Offer out' },
  accepted:       { bg: '#1D44BF', fg: '#FFFFFF', label: 'Accepted' },
};

const PRIORITY_COLOR = { high: '#8A1C16', med: '#8A5A0F', low: '#4A5464' };

export default function OpenReqsPage() {
  const totalApplied = OPEN_REQS.reduce((s, r) => s + (r.candidatesBystage.applied ?? 0), 0);
  const totalOnsite = OPEN_REQS.reduce((s, r) => s + (r.candidatesBystage['on-site'] ?? 0), 0);
  const avgDaysOpen = Math.round(OPEN_REQS.reduce((s, r) => s + r.daysOpen, 0) / OPEN_REQS.length);
  const staleReqs = OPEN_REQS.filter((r) => r.daysOpen > 45).length;

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
        &middot; Open Reqs
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
          Open Reqs & ATS Pipeline
        </h1>
        <div style={{ color: 'var(--color-muted)', fontSize: 14 }}>
          {OPEN_REQS.length} open &middot; {totalApplied} applicants in flight &middot; avg {avgDaysOpen} days open
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
        {[
          { label: 'Open reqs', value: String(OPEN_REQS.length), sub: `${staleReqs} stale (>45d)`, tone: (staleReqs > 0 ? 'warn' : 'good') as 'warn' | 'good' },
          { label: 'Applicants in flight', value: String(totalApplied), sub: 'top-of-funnel' },
          { label: 'On-site interviews', value: String(totalOnsite), sub: 'this week', tone: 'good' as const },
          { label: 'Avg time-to-fill (open)', value: `${avgDaysOpen}d`, sub: 'target 30d', tone: (avgDaysOpen > 30 ? 'warn' : 'good') as 'warn' | 'good' },
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

      {/* Open reqs list */}
      <div style={{ display: 'grid', gap: 14 }}>
        {OPEN_REQS.sort((a, b) => {
          const pOrder = { high: 0, med: 1, low: 2 };
          if (pOrder[a.priority] !== pOrder[b.priority]) return pOrder[a.priority] - pOrder[b.priority];
          return b.daysOpen - a.daysOpen;
        }).map((r) => {
          const stage = STAGE_COLOR[r.stage];
          const totalForReq = STAGE_ORDER.reduce((s, st) => s + (r.candidatesBystage[st] ?? 0), 0);
          return (
            <Card key={r.id}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  gap: 16,
                  marginBottom: 12,
                }}
              >
                <div>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 6 }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-condensed)',
                        fontSize: 11,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--color-muted)',
                        fontWeight: 700,
                      }}
                    >
                      {r.id}
                    </span>
                    <span
                      style={{
                        color: PRIORITY_COLOR[r.priority],
                        fontFamily: 'var(--font-condensed)',
                        fontSize: 11,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        fontWeight: 700,
                      }}
                    >
                      {r.priority} priority
                    </span>
                  </div>
                  <h3
                    style={{
                      fontSize: 20,
                      fontWeight: 900,
                      margin: 0,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {r.title}
                  </h3>
                  <div style={{ color: 'var(--color-muted)', fontSize: 13, marginTop: 4 }}>
                    {r.dept} · {r.level} · {r.location} · hiring manager {r.hiringManager}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      background: stage.bg,
                      color: stage.fg,
                      padding: '4px 12px',
                      borderRadius: 999,
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {stage.label}
                  </span>
                  <div style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 8 }}>
                    Opened {r.openedOn} · <strong>{r.daysOpen} days</strong>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 2 }}>
                    Target fill: {r.targetFillBy}
                  </div>
                </div>
              </div>

              {/* Funnel */}
              <div style={{ display: 'flex', gap: 6, alignItems: 'stretch' }}>
                {STAGE_ORDER.map((st, i) => {
                  const count = r.candidatesBystage[st] ?? 0;
                  const maxW = 140;
                  const widthPct = totalForReq ? Math.max(8, (count / totalForReq) * 100) : 8;
                  return (
                    <div
                      key={st}
                      style={{
                        flex: `0 0 ${maxW}px`,
                        background: 'var(--color-surf2)',
                        padding: '10px 12px',
                        borderRadius: 6,
                        borderTop: `3px solid hsl(${210 - i * 20}, 45%, ${45 + i * 4}%)`,
                      }}
                    >
                      <div
                        style={{
                          fontFamily: 'var(--font-condensed)',
                          fontSize: 10,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          color: 'var(--color-muted)',
                          fontWeight: 700,
                        }}
                      >
                        {st.replace('-', ' ')}
                      </div>
                      <div style={{ fontSize: 20, fontWeight: 900, fontFamily: 'var(--font-condensed)' }}>
                        {count}
                      </div>
                      <div
                        style={{
                          height: 3,
                          background: 'var(--color-border)',
                          marginTop: 6,
                          borderRadius: 2,
                        }}
                      >
                        <div
                          style={{
                            width: `${widthPct}%`,
                            height: '100%',
                            background: `hsl(${210 - i * 20}, 45%, ${45 + i * 4}%)`,
                            borderRadius: 2,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
