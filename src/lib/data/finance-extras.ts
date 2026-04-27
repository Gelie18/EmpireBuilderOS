// Finance OS demo data — AP, AR, unit economics, budget, runway, vendors, board, covenants.
// Anchored to Wednesday, April 22, 2026.

// ─── AP Aging ────────────────────────────────────────────────────────────────
export type ApInvoice = {
  id: string;
  vendor: string;
  category: string;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  daysOverdue: number;
  status: 'scheduled' | 'overdue' | 'on-hold' | 'paid';
  po?: string;
};

export const AP_INVOICES: ApInvoice[] = [
  { id: 'INV-2842', vendor: 'Pacific Textile Mills',       category: 'Inventory',   invoiceDate: 'Mar 03', dueDate: 'Apr 02', amount: 84_200, daysOverdue: 21, status: 'overdue',   po: 'PO-1044' },
  { id: 'INV-2851', vendor: 'Atlanta Warehouse Co',        category: 'Logistics',   invoiceDate: 'Mar 10', dueDate: 'Apr 09', amount: 18_400, daysOverdue: 14, status: 'overdue' },
  { id: 'INV-2858', vendor: 'FedEx Freight',               category: 'Shipping',    invoiceDate: 'Mar 15', dueDate: 'Apr 14', amount:  9_720, daysOverdue:  9, status: 'overdue' },
  { id: 'INV-2864', vendor: 'Riverdale Packaging',         category: 'Packaging',   invoiceDate: 'Mar 22', dueDate: 'Apr 21', amount:  6_410, daysOverdue:  2, status: 'overdue' },
  { id: 'INV-2871', vendor: 'Linear Software',             category: 'SaaS',        invoiceDate: 'Apr 01', dueDate: 'May 01', amount:  2_880, daysOverdue:  0, status: 'scheduled' },
  { id: 'INV-2874', vendor: 'Salesforce',                  category: 'SaaS',        invoiceDate: 'Apr 01', dueDate: 'May 01', amount: 18_500, daysOverdue:  0, status: 'scheduled' },
  { id: 'INV-2878', vendor: 'Wilson & Co Accounting',      category: 'Professional',invoiceDate: 'Apr 05', dueDate: 'May 05', amount:  6_200, daysOverdue:  0, status: 'scheduled' },
  { id: 'INV-2881', vendor: 'UPS',                         category: 'Shipping',    invoiceDate: 'Apr 08', dueDate: 'May 08', amount: 14_320, daysOverdue:  0, status: 'scheduled' },
  { id: 'INV-2885', vendor: 'Pacific Textile Mills',       category: 'Inventory',   invoiceDate: 'Apr 10', dueDate: 'May 10', amount: 52_800, daysOverdue:  0, status: 'scheduled', po: 'PO-1052' },
  { id: 'INV-2891', vendor: 'Aon Insurance',               category: 'Insurance',   invoiceDate: 'Apr 15', dueDate: 'May 15', amount: 11_200, daysOverdue:  0, status: 'scheduled' },
  { id: 'INV-2897', vendor: 'Ironclad Legal',              category: 'Professional',invoiceDate: 'Apr 16', dueDate: 'May 16', amount:  8_900, daysOverdue:  0, status: 'on-hold' },
  { id: 'INV-2902', vendor: 'Google Workspace',            category: 'SaaS',        invoiceDate: 'Apr 18', dueDate: 'May 18', amount:  1_860, daysOverdue:  0, status: 'scheduled' },
];

// ─── AR Aging ────────────────────────────────────────────────────────────────
export type ArInvoice = {
  id: string;
  customer: string;
  channel: string;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  daysOverdue: number;
  status: 'current' | 'overdue' | 'disputed' | 'collection';
  owner: string;
};

