'use client';

import { useState, useCallback, useEffect } from 'react';
import { getDemoMoM } from '@/lib/data/demo-data';
import { formatCurrency } from '@/lib/utils';
import {
  ComposedChart, Area, Line, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';

// ─── Types ────────────────────────────────────────────────────────────────────

interface QuarterAdjustment {
  id: string;
  quarter: string;            // "Q1 2025"
  userText: string;           // raw input
  parsedAssumptions: ParsedAssumption[];
  timestamp: string;
}

interface ParsedAssumption {
  type: 'revenue_growth' | 'cogs_change' | 'opex_change' | 'headcount' | 'one_time_cost' | 'note';
  label: string;
  value?: number;             // percent or dollar
  unit?: 'percent' | 'currency';
  direction: 'positive' | 'negative' | 'neutral';
}

interface ForecastMonth {
  period: string;     // "Nov '24"
  quarter: string;    // "Q4 2026"
  revenue: number;
  cogs: number;
  grossProfit: number;
  grossMargin: number;
  opex: number;
  netIncome: number;
  netMargin: number;
  isActual: boolean;
  isAdjusted: boolean;
  adjustmentNote?: string;
}

// ─── Market Rates Reference ────────────────────────────────────────────────────
// Monthly fully-loaded cost estimates (salary + benefits + overhead ~1.3x for hires;
// blended day-rate × avg days for consultants). Used when user says "at market rates."

const ROLE_RATES: { keywords: string[]; monthly: number; label: string; isConsultant: boolean }[] = [
  // ── Consultants / contractors (variable, per month) ──
  { keywords: ['marketing consultant', 'marketing agency'], monthly: 8500,  label: 'Marketing Consultant', isConsultant: true },
  { keywords: ['brand consultant', 'brand strategist'],     monthly: 9000,  label: 'Brand Consultant',     isConsultant: true },
  { keywords: ['pr consultant', 'public relations'],        monthly: 6500,  label: 'PR/Comms Consultant',  isConsultant: true },
  { keywords: ['sales consultant', 'sales coach'],          monthly: 8000,  label: 'Sales Consultant',     isConsultant: true },
  { keywords: ['strategy consultant', 'management consultant'], monthly: 14000, label: 'Strategy Consultant', isConsultant: true },
  { keywords: ['fractional cfo', 'finance consultant', 'financial consultant'], monthly: 9500, label: 'Fractional CFO', isConsultant: true },
  { keywords: ['tech consultant', 'technology consultant'], monthly: 12000, label: 'Tech Consultant',      isConsultant: true },
  { keywords: ['engineering consultant', 'software consultant', 'dev consultant'], monthly: 13000, label: 'Engineering Consultant', isConsultant: true },
  { keywords: ['hr consultant', 'people consultant', 'recruiter'], monthly: 7000,  label: 'HR Consultant', isConsultant: true },
  { keywords: ['legal counsel', 'attorney', 'lawyer'],      monthly: 5000,  label: 'Legal Retainer',      isConsultant: true },
  { keywords: ['social media', 'content creator', 'influencer manager'], monthly: 5500, label: 'Social Media Manager', isConsultant: true },
  { keywords: ['seo', 'sem', 'digital marketing agency'],   monthly: 5000,  label: 'Digital Marketing (agency)', isConsultant: true },
  { keywords: ['designer', 'graphic designer', 'creative agency'], monthly: 6500, label: 'Creative/Design', isConsultant: true },
  { keywords: ['contractor', 'freelancer', 'consultant'],   monthly: 8000,  label: 'Contractor (general)', isConsultant: true },

  // ── Full-time hires (fully loaded) ──
  { keywords: ['vp sales', 'vp of sales', 'head of sales'], monthly: 23000, label: 'VP Sales (fully loaded)',      isConsultant: false },
  { keywords: ['vp marketing', 'vp of marketing', 'cmo'],   monthly: 21000, label: 'VP Marketing (fully loaded)', isConsultant: false },
  { keywords: ['vp engineering', 'vp of engineering', 'cto'], monthly: 26000, label: 'VP Engineering (fully loaded)', isConsultant: false },
  { keywords: ['vp finance', 'vp of finance', 'cfo'],        monthly: 24000, label: 'VP Finance (fully loaded)',   isConsultant: false },
  { keywords: ['vp operations', 'vp of ops', 'coo'],         monthly: 22000, label: 'VP Operations (fully loaded)', isConsultant: false },
  { keywords: ['account executive', ' ae ', 'sales rep'],    monthly: 9500,  label: 'Account Executive',          isConsultant: false },
  { keywords: ['sdr', 'bdr', 'sales development rep'],       monthly: 7500,  label: 'SDR/BDR',                    isConsultant: false },
  { keywords: ['software engineer', 'developer', 'engineer'], monthly: 13000, label: 'Software Engineer',         isConsultant: false },
  { keywords: ['product manager', ' pm '],                   monthly: 14500, label: 'Product Manager',            isConsultant: false },
  { keywords: ['data scientist', 'data analyst'],            monthly: 12500, label: 'Data Scientist',             isConsultant: false },
  { keywords: ['marketing manager'],                         monthly: 10500, label: 'Marketing Manager',          isConsultant: false },
  { keywords: ['operations manager', 'ops manager'],         monthly: 10000, label: 'Operations Manager',         isConsultant: false },
  { keywords: ['customer success', 'csm'],                   monthly: 8500,  label: 'Customer Success Manager',   isConsultant: false },
  { keywords: ['office manager', 'admin'],                   monthly: 6500,  label: 'Office/Admin',               isConsultant: false },
];

// Business events with estimated one-time costs
const EVENT_COSTS: { keywords: string[]; cost: number; label: string }[] = [
  { keywords: ['trade show', 'tradeshow'],          cost: 35000, label: 'Trade Show (booth + travel)' },
  { keywords: ['conference', 'summit', 'expo'],     cost: 15000, label: 'Conference sponsorship' },
  { keywords: ['product launch', 'launch event'],   cost: 25000, label: 'Product launch event' },
  { keywords: ['rebrand', 'rebranding'],            cost: 40000, label: 'Rebrand initiative' },
  { keywords: ['office move', 'new office'],        cost: 20000, label: 'Office relocation/setup' },
  { keywords: ['sales kickoff', ' sko'],            cost: 18000, label: 'Sales Kickoff (SKO)' },
  { keywords: ['software renewal', 'license renewal', 'salesforce renewal', 'crm renewal'], cost: 22000, label: 'Software renewal (est.)' },
  { keywords: ['legal fee', 'legal cost', 'ip filing', 'trademark'], cost: 12000, label: 'Legal/IP fees' },
  { keywords: ['audit', 'accounting fee'],          cost: 8000,  label: 'Audit/Accounting fees' },
];

// Revenue signals — wholesale accounts, product lines, campaigns
const REVENUE_SIGNALS: { keywords: string[]; growthPct: number; label: string }[] = [
  { keywords: ['new wholesale', 'wholesale account', 'wholesale partner', 'new retailer', 'new account'],   growthPct: 5,   label: 'New wholesale account' },
  { keywords: ['new product', 'product line', 'new sku', 'new collection'],                                 growthPct: 4,   label: 'New product launch' },
  { keywords: ['email campaign', 'marketing campaign', 'campaign launching'],                                growthPct: 3,   label: 'Marketing campaign' },
  { keywords: ['dtc push', 'direct to consumer', 'dtc focus', 'dtc campaign'],                              growthPct: 4,   label: 'DTC channel push' },
  { keywords: ['amazon', 'marketplace launch'],                                                              growthPct: 6,   label: 'Marketplace expansion' },
  { keywords: ['international', 'export', 'canada', 'europe', 'overseas'],                                  growthPct: 5,   label: 'International expansion' },
  { keywords: ['price increase', 'pricing increase', 'raise prices'],                                       growthPct: 3,   label: 'Price increase' },
  { keywords: ['slow season', 'slow quarter', 'off season', 'lower volume'],                                 growthPct: -4,  label: 'Seasonal slowdown' },
  { keywords: ['churn', 'lost account', 'lost customer', 'customer leaving'],                                growthPct: -5,  label: 'Customer churn' },
];

// ─── NL Parser ────────────────────────────────────────────────────────────────

function parseNaturalLanguage(text: string, targetQuarter: string): ParsedAssumption[] {
  const t = ' ' + text.toLowerCase() + ' '; // pad so word-boundary checks work
  const assumptions: ParsedAssumption[] = [];

  // ── 1. Explicit dollar amounts for OpEx ─────────────────────────────────────
  const dollarMatch = t.match(/\$\s?([\d,]+)\s*(k|m)?/i);
  let explicitDollars: number | null = null;
  if (dollarMatch) {
    explicitDollars = parseFloat(dollarMatch[1].replace(/,/g, ''));
    if (/m/i.test(dollarMatch[2] ?? '')) explicitDollars *= 1_000_000;
    else if (/k/i.test(dollarMatch[2] ?? '')) explicitDollars *= 1_000;
    else if (explicitDollars < 500) explicitDollars *= 1_000; // treat "8.5" as $8,500
  }

  // ── 2. Role / headcount recognition ─────────────────────────────────────────
  let matchedRole: (typeof ROLE_RATES)[0] | null = null;
  for (const role of ROLE_RATES) {
    if (role.keywords.some((kw) => t.includes(kw))) {
      matchedRole = role;
      break;
    }
  }

  if (matchedRole) {
    const monthlyRate = explicitDollars ?? matchedRole.monthly;
    const isRemoving = /reduc|remov|cut|end|cancel|termin|no longer|stop/.test(t);
    const countMatch = t.match(/(\d+)\s*(?:new\s+)?(?:consultant|hire|person|people|headcount|staff|engineers?|managers?|reps?)/);
    const count = countMatch ? parseInt(countMatch[1]) : 1;
    const totalMonthly = monthlyRate * count;
    const marketNote = explicitDollars ? `$${(monthlyRate / 1000).toFixed(1)}K/mo (specified)` : `$${(monthlyRate / 1000).toFixed(1)}K/mo (market rate)`;

    assumptions.push({
      type: 'opex_change',
      label: `${isRemoving ? '–' : '+'} ${count > 1 ? `${count}× ` : ''}${matchedRole.label} — ${marketNote}`,
      value: isRemoving ? -(totalMonthly * 3) : totalMonthly * 3, // × 3 months per quarter
      unit: 'currency',
      direction: isRemoving ? 'positive' : 'negative',
    });

    // If it's a permanent hire (not consultant), add to headcount
    if (!matchedRole.isConsultant && !isRemoving) {
      assumptions.push({
        type: 'headcount',
        label: `+${count} headcount`,
        value: count,
        unit: 'currency',
        direction: 'neutral',
      });
    }
    return assumptions; // role detection takes priority
  }

  // ── 3. Business event patterns (one-time costs) ──────────────────────────────
  for (const evt of EVENT_COSTS) {
    if (evt.keywords.some((kw) => t.includes(kw))) {
      const cost = explicitDollars ?? evt.cost;
      assumptions.push({
        type: 'one_time_cost',
        label: `${evt.label} — $${(cost / 1000).toFixed(0)}K${explicitDollars ? '' : ' (est.)'}`,
        value: cost,
        unit: 'currency',
        direction: 'negative',
      });
    }
  }

  // ── 4. Revenue signals (qualitative business events) ─────────────────────────
  for (const signal of REVENUE_SIGNALS) {
    if (signal.keywords.some((kw) => t.includes(kw))) {
      assumptions.push({
        type: 'revenue_growth',
        label: `${signal.label} → ~${signal.growthPct > 0 ? '+' : ''}${signal.growthPct}% revenue`,
        value: signal.growthPct,
        unit: 'percent',
        direction: signal.growthPct > 0 ? 'positive' : 'negative',
      });
    }
  }

  // ── 5. Explicit percentage patterns ──────────────────────────────────────────
  const revGrowthMatch = t.match(/(?:revenue|sales|top[- ]?line).*?(\d+(?:\.\d+)?)\s*%/);
  if (revGrowthMatch) {
    const val = parseFloat(revGrowthMatch[1]);
    const isDecline = /declin|drop|fall|decreas|slow|down|weak/.test(t);
    assumptions.push({ type: 'revenue_growth', label: `Revenue ${isDecline ? '–' : '+'}${val}%`, value: isDecline ? -val : val, unit: 'percent', direction: isDecline ? 'negative' : 'positive' });
  }

  const growMatch = t.match(/(?:grow|increase|up|higher|rise|strong|boost|expect|project).*?(\d+(?:\.\d+)?)\s*%/);
  if (growMatch && !revGrowthMatch) {
    const val = parseFloat(growMatch[1]);
    assumptions.push({ type: 'revenue_growth', label: `Revenue growth +${val}%`, value: val, unit: 'percent', direction: 'positive' });
  }

  const declineMatch = t.match(/(?:slow|down|fall|declin|drop|lower|weak).*?(\d+(?:\.\d+)?)\s*%/);
  if (declineMatch && !revGrowthMatch) {
    const val = parseFloat(declineMatch[1]);
    assumptions.push({ type: 'revenue_growth', label: `Revenue decline –${val}%`, value: -val, unit: 'percent', direction: 'negative' });
  }

  const cogsMatch = t.match(/(?:cogs?|cost of goods?|material|production).*?(\d+(?:\.\d+)?)\s*%/);
  if (cogsMatch) {
    const val = parseFloat(cogsMatch[1]);
    const up = /increas|up|higher|pressure|rise/.test(t);
    assumptions.push({ type: 'cogs_change', label: `COGS ${up ? '+' : '–'}${val}%`, value: up ? val : -val, unit: 'percent', direction: up ? 'negative' : 'positive' });
  }

  // Explicit dollar OpEx change (no role matched)
  if (explicitDollars && assumptions.length === 0) {
    const isCut = /cut|reduc|save|lower|less|down/.test(t);
    assumptions.push({
      type: 'opex_change',
      label: `OpEx ${isCut ? '–' : '+'}$${(explicitDollars / 1000).toFixed(0)}K`,
      value: isCut ? -explicitDollars : explicitDollars,
      unit: 'currency',
      direction: isCut ? 'positive' : 'negative',
    });
  }

  // ── 6. Headcount (numeric) ───────────────────────────────────────────────────
  const hcMatch = t.match(/(\d+)\s*(?:new\s+)?(?:hire|headcount|head count|people|employee|staff|person)/);
  if (hcMatch && !matchedRole) {
    const val = parseInt(hcMatch[1]);
    const isLayoff = /layoff|let go|cut|reduc|terminat|rif/.test(t);
    assumptions.push({ type: 'headcount', label: `${isLayoff ? 'Remove' : 'Add'} ${val} headcount (~$${(val * 4790 / 1000).toFixed(0)}K/mo)`, value: isLayoff ? -val : val, unit: 'currency', direction: isLayoff ? 'positive' : 'negative' });
  }

  // ── 7. Fallback ───────────────────────────────────────────────────────────────
  if (assumptions.length === 0) {
    const simpleNum = t.match(/(\d+(?:\.\d+)?)\s*(?:percent|%)/);
    if (simpleNum) {
      const val = parseFloat(simpleNum[1]);
      const isNeg = /slow|down|fall|declin|lower|less|weak/.test(t);
      assumptions.push({ type: 'revenue_growth', label: `Revenue ${isNeg ? '–' : '+'}${val}%`, value: isNeg ? -val : val, unit: 'percent', direction: isNeg ? 'negative' : 'positive' });
    } else {
      assumptions.push({ type: 'note', label: text.length > 60 ? text.slice(0, 57) + '…' : text, direction: 'neutral' });
    }
  }

  return assumptions;
}

// ─── Baseline Forecast Builder ────────────────────────────────────────────────

const HISTORICAL_MONTHS = getDemoMoM().months;

function buildBaseForecast(): ForecastMonth[] {
  // Last 3 months of actual data (Feb, Mar, Apr)
  const actuals: ForecastMonth[] = HISTORICAL_MONTHS.slice(3).map((m) => ({
    period: m.label,
    quarter: m.month < '2026-04' ? 'Q1 2026' : 'Q2 2026',
    revenue: m.revenue,
    cogs: m.revenue - m.grossProfit,
    grossProfit: m.grossProfit,
    grossMargin: m.grossMargin,
    opex: m.opex,
    netIncome: m.netIncome,
    netMargin: Math.round((m.netIncome / m.revenue) * 1000) / 10,
    isActual: true,
    isAdjusted: false,
  }));

  // Calculate trailing averages from last 3 actuals
  const lastActuals = HISTORICAL_MONTHS.slice(-3);
  const avgRevenueGrowth = 0.031; // 3.1% MoM from data
  const avgCogsPct = lastActuals.reduce((s, m) => s + (m.revenue - m.grossProfit) / m.revenue, 0) / 3;
  const avgOpexPct = lastActuals.reduce((s, m) => s + m.opex / m.revenue, 0) / 3;

  // Project 6 quarters forward (May 2026 – Apr 2027) → 12 months
  const projected: ForecastMonth[] = [];
  let baseRevenue = HISTORICAL_MONTHS[5].revenue; // Apr 2026

  const MONTHS_LABELS = [
    "May '26", "Jun '26", "Jul '26", "Aug '26", "Sep '26", "Oct '26",
    "Nov '26", "Dec '26", "Jan '27", "Feb '27", "Mar '27", "Apr '27",
  ];
  const QUARTERS = [
    'Q2 2026', 'Q2 2026', // May, Jun
    'Q3 2026', 'Q3 2026', 'Q3 2026', // Jul, Aug, Sep
    'Q4 2026', 'Q4 2026', 'Q4 2026', // Oct, Nov, Dec
    'Q1 2027', 'Q1 2027', 'Q1 2027', // Jan, Feb, Mar
    'Q2 2027', // Apr
  ];

  // Seasonal adjustments (outdoor brand pattern)
  const SEASONAL = [1.02, 0.88, 0.78, 0.82, 0.95, 1.08, 1.12, 1.18, 1.22, 1.15, 1.10, 1.25];

  for (let i = 0; i < 12; i++) {
    baseRevenue = Math.round(baseRevenue * (1 + avgRevenueGrowth) * SEASONAL[i] / (i === 0 ? 1.025 : SEASONAL[i > 0 ? i - 1 : 0]));
    const cogs = Math.round(baseRevenue * avgCogsPct);
    const gp = baseRevenue - cogs;
    const gpPct = Math.round((gp / baseRevenue) * 1000) / 10;
    const opex = Math.round(baseRevenue * avgOpexPct);
    const ni = gp - opex;
    const niPct = Math.round((ni / baseRevenue) * 1000) / 10;

    projected.push({
      period: MONTHS_LABELS[i],
      quarter: QUARTERS[i],
      revenue: baseRevenue,
      cogs,
      grossProfit: gp,
      grossMargin: gpPct,
      opex,
      netIncome: ni,
      netMargin: niPct,
      isActual: false,
      isAdjusted: false,
    });
  }

  return [...actuals, ...projected];
}

// Apply adjustments to forecast
function applyAdjustments(
  base: ForecastMonth[],
  adjustments: QuarterAdjustment[]
): ForecastMonth[] {
  const result = base.map((m) => ({ ...m }));

  for (const adj of adjustments) {
    // Find months in the target quarter (and cascade to future quarters)
    const quarterIdx = result.findIndex((m) => m.quarter === adj.quarter);
    if (quarterIdx === -1) continue;

    // Get months in this quarter
    const quarterMonths = result.filter((m) => m.quarter === adj.quarter);

    for (const assumption of adj.parsedAssumptions) {
      if (assumption.type === 'note') continue;

      // Find future months (same quarter + all after)
      const startIdx = quarterIdx;

      for (let i = startIdx; i < result.length; i++) {
        if (result[i].isActual) continue;

        if (assumption.type === 'revenue_growth' && assumption.value !== undefined) {
          // Apply as a multiplier only to the target quarter months, then cascade at half-rate
          const isTargetQ = result[i].quarter === adj.quarter;
          const rate = isTargetQ ? assumption.value / 100 : (assumption.value / 100) * 0.4;
          const newRev = Math.round(result[i].revenue * (1 + rate));
          const revDiff = newRev - result[i].revenue;
          result[i].revenue = newRev;
          result[i].grossProfit = result[i].grossProfit + Math.round(revDiff * (1 - avgCogsPct));
          result[i].cogs = result[i].revenue - result[i].grossProfit;
          result[i].grossMargin = Math.round((result[i].grossProfit / result[i].revenue) * 1000) / 10;
          result[i].netIncome = result[i].grossProfit - result[i].opex;
          result[i].netMargin = Math.round((result[i].netIncome / result[i].revenue) * 1000) / 10;
          result[i].isAdjusted = true;
          result[i].adjustmentNote = `${adj.quarter}: ${assumption.label}`;
        }

        if (assumption.type === 'opex_change' && assumption.value !== undefined) {
          const isTargetQ = result[i].quarter === adj.quarter;
          if (!isTargetQ) continue; // Only apply to target quarter
          const monthlyImpact = Math.round(assumption.value / (quarterMonths.length || 3));
          result[i].opex += monthlyImpact;
          result[i].netIncome = result[i].grossProfit - result[i].opex;
          result[i].netMargin = Math.round((result[i].netIncome / result[i].revenue) * 1000) / 10;
          result[i].isAdjusted = true;
        }

        if (assumption.type === 'one_time_cost' && assumption.value !== undefined) {
          if (result[i].quarter !== adj.quarter) continue;
          // Hit only first month of quarter
          if (result.filter((m) => m.quarter === adj.quarter && !m.isActual).indexOf(result[i]) === 0) {
            result[i].opex += assumption.value;
            result[i].netIncome = result[i].grossProfit - result[i].opex;
            result[i].netMargin = Math.round((result[i].netIncome / result[i].revenue) * 1000) / 10;
            result[i].isAdjusted = true;
          }
        }
      }
    }
  }

  return result;
}

const avgCogsPct = HISTORICAL_MONTHS.slice(-3).reduce((s, m) => s + (m.revenue - m.grossProfit) / m.revenue, 0) / 3;

const QUARTERS_AVAILABLE = ['Q2 2026', 'Q3 2026', 'Q4 2026', 'Q1 2027', 'Q2 2027'];

const TOOLTIP_STYLE = {
  background: '#1E2236',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: 6,
  color: '#FFFFFF',
  fontSize: 12,
};

// AI response generator for the forecast
function generateAIResponse(text: string, quarter: string, assumptions: ParsedAssumption[]): string {
  const isNote = assumptions.length === 0 || (assumptions.length === 1 && assumptions[0].type === 'note');

  if (isNote) {
    return `I've logged that note for ${quarter}, but couldn't extract a specific financial change to model.\n\nTo update the forecast automatically, try:\n● "We're adding a marketing consultant at market rates" → I'll add ~$8.5K/mo to OpEx\n● "Expecting 6% revenue growth from the new Nordstrom account" → I'll lift revenue 6%\n● "One-time trade show cost of $35K" → I'll hit Q opex with a one-time charge\n\nI can recognize roles, market rates, revenue signals, and business events.`;
  }

  const lines: string[] = [];
  let netImpact = 0;

  for (const a of assumptions) {
    if (a.type === 'note') continue;

    if (a.type === 'opex_change' && a.value !== undefined) {
      const monthly = Math.abs(a.value) / 3;
      const dir = a.value > 0 ? 'increase' : 'decrease';
      lines.push(`● ${a.label}\n  → OpEx ${dir}s by ~$${Math.round(monthly / 1000 * 10) / 10}K/mo across ${quarter}`);
      netImpact -= a.value; // positive opex = negative NI impact
    }

    if (a.type === 'one_time_cost' && a.value !== undefined) {
      lines.push(`● ${a.label}\n  → Hits month 1 of ${quarter} as a non-recurring charge`);
      netImpact -= a.value;
    }

    if (a.type === 'revenue_growth' && a.value !== undefined) {
      const direction = a.value > 0 ? 'lifted' : 'reduced';
      lines.push(`● ${a.label}\n  → Revenue ${direction} ${Math.abs(a.value)}% in ${quarter}, cascades at ~${(Math.abs(a.value) * 0.4).toFixed(1)}% into future quarters`);
      netImpact += a.value * 10000; // rough NI proxy
    }

    if (a.type === 'cogs_change' && a.value !== undefined) {
      const dir = a.value > 0 ? 'pressured' : 'improved';
      lines.push(`● ${a.label}\n  → Gross margin ${dir} by ${Math.abs(a.value)}pp in ${quarter}`);
    }

    if (a.type === 'headcount' && a.value !== undefined) {
      const monthly = Math.abs(a.value) * 4790;
      lines.push(`● ${a.label}\n  → Adds ~$${(monthly / 1000).toFixed(0)}K/mo to payroll (fully loaded at $4.8K/head)`);
    }
  }

  let response = `Got it — ${quarter} forecast updated with ${assumptions.length} assumption${assumptions.length > 1 ? 's' : ''}:\n\n`;
  response += lines.join('\n\n');
  response += `\n\nAll adjustments cascade forward at ~40% weight into subsequent quarters. Layer additional assumptions for any quarter using the input below.`;

  return response;
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function AiForecastPage() {
  const baseForecast = buildBaseForecast();

  const [adjustments, setAdjustments] = useState<QuarterAdjustment[]>([]);
  const [targetQuarter, setTargetQuarter] = useState('Q2 2026');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTable, setShowTable] = useState(false);

  const forecast = applyAdjustments(baseForecast, adjustments);

  // Chart data (all months)
  const chartData = forecast.map((m) => ({
    period: m.period,
    Revenue: m.revenue,
    'Net Income': m.netIncome,
    isActual: m.isActual,
    isAdjusted: m.isAdjusted,
  }));

  // Quarter summary
  const quarterSummary = QUARTERS_AVAILABLE.map((q) => {
    const months = forecast.filter((m) => m.quarter === q && !m.isActual);
    if (months.length === 0) return null;
    const totalRev = months.reduce((s, m) => s + m.revenue, 0);
    const totalNI  = months.reduce((s, m) => s + m.netIncome, 0);
    const avgMargin = months.reduce((s, m) => s + m.netMargin, 0) / months.length;
    const hasAdj   = months.some((m) => m.isAdjusted);
    return { quarter: q, revenue: totalRev, netIncome: totalNI, avgMargin, hasAdj };
  }).filter(Boolean) as { quarter: string; revenue: number; netIncome: number; avgMargin: number; hasAdj: boolean }[];

  // Process an assumption (called from panel event or localStorage)
  const processInput = useCallback((quarter: string, userText: string) => {
    if (!userText.trim() || isProcessing) return;
    setIsProcessing(true);
    setTargetQuarter(quarter);
    setTimeout(() => {
      const assumptions = parseNaturalLanguage(userText, quarter);
      const newAdj: QuarterAdjustment = {
        id: Math.random().toString(36).slice(2, 9),
        quarter,
        userText,
        parsedAssumptions: assumptions,
        timestamp: new Date().toISOString(),
      };
      setAdjustments((prev) => [...prev, newAdj]);
      setIsProcessing(false);
    }, 700);
  }, [isProcessing]);

  const resetAdjustments = () => setAdjustments([]);

  // Listen for inputs from FloatingChat Forecast panel (same page)
  useEffect(() => {
    const handler = (e: Event) => {
      const { quarter, input } = (e as CustomEvent<{ quarter: string; input: string }>).detail;
      processInput(quarter, input);
    };
    window.addEventListener('forecast-panel-input', handler);
    return () => window.removeEventListener('forecast-panel-input', handler);
  }, [processInput]);

  // Pick up pending input from localStorage (panel → navigate here)
  useEffect(() => {
    const pending = localStorage.getItem('eb-forecast-pending');
    if (pending) {
      localStorage.removeItem('eb-forecast-pending');
      try {
        const { quarter, input } = JSON.parse(pending) as { quarter: string; input: string };
        setTimeout(() => processInput(quarter, input), 400);
      } catch { /* ignore malformed */ }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalFwdRevenue = forecast.filter((m) => !m.isActual).reduce((s, m) => s + m.revenue, 0);
  const totalFwdNI      = forecast.filter((m) => !m.isActual).reduce((s, m) => s + m.netIncome, 0);
  const adjustmentCount = adjustments.reduce((s, a) => s + a.parsedAssumptions.filter((p) => p.type !== 'note').length, 0);

  return (
    <div className="flex flex-col gap-5">
      {/* Processing dots animation */}
      <style>{`@keyframes aif-blink { 0%,100%{opacity:1} 50%{opacity:0.15} }`}</style>

      {/* Header — matches app-wide 32px condensed style */}
      <div className="flex items-start justify-between flex-wrap gap-2">
        <div>
          <div className="uppercase tracking-[0.04em]"
            style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-text)', fontSize: 32, fontWeight: 900 }}>
            AI Forecast Builder
          </div>
          <div className="text-[12px] mt-0.5" style={{ color: 'var(--color-muted)' }}>
            Trend-driven baseline · natural-language adjustments · cascading quarters
          </div>
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          {adjustmentCount > 0 && (
            <div className="font-bold uppercase tracking-[0.06em]"
              style={{ background: 'var(--color-blue-d)', color: 'var(--color-blue)', fontFamily: 'var(--font-condensed)', fontSize: 13, padding: '6px 14px' }}>
              {adjustmentCount} adjustment{adjustmentCount > 1 ? 's' : ''} applied
            </div>
          )}
          {adjustmentCount > 0 && (
            <button
              onClick={resetAdjustments}
              className="font-bold uppercase tracking-[0.06em] cursor-pointer"
              style={{ background: 'var(--color-surf2)', color: 'var(--color-muted)', border: '1px solid var(--color-border)', fontFamily: 'var(--font-condensed)', fontSize: 13, padding: '6px 14px' }}
            >
              ↺ Reset
            </button>
          )}
        </div>
      </div>

      {/* Methodology note */}
      <div className="px-4 py-3 leading-relaxed"
        style={{ background: 'rgba(29,68,191,0.07)', borderLeft: '3px solid var(--color-blue)', color: 'var(--color-muted)', fontSize: 13 }}>
        <strong style={{ color: 'var(--color-blue)' }}>Baseline methodology:</strong> 3.1% MoM revenue growth (trailing 6-month avg), 54.9% COGS ratio, 35.1% OpEx ratio — adjusted for outdoor-apparel seasonal patterns (peak: Jul–Oct, trough: Dec–Feb). Actuals locked through April 2026.
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: '12M Fwd Revenue',  value: formatCurrency(totalFwdRevenue, true),  color: 'var(--color-blue)',  sub: 'May 2026 – Apr 2027' },
          { label: '12M Fwd Net Inc.',  value: formatCurrency(totalFwdNI, true),       color: totalFwdNI >= 0 ? 'var(--color-green)' : 'var(--color-red)', sub: 'Projected' },
          { label: 'Avg NI Margin',    value: `${(totalFwdNI / totalFwdRevenue * 100).toFixed(1)}%`, color: 'var(--color-text)', sub: 'Forward 12 months' },
          { label: 'Adjustments',      value: adjustmentCount.toString(),              color: 'var(--color-orange)', sub: adjustmentCount === 0 ? 'AI baseline only' : 'User inputs applied' },
        ].map((c) => (
          <div key={c.label} className="p-4"
            style={{
              background: 'var(--color-surf)',
              borderRadius: 'var(--card-radius)',
              boxShadow: 'var(--card-shadow)',
              border: '1px solid var(--color-border)',
            }}>
            <div className="mb-1.5 uppercase"
              style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-muted)', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em' }}>{c.label}</div>
            <div className="leading-none"
              style={{ fontFamily: 'var(--font-condensed)', color: c.color, fontSize: 36, fontWeight: 900 }}>{c.value}</div>
            <div className="mt-1" style={{ color: 'var(--color-muted)', fontSize: 13 }}>{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Main chart */}
      <div className="overflow-hidden"
        style={{
          background: 'var(--color-surf)',
          borderRadius: 'var(--card-radius)',
          boxShadow: 'var(--card-shadow)',
          border: '1px solid var(--color-border)',
        }}>
        <div className="px-4 py-2.5 border-b flex items-center justify-between"
          style={{ borderColor: 'var(--color-border)', background: 'var(--color-surf2)' }}>
          <span style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-muted)', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.10em' }}>
            Revenue & Net Income — Actuals + AI Forecast
          </span>
          <div className="flex items-center gap-4 text-[10px]" style={{ color: 'var(--color-muted)' }}>
            <span>— Actual &nbsp; - - Projected</span>
            {adjustmentCount > 0 && <span style={{ color: 'var(--color-orange)' }}>◈ Adjusted months</span>}
          </div>
        </div>
        <div className="p-4">
          <ResponsiveContainer width="100%" height={260}>
            <ComposedChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <defs>
                <linearGradient id="aifRevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#1D44BF" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#1D44BF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="aifNiGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#E8B84B" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#E8B84B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
              <XAxis dataKey="period" tick={{ fill: 'rgba(255,255,255,0.50)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} tick={{ fill: 'rgba(255,255,255,0.50)', fontSize: 10 }} axisLine={false} tickLine={false} width={55} />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                formatter={(val, name, props) => {
                  const item = props.payload;
                  const suffix = item?.isActual ? ' (Actual)' : item?.isAdjusted ? ' ✎' : ' (Proj)';
                  return [`$${Number(val).toLocaleString()}${suffix}`, String(name)];
                }}
              />
              <ReferenceLine x="Apr '26" stroke="rgba(255,255,255,0.20)" strokeDasharray="4 3"
                label={{ value: 'Today', fill: 'rgba(255,255,255,0.50)', fontSize: 9, position: 'top' }} />
              <Legend wrapperStyle={{ fontSize: 11, color: 'rgba(255,255,255,0.50)' }} />
              <Area type="monotone" dataKey="Revenue" stroke="#1D44BF" fill="url(#aifRevGrad)"
                strokeWidth={2} dot={false} strokeDasharray="none" />
              <Area type="monotone" dataKey="Net Income" stroke="#E8B84B" fill="url(#aifNiGrad)"
                strokeWidth={2} dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quarter summary cards */}
      <div>
        <div className="mb-3" style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.10em', color: 'var(--color-muted)', fontFamily: 'var(--font-condensed)' }}>
          Quarterly Summary — Forward Periods
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quarterSummary.map((q) => (
            <div key={q.quarter}
              className="p-3.5 cursor-pointer"
              style={{
                background: 'var(--color-surf)',
                borderRadius: 'var(--card-radius)',
                boxShadow: 'var(--card-shadow)',
                border: `1px solid ${q.hasAdj ? 'var(--color-orange)' : 'var(--color-border)'}`,
              }}
              onClick={() => setTargetQuarter(q.quarter)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="uppercase"
                  style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-muted)', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em' }}>
                  {q.quarter}
                </span>
                {q.hasAdj && (
                  <span className="px-1.5 py-0.5"
                    style={{ background: 'var(--color-orange-d)', color: 'var(--color-orange)', fontFamily: 'var(--font-condensed)', fontSize: 9, fontWeight: 700 }}>
                    ADJ
                  </span>
                )}
                {targetQuarter === q.quarter && (
                  <span className="px-1.5 py-0.5"
                    style={{ background: 'var(--color-blue-d)', color: 'var(--color-blue)', fontFamily: 'var(--font-condensed)', fontSize: 9, fontWeight: 700 }}>
                    SELECTED
                  </span>
                )}
              </div>
              <div className="leading-none"
                style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-blue)', fontSize: 28, fontWeight: 900 }}>
                {formatCurrency(q.revenue, true)}
              </div>
              <div className="mt-0.5" style={{ color: 'var(--color-muted)', fontSize: 11 }}>Revenue</div>
              <div className="mt-2"
                style={{ fontFamily: 'var(--font-condensed)', color: q.netIncome >= 0 ? 'var(--color-green)' : 'var(--color-red)', fontSize: 16, fontWeight: 900 }}>
                {formatCurrency(q.netIncome, true)} NI
              </div>
              <div className="mt-0.5" style={{ color: 'var(--color-muted)', fontSize: 10 }}>
                {q.avgMargin.toFixed(1)}% margin
              </div>
            </div>
          ))}
        </div>
        <div className="text-[10px] mt-2" style={{ color: 'var(--color-muted)' }}>
          Click a quarter to select it · Add assumptions via <strong>AI CFO → Forecast</strong> tab (bottom-right)
        </div>
      </div>

      {/* Processing indicator — only visible while applying an assumption */}
      {isProcessing && (
        <div className="px-4 py-3 flex items-center gap-2.5"
          style={{ background: 'rgba(29,68,191,0.06)', borderLeft: '3px solid var(--color-blue)' }}>
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className="w-1.5 h-1.5 rounded-full"
                style={{ background: 'var(--color-blue)', animation: 'aif-blink 1.2s infinite', animationDelay: `${i * 0.22}s` }} />
            ))}
          </div>
          <span style={{ color: 'var(--color-blue)', fontSize: 13, fontWeight: 600 }}>
            Applying assumption to {targetQuarter}…
          </span>
        </div>
      )}

      {/* Adjustment audit trail */}
      {adjustments.length > 0 && (
        <div
          style={{
            background: 'var(--color-surf)',
            borderRadius: 'var(--card-radius)',
            boxShadow: 'var(--card-shadow)',
            border: '1px solid var(--color-border)',
          }}>
          <div className="px-4 py-2.5 border-b"
            style={{ borderColor: 'var(--color-border)', background: 'var(--color-surf2)' }}>
            <span style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-muted)', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.10em' }}>
              Assumption Audit Trail
            </span>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
            {adjustments.map((adj, idx) => (
              <div key={adj.id} className="px-4 py-3 flex gap-3 items-start">
                <span className="text-[10px] font-bold w-[72px] flex-shrink-0 mt-0.5"
                  style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-blue)' }}>
                  {adj.quarter}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] mb-1" style={{ color: 'var(--color-muted)' }}>
                    &ldquo;{adj.userText}&rdquo;
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {adj.parsedAssumptions.map((a, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 font-bold"
                        style={{
                          fontFamily: 'var(--font-condensed)',
                          background: a.direction === 'positive' ? 'var(--color-green-d)' : a.direction === 'negative' ? 'var(--color-red-d)' : 'var(--color-blue-d)',
                          color: a.direction === 'positive' ? 'var(--color-green)' : a.direction === 'negative' ? 'var(--color-red)' : 'var(--color-muted)',
                        }}>
                        {a.label}
                      </span>
                    ))}
                  </div>
                  {/* Net Impact summary */}
                  {adj.parsedAssumptions.filter((a) => a.type !== 'note').map((a, i) => {
                    if (a.type === 'opex_change' && a.value !== undefined) {
                      const monthly = Math.round(Math.abs(a.value) / 3 / 1000 * 10) / 10;
                      const niImpact = Math.round(Math.abs(a.value) / 3 / 1000 * 10) / 10;
                      const isUp = a.value > 0;
                      return (
                        <div key={i} className="text-[10px] mt-1.5 px-2 py-0.5 font-bold inline-block"
                          style={{ fontFamily: 'var(--font-condensed)', background: 'var(--color-red-d)', color: 'var(--color-red)', borderRadius: 4 }}>
                          OpEx {isUp ? '+' : '–'}${monthly}K/mo · NI {isUp ? '–' : '+'}${niImpact}K this quarter
                        </div>
                      );
                    }
                    if (a.type === 'revenue_growth' && a.value !== undefined) {
                      const estNI = Math.round(Math.abs(a.value) * 1300 / 1000 * 10) / 10;
                      const isPos = a.value > 0;
                      return (
                        <div key={i} className="text-[10px] mt-1.5 px-2 py-0.5 font-bold inline-block"
                          style={{ fontFamily: 'var(--font-condensed)', background: isPos ? 'var(--color-green-d)' : 'var(--color-red-d)', color: isPos ? 'var(--color-green)' : 'var(--color-red)', borderRadius: 4 }}>
                          Revenue {isPos ? '+' : ''}{a.value}% → est. {isPos ? '+' : '–'}${estNI}K NI
                        </div>
                      );
                    }
                    if (a.type === 'one_time_cost' && a.value !== undefined) {
                      const amtK = Math.round(a.value / 1000 * 10) / 10;
                      return (
                        <div key={i} className="text-[10px] mt-1.5 px-2 py-0.5 font-bold inline-block"
                          style={{ fontFamily: 'var(--font-condensed)', background: 'var(--color-red-d)', color: 'var(--color-red)', borderRadius: 4 }}>
                          One-time charge: –${amtK}K
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
                <button
                  onClick={() => setAdjustments((prev) => prev.filter((_, i) => i !== idx))}
                  className="text-[11px] flex-shrink-0 cursor-pointer px-1.5 py-0.5"
                  style={{ color: 'var(--color-muted)', background: 'none', border: '1px solid var(--color-border)', fontFamily: 'inherit' }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Monthly detail table toggle */}
      <button
        onClick={() => setShowTable((t) => !t)}
        className="text-[11px] font-bold uppercase tracking-[0.06em] cursor-pointer px-3 py-2 w-full text-center"
        style={{
          background: 'var(--color-surf2)',
          border: '1px solid var(--color-border)',
          color: 'var(--color-muted)',
          fontFamily: 'var(--font-condensed)',
        }}
      >
        {showTable ? '↑ Hide' : '↓ Show'} Monthly Detail Table
      </button>

      {showTable && (
        <div className="overflow-hidden"
          style={{
            background: 'var(--color-surf)',
            borderRadius: 'var(--card-radius)',
            boxShadow: 'var(--card-shadow)',
            border: '1px solid var(--color-border)',
          }}>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[680px]">
              <thead>
                <tr>
                  {['Period', 'Quarter', 'Revenue', 'Gross Profit', 'Gross Margin', 'OpEx', 'Net Income', 'NI Margin'].map((h, i) => (
                    <th key={h}
                      className="px-3 border-b"
                      style={{
                        paddingTop: 10,
                        paddingBottom: 10,
                        textAlign: i < 2 ? 'left' : 'right',
                        fontFamily: 'var(--font-condensed)',
                        color: 'var(--color-muted)',
                        borderColor: 'var(--color-border)',
                        background: 'var(--color-surf2)',
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                      }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {forecast.map((m) => (
                  <tr key={m.period}
                    style={{
                      borderBottom: '1px solid var(--color-border)',
                      opacity: m.isActual ? 1 : 0.8,
                      background: m.isAdjusted ? 'rgba(194,122,16,0.05)' : m.isActual ? 'rgba(29,68,191,0.04)' : undefined,
                    }}>
                    <td className="px-3 py-3 font-semibold" style={{ fontFamily: 'var(--font-condensed)', fontSize: 14 }}>
                      {m.period}
                      {m.isActual && <span className="ml-1 text-[8px] px-1 py-0.5" style={{ background: 'var(--color-blue-d)', color: 'var(--color-blue)' }}>ACT</span>}
                      {m.isAdjusted && <span className="ml-1 text-[8px] px-1 py-0.5" style={{ background: 'var(--color-orange-d)', color: 'var(--color-orange)' }}>ADJ</span>}
                    </td>
                    <td className="px-3 py-3" style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-condensed)', fontSize: 14 }}>{m.quarter}</td>
                    <td className="px-3 py-3 text-right" style={{ fontFamily: 'var(--font-condensed)', fontSize: 14, fontWeight: 700 }}>{formatCurrency(m.revenue)}</td>
                    <td className="px-3 py-3 text-right" style={{ fontFamily: 'var(--font-condensed)', fontSize: 14, fontWeight: 700 }}>{formatCurrency(m.grossProfit)}</td>
                    <td className="px-3 py-3 text-right" style={{ color: m.grossMargin >= 45 ? 'var(--color-green)' : 'var(--color-text)', fontFamily: 'var(--font-condensed)', fontSize: 14, fontWeight: 700 }}>
                      {m.grossMargin.toFixed(1)}%
                    </td>
                    <td className="px-3 py-3 text-right" style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-condensed)', fontSize: 14, fontWeight: 700 }}>{formatCurrency(m.opex)}</td>
                    <td className="px-3 py-3 text-right" style={{ fontFamily: 'var(--font-condensed)', fontSize: 14, fontWeight: 700, color: m.netIncome >= 0 ? 'var(--color-green)' : 'var(--color-red)' }}>
                      {formatCurrency(m.netIncome)}
                    </td>
                    <td className="px-3 py-3 text-right" style={{ fontFamily: 'var(--font-condensed)', fontSize: 14, fontWeight: 700, color: m.netMargin >= 8 ? 'var(--color-green)' : m.netMargin >= 4 ? 'var(--color-orange)' : 'var(--color-red)' }}>
                      {m.netMargin.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
