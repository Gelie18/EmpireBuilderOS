/**
 * HR OS demo personas.
 *
 * Each persona mirrors what a live HRMS / payroll / benefits / 401k / perf
 * integration would return. No real APIs are called; personas drive every
 * rendered number in the demo.
 */

export type PersonaId = 'new_hire' | 'field_tech' | 'senior_pm';

export interface PersonaSnapshot {
  hoursThisWeek: number;
  hoursThisWeekTarget: number;
  ptoRemainingDays: number;
  nextPayday: string;
  nextPaydayNet: number | null;
  retirementBalance: number | null;
  timesheetStatus: 'approved' | 'pending' | 'missing' | 'not_applicable';
  openAlerts: number;
}

export interface ProactiveAlert {
  id: string;
  severity: 'info' | 'warning' | 'success';
  title: string;
  body: string;
  cta?: { label: string; href?: string };
}

export interface PayStub {
  date: string;          // YYYY-MM-DD, the pay date
  period: string;        // "Apr 13 – Apr 26"
  gross: number;
  net: number;
  taxes: number;
  benefits: number;
  retirement: number;
  otHours?: number;
}

export interface CompHistoryEntry {
  effective: string;     // YYYY-MM-DD
  basis: 'hourly' | 'salary';
  rate: number;
  reason: string;        // e.g. "Hire", "Annual merit", "Promotion"
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  owner: string;         // person's name
  period: string;        // "FY 2026", "Q2 2026"
  progress: number;      // 0-100
  status: 'on_track' | 'at_risk' | 'off_track' | 'complete';
  dueDate: string;
  lastUpdate: string;
  assignedBy?: string;
}

export interface ReviewCycle {
  cycle: string;             // "FY25 Annual", "Q1 2026 Check-in"
  phase: 'not_started' | 'self_review' | 'manager_review' | 'calibration' | 'complete';
  selfReviewDue: string | null;
  managerReviewDue: string | null;
  lastRating: string | null; // e.g. "Exceeds expectations"
  lastRatingCycle: string | null;
  feedback360Summary?: string;
  oneOnOnes: { date: string; topic: string; notes: string }[];
}

export interface CareerProfile {
  trajectory: string;        // "Entry → Senior IC → Team Lead"
  nextRole: string;
  nextRoleReadiness: number; // 0-100
  mentor: string | null;
  skills: { name: string; level: 'learning' | 'proficient' | 'expert'; }[];
  mobilityInterests: string[];
  learningInProgress: { course: string; provider: string; progress: number }[];
}

export interface DocumentRef {
  label: string;
  category: 'employment' | 'payroll' | 'benefits' | 'compliance' | 'perf';
  signedOn: string | null;
  url?: string;
}

export interface Persona {
  id: PersonaId;
  profile: {
    firstName: string;
    lastName: string;
    preferredName?: string;
    employeeId: string;
    title: string;
    department: string;
    manager: string;
    type: 'full_time' | 'part_time' | 'contractor';
    status: 'active' | 'on_leave' | 'probationary';
    startDate: string;
    seniorityYears: number;
    location: string;
    shift: string;
    email: string;
    phone: string;
    address: string;
    photoInitials: string;
    emergencyContact: { name: string; relationship: string; phone: string };
    compensation: {
      basis: 'hourly' | 'salary';
      rate: number;
      payGrade: string;
      bonusTargetPct?: number;
      stipends?: { label: string; annual: number }[];
    };
    compHistory: CompHistoryEntry[];
    taxSetup: { filingStatus: string; allowances: number; additionalWithholding: number; w4OnFile: boolean };
    directReports?: string[];
  };
  snapshot: PersonaSnapshot;
  pay: {
    periodStart: string;
    periodEnd: string;
    periodGross: number;
    periodNet: number | null;
    ytdGross: number;
    ytdTaxes: number;
    ytdOvertimePay: number;
    overtimeHoursYtd: number;
    directDepositLast4: string | null;
    deductionsThisCheck: { label: string; amount: number }[];
    recentStubs: PayStub[];
  };
  time: {
    weekStart: string;
    clockedToday: string;
    hoursToday: number;
    hoursThisWeek: number;
    overtimeThisWeek: number;
    timesheetStatus: PersonaSnapshot['timesheetStatus'];
    missedPunches: string[];
    scheduledUpcoming: { day: string; shift: string }[];
  };
  timeOff: {
    ptoRemainingDays: number;
    ptoAccrualRate: string;
    nextAccrualDate: string;
    ptoUsedYtd: number;
    sickRemainingDays: number;
    holidaysRemaining: number;
    approved: { label: string; dates: string }[];
    pending: { label: string; dates: string; status: string }[];
  };
  benefits: {
    health: { plan: string; tier: string; perCheck: number; deductible: number; usedDeductible: number } | null;
    dental: { plan: string; perCheck: number } | null;
    vision: { plan: string; perCheck: number } | null;
    life: { enrolled: boolean; coverage: number; beneficiaryOnFile: boolean };
    fsa: { enrolled: boolean; balance: number; expiresOn: string } | null;
    dependents: { name: string; relationship: string; onPlan: boolean }[];
    openEnrollment: { status: 'open' | 'closed' | 'upcoming'; dates: string; actionsTaken: number; actionsRequired: number };
    effectiveDate: string | null;
  };
  retirement: {
    enrolled: boolean;
    contributionPct: number | null;
    contributionPerCheck: number | null;
    ytdEmployeeContrib: number;
    employerMatch: string;
    fullMatchAt: number;
    ytdEmployerMatch: number;
    leavingMatchOnTable: number;
    balance: number | null;
    vestedPct: number | null;
    projectedAt65: number | null;
    beneficiaries: { name: string; relationship: string; sharePct: number }[];
    pension: { enrolled: boolean; yearsOfService: number; projectedMonthly: number } | null;
    catchUpEligible: boolean;
    canDoRoth: boolean;
  };
  expenses: {
    toolAllowance: { limit: number; usedYtd: number } | null;
    mileageYtd: number;
    mileageRate: number;
    pendingReports: { label: string; amount: number; status: string }[];
    ytdReimbursements: number;
    cardBalance: number | null;
  };
  certifications: {
    label: string;
    issued: string;
    expires: string;
    daysToExpiry: number;
    status: 'valid' | 'expiring_soon' | 'expired';
  }[];
  training: { course: string; required: boolean; dueBy: string | null; status: 'complete' | 'in_progress' | 'not_started' }[];
  performance: ReviewCycle;
  goals: Goal[];
  career: CareerProfile;
  documents: DocumentRef[];
  onboarding: {
    percentComplete: number;
    outstandingItems: string[];
  } | null;
  alerts: ProactiveAlert[];
}