export const AR_INVOICES: ArInvoice[] = [
  { id: 'AR-5101', customer: 'Nordstrom Inc',           channel: 'Wholesale', invoiceDate: 'Jan 28', dueDate: 'Feb 27', amount:  48_200, daysOverdue: 55, status: 'collection', owner: 'K. Sato' },
  { id: 'AR-5118', customer: 'Dick\'s Sporting Goods',  channel: 'Wholesale', invoiceDate: 'Feb 14', dueDate: 'Mar 16', amount:  72_800, daysOverdue: 37, status: 'overdue',    owner: 'K. Sato' },
  { id: 'AR-5127', customer: 'Scheels',                 channel: 'Wholesale', invoiceDate: 'Feb 28', dueDate: 'Mar 30', amount:  34_500, daysOverdue: 23, status: 'overdue',    owner: 'K. Sato' },
  { id: 'AR-5134', customer: 'Academy Sports',          channel: 'Wholesale', invoiceDate: 'Mar 08', dueDate: 'Apr 07', amount:  61_400, daysOverdue: 15, status: 'overdue',    owner: 'M. Jenkins' },
  { id: 'AR-5141', customer: 'Fanatics',                channel: 'Wholesale', invoiceDate: 'Mar 12', dueDate: 'Apr 11', amount:  92_100, daysOverdue: 11, status: 'disputed',   owner: 'K. Sato' },
  { id: 'AR-5148', customer: 'REI',                     channel: 'Wholesale', invoiceDate: 'Mar 18', dueDate: 'Apr 17', amount:  22_800, daysOverdue:  5, status: 'overdue',    owner: 'M. Jenkins' },
  { id: 'AR-5156', customer: 'Nordstrom Inc',           channel: 'Wholesale', invoiceDate: 'Mar 28', dueDate: 'Apr 27', amount:  51_200, daysOverdue:  0, status: 'current',    owner: 'K. Sato' },
  { id: 'AR-5162', customer: 'Dick\'s Sporting Goods',  channel: 'Wholesale', invoiceDate: 'Apr 02', dueDate: 'May 02', amount:  68_400, daysOverdue:  0, status: 'current',    owner: 'K. Sato' },
  { id: 'AR-5170', customer: 'Academy Sports',          channel: 'Wholesale', invoiceDate: 'Apr 10', dueDate: 'May 10', amount:  42_900, daysOverdue:  0, status: 'current',    owner: 'M. Jenkins' },
  { id: 'AR-5178', customer: 'Scheels',                 channel: 'Wholesale', invoiceDate: 'Apr 16', dueDate: 'May 16', amount:  29_100, daysOverdue:  0, status: 'current',    owner: 'K. Sato' },
];

// ─── Unit Economics (CAC / LTV) ──────────────────────────────────────────────
export const UNIT_ECONOMICS = {
  periodLabel: 'Trailing 12 months',
  blendedCac: 48,
  paidCac: 72,
  organicCac: 18,
  aov: 142,
  firstOrderMargin: 0.46,
  repeatRate: 0.38,
  avgOrdersPerCustomer: 2.3,
  lifetimeGrossMargin: 0.52,
  ltv: 168,
  ltvCacRatio: 3.5,
  paybackMonths: 4.2,
  targetPaybackMonths: 6.0,
};

export const UE_BY_CHANNEL = [
  { channel: 'Paid social',   cac: 72, ltv: 164, ratio: 2.3, spendShare: 0.42, orders: 3_850 },
  { channel: 'Paid search',   cac: 58, ltv: 171, ratio: 2.9, spendShare: 0.21, orders: 2_120 },
  { channel: 'Organic/direct',cac: 14, ltv: 178, ratio: 12.7,spendShare: 0.08, orders: 4_210 },
  { channel: 'Email / SMS',   cac:  6, ltv: 192, ratio: 32.0,spendShare: 0.04, orders: 3_920 },
  { channel: 'Wholesale',     cac: 92, ltv: 450, ratio: 4.9, spendShare: 0.18, orders:   180 },
  { channel: 'Retail foot',   cac: 34, ltv: 156, ratio: 4.6, spendShare: 0.07, orders: 1_480 },
];

