'use client';

import { usePersona } from '@/lib/hr/context';

const fmt = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const fmtFull = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });

export default function HRFile() {
  const { persona: p } = usePersona();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      <Header persona={p} />

      <Section title="Employment summary" source="BambooHR (simulated)">
        <Row label="Employee ID">{p.profile.employeeId}</Row>
        <Row label="Name">{p.profile.firstName} {p.profile.lastName}</Row>
        <Row label="Title">{p.profile.title}</Row>
        <Row label="Department">{p.profile.department}</Row>
        <Row label="Manager">{p.profile.manager}</Row>
        <Row label="Type">{p.profile.type === 'full_time' ? 'Full-time' : p.profile.type === 'part_time' ? 'Part-time' : 'Contractor'}</Row>
        <Row label="Status">{titleCase(p.profile.status)}</Row>
        <Row label="Start date">{p.profile.startDate} · {p.profile.seniorityYears} yr{p.profile.seniorityYears === 1 ? '' : 's'}</Row>
        <Row label="Location">{p.profile.location}</Row>
        <Row label="Shift">{p.profile.shift}</Row>
        <Row label="Compensation">
          {p.profile.compensation.basis === 'hourly'
            ? `$${p.profile.compensation.rate.toFixed(2)}/hr · grade ${p.profile.compensation.payGrade}`
            : `${fmt(p.profile.compensation.rate)}/yr · grade ${p.profile.compensation.payGrade}`}
        </Row>
        {p.profile.directReports && (
          <Row label="Direct reports">{p.profile.directReports.join(', ')}</Row>
        )}
      </Section>

      <Section title="Current pay period" source="ADP Payroll (simulated)">
        <Row label="Pay period">{p.pay.periodStart} → {p.pay.periodEnd}</Row>
        <Row label="Gross this period">{fmtFull(p.pay.periodGross)}</Row>
        <Row label="Net (expected)">{p.pay.periodNet !== null ? fmtFull(p.pay.periodNet) : 'First paycheck — pending W-4 + deductions'}</Row>
        <Row label="Next payday">{p.snapshot.nextPayday}</Row>
        <Row label="Direct deposit">{p.pay.directDepositLast4 ? `Active · ••${p.pay.directDepositLast4}` : 'NOT SET UP'}</Row>
        <Row label="YTD gross">{fmt(p.pay.ytdGross)}</Row>
        <Row label="YTD taxes">{fmt(p.pay.ytdTaxes)}</Row>
        <Row label="YTD overtime">{p.pay.overtimeHoursYtd}h · {fmt(p.pay.ytdOvertimePay)}</Row>
        {p.pay.deductionsThisCheck.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 6 }}>
              This check — deductions
            </div>
            {p.pay.deductionsThisCheck.map((d) => (
              <Row key={d.label} label={d.label} subtle>{fmtFull(d.amount)}</Row>
            ))}
          </div>
        )}
      </Section>

      <Section title="Time & hours" source="Kronos Timekeeping (simulated)">
        <Row label="Week of">{p.time.weekStart}</Row>
        <Row label="Clocked in today">{p.time.clockedToday}</Row>
        <Row label="Hours this week">{p.time.hoursThisWeek}h</Row>
        <Row label="Overtime this week">{p.time.overtimeThisWeek}h</Row>
        <Row label="Timesheet status">{titleCase(p.time.timesheetStatus.replace('_', ' '))}</Row>
        {p.time.missedPunches.length > 0 && (
          <Row label="Exceptions">{p.time.missedPunches.join('; ')}</Row>
        )}
        {p.time.scheduledUpcoming.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 6 }}>
              Upcoming schedule
            </div>
            {p.time.scheduledUpcoming.map((s, i) => (
              <Row key={i} label={s.day} subtle>{s.shift}</Row>
            ))}
          </div>
        )}
      </Section>

      <Section title="PTO & leave" source="BambooHR (simulated)">
        <Row label="PTO remaining">{p.timeOff.ptoRemainingDays} days</Row>
        <Row label="PTO used YTD">{p.timeOff.ptoUsedYtd} days</Row>
        <Row label="Accrual rate">{p.timeOff.ptoAccrualRate}</Row>
        <Row label="Next accrual">{p.timeOff.nextAccrualDate}</Row>
        <Row label="Sick days">{p.timeOff.sickRemainingDays}</Row>
        <Row label="Company holidays left">{p.timeOff.holidaysRemaining}</Row>
        {p.timeOff.approved.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 6 }}>
              Approved time off
            </div>
            {p.timeOff.approved.map((a, i) => (
              <Row key={i} label={a.label} subtle>{a.dates}</Row>
            ))}
          </div>
        )}
        {p.timeOff.pending.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 6 }}>
              Pending requests
            </div>
            {p.timeOff.pending.map((x, i) => (
              <Row key={i} label={x.label} subtle>{x.dates} · {x.status}</Row>
            ))}
          </div>
        )}
      </Section>

      <Section title="Benefits enrollment" source="bswift Benefits (simulated)">
        <Row label="Health">{p.benefits.health ? `${p.benefits.health.plan} · ${p.benefits.health.tier} · ${fmtFull(p.benefits.health.perCheck)}/check` : 'NOT ENROLLED'}</Row>
        {p.benefits.health && (
          <Row label="Deductible used">{fmt(p.benefits.health.usedDeductible)} of {fmt(p.benefits.health.deductible)}</Row>
        )}
        <Row label="Dental">{p.benefits.dental ? `${p.benefits.dental.plan} · ${fmtFull(p.benefits.dental.perCheck)}/check` : 'NOT ENROLLED'}</Row>
        <Row label="Vision">{p.benefits.vision ? `${p.benefits.vision.plan} · ${fmtFull(p.benefits.vision.perCheck)}/check` : 'NOT ENROLLED'}</Row>
        <Row label="Life insurance">{p.benefits.life.enrolled ? `${fmt(p.benefits.life.coverage)} · beneficiary ${p.benefits.life.beneficiaryOnFile ? 'on file' : 'NOT on file'}` : 'NOT ENROLLED'}</Row>
        <Row label="FSA">{p.benefits.fsa ? `${fmt(p.benefits.fsa.balance)} balance · expires ${p.benefits.fsa.expiresOn}` : 'NOT ENROLLED'}</Row>
        <Row label="Open enrollment">{titleCase(p.benefits.openEnrollment.status)} · {p.benefits.openEnrollment.dates}</Row>
        <Row label="Effective date">{p.benefits.effectiveDate ?? '—'}</Row>
      </Section>

      <Section title="Retirement" source="Fidelity NetBenefits (simulated)">
        <Row label="Enrolled">{p.retirement.enrolled ? 'Yes' : 'No'}</Row>
        {p.retirement.enrolled && (
          <>
            <Row label="Contribution">{p.retirement.contributionPct}% · {p.retirement.contributionPerCheck !== null ? `${fmtFull(p.retirement.contributionPerCheck)}/check` : '—'}</Row>
            <Row label="YTD employee">{fmt(p.retirement.ytdEmployeeContrib)}</Row>
            <Row label="YTD employer match">{fmt(p.retirement.ytdEmployerMatch)}</Row>
            <Row label="Match formula">{p.retirement.employerMatch}</Row>
            {p.retirement.leavingMatchOnTable > 0 && (
              <Row label="⚠ Leaving on table">{fmt(p.retirement.leavingMatchOnTable)}/yr</Row>
            )}
            <Row label="Vested">{p.retirement.vestedPct}%</Row>
            <Row label="Balance">{p.retirement.balance !== null ? fmt(p.retirement.balance) : '—'}</Row>
            <Row label="Projected at 65">{p.retirement.projectedAt65 !== null ? fmt(p.retirement.projectedAt65) : '—'}</Row>
          </>
        )}
        {p.retirement.pension && (
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 6 }}>
              Pension plan
            </div>
            <Row label="Years of service" subtle>{p.retirement.pension.yearsOfService}</Row>
            <Row label="Projected monthly at 65" subtle>{fmt(p.retirement.pension.projectedMonthly)}/mo</Row>
          </div>
        )}
      </Section>

      {(p.certifications.length > 0 || p.onboarding) && (
        <Section title="Certifications & training" source="Compliance Admin (simulated)">
          {p.certifications.map((c) => (
            <Row key={c.label} label={c.label}>
              {c.status === 'expiring_soon' && <span style={{ color: '#F0A030', fontWeight: 700 }}>⚠ </span>}
              expires {c.expires} ({c.daysToExpiry} days)
            </Row>
          ))}
          {p.onboarding && (
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 6 }}>
                Onboarding — {p.onboarding.percentComplete}% complete
              </div>
              {p.onboarding.outstandingItems.map((item, i) => (
                <Row key={i} label={`Task ${i + 1}`} subtle>{item}</Row>
              ))}
            </div>
          )}
        </Section>
      )}

      <Section title="Expense allowances" source="Concur (simulated)">
        {p.expenses.toolAllowance && (
          <Row label="Tool + boot allowance">{fmt(p.expenses.toolAllowance.usedYtd)} used of {fmt(p.expenses.toolAllowance.limit)} annual</Row>
        )}
        <Row label="Mileage YTD">{p.expenses.mileageYtd} mi · {fmt(p.expenses.mileageYtd * p.expenses.mileageRate)} reimbursed</Row>
        <Row label="Current mileage rate">${p.expenses.mileageRate.toFixed(2)}/mi</Row>
        <Row label="YTD reimbursements">{fmt(p.expenses.ytdReimbursements)}</Row>
        {p.expenses.pendingReports.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 6 }}>
              Pending reports
            </div>
            {p.expenses.pendingReports.map((r, i) => (
              <Row key={i} label={r.label} subtle>{fmtFull(r.amount)} · {r.status}</Row>
            ))}
          </div>
        )}
      </Section>

      <div style={{ fontSize: 10, color: 'var(--color-subtle)', textAlign: 'center', padding: '8px 0 20px' }}>
        All values are drawn from simulated HRMS / payroll / benefits / retirement integrations. Production deployments connect to ADP, Fidelity, bswift, Kronos, and Concur via their standard APIs.
      </div>
    </div>
  );
}

