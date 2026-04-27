'use client';

import { usePersona } from '@/lib/hr/context';
import type { Persona } from '@/lib/hr/personas';

const fmt  = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const fmt2 = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });

const CARD_BG     = 'var(--color-surf)';
const CARD_BORDER = '1px solid var(--color-border)';

export default function Profile() {
  const { persona: p } = usePersona();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 32 }}>
      <HeaderCard p={p} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 16 }}>
        <PersonalCard p={p} />
        <EmploymentCard p={p} />
        <CompensationCard p={p} />
        <PayrollCard p={p} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 16 }}>
        <TimeCard p={p} />
        <TimeOffCard p={p} />
        <BenefitsCard p={p} />
        <RetirementCard p={p} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 16 }}>
        <ExpensesCard p={p} />
        <CertsAndTrainingCard p={p} />
      </div>

      <PerformanceCard p={p} />
      <GoalsCard p={p} />
      <CareerCard p={p} />
      <DocumentsCard p={p} />
    </div>
  );
}

/* ───────────────────────────── section helpers ──────────────────────────── */

function Card({ title, subtitle, children, action }: {
  title: string; subtitle?: string; children: React.ReactNode; action?: React.ReactNode;
}) {
  return (
    <section style={{ background: CARD_BG, border: CARD_BORDER, borderRadius: 14, padding: '20px 22px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, gap: 12 }}>
        <div>
          {/* Section label — uses crimson (var(--color-blue)) which is readable in both light & dark */}
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-blue)', marginBottom: 4 }}>{title}</div>
          {subtitle && <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>{subtitle}</div>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function Row({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '7px 0', borderBottom: '1px solid var(--color-border)', gap: 12 }}>
      <div style={{ fontSize: 12, color: 'var(--color-muted)' }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)', textAlign: 'right', fontFamily: mono ? 'var(--font-mono, ui-monospace)' : 'inherit' }}>{value}</div>
    </div>
  );
}

function Chip({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: 'neutral' | 'ok' | 'warn' | 'bad' | 'info' }) {
  const colors: Record<string, { bg: string; border: string; color: string }> = {
    neutral: { bg: 'var(--color-surf2)', border: 'var(--color-border)', color: 'var(--color-text)' },
    ok:      { bg: 'rgba(14,165,114,0.12)',  border: 'rgba(14,165,114,0.30)',  color: '#0EA572' },
    warn:    { bg: 'rgba(240,160,48,0.12)',  border: 'rgba(240,160,48,0.30)',  color: '#C47F00' },
    bad:     { bg: 'rgba(224,84,84,0.12)',   border: 'rgba(224,84,84,0.30)',   color: '#E05454' },
    // info chip: crimson background tint with crimson text — always readable
    info:    { bg: 'rgba(27,77,230,0.10)',   border: 'rgba(27,77,230,0.28)',   color: 'var(--color-blue)' },
  };
  const c = colors[tone];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
      padding: '3px 8px', borderRadius: 999,
      background: c.bg, border: `1px solid ${c.border}`, color: c.color,
    }}>
      {children}
    </span>
  );
}

/* ─────────────────────────────── sections ───────────────────────────────── */

