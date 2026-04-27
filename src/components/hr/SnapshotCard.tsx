'use client';

import { usePersona } from '@/lib/hr/context';

const TODAY = 'Tuesday, April 21';
const fmt = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export default function SnapshotCard() {
  const { persona: p } = usePersona();

  const tiles: { label: string; value: string; hint?: string; status?: 'ok' | 'warn' | 'bad' | 'info' }[] = [
    {
      label: 'Hours this week',
      value: p.time.timesheetStatus === 'not_applicable' ? '—' : `${p.time.hoursThisWeek} / ${p.snapshot.hoursThisWeekTarget}`,
      hint: p.time.timesheetStatus === 'not_applicable' ? 'Salaried' : p.time.overtimeThisWeek > 0 ? `+${p.time.overtimeThisWeek}h OT` : 'on pace',
      status: p.time.overtimeThisWeek > 0 ? 'info' : 'ok',
    },
    {
      label: 'PTO remaining',
      value: `${p.timeOff.ptoRemainingDays} day${p.timeOff.ptoRemainingDays === 1 ? '' : 's'}`,
      hint: p.timeOff.ptoRemainingDays === 0 && p.profile.status === 'probationary' ? 'probationary' : `${p.timeOff.sickRemainingDays} sick`,
      status: 'ok',
    },
    {
      label: 'Next payday',
      value: p.snapshot.nextPayday,
      hint: p.snapshot.nextPaydayNet !== null ? `~${fmt(p.snapshot.nextPaydayNet)} net` : 'first check pending',
      status: p.snapshot.nextPaydayNet !== null ? 'ok' : 'warn',
    },
    {
      label: '401k balance',
      value: p.snapshot.retirementBalance !== null ? fmt(p.snapshot.retirementBalance) : '—',
      hint: p.retirement.enrolled
        ? (p.retirement.leavingMatchOnTable > 0 ? `at ${p.retirement.contributionPct}% · below match` : `at ${p.retirement.contributionPct}% · full match`)
        : 'not enrolled',
      status: p.retirement.enrolled ? (p.retirement.leavingMatchOnTable > 0 ? 'warn' : 'ok') : 'warn',
    },
    {
      label: 'Timesheet',
      value: timesheetLabel(p.time.timesheetStatus),
      hint: p.time.missedPunches.length > 0 ? `${p.time.missedPunches.length} missed punch` : undefined,
      status: p.time.timesheetStatus === 'approved' ? 'ok' : p.time.timesheetStatus === 'pending' ? 'warn' : p.time.timesheetStatus === 'not_applicable' ? 'info' : 'bad',
    },
    {
      label: 'Open alerts',
      value: `${p.snapshot.openAlerts}`,
      hint: p.snapshot.openAlerts > 0 ? 'see below' : 'all clear',
      status: p.snapshot.openAlerts > 0 ? 'warn' : 'ok',
    },
  ];

  return (
    <section
      style={{
        background: 'var(--color-surf)',
        border: '1px solid var(--color-border)',
        borderRadius: 14,
        padding: '22px 24px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 8 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#E8B84B', marginBottom: 6 }}>
            Your snapshot
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
            Hi {p.profile.firstName} — here's where you stand
          </h2>
        </div>
        <div style={{ fontSize: 11, color: 'var(--color-subtle)', letterSpacing: '0.04em' }}>
          as of {TODAY} · 10:32 AM
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 12,
        }}
      >
        {tiles.map((t) => (
          <div
            key={t.label}
            style={{
              background: 'var(--color-surf2)',
              border: `1px solid ${statusBorder(t.status)}`,
              borderRadius: 10,
              padding: '14px 14px',
              display: 'flex', flexDirection: 'column', gap: 6,
            }}
          >
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
              {t.label}
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-text)', letterSpacing: '-0.01em', lineHeight: 1.1 }}>
              {t.value}
            </div>
            {t.hint && (
              <div style={{ fontSize: 11, color: statusText(t.status), fontWeight: 600 }}>
                {t.hint}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function timesheetLabel(s: string): string {
  switch (s) {
    case 'approved': return 'Approved';
    case 'pending': return 'Pending';
    case 'missing': return 'Missing';
    case 'not_applicable': return 'N/A';
    default: return '—';
  }
}

function statusBorder(s?: 'ok' | 'warn' | 'bad' | 'info'): string {
  switch (s) {
    case 'ok':   return 'rgba(14,165,114,0.22)';
    case 'warn': return 'rgba(240,160,48,0.30)';
    case 'bad':  return 'rgba(224,84,84,0.30)';
    case 'info': return 'rgba(27,77,230,0.28)';
    default:     return 'var(--color-border)';
  }
}

function statusText(s?: 'ok' | 'warn' | 'bad' | 'info'): string {
  switch (s) {
    case 'ok':   return '#0EA572';
    case 'warn': return '#F0A030';
    case 'bad':  return '#E05454';
    case 'info': return '#3B62D6';
    default:     return 'var(--color-muted)';
  }
}