/* ─────────────────────── Persona 1 — New Hire, Week 2 ─────────────────────── */

const JORDAN: Persona = {
  id: 'new_hire',
  profile: {
    firstName: 'Jordan',
    lastName: 'Rivera',
    preferredName: 'Jordan',
    employeeId: 'EMP-4812',
    title: 'Junior Project Coordinator',
    department: 'Operations',
    manager: 'Priya Natarajan',
    type: 'full_time',
    status: 'probationary',
    startDate: '2026-04-11',
    seniorityYears: 0,
    location: 'Dallas, TX',
    shift: 'M–F · 8:00 AM – 5:00 PM',
    email: 'jordan.rivera@783capital.com',
    phone: '(214) 555-0142',
    address: '4418 Oak Lawn Ave, Apt 3B, Dallas, TX 75219',
    photoInitials: 'JR',
    emergencyContact: { name: 'Marisol Rivera', relationship: 'Mother', phone: '(817) 555-0188' },
    compensation: { basis: 'salary', rate: 58000, payGrade: 'P2', bonusTargetPct: 5 },
    compHistory: [
      { effective: '2026-04-11', basis: 'salary', rate: 58000, reason: 'Hire' },
    ],
    taxSetup: { filingStatus: 'Single', allowances: 0, additionalWithholding: 0, w4OnFile: true },
  },
  snapshot: {
    hoursThisWeek: 34,
    hoursThisWeekTarget: 40,
    ptoRemainingDays: 0,
    nextPayday: 'May 2',
    nextPaydayNet: null,
    retirementBalance: null,
    timesheetStatus: 'pending',
    openAlerts: 3,
  },
  pay: {
    periodStart: '2026-04-13',
    periodEnd: '2026-04-26',
    periodGross: 2230.77,
    periodNet: null,
    ytdGross: 1115.38,
    ytdTaxes: 198.12,
    ytdOvertimePay: 0,
    overtimeHoursYtd: 0,
    directDepositLast4: null,
    deductionsThisCheck: [],
    recentStubs: [],
  },
  time: {
    weekStart: '2026-04-20',
    clockedToday: '08:02 AM',
    hoursToday: 6.8,
    hoursThisWeek: 34,
    overtimeThisWeek: 0,
    timesheetStatus: 'pending',
    missedPunches: [],
    scheduledUpcoming: [
      { day: 'Wed Apr 22', shift: '8:00a – 5:00p' },
      { day: 'Thu Apr 23', shift: '8:00a – 5:00p' },
      { day: 'Fri Apr 24', shift: '8:00a – 5:00p' },
    ],
  },
  timeOff: {
    ptoRemainingDays: 0,
    ptoAccrualRate: '1.25 days/month after 90-day probation',
    nextAccrualDate: '2026-07-11',
    ptoUsedYtd: 0,
    sickRemainingDays: 3,
    holidaysRemaining: 7,
    approved: [],
    pending: [],
  },
  benefits: {
    health: null,
    dental: null,
    vision: null,
    life: { enrolled: false, coverage: 0, beneficiaryOnFile: false },
    fsa: null,
    dependents: [],
    openEnrollment: { status: 'open', dates: 'Apr 11 – Apr 25', actionsTaken: 0, actionsRequired: 4 },
    effectiveDate: null,
  },
  retirement: {
    enrolled: false,
    contributionPct: null,
    contributionPerCheck: null,
    ytdEmployeeContrib: 0,
    employerMatch: '100% of first 3%, 50% of next 2%',
    fullMatchAt: 5,
    ytdEmployerMatch: 0,
    leavingMatchOnTable: 2900,
    balance: null,
    vestedPct: null,
    projectedAt65: null,
    beneficiaries: [],
    pension: null,
    catchUpEligible: false,
    canDoRoth: true,
  },
  expenses: {
    toolAllowance: null,
    mileageYtd: 0,
    mileageRate: 0.67,
    pendingReports: [],
    ytdReimbursements: 0,
    cardBalance: null,
  },
  certifications: [],
  training: [
    { course: 'Employee Handbook Acknowledgement', required: true, dueBy: '2026-04-25', status: 'not_started' },
    { course: 'Safety Orientation (online, 30 min)', required: true, dueBy: '2026-04-30', status: 'not_started' },
    { course: 'Anti-Harassment & Respect at Work', required: true, dueBy: '2026-05-11', status: 'in_progress' },
    { course: 'Data Security Basics', required: true, dueBy: '2026-05-11', status: 'not_started' },
  ],
  performance: {
    cycle: 'FY26 Onboarding Check-in',
    phase: 'not_started',
    selfReviewDue: '2026-07-11',
    managerReviewDue: '2026-07-25',
    lastRating: null,
    lastRatingCycle: null,
    oneOnOnes: [
      { date: '2026-04-14', topic: 'Week 1 kickoff', notes: 'Onboarding on track. Shadow Priya on project intake for two weeks. Pair with Amelia on the Briggs program as reading.' },
      { date: '2026-04-21', topic: 'Week 2 check-in', notes: 'Still waiting on benefits enrollment and direct deposit. Jordan flagged interest in the PMP track.' },
    ],
  },
  goals: [
    {
      id: 'g-jr-1',
      title: 'Complete onboarding runway by May 11',
      description: 'Finish all required trainings, tooling, and handbook sign-offs. Be ready to run a small project intake end-to-end.',
      owner: 'Jordan Rivera',
      period: 'Q2 2026',
      progress: 40,
      status: 'on_track',
      dueDate: '2026-05-11',
      lastUpdate: '2026-04-21',
      assignedBy: 'Priya Natarajan',
    },
    {
      id: 'g-jr-2',
      title: 'Shadow 3 project kickoffs',
      description: 'Sit in on at least three active project kickoffs across Ops. Capture a one-page takeaway from each.',
      owner: 'Jordan Rivera',
      period: 'Q2 2026',
      progress: 10,
      status: 'on_track',
      dueDate: '2026-06-30',
      lastUpdate: '2026-04-18',
      assignedBy: 'Priya Natarajan',
    },
    {
      id: 'g-jr-3',
      title: 'Own intake for one small project by end of probation',
      description: 'Run a discovery → kickoff → first status report on a small internal project solo, with Priya sponsoring.',
      owner: 'Jordan Rivera',
      period: 'Q3 2026',
      progress: 0,
      status: 'on_track',
      dueDate: '2026-07-11',
      lastUpdate: '2026-04-11',
      assignedBy: 'Priya Natarajan',
    },
  ],
  career: {
    trajectory: 'Junior Coordinator → Project Coordinator → Project Manager',
    nextRole: 'Project Coordinator (P3)',
    nextRoleReadiness: 20,
    mentor: null,
    skills: [
      { name: 'Stakeholder comms', level: 'learning' },
      { name: 'Smartsheet / PM tooling', level: 'learning' },
      { name: 'Risk logs & RAID', level: 'learning' },
      { name: 'Excel modeling', level: 'proficient' },
    ],
    mobilityInterests: ['Program Management Office', 'Construction Ops'],
    learningInProgress: [
      { course: 'Project Management Fundamentals', provider: 'Coursera', progress: 15 },
    ],
  },
  documents: [
    { label: 'Offer letter', category: 'employment', signedOn: '2026-03-22' },
    { label: 'I-9 Employment Eligibility', category: 'compliance', signedOn: '2026-04-11' },
    { label: 'W-4 Federal Tax Withholding', category: 'payroll', signedOn: '2026-04-11' },
    { label: 'Handbook Acknowledgement', category: 'compliance', signedOn: null },
    { label: 'Direct Deposit Authorization', category: 'payroll', signedOn: null },
    { label: 'Benefits Elections', category: 'benefits', signedOn: null },
  ],
  onboarding: {
    percentComplete: 40,
    outstandingItems: [
      'Enroll in health, dental, and vision benefits (closes Apr 25)',
      'Set up direct deposit on your banking profile',
      'Sign the employee handbook acknowledgement',
      'Complete the online safety orientation (30 min)',
    ],
  },
  alerts: [
    {
      id: 'benefits_enrollment',
      severity: 'warning',
      title: 'Benefits enrollment closes in 4 days',
      body: "Your enrollment window ends Apr 25. You haven't selected a health, dental, or vision plan yet. If you miss the window, you'll wait until next year's open enrollment.",
      cta: { label: 'Start enrollment' },
    },
    {
      id: 'direct_deposit',
      severity: 'warning',
      title: 'Direct deposit not set up',
      body: "Your first paycheck arrives May 2. Without direct deposit on file, it will be issued as a paper check delivered to your work location.",
      cta: { label: 'Add account' },
    },
    {
      id: 'onboarding_progress',
      severity: 'info',
      title: 'Onboarding 40% complete',
      body: '3 of 7 items still outstanding. Most take under 5 minutes.',
      cta: { label: 'View onboarding checklist' },
    },
  ],
};

