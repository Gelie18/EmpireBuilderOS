// HR demo data — headcount, comp, hiring, onboarding, reviews, PTO, engagement, org chart.
// Anchored to Wednesday, April 22, 2026.

// ─── Headcount plan vs actual ────────────────────────────────────────────────
export const HEADCOUNT_SUMMARY = {
  actualFte: 84,
  planFte: 92,
  openReqs: 8,
  gapToPlan: -8,
  hiresYtd: 14,
  attritionYtd: 6,
  voluntaryAttritionAnnualized: 11,
  laborCostMonthly: 742_500,
  laborCostBudgetMonthly: 810_000,
};

export const HEADCOUNT_BY_DEPT = [
  { dept: 'Ops / Fulfillment', planFte: 32, actualFte: 30, openReqs: 2, avgTenureYears: 2.8, attritionYtd: 2 },
  { dept: 'Customer Success',   planFte: 14, actualFte: 12, openReqs: 2, avgTenureYears: 1.9, attritionYtd: 1 },
  { dept: 'Product / Design',   planFte:  9, actualFte:  8, openReqs: 1, avgTenureYears: 3.1, attritionYtd: 0 },
  { dept: 'Engineering',        planFte: 12, actualFte: 11, openReqs: 1, avgTenureYears: 2.4, attritionYtd: 1 },
  { dept: 'Marketing',          planFte:  7, actualFte:  7, openReqs: 0, avgTenureYears: 2.2, attritionYtd: 1 },
  { dept: 'Finance / HR',       planFte:  8, actualFte:  8, openReqs: 0, avgTenureYears: 4.0, attritionYtd: 0 },
  { dept: 'Retail',             planFte: 10, actualFte:  8, openReqs: 2, avgTenureYears: 1.4, attritionYtd: 1 },
];

export const HEADCOUNT_TREND = [
  { month: 'Nov', actual: 78, plan: 82 },
  { month: 'Dec', actual: 80, plan: 85 },
  { month: 'Jan', actual: 81, plan: 88 },
  { month: 'Feb', actual: 82, plan: 90 },
  { month: 'Mar', actual: 83, plan: 91 },
  { month: 'Apr', actual: 84, plan: 92 },
];

// ─── Comp bands + equity ─────────────────────────────────────────────────────
export type CompBand = {
  level: string;
  title: string;
  dept: string;
  min: number;
  mid: number;
  max: number;
  currentInBand: number;
  femalePayRatio: number; // 1.0 = parity
  underMinCount: number;
};

export const COMP_BANDS: CompBand[] = [
  { level: 'L2', title: 'Ops Associate',       dept: 'Ops',         min: 42_000, mid: 48_000, max: 54_000, currentInBand: 14, femalePayRatio: 0.99, underMinCount: 1 },
  { level: 'L3', title: 'Ops Lead',            dept: 'Ops',         min: 58_000, mid: 65_000, max: 72_000, currentInBand: 10, femalePayRatio: 0.98, underMinCount: 0 },
  { level: 'L4', title: 'Ops Manager',         dept: 'Ops',         min: 82_000, mid: 92_000, max: 102_000,currentInBand: 6,  femalePayRatio: 1.01, underMinCount: 0 },
  { level: 'L3', title: 'CS Specialist',       dept: 'CS',          min: 52_000, mid: 60_000, max: 68_000, currentInBand: 9,  femalePayRatio: 0.96, underMinCount: 2 },
  { level: 'L4', title: 'CS Manager',          dept: 'CS',          min: 78_000, mid: 90_000, max: 102_000,currentInBand: 3,  femalePayRatio: 1.00, underMinCount: 0 },
  { level: 'L4', title: 'Software Engineer',   dept: 'Engineering', min: 120_000,mid: 140_000,max: 165_000,currentInBand: 7,  femalePayRatio: 0.94, underMinCount: 1 },
  { level: 'L5', title: 'Senior Engineer',     dept: 'Engineering', min: 160_000,mid: 185_000,max: 215_000,currentInBand: 4,  femalePayRatio: 0.97, underMinCount: 0 },
  { level: 'L4', title: 'Product Manager',     dept: 'Product',     min: 115_000,mid: 135_000,max: 160_000,currentInBand: 5,  femalePayRatio: 1.02, underMinCount: 0 },
  { level: 'L4', title: 'Marketing Manager',   dept: 'Marketing',   min: 95_000, mid: 110_000,max: 130_000,currentInBand: 3,  femalePayRatio: 0.99, underMinCount: 0 },
  { level: 'L5', title: 'Finance Lead',        dept: 'Finance',     min: 140_000,mid: 165_000,max: 195_000,currentInBand: 3,  femalePayRatio: 1.03, underMinCount: 0 },
];