function HeaderCard({ p }: { p: Persona }) {
  return (
    // Always navy gradient so the white text inside is always legible regardless of page theme
    <section style={{
      background: 'linear-gradient(135deg, #4FA8FF 0%, #2C3880 100%)',
      border: '1px solid rgba(79,168,255,0.30)',
      borderRadius: 16,
      padding: '26px 28px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'linear-gradient(135deg,#1D44BF,#E8B84B)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, fontSize: 28, color: '#FFFFFF', letterSpacing: '0.04em', flexShrink: 0,
        }}>
          {p.profile.photoInitials}
        </div>
        <div style={{ flex: 1, minWidth: 240 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', marginBottom: 4 }}>My Profile</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.01em', lineHeight: 1.1 }}>
            {p.profile.firstName} {p.profile.lastName}
          </h1>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', marginTop: 6 }}>
            {p.profile.title} · {p.profile.department} · {p.profile.location}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            <Chip tone="info">ID {p.profile.employeeId}</Chip>
            <Chip tone={p.profile.status === 'active' ? 'ok' : p.profile.status === 'probationary' ? 'warn' : 'neutral'}>
              {p.profile.status.replace('_', ' ')}
            </Chip>
            <Chip tone="neutral">{p.profile.type.replace('_', '-')}</Chip>
            <Chip tone="neutral">Started {p.profile.startDate}</Chip>
          </div>
        </div>
      </div>
    </section>
  );
}

function PersonalCard({ p }: { p: Persona }) {
  return (
    <Card title="Personal" subtitle="Contact, address, emergency contact">
      <Row label="Preferred name" value={p.profile.preferredName || `${p.profile.firstName}`} />
      <Row label="Email" value={p.profile.email} />
      <Row label="Phone" value={p.profile.phone} />
      <Row label="Home address" value={p.profile.address} />
      <div style={{ marginTop: 12, padding: '10px 12px', background: 'var(--color-surf2)', border: '1px solid var(--color-border)', borderRadius: 8 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 6 }}>Emergency contact</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>{p.profile.emergencyContact.name}</div>
        <div style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 2 }}>
          {p.profile.emergencyContact.relationship} · {p.profile.emergencyContact.phone}
        </div>
      </div>
    </Card>
  );
}

function EmploymentCard({ p }: { p: Persona }) {
  return (
    <Card title="Employment">
      <Row label="Title" value={p.profile.title} />
      <Row label="Department" value={p.profile.department} />
      <Row label="Manager" value={p.profile.manager} />
      <Row label="Employee ID" value={p.profile.employeeId} />
      <Row label="Type" value={p.profile.type.replace('_', '-')} />
      <Row label="Status" value={<Chip tone={p.profile.status === 'active' ? 'ok' : p.profile.status === 'probationary' ? 'warn' : 'neutral'}>{p.profile.status.replace('_', ' ')}</Chip>} />
      <Row label="Start date" value={`${p.profile.startDate} · ${p.profile.seniorityYears}y`} />
      <Row label="Location" value={p.profile.location} />
      <Row label="Shift" value={p.profile.shift} />
      {p.profile.directReports && (
        <Row label="Direct reports" value={p.profile.directReports.join(', ')} />
      )}
    </Card>
  );
}

function CompensationCard({ p }: { p: Persona }) {
  const isHourly = p.profile.compensation.basis === 'hourly';
  const rate = p.profile.compensation.rate;
  return (
    <Card title="Compensation" subtitle="Base pay, pay-rate history, bonus">
      <Row label="Pay basis" value={isHourly ? `Hourly · $${rate.toFixed(2)}/hr` : `Salary · ${fmt(rate)}/yr`} />
      <Row label="Pay grade" value={p.profile.compensation.payGrade} />
      {p.profile.compensation.bonusTargetPct !== undefined && (
        <Row label="Bonus target" value={`${p.profile.compensation.bonusTargetPct}% of base`} />
      )}
      {p.profile.compensation.stipends && p.profile.compensation.stipends.map((s) => (
        <Row key={s.label} label={s.label} value={`${fmt(s.annual)}/yr`} />
      ))}
      <div style={{ marginTop: 12, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 4 }}>Rate history</div>
      {p.profile.compHistory.slice().reverse().map((h) => (
        <div key={h.effective} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--color-border)', fontSize: 12 }}>
          <div style={{ color: 'var(--color-muted)' }}>{h.effective} · <span style={{ color: 'var(--color-text)' }}>{h.reason}</span></div>
          <div style={{ fontWeight: 700, color: 'var(--color-text)' }}>
            {h.basis === 'hourly' ? `$${h.rate.toFixed(2)}/hr` : fmt(h.rate)}
          </div>
        </div>
      ))}
    </Card>
  );
}

