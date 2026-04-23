import type {
  PnlReport,
  PnlRow,
  Kpi,
  Anomaly,
  CashFlowReport,
  ForecastModel,
  Scenario,
  Period,
  YoYReport,
  MoMReport,
  ComparisonMonth,
  DailyRevenuePoint,
  DailyCeoMetric,
  ActionItem,
  Comment,
  BenchmarkRow,
  MacroIndicator,
} from './types';

// ── Default Period ──
export const DEFAULT_PERIOD: Period = {
  type: 'month',
  startDate: '2026-04-01',
  endDate: '2026-04-30',
  label: 'Apr 2026',
};

export const AVAILABLE_PERIODS: Period[] = [
  { type: 'month', startDate: '2026-04-01', endDate: '2026-04-30', label: 'Apr' },
  { type: 'quarter', startDate: '2026-01-01', endDate: '2026-03-31', label: 'Q1' },
  { type: 'ytd', startDate: '2026-01-01', endDate: '2026-04-30', label: 'YTD' },
];

// ── P&L Rows (ported from prototype) ──
export const DEMO_PNL_ROWS: PnlRow[] = [
  { id: 'sec-rev', type: 'section', label: 'Revenue', indent: false, budget: null, actual: null, varianceDollar: null, variancePercent: null, isAnomaly: false },
  { id: 'rev-dtc', type: 'line_item', label: 'DTC / E-commerce', indent: true, budget: 742000, actual: 770400, varianceDollar: 28400, variancePercent: 3.8, isAnomaly: false, aiNote: 'Revenue beat by $28.4K \u2014 a targeted email campaign on Apr 12 drove a 14% conversion spike. No discounting required.' },
  { id: 'rev-wholesale', type: 'line_item', label: 'Wholesale', indent: true, budget: 528000, actual: 541200, varianceDollar: 13200, variancePercent: 2.5, isAnomaly: false, aiNote: 'Wholesale outperformed $13.2K. Scheels placed an accelerated reorder for their Q2 floor reset \u2014 watch May for a pull-forward effect.' },
  { id: 'rev-total', type: 'subtotal', label: 'Total Revenue', indent: false, budget: 1270000, actual: 1311600, varianceDollar: 41600, variancePercent: 3.3, isAnomaly: false },

  { id: 'sec-cogs', type: 'section', label: 'Cost of Goods Sold', indent: false, budget: null, actual: null, varianceDollar: null, variancePercent: null, isAnomaly: false },
  { id: 'cogs-materials', type: 'line_item', label: 'Materials & Production', indent: true, budget: 508000, actual: 516800, varianceDollar: 8800, variancePercent: 1.7, isAnomaly: false, aiNote: 'Over by $8.8K \u2014 an unbudgeted freight surcharge from the El Paso warehouse. Carrier contract review recommended.' },
  { id: 'cogs-fulfillment', type: 'line_item', label: 'Fulfillment & 3PL', indent: true, budget: 217800, actual: 203500, varianceDollar: -14300, variancePercent: -6.6, isAnomaly: false, aiNote: 'Favorable $14.3K \u2014 the new ShipBob deal kicked in mid-April at a lower per-unit rate. Full benefit hits May.' },
  { id: 'cogs-total', type: 'subtotal', label: 'Total COGS', indent: false, budget: 725800, actual: 720300, varianceDollar: -5500, variancePercent: -0.8, isAnomaly: false },

  { id: 'gp', type: 'total', label: 'Gross Profit', indent: false, budget: 552200, actual: 591300, varianceDollar: 39100, variancePercent: 7.1, isAnomaly: false },

  { id: 'sec-opex', type: 'section', label: 'Operating Expenses', indent: false, budget: null, actual: null, varianceDollar: null, variancePercent: null, isAnomaly: false },
  { id: 'opex-marketing', type: 'line_item', label: 'Marketing & Advertising', indent: true, budget: 124000, actual: 171200, varianceDollar: 47200, variancePercent: 38.1, isAnomaly: true, aiNote: 'ANOMALY: $47.2K over budget \u2014 largest marketing overage in 14 months. Altitude Creative ($18K) and WestCoast Influencers LLC ($13K) are not mapped to any approved campaign. Flag for CFO review before close.' },
  { id: 'opex-payroll', type: 'line_item', label: 'Payroll & Benefits', indent: true, budget: 198000, actual: 201200, varianceDollar: 3200, variancePercent: 1.6, isAnomaly: false, aiNote: 'Essentially on budget. One open SDR role unfilled (~$9K saved) offset by $6K in contract design fees for the Q4 catalog.' },
  { id: 'opex-tech', type: 'line_item', label: 'Technology & Software', indent: true, budget: 18400, actual: 14200, varianceDollar: -4200, variancePercent: -22.8, isAnomaly: false, aiNote: 'Favorable $4.2K \u2014 Salesforce renewal pushed to May. Expect a $22K charge next month.' },
  { id: 'opex-ga', type: 'line_item', label: 'General & Administrative', indent: true, budget: 72000, actual: 74100, varianceDollar: 2100, variancePercent: 2.9, isAnomaly: false, aiNote: 'In line. Office lease, insurance, and legal fees all tracking to plan. No surprises.' },
  { id: 'opex-total', type: 'subtotal', label: 'Total OpEx', indent: false, budget: 412400, actual: 460700, varianceDollar: 48300, variancePercent: 11.7, isAnomaly: false },

  { id: 'op-income', type: 'total', label: 'Operating Income', indent: false, budget: 139800, actual: 130600, varianceDollar: -9200, variancePercent: -6.6, isAnomaly: false },
  { id: 'net-income', type: 'total', label: 'Net Income', indent: false, budget: 109200, actual: 71400, varianceDollar: -37800, variancePercent: -34.6, isAnomaly: false },
];