// ─── Open reqs / ATS pipeline ────────────────────────────────────────────────
export type OpenReq = {
  id: string;
  title: string;
  dept: string;
  level: string;
  location: string;
  openedOn: string;
  daysOpen: number;
  targetFillBy: string;
  hiringManager: string;
  stage: 'sourcing' | 'phone-screen' | 'on-site' | 'offer' | 'accepted';
  candidatesBystage: Record<string, number>;
  priority: 'high' | 'med' | 'low';
};

export const OPEN_REQS: OpenReq[] = [
  {
    id: 'R-4201', title: 'Senior Software Engineer', dept: 'Engineering', level: 'L5', location: 'Remote',
    openedOn: 'Feb 12', daysOpen: 70, targetFillBy: 'May 15', hiringManager: 'J. Chen',
    stage: 'offer', candidatesBystage: { applied: 184, screened: 42, 'phone-screen': 18, 'on-site': 6, offer: 2, accepted: 0 },
    priority: 'high',
  },
  {
    id: 'R-4215', title: 'CS Team Lead', dept: 'CS', level: 'L4', location: 'Reno, NV',
    openedOn: 'Mar 03', daysOpen: 50, targetFillBy: 'May 05', hiringManager: 'P. Nguyen',
    stage: 'on-site', candidatesBystage: { applied: 92, screened: 24, 'phone-screen': 12, 'on-site': 4, offer: 0, accepted: 0 },
    priority: 'high',
  },
  {
    id: 'R-4228', title: 'Product Designer', dept: 'Product', level: 'L4', location: 'Remote',
    openedOn: 'Mar 20', daysOpen: 33, targetFillBy: 'May 22', hiringManager: 'K. Okafor',
    stage: 'phone-screen', candidatesBystage: { applied: 141, screened: 38, 'phone-screen': 9, 'on-site': 0, offer: 0, accepted: 0 },
    priority: 'med',
  },
  {
    id: 'R-4231', title: 'Ops Associate (2)', dept: 'Ops', level: 'L2', location: 'Salt Lake City, UT',
    openedOn: 'Apr 02', daysOpen: 20, targetFillBy: 'May 10', hiringManager: 'M. Liu',
    stage: 'phone-screen', candidatesBystage: { applied: 68, screened: 22, 'phone-screen': 10, 'on-site': 4, offer: 0, accepted: 0 },
    priority: 'med',
  },
  {
    id: 'R-4240', title: 'CS Specialist (2)', dept: 'CS', level: 'L3', location: 'Reno, NV',
    openedOn: 'Apr 10', daysOpen: 12, targetFillBy: 'Jun 01', hiringManager: 'P. Nguyen',
    stage: 'sourcing', candidatesBystage: { applied: 34, screened: 6, 'phone-screen': 2, 'on-site': 0, offer: 0, accepted: 0 },
    priority: 'med',
  },
  {
    id: 'R-4245', title: 'Retail Floor Lead', dept: 'Retail', level: 'L3', location: 'Atlanta, GA',
    openedOn: 'Apr 18', daysOpen: 4, targetFillBy: 'Jun 15', hiringManager: 'T. Okonkwo',
    stage: 'sourcing', candidatesBystage: { applied: 12, screened: 2, 'phone-screen': 0, 'on-site': 0, offer: 0, accepted: 0 },
    priority: 'low',
  },
  {
    id: 'R-4248', title: 'Retail Associate', dept: 'Retail', level: 'L2', location: 'Atlanta, GA',
    openedOn: 'Apr 18', daysOpen: 4, targetFillBy: 'Jun 15', hiringManager: 'T. Okonkwo',
    stage: 'sourcing', candidatesBystage: { applied: 18, screened: 4, 'phone-screen': 1, 'on-site': 0, offer: 0, accepted: 0 },
    priority: 'low',
  },
  {
    id: 'R-4252', title: 'Ops Manager', dept: 'Ops', level: 'L4', location: 'Reno, NV',
    openedOn: 'Apr 20', daysOpen: 2, targetFillBy: 'Jul 01', hiringManager: 'M. Liu',
    stage: 'sourcing', candidatesBystage: { applied: 6, screened: 0, 'phone-screen': 0, 'on-site': 0, offer: 0, accepted: 0 },
    priority: 'med',
  },
];

