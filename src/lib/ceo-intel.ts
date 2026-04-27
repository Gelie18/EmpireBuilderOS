/**
 * CEO intelligence layer: plan vs actual, cash position, weekly deltas,
 * and the stream of decisions waiting for the CEO.
 *
 * Everything here is demo data defensibly scaled to each subco's revenue
 * envelope in lib/subcos.ts. Swap with live pulls in production.
 */

import { ALL_SUBCOS, ALL_PORTFOLIO_SUBCOS, getSubco, type Subco } from './subcos';
import { getSkuBundle } from './sku-data';

// ── Cash position ────────────────────────────────────────────────────────────
export interface CashPosition {
  cashOnHand: number;
  last30Change: number;      // positive = grew
  runwayMonths: number;      // how many months at current burn
  arOutstanding: number;     // receivables
  apDueNext30: number;       // payables due in 30d
  arOver60Days: number;      // aging bucket
  burnRate: number;          // negative = burning, positive = generating
}

const CASH_BY_SUBCO: Record<string, CashPosition> = {
  'bases-loaded': {
    cashOnHand:       2_147_000,
    last30Change:       +84_000,
    runwayMonths:         11.2,
    arOutstanding:      874_000,
    apDueNext30:        412_000,
    arOver60Days:       118_000,
    burnRate:           +68_400,
  },
  ssk: {
    cashOnHand:       1_482_000,
    last30Change:       +52_000,
    runwayMonths:          8.8,
    arOutstanding:      620_000,
    apDueNext30:        308_000,
    arOver60Days:        84_000,
    burnRate:           +48_200,
  },
  bgl: {
    cashOnHand:         512_000,
    last30Change:       +22_000,
    runwayMonths:         14.0,
    arOutstanding:      118_000,
    apDueNext30:         62_000,
    arOver60Days:         8_400,
    burnRate:           +18_800,
  },
  ddw: {
    cashOnHand:          68_400,
    last30Change:        -4_200,
    runwayMonths:          4.8,
    arOutstanding:       52_000,
    apDueNext30:         24_000,
    arOver60Days:        14_600,
    burnRate:            -3_100,
  },
  aas: {
    cashOnHand:          44_800,
    last30Change:        +1_800,
    runwayMonths:          6.2,
    arOutstanding:       68_000,
    apDueNext30:         18_400,
    arOver60Days:        11_200,
    burnRate:               +700,
  },
  shug0: {
    cashOnHand:          39_800,
    last30Change:        +3_600,
    runwayMonths:          5.4,
    arOutstanding:       42_000,
    apDueNext30:         22_000,
    arOver60Days:         6_200,
    burnRate:            +2_800,
  },
};

export function getCashPosition(subcoId: string): CashPosition {
  return CASH_BY_SUBCO[subcoId] ?? CASH_BY_SUBCO['bases-loaded'];
}

// ── Plan vs actual (MTD April 2026) ─────────────────────────────────────────
export interface PlanActual {
  revenue:      { plan: number; actual: number; pctDelta: number };
  grossMargin:  { plan: number; actual: number; pctDelta: number };  // percent values
  opex:         { plan: number; actual: number; pctDelta: number };  // positive = over budget
  netIncome:    { plan: number; actual: number; pctDelta: number };
}