export function getDemoPnlReport(): PnlReport {
  return {
    period: DEFAULT_PERIOD,
    rows: DEMO_PNL_ROWS,
    generatedAt: new Date().toISOString(),
    source: 'demo',
  };
}

// ── KPIs ──
export function getDemoKpis(): Kpi[] {
  return [
    { id: 'revenue', label: 'Revenue', value: 1311600, budgetValue: 1270000, varianceDollar: 41600, variancePercent: 3.3, trend: 'positive' },
    { id: 'gross-profit', label: 'Gross Profit', value: 591300, budgetValue: 552200, varianceDollar: 39100, variancePercent: 7.1, trend: 'positive' },
    { id: 'op-income', label: 'Op. Income', value: 130600, budgetValue: 139800, varianceDollar: -9200, variancePercent: -6.6, trend: 'neutral' },
    { id: 'net-income', label: 'Net Income', value: 71400, budgetValue: 109200, varianceDollar: -37800, variancePercent: -34.6, trend: 'negative' },
  ];
}

// ── Anomalies ──
export function getDemoAnomalies(): Anomaly[] {
  return [
    {
      id: 'anom-marketing',
      category: 'Marketing',
      severity: 'warning',
      headline: '$47,200 over budget (+38%)',
      detail: 'Altitude Creative $18K and WestCoast Influencers $13K not mapped to approved campaigns.',
      lineItemId: 'opex-marketing',
    },
  ];
}

// ── Cash Flow ──
export function getDemoCashFlow(): CashFlowReport {
  return {
    period: DEFAULT_PERIOD,
    operating: {
      label: 'Operating Activities',
      items: [
        { label: 'Net Income', amount: 71400 },
        { label: 'Depreciation & Amortization', amount: 12400 },
        { label: 'Change in Accounts Receivable', amount: -34200 },
        { label: 'Change in Inventory', amount: -18600 },
        { label: 'Change in Accounts Payable', amount: 22100 },
        { label: 'Change in Accrued Liabilities', amount: 8900 },
      ],
      total: 62000,
    },
    investing: {
      label: 'Investing Activities',
      items: [
        { label: 'Equipment Purchases', amount: -15000 },
        { label: 'Website Development', amount: -8500 },
      ],
      total: -23500,
    },
    financing: {
      label: 'Financing Activities',
      items: [
        { label: 'Line of Credit Draw', amount: 0 },
        { label: 'Loan Repayment', amount: -12000 },
      ],
      total: -12000,
    },
    netChange: 26500,
    openingBalance: 847000,
    closingBalance: 873500,
    runway: {
      months: 8.2,
      monthlyBurn: 106500,
      cashOnHand: 873500,
    },
    aging: {
      receivables: [
        { range: 'Current', amount: 142000, count: 18 },
        { range: '1-30', amount: 68000, count: 12 },
        { range: '31-60', amount: 34000, count: 7 },
        { range: '61-90', amount: 12000, count: 3 },
        { range: '90+', amount: 8400, count: 2 },
      ],
      payables: [
        { range: 'Current', amount: 98000, count: 22 },
        { range: '1-30', amount: 45000, count: 9 },
        { range: '31-60', amount: 18000, count: 4 },
        { range: '61-90', amount: 6000, count: 2 },
        { range: '90+', amount: 2200, count: 1 },
      ],
    },
    dailyForecast: generateDailyForecast(),
  };
}