function PayrollCard({ p }: { p: Persona }) {
  return (
    <Card title="Payroll" subtitle={`Next payday ${p.snapshot.nextPayday}`}>
      <Row label="Next gross" value={fmt2(p.pay.periodGross)} />
      <Row label="Next net" value={p.pay.periodNet !== null ? fmt2(p.pay.periodNet) : '— (first check pending)'} />
      <Row label="YTD gross" value={fmt(p.pay.ytdGross)} />
      <Row label="YTD taxes" value={fmt(p.pay.ytdTaxes)} />
      <Row label="Direct deposit" value={p.pay.directDepositLast4 ? <>···{p.pay.directDepositLast4}</> : <Chip tone="warn">Not set up</Chip>} />
      <Row label="W-4 on file" value={<Chip tone={p.profile.taxSetup.w4OnFile ? 'ok' : 'warn'}>{p.profile.taxSetup.w4OnFile ? 'Yes' : 'No'}</Chip>} />
      <Row label="Filing" value={`${p.profile.taxSetup.filingStatus} · ${p.profile.taxSetup.allowances} allowance${p.profile.taxSetup.allowances === 1 ? '' : 's'}`} />
      {p.pay.recentStubs.length > 0 && (
        <>
          <div style={{ marginTop: 12, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 4 }}>Recent paychecks</div>
          {p.pay.recentStubs.map((s) => (
            <div key={s.date} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--color-border)', fontSize: 12 }}>
              <div style={{ color: 'var(--color-muted)' }}>{s.date} · {s.period}</div>
              <div style={{ color: 'var(--color-text)', fontWeight: 700 }}>
                {fmt(s.net)}<span style={{ color: 'var(--color-muted)', fontWeight: 500 }}> / {fmt(s.gross)}</span>
              </div>
            </div>
          ))}
        </>
      )}
    </Card>
  );
}

function TimeCard({ p }: { p: Persona }) {
  const isSalaried = p.time.timesheetStatus === 'not_applicable';
  return (
    <Card title="Time & attendance">
      {isSalaried ? (
        <Row label="Schedule" value="Salaried · no timesheet" />
      ) : (
        <>
          <Row label="Clocked in today" value={p.time.clockedToday} />
          <Row label="Hours today" value={`${p.time.hoursToday}h`} />
          <Row label="Hours this week" value={`${p.time.hoursThisWeek}h / ${p.snapshot.hoursThisWeekTarget}h`} />
          <Row label="Overtime this week" value={p.time.overtimeThisWeek > 0 ? <Chip tone="info">{p.time.overtimeThisWeek}h OT</Chip> : '—'} />
          <Row label="Timesheet" value={<Chip tone={p.time.timesheetStatus === 'approved' ? 'ok' : p.time.timesheetStatus === 'pending' ? 'warn' : 'bad'}>{p.time.timesheetStatus}</Chip>} />
          {p.time.missedPunches.length > 0 && (
            <Row label="Missed punches" value={<Chip tone="bad">{p.time.missedPunches.length}</Chip>} />
          )}
          {p.time.scheduledUpcoming.length > 0 && (
            <>
              <div style={{ marginTop: 12, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 4 }}>Upcoming shifts</div>
              {p.time.scheduledUpcoming.map((s) => (
                <div key={s.day} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 12 }}>
                  <div style={{ color: 'var(--color-muted)' }}>{s.day}</div>
                  <div style={{ color: 'var(--color-text)', fontWeight: 600 }}>{s.shift}</div>
                </div>
              ))}
            </>
          )}
        </>
      )}
    </Card>
  );
}

