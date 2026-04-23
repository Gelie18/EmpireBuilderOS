/**
 * Policy / handbook document registry.
 *
 * These are the documents the chat can cite + quote from. Seed documents
 * live here in code; admin-uploaded documents are persisted in localStorage
 * via the hook in this module, and are merged with the seed set.
 */

'use client';

import { useEffect, useState, useCallback } from 'react';

export type DocCategory =
  | 'handbook'
  | 'pto'
  | 'benefits'
  | 'retirement'
  | 'expenses'
  | 'safety'
  | 'code_of_conduct'
  | 'parental_leave'
  | 'payroll'
  | 'training'
  | 'other';

export interface PolicyDocument {
  id: string;
  title: string;
  category: DocCategory;
  version: string;
  updatedOn: string; // YYYY-MM-DD
  summary: string;
  sections: { heading: string; body: string }[];
  source: 'seed' | 'uploaded';
}

/* ──────────────────────────────── Seed set ───────────────────────────────── */

export const SEED_DOCUMENTS: PolicyDocument[] = [
  {
    id: 'handbook',
    title: 'Employee Handbook',
    category: 'handbook',
    version: 'FY26 · v2.1',
    updatedOn: '2026-01-01',
    summary: 'Core employment terms, workplace conduct, time & attendance basics, and where to find detailed policies.',
    sections: [
      {
        heading: 'About 783 Partners',
        body: '783 Partners is a baseball and softball holding company operating 5 brands across equipment manufacturing, direct-to-consumer retail, team sales, training technology, and field services. Full-time employees of 783 Partners (the holdco) are covered by this handbook. Portfolio-company employees follow their operating-company handbook, which supplements (but does not override) this document.',
      },
      {
        heading: 'Employment classification',
        body: 'Employees are classified as full-time, part-time, or contractor. Full-time employees work 30+ hours/week on a regular schedule and are eligible for full benefits after a 90-day probationary period (with exceptions called out per benefit). Part-time employees (<30 hours/week) receive sick leave, 401k eligibility, and holiday pay but are not eligible for medical/dental/vision or life insurance. Contractor status is governed by the separately signed contractor agreement.',
      },
      {
        heading: 'Probationary period',
        body: 'The first 90 calendar days of employment are a probationary period. During probation, managers run weekly check-ins. Some benefits (PTO accrual, tool allowance) begin accruing on the 91st day. Medical/dental/vision are available from day one via the new-hire enrollment window.',
      },
      {
        heading: 'Time & attendance',
        body: 'Non-exempt (hourly) employees clock in and out using the mobile timekeeping app or a site kiosk. Forgotten punches must be corrected before the pay period closes each Friday. Overtime is any hours worked above 40 regular hours in a workweek and is paid at 1.5× the base rate. Meal periods of 30 minutes are unpaid; 10-minute breaks are paid. Salaried (exempt) employees do not clock in but track PTO and sick leave.',
      },
      {
        heading: 'Standards of conduct',
        body: 'We expect professional, respectful conduct at all times. Harassment, discrimination, violence, theft, intoxication on the job, and fraud are grounds for immediate termination. Minor issues are handled through a progressive-discipline process: verbal coaching → written warning → performance improvement plan → termination.',
      },
      {
        heading: 'Confidentiality & IP',
        body: 'All employees sign a confidentiality and IP assignment agreement at hire. Customer information, financial information, and internal plans are strictly confidential. Work product created on company time or using company resources is the property of 783 Partners.',
      },
      {
        heading: 'Where to find more',
        body: 'Specific policies — PTO, benefits, 401k, expenses, safety, parental leave, code of conduct — live in separate policy documents, all accessible through the HR chat. If something is unclear, ask the HR chat or your manager; we will never penalize you for asking a good-faith question.',
      },
    ],
    source: 'seed',
  },
  {
    id: 'pto_policy',
    title: 'PTO & Leave Policy',
    category: 'pto',
    version: 'FY26 · v1.3',
    updatedOn: '2026-01-01',
    summary: 'How PTO accrues, sick leave, holidays, bereavement, jury duty, and unpaid leave options.',
    sections: [
      {
        heading: 'PTO accrual',
        body: 'Full-time employees accrue PTO based on tenure band. 0–2 years: 1.25 days/month (15/year). 2–5 years: 1.5 days/month (18/year). 5+ years: 2.0 days/month (24/year). New hires begin accruing on their 91st day and receive a one-time front-load of 5 days on the 91st day. PTO does not roll over; a use-it-or-lose-it deadline of Dec 31 applies, with a reminder issued in early December.',
      },
      {
        heading: 'Requesting PTO',
        body: 'Submit PTO requests as far in advance as possible — 2 weeks minimum for blocks of 3+ days. Your manager has 5 business days to approve or deny. Denials must include a reason and an offered alternative window. Same-day requests for emergencies are supported — use sick leave or contact your manager directly.',
      },
      {
        heading: 'Sick leave',
        body: 'All employees receive 5 sick days per calendar year, granted up front on Jan 1 (or prorated at hire). Sick leave is for your own illness, a family member\'s illness, medical appointments, or mental-health days. We do not require a doctor\'s note for fewer than 3 consecutive days.',
      },
      {
        heading: 'Company holidays',
        body: 'We observe 10 paid holidays: New Year\'s Day, MLK Day, Presidents Day, Memorial Day, Juneteenth, Independence Day, Labor Day, Thanksgiving Day, Day after Thanksgiving, and Christmas Day. Holidays falling on weekends are observed on the nearest weekday.',
      },
      {
        heading: 'Bereavement & jury duty',
        body: 'Bereavement: up to 5 paid days for an immediate family member, 3 for extended family. Jury duty: full paid leave for the duration of service — submit your summons to your manager and payroll.',
      },
      {
        heading: 'Unpaid leave',
        body: 'Unpaid personal leave may be granted at the discretion of the company for up to 30 days. FMLA applies for qualifying events after 12 months of employment.',
      },
    ],
    source: 'seed',
  },
  {
    id: 'benefits_guide',
    title: 'Benefits Guide',
    category: 'benefits',
    version: 'FY26 plan year',
    updatedOn: '2025-11-01',
    summary: 'Medical, dental, vision, life, disability, FSA/HSA, and how open enrollment works.',
    sections: [
      {
        heading: 'Medical plans',
        body: 'We offer two medical plans for the FY26 plan year. Plan A — BlueCross PPO 2000: $2,000 deductible, $6,000 OOP max, 80/20 in-network coinsurance. Plan B — Aetna PPO 1000: $1,000 deductible, $4,500 OOP max, 90/10 in-network coinsurance, higher per-paycheck cost. Dependent coverage tiers: Employee Only / Employee + Spouse / Employee + Children / Family.',
      },
      {
        heading: 'Dental & vision',
        body: 'Dental: Delta Dental Standard (100/80/50 coverage, $1,500 annual max) or Delta Dental Premier (100/90/60, $2,000 annual max). Vision: VSP Choice or VSP Signature — both include one eye exam per year and an allowance for glasses or contacts.',
      },
      {
        heading: 'Life & disability',
        body: 'Basic life insurance is company-paid at 1× annual salary, up to $250,000. Employees can buy supplemental life for self and spouse/children. Short-term disability covers up to 60% of base pay for up to 26 weeks; long-term disability kicks in after 180 days at 60% of base pay, capped at $10,000/month. Name a beneficiary during open enrollment — we cannot pay out without a current beneficiary on file.',
      },
      {
        heading: 'FSA & HSA',
        body: 'FSA (Flexible Spending Account): pre-tax dollars for qualified medical expenses. 2026 max: $3,300. Use-it-or-lose-it — unused balances forfeit Dec 31 (a 2.5 month grace period is NOT in effect for FY26). HSA (Health Savings Account): only available with a high-deductible plan, which we do not offer in FY26.',
      },
      {
        heading: 'Open enrollment',
        body: 'Annual open enrollment window: Nov 1 – Nov 15 for coverage effective Jan 1. New hires have a 14-day new-hire enrollment window from start date. Mid-year changes are only allowed after a qualifying life event (marriage, divorce, birth/adoption, loss of other coverage) — you have 30 days to submit documentation.',
      },
      {
        heading: 'Adding dependents',
        body: 'Dependents you can add: legal spouse or domestic partner, biological/adopted/step children under 26. Documentation required: marriage certificate, birth certificate, or adoption paperwork. Submit during enrollment or within 30 days of a qualifying life event.',
      },
    ],
    source: 'seed',
  },
  {
    id: '401k_spd',
    title: '401(k) Summary Plan Description',
    category: 'retirement',
    version: 'Plan year 2026',
    updatedOn: '2026-01-01',
    summary: 'Contributions, employer match, vesting, rollovers, hardship withdrawals, and Roth option.',
    sections: [
      {
        heading: 'Eligibility',
        body: 'All employees age 21+ are eligible to contribute starting on their 31st day of employment. Employer match begins on the 91st day.',
      },
      {
        heading: 'Contribution limits',
        body: '2026 IRS limit: $23,500 employee pre-tax + Roth combined. Catch-up contribution for employees age 50+: additional $7,500. Contribution percent is set in 1% increments from 1% to 100% of eligible pay.',
      },
      {
        heading: 'Employer match',
        body: 'The company matches 100% of the first 3% of contributions, plus 50% of the next 2%. Maximum employer match = 4% of eligible pay. To capture the full match you must contribute at least 5%. Match is deposited each pay period — we do not do a year-end true-up for employees who hit the IRS limit early.',
      },
      {
        heading: 'Vesting',
        body: 'Employee contributions are always 100% vested. Employer match vests on a 3-year graded schedule: 33% after year 1, 66% after year 2, 100% after year 3. Service credit is based on elapsed time from hire date, not hours worked.',
      },
      {
        heading: 'Roth 401(k)',
        body: 'Employees may elect Roth contributions (after-tax) in any percentage. Employer match is always deposited as pre-tax regardless of your election.',
      },
      {
        heading: 'Loans & hardship withdrawals',
        body: 'Loans are permitted up to 50% of your vested balance or $50,000, whichever is lower. Repayment via payroll deduction over up to 5 years (15 years for a primary residence). Hardship withdrawals are permitted only for specific hardships per IRS rules — medical, funeral, eviction, tuition, primary-residence purchase.',
      },
      {
        heading: 'Rollovers',
        body: 'You may roll a prior-employer 401k, 403b, or traditional IRA into the plan. Contact Fidelity NetBenefits to initiate — typically 7-14 business days.',
      },
    ],
    source: 'seed',
  },
  {
    id: 'expense_policy',
    title: 'Expense & Reimbursement Policy',
    category: 'expenses',
    version: 'FY26 · v2.0',
    updatedOn: '2026-01-01',
    summary: 'Mileage, tool allowance, travel, meals, per-diem, corporate card rules, and how to submit a report.',
    sections: [
      {
        heading: 'Reimbursable expenses',
        body: 'Mileage for work-related driving (not commute) at the current IRS standard rate ($0.67/mile for 2026). Business travel: economy airfare, standard hotel rate (up to $250/night in most cities, $350 in NY/SF), rental car (mid-size or below). Meals while traveling: per-diem of $65/day or actuals with receipts. Client entertainment requires pre-approval if over $100/person.',
      },
      {
        heading: 'Tool & boot allowance (field roles only)',
        body: 'Field technicians and shop staff receive an annual $150 tool + boot allowance. Submit receipts through the expense tool. Unused balance does not roll over. Eligible items: safety boots (one pair/year), hand tools, PPE not supplied by the company.',
      },
      {
        heading: 'Corporate card',
        body: 'Managers and roles with frequent travel are issued a corporate card. Monthly statement must be reconciled within 10 business days of close. Personal use is strictly prohibited.',
      },
      {
        heading: 'Submitting a report',
        body: 'Submit all expense reports through Concur. Attach a legible receipt for any expense over $25 (IRS requirement). Reports submitted by Wednesday are typically reimbursed in the next Friday payroll run. Reports over 90 days old cannot be reimbursed.',
      },
      {
        heading: 'What is NOT reimbursable',
        body: 'Commute to your regular work location, personal meals not while traveling, alcohol not part of a documented client entertainment expense, gym memberships, traffic/parking tickets, and any expense not tied to a documented business purpose.',
      },
    ],
    source: 'seed',
  },
  {
    id: 'safety_guide',
    title: 'Safety & OSHA Guide',
    category: 'safety',
    version: 'FY26 · v1.1',
    updatedOn: '2026-01-01',
    summary: 'Required PPE, incident reporting, OSHA certifications, driving policy, and drug & alcohol rules.',
    sections: [
      {
        heading: 'PPE',
        body: 'All site work requires: hard hat, safety glasses, high-visibility vest, steel-toe boots, cut-resistant gloves. Respiratory protection and hearing protection are task-specific. PPE is provided by the company; replacement is covered by the tool/boot allowance.',
      },
      {
        heading: 'Required certifications',
        body: 'Field technicians must hold: OSHA 30-Hour Construction (valid), forklift operator cert (if operating a forklift), fall-protection training (if working at height). Renewals are tracked centrally — we notify you 60, 30, and 7 days before expiry.',
      },
      {
        heading: 'Incident reporting',
        body: 'Any incident, injury, or near-miss must be reported to your supervisor within 4 hours and documented in the safety system within 24 hours. Serious incidents (hospitalization, fatality, amputation) are OSHA-reportable and require notification within 8 hours.',
      },
      {
        heading: 'Driving & DOT',
        body: 'Employees who drive on company business must have a valid driver\'s license and a clean driving record (no DUIs, no more than 2 moving violations in 3 years). MVR is pulled at hire and annually. CDL-required roles must maintain the medical card on file.',
      },
      {
        heading: 'Drug & alcohol',
        body: 'We are a drug-free workplace. Zero tolerance for alcohol or illegal substances on the job. Pre-employment drug screening, post-accident testing, and random testing for safety-sensitive roles. Testing positive is grounds for immediate termination.',
      },
    ],
    source: 'seed',
  },
  {
    id: 'code_of_conduct',
    title: 'Code of Conduct',
    category: 'code_of_conduct',
    version: 'FY26 · v1.0',
    updatedOn: '2026-01-01',
    summary: 'Ethics, conflicts of interest, anti-harassment, whistleblower, social media, and outside employment.',
    sections: [
      {
        heading: 'Anti-harassment & equal opportunity',
        body: 'We are an equal-opportunity employer. Harassment, discrimination, or retaliation based on race, color, religion, sex, gender identity, sexual orientation, national origin, age, disability, veteran status, or any other protected category is prohibited. Report concerns to your manager, HR, or our anonymous ethics hotline (1-800-555-0100, also accessible via ethics.783capital.com).',
      },
      {
        heading: 'Conflicts of interest',
        body: 'Disclose any outside relationship or financial interest that could conflict with your work. Examples: owning a stake in a supplier, a family member working at a competitor, accepting gifts over $100 from a vendor. Disclosure form is available through HR; a conflict does not automatically mean you cannot do the work — we just need to know.',
      },
      {
        heading: 'Outside employment',
        body: 'Outside employment is permitted as long as it does not compete with 783 Partners, does not use company resources, and does not impair job performance. Disclose it via the outside-employment form if it is regular (more than occasional).',
      },
      {
        heading: 'Whistleblower protection',
        body: 'No one will be retaliated against for reporting a good-faith concern about illegal activity, fraud, safety, or harassment. Retaliation is itself a violation and will be investigated.',
      },
      {
        heading: 'Social media',
        body: 'Personal social media is your own. You are free to identify as a 783 Partners employee. Do not share confidential information, speak on behalf of the company without authorization, or harass colleagues. Common sense.',
      },
    ],
    source: 'seed',
  },
  {
    id: 'parental_leave',
    title: 'Parental Leave Policy',
    category: 'parental_leave',
    version: 'FY26 · v1.2',
    updatedOn: '2026-01-01',
    summary: 'Paid parental leave, short-term disability for birth parents, adoption, and flexible return-to-work.',
    sections: [
      {
        heading: 'Paid parental leave',
        body: 'All full-time employees who have been with the company for 12+ months receive 12 weeks of paid parental leave at 100% of base pay. Leave must be taken within 12 months of birth or adoption placement. Both birth and non-birth parents are eligible (including adoptive and foster parents). Part-time employees receive a prorated benefit.',
      },
      {
        heading: 'Short-term disability (birth parents)',
        body: 'Birth parents may also elect short-term disability for the medical recovery portion (typically 6-8 weeks) at 60% of base pay. STD runs concurrent with, not in addition to, parental leave.',
      },
      {
        heading: 'FMLA',
        body: 'Eligible employees (12+ months, 1,250+ hours) receive up to 12 weeks of job-protected leave under FMLA, concurrent with paid parental leave.',
      },
      {
        heading: 'Flexible return-to-work',
        body: 'Returning parents may request a flexible return — part-time schedule, remote-first, or phased return over 4 weeks — subject to manager approval. We encourage it.',
      },
      {
        heading: 'Lactation support',
        body: 'Private, non-bathroom lactation rooms are available at all office locations. Nursing parents receive reasonable break time to pump for up to 12 months after birth.',
      },
    ],
    source: 'seed',
  },
  {
    id: 'payroll_setup',
    title: 'Payroll & Direct Deposit Setup',
    category: 'payroll',
    version: 'FY26 · v1.0',
    updatedOn: '2026-01-01',
    summary: 'Pay schedule, direct deposit, W-4 updates, and how to read your paystub.',
    sections: [
      {
        heading: 'Pay schedule',
        body: 'We pay biweekly (every other Friday), 26 pay periods per year. Pay period ends on a Sunday; paychecks deposit the following Friday. New hires: first paycheck covers the partial pay period from start date through the nearest period end. For a list of pay dates, see payroll@783capital.com or the HR chat.',
      },
      {
        heading: 'Direct deposit',
        body: 'Direct deposit is strongly preferred. Without direct deposit on file, your paycheck is issued as a paper check delivered to your primary work location. Changes take effect the next pay run if submitted by Friday before the run. You may split across up to 3 accounts (e.g., 80% to checking, 20% to savings).',
      },
      {
        heading: 'W-4 updates',
        body: 'Update your W-4 any time via your banking profile. Common reasons: marriage, birth of a child, moving to a new state, wanting more or less withheld. Consult a tax professional if unsure.',
      },
      {
        heading: 'Reading your paystub',
        body: 'Paystub shows: gross pay, pre-tax deductions (health, 401k, FSA), taxes (federal, state if applicable, FICA/Social Security, Medicare), post-tax deductions, net pay. YTD columns show cumulative amounts for the calendar year.',
      },
    ],
    source: 'seed',
  },
  {
    id: 'performance_policy',
    title: 'Performance, Goals & Review Cycle',
    category: 'training',
    version: 'FY26 · v2.0',
    updatedOn: '2026-01-01',
    summary: 'How reviews work, goal-setting cadence, 1:1 expectations, and ratings.',
    sections: [
      {
        heading: 'Review cadence',
        body: 'We run two formal review cycles per fiscal year: a Mid-Year check-in (May) and an Annual review (November-December). New hires have an onboarding check-in at 90 days (instead of a mid-year). Salaried roles also participate in quarterly goal updates.',
      },
      {
        heading: 'Goals',
        body: 'Every employee sets 3-5 annual goals and reviews them each quarter. Goals should be SMART (specific, measurable, achievable, relevant, time-bound) and tied to either role deliverables, growth, or team impact. Managers assign 1-2 of the goals; the employee proposes the rest and the manager approves.',
      },
      {
        heading: '1:1 expectations',
        body: 'Every employee has at least biweekly 1:1s with their manager (weekly is preferred for direct reports of individual contributors). Notes are logged in the HR system by the employee and reviewed by the manager — this record becomes part of the review narrative.',
      },
      {
        heading: 'Ratings',
        body: 'We use a 5-point scale: Does not meet / Partially meets / Meets / Exceeds / Strongly exceeds. Ratings are calibrated across teams to prevent grade inflation. Ratings are tied to merit + bonus decisions but are not the only input — role criticality and market comp also factor in.',
      },
      {
        heading: 'Self-review',
        body: 'Each cycle, employees write a self-review before the manager writes theirs. The self-review should reflect on each goal, cite specific examples, and flag obstacles. The manager\'s review builds on (not replaces) the self-review.',
      },
    ],
    source: 'seed',
  },
];