function generateDailyForecast(): { date: string; balance: number; isProjected: boolean }[] {
  const points: { date: string; balance: number; isProjected: boolean }[] = [];
  let balance = 847000;
  const today = new Date('2026-04-30');

  // Historical (past 30 days)
  for (let i = -30; i <= 0; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    balance += (Math.random() - 0.45) * 15000;
    points.push({
      date: d.toISOString().split('T')[0],
      balance: Math.round(balance),
      isProjected: false,
    });
  }

  // Projected (next 60 days)
  for (let i = 1; i <= 60; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    balance += (Math.random() - 0.48) * 12000;
    points.push({
      date: d.toISOString().split('T')[0],
      balance: Math.round(balance),
      isProjected: true,
    });
  }

  return points;
}

// ── Forecast ──
//
// ACTUALS (Nov 2025–Apr 2026): exact values from the real P&L / MoM dataset — never touched by drivers.
// PROJECTIONS (May 2026–Oct 2026): computed fresh from drivers on every slider change.
//
export function getDemoForecast(): ForecastModel {
  // ── Locked actuals — sourced from MoM P&L data ──
  const ACTUALS = [
    { month: '2025-11', label: "Nov '25", revenue: 1_088_000, cogs: 585_600, grossProfit:  502_400, opex: 362_000, netIncome:  92_000, isActual: true },
    { month: '2025-12', label: "Dec '25", revenue: 1_112_000, cogs: 593_000, grossProfit:  519_000, opex: 370_000, netIncome:  99_000, isActual: true },
    { month: '2026-01', label: "Jan '26", revenue: 1_145_000, cogs: 609_000, grossProfit:  536_000, opex: 381_000, netIncome: 104_000, isActual: true },
    { month: '2026-02', label: "Feb '26", revenue: 1_198_000, cogs: 640_000, grossProfit:  558_000, opex: 395_000, netIncome: 111_000, isActual: true },
    { month: '2026-03', label: "Mar '26", revenue: 1_272_300, cogs: 689_300, grossProfit:  583_000, opex: 413_000, netIncome: 108_200, isActual: true },
    { month: '2026-04', label: "Apr '26", revenue: 1_311_600, cogs: 720_300, grossProfit:  591_300, opex: 460_700, netIncome:  71_400, isActual: true },
  ];

  // ── Projected month shells — values are placeholders; the page recomputes from drivers ──
  // costPerHead, cogsPct, nonPayrollOpExPct defaults match the Apr '26 actuals:
  //   Apr headcount: 42  |  COGS %: 54.9%  |  Non-payroll OpEx % (mktg+tech+G&A): 19.8%
  //   Payroll (42 × $4,790 ≈ $201,200) + non-payroll ($259,500) = $460,700 total OpEx ✓
  const PROJ_MONTHS = [
    { month: '2026-05', label: "May '26" },
    { month: '2026-06', label: "Jun '26" },
    { month: '2026-07', label: "Jul '26" },
    { month: '2026-08', label: "Aug '26" },
    { month: '2026-09', label: "Sep '26" },
    { month: '2026-10', label: "Oct '26" },
  ].map((m) => ({
    ...m,
    revenue: 0, cogs: 0, grossProfit: 0, opex: 0, netIncome: 0,
    isActual: false,
  }));

  return {
    id: 'base',
    name: 'Base Case',
    months: [...ACTUALS, ...PROJ_MONTHS],
    drivers: [
      { id: 'rev-growth',  label: 'Revenue Growth (MoM %)',    value: 3,    unit: 'percent', min: -5,  max: 15,  step: 0.5 },
      { id: 'cogs-pct',    label: 'COGS % of Revenue',         value: 54.9, unit: 'percent', min: 40,  max: 70,  step: 0.5 },
      // Non-payroll OpEx = marketing + tech + G&A as % of projected revenue
      // Oct actual: ($171,200 + $14,200 + $74,100) / $1,311,600 = 19.8%
      { id: 'opex-pct',    label: 'Non-Payroll OpEx % (Mktg+Tech+G&A)', value: 19.8, unit: 'percent', min: 10,  max: 40,  step: 0.5 },
      // Headcount: each person = $4,790/mo fully-loaded (matches Oct actual payroll: 42 × $4,790 = $201,180 ≈ $201,200)
      // Changing this ONLY affects projected months — actuals are locked
      { id: 'headcount',   label: 'Headcount (Projected)',              value: 42,   unit: 'number',  min: 25,  max: 100, step: 1   },
    ],
  };
}