function TimeOffCard({ p }: { p: Persona }) {
  return (
    <Card title="PTO & leave">
      <Row label="PTO remaining" value={`${p.timeOff.ptoRemainingDays} day${p.timeOff.ptoRemainingDays === 1 ? '' : 's'}`} />
      <Row label="PTO used YTD" value={`${p.timeOff.ptoUsedYtd} day${p.timeOff.ptoUsedYtd === 1 ? '' : 's'}`} />
      <Row label="Accrual rate" value={p.timeOff.ptoAccrualRate} />
      <Row label="Next accrual" value={p.timeOff.nextAccrualDate} />
      <Row label="Sick remaining" value={`${p.timeOff.sickRemainingDays} day${p.timeOff.sickRemainingDays === 1 ? '' : 's'}`} />
      <Row label="Holidays remaining" value={`${p.timeOff.holidaysRemaining} day${p.timeOff.holidaysRemaining === 1 ? '' : 's'}`} />
      {p.timeOff.approved.length > 0 && (
        <>
          <div style={{ marginTop: 12, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 4 }}>Approved</div>
          {p.timeOff.approved.map((a) => (
            <div key={a.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 12 }}>
              <div style={{ color: 'var(--color-text)', fontWeight: 600 }}>{a.label}</div>
              <div style={{ color: 'var(--color-muted)' }}>{a.dates}</div>
            </div>
          ))}
        </>
      )}
      {p.timeOff.pending.length > 0 && (
        <>
          <div style={{ marginTop: 10, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 4 }}>Pending</div>
          {p.timeOff.pending.map((a) => (
            <div key={a.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 12 }}>
              <div style={{ color: 'var(--color-text)', fontWeight: 600 }}>{a.label}</div>
              <div style={{ color: 'var(--color-orange)' }}>{a.dates}</div>
            </div>
          ))}
        </>
      )}
    </Card>
  );
}

function BenefitsCard({ p }: { p: Persona }) {
  const b = p.benefits;
  if (!b.health) {
    return (
      <Card title="Benefits" subtitle="No elections on file yet">
        <div style={{ padding: '10px 12px', background: 'rgba(240,160,48,0.08)', border: '1px solid rgba(240,160,48,0.28)', borderRadius: 8, fontSize: 13, color: 'var(--color-text)' }}>
          You haven&apos;t elected benefits yet. Open enrollment: <strong>{b.openEnrollment.dates}</strong>. Ask the chat to walk you through enrollment.
        </div>
      </Card>
    );
  }
  return (
    <Card title="Benefits">
      <Row label="Medical" value={`${b.health.plan} · ${b.health.tier}`} />
      <Row label="Medical / check" value={fmt2(b.health.perCheck)} />
      <Row label="Deductible used" value={`${fmt(b.health.usedDeductible)} of ${fmt(b.health.deductible)}`} />
      {b.dental && <Row label="Dental" value={`${b.dental.plan} · ${fmt2(b.dental.perCheck)}/ck`} />}
      {b.vision && <Row label="Vision" value={`${b.vision.plan} · ${fmt2(b.vision.perCheck)}/ck`} />}
      <Row label="Life" value={b.life.enrolled ? `${fmt(b.life.coverage)} · beneficiary ${b.life.beneficiaryOnFile ? 'on file' : <Chip tone="bad">missing</Chip>}` : 'Not enrolled'} />
      {b.fsa && <Row label="FSA balance" value={<><strong>{fmt(b.fsa.balance)}</strong> · expires {b.fsa.expiresOn}</>} />}
      {b.dependents.length > 0 && (
        <>
          <div style={{ marginTop: 12, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 4 }}>Dependents</div>
          {b.dependents.map((d) => (
            <div key={d.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 12 }}>
              <div style={{ color: 'var(--color-text)' }}>{d.name}</div>
              <div style={{ color: 'var(--color-muted)' }}>{d.relationship}{d.onPlan ? '' : ' · not covered'}</div>
            </div>
          ))}
        </>
      )}
      <div style={{ marginTop: 10 }}>
        <Chip tone={b.openEnrollment.status === 'open' ? 'info' : 'neutral'}>OE {b.openEnrollment.status}</Chip>
        <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--color-muted)' }}>{b.openEnrollment.dates}</span>
      </div>
    </Card>
  );
}