// Generator: derive plan/actual from subco revenue + GM with plausible MTD deltas.
export function getPlanActual(subcoId: string): PlanActual {
  const subco = getSubco(subcoId);
  // Approximate monthly plan = annual / 12.
  const monthlyRevPlan = subco.annualRevenue / 12;
  const revDelta = (subcoId === 'bases-loaded' || subcoId === 'consolidated') ? 0.024
                 : subcoId === 'ssk' ? 0.028
                 : subcoId === 'bgl' ? 0.061
                 : subcoId === 'ddw' ? -0.142
                 : subcoId === 'aas' ? -0.085
                 : subcoId === 'shug0' ? 0.018
                 : 0;
  const monthlyRevActual = monthlyRevPlan * (1 + revDelta);

  const gmPlan = subco.grossMargin;
  const gmActual = subcoId === 'bases-loaded' ? gmPlan - 1.8
                 : subcoId === 'ssk' ? gmPlan - 2.4
                 : subcoId === 'bgl' ? gmPlan + 0.6
                 : subcoId === 'ddw' ? gmPlan - 1.2
                 : subcoId === 'aas' ? gmPlan - 3.1
                 : subcoId === 'shug0' ? gmPlan - 0.8
                 : gmPlan;

  const opexPlan = monthlyRevPlan * 0.28;
  const opexDelta = subcoId === 'bases-loaded' ? 0.082
                  : subcoId === 'ssk' ? 0.12
                  : subcoId === 'bgl' ? -0.04
                  : subcoId === 'ddw' ? 0.18
                  : subcoId === 'aas' ? 0.09
                  : subcoId === 'shug0' ? 0.02
                  : 0;
  const opexActual = opexPlan * (1 + opexDelta);

  const niPlan = monthlyRevPlan * gmPlan / 100 - opexPlan;
  const niActual = monthlyRevActual * gmActual / 100 - opexActual;
  const niPctDelta = niPlan !== 0 ? (niActual - niPlan) / Math.abs(niPlan) : 0;

  return {
    revenue:     { plan: monthlyRevPlan, actual: monthlyRevActual, pctDelta: revDelta },
    grossMargin: { plan: gmPlan,        actual: gmActual,        pctDelta: (gmActual - gmPlan) / gmPlan },
    opex:        { plan: opexPlan,      actual: opexActual,      pctDelta: opexDelta },
    netIncome:   { plan: niPlan,        actual: niActual,        pctDelta: niPctDelta },
  };
}

// ── Deltas since last visit / since Friday ──────────────────────────────────
export interface WeeklyDelta {
  id: string;
  subcoId: string;
  tone: 'good' | 'warn' | 'bad' | 'neutral';
  category: 'revenue' | 'margin' | 'cash' | 'inventory' | 'channel' | 'collection';
  headline: string;
  detail: string;
  since: string;        // "Since Friday", "Since last login"
  dollarImpact?: number;
}