// ── Scenarios ──
// All scenarios project FORWARD from Apr '26 actuals using independent monthly calculations.
// None re-use the base.months projected stubs (those are 0 until the driver model runs them).
export function getDemoScenarios(): Scenario[] {
  // 12 projected months: May '26 → Apr '27
  const MONTHS = [
    { key: '2026-05', label: "May '26" },
    { key: '2026-06', label: "Jun '26" },
    { key: '2026-07', label: "Jul '26" },
    { key: '2026-08', label: "Aug '26" },
    { key: '2026-09', label: "Sep '26" },
    { key: '2026-10', label: "Oct '26" },
    { key: '2026-11', label: "Nov '26" },
    { key: '2026-12', label: "Dec '26" },
    { key: '2027-01', label: "Jan '27" },
    { key: '2027-02', label: "Feb '27" },
    { key: '2027-03', label: "Mar '27" },
    { key: '2027-04', label: "Apr '27" },
  ];

  // Apr '26 base anchors (normalized: marketing at budget level)
  const BASE_REV  = 1_311_600;
  const BASE_OPEX = 436_000; // normalized: marketing at $124K, includes Salesforce renewal

  function buildProjection(params: {
    revGrowthPct:    number;   // monthly organic revenue growth
    cogsPct:         number;   // COGS as % of revenue
    startOpex:       number;   // Nov starting OpEx
    opexGrowthPct:   number;   // monthly OpEx growth
    newRevStartIdx?: number;   // 0-indexed month when new client rev starts
    newRevMax?:      number;   // max additional monthly revenue at full ramp (over 6 months)
  }) {
    const { revGrowthPct, cogsPct, startOpex, opexGrowthPct, newRevStartIdx, newRevMax } = params;
    return MONTHS.map(({ key, label }, i) => {
      const organic = Math.round(BASE_REV * Math.pow(1 + revGrowthPct, i + 1));
      let newClientRev = 0;
      if (newRevStartIdx !== undefined && newRevMax && i >= newRevStartIdx) {
        const rampStep = Math.min(i - newRevStartIdx + 1, 6);
        newClientRev = Math.round(newRevMax * (rampStep / 6));
      }
      const revenue     = organic + newClientRev;
      const cogs        = Math.round(revenue * cogsPct);
      const grossProfit = revenue - cogs;
      const opex        = Math.round(startOpex * Math.pow(1 + opexGrowthPct, i));
      const netIncome   = grossProfit - opex;
      return { month: key, label, revenue, cogs, grossProfit, opex, netIncome, isActual: false };
    });
  }

  // ── Base Case: 3% MoM organic growth, COGS 54.9%, normalized OpEx ──
  const baseResults = buildProjection({
    revGrowthPct: 0.03, cogsPct: 0.549,
    startOpex: BASE_OPEX, opexGrowthPct: 0.015,
  });

  // ── Best Case: New client wins ($6M ARR) ramping Jul '26, 5% organic growth ──
  // $6M ARR / 12 = $500K/mo at full ramp. Ramp starts month 2 (Jul '26), full by Dec '26.
  const bestResults = buildProjection({
    revGrowthPct: 0.05, cogsPct: 0.53,
    startOpex: 452_000,  // 2 additional sales hires for client acquisition
    opexGrowthPct: 0.015,
    newRevStartIdx: 2,   // Jul '26
    newRevMax: 500_000,  // $500K/mo at full ramp → ~$6M ARR
  });

  // ── Conservative: 1% growth, COGS creeping to 57%, flat OpEx ──
  const conservativeResults = buildProjection({
    revGrowthPct: 0.01, cogsPct: 0.57,
    startOpex: BASE_OPEX, opexGrowthPct: 0.008,
  });

  // ── Downside: -2% MoM, COGS 60% (freight surge + wholesale churn), cost control ──
  const downsideResults = buildProjection({
    revGrowthPct: -0.02, cogsPct: 0.60,
    startOpex: BASE_OPEX, opexGrowthPct: 0.005, // tight cost control
  });

  return [
    {
      id: 'base', name: 'Base Case', color: '#35B8E8',
      assumptions: [
        { id: 'rev',  label: 'Revenue Growth (MoM)', baseValue: 3,    adjustedValue: 3,    unit: 'percent'  as const },
        { id: 'cogs', label: 'COGS %',               baseValue: 54.9, adjustedValue: 54.9, unit: 'percent'  as const },
        { id: 'opex', label: 'Marketing (normalized)',baseValue: 171200, adjustedValue: 124000, unit: 'currency' as const },
      ],
      results: baseResults,
    },
    {
      id: 'best', name: 'Best Case', color: '#22D97A',
      assumptions: [
        { id: 'rev',        label: 'Organic Growth (MoM)',   baseValue: 3,        adjustedValue: 5,        unit: 'percent'   as const },
        { id: 'new-clients',label: 'New Client ARR (ramp)',  baseValue: 0,        adjustedValue: 6_000_000, unit: 'currency' as const },
        { id: 'cogs',       label: 'COGS % (better DTC mix)',baseValue: 54.9,     adjustedValue: 53.0,     unit: 'percent'   as const },
      ],
      results: bestResults,
    },
    {
      id: 'conservative', name: 'Conservative', color: '#F5A623',
      assumptions: [
        { id: 'rev',  label: 'Revenue Growth (MoM)',           baseValue: 3,    adjustedValue: 1,    unit: 'percent' as const },
        { id: 'cogs', label: 'COGS % (freight + materials)',   baseValue: 54.9, adjustedValue: 57.0, unit: 'percent' as const },
        { id: 'mktg', label: 'Marketing at budget',            baseValue: 171200, adjustedValue: 124000, unit: 'currency' as const },
      ],
      results: conservativeResults,
    },
    {
      id: 'downside', name: 'Downside', color: '#FF5566',
      assumptions: [
        { id: 'rev',       label: 'Revenue Growth (MoM)', baseValue: 3,    adjustedValue: -2,   unit: 'percent' as const },
        { id: 'wholesale', label: 'Wholesale Churn',      baseValue: 0,    adjustedValue: 10,   unit: 'percent' as const },
        { id: 'cogs',      label: 'COGS % (freight surge)',baseValue: 54.9, adjustedValue: 60.0, unit: 'percent' as const },
      ],
      results: downsideResults,
    },
  ];
}