/* ─────────────────────── Persistence (admin uploads) ────────────────────── */

const STORAGE_KEY = 'hr-uploaded-documents';

function loadUploaded(): PolicyDocument[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((d: PolicyDocument) => ({ ...d, source: 'uploaded' as const }));
  } catch {
    return [];
  }
}

function saveUploaded(docs: PolicyDocument[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
  } catch {
    // ignore quota / privacy-mode errors
  }
}

export function useDocumentLibrary() {
  const [uploaded, setUploaded] = useState<PolicyDocument[]>([]);

  useEffect(() => {
    setUploaded(loadUploaded());
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) setUploaded(loadUploaded());
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const add = useCallback((doc: Omit<PolicyDocument, 'source'>) => {
    setUploaded((prev) => {
      const next = [...prev.filter((d) => d.id !== doc.id), { ...doc, source: 'uploaded' as const }];
      saveUploaded(next);
      return next;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setUploaded((prev) => {
      const next = prev.filter((d) => d.id !== id);
      saveUploaded(next);
      return next;
    });
  }, []);

  const all: PolicyDocument[] = [...SEED_DOCUMENTS, ...uploaded];

  return { all, uploaded, add, remove };
}

/* ─────────────────────────── Retrieval helpers ──────────────────────────── */

export interface DocHit {
  doc: PolicyDocument;
  section: { heading: string; body: string };
  score: number;
}

const STOP_WORDS = new Set([
  'the','a','an','and','or','of','to','in','on','for','is','are','was','were','be','been','being',
  'what','whats',"what's",'do','does','did','i','me','my','you','your','we','our','us','they','their','them',
  'how','when','where','who','why','which','can','could','should','would','will','shall','may','might','must',
  'this','that','these','those','it','its',"it's",'there','here','some','any','all','no','not','yes','as','by',
  'from','with','about','into','at','out','up','down','off','over','under',
]);

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOP_WORDS.has(t));
}

/** Score each section of each doc against the query. Returns top N hits. */
export function searchDocuments(query: string, docs: PolicyDocument[], topN = 3): DocHit[] {
  const qTokens = tokenize(query);
  if (qTokens.length === 0) return [];

  const hits: DocHit[] = [];
  for (const doc of docs) {
    for (const section of doc.sections) {
      const haystack = (doc.title + ' ' + section.heading + ' ' + section.body).toLowerCase();
      let score = 0;
      for (const t of qTokens) {
        // word-boundary matches score higher than substring
        const re = new RegExp(`\\b${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
        const m = haystack.match(re);
        if (m) score += m.length * 2;
        else if (haystack.includes(t)) score += 1;
      }
      if (score > 0) hits.push({ doc, section, score });
    }
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, topN);
}

/** A short quote (~first 240 chars of body) you can embed in a chat reply. */
export function quoteFrom(section: { heading: string; body: string }, max = 260): string {
  if (section.body.length <= max) return section.body;
  const cut = section.body.slice(0, max);
  const lastPeriod = cut.lastIndexOf('.');
  return (lastPeriod > 100 ? cut.slice(0, lastPeriod + 1) : cut) + '…';
}