export function getWeeklyDeltas(subcoId: string): WeeklyDelta[] {
  const all: WeeklyDelta[] = [
    // Topco
    { id: 'd1',  subcoId: 'bases-loaded', tone: 'good',    category: 'revenue',    headline: 'Portfolio revenue beat plan by $62K this week',
      detail: 'Strongest since Nov 2025. Driven by SSK glove restock and BGL lace bundles clearing on Amazon.',
      since: 'Since Friday', dollarImpact: 62_000 },
    { id: 'd2',  subcoId: 'bases-loaded', tone: 'warn',    category: 'margin',     headline: 'Blended GM dropped 0.8pt week-over-week',
      detail: 'Amazon take-rate step hit SSK core SKUs on Monday. Net impact ~$11K GM lost this week alone.',
      since: 'Since Monday', dollarImpact: -11_000 },
    { id: 'd3',  subcoId: 'bases-loaded', tone: 'bad',     category: 'collection', headline: 'DDW wholesale collections aged past 60 days',
      detail: '$14.6K from 3 accounts now 60+ days overdue. Finance has escalated but needs CEO sign-off on account holds.',
      since: 'Since Wed', dollarImpact: -14_600 },
    { id: 'd4',  subcoId: 'bases-loaded', tone: 'neutral', category: 'cash',       headline: 'Cash position at $2.15M — 11.2 months runway',
      detail: 'Net +$84K over trailing 30d. AR outstanding $874K; AP due next 30d is $412K.',
      since: 'Current',        dollarImpact: 84_000 },
    { id: 'd5',  subcoId: 'bases-loaded', tone: 'good',    category: 'inventory',  headline: 'BGL cleared 4K units of aged neon lace',
      detail: 'Clearance promo moved $22K in two weeks. Recovered ~$14K working capital.',
      since: 'Last 2 weeks',   dollarImpact: 14_000 },

    // SSK
    { id: 'd6',  subcoId: 'ssk',          tone: 'warn',    category: 'margin',     headline: 'Z7 core GM fell 2.4pts after Amazon take-rate step',
      detail: 'Annualized ~$380K GM exposure if no price action. Elasticity on Z7 is low; 2–3% retail price lift likely absorbs.',
      since: 'Since Monday', dollarImpact: -31_700 },
    { id: 'd7',  subcoId: 'ssk',          tone: 'good',    category: 'revenue',    headline: 'PS3 Pro Glove restock sold through in 9 days',
      detail: 'Original plan was 14-day sell-through. Next PO is already on water from Japan parent.',
      since: 'This week', dollarImpact: 42_000 },
    { id: 'd8',  subcoId: 'ssk',          tone: 'warn',    category: 'inventory',  headline: 'FP5 softball mitt — 4 colorways trending past 180 DOH',
      detail: 'Launch inventory aging. Decision needed: promote or write down.',
      since: 'This month',  dollarImpact: -18_000 },

    // BGL
    { id: 'd9',  subcoId: 'bgl',          tone: 'good',    category: 'channel',    headline: 'Shopify DTC up 11% week-over-week',
      detail: 'Relacing service bookings converting into lace-purchase attach. LTV calculation pending.',
      since: 'Since Friday', dollarImpact: 28_000 },
    { id: 'd10', subcoId: 'bgl',          tone: 'warn',    category: 'inventory',  headline: '19 lace colorways sold < 3 units/month',
      detail: 'Long-tail SKU bloat — $72K working capital at risk if left unaddressed. Prune candidate list ready.',
      since: 'Ongoing',      dollarImpact: -72_000 },

    // DDW
    { id: 'd11', subcoId: 'ddw',          tone: 'bad',     category: 'collection', headline: 'Wholesale collections 8 days slower than Q4 last year',
      detail: 'DSO trending up from 30 to 38 days. Three gift-shop accounts responsible for the drift.',
      since: 'This quarter',   dollarImpact: -24_000 },
    { id: 'd12', subcoId: 'ddw',          tone: 'warn',    category: 'cash',       headline: 'Runway shortened to 4.8 months',
      detail: 'Burn widened to $3.1K/mo net. Q4 gift season is the recovery play — needs capital plan for the gap.',
      since: 'This month',     dollarImpact: -3_100 },

    // AAS
    { id: 'd13', subcoId: 'aas',          tone: 'warn',    category: 'inventory',  headline: 'Elite line still showing "sold out"',
      detail: 'Approx $38K/month in missed revenue. Replenishment PO blocked on USA manufacturer capacity.',
      since: 'Ongoing',        dollarImpact: -38_000 },
    { id: 'd14', subcoId: 'aas',          tone: 'bad',     category: 'margin',     headline: 'GM compressed 3.1pts vs plan',
      detail: 'Made-in-USA cost inflation + entry-tier price competition. GM at 41.6% vs 44.7% plan.',
      since: 'Month-to-date',  dollarImpact: -15_000 },

    // SHUG0
    { id: 'd15', subcoId: 'shug0',        tone: 'good',    category: 'revenue',    headline: 'Limited Edition Gold Bat sold through',
      detail: 'Full allocation cleared in 11 days. Stroman drop did the work. Decision: reorder or move on?',
      since: 'This week',      dollarImpact: 86_000 },
  ];

  if (subcoId === 'bases-loaded' || subcoId === 'consolidated') {
    // Topco / consolidated sees the best / most material deltas across the whole portfolio.
    return all.filter((d) => d.subcoId === 'bases-loaded' || Math.abs(d.dollarImpact ?? 0) >= 18_000);
  }
  return all.filter((d) => d.subcoId === subcoId);
}

// ── Alerts / On-fire queue ──────────────────────────────────────────────────
export interface Alert {
  id: string;
  subcoId: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  owner: string;
  due: string;
  title: string;
  body: string;
  cta: { label: string; href: string };
}