// ─────────────────────────────────────────────
// ── YoY Comparison ──────────────────────────
// ─────────────────────────────────────────────

function makeComparisonMonth(
  year: number,
  monthIdx: number, // 0 = Jan
  baseRevenue: number,
  growthMultiplier: number
): ComparisonMonth {
  const d = new Date(year, monthIdx, 1);
  const rev = Math.round(baseRevenue * growthMultiplier * (1 + (Math.random() - 0.5) * 0.06));
  const cogs = Math.round(rev * (0.405 + (Math.random() - 0.5) * 0.02));
  const gp = rev - cogs;
  const margin = Math.round((gp / rev) * 1000) / 10;
  const opex = Math.round(rev * (0.32 + (Math.random() - 0.5) * 0.02));
  const ni = gp - opex;
  return {
    month: d.toISOString().slice(0, 7),
    label: d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
    revenue: rev,
    grossProfit: gp,
    grossMargin: margin,
    opex,
    netIncome: ni,
    headcount: 38 + Math.round(Math.random() * 6),
  };
}

export function getDemoYoY(): YoYReport {
  // Current year: Jan–Apr 2026 (4 months), using Apr as latest
  const currentYear: ComparisonMonth[] = Array.from({ length: 4 }, (_, i) => {
    const base = 1_050_000 + i * 25_000;
    return makeComparisonMonth(2026, i, base, 1.0);
  });
  // Apr 2026: use the real P&L numbers
  currentYear[3] = {
    month: '2026-04',
    label: "Apr '26",
    revenue: 1_311_600,
    grossProfit: 591_300,
    grossMargin: 45.1,
    opex: 460_700,
    netIncome: 71_400,
    headcount: 42,
  };

  // Prior year: Jan–Apr 2023, about 18% lower
  const priorYear: ComparisonMonth[] = Array.from({ length: 4 }, (_, i) => {
    const base = 890_000 + i * 20_000;
    return makeComparisonMonth(2023, i, base, 1.0);
  });

  return {
    currentYear,
    priorYear,
    summary: {
      revenueGrowth: 18.4,
      grossMarginExpansion: 1.2,
      opexGrowth: 22.1,
      netIncomeGrowth: 8.7,
    },
  };
}

// ─────────────────────────────────────────────
// ── MoM Trend ───────────────────────────────
// ─────────────────────────────────────────────