export const UE_COHORTS = [
  { cohort: '2024 Q2', m0: 100, m3: 62, m6: 48, m12: 36, revPerCust: 158 },
  { cohort: '2024 Q3', m0: 100, m3: 65, m6: 51, m12: 39, revPerCust: 162 },
  { cohort: '2024 Q4', m0: 100, m3: 68, m6: 53, m12: 40, revPerCust: 168 },
  { cohort: '2025 Q1', m0: 100, m3: 70, m6: 55, m12: 42, revPerCust: 174 },
  { cohort: '2025 Q2', m0: 100, m3: 72, m6: 58, m12: null, revPerCust: 171 },
  { cohort: '2025 Q3', m0: 100, m3: 74, m6: 60, m12: null, revPerCust: 178 },
  { cohort: '2025 Q4', m0: 100, m3: 76, m6: null, m12: null, revPerCust: 182 },
  { cohort: '2026 Q1', m0: 100, m3: null, m6: null, m12: null, revPerCust: null },
];

// ─── Budget vs Actual (monthly) ──────────────────────────────────────────────
export type BudgetRow = {
  account: string;
  category: 'revenue' | 'cogs' | 'opex';
  budget: number;
  actual: number;
  forecast: number;
  ownerDept: string;
};

export const BUDGET_ROWS: BudgetRow[] = [
  { account: 'DTC revenue',            category: 'revenue', budget: 1_850_000, actual: 1_972_000, forecast: 1_995_000, ownerDept: 'Marketing' },
  { account: 'Wholesale revenue',      category: 'revenue', budget:   740_000, actual:   612_000, forecast:   680_000, ownerDept: 'Sales' },
  { account: 'Retail revenue',         category: 'revenue', budget:   285_000, actual:   258_000, forecast:   270_000, ownerDept: 'Retail' },
  { account: 'Product COGS',           category: 'cogs',    budget: 1_164_000, actual: 1_198_000, forecast: 1_220_000, ownerDept: 'Ops' },
  { account: 'Freight & fulfillment',  category: 'cogs',    budget:   174_000, actual:   188_000, forecast:   192_000, ownerDept: 'Ops' },
  { account: 'Payment processing',     category: 'cogs',    budget:    84_000, actual:    89_600, forecast:    92_000, ownerDept: 'Finance' },
  { account: 'Salaries & wages',       category: 'opex',    budget:   742_500, actual:   731_800, forecast:   742_500, ownerDept: 'HR' },
  { account: 'Marketing spend',        category: 'opex',    budget:   295_000, actual:   312_400, forecast:   330_000, ownerDept: 'Marketing' },
  { account: 'Software & SaaS',        category: 'opex',    budget:    42_000, actual:    46_800, forecast:    48_000, ownerDept: 'Finance' },
  { account: 'Rent & facilities',      category: 'opex',    budget:    38_000, actual:    38_000, forecast:    38_000, ownerDept: 'Ops' },
  { account: 'Professional services',  category: 'opex',    budget:    28_000, actual:    34_200, forecast:    36_000, ownerDept: 'Finance' },
  { account: 'Travel & entertainment', category: 'opex',    budget:    14_000, actual:     9_800, forecast:    12_000, ownerDept: 'All' },
];

// ─── Runway scenarios ────────────────────────────────────────────────────────
export const RUNWAY_BASE = {
  cashOnHand: 2_840_000,
  undrawnLine: 500_000,
  monthlyBurnBase: 185_000,
  monthlyBurnBull: 82_000,
  monthlyBurnBear: 310_000,
  asOf: 'Apr 22, 2026',
};

export const RUNWAY_SERIES = Array.from({ length: 18 }).map((_, i) => {
  const month = ['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep'][i];
  const year = i >= 8 && i < 20 ? (i >= 12 ? "'27" : "'27") : "'26";
  const label = i < 8 ? month + " '26" : i < 12 ? month + " '27" : month + " '27";
  return {
    month: label,
    base: Math.max(0, 2_840_000 - 185_000 * i),
    bull: Math.max(0, 2_840_000 - 82_000  * i),
    bear: Math.max(0, 2_840_000 - 310_000 * i),
  };
});