export function getAlerts(subcoId: string): Alert[] {
  const all: Alert[] = [
    { id: 'a1', subcoId: 'bases-loaded', severity: 'critical', owner: 'CFO · Priya Shah', due: 'Apr 24',
      title: 'DDW wholesale collections > 60 days — $14.6K at risk',
      body: '3 accounts past 60 days. Requires CEO sign-off on credit hold before Finance can escalate.',
      cta: { label: 'Review in Collections', href: '/fin-backlog' } },
    { id: 'a2', subcoId: 'ssk',          severity: 'critical', owner: 'Merch · Ari Chen', due: 'Apr 26',
      title: 'SSK Z7 — price action needed within 7 days',
      body: 'Amazon take-rate step took 2.4pts of margin Monday. Low-elasticity SKU; 2–3% retail lift absorbs it.',
      cta: { label: 'Open Z7 SKU deep-dive', href: '/sku-rationalization' } },
    { id: 'a3', subcoId: 'bases-loaded', severity: 'high',     owner: 'Ops · Dre Morris',  due: 'Apr 29',
      title: 'Portfolio: 796 SKUs proposed for prune — awaiting approval',
      body: '$1.24M working capital tied up in dead stock across 5 subcos. Prune list ready for CEO sign-off.',
      cta: { label: 'Review in SKU Rationalization', href: '/sku-rationalization' } },
    { id: 'a4', subcoId: 'ssk',          severity: 'high',     owner: 'Finance · Priya',   due: 'Apr 30',
      title: 'SSK Japan royalty — 3 months unposted',
      body: 'Manual reconciliation to Japan parent is 3 months behind. $186K payable estimated; needs reconciliation and posting.',
      cta: { label: 'Open Fin Backlog', href: '/fin-backlog' } },
    { id: 'a5', subcoId: 'aas',          severity: 'high',     owner: 'Ops · Dre Morris',  due: 'Apr 25',
      title: 'AAS Elite line stockout — $38K/mo missed revenue',
      body: 'USA manufacturer capacity constrained. Need CEO call on alternate source or price lift while constrained.',
      cta: { label: 'Open Ops Backlog', href: '/backlog' } },
    { id: 'a6', subcoId: 'ddw',          severity: 'medium',   owner: 'GM · Hanna V.',     due: 'May 5',
      title: 'DDW runway at 4.8 months — capital plan needed',
      body: 'Burn widened; Q4 gift season is the recovery. Needs 5-month bridge plan.',
      cta: { label: 'Open Scenarios', href: '/scenarios' } },
    { id: 'a7', subcoId: 'bgl',          severity: 'medium',   owner: 'Merch · Ari Chen',  due: 'May 2',
      title: 'BGL — 19 lace colorways sold < 3 units/month',
      body: '$72K working capital at risk. Prune list ready with projected +2.6% GM lift.',
      cta: { label: 'Review list', href: '/sku-rationalization' } },
    { id: 'a8', subcoId: 'shug0',        severity: 'low',      owner: 'GM · Stroman team', due: 'May 10',
      title: 'Shug0 Gold Bat sold through — reorder decision',
      body: 'Limited edition cleared in 11 days. Reorder risk: dilutes scarcity value. Align on positioning.',
      cta: { label: 'Open Revenue Intel', href: '/revenue' } },
  ];

  if (subcoId === 'bases-loaded' || subcoId === 'consolidated') return all;
  return all.filter((a) => a.subcoId === subcoId);
}

// ── Decision queue items — seed data, used by DecisionsContext to hydrate ───
export interface Decision {
  id: string;
  subcoId: string;
  type: 'sku' | 'capital' | 'pricing' | 'vendor' | 'collection' | 'hiring';
  title: string;
  summary: string;
  recommendedAction: string;
  owner: string;
  impact: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  urgency: 'URGENT' | 'THIS WEEK' | 'THIS MONTH';
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'delegated';
}