function RetirementCard({ p }: { p: Persona }) {
  const r = p.retirement;
  return (
    <Card title="Retirement (401k)">
      {!r.enrolled ? (
        <div style={{ padding: '10px 12px', background: 'rgba(240,160,48,0.08)', border: '1px solid rgba(240,160,48,0.28)', borderRadius: 8, fontSize: 13, color: 'var(--color-text)' }}>
          Not enrolled. Company match: <strong>{r.employerMatch}</strong>. Enrolling at {r.fullMatchAt}% unlocks the full match.
        </div>
      ) : (
        <>
          <Row label="Balance" value={r.balance !== null ? <strong>{fmt(r.balance)}</strong> : '—'} />
          <Row label="Contribution" value={`${r.contributionPct}% · ${r.contributionPerCheck !== null ? fmt2(r.contributionPerCheck) : ''}/check`} />
          <Row label="Employer match" value={r.employerMatch} />
          <Row label="YTD employer match" value={fmt(r.ytdEmployerMatch)} />
          <Row label="YTD your contribution" value={fmt(r.ytdEmployeeContrib)} />
          <Row label="Vested" value={`${r.vestedPct}%`} />
          {r.projectedAt65 !== null && <Row label="Projected at 65" value={fmt(r.projectedAt65)} />}
          {r.leavingMatchOnTable > 0 && (
            <div style={{ marginTop: 10, padding: '10px 12px', background: 'rgba(240,160,48,0.08)', border: '1px solid rgba(240,160,48,0.28)', borderRadius: 8, fontSize: 12, color: '#C47F00' }}>
              Leaving ~{fmt(r.leavingMatchOnTable)}/yr in match on the table. Bump to {r.fullMatchAt}% to capture it.
            </div>
          )}
          {r.pension && (
            <div style={{ marginTop: 10, padding: '10px 12px', background: 'var(--color-surf2)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12, color: 'var(--color-text)' }}>
              Pension enrolled · {r.pension.yearsOfService}y of service · projected {fmt(r.pension.projectedMonthly)}/mo at 65
            </div>
          )}
          {r.beneficiaries.length > 0 && (
            <>
              <div style={{ marginTop: 12, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 4 }}>Beneficiaries</div>
              {r.beneficiaries.map((b) => (
                <div key={b.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 12 }}>
                  <div style={{ color: 'var(--color-text)' }}>{b.name} <span style={{ color: 'var(--color-muted)' }}>· {b.relationship}</span></div>
                  <div style={{ color: 'var(--color-text)', fontWeight: 700 }}>{b.sharePct}%</div>
                </div>
              ))}
            </>
          )}
        </>
      )}
    </Card>
  );
}

function ExpensesCard({ p }: { p: Persona }) {
  return (
    <Card title="Expenses">
      <Row label="Mileage YTD" value={`${p.expenses.mileageYtd.toLocaleString()} mi · ${fmt(p.expenses.mileageYtd * p.expenses.mileageRate)}`} />
      <Row label="Mileage rate" value={`$${p.expenses.mileageRate.toFixed(2)}/mile`} />
      {p.expenses.toolAllowance && (
        <Row label="Tool allowance" value={`${fmt(p.expenses.toolAllowance.usedYtd)} of ${fmt(p.expenses.toolAllowance.limit)} used`} />
      )}
      <Row label="YTD reimbursements" value={fmt(p.expenses.ytdReimbursements)} />
      {p.expenses.cardBalance !== null && <Row label="Corporate card balance" value={fmt(p.expenses.cardBalance)} />}
      {p.expenses.pendingReports.length > 0 && (
        <>
          <div style={{ marginTop: 12, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 4 }}>Pending / recent reports</div>
          {p.expenses.pendingReports.map((r) => (
            <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 12 }}>
              <div style={{ color: 'var(--color-text)' }}>{r.label}</div>
              <div style={{ color: 'var(--color-muted)' }}>{fmt(r.amount)} · {r.status}</div>
            </div>
          ))}
        </>
      )}
    </Card>
  );
}

