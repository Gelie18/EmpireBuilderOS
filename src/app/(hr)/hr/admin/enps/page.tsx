'use client';

import Link from 'next/link';
import { ENPS_SUMMARY, ENPS_HISTORY, ENPS_BY_DEPT, ENPS_TOP_THEMES } from '@/lib/data/hr-data';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
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

const SENTIMENT_COLOR = {
  positive: { bg: '#DCF2E4', fg: '#165E36' },
  mixed:    { bg: '#FFF0D9', fg: '#8A5A0F' },
  negative: { bg: '#FBE0DE', fg: '#8A1C16' },
};

export default function EnpsPage() {
  const e = ENPS_SUMMARY;
  const delta = e.current - e.priorQuarter;
  const benchDelta = e.current - e.industryBench;

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
        &middot; Engagement
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
          eNPS & Engagement Pulse
        </h1>
        <div style={{ color: 'var(--color-muted)', fontSize: 14 }}>
          Pulse taken {e.pulseDate} &middot; {e.responseRate}% response rate &middot; {ENPS_HISTORY.length}-quarter trend
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
        {[
          { label: 'Current eNPS', value: String(e.current), sub: `${delta > 0 ? '+' : ''}${delta} vs prior Q`, tone: (delta > 0 ? 'good' : 'warn') as 'good' | 'warn' },
          { label: 'vs industry bench', value: `+${benchDelta}`, sub: `bench ${e.industryBench}`, tone: 'good' as const },
          { label: 'Response rate', value: `${e.responseRate}%`, sub: `+${e.responseRate - e.priorResponseRate}pp vs last pulse`, tone: 'good' as const },
          { label: 'Depts trending up', value: String(ENPS_BY_DEPT.filter((d) => d.trend === 'up').length), sub: `of ${ENPS_BY_DEPT.length} measured` },
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

      {/* Trend chart */}
      <Card>
        <SectionTitle>Quarterly eNPS trend vs bench</SectionTitle>
        <div style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ENPS_HISTORY} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-chart-grid)" />
              <XAxis
                dataKey="quarter"
                tick={{ fill: 'var(--color-chart-text)', fontSize: 11, fontFamily: 'var(--font-condensed)' }}
              />
              <YAxis
                tick={{ fill: 'var(--color-chart-text)', fontSize: 11, fontFamily: 'var(--font-condensed)' }}
                domain={[0, 60]}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--color-surf)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 6,
                  fontSize: 12,
                }}
              />
              <ReferenceLine y={0} stroke="var(--color-muted)" strokeDasharray="2 2" />
              <Line type="monotone" dataKey="score" stroke="#1D44BF" strokeWidth={3} dot={{ r: 4 }} name="eNPS" />
              <Line type="monotone" dataKey="bench" stroke="#5D6B7F" strokeWidth={2} strokeDasharray="4 3" dot={false} name="Industry bench" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Dept breakdown + themes */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 20 }}>
        <Card>
          <SectionTitle>By department</SectionTitle>
          <div style={{ display: 'grid', gap: 12 }}>
            {ENPS_BY_DEPT.map((d) => {
              const color = d.score >= 40 ? '#2DB47A' : d.score >= 25 ? '#8A5A0F' : '#1D44BF';
              const trendArrow = d.trend === 'up' ? '↑' : d.trend === 'down' ? '↓' : '→';
              const trendColor = d.trend === 'up' ? '#165E36' : d.trend === 'down' ? '#8A1C16' : 'var(--color-muted)';
              return (
                <div key={d.dept} style={{ display: 'grid', gridTemplateColumns: '140px 1fr 60px 20px', gap: 12, alignItems: 'center' }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{d.dept}</div>
                  <div style={{ height: 8, background: 'var(--color-surf2)', borderRadius: 4, position: 'relative' }}>
                    <div
                      style={{
                        width: `${Math.min(100, Math.max(0, ((d.score + 20) / 80) * 100))}%`,
                        height: '100%',
                        background: color,
                        borderRadius: 4,
                      }}
                    />
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-condensed)',
                      fontWeight: 700,
                      textAlign: 'right',
                      color,
                    }}
                  >
                    {d.score}
                  </div>
                  <div style={{ color: trendColor, fontWeight: 900, textAlign: 'center' }}>{trendArrow}</div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <SectionTitle>Top themes from open-text</SectionTitle>
          <div style={{ display: 'grid', gap: 10 }}>
            {ENPS_TOP_THEMES.map((t) => {
              const s = SENTIMENT_COLOR[t.sentiment];
              return (
                <div
                  key={t.theme}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 12px',
                    background: 'var(--color-surf2)',
                    borderRadius: 6,
                    borderLeft: `3px solid ${s.fg}`,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{t.theme}</div>
                    <div style={{ fontSize: 11, color: 'var(--color-muted)', fontFamily: 'var(--font-condensed)', marginTop: 2 }}>
                      {t.mentions} mentions
                    </div>
                  </div>
                  <span
                    style={{
                      background: s.bg,
                      color: s.fg,
                      padding: '3px 10px',
                      borderRadius: 999,
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {t.sentiment}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div style={{ marginTop: 20 }}>
        <Card>
          <SectionTitle>What's moving the score</SectionTitle>
          <div style={{ display: 'grid', gap: 12, fontSize: 14, lineHeight: 1.55 }}>
            <div>
              <strong>+11pt jump vs Q4 2025 is real — not a response-rate artifact.</strong> Response rate rose from 71% to 78%, so more
              voices, not fewer unhappy ones, drove the lift. Engineering and Product (+10 and +8) led the gain; the leadership-transparency
              theme is directly tied to the all-hands cadence change that started in January.
            </div>
            <div>
              <strong>Retail (22, trending down) is the clear outlier.</strong> Retail compensation is the #5 theme by mention count and is
              100% negative sentiment. This is consistent with the L2/L3 Retail band pay review already in the comp backlog — prioritize that
              before the next pulse.
            </div>
            <div>
              <strong>Workload-in-peak-seasons (19 mentions, negative) needs a plan before Q3.</strong> Peak planning starts in July; if we
              don't preempt it with the Q2 hiring plan (Ops + CS reqs already open), we risk erasing this quarter's gains.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