// ─── Vendor Spend ────────────────────────────────────────────────────────────
export type VendorSpend = {
  vendor: string;
  category: string;
  ytdSpend: number;
  lastYearSpend: number;
  contractEnds: string;
  paymentTerms: string;
  concentration: number;
  tier: 'strategic' | 'core' | 'tail';
};

export const VENDOR_SPEND: VendorSpend[] = [
  { vendor: 'Pacific Textile Mills',  category: 'Inventory',   ytdSpend: 612_000, lastYearSpend: 540_000, contractEnds: 'Dec 2026', paymentTerms: 'Net 30', concentration: 0.34, tier: 'strategic' },
  { vendor: 'FedEx Freight',          category: 'Shipping',    ytdSpend: 184_500, lastYearSpend: 168_000, contractEnds: 'Month-to-month', paymentTerms: 'Net 30', concentration: 0.10, tier: 'core' },
  { vendor: 'Salesforce',             category: 'SaaS',        ytdSpend:  74_000, lastYearSpend:  52_000, contractEnds: 'Jan 2027', paymentTerms: 'Annual prepay', concentration: 0.04, tier: 'core' },
  { vendor: 'Atlanta Warehouse Co',   category: 'Logistics',   ytdSpend: 128_800, lastYearSpend: 115_000, contractEnds: 'Sep 2026', paymentTerms: 'Net 30', concentration: 0.07, tier: 'strategic' },
  { vendor: 'Wilson & Co Accounting', category: 'Professional',ytdSpend:  48_600, lastYearSpend:  42_000, contractEnds: 'Dec 2026', paymentTerms: 'Net 30', concentration: 0.03, tier: 'core' },
  { vendor: 'UPS',                    category: 'Shipping',    ytdSpend: 112_400, lastYearSpend: 102_000, contractEnds: 'Month-to-month', paymentTerms: 'Net 30', concentration: 0.06, tier: 'core' },
  { vendor: 'Google Workspace',       category: 'SaaS',        ytdSpend:   7_440, lastYearSpend:   6_200, contractEnds: 'Month-to-month', paymentTerms: 'Monthly', concentration: 0.00, tier: 'tail' },
  { vendor: 'Riverdale Packaging',    category: 'Packaging',   ytdSpend:  46_200, lastYearSpend:  38_000, contractEnds: 'Jul 2026', paymentTerms: 'Net 30', concentration: 0.03, tier: 'core' },
  { vendor: 'Aon Insurance',          category: 'Insurance',   ytdSpend:  44_800, lastYearSpend:  41_200, contractEnds: 'Jun 2026', paymentTerms: 'Quarterly', concentration: 0.03, tier: 'core' },
  { vendor: 'Ironclad Legal',         category: 'Professional',ytdSpend:  35_600, lastYearSpend:  18_400, contractEnds: 'Engagement', paymentTerms: 'Net 30', concentration: 0.02, tier: 'tail' },
  { vendor: 'Linear Software',        category: 'SaaS',        ytdSpend:  11_520, lastYearSpend:   9_600, contractEnds: 'Jan 2027', paymentTerms: 'Annual prepay', concentration: 0.01, tier: 'tail' },
  { vendor: 'Shopify Plus',           category: 'SaaS',        ytdSpend:  28_000, lastYearSpend:  24_000, contractEnds: 'Feb 2027', paymentTerms: 'Annual prepay', concentration: 0.02, tier: 'core' },
];

// ─── Board Packet ────────────────────────────────────────────────────────────
export const BOARD_METRICS = {
  periodLabel: 'March 2026 / Q1 2026',
  revenueQtr: 8_420_000,
  revenueQtrPriorYear: 7_180_000,
  revenueYoY: 0.173,
  grossMarginQtr: 0.484,
  grossMarginPriorQtr: 0.472,
  ebitdaQtr: 612_000,
  ebitdaMargin: 0.073,
  cashEom: 2_840_000,
  cashChgQtr: -420_000,
  runwayMonths: 15,
  headcount: 84,
  netRevRetention: 1.08,
  nps: 52,
  enps: 42,
};

