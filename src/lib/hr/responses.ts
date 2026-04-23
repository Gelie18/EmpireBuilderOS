/**
 * HR chat intent classifier + per-persona replies.
 *
 * A keyword classifier routes the user's message to a fixed intent. Each
 * intent has a per-persona reply that reads the persona record so every
 * number is consistent with the Profile page and alerts.
 *
 * For policy questions we fall through to a document-retrieval reply
 * handled in HRChat.tsx (not here) — classifier returns `policy_lookup`.
 */

import type { Persona, PersonaId } from './personas';

export type Intent =
  | 'pay_current'
  | 'pay_deductions'
  | 'pay_ytd'
  | 'pay_history'
  | 'hours_week'
  | 'hours_overtime'
  | 'timesheet_status'
  | 'missed_punch'
  | 'pto_balance'
  | 'pto_accrual'
  | 'pto_approved'
  | 'pto_request'
  | 'benefits_overview'
  | 'benefits_fsa'
  | 'benefits_dependents'
  | 'open_enrollment'
  | 'retirement_match'
  | 'retirement_balance'
  | 'retirement_vesting'
  | 'retirement_pension'
  | 'retirement_change_contribution'
  | 'retirement_beneficiary'
  | 'expense_mileage'
  | 'expense_tool_allowance'
  | 'expense_draft_report'
  | 'certification_expiring'
  | 'training_status'
  | 'onboarding_checklist'
  | 'anniversary'
  | 'direct_deposit'
  | 'tax_withholding'
  | 'performance_cycle'
  | 'performance_self_review'
  | 'performance_last_rating'
  | 'oneonone_log'
  | 'goals_list'
  | 'goals_update'
  | 'career_path'
  | 'my_documents'
  | 'deadlines'
  | 'compliance_nudges'
  | 'personal_info'
  | 'emergency_contact'
  | 'help_human'
  | 'policy_lookup'   // falls through to doc retrieval in HRChat
  | 'greeting'
  | 'unknown';

const INTENT_KEYWORDS: { intent: Intent; keywords: string[] }[] = [
  // Retirement
  { intent: 'retirement_change_contribution', keywords: ['increase 401k', 'bump 401k', 'change contribution', 'change my 401k', 'raise 401k', 'update 401k', 'update contribution'] },
  { intent: 'retirement_beneficiary', keywords: ['beneficiary', 'beneficiaries', 'primary beneficiary'] },
  { intent: 'retirement_match',      keywords: ['match', 'leaving money', 'free money', 'employer contribution', 'company match'] },
  { intent: 'retirement_balance',    keywords: ['401k balance', '401k', 'retirement balance', 'retirement account'] },
  { intent: 'retirement_vesting',    keywords: ['vest', 'vested', 'vesting'] },
  { intent: 'retirement_pension',    keywords: ['pension', 'defined benefit'] },

  // Pay & payroll
  { intent: 'pay_history',           keywords: ['paystub', 'pay stub', 'past paychecks', 'previous paychecks', 'last few checks', 'last paychecks'] },
  { intent: 'pay_deductions',        keywords: ['deduction', 'taxes coming out', 'whats coming out', "what's coming out", 'withholding breakdown'] },
  { intent: 'pay_ytd',               keywords: ['ytd', 'year to date', 'earned so far', 'earned this year'] },
  { intent: 'pay_current',           keywords: ['paycheck', 'payday', 'next pay', 'last paycheck', 'net pay', 'gross pay', 'paid'] },
  { intent: 'tax_withholding',       keywords: ['w-4', 'w4', 'filing status', 'allowances', 'withhold more', 'withhold less', 'additional withholding'] },
  { intent: 'direct_deposit',        keywords: ['direct deposit', 'bank account', 'routing', 'where my check'] },

  // Time & attendance
  { intent: 'hours_overtime',        keywords: ['overtime', 'ot hours', 'ot pay'] },
  { intent: 'hours_week',            keywords: ['hours this week', 'how many hours', 'hours worked'] },
  { intent: 'timesheet_status',      keywords: ['timesheet', 'submit timesheet', 'timesheet approved'] },
  { intent: 'missed_punch',          keywords: ['missed punch', 'forgot to clock', "didn't clock", 'didnt clock'] },

  // PTO
  { intent: 'pto_request',           keywords: ['request pto', 'request time off', 'put in pto', 'take pto', 'book pto', 'submit pto', 'take a day', 'take a vacation', 'take off', 'book vacation'] },
  { intent: 'pto_accrual',           keywords: ['accrue', 'accrual', 'how fast pto'] },
  { intent: 'pto_approved',          keywords: ['approved vacation', 'approved time off', 'my pto requests'] },
  { intent: 'pto_balance',           keywords: ['pto balance', 'pto', 'time off', 'days off', 'vacation days', 'sick days'] },

  // Benefits
  { intent: 'benefits_dependents',   keywords: ['dependent', 'add spouse', 'add child', 'my dependents'] },
  { intent: 'benefits_fsa',          keywords: ['fsa', 'hsa', 'flexible spending'] },
  { intent: 'open_enrollment',       keywords: ['open enrollment', 'enroll benefits', 'pick plan', 'benefits enrollment', 'enrollment walkthrough', 'walk me through enrollment'] },
  { intent: 'benefits_overview',     keywords: ['health plan', 'my benefits', 'dental', 'vision', 'insurance', 'benefit', 'deductible', 'coverage'] },

  // Expenses
  { intent: 'expense_draft_report',  keywords: ['submit expense', 'expense report', 'draft expense', 'mileage report', 'reimbursement for', 'submit mileage'] },
  { intent: 'expense_mileage',       keywords: ['mileage', 'miles', 'drove', 'drive'] },
  { intent: 'expense_tool_allowance',keywords: ['tool allowance', 'boot', 'tools', 'tool stipend'] },

  // Certs & training
  { intent: 'training_status',       keywords: ['training', 'required course', 'compliance training', 'my trainings'] },
  { intent: 'certification_expiring',keywords: ['cert', 'certification', 'osha', 'license', 'expiring'] },

  // Performance & goals
  { intent: 'performance_self_review', keywords: ['self review', 'self-review', 'draft my review', 'draft a self review', 'write my review'] },
  { intent: 'performance_last_rating', keywords: ['last rating', 'last review rating', 'my last review', 'annual rating'] },
  { intent: 'performance_cycle',     keywords: ['review cycle', 'when is review', 'performance review', 'review due'] },
  { intent: 'oneonone_log',          keywords: ['1:1', 'one on one', 'one-on-one', 'log a 1:1', 'log one on one', '1:1 notes', 'last 1:1'] },
  { intent: 'goals_update',          keywords: ['update goal', 'update my goal', 'mark goal', 'progress on goal'] },
  { intent: 'goals_list',            keywords: ['my goals', 'annual goals', 'quarterly goals', 'show goals', 'list goals', 'what are my goals'] },
  { intent: 'career_path',           keywords: ['career', 'next role', 'promotion', 'readiness', 'promote', 'move up', 'growth plan'] },

  // Documents / deadlines / compliance
  { intent: 'my_documents',          keywords: ['my documents', 'my files', 'signed documents', 'offer letter', 'my paperwork'] },
  { intent: 'deadlines',             keywords: ['deadline', 'deadlines', "what's due", 'upcoming due', 'due soon', 'due this week', 'whats due', "what's due soon", 'what is due'] },
  { intent: 'compliance_nudges',     keywords: ['compliance', 'what am i missing', 'whats missing', "what's missing", 'outstanding items'] },

  // Personal
  { intent: 'emergency_contact',     keywords: ['emergency contact'] },
  { intent: 'personal_info',         keywords: ['my address', 'update address', 'my phone', 'update phone', 'my email address'] },

  // Onboarding + misc
  { intent: 'onboarding_checklist',  keywords: ['onboard', 'to-do', 'todo', 'checklist', 'week 1', 'first week'] },
  { intent: 'anniversary',           keywords: ['anniversary', 'how long', 'tenure', 'years here'] },
  { intent: 'help_human',            keywords: ['talk to a person', 'talk to someone', 'real person', 'human', 'hr rep'] },

  // Policy lookup — keywords that signal "explain the policy"
  { intent: 'policy_lookup',         keywords: [
    'policy', 'handbook',
    'parental leave', 'paternity', 'maternity',
    'code of conduct', 'ethics', 'whistleblower', 'harassment',
    'drug and alcohol', 'drug alcohol', 'safety', 'ppe',
    'bereavement', 'jury duty', 'fmla',
    'holiday schedule', 'holidays this year',
    'hardship', 'rollover', 'roth',
    'travel per diem', 'per diem',
    'outside employment', 'social media', 'conflict of interest',
    'pay schedule', 'paystub reading',
  ] },

  { intent: 'greeting',              keywords: ['hi', 'hello', 'hey', 'yo '] },
];