/* ─────────────────── Persona 2 — Mid-Career Fulfillment Specialist ──────────────────── */

const MARCUS: Persona = {
  id: 'field_tech',
  profile: {
    firstName: 'Marcus',
    lastName: 'Chen',
    preferredName: 'Marcus',
    employeeId: 'EMP-2247',
    title: 'Senior Fulfillment Specialist',
    department: 'Warehouse & Fulfillment',
    manager: 'Tomás Alvarez',
    type: 'full_time',
    status: 'active',
    startDate: '2024-04-21',
    seniorityYears: 2,
    location: 'Houston, TX',
    shift: 'M–F · 6:30 AM – 3:30 PM',
    email: 'marcus.chen@783capital.com',
    phone: '(713) 555-0209',
    address: '8821 Wilcrest Dr, Houston, TX 77031',
    photoInitials: 'MC',
    emergencyContact: { name: 'Lina Chen', relationship: 'Spouse', phone: '(713) 555-0210' },
    compensation: { basis: 'hourly', rate: 28.5, payGrade: 'T3', bonusTargetPct: 4, stipends: [{ label: 'Tool & boot allowance', annual: 150 }] },
    compHistory: [
      { effective: '2024-04-21', basis: 'hourly', rate: 24.0, reason: 'Hire' },
      { effective: '2024-10-14', basis: 'hourly', rate: 26.0, reason: '90-day + skills bump' },
      { effective: '2025-04-21', basis: 'hourly', rate: 27.5, reason: 'Annual merit' },
      { effective: '2026-02-03', basis: 'hourly', rate: 28.5, reason: 'Promotion — Senior Fulfillment Specialist' },
    ],
    taxSetup: { filingStatus: 'Married filing jointly', allowances: 2, additionalWithholding: 0, w4OnFile: true },
  },
  snapshot: {
    hoursThisWeek: 32.5,
    hoursThisWeekTarget: 40,
    ptoRemainingDays: 12,
    nextPayday: 'May 2',
    nextPaydayNet: 1847,
    retirementBalance: 14320,
    timesheetStatus: 'pending',
    openAlerts: 3,
  },
  pay: {
    periodStart: '2026-04-13',
    periodEnd: '2026-04-26',
    periodGross: 2394,
    periodNet: 1847,
    ytdGross: 22420,
    ytdTaxes: 4860,
    ytdOvertimePay: 1284,
    overtimeHoursYtd: 30,
    directDepositLast4: '4471',
    deductionsThisCheck: [
      { label: 'Federal tax', amount: 276 },
      { label: 'State tax (TX)', amount: 0 },
      { label: 'Social Security', amount: 148 },
      { label: 'Medicare', amount: 35 },
      { label: 'Health insurance (employee + spouse)', amount: 82 },
      { label: 'Dental', amount: 14 },
      { label: 'Vision', amount: 6 },
      { label: '401k (3%)', amount: 72 },
    ],
    recentStubs: [
      { date: '2026-04-18', period: 'Mar 30 – Apr 12', gross: 2284, net: 1762, taxes: 421, benefits: 102, retirement: 69 },
      { date: '2026-04-04', period: 'Mar 16 – Mar 29', gross: 2340, net: 1802, taxes: 440, benefits: 102, retirement: 70 },
      { date: '2026-03-21', period: 'Mar 2 – Mar 15', gross: 2470, net: 1894, taxes: 477, benefits: 102, retirement: 74 },
      { date: '2026-03-07', period: 'Feb 16 – Mar 1', gross: 2280, net: 1758, taxes: 418, benefits: 102, retirement: 68 },
    ],
  },
  time: {
    weekStart: '2026-04-20',
    clockedToday: '06:58 AM',
    hoursToday: 7.2,
    hoursThisWeek: 32.5,
    overtimeThisWeek: 3,
    timesheetStatus: 'pending',
    missedPunches: ['Tue Apr 21 — missed clock-out'],
    scheduledUpcoming: [
      { day: 'Wed Apr 22', shift: '6:30a – 3:30p' },
      { day: 'Thu Apr 23', shift: '6:30a – 5:30p (OT)' },
      { day: 'Fri Apr 24', shift: '6:30a – 3:30p' },
    ],
  },
  timeOff: {
    ptoRemainingDays: 12,
    ptoAccrualRate: '1.5 days/month',
    nextAccrualDate: '2026-05-01',
    ptoUsedYtd: 3,
    sickRemainingDays: 5,
    holidaysRemaining: 6,
    approved: [{ label: 'Summer vacation', dates: 'Jun 16 – Jun 20' }],
    pending: [],
  },
  benefits: {
    health: { plan: 'BlueCross PPO 2000', tier: 'Employee + Spouse', perCheck: 82, deductible: 2000, usedDeductible: 340 },
    dental: { plan: 'Delta Dental Standard', perCheck: 14 },
    vision: { plan: 'VSP Choice', perCheck: 6 },
    life: { enrolled: true, coverage: 75000, beneficiaryOnFile: true },
    fsa: null,
    dependents: [{ name: 'Lina Chen', relationship: 'Spouse', onPlan: true }],
    openEnrollment: { status: 'closed', dates: 'next window Nov 1 – Nov 15', actionsTaken: 0, actionsRequired: 0 },
    effectiveDate: '2024-05-01',
  },
  retirement: {
    enrolled: true,
    contributionPct: 3,
    contributionPerCheck: 72,
    ytdEmployeeContrib: 673,
    employerMatch: '100% of first 3%, 50% of next 2%',
    fullMatchAt: 5,
    ytdEmployerMatch: 673,
    leavingMatchOnTable: 1400,
    balance: 14320,
    vestedPct: 100,
    projectedAt65: 238000,
    beneficiaries: [{ name: 'Lina Chen', relationship: 'Spouse', sharePct: 100 }],
    pension: null,
    catchUpEligible: false,
    canDoRoth: true,
  },
  expenses: {
    toolAllowance: { limit: 150, usedYtd: 89 },
    mileageYtd: 1840,
    mileageRate: 0.67,
    pendingReports: [
      { label: 'Mileage · week of Apr 14', amount: 160.8, status: 'pending manager approval' },
    ],
    ytdReimbursements: 1232.8,
    cardBalance: null,
  },
  certifications: [
    { label: 'OSHA 30-Hour Construction', issued: '2022-06-07', expires: '2026-06-07', daysToExpiry: 47, status: 'expiring_soon' },
    { label: 'Forklift Operator', issued: '2024-02-12', expires: '2027-02-12', daysToExpiry: 662, status: 'valid' },
  ],
  training: [
    { course: 'OSHA 30 Refresher', required: true, dueBy: '2026-06-07', status: 'not_started' },
    { course: 'Anti-Harassment & Respect at Work (annual)', required: true, dueBy: '2026-05-31', status: 'in_progress' },
    { course: 'Defensive Driving', required: false, dueBy: null, status: 'complete' },
  ],
  performance: {
    cycle: 'FY26 Mid-Year',
    phase: 'self_review',
    selfReviewDue: '2026-05-09',
    managerReviewDue: '2026-05-23',
    lastRating: 'Exceeds expectations',
    lastRatingCycle: 'FY25 Annual',
    feedback360Summary: '4 of 5 peers describe Marcus as the go-to for hard installs and new-hire shadowing. Growth area called out: documenting punch lists so others can pick up mid-job.',
    oneOnOnes: [
      { date: '2026-04-14', topic: 'Weekly 1:1', notes: 'Team stretched thin on the Memorial project. Marcus volunteered to take Ayo under his wing for next two weeks. Flagged boots-wearing-out for allowance.' },
      { date: '2026-04-07', topic: 'Weekly 1:1', notes: 'Discussed promo path to Lead Specialist. Tomás said strongest gap is admin completeness (timesheets, punch-ins).' },
      { date: '2026-03-31', topic: 'Weekly 1:1', notes: 'OSHA refresher planning. Marcus asked about moving from Houston to DFW in 2027 — Tomás said possible with 6 mo notice.' },
    ],
  },
  goals: [
    {
      id: 'g-mc-1',
      title: 'Grow from Senior Fulfillment Specialist to Lead Specialist by end of FY26',
      description: 'Close admin-completeness gap (timesheets, punch-ins, pick lists) and train one junior fulfillment associate to independent status.',
      owner: 'Marcus Chen',
      period: 'FY 2026',
      progress: 50,
      status: 'on_track',
      dueDate: '2026-12-31',
      lastUpdate: '2026-04-14',
      assignedBy: 'Tomás Alvarez',
    },
    {
      id: 'g-mc-2',
      title: 'Zero missed punches in a rolling 60-day window',
      description: 'Hit zero missed clock-outs for 60 days straight. Currently at 1 missed punch this week.',
      owner: 'Marcus Chen',
      period: 'Q2 2026',
      progress: 25,
      status: 'at_risk',
      dueDate: '2026-06-30',
      lastUpdate: '2026-04-21',
      assignedBy: 'Tomás Alvarez',
    },
    {
      id: 'g-mc-3',
      title: 'OSHA 30 renewed before Jun 7',
      description: 'Complete the 3-hour refresher and upload new cert.',
      owner: 'Marcus Chen',
      period: 'Q2 2026',
      progress: 0,
      status: 'at_risk',
      dueDate: '2026-06-07',
      lastUpdate: '2026-04-07',
    },
    {
      id: 'g-mc-4',
      title: 'Train Ayo Adebayo to independent install status',
      description: 'Shadow-work with Ayo for 4 weeks; sign off on first solo install by end of May.',
      owner: 'Marcus Chen',
      period: 'Q2 2026',
      progress: 30,
      status: 'on_track',
      dueDate: '2026-05-31',
      lastUpdate: '2026-04-18',
      assignedBy: 'Tomás Alvarez',
    },
  ],
  career: {
    trajectory: 'Fulfillment Associate → Senior Fulfillment Specialist → Lead Specialist → Warehouse Supervisor',
    nextRole: 'Lead Fulfillment Specialist (T4)',
    nextRoleReadiness: 65,
    mentor: 'Tomás Alvarez',
    skills: [
      { name: 'Pick & pack operations', level: 'expert' },
      { name: 'Inventory accuracy & OSHA', level: 'expert' },
      { name: 'Forklift / lift equipment', level: 'proficient' },
      { name: 'Junior associate mentoring', level: 'proficient' },
      { name: 'Admin / documentation', level: 'learning' },
    ],
    mobilityInterests: ['DFW relocation (2027)', 'Warehouse Supervisor track'],
    learningInProgress: [
      { course: 'Lead Specialist Foundations (internal)', provider: '783 Partners Learning', progress: 45 },
    ],
  },
  documents: [
    { label: 'Offer letter', category: 'employment', signedOn: '2024-04-01' },
    { label: 'Promotion letter — Senior Fulfillment Specialist', category: 'employment', signedOn: '2026-02-03' },
    { label: 'I-9 Employment Eligibility', category: 'compliance', signedOn: '2024-04-21' },
    { label: 'W-4 Federal Tax Withholding', category: 'payroll', signedOn: '2024-04-21' },
    { label: 'Direct Deposit Authorization', category: 'payroll', signedOn: '2024-04-21' },
    { label: 'Handbook Acknowledgement (FY26)', category: 'compliance', signedOn: '2026-01-12' },
    { label: 'Benefits Elections (current plan year)', category: 'benefits', signedOn: '2025-11-09' },
    { label: 'Safety / OSHA Policy Acknowledgement', category: 'compliance', signedOn: '2024-04-21' },
    { label: 'FY25 Annual Review', category: 'perf', signedOn: '2025-12-05' },
  ],
  onboarding: null,
  alerts: [
    {
      id: 'match_on_table',
      severity: 'warning',
      title: 'You are leaving ~$1,400 / year in 401k match on the table',
      body: 'You contribute 3% of gross. The company matches 100% of the first 3% and 50% of the next 2%. Increasing to 5% would capture the full match and add roughly $1,400/year of employer money.',
      cta: { label: 'See the math' },
    },
    {
      id: 'osha_expiring',
      severity: 'warning',
      title: 'OSHA 30 certification expires in 47 days',
      body: 'Your OSHA 30-Hour Construction cert expires Jun 7, 2026. Renewal requires a 3-hour refresher — available online or at the Houston training center.',
      cta: { label: 'Renew certification' },
    },
    {
      id: 'missed_punch',
      severity: 'info',
      title: 'Missed clock-out on Tue Apr 21',
      body: 'Your shift scanned in at 6:55 AM but no clock-out was recorded. Submit a correction before Friday so the pay period closes cleanly.',
      cta: { label: 'Submit correction' },
    },
  ],
};