function CertsAndTrainingCard({ p }: { p: Persona }) {
  return (
    <Card title="Certifications & training">
      {p.certifications.length > 0 ? (
        <>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 6 }}>Certifications</div>
          {p.certifications.map((c) => (
            <div key={c.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--color-border)', fontSize: 12, gap: 8, flexWrap: 'wrap' }}>
              <div style={{ color: 'var(--color-text)', fontWeight: 600 }}>{c.label}</div>
              <div>
                <Chip tone={c.status === 'valid' ? 'ok' : c.status === 'expiring_soon' ? 'warn' : 'bad'}>{c.status.replace('_', ' ')}</Chip>
                <span style={{ marginLeft: 8, color: 'var(--color-muted)', fontSize: 11 }}>exp {c.expires}</span>
              </div>
            </div>
          ))}
        </>
      ) : (
        <div style={{ fontSize: 12, color: 'var(--color-muted)', padding: '8px 0' }}>No certifications on file for your role.</div>
      )}

      {p.training.length > 0 && (
        <>
          <div style={{ marginTop: 14, fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 6 }}>Training</div>
          {p.training.map((t) => (
            <div key={t.course} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--color-border)', fontSize: 12, gap: 8, flexWrap: 'wrap' }}>
              <div>
                <div style={{ color: 'var(--color-text)', fontWeight: 600 }}>{t.course}</div>
                {t.dueBy && <div style={{ fontSize: 11, color: 'var(--color-muted)' }}>Due {t.dueBy}{t.required ? ' · required' : ''}</div>}
              </div>
              <Chip tone={t.status === 'complete' ? 'ok' : t.status === 'in_progress' ? 'info' : 'warn'}>
                {t.status.replace('_', ' ')}
              </Chip>
            </div>
          ))}
        </>
      )}
    </Card>
  );
}