export const BOARD_HIGHLIGHTS = [
  { kind: 'win'  as const, text: 'DTC revenue +28% YoY driven by email/SMS scale-up (32x LTV:CAC on that channel).' },
  { kind: 'win'  as const, text: 'Q1 gross margin expansion +1.2pp from freight renegotiation and packaging change.' },
  { kind: 'win'  as const, text: 'eNPS +11pts to 42 — leadership transparency theme cited as top driver.' },
  { kind: 'risk' as const, text: 'Wholesale revenue -15% vs budget; Nordstrom and Dick\'s AR aging past 30d.' },
  { kind: 'risk' as const, text: 'Retail L3 pay band has 0.94 F:M parity ratio — active equity flag.' },
  { kind: 'risk' as const, text: 'Marketing overspend $17K in March; Q2 budget needs re-baseline.' },
  { kind: 'ask'  as const, text: 'Approve additional Eng L5 req ($195K loaded) to unblock Q3 roadmap.' },
  { kind: 'ask'  as const, text: 'Ratify $500K RLOC renewal (expires July); current utilization 0%.' },
];

// ─── Covenants ───────────────────────────────────────────────────────────────
export type Covenant = {
  id: string;
  name: string;
  lender: string;
  threshold: string;
  thresholdValue: number;
  comparator: '>=' | '<=' | '>' | '<';
  currentValue: number;
  cushionPct: number;
  lastTestedOn: string;
  nextTestOn: string;
  status: 'green' | 'yellow' | 'red';
  note: string;
};

export const COVENANTS: Covenant[] = [
  {
    id: 'COV-01', name: 'Debt Service Coverage Ratio (DSCR)', lender: 'First Western Bank',
    threshold: '≥ 1.25x', thresholdValue: 1.25, comparator: '>=', currentValue: 1.62, cushionPct: 30,
    lastTestedOn: 'Mar 31', nextTestOn: 'Jun 30', status: 'green',
    note: 'EBITDA $612K / debt service $378K. Strong cushion.',
  },
  {
    id: 'COV-02', name: 'Minimum Liquidity', lender: 'First Western Bank',
    threshold: '≥ $1.5M', thresholdValue: 1_500_000, comparator: '>=', currentValue: 2_840_000, cushionPct: 89,
    lastTestedOn: 'Apr 01', nextTestOn: 'May 01', status: 'green',
    note: 'Tested monthly. $1.34M cushion above floor.',
  },
  {
    id: 'COV-03', name: 'Leverage Ratio (Total Debt / EBITDA)', lender: 'First Western Bank',
    threshold: '≤ 3.5x', thresholdValue: 3.5, comparator: '<=', currentValue: 2.84, cushionPct: 19,
    lastTestedOn: 'Mar 31', nextTestOn: 'Jun 30', status: 'green',
    note: 'Tightens if Q2 EBITDA softens — watch.',
  },
  {
    id: 'COV-04', name: 'Current Ratio', lender: 'First Western Bank',
    threshold: '≥ 1.1x', thresholdValue: 1.1, comparator: '>=', currentValue: 1.18, cushionPct: 7,
    lastTestedOn: 'Mar 31', nextTestOn: 'Jun 30', status: 'yellow',
    note: 'AR aging on Nordstrom/DICK\'S is pressuring current assets. Resolving.',
  },
  {
    id: 'COV-05', name: 'CapEx Limit', lender: 'First Western Bank',
    threshold: '≤ $400K/yr', thresholdValue: 400_000, comparator: '<=', currentValue: 78_000, cushionPct: 81,
    lastTestedOn: 'Apr 01', nextTestOn: 'Jul 01', status: 'green',
    note: '19.5% of annual limit used. Track per-quarter.',
  },
  {
    id: 'COV-06', name: 'Reporting — Monthly financials', lender: 'First Western Bank',
    threshold: 'within 30 days of MEC', thresholdValue: 30, comparator: '<=', currentValue: 8, cushionPct: 73,
    lastTestedOn: 'Apr 08', nextTestOn: 'May 08', status: 'green',
    note: 'March financials delivered Apr 8 (8 days after close).',
  },
];
