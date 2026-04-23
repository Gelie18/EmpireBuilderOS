'use client';

import Link from 'next/link';
import {
  SUPPORT_SNAPSHOT,
  SUPPORT_CATEGORY_MIX,
  SUPPORT_QUEUE,
  type SupportTicket,
} from '@/lib/data/ops-extras';

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

const PRIORITY: Record<SupportTicket['priority'], { bg: string; fg: string }> = {
  urgent: { bg: '#FDE2E0', fg: '#8A1C16' },
  high:   { bg: '#FFF0D9', fg: '#8A5A0F' },
  normal: { bg: '#E9EDF3', fg: '#4A5464' },
};

const SENTIMENT_EMOJI = { happy: '🙂', neutral: '😐', angry: '😠' };
const CHANNEL_EMOJI = { email: '✉︎', chat: '💬', phone: '☎', social: '@' };

export default function SupportQueuePage() {
  const s = SUPPORT_SNAPSHOT;

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
        &middot; Support Queue
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
          Support Queue & CSAT
        </h1>
        <div style={{ color: 'var(--color-muted)', fontSize: 14 }}>
          {s.openTickets} open &middot; {s.ticketsMtd.toLocaleString()} MTD &middot; {s.deflectedPct}% bot-deflected
        </div>
      </header>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
        {[
          { label: 'Open tickets', value: String(s.openTickets), sub: `${s.openAge.over72h} over 72h`, tone: s.openAge.over72h > 0 ? 'warn' : undefined },
          { label: 'Median 1st response', value: `${s.firstResponseMedianMin} m`, sub: `target ${s.firstResponseTargetMin}m`, tone: s.firstResponseMedianMin <= s.firstResponseTargetMin ? 'good' : 'warn' },
          { label: 'Median resolution', value: `${s.resolutionMedianHours} h`, sub: `target ${s.resolutionTargetHours}h`, tone: s.resolutionMedianHours <= s.resolutionTargetHours ? 'good' : 'warn' },
          { label: 'CSAT (30d)', value: `${s.csat30d} / 5`, sub: `+${(s.csat30d - s.csatLastMonth).toFixed(2)} vs last month`, tone: 'good' },
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
                    : 'var(--color-text)',
              }}
            >
              {kpi.value}
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 4 }}>{kpi.sub}</div>
          </Card>
        ))}
      </div>

      {/* Age buckets + category */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 20, marginBottom: 20 }}>
        <Card>
          <SectionTitle>Open ticket age</SectionTitle>
          <div style={{ display: 'grid', gap: 10 }}>
            {[
              { label: '< 4 hours',  value: s.openAge.under4h,  tone: 'good' },
              { label: '4–24 hours', value: s.openAge.under24h, tone: 'flat' },
              { label: '24–72 hours',value: s.openAge.under72h, tone: 'warn' },
              { label: '> 72 hours', value: s.openAge.over72h,  tone: 'danger' },
            ].map((row) => {
              const totalOpen = s.openTickets;
              const pct = (row.value / totalOpen) * 100;
              const color =
                row.tone === 'good'
                  ? '#2DB47A'
                  : row.tone === 'warn'
                  ? '#F58A1F'
                  : row.tone === 'danger'
                  ? '#1B4DE6'
                  : '#5D6B7F';
              return (
                <div key={row.label}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 13,
                      marginBottom: 4,
                    }}
                  >
                    <span>{row.label}</span>
                    <span style={{ fontFamily: 'var(--font-condensed)', fontWeight: 700 }}>
                      {row.value}
                    </span>
                  </div>
                  <div
                    style={{
                      height: 10,
                      background: 'var(--color-surf2)',
                      borderRadius: 5,
                      overflow: 'hidden',
                    }}
                  >
                    <div style={{ width: `${pct}%`, height: '100%', background: color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <SectionTitle>Ticket category mix (MTD)</SectionTitle>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <tbody>
              {SUPPORT_CATEGORY_MIX.map((c) => (
                <tr key={c.category} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '10px 0', width: '45%', fontWeight: 600 }}>{c.category}</td>
                  <td style={{ padding: '10px 0', width: '40%' }}>
                    <div style={{ height: 8, background: 'var(--color-surf2)', borderRadius: 4 }}>
                      <div style={{ width: `${c.share * 2.5}%`, height: '100%', background: '#4FA8FF', borderRadius: 4 }} />
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
                    {c.share}%
                  </td>
                  <td
                    style={{
                      padding: '10px 0',
                      textAlign: 'right',
                      fontSize: 11,
                      fontFamily: 'var(--font-condensed)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: c.trend === 'up' ? '#8A1C16' : c.trend === 'down' ? '#165E36' : 'var(--color-muted)',
                      fontWeight: 700,
                      width: '7%',
                    }}
                  >
                    {c.trend === 'up' ? '↑' : c.trend === 'down' ? '↓' : '='}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {/* Queue */}
      <Card>
        <SectionTitle>Live queue</SectionTitle>
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
              <th style={{ padding: '8px 10px' }}>Ticket</th>
              <th style={{ padding: '8px 10px' }}>Customer</th>
              <th style={{ padding: '8px 10px' }}>Subject</th>
              <th style={{ padding: '8px 10px' }}>Chan</th>
              <th style={{ padding: '8px 10px' }}>Priority</th>
              <th style={{ padding: '8px 10px' }}>Age</th>
              <th style={{ padding: '8px 10px' }}>Assignee</th>
              <th style={{ padding: '8px 10px', textAlign: 'center' }}>Sentiment</th>
            </tr>
          </thead>
          <tbody>
            {SUPPORT_QUEUE.map((t) => {
              const p = PRIORITY[t.priority];
              return (
                <tr key={t.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '12px 10px', fontFamily: 'var(--font-condensed)', fontWeight: 700 }}>
                    {t.id}
                  </td>
                  <td style={{ padding: '12px 10px' }}>{t.customer}</td>
                  <td style={{ padding: '12px 10px' }}>{t.subject}</td>
                  <td style={{ padding: '12px 10px', fontSize: 16, textAlign: 'center' }}>
                    <span title={t.channel}>{CHANNEL_EMOJI[t.channel]}</span>
                  </td>
                  <td style={{ padding: '12px 10px' }}>
                    <span
                      style={{
                        background: p.bg,
                        color: p.fg,
                        padding: '3px 10px',
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {t.priority}
                    </span>
                  </td>
                  <td style={{ padding: '12px 10px', fontFamily: 'var(--font-condensed)', color: 'var(--color-muted)' }}>
                    {t.age}
                  </td>
                  <td
                    style={{
                      padding: '12px 10px',
                      fontSize: 12,
                      color: t.assignee === 'bot' ? 'var(--color-muted)' : 'var(--color-text)',
                      fontFamily: 'var(--font-condensed)',
                    }}
                  >
                    {t.assignee === 'bot' ? '🤖 bot' : t.assignee}
                  </td>
                  <td style={{ padding: '12px 10px', textAlign: 'center', fontSize: 18 }}>
                    {SENTIMENT_EMOJI[t.sentiment]}
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