function PerformanceCard({ p }: { p: Persona }) {
  const r = p.performance;
  return (
    <Card title="Performance" subtitle={`${r.cycle} · ${r.phase.replace('_', ' ')}`}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 10, marginBottom: 12 }}>
        <Tile label="Current cycle" value={r.cycle} tone="info" />
        <Tile label="Phase" value={r.phase.replace('_', ' ')} tone={r.phase === 'complete' ? 'ok' : 'warn'} />
        <Tile label="Self-review due" value={r.selfReviewDue || '—'} tone={r.selfReviewDue ? 'warn' : 'neutral'} />
        <Tile label="Last rating" value={r.lastRating || '— (first cycle)'} tone={r.lastRating ? 'ok' : 'neutral'} />
      </div>

      {r.feedback360Summary && (
        <div style={{ marginBottom: 12, padding: '12px 14px', background: 'var(--color-surf2)', border: '1px solid var(--color-border)', borderRadius: 8 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-blue)', marginBottom: 6 }}>360 feedback summary</div>
          <div style={{ fontSize: 13, color: 'var(--color-text)', lineHeight: 1.55 }}>{r.feedback360Summary}</div>
        </div>
      )}

      {r.oneOnOnes.length > 0 && (
        <>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 8 }}>Recent 1:1s</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {r.oneOnOnes.map((o) => (
              <div key={o.date} style={{ padding: '10px 12px', background: 'var(--color-surf2)', border: '1px solid var(--color-border)', borderRadius: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, gap: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text)' }}>{o.topic}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-muted)' }}>{o.date}</div>
                </div>
                <div style={{ fontSize: 13, color: 'var(--color-muted)', lineHeight: 1.5 }}>{o.notes}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}

function Tile({ label, value, tone = 'neutral' }: { label: string; value: string; tone?: 'ok' | 'warn' | 'info' | 'neutral' }) {
  const borders: Record<string, string> = {
    ok:      'rgba(14,165,114,0.30)',
    warn:    'rgba(240,160,48,0.30)',
    info:    'rgba(27,77,230,0.28)',
    neutral: 'var(--color-border)',
  };
  return (
    <div style={{ background: 'var(--color-surf2)', border: `1px solid ${borders[tone]}`, borderRadius: 8, padding: '10px 12px' }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>{label}</div>
      <div style={{ marginTop: 4, fontSize: 14, fontWeight: 700, color: 'var(--color-text)' }}>{value}</div>
    </div>
  );
}

function GoalsCard({ p }: { p: Persona }) {
  return (
    <Card title="Goals" subtitle={`${p.goals.length} active`}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {p.goals.map((g) => {
          const tone = g.status === 'on_track' ? 'ok' : g.status === 'at_risk' ? 'warn' : g.status === 'off_track' ? 'bad' : 'info';
          return (
            <div key={g.id} style={{ padding: '12px 14px', background: 'var(--color-surf2)', border: '1px solid var(--color-border)', borderRadius: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)' }}>{g.title}</div>
                <Chip tone={tone}>{g.status.replace('_', ' ')}</Chip>
              </div>
              <div style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 10, lineHeight: 1.5 }}>{g.description}</div>
              <div style={{ height: 6, background: 'var(--color-border)', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ width: `${g.progress}%`, height: '100%', background: g.progress >= 90 ? '#0EA572' : g.progress >= 40 ? '#E8B84B' : '#F0A030' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: 'var(--color-muted)' }}>
                <span>{g.period} · due {g.dueDate}{g.assignedBy ? ` · assigned by ${g.assignedBy}` : ' · self-set'}</span>
                <span>{g.progress}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function CareerCard({ p }: { p: Persona }) {
  const c = p.career;
  return (
    <Card title="Career & development">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 10, marginBottom: 14 }}>
        <Tile label="Trajectory" value={c.trajectory} tone="info" />
        <Tile label="Next role" value={c.nextRole} tone="neutral" />
        <Tile label="Readiness" value={`${c.nextRoleReadiness}%`} tone={c.nextRoleReadiness >= 60 ? 'ok' : 'warn'} />
        <Tile label="Mentor" value={c.mentor || 'Not assigned'} tone={c.mentor ? 'ok' : 'warn'} />
      </div>

      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 6 }}>Skills</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
        {c.skills.map((s) => (
          <Chip key={s.name} tone={s.level === 'expert' ? 'ok' : s.level === 'proficient' ? 'info' : 'warn'}>{s.name} · {s.level}</Chip>
        ))}
      </div>

      {c.mobilityInterests.length > 0 && (
        <>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 6 }}>Mobility interests</div>
          <div style={{ fontSize: 13, color: 'var(--color-text)', marginBottom: 14 }}>{c.mobilityInterests.join(' · ')}</div>
        </>
      )}

      {c.learningInProgress.length > 0 && (
        <>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 6 }}>Learning in progress</div>
          {c.learningInProgress.map((l) => (
            <div key={l.course} style={{ padding: '10px 12px', background: 'var(--color-surf2)', border: '1px solid var(--color-border)', borderRadius: 8, marginBottom: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text)' }}>{l.course}</div>
                <div style={{ fontSize: 11, color: 'var(--color-muted)' }}>{l.provider}</div>
              </div>
              <div style={{ height: 4, background: 'var(--color-border)', borderRadius: 999, overflow: 'hidden', marginTop: 8 }}>
                <div style={{ width: `${l.progress}%`, height: '100%', background: '#E8B84B' }} />
              </div>
              <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 4 }}>{l.progress}% complete</div>
            </div>
          ))}
        </>
      )}
    </Card>
  );
}

function DocumentsCard({ p }: { p: Persona }) {
  const grouped: Record<string, typeof p.documents> = {};
  for (const d of p.documents) {
    (grouped[d.category] ||= []).push(d);
  }
  const categoryLabel: Record<string, string> = {
    employment: 'Employment',
    payroll:    'Payroll',
    benefits:   'Benefits',
    compliance: 'Compliance',
    perf:       'Performance',
  };

  return (
    <Card title="Documents" subtitle="Your signed documents and on-file acknowledgements">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 14 }}>
        {Object.entries(grouped).map(([cat, docs]) => (
          <div key={cat}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 6 }}>
              {categoryLabel[cat] || cat}
            </div>
            {docs.map((d) => (
              <div key={d.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--color-border)', fontSize: 12, gap: 6 }}>
                <div style={{ color: 'var(--color-text)', fontWeight: 600, flex: 1 }}>{d.label}</div>
                {d.signedOn ? (
                  <span style={{ fontSize: 11, color: '#0EA572' }}>signed {d.signedOn}</span>
                ) : (
                  <Chip tone="warn">Not signed</Chip>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </Card>
  );
}