function Header({ persona }: { persona: ReturnType<typeof usePersona>['persona'] }) {
  return (
    <section
      style={{
        background: 'linear-gradient(135deg, rgba(27,77,230,0.14), rgba(245,138,31,0.08))',
        border: '1px solid var(--color-border)',
        borderRadius: 14,
        padding: '22px 24px',
      }}
    >
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#F58A1F', marginBottom: 6 }}>
        My HR File
      </div>
      <h1 style={{ fontSize: 26, fontWeight: 900, color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
        {persona.profile.firstName} {persona.profile.lastName}
      </h1>
      <div style={{ fontSize: 13, color: 'var(--color-muted)', marginTop: 4 }}>
        {persona.profile.title} · {persona.profile.department} · reports to {persona.profile.manager}
      </div>
      <div style={{ fontSize: 11, color: 'var(--color-subtle)', marginTop: 10 }}>
        Employee ID {persona.profile.employeeId} · {persona.profile.location} · started {persona.profile.startDate}
      </div>
    </section>
  );
}

function Section({ title, source, children }: { title: string; source: string; children: React.ReactNode }) {
  return (
    <section
      style={{
        background: 'var(--color-surf)',
        border: '1px solid var(--color-border)',
        borderRadius: 14,
        padding: '20px 24px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 6 }}>
        <h2 style={{ fontSize: 15, fontWeight: 800, color: 'var(--color-text)', letterSpacing: '-0.01em' }}>{title}</h2>
        <span style={{ fontSize: 10, color: 'rgba(14,165,114,0.70)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          source · {source}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {children}
      </div>
    </section>
  );
}

function Row({ label, children, subtle }: { label: string; children: React.ReactNode; subtle?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, padding: '4px 0', borderBottom: subtle ? 'none' : '1px dashed var(--color-border)' }}>
      <span style={{ fontSize: 12, color: 'var(--color-muted)', letterSpacing: '0.02em' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: subtle ? 500 : 600, color: subtle ? 'var(--color-muted)' : 'var(--color-text)', textAlign: 'right', maxWidth: '60%' }}>
        {children}
      </span>
    </div>
  );
}

function titleCase(s: string): string {
  return s.replace(/(^|\s|_)(\w)/g, (_, p, c) => p.replace('_', ' ') + c.toUpperCase());
}