export function classifyIntent(message: string): Intent {
  const m = message.toLowerCase().trim();
  if (!m) return 'unknown';
  for (const { intent, keywords } of INTENT_KEYWORDS) {
    if (keywords.some((k) => m.includes(k))) return intent;
  }
  return 'unknown';
}

export interface ChatReply {
  text: string;
  sources: string[];
  timestamp: string;
}

const TIMESTAMP = 'as of 10:32am today';

const fmtMoney = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const fmtMoneyFull = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });

export function replyFor(intent: Intent, persona: Persona): ChatReply {
  const first = persona.profile.firstName;
  const p = persona;

  switch (intent) {
    case 'greeting':
      return {
        text: `Hi ${first} — what would you like to know? I can answer questions about your profile (pay, hours, PTO, benefits, 401k, certifications, expenses, performance, goals) and our company policies (handbook, PTO, 401k, expense, safety, parental leave, code of conduct, benefits). I can also draft things like a PTO request, expense report, or self-review. If I can't help, say "talk to a person" and I'll hand you off to HR.`,
        sources: [],
        timestamp: TIMESTAMP,
      };

    /* ─────────────────────────── Pay ─────────────────────────── */

    case 'pay_current':
      if (p.pay.periodNet === null) {
        return {
          text: `Your first paycheck arrives **${p.snapshot.nextPayday}** and covers ${p.pay.periodStart} through ${p.pay.periodEnd}. Expected gross is **${fmtMoneyFull(p.pay.periodGross)}**; net will depend on your W-4 elections. ⚠ Direct deposit isn't set up — if that's not fixed by Friday, the check will be issued as paper.`,
          sources: ['pay-schedule.md', 'ADP Payroll (simulated)'],
          timestamp: TIMESTAMP,
        };
      }
      return {
        text: `Your next payday is **${p.snapshot.nextPayday}**, covering ${p.pay.periodStart} through ${p.pay.periodEnd}. Expected net: **${fmtMoneyFull(p.pay.periodNet)}** (gross ${fmtMoneyFull(p.pay.periodGross)}). Deposits to the account ending in ${p.pay.directDepositLast4}.`,
        sources: ['pay-schedule.md', 'ADP Payroll (simulated)'],
        timestamp: TIMESTAMP,
      };

    case 'pay_deductions': {
      if (p.pay.deductionsThisCheck.length === 0) {
        return {
          text: `You haven't had a paycheck yet, so no deductions have run. Your first check (${p.snapshot.nextPayday}) will include federal income tax, Social Security (6.2%), Medicare (1.45%), and any benefits you enroll in before Apr 25.`,
          sources: ['pay-schedule.md'],
          timestamp: TIMESTAMP,
        };
      }
      const lines = p.pay.deductionsThisCheck.map((d) => `• ${d.label}: ${fmtMoneyFull(d.amount)}`).join('\n');
      return {
        text: `Here's everything coming out of this paycheck:\n\n${lines}\n\nGross: ${fmtMoneyFull(p.pay.periodGross)} → Net: ${fmtMoneyFull(p.pay.periodNet ?? 0)}.`,
        sources: ['ADP Payroll (simulated)'],
        timestamp: TIMESTAMP,
      };
    }

    case 'pay_ytd':
      return {
        text: `Year-to-date: you've earned **${fmtMoney(p.pay.ytdGross)}** gross and paid **${fmtMoney(p.pay.ytdTaxes)}** in taxes. ${p.pay.ytdOvertimePay > 0 ? `Overtime contributed ${fmtMoney(p.pay.ytdOvertimePay)} of that across ${p.pay.overtimeHoursYtd} OT hours.` : 'No overtime earnings yet this year.'}`,
        sources: ['ADP Payroll (simulated)'],
        timestamp: TIMESTAMP,
      };

    case 'pay_history': {
      if (p.pay.recentStubs.length === 0) {
        return {
          text: `No paystubs yet — your first paycheck lands ${p.snapshot.nextPayday}.`,
          sources: ['ADP Payroll (simulated)'],
          timestamp: TIMESTAMP,
        };
      }
      const lines = p.pay.recentStubs.map((s) => `• ${s.date} (${s.period}): gross ${fmtMoney(s.gross)} → net ${fmtMoney(s.net)}`).join('\n');
      return {
        text: `Last ${p.pay.recentStubs.length} paystubs:\n\n${lines}\n\nFull stubs with all line items are in your banking profile.`,
        sources: ['ADP Payroll (simulated)'],
        timestamp: TIMESTAMP,
      };
    }

    case 'tax_withholding':
      return {
        text: `Your W-4 is **${p.profile.taxSetup.w4OnFile ? 'on file' : 'NOT on file'}**. Current elections: **${p.profile.taxSetup.filingStatus}**, ${p.profile.taxSetup.allowances} allowance${p.profile.taxSetup.allowances === 1 ? '' : 's'}, ${p.profile.taxSetup.additionalWithholding > 0 ? `additional withholding ${fmtMoneyFull(p.profile.taxSetup.additionalWithholding)}/check` : 'no additional withholding'}. You can update this any time from your banking profile — common reasons: marriage, new child, moving to a new state. Consult a tax professional if unsure.`,
        sources: ['payroll-setup.md', 'ADP Payroll (simulated)'],
        timestamp: TIMESTAMP,
      };

    case 'direct_deposit':
      if (!p.pay.directDepositLast4) {
        return {
          text: '⚠ **Direct deposit is not set up.** Without it your first paycheck will be issued as a paper check. Add an account from your banking profile — the change applies to the next pay run if submitted by Friday.',
          sources: ['payroll-setup.md'],
          timestamp: TIMESTAMP,
        };
      }
      return {
        text: `Direct deposit is active to the account ending in **${p.pay.directDepositLast4}**. You can split deposits across up to 3 accounts from your banking profile.`,
        sources: ['payroll-setup.md', 'ADP Payroll (simulated)'],
        timestamp: TIMESTAMP,
      };

    /* ─────────────────────────── Time ─────────────────────────── */

    case 'hours_week':
      if (p.time.timesheetStatus === 'not_applicable') {
        return {
          text: `You're salaried, so hours aren't tracked against a target. For context, your scheduled coverage this week is roughly ${p.time.hoursThisWeek} hours of focused work time.`,
          sources: ['employee-handbook.md'],
          timestamp: TIMESTAMP,
        };
      }
      return {
        text: `You've worked **${p.time.hoursThisWeek} hours** this week so far, against a 40-hour target. Today you clocked in at ${p.time.clockedToday} and you're at ${p.time.hoursToday}h. ${p.time.overtimeThisWeek > 0 ? `You're at **${p.time.overtimeThisWeek}h of overtime** — anything over 40 regular hours pays at 1.5×.` : ''}`,
        sources: ['Kronos Timekeeping (simulated)'],
        timestamp: TIMESTAMP,
      };

    case 'hours_overtime':
      return {
        text: `This week: **${p.time.overtimeThisWeek}h of overtime**. Year-to-date: **${p.pay.overtimeHoursYtd}h** of OT, which has paid out ${fmtMoney(p.pay.ytdOvertimePay)}. Any hours over 40 regular in a week pay at 1.5× your ${p.profile.compensation.basis === 'hourly' ? `$${p.profile.compensation.rate}/hr` : 'base'} rate.`,
        sources: ['pay-policy.md', 'Kronos Timekeeping (simulated)'],
        timestamp: TIMESTAMP,
      };

    case 'timesheet_status':
      if (p.time.timesheetStatus === 'not_applicable') {
        return {
          text: "Salaried employees don't submit timesheets. If you need to log PTO or a sick day, use the Time Off request flow instead.",
          sources: ['employee-handbook.md'],
          timestamp: TIMESTAMP,
        };
      }
      return {
        text: `Your timesheet for the week of ${p.time.weekStart} is **${p.time.timesheetStatus}**. ${p.time.missedPunches.length > 0 ? `⚠ You have ${p.time.missedPunches.length} missed punch to resolve: ${p.time.missedPunches.join('; ')}. Fix this before Friday or the pay period will close with a flagged exception.` : ''}`,
        sources: ['Kronos Timekeeping (simulated)'],
        timestamp: TIMESTAMP,
      };

    case 'missed_punch':
      if (p.time.missedPunches.length === 0) {
        return {
          text: 'No missed punches on file. All your shifts this pay period scanned in and out cleanly.',
          sources: ['Kronos Timekeeping (simulated)'],
          timestamp: TIMESTAMP,
        };
      }
      return {
        text: `I see ${p.time.missedPunches.join('; ')}. To fix it: submit a correction from the mobile app (Time → Corrections) or ask your manager ${p.profile.manager} to key it in. It needs to clear before the pay period closes Friday.`,
        sources: ['timekeeping-policy.md', 'Kronos Timekeeping (simulated)'],
        timestamp: TIMESTAMP,
      };

    /* ─────────────────────────── PTO ─────────────────────────── */

    case 'pto_balance':
      if (p.timeOff.ptoRemainingDays === 0 && p.profile.status === 'probationary') {
        return {
          text: `You're still in the 90-day probationary period, so PTO hasn't started accruing. You'll begin accruing ${p.timeOff.ptoAccrualRate} on ${p.timeOff.nextAccrualDate}. You do have **${p.timeOff.sickRemainingDays} sick days** available today.`,
          sources: ['pto-policy.md', 'BambooHR (simulated)'],
          timestamp: TIMESTAMP,
        };
      }
      return {
        text: `You have **${p.timeOff.ptoRemainingDays} PTO days** remaining and **${p.timeOff.sickRemainingDays} sick days**. You've used ${p.timeOff.ptoUsedYtd} PTO days year-to-date. ${p.timeOff.holidaysRemaining} company holidays left this year.`,
        sources: ['pto-policy.md', 'BambooHR (simulated)'],
        timestamp: TIMESTAMP,
      };

    case 'pto_accrual':
      return {
        text: `You accrue PTO at **${p.timeOff.ptoAccrualRate}**. Your next accrual posts on ${p.timeOff.nextAccrualDate}. Unused PTO does not roll over at year end — we issue a reminder in early December.`,
        sources: ['pto-policy.md', 'BambooHR (simulated)'],
        timestamp: TIMESTAMP,
      };

    case 'pto_approved': {
      const approved = p.timeOff.approved.map((a) => `• ${a.label}: ${a.dates}`).join('\n') || '• Nothing on the calendar';
      const pending = p.timeOff.pending.length > 0 ? `\n\n**Pending:**\n${p.timeOff.pending.map((x) => `• ${x.label}: ${x.dates} — ${x.status}`).join('\n')}` : '';
      return {
        text: `**Approved time off:**\n${approved}${pending}`,
        sources: ['BambooHR (simulated)'],
        timestamp: TIMESTAMP,
      };
    }

    case 'pto_request': {
      const canBook = p.timeOff.ptoRemainingDays > 0;
      if (!canBook) {
        return {
          text: `I'd draft a PTO request for you, but you have **0 PTO days** available. ${p.profile.status === 'probationary' ? `You're still in probation — PTO starts accruing ${p.timeOff.nextAccrualDate}. For now you have ${p.timeOff.sickRemainingDays} sick days for illness or family emergencies.` : 'You might be able to take unpaid leave with manager approval.'}`,
          sources: ['pto-policy.md'],
          timestamp: TIMESTAMP,
        };
      }
      return {
        text: `Happy to draft a PTO request. Tell me the dates you want off (e.g. "Jun 16–20") and any note for ${p.profile.manager}, and I'll submit it.\n\n**Draft request — ${first} ${p.profile.lastName}**\n• PTO balance before: ${p.timeOff.ptoRemainingDays} days\n• Manager: ${p.profile.manager}\n• Type: PTO (not sick)\n• Dates: _awaiting your input_\n• Note: _optional_\n\nOnce you confirm, I'll route it to ${p.profile.manager} for approval. Target SLA: 5 business days.`,
        sources: ['pto-policy.md', 'BambooHR (simulated)'],
        timestamp: TIMESTAMP,
      };
    }

    /* ─────────────────────────── Benefits ─────────────────────────── */

    case 'benefits_overview':
      if (!p.benefits.health) {
        return {
          text: `You haven't elected benefits yet. Open enrollment is **${p.benefits.openEnrollment.dates}** and closes in 4 days. You need to select: medical plan, dental, vision, life beneficiary, and FSA election. If the window closes you'll wait until next year's open enrollment unless you have a qualifying life event.`,
          sources: ['benefits-guide.md', 'bswift Benefits (simulated)'],
          timestamp: TIMESTAMP,
        };
      }
      return {
        text: `You're enrolled in:\n• **Health:** ${p.benefits.health.plan} — ${p.benefits.health.tier} — ${fmtMoneyFull(p.benefits.health.perCheck)}/check\n• **Deductible:** ${fmtMoney(p.benefits.health.usedDeductible)} of ${fmtMoney(p.benefits.health.deductible)} used\n• **Dental:** ${p.benefits.dental?.plan} — ${fmtMoneyFull(p.benefits.dental!.perCheck)}/check\n• **Vision:** ${p.benefits.vision?.plan} — ${fmtMoneyFull(p.benefits.vision!.perCheck)}/check\n• **Life:** ${fmtMoney(p.benefits.life.coverage)} coverage · beneficiary ${p.benefits.life.beneficiaryOnFile ? 'on file' : 'NOT on file'}`,
        sources: ['benefits-guide.md', 'bswift Benefits (simulated)'],
        timestamp: TIMESTAMP,
      };

    case 'benefits_fsa':
      if (!p.benefits.fsa) {
        return {
          text: "You're not enrolled in an FSA this year. You can enroll during open enrollment (Nov 1 – Nov 15) or after a qualifying life event. The 2026 max contribution is $3,300.",
          sources: ['benefits-guide.md'],
          timestamp: TIMESTAMP,
        };
      }
      return {
        text: `Your FSA balance is **${fmtMoney(p.benefits.fsa.balance)}** and it expires **${p.benefits.fsa.expiresOn}**. Use-it-or-lose-it — any balance at year-end is forfeited. Eligible spends include prescriptions, copays, contact lenses, many OTC items, and some medical equipment.`,
        sources: ['fsa-eligible-expenses.md', 'bswift FSA (simulated)'],
        timestamp: TIMESTAMP,
      };

    case 'benefits_dependents': {
      if (p.benefits.dependents.length === 0) {
        return {
          text: "No dependents on file. You can add a spouse, domestic partner, or children under 26 during open enrollment or within 30 days of a qualifying life event (marriage, birth, adoption, loss of other coverage).",
          sources: ['benefits-guide.md'],
          timestamp: TIMESTAMP,
        };
      }
      const rows = p.benefits.dependents.map((d) => `• **${d.name}** — ${d.relationship}${d.onPlan ? ' · on plan' : ' · not covered'}`).join('\n');
      return {
        text: `Dependents on file:\n\n${rows}\n\nAdd or remove dependents during open enrollment, or within 30 days of a qualifying life event.`,
        sources: ['benefits-guide.md', 'bswift Benefits (simulated)'],
        timestamp: TIMESTAMP,
      };
    }

    case 'open_enrollment': {
      if (p.benefits.openEnrollment.status === 'open') {
        return {
          text: `Open enrollment is **open** — window ${p.benefits.openEnrollment.dates}. I can walk you through it:\n\n1. **Medical** — pick PPO 2000 (lower premium, higher deductible) or PPO 1000 (higher premium, lower deductible)\n2. **Dental** — Standard or Premier\n3. **Vision** — Choice or Signature\n4. **Life beneficiary** — add at least one; we can't pay out without it\n5. **FSA** — elect an annual amount if you expect medical costs ($3,300 max)\n\nReady to start? Say "medical first" or "skip to FSA" and I'll walk you through that step.`,
          sources: ['open-enrollment-guide.md', 'benefits-guide.md'],
          timestamp: TIMESTAMP,
        };
      }
      return {
        text: `Open enrollment is currently **closed**. The next window is ${p.benefits.openEnrollment.dates}. Mid-year changes are only allowed after a qualifying life event (marriage, birth/adoption, loss of other coverage) — you have 30 days to submit documentation.`,
        sources: ['open-enrollment-guide.md'],
        timestamp: TIMESTAMP,
      };
    }

    /* ─────────────────────────── Retirement ─────────────────────────── */

    case 'retirement_match':
      if (!p.retirement.enrolled) {
        return {
          text: `You're not enrolled in the 401k yet. The company matches **${p.retirement.employerMatch}** — you'd need to contribute at least ${p.retirement.fullMatchAt}% to get the full match. On a ${fmtMoney(p.profile.compensation.basis === 'salary' ? p.profile.compensation.rate : p.pay.ytdGross * 4)} income, that match is worth roughly ${fmtMoney(p.retirement.leavingMatchOnTable)}/year in free money.`,
          sources: ['401k-spd.md', 'Fidelity NetBenefits (simulated)'],
          timestamp: TIMESTAMP,
        };
      }
      if (p.retirement.leavingMatchOnTable > 0) {
        return {
          text: `You're contributing **${p.retirement.contributionPct}%** (${fmtMoneyFull(p.retirement.contributionPerCheck ?? 0)}/check). Company match: **${p.retirement.employerMatch}** — to capture the full match you'd need to be at ${p.retirement.fullMatchAt}%. At your current rate you're leaving roughly **${fmtMoney(p.retirement.leavingMatchOnTable)}/year** in employer money on the table. Say "bump to 5%" and I'll draft the change.`,
          sources: ['401k-spd.md', 'Fidelity NetBenefits (simulated)'],
          timestamp: TIMESTAMP,
        };
      }
      return {
        text: `You're contributing **${p.retirement.contributionPct}%** (${fmtMoneyFull(p.retirement.contributionPerCheck ?? 0)}/check) and capturing the full employer match of ${p.retirement.employerMatch}. YTD employer match: ${fmtMoney(p.retirement.ytdEmployerMatch)}. Nicely done.`,
        sources: ['401k-spd.md', 'Fidelity NetBenefits (simulated)'],
        timestamp: TIMESTAMP,
      };

    case 'retirement_balance':
      if (p.retirement.balance === null) {
        return {
          text: `You don't have a 401k balance yet because you aren't enrolled. Once you enroll and contributions start, Fidelity NetBenefits will be your account portal.`,
          sources: ['Fidelity NetBenefits (simulated)'],
          timestamp: TIMESTAMP,
        };
      }
      return {
        text: `Your 401k balance is **${fmtMoney(p.retirement.balance)}**. YTD you've contributed ${fmtMoney(p.retirement.ytdEmployeeContrib)} and the company has matched ${fmtMoney(p.retirement.ytdEmployerMatch)}. At your current rate, the modeled projection at age 65 is roughly **${fmtMoney(p.retirement.projectedAt65 ?? 0)}** (assumes 7% avg return, not guaranteed).`,
        sources: ['Fidelity NetBenefits (simulated)'],
        timestamp: TIMESTAMP,
      };

    case 'retirement_vesting':
      if (p.retirement.vestedPct === null) {
        return {
          text: `You'll start vesting once you're enrolled and contributions begin. Our plan has a 3-year graded schedule: 33% vested after year 1, 66% after year 2, 100% after year 3. Your own contributions are always 100% yours.`,
          sources: ['401k-spd.md'],
          timestamp: TIMESTAMP,
        };
      }
      return {
        text: `You are **${p.retirement.vestedPct}% vested** in employer contributions. If you left today you'd keep all of the ${fmtMoney(p.retirement.ytdEmployerMatch)} YTD match (and the full historical employer money in your balance). Your own contributions are always 100% yours.`,
        sources: ['401k-spd.md', 'Fidelity NetBenefits (simulated)'],
        timestamp: TIMESTAMP,
      };

    case 'retirement_pension':
      if (!p.retirement.pension) {
        return {
          text: `We don't have a defined-benefit pension plan for your role — just the 401k with employer match. Some roles have legacy pension eligibility; your comp plan does not.`,
          sources: ['benefits-guide.md'],
          timestamp: TIMESTAMP,
        };
      }
      return {
        text: `You're enrolled in the pension plan with **${p.retirement.pension.yearsOfService} years of credited service**. At current service-year projections, your benefit at age 65 is estimated at **${fmtMoney(p.retirement.pension.projectedMonthly)}/month** for life. This is in addition to your 401k balance of ${fmtMoney(p.retirement.balance ?? 0)}.`,
        sources: ['pension-plan-document.md', 'Pension Admin (simulated)'],
        timestamp: TIMESTAMP,
      };

    case 'retirement_change_contribution':
      if (!p.retirement.enrolled) {
        return {
          text: `You're not enrolled yet. I can open an enrollment — **I recommend ${p.retirement.fullMatchAt}%** to capture the full employer match (${p.retirement.employerMatch}). That's ~${fmtMoney(p.retirement.leavingMatchOnTable)}/year of free money at your current comp.\n\nConfirm with "enroll at 5%" (or pick a different %) and I'll draft the change. Effective the next pay run.`,
          sources: ['401k-spd.md', 'Fidelity NetBenefits (simulated)'],
          timestamp: TIMESTAMP,
        };
      }
      return {
        text: `You're currently at **${p.retirement.contributionPct}%**. ${p.retirement.leavingMatchOnTable > 0 ? `Bumping to ${p.retirement.fullMatchAt}% captures the full employer match — about ${fmtMoney(p.retirement.leavingMatchOnTable)}/year more in your retirement account.` : `You're already capturing the full match.`} Tell me the new % (1–${p.retirement.catchUpEligible ? 100 : 25}%) and I'll draft the change — effective next pay run.\n\nReminder: 2026 IRS limit is $23,500${p.retirement.catchUpEligible ? ' + $7,500 catch-up' : ''}. Roth contributions are also available${p.retirement.canDoRoth ? '.' : ' (not available for your plan).'}`,
        sources: ['401k-spd.md', 'Fidelity NetBenefits (simulated)'],
        timestamp: TIMESTAMP,
      };

    case 'retirement_beneficiary': {
      if (p.retirement.beneficiaries.length === 0) {
        return {
          text: `⚠ No 401k beneficiaries on file. This is important — without a beneficiary, distributions default to your estate (slower and more complex for your family). To add one, tell me the name, relationship, and share % (must total 100% across primary beneficiaries).`,
          sources: ['401k-spd.md', 'Fidelity NetBenefits (simulated)'],
          timestamp: TIMESTAMP,
        };
      }
      const rows = p.retirement.beneficiaries.map((b) => `• **${b.name}** — ${b.relationship} — ${b.sharePct}%`).join('\n');
      return {
        text: `Current 401k beneficiaries:\n\n${rows}\n\nYou can update these any time. Common life events to review: marriage, divorce, birth of a child.`,
        sources: ['Fidelity NetBenefits (simulated)'],
        timestamp: TIMESTAMP,
      };
    }

    /* ─────────────────────────── Expenses ─────────────────────────── */

    case 'expense_mileage':
      return {
        text: `Mileage reimbursement rate is **$${p.expenses.mileageRate.toFixed(2)}/mile** (2026 IRS standard). YTD you've logged ${p.expenses.mileageYtd} miles = ${fmtMoney(p.expenses.mileageYtd * p.expenses.mileageRate)} reimbursed. ${p.expenses.pendingReports.find((r) => r.label.toLowerCase().includes('mileage')) ? 'You have a mileage report pending approval right now.' : ''}`,
        sources: ['expense-policy.md', 'Concur (simulated)'],
        timestamp: TIMESTAMP,
      };

    case 'expense_tool_allowance':
      if (!p.expenses.toolAllowance) {
        return {
          text: "Your role isn't eligible for the annual tool/boot allowance — that benefit is limited to field technicians and shop staff.",
          sources: ['benefits-guide.md'],
          timestamp: TIMESTAMP,
        };
      }
      return {
        text: `Your annual tool + boot allowance is **${fmtMoney(p.expenses.toolAllowance.limit)}**. You've used **${fmtMoney(p.expenses.toolAllowance.usedYtd)}** YTD — **${fmtMoney(p.expenses.toolAllowance.limit - p.expenses.toolAllowance.usedYtd)}** remaining. Submit receipts through Concur; reimbursement lands on your next paycheck after approval.`,
        sources: ['tool-allowance-policy.md', 'Concur (simulated)'],
        timestamp: TIMESTAMP,
      };

    case 'expense_draft_report':
      return {
        text: `Happy to draft an expense report. Tell me:\n\n1. **Type** — mileage, meals, travel, tool/boot, or mixed\n2. **Date(s)** — when did the spend happen?\n3. **Amount** — or attach receipts (I'll OCR totals)\n4. **Business purpose** — what project or client?\n\n**Draft report — ${first} ${p.profile.lastName}**\n• Status: _awaiting your line items_\n• Approver: ${p.profile.manager}\n• Reimbursement target: next Friday payroll run if submitted by Wednesday\n\nReminder: receipts required for anything over $25 (IRS rule). Reports over 90 days old cannot be reimbursed.`,
        sources: ['expense-policy.md', 'Concur (simulated)'],
        timestamp: TIMESTAMP,
      };

    /* ─────────────────────────── Certs & training ─────────────────────────── */

    case 'certification_expiring': {
      const expiring = p.certifications.filter((c) => c.status === 'expiring_soon');
      if (p.certifications.length === 0) {
        return {
          text: "No certifications are currently on file for your role. If your role requires one, your manager will have the list.",
          sources: ['training-compliance.md'],
          timestamp: TIMESTAMP,
        };
      }
      if (expiring.length === 0) {
        return {
          text: `All your certifications are current:\n${p.certifications.map((c) => `• ${c.label} — expires ${c.expires} (${c.daysToExpiry} days out)`).join('\n')}`,
          sources: ['training-compliance.md'],
          timestamp: TIMESTAMP,
        };
      }
      return {
        text: expiring.map((c) => `⚠ **${c.label}** expires ${c.expires} (${c.daysToExpiry} days). Renewal is typically a short refresher — ask your manager which provider we use, or I can route you to training.`).join('\n\n'),
        sources: ['training-compliance.md', 'safety-guide.md'],
        timestamp: TIMESTAMP,
      };
    }

    case 'training_status': {
      if (p.training.length === 0) {
        return { text: "No required trainings on your plate right now.", sources: ['training-compliance.md'], timestamp: TIMESTAMP };
      }
      const required = p.training.filter((t) => t.required);
      const open = required.filter((t) => t.status !== 'complete');
      const rows = p.training.map((t) => `• ${t.course} — ${t.status.replace('_', ' ')}${t.dueBy ? ` (due ${t.dueBy})` : ''}${t.required ? ' · required' : ''}`).join('\n');
      return {
        text: `Your training plan:\n\n${rows}${open.length > 0 ? `\n\n⚠ ${open.length} required course${open.length === 1 ? '' : 's'} still open.` : '\n\nAll required trainings are complete — nice.'}`,
        sources: ['training-compliance.md'],
        timestamp: TIMESTAMP,
      };
    }

    /* ─────────────────────────── Performance & goals ─────────────────────────── */

    case 'performance_cycle': {
      const r = p.performance;
      return {
        text: `**${r.cycle}** — current phase: **${r.phase.replace('_', ' ')}**.${r.selfReviewDue ? ` Self-review due ${r.selfReviewDue}.` : ''}${r.managerReviewDue ? ` Manager review due ${r.managerReviewDue}.` : ''}\n\n${r.phase === 'self_review' ? `You're up — ready to draft your self-review? Say "draft my self review" and I'll build one from your goals and 1:1 notes.` : ''}`,
        sources: ['performance-policy.md'],
        timestamp: TIMESTAMP,
      };
    }

    case 'performance_last_rating':
      if (!p.performance.lastRating) {
        return { text: `You haven't been rated yet — your first review cycle is ${p.performance.cycle}.`, sources: ['performance-policy.md'], timestamp: TIMESTAMP };
      }
      return {
        text: `Your last rating was **${p.performance.lastRating}** on the ${p.performance.lastRatingCycle} cycle.${p.performance.feedback360Summary ? `\n\n**360 summary:** ${p.performance.feedback360Summary}` : ''}`,
        sources: ['performance-policy.md'],
        timestamp: TIMESTAMP,
      };

    case 'performance_self_review': {
      const r = p.performance;
      const goalsBlock = p.goals.map((g) => `• **${g.title}** (${g.progress}% · ${g.status.replace('_', ' ')}): ${g.description.split('.')[0]}.`).join('\n');
      const oneOnOneBlock = r.oneOnOnes.slice(0, 2).map((o) => `- ${o.date} ${o.topic}: ${o.notes}`).join('\n');
      return {
        text: `Here's a self-review draft pulled from your goals and 1:1s. Edit freely before submitting.\n\n---\n\n**${first} ${p.profile.lastName} — ${r.cycle} self-review**\n\n**Impact this cycle**\n${goalsBlock || '_no active goals yet_'}\n\n**What went well**\nBased on your 1:1 notes:\n${oneOnOneBlock || '_no 1:1s logged yet_'}\n\n**Where I want to grow**\n${r.feedback360Summary ? r.feedback360Summary.split('.').slice(-2).join('.').trim() : 'Continue building on the areas my manager has flagged in our 1:1s.'}\n\n**Ask of my manager**\nStretch assignment candidates and a specific rubric for readiness to my next role (${p.career.nextRole}).\n\n---\n\nWant me to tighten the "impact" or "grow" sections?`,
        sources: ['performance-policy.md', 'your goals', 'your 1:1 notes'],
        timestamp: TIMESTAMP,
      };
    }

    case 'oneonone_log': {
      const last = p.performance.oneOnOnes[0];
      if (!last) {
        return { text: `No 1:1 notes logged yet. When you finish your next 1:1, say "log a 1:1" and I'll capture topic and notes.`, sources: ['performance-policy.md'], timestamp: TIMESTAMP };
      }
      return {
        text: `Last 1:1 with ${p.profile.manager} — **${last.date}** (${last.topic}):\n\n> ${last.notes}\n\nWant to log a new one? Say "log a 1:1" with the topic and key notes.`,
        sources: ['performance-policy.md'],
        timestamp: TIMESTAMP,
      };
    }

    case 'goals_list': {
      if (p.goals.length === 0) {
        return { text: "No goals set yet. Talk to your manager to get 1–2 assigned and propose 2–3 of your own.", sources: ['performance-policy.md'], timestamp: TIMESTAMP };
      }
      const rows = p.goals.map((g) => `• **${g.title}** — ${g.progress}% · ${g.status.replace('_', ' ')} · due ${g.dueDate}`).join('\n');
      return {
        text: `Your active goals (${p.goals.length}):\n\n${rows}\n\nSay "update goal <title>" to bump progress or change status.`,
        sources: ['performance-policy.md'],
        timestamp: TIMESTAMP,
      };
    }

    case 'goals_update':
      return {
        text: `Sure — which goal, and what's the update? You can tell me one of:\n• New progress % (e.g. "${p.goals[0]?.title} to 70%")\n• New status (on track / at risk / off track / complete)\n• A short note to log\n\nI'll post the update and your manager will see it in your next 1:1.`,
        sources: ['performance-policy.md'],
        timestamp: TIMESTAMP,
      };

    case 'career_path':
      return {
        text: `Your trajectory: **${p.career.trajectory}**.\n\nNext role: **${p.career.nextRole}** — readiness estimated at **${p.career.nextRoleReadiness}%**.${p.career.mentor ? ` Mentor: ${p.career.mentor}.` : ' No mentor assigned yet.'}\n\nStrongest skills: ${p.career.skills.filter((s) => s.level === 'expert').map((s) => s.name).join(', ') || 'still building'}.\nGrowing: ${p.career.skills.filter((s) => s.level === 'learning').map((s) => s.name).join(', ') || '—'}.\n\nInterests on file: ${p.career.mobilityInterests.join(' · ') || 'none'}.\n\nWant me to draft a growth plan for your next role?`,
        sources: ['performance-policy.md', 'your career profile'],
        timestamp: TIMESTAMP,
      };

    /* ─────────────────────────── Misc / profile ─────────────────────────── */

    case 'my_documents': {
      const byCat: Record<string, typeof p.documents> = {};
      for (const d of p.documents) (byCat[d.category] ||= []).push(d);
      const block = Object.entries(byCat).map(([cat, docs]) => {
        const lines = docs.map((d) => `  • ${d.label}${d.signedOn ? ` — signed ${d.signedOn}` : ' — **not signed**'}`).join('\n');
        return `**${cat}**\n${lines}`;
      }).join('\n\n');
      return {
        text: `Documents on file:\n\n${block}\n\nAnything missing? Say "send me my offer letter" or "I need a copy of my W-4" and I'll route it.`,
        sources: ['your employee file'],
        timestamp: TIMESTAMP,
      };
    }

    case 'deadlines': {
      const items: string[] = [];
      if (p.benefits.openEnrollment.status === 'open') items.push(`⏰ **Benefits enrollment** closes ${p.benefits.openEnrollment.dates}`);
      if (!p.pay.directDepositLast4) items.push(`⏰ **Direct deposit** — set up before first paycheck (${p.snapshot.nextPayday})`);
      if (p.time.missedPunches.length > 0) items.push(`⏰ **Missed punch** correction due by Friday`);
      const expCert = p.certifications.find((c) => c.status === 'expiring_soon');
      if (expCert) items.push(`⏰ **${expCert.label}** expires ${expCert.expires} (${expCert.daysToExpiry} days)`);
      if (p.performance.selfReviewDue) items.push(`⏰ **Self-review** due ${p.performance.selfReviewDue}`);
      const atRisk = p.goals.find((g) => g.status === 'at_risk' || g.status === 'off_track');
      if (atRisk) items.push(`⏰ **Goal at risk:** "${atRisk.title}" — due ${atRisk.dueDate}`);
      const openTraining = p.training.find((t) => t.required && t.status !== 'complete' && t.dueBy);
      if (openTraining) items.push(`⏰ **${openTraining.course}** due ${openTraining.dueBy}`);
      const fsa = p.benefits.fsa;
      if (fsa && fsa.balance > 0) items.push(`⏰ **FSA** — ${fmtMoney(fsa.balance)} expires ${fsa.expiresOn}`);

      if (items.length === 0) return { text: "You're all clear — nothing on deadline right now. Nice.", sources: [], timestamp: TIMESTAMP };
      return {
        text: `Here's what's coming up for you:\n\n${items.join('\n')}\n\nSay "tell me about X" for the details on any of these.`,
        sources: ['your profile', 'compliance calendar'],
        timestamp: TIMESTAMP,
      };
    }

    case 'compliance_nudges': {
      const missing: string[] = [];
      if (p.benefits.openEnrollment.status === 'open' && p.benefits.openEnrollment.actionsRequired > 0) missing.push(`Benefits enrollment — ${p.benefits.openEnrollment.actionsRequired} pending actions`);
      if (!p.pay.directDepositLast4) missing.push('Direct deposit');
      if (p.retirement.enrolled && p.retirement.beneficiaries.length === 0) missing.push('401k beneficiary designation');
      if (p.benefits.life.enrolled && !p.benefits.life.beneficiaryOnFile) missing.push('Life insurance beneficiary');
      if (p.onboarding) missing.push(...p.onboarding.outstandingItems);
      const openTraining = p.training.filter((t) => t.required && t.status !== 'complete');
      for (const t of openTraining) missing.push(`Required training: ${t.course}`);

      if (missing.length === 0) return { text: "Everything compliance-wise is up to date — nice work.", sources: [], timestamp: TIMESTAMP };
      return {
        text: `Things that need your attention:\n\n${missing.map((m) => `• ${m}`).join('\n')}`,
        sources: ['compliance calendar'],
        timestamp: TIMESTAMP,
      };
    }

    case 'personal_info':
      return {
        text: `On file:\n• Preferred name: ${p.profile.preferredName || p.profile.firstName}\n• Email: ${p.profile.email}\n• Phone: ${p.profile.phone}\n• Address: ${p.profile.address}\n\nTo update any of these, say "update my address to <new>" and I'll route the change.`,
        sources: ['your profile'],
        timestamp: TIMESTAMP,
      };

    case 'emergency_contact':
      return {
        text: `Emergency contact on file:\n**${p.profile.emergencyContact.name}** — ${p.profile.emergencyContact.relationship} — ${p.profile.emergencyContact.phone}\n\nTo update, say "change emergency contact to <name, relationship, phone>".`,
        sources: ['your profile'],
        timestamp: TIMESTAMP,
      };

    case 'onboarding_checklist':
      if (!p.onboarding) {
        return {
          text: "Your onboarding is fully complete — no outstanding items.",
          sources: ['onboarding-checklist.md'],
          timestamp: TIMESTAMP,
        };
      }
      return {
        text: `You're **${p.onboarding.percentComplete}% done** with onboarding. Still outstanding:\n${p.onboarding.outstandingItems.map((i) => `• ${i}`).join('\n')}`,
        sources: ['onboarding-checklist.md'],
        timestamp: TIMESTAMP,
      };

    case 'anniversary':
      return {
        text: `Your start date is **${p.profile.startDate}** — that's **${p.profile.seniorityYears} year${p.profile.seniorityYears === 1 ? '' : 's'}** with the company. Your title is ${p.profile.title} and you report to ${p.profile.manager}.`,
        sources: ['BambooHR (simulated)'],
        timestamp: TIMESTAMP,
      };

    case 'help_human':
      return {
        text: "I'll route you to the HR team. I've shared the context of our conversation so you won't have to repeat yourself. Expect a response within one business day — typically faster.",
        sources: [],
        timestamp: TIMESTAMP,
      };

    case 'policy_lookup':
    case 'unknown':
    default:
      // Return a guidance reply. HRChat.tsx handles policy_lookup specially
      // by also attaching top matching doc sections. For unknown, this is
      // the fallback guidance.
      return {
        text: `I can help with your profile (pay, timekeeping, PTO, benefits, 401k, expenses, certs, performance, goals, career) and company policies (handbook, PTO, benefits, 401k, expense, safety, parental leave, code of conduct, payroll). I can also draft things — say "draft a PTO request", "start enrollment", "bump my 401k", or "draft my self-review". If this is a judgment call or sensitive, say "talk to a person".`,
        sources: [],
        timestamp: TIMESTAMP,
      };
  }
}

export const SUGGESTED_PROMPTS: Record<PersonaId, string[]> = {
  new_hire: [
    "What's due soon?",
    'Walk me through open enrollment',
    'Is my direct deposit set up?',
    "What's left on my onboarding checklist?",
    'What does the parental leave policy say?',
  ],
  field_tech: [
    'Am I leaving 401k match on the table?',
    'Draft a PTO request',
    'My OSHA cert is expiring — what do I do?',
    'How much tool allowance is left?',
    'Show my goals',
    "What's due soon?",
  ],
  senior_pm: [
    'Draft my self-review',
    "What's my 401k balance?",
    'How much FSA do I have expiring?',
    'Show my goals',
    "What's my career path?",
    'What does the expense policy say about per-diem?',
  ],
};