export function getDemoMoM(): MoMReport {
  const months: ComparisonMonth[] = [
    {
      month: '2025-11', label: "Nov '25",
      revenue: 1_088_000, grossProfit: 502_400, grossMargin: 46.2, opex: 362_000, netIncome: 92_000, headcount: 38,
    },
    {
      month: '2025-12', label: "Dec '25",
      revenue: 1_112_000, grossProfit: 519_000, grossMargin: 46.7, opex: 370_000, netIncome: 99_000, headcount: 39,
    },
    {
      month: '2026-01', label: "Jan '26",
      revenue: 1_145_000, grossProfit: 536_000, grossMargin: 46.8, opex: 381_000, netIncome: 104_000, headcount: 40,
    },
    {
      month: '2026-02', label: "Feb '26",
      revenue: 1_198_000, grossProfit: 558_000, grossMargin: 46.6, opex: 395_000, netIncome: 111_000, headcount: 40,
    },
    {
      month: '2026-03', label: "Mar '26",
      revenue: 1_272_300, grossProfit: 583_000, grossMargin: 45.8, opex: 413_000, netIncome: 108_200, headcount: 41,
    },
    {
      month: '2026-04', label: "Apr '26",
      revenue: 1_311_600, grossProfit: 591_300, grossMargin: 45.1, opex: 460_700, netIncome: 71_400, headcount: 42,
    },
  ];

  return {
    months,
    latestMonth: months[5],
    priorMonth: months[4],
  };
}

// ─────────────────────────────────────────────
// ── Daily Revenue ────────────────────────────
// ─────────────────────────────────────────────

export function getDemoDailyRevenue(): DailyRevenuePoint[] {
  const points: DailyRevenuePoint[] = [];
  const daysInApr = 30;
  const dailyBudget = Math.round(1_270_000 / daysInApr);

  let runningTotal = 0;
  let runningBudget = 0;

  // Weekend pattern: lower wholesale on weekends
  for (let d = 1; d <= daysInApr; d++) {
    const date = new Date(2026, 3, d); // Apr 2026
    const dayOfWeek = date.getDay(); // 0=Sun, 6=Sat
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // Apr 12 campaign spike
    const isCampaignDay = d === 12;
    const isScheelsPO = d === 22;

    const dtcBase = isWeekend ? 18_000 : 24_000;
    const wsBase = isWeekend ? 5_000 : 16_000;

    const dtc = Math.round(
      (isCampaignDay ? dtcBase * 2.4 : dtcBase) * (1 + (Math.random() - 0.5) * 0.3)
    );
    const wholesale = Math.round(
      (isScheelsPO ? wsBase * 8.2 : wsBase) * (1 + (Math.random() - 0.5) * 0.2)
    );
    const total = dtc + wholesale;

    runningTotal += total;
    runningBudget += dailyBudget;

    const dateStr = date.toISOString().split('T')[0];
    const dayLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    points.push({
      date: dateStr,
      dayLabel,
      dtc,
      wholesale,
      total,
      budget: dailyBudget,
      runningTotal,
      runningBudget,
    });
  }

  return points;
}

// ─────────────────────────────────────────────
// ── Daily CEO Report ─────────────────────────
// ─────────────────────────────────────────────

export function getDemoCeoMetrics(): DailyCeoMetric[] {
  return [
    {
      id: 'revenue',
      label: 'MTD Revenue',
      value: '$1,311,600',
      subtext: '$41.6K above budget',
      trend: 'positive',
      delta: '+3.3%',
    },
    {
      id: 'cash',
      label: 'Cash on Hand',
      value: '$873,500',
      subtext: '8.2 months runway',
      trend: 'neutral',
      delta: '+$26.5K',
    },
    {
      id: 'net-income',
      label: 'Net Income',
      value: '$71,400',
      subtext: '$37.8K below budget',
      trend: 'negative',
      delta: '–34.6%',
    },
    {
      id: 'gross-margin',
      label: 'Gross Margin',
      value: '45.1%',
      subtext: '+40 bps vs budget',
      trend: 'positive',
      delta: '+0.4%',
    },
    {
      id: 'open-ar',
      label: 'Open AR',
      value: '$264,400',
      subtext: '$8.4K aged 90+ days',
      trend: 'neutral',
      delta: '42 invoices',
    },
    {
      id: 'headcount',
      label: 'Headcount',
      value: '42',
      subtext: '1 open req (SDR)',
      trend: 'neutral',
      delta: '+2 YoY',
    },
  ];
}