// ─── Onboarding ──────────────────────────────────────────────────────────────
export type OnboardingHire = {
  id: string;
  name: string;
  title: string;
  dept: string;
  startDate: string;
  dayInJob: number;
  checklistPct: number;
  mgrCheckins: number;
  mgrCheckinsTarget: number;
  blockers: string[];
  status: 'on-track' | 'at-risk' | 'complete';
};

export const ONBOARDING_COHORT: OnboardingHire[] = [
  { id: 'H-501', name: 'Priya Vaidya',      title: 'Software Engineer',   dept: 'Engineering', startDate: 'Apr 14', dayInJob:  8, checklistPct: 72, mgrCheckins: 2, mgrCheckinsTarget: 2, blockers: [], status: 'on-track' },
  { id: 'H-502', name: 'Marcus Jenkins',    title: 'CS Specialist',       dept: 'CS',          startDate: 'Apr 07', dayInJob: 15, checklistPct: 64, mgrCheckins: 2, mgrCheckinsTarget: 3, blockers: ['Benefits enrollment'], status: 'at-risk' },
  { id: 'H-503', name: 'Sofia Ramirez',     title: 'Ops Associate',       dept: 'Ops',         startDate: 'Mar 31', dayInJob: 22, checklistPct: 88, mgrCheckins: 3, mgrCheckinsTarget: 3, blockers: [], status: 'on-track' },
  { id: 'H-504', name: 'Tomás Oliveira',    title: 'Marketing Associate', dept: 'Marketing',   startDate: 'Mar 24', dayInJob: 29, checklistPct: 94, mgrCheckins: 4, mgrCheckinsTarget: 4, blockers: [], status: 'on-track' },
  { id: 'H-505', name: 'Aisha Bakari',      title: 'Product Designer',    dept: 'Product',     startDate: 'Mar 10', dayInJob: 43, checklistPct: 100,mgrCheckins: 5, mgrCheckinsTarget: 5, blockers: [], status: 'complete' },
  { id: 'H-506', name: 'Kenji Tanaka',      title: 'Retail Associate',    dept: 'Retail',      startDate: 'Apr 21', dayInJob:  1, checklistPct: 25, mgrCheckins: 1, mgrCheckinsTarget: 1, blockers: ['I-9 pending'], status: 'on-track' },
];

// ─── Performance review cycle ────────────────────────────────────────────────
export const REVIEW_CYCLE = {
  cycleName: 'H1 2026',
  startedOn: 'Apr 01',
  closesOn: 'May 15',
  totalEmployees: 84,
  selfReviewsSubmitted: 61,
  peerReviewsSubmitted: 132,
  managerReviewsSubmitted: 42,
  calibrationMeetingsScheduled: 7,
  calibrationMeetingsHeld: 3,
  distributionTarget: { exceptional: 10, exceeds: 25, meets: 55, partiallyMeets: 8, belowExpect: 2 },
  distributionActual: { exceptional: 12, exceeds: 28, meets: 52, partiallyMeets: 7, belowExpect: 1 },
};

export type ReviewStatus = {
  dept: string;
  totalEmployees: number;
  selfReviewsPct: number;
  managerReviewsPct: number;
  peerReviewsPct: number;
  daysUntilClose: number;
};