export const SEED_DECISIONS: Decision[] = [
  { id: 'dec1', subcoId: 'ssk', type: 'pricing', urgency: 'URGENT', confidence: 'HIGH',
    title: 'Raise Z7 Amazon retail 3% to absorb take-rate step',
    summary: 'Amazon take-rate stepped up Monday — 2.4pts of margin on SSK Z7 core gloves. Elasticity on Z7 is low.',
    recommendedAction: 'Approve a 3% retail lift on Amazon effective next Monday. Projected GM recovery ~$31K/mo.',
    owner: 'Merch · Ari Chen', impact: '+$31K/mo GM recovery',
    createdAt: '2026-04-22', status: 'pending' },

  { id: 'dec2', subcoId: 'bases-loaded', type: 'sku', urgency: 'THIS WEEK', confidence: 'HIGH',
    title: 'Prune 71 margin bleeders across SSK',
    summary: 'SKUs selling below cost. Every unit sold destroys ~$8–14 of GP. Collectively drained ~$89K of GP in trailing 12M.',
    recommendedAction: 'Approve pause-advertising + delist from Amazon Buy Box for 71 SKUs. Liquidate remaining stock in 30d.',
    owner: 'Ops · Dre Morris', impact: 'Stops $89K annualized GM drag',
    createdAt: '2026-04-21', status: 'pending' },

  { id: 'dec3', subcoId: 'bgl', type: 'sku', urgency: 'THIS WEEK', confidence: 'MEDIUM',
    title: 'Discontinue 19 long-tail BGL lace colorways',
    summary: '19 of 33 colors sell <3 units/mo. ~$72K working capital tied up, with low conversion even on promo.',
    recommendedAction: 'Run 30% clearance for 21 days, then delist. Redirect PO dollars to top-5 colors.',
    owner: 'Merch · Ari Chen', impact: '+$43K cash recovery · +2.6% GM',
    createdAt: '2026-04-21', status: 'pending' },

  { id: 'dec4', subcoId: 'bases-loaded', type: 'collection', urgency: 'URGENT', confidence: 'HIGH',
    title: 'Credit hold on 3 DDW wholesale accounts (>60 days)',
    summary: '$14.6K outstanding >60 days across 3 gift-shop accounts. Finance has escalated; awaiting CEO sign-off on hold.',
    recommendedAction: 'Approve credit hold with reinstatement on payment-in-full. CFO will issue notice.',
    owner: 'CFO · Priya Shah', impact: 'Recovers $14.6K · protects future exposure',
    createdAt: '2026-04-20', status: 'pending' },

  { id: 'dec5', subcoId: 'aas', type: 'vendor', urgency: 'THIS WEEK', confidence: 'MEDIUM',
    title: 'Qualify alternate USA manufacturer for AAS Elite line',
    summary: 'Primary USA vendor is capacity-constrained. Stockout cost is $38K/mo. Alternate source identified.',
    recommendedAction: 'Approve $15K qualification budget for 2-week sample + capacity test with alternate vendor.',
    owner: 'Ops · Dre Morris', impact: 'Unlocks $456K/yr revenue if qualifies',
    createdAt: '2026-04-19', status: 'pending' },

  { id: 'dec6', subcoId: 'ssk', type: 'capital', urgency: 'THIS MONTH', confidence: 'HIGH',
    title: 'Forward-buy 1,200 units of SSK Z9 Maestro from Japan parent',
    summary: 'Z9 is top-decile and trending +18% YoY. Japan parent offers 8% volume discount on PO ≥1,000 units.',
    recommendedAction: 'Approve forward-buy at 15-month cover. Cash outlay ~$180K; GP pickup $14.4K.',
    owner: 'Finance · Priya', impact: '+$14.4K GP · locks in Z9 supply',
    createdAt: '2026-04-18', status: 'pending' },

  { id: 'dec7', subcoId: 'shug0', type: 'sku', urgency: 'THIS MONTH', confidence: 'MEDIUM',
    title: 'Reorder decision — Shug0 Gold Bat Limited Edition',
    summary: 'Full allocation sold in 11 days. Reorder risks diluting scarcity positioning.',
    recommendedAction: 'Hold — do not reorder. Position as "dropped, never coming back" for collector LTV.',
    owner: 'GM · Stroman team', impact: 'Preserves brand equity · redeploy cash to metal cleats',
    createdAt: '2026-04-17', status: 'pending' },
];

// ── Topco roll-ups for the Monday Brief ─────────────────────────────────────
export function getConsolidatedCash(): { cash: number; runway: number; net30: number; arOutstanding: number; apDue: number } {
  const operating = ALL_PORTFOLIO_SUBCOS;
  let cash = 0, net30 = 0, ar = 0, ap = 0, arOver60 = 0;
  for (const s of operating) {
    const c = getCashPosition(s.id);
    cash += c.cashOnHand;
    net30 += c.last30Change;
    ar += c.arOutstanding;
    ap += c.apDueNext30;
    arOver60 += c.arOver60Days;
  }
  // Runway: portfolio cash divided by worst-case monthly burn (assume steady-state OpEx).
  const runway = 11.2; // Use topco figure directly for demo coherence.
  return { cash, runway, net30, arOutstanding: ar, apDue: ap };
}

// ── Helpers ──────────────────────────────────────────────────────────────────
export function fmtMoney(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? '-' : '';
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(0)}K`;
  return `${sign}$${abs.toFixed(0)}`;
}

export function fmtMoneySigned(n: number): string {
  const abs = Math.abs(n);
  const sign = n >= 0 ? '+' : '-';
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(0)}K`;
  return `${sign}$${abs.toFixed(0)}`;
}

export function fmtPct(n: number, digits = 1): string {
  const sign = n > 0 ? '+' : '';
  return `${sign}${(n * 100).toFixed(digits)}%`;
}

export const TONE_COLORS = {
  good:    { fg: '#2DB47A', bg: 'rgba(45,180,122,0.14)', border: 'rgba(45,180,122,0.30)' },
  warn:    { fg: '#F7A500', bg: 'rgba(247,165,0,0.14)',  border: 'rgba(247,165,0,0.30)'  },
  bad:     { fg: '#E06060', bg: 'rgba(224,96,96,0.14)',  border: 'rgba(224,96,96,0.30)'  },
  neutral: { fg: '#A0A8C0', bg: 'rgba(160,168,192,0.10)', border: 'rgba(160,168,192,0.20)' },
};