export function getDemoActionItems(): ActionItem[] {
  return [
    {
      id: 'act-1',
      priority: 'high',
      owner: 'CFO',
      text: 'Review Altitude Creative ($18K) and WestCoast Influencers ($13K) — no approved campaign IDs. Hold or approve invoices before next close.',
      dueDate: '2026-05-05',
      status: 'open',
    },
    {
      id: 'act-2',
      priority: 'high',
      owner: 'Finance',
      text: 'Salesforce renewal ($22,000) hits in May — budget impact confirmed? Offset by full ShipBob benefit (+$14K/mo).',
      dueDate: '2026-05-01',
      status: 'open',
    },
    {
      id: 'act-3',
      priority: 'medium',
      owner: 'Operations',
      text: 'Initiate carrier contract review — unbudgeted El Paso freight surcharge ($8.8K) may recur in Q3 holiday volume.',
      dueDate: '2026-05-15',
      status: 'in_progress',
    },
    {
      id: 'act-4',
      priority: 'medium',
      owner: 'Sales',
      text: 'Flag Scheels Q2 pull-forward reorder — may create a revenue shortfall in May if they do not reorder as expected.',
      dueDate: '2026-05-08',
      status: 'open',
    },
    {
      id: 'act-5',
      priority: 'low',
      owner: 'HR',
      text: 'Backfill open SDR role — currently saving ~$9K/mo, but Q3 pipeline velocity may suffer without the hire.',
      dueDate: '2026-05-30',
      status: 'open',
    },
  ];
}

// ─────────────────────────────────────────────
// ── Comments / Annotations ───────────────────
// ─────────────────────────────────────────────

export function getDemoComments(): Comment[] {
  return [
    {
      id: 'cmt-1',
      targetId: 'opex-marketing',
      targetLabel: 'Marketing & Advertising',
      author: 'Sarah Chen',
      authorInitials: 'SC',
      content:
        'Reached out to Altitude Creative — they confirmed this was a campaign signed off by James in September. Waiting on the campaign ID from the agency portal. Will update by EOD Thursday.',
      timestamp: '2026-04-30T14:22:00Z',
      status: 'open',
      tags: ['requires-action', 'vendor'],
      replies: [
        {
          id: 'rep-1-1',
          author: 'James Tran',
          authorInitials: 'JT',
          content: 'Correct — I approved this verbally but forgot to log the campaign. Sending the ID now.',
          timestamp: '2026-04-30T15:05:00Z',
        },
        {
          id: 'rep-1-2',
          author: 'Sarah Chen',
          authorInitials: 'SC',
          content: 'Received — Campaign ID: MKT-2026-119. Updating the PO. WestCoast Influencers still outstanding.',
          timestamp: '2026-04-30T15:48:00Z',
        },
      ],
    },
    {
      id: 'cmt-2',
      targetId: 'rev-wholesale',
      targetLabel: 'Wholesale Revenue',
      author: 'Mike Torres',
      authorInitials: 'MT',
      content:
        'Scheels pull-forward confirmed: they needed inventory for a floor reset ahead of their summer promo. Their standard May reorder is $280K — this may not come until June. Watch May wholesale closely.',
      timestamp: '2026-04-29T09:15:00Z',
      status: 'flagged',
      tags: ['forecast-risk', 'wholesale'],
      replies: [],
    },
    {
      id: 'cmt-3',
      targetId: 'cogs-fulfillment',
      targetLabel: 'Fulfillment & 3PL',
      author: 'Lisa Park',
      authorInitials: 'LP',
      content:
        'ShipBob contract went live Apr 15. Full savings hit in May (~$14K/mo). Current month only captured half-month benefit. No issues with the transition.',
      timestamp: '2026-04-27T16:30:00Z',
      status: 'resolved',
      tags: ['vendor', 'savings'],
      replies: [],
    },
    {
      id: 'cmt-4',
      targetId: 'opex-tech',
      targetLabel: 'Technology & Software',
      author: 'Sarah Chen',
      authorInitials: 'SC',
      content:
        'Salesforce renewal pushed to May per their billing cycle. $22K charge will hit 5/1. I\'ve updated the May forecast. Partially offset by ShipBob savings.',
      timestamp: '2026-04-24T11:00:00Z',
      status: 'resolved',
      tags: ['renewal', 'forecast'],
      replies: [
        {
          id: 'rep-4-1',
          author: 'CFO',
          authorInitials: 'CF',
          content: 'Confirmed in board preview. Noted.',
          timestamp: '2026-04-24T13:22:00Z',
        },
      ],
    },
    {
      id: 'cmt-5',
      targetId: 'cogs-materials',
      targetLabel: 'Materials & Production',
      author: 'Lisa Park',
      authorInitials: 'LP',
      content:
        'El Paso freight surcharge is a new carrier fuel surcharge that took effect Apr 1. We\'re in talks with three alternative carriers. Should have a decision by May 10 before holiday volume ramps.',
      timestamp: '2026-04-28T10:45:00Z',
      status: 'open',
      tags: ['vendor', 'operations'],
      replies: [],
    },
  ];
}