export const REVIEW_BY_DEPT: ReviewStatus[] = [
  { dept: 'Ops',         totalEmployees: 30, selfReviewsPct: 83, managerReviewsPct: 60, peerReviewsPct: 72, daysUntilClose: 22 },
  { dept: 'CS',          totalEmployees: 12, selfReviewsPct: 75, managerReviewsPct: 42, peerReviewsPct: 66, daysUntilClose: 22 },
  { dept: 'Engineering', totalEmployees: 11, selfReviewsPct: 91, managerReviewsPct: 64, peerReviewsPct: 91, daysUntilClose: 22 },
  { dept: 'Product',     totalEmployees:  8, selfReviewsPct: 100,managerReviewsPct: 50, peerReviewsPct: 88, daysUntilClose: 22 },
  { dept: 'Marketing',   totalEmployees:  7, selfReviewsPct: 57, managerReviewsPct: 28, peerReviewsPct: 57, daysUntilClose: 22 },
  { dept: 'Retail',      totalEmployees:  8, selfReviewsPct: 38, managerReviewsPct: 25, peerReviewsPct: 38, daysUntilClose: 22 },
  { dept: 'Finance/HR',  totalEmployees:  8, selfReviewsPct: 88, managerReviewsPct: 75, peerReviewsPct: 88, daysUntilClose: 22 },
];

// ─── PTO ─────────────────────────────────────────────────────────────────────
export const PTO_SUMMARY = {
  currentOnPto: 3,
  upcomingNext14Days: 9,
  avgBalanceDays: 11.4,
  avgAccruedThisYear: 8.2,
  policyDaysPerYear: 20,
  pendingApprovals: 4,
};

export type PtoEvent = {
  employeeId: string;
  name: string;
  dept: string;
  start: string;
  end: string;
  days: number;
  type: 'pto' | 'sick' | 'parental' | 'bereavement';
  status: 'approved' | 'pending';
};

export const PTO_EVENTS: PtoEvent[] = [
  { employeeId: 'E-102', name: 'M. Liu',       dept: 'Ops',         start: 'Apr 22', end: 'Apr 22', days: 1,  type: 'sick',      status: 'approved' },
  { employeeId: 'E-144', name: 'A. Park',      dept: 'CS',          start: 'Apr 22', end: 'Apr 25', days: 4,  type: 'pto',       status: 'approved' },
  { employeeId: 'E-088', name: 'R. Okeke',     dept: 'Engineering', start: 'Apr 22', end: 'Apr 26', days: 5,  type: 'pto',       status: 'approved' },
  { employeeId: 'E-211', name: 'T. Williams',  dept: 'Marketing',   start: 'Apr 28', end: 'May 02', days: 5,  type: 'pto',       status: 'pending'  },
  { employeeId: 'E-156', name: 'S. Park',      dept: 'Ops',         start: 'Apr 29', end: 'May 06', days: 6,  type: 'parental',  status: 'approved' },
  { employeeId: 'E-201', name: 'J. Nguyen',    dept: 'Product',     start: 'May 01', end: 'May 08', days: 6,  type: 'pto',       status: 'pending'  },
  { employeeId: 'E-172', name: 'L. Bach',      dept: 'Retail',      start: 'May 05', end: 'May 05', days: 1,  type: 'pto',       status: 'pending'  },
  { employeeId: 'E-133', name: 'K. Sato',      dept: 'CS',          start: 'May 12', end: 'May 16', days: 5,  type: 'pto',       status: 'pending'  },
  { employeeId: 'E-191', name: 'C. Okonkwo',   dept: 'Retail',      start: 'May 18', end: 'May 22', days: 5,  type: 'pto',       status: 'approved' },
];

// ─── eNPS / Engagement ───────────────────────────────────────────────────────
export const ENPS_SUMMARY = {
  current: 42,
  priorQuarter: 31,
  industryBench: 24,
  responseRate: 78,
  priorResponseRate: 71,
  pulseDate: 'Apr 14, 2026',
};

export const ENPS_HISTORY = [
  { quarter: 'Q2 2024', score: 18, bench: 22 },
  { quarter: 'Q3 2024', score: 21, bench: 23 },
  { quarter: 'Q4 2024', score: 24, bench: 23 },
  { quarter: 'Q1 2025', score: 28, bench: 24 },
  { quarter: 'Q2 2025', score: 26, bench: 24 },
  { quarter: 'Q3 2025', score: 29, bench: 24 },
  { quarter: 'Q4 2025', score: 31, bench: 24 },
  { quarter: 'Q1 2026', score: 42, bench: 24 },
];