/* ──────────────────── Persona 3 — Senior PM, 8 Years In ───────────────────── */

const LEAH: Persona = {
  id: 'senior_pm',
  profile: {
    firstName: 'Leah',
    lastName: 'Thompson',
    preferredName: 'Leah',
    employeeId: 'EMP-0714',
    title: 'Senior Program Manager',
    department: 'Program Management Office',
    manager: 'Devin Okafor',
    type: 'full_time',
    status: 'active',
    startDate: '2018-04-02',
    seniorityYears: 8,
    location: 'Dallas, TX',
    shift: 'Salaried · flex',
    email: 'leah.thompson@783capital.com',
    phone: '(469) 555-0377',
    address: '2104 Rosewood Ln, Plano, TX 75093',
    photoInitials: 'LT',
    emergencyContact: { name: 'Mark Thompson', relationship: 'Spouse', phone: '(469) 555-0376' },
    compensation: { basis: 'salary', rate: 145000, payGrade: 'L5', bonusTargetPct: 15 },
    compHistory: [
      { effective: '2018-04-02', basis: 'salary', rate: 78000, reason: 'Hire — PM II' },
      { effective: '2020-04-01', basis: 'salary', rate: 94000, reason: 'Annual + promotion to Sr PM' },
      { effective: '2022-04-01', basis: 'salary', rate: 118000, reason: 'Promotion — Program Manager' },
      { effective: '2024-04-01', basis: 'salary', rate: 135000, reason: 'Promotion — Senior Program Manager' },
      { effective: '2026-04-01', basis: 'salary', rate: 145000, reason: 'Annual merit' },
    ],
    taxSetup: { filingStatus: 'Married filing jointly', allowances: 3, additionalWithholding: 125, w4OnFile: true },
    directReports: ['Amelia Park', 'Kenji Torres'],
  },
  snapshot: {
    hoursThisWeek: 38,
    hoursThisWeekTarget: 40,
    ptoRemainingDays: 22,
    nextPayday: 'May 2',
    nextPaydayNet: 4180,
    retirementBalance: 187650,
    timesheetStatus: 'not_applicable',
    openAlerts: 3,
  },
  pay: {
    periodStart: '2026-04-13',
    periodEnd: '2026-04-26',
    periodGross: 5576.92,
    periodNet: 4180,
    ytdGross: 50192,
    ytdTaxes: 12248,
    ytdOvertimePay: 0,
    overtimeHoursYtd: 0,
    directDepositLast4: '8893',
    deductionsThisCheck: [
      { label: 'Federal tax', amount: 960 },
      { label: 'State tax (TX)', amount: 0 },
      { label: 'Social Security', amount: 346 },
      { label: 'Medicare', amount: 81 },
      { label: 'Health insurance (family)', amount: 218 },
      { label: 'Dental', amount: 24 },
      { label: 'Vision', amount: 9 },
      { label: 'FSA', amount: 96 },
      { label: '401k (10%)', amount: 557 },
    ],
    recentStubs: [
      { date: '2026-04-18', period: 'Mar 30 – Apr 12', gross: 5576.92, net: 4180, taxes: 1387, benefits: 347, retirement: 557 },
      { date: '2026-04-04', period: 'Mar 16 – Mar 29', gross: 5192.31, net: 3891, taxes: 1291, benefits: 347, retirement: 519 },
      { date: '2026-03-21', period: 'Mar 2 – Mar 15', gross: 5192.31, net: 3891, taxes: 1291, benefits: 347, retirement: 519 },
      { date: '2026-03-07', period: 'Feb 16 – Mar 1', gross: 5192.31, net: 3891, taxes: 1291, benefits: 347, retirement: 519 },
    ],
  },
  time: {
    weekStart: '2026-04-20',
    clockedToday: 'Not applicable (salaried)',
    hoursToday: 0,
    hoursThisWeek: 38,
    overtimeThisWeek: 0,
    timesheetStatus: 'not_applicable',
    missedPunches: [],
    scheduledUpcoming: [],
  },
  timeOff: {
    ptoRemainingDays: 22,
    ptoAccrualRate: '2.0 days/month',
    nextAccrualDate: '2026-05-01',
    ptoUsedYtd: 2,
    sickRemainingDays: 5,
    holidaysRemaining: 6,
    approved: [{ label: 'Family vacation', dates: 'Jul 6 – Jul 17' }],
    pending: [{ label: 'Long weekend', dates: 'May 22 – May 25', status: 'pending manager approval' }],
  },
  benefits: {
    health: { plan: 'Aetna PPO 1000', tier: 'Family', perCheck: 218, deductible: 1000, usedDeductible: 820 },
    dental: { plan: 'Delta Dental Premier', perCheck: 24 },
    vision: { plan: 'VSP Signature', perCheck: 9 },
    life: { enrolled: true, coverage: 290000, beneficiaryOnFile: true },
    fsa: { enrolled: true, balance: 340, expiresOn: '2026-12-31' },
    dependents: [
      { name: 'Mark Thompson', relationship: 'Spouse', onPlan: true },
      { name: 'Oliver Thompson', relationship: 'Child (age 9)', onPlan: true },
      { name: 'Naia Thompson', relationship: 'Child (age 6)', onPlan: true },
    ],
    openEnrollment: { status: 'closed', dates: 'next window Nov 1 – Nov 15', actionsTaken: 0, actionsRequired: 0 },
    effectiveDate: '2018-05-01',
  },
  retirement: {
    enrolled: true,
    contributionPct: 10,
    contributionPerCheck: 557,
    ytdEmployeeContrib: 5016,
    employerMatch: '100% of first 3%, 50% of next 2%',
    fullMatchAt: 5,
    ytdEmployerMatch: 1505,
    leavingMatchOnTable: 0,
    balance: 187650,
    vestedPct: 100,
    projectedAt65: 1260000,
    beneficiaries: [
      { name: 'Mark Thompson', relationship: 'Spouse', sharePct: 50 },
      { name: 'Oliver Thompson', relationship: 'Child', sharePct: 25 },
      { name: 'Naia Thompson', relationship: 'Child', sharePct: 25 },
    ],
    pension: { enrolled: true, yearsOfService: 8, projectedMonthly: 2840 },
    catchUpEligible: false,
    canDoRoth: true,
  },
  expenses: {
    toolAllowance: null,
    mileageYtd: 620,
    mileageRate: 0.67,
    pendingReports: [
      { label: 'Client dinner · Mar 28', amount: 142.5, status: 'approved — paying May 2' },
    ],
    ytdReimbursements: 946,
    cardBalance: 1280,
  },
  certifications: [
    { label: 'PMP', issued: '2021-09-01', expires: '2027-09-01', daysToExpiry: 498, status: 'valid' },
  ],
  training: [
    { course: 'Anti-Harassment & Respect at Work (annual)', required: true, dueBy: '2026-05-31', status: 'complete' },
    { course: 'Manager Essentials — Q2 module', required: true, dueBy: '2026-06-30', status: 'in_progress' },
    { course: 'Data Security Refresher', required: true, dueBy: '2026-05-15', status: 'not_started' },
  ],
  performance: {
    cycle: 'FY26 Mid-Year',
    phase: 'self_review',
    selfReviewDue: '2026-05-09',
    managerReviewDue: '2026-05-23',
    lastRating: 'Strongly exceeds expectations',
    lastRatingCycle: 'FY25 Annual',
    feedback360Summary: 'Peer + direct-report feedback: exceptionally calm under client pressure, strong crisis operator. Stretch area: creating more space for directs to own client comms (currently Leah fronts most tough conversations).',
    oneOnOnes: [
      { date: '2026-04-15', topic: 'Bi-weekly 1:1', notes: 'Devin asked Leah to scope a Program Director path conversation for Q3. Two directs getting stretch assignments to free Leah up.' },
      { date: '2026-04-01', topic: 'Bi-weekly 1:1', notes: 'Memorial program is green. Amelia ready for next-level stretch. Kenji needs more coaching on escalation.' },
      { date: '2026-03-18', topic: 'Bi-weekly 1:1', notes: '8-year anniversary acknowledgment. Discussed pension milestone. Compensation review scheduled Apr 1.' },
    ],
  },
  goals: [
    {
      id: 'g-lt-1',
      title: 'Deliver Memorial Program on time, <5% variance',
      description: 'Close Memorial program on schedule. Keep margin within 5% of plan. Weekly green-status to the steering committee.',
      owner: 'Leah Thompson',
      period: 'FY 2026',
      progress: 70,
      status: 'on_track',
      dueDate: '2026-11-30',
      lastUpdate: '2026-04-15',
      assignedBy: 'Devin Okafor',
    },
    {
      id: 'g-lt-2',
      title: 'Grow Amelia and Kenji toward next-role readiness',
      description: 'Formal readiness rubric at 80+ for each by end of FY. Stretch assignments, monthly readiness check-in with Devin.',
      owner: 'Leah Thompson',
      period: 'FY 2026',
      progress: 55,
      status: 'on_track',
      dueDate: '2026-12-31',
      lastUpdate: '2026-04-15',
      assignedBy: 'Devin Okafor',
    },
    {
      id: 'g-lt-3',
      title: 'Stand up the PMO playbook v2',
      description: 'Refresh the PMO playbook with lessons from the Memorial + Briggs programs. Share out by end of Q3.',
      owner: 'Leah Thompson',
      period: 'Q3 2026',
      progress: 20,
      status: 'on_track',
      dueDate: '2026-09-30',
      lastUpdate: '2026-04-10',
      assignedBy: 'Devin Okafor',
    },
    {
      id: 'g-lt-4',
      title: 'Scope Program Director readiness (self)',
      description: 'Work with Devin on a 12-month readiness plan for the Program Director track. Draft a gap analysis and target role rubric.',
      owner: 'Leah Thompson',
      period: 'Q3 2026',
      progress: 10,
      status: 'on_track',
      dueDate: '2026-09-30',
      lastUpdate: '2026-04-15',
    },
  ],
  career: {
    trajectory: 'PM II → Sr PM → Program Manager → Senior Program Manager → Program Director',
    nextRole: 'Program Director (L6)',
    nextRoleReadiness: 70,
    mentor: 'Devin Okafor',
    skills: [
      { name: 'Program leadership', level: 'expert' },
      { name: 'Client crisis management', level: 'expert' },
      { name: 'Coaching directs', level: 'proficient' },
      { name: 'Portfolio / P&L ownership', level: 'learning' },
      { name: 'Executive-level narrative', level: 'proficient' },
    ],
    mobilityInterests: ['Program Director track', 'Lead PMO offshoot'],
    learningInProgress: [
      { course: 'Executive Program Leadership', provider: 'Wharton Executive Ed', progress: 40 },
    ],
  },
  documents: [
    { label: 'Offer letter', category: 'employment', signedOn: '2018-03-14' },
    { label: 'Promotion letter — Senior Program Manager', category: 'employment', signedOn: '2024-04-01' },
    { label: 'Comp adjustment — FY26 merit', category: 'employment', signedOn: '2026-04-01' },
    { label: 'I-9 Employment Eligibility', category: 'compliance', signedOn: '2018-04-02' },
    { label: 'W-4 Federal Tax Withholding (updated)', category: 'payroll', signedOn: '2024-01-12' },
    { label: 'Direct Deposit Authorization', category: 'payroll', signedOn: '2018-04-02' },
    { label: 'Handbook Acknowledgement (FY26)', category: 'compliance', signedOn: '2026-01-08' },
    { label: 'Benefits Elections — Family tier', category: 'benefits', signedOn: '2025-11-10' },
    { label: 'FY25 Annual Review', category: 'perf', signedOn: '2025-12-10' },
    { label: 'FY24 Annual Review', category: 'perf', signedOn: '2024-12-09' },
    { label: 'Pension Enrollment', category: 'benefits', signedOn: '2018-04-02' },
  ],
  onboarding: null,
  alerts: [
    {
      id: 'fsa_expiring',
      severity: 'warning',
      title: 'FSA has $340 expiring Dec 31',
      body: 'Use-it-or-lose-it applies. Eligible expenses include prescriptions, copays, contact lenses, and many OTC items. Use our FSA store or submit a reimbursement claim.',
      cta: { label: 'See eligible expenses' },
    },
    {
      id: 'reports_to_review',
      severity: 'info',
      title: '2 direct-report expense reports awaiting your approval',
      body: 'Amelia Park submitted $284 on Apr 19. Kenji Torres submitted $126 on Apr 20. Neither will reimburse until approved.',
      cta: { label: 'Review now' },
    },
    {
      id: 'pension_milestone',
      severity: 'success',
      title: '8 years of service — pension multiplier steps up Apr 2',
      body: 'You crossed the 8-year mark this month. Your pension projection is now $2,840/mo at age 65 at current service assumption.',
      cta: { label: 'View projection' },
    },
  ],
};

/* ─────────────────────────────── Exports ─────────────────────────────────── */

export const PERSONAS: Record<PersonaId, Persona> = {
  new_hire: JORDAN,
  field_tech: MARCUS,
  senior_pm: LEAH,
};

export const PERSONA_ORDER: PersonaId[] = ['new_hire', 'field_tech', 'senior_pm'];

export const PERSONA_SUMMARIES: Record<PersonaId, { label: string; hint: string }> = {
  new_hire:   { label: 'Jordan Rivera',  hint: 'New Hire · Week 2' },
  field_tech: { label: 'Marcus Chen',    hint: 'Fulfillment · 2 yrs' },
  senior_pm:  { label: 'Leah Thompson',  hint: 'Senior PM · 8 yrs' },
};