// ─────────────────────────────────────────────
// ── Market Intelligence ───────────────────────
// ─────────────────────────────────────────────

export function getDemoBenchmarks(): BenchmarkRow[] {
  return [
    { metric: 'Gross Margin',         ridgeline: 45.1, industryMedian: 42.0, topQuartile: 52.0, unit: 'percent',  favorable: 'high' },
    { metric: 'Net Income Margin',    ridgeline:  5.4, industryMedian:  6.2, topQuartile: 10.5, unit: 'percent',  favorable: 'high' },
    { metric: 'Revenue Growth (YoY)', ridgeline: 18.4, industryMedian: 11.0, topQuartile: 25.0, unit: 'percent',  favorable: 'high' },
    { metric: 'OpEx % of Revenue',    ridgeline: 35.1, industryMedian: 34.0, topQuartile: 28.0, unit: 'percent',  favorable: 'low'  },
    { metric: 'COGS % of Revenue',    ridgeline: 54.9, industryMedian: 58.0, topQuartile: 48.0, unit: 'percent',  favorable: 'low'  },
    { metric: 'Revenue per Employee', ridgeline: 31200, industryMedian: 28500, topQuartile: 42000, unit: 'currency', favorable: 'high' },
    { metric: 'AR Days Outstanding',  ridgeline: 28.4, industryMedian: 32.0, topQuartile: 22.0, unit: 'number',  favorable: 'low'  },
    { metric: 'Inventory Turns',      ridgeline:  6.2, industryMedian:  5.4, topQuartile:  8.0, unit: 'multiple', favorable: 'high' },
    { metric: 'Marketing % Revenue',  ridgeline: 13.1, industryMedian: 10.5, topQuartile:  8.2, unit: 'percent',  favorable: 'low'  },
  ];
}

export function getDemoMacroIndicators(): MacroIndicator[] {
  return [
    {
      id: 'fed-rate',
      label: 'Fed Funds Rate',
      value: '5.25%',
      change: '–0.25% (Sep cut)',
      direction: 'down',
      impact: 'positive',
      detail: 'Rate cuts reduce cost of credit lines. Watch for refinancing opportunities on the LOC renewal in Q1.',
    },
    {
      id: 'freight-index',
      label: 'Freightos Baltic Index',
      value: '$1,420 / FEU',
      change: '+8% MoM',
      direction: 'up',
      impact: 'negative',
      detail: 'Ocean freight rates rising. The El Paso surcharge is consistent with industry-wide carrier cost increases. Expect pressure to persist through Q4.',
    },
    {
      id: 'consumer-spending',
      label: 'US Consumer Spending',
      value: '+0.4% MoM',
      change: 'Mar 2026',
      direction: 'up',
      impact: 'positive',
      detail: 'Outdoor / apparel discretionary spend still growing. DTC channel strength consistent with broader category tailwinds.',
    },
    {
      id: 'us-ppi',
      label: 'PPI — Leather Goods',
      value: '+2.1% YoY',
      change: 'Stable',
      direction: 'flat',
      impact: 'neutral',
      detail: 'Input cost inflation for leather goods holding below 3%. Materials cost pressure manageable; no repricing needed at current volumes.',
    },
    {
      id: 'dtc-returns',
      label: 'E-com Return Rate (Industry)',
      value: '22.4%',
      change: '–1.1pp YoY',
      direction: 'down',
      impact: 'positive',
      detail: 'Industry return rates declining as post-pandemic normalization continues. Ridgeline\'s 18% return rate is already below category median.',
    },
    {
      id: 'wholesale-outlook',
      label: 'Specialty Retail Foot Traffic',
      value: '+3.8% YoY',
      change: 'Apr 2026',
      direction: 'up',
      impact: 'positive',
      detail: 'Wholesale channel (Scheels, REI) benefiting from retail recovery. Supports Q2 reorder thesis if macro holds.',
    },
  ];
}