export const ENPS_BY_DEPT = [
  { dept: 'Engineering', score: 58, trend: 'up' as const },
  { dept: 'Product',     score: 52, trend: 'up' as const },
  { dept: 'Finance/HR',  score: 48, trend: 'flat' as const },
  { dept: 'Marketing',   score: 44, trend: 'up' as const },
  { dept: 'CS',          score: 36, trend: 'up' as const },
  { dept: 'Ops',         score: 32, trend: 'flat' as const },
  { dept: 'Retail',      score: 22, trend: 'down' as const },
];

export const ENPS_TOP_THEMES = [
  { theme: 'Leadership transparency',  mentions: 38, sentiment: 'positive' as const },
  { theme: 'Tools & systems',          mentions: 29, sentiment: 'positive' as const },
  { theme: 'Career growth path',       mentions: 22, sentiment: 'mixed'    as const },
  { theme: 'Workload in peak seasons', mentions: 19, sentiment: 'negative' as const },
  { theme: 'Retail compensation',      mentions: 14, sentiment: 'negative' as const },
];

// ─── Org chart ───────────────────────────────────────────────────────────────
export type OrgNode = {
  id: string;
  name: string;
  title: string;
  dept: string;
  reports: OrgNode[];
};

export const ORG_TREE: OrgNode = {
  id: 'E-001', name: 'Danielle Bass', title: 'CEO', dept: 'Executive',
  reports: [
    {
      id: 'E-002', name: 'Jordan Chen', title: 'VP Engineering', dept: 'Engineering',
      reports: [
        { id: 'E-010', name: 'Rita Okeke',      title: 'Eng Manager',    dept: 'Engineering', reports: [
          { id: 'E-088', name: 'Priya Vaidya',  title: 'Software Engineer', dept: 'Engineering', reports: [] },
          { id: 'E-091', name: 'Alex Park',     title: 'Senior Engineer',   dept: 'Engineering', reports: [] },
          { id: 'E-093', name: 'Min Tanaka',    title: 'Software Engineer', dept: 'Engineering', reports: [] },
        ] },
      ],
    },
    {
      id: 'E-003', name: 'Kamala Okafor', title: 'VP Product & Design', dept: 'Product',
      reports: [
        { id: 'E-020', name: 'Sean Liu',         title: 'Product Manager', dept: 'Product', reports: [] },
        { id: 'E-022', name: 'Aisha Bakari',     title: 'Product Designer',dept: 'Product', reports: [] },
      ],
    },
    {
      id: 'E-004', name: 'Paola Nguyen', title: 'VP Customer', dept: 'CS',
      reports: [
        { id: 'E-030', name: 'Karen Liu',       title: 'CS Lead',     dept: 'CS', reports: [
          { id: 'E-133', name: 'Karen Sato',    title: 'CS Specialist', dept: 'CS', reports: [] },
          { id: 'E-134', name: 'Bren Park',     title: 'CS Specialist', dept: 'CS', reports: [] },
        ] },
      ],
    },
    {
      id: 'E-005', name: 'Miguel Liu',  title: 'VP Operations', dept: 'Ops',
      reports: [
        { id: 'E-040', name: 'Dana Garcia', title: 'Ops Manager',    dept: 'Ops', reports: [
          { id: 'E-156', name: 'Sam Park',    title: 'Ops Lead',    dept: 'Ops', reports: [] },
          { id: 'E-161', name: 'Rosa Ramirez', title: 'Ops Associate', dept: 'Ops', reports: [] },
        ] },
      ],
    },
    {
      id: 'E-006', name: 'Talia Okonkwo', title: 'VP Retail',   dept: 'Retail', reports: [] },
    {
      id: 'E-007', name: 'Isaac Kim',     title: 'CFO',         dept: 'Finance', reports: [
        { id: 'E-060', name: 'Farah Ahmed', title: 'Finance Lead', dept: 'Finance', reports: [] },
        { id: 'E-062', name: 'Lena Vogel',  title: 'HR Lead',      dept: 'HR',      reports: [] },
      ],
    },
  ],
};
