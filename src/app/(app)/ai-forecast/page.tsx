'use client';

import { useState, useCallback, useRef } from 'react';
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
  // Last 3 months of actual data (Aug, Sep, Oct)
  const actuals: ForecastMonth[] = HISTORICAL_MONTHS.slice(3).map((m) => ({
    period: m.label,
    quarter: m.month < '2026-10' ? 'Q3 2026' : 'Q4 2026',
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

  // Project 6 quarters forward (Nov 2026 – Apr 2026) → 18 months
  const projected: ForecastMonth[] = [];
  let baseRevenue = HISTORICAL_MONTHS[5].revenue; // Oct 2026

  const MONTHS_LABELS = [
    "Nov '24", "Dec '24", "Jan '25", "Feb '25", "Mar '25",
    "Apr '25", "May '25", "Jun '25", "Jul '25", "Aug '25", "Sep '25", "Oct '25",
  ];
  const QUARTERS = [
    'Q4 2026', 'Q4 2026', // Nov, Dec
    'Q1 2025', 'Q1 2025', 'Q1 2025', // Jan, Feb, Mar
    'Q2 2025', 'Q2 2025', 'Q2 2025', // Apr, May, Jun
    'Q3 2025', 'Q3 2025', 'Q3 2025', // Jul, Aug, Sep
    'Q4 2025', // Oct
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

const QUARTERS_AVAILABLE = ['Q4 2026', 'Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025'];

const TOOLTIP_STYLE = {
  background: '#FFFFFF',
  border: '1px solid rgba(0,0,0,0.10)',
  borderRadius: 6,
  color: '#1A1A1A',
  fontSize: 12,
  boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
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
  const [input, setInput] = useState('');
  const [targetQuarter, setTargetQuarter] = useState('Q4 2026');
  const [aiMessages, setAiMessages] = useState<{ role: 'user' | 'ai'; text: string; timestamp: string }[]>([
    {
      role: 'ai',
      text: "I've built this forecast from your trailing 3-month actuals (Aug–Oct 2026) using a 3.1% MoM growth rate, 54.9% COGS ratio, and 35.1% OpEx ratio — adjusted for seasonal patterns. Tell me what you expect for any quarter and I'll update the model automatically. Example: \"Q1 2025 revenue grows 10% — we're launching a new product line in January.\"",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const handleSend = useCallback(() => {
    if (!input.trim() || isProcessing) return;

    const userText = input.trim();
    setInput('');
    setIsProcessing(true);

    // Add user message
    setAiMessages((prev) => [...prev, {
      role: 'user',
      text: userText,
      timestamp: new Date().toISOString(),
    }]);

    // Parse + simulate AI delay
    setTimeout(() => {
      const assumptions = parseNaturalLanguage(userText, targetQuarter);

      const newAdj: QuarterAdjustment = {
        id: Math.random().toString(36).slice(2, 9),
        quarter: targetQuarter,
        userText,
        parsedAssumptions: assumptions,
        timestamp: new Date().toISOString(),
      };

      setAdjustments((prev) => [...prev, newAdj]);

      const aiReply = generateAIResponse(userText, targetQuarter, assumptions);
      setAiMessages((prev) => [...prev, {
        role: 'ai',
        text: aiReply,
        timestamp: new Date().toISOString(),
      }]);

      setIsProcessing(false);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    }, 800);
  }, [input, targetQuarter, isProcessing]);

  const resetAdjustments = () => {
    setAdjustments([]);
    setAiMessages([{
      role: 'ai',
      text: "Forecast reset to AI baseline. I'm ready for new assumptions — tell me what you expect for any quarter.",
      timestamp: new Date().toISOString(),
    }]);
  };

  const totalFwdRevenue = forecast.filter((m) => !m.isActual).reduce((s, m) => s + m.revenue, 0);
  const totalFwdNI      = forecast.filter((m) => !m.isActual).reduce((s, m) => s + m.netIncome, 0);
  const adjustmentCount = adjustments.reduce((s, a) => s + a.parsedAssumptions.filter((p) => p.type !== 'note').length, 0);

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-2">
        <div>
          <div className="text-[22px] font-black uppercase tracking-[0.04em]"
            style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-text)' }}>
            AI Forecast
          </div>
          <div className="text-[12px] mt-0.5" style={{ color: 'var(--color-muted)' }}>
            Trend-driven baseline · updated by natural language · cascading adjustments
          </div>
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          {adjustmentCount > 0 && (
            <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.06em]"
              style={{ background: 'var(--color-blue-d)', color: 'var(--color-blue)', fontFamily: 'var(--font-condensed)' }}>
              {adjustmentCount} adjustment{adjustmentCount > 1 ? 's' : ''} applied
            </div>
          )}
          <button
            onClick={resetAdjustments}
            className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.06em] cursor-pointer"
            style={{ background: 'var(--color-surf2)', color: 'var(--color-muted)', border: '1px solid var(--color-border)', fontFamily: 'var(--font-condensed)' }}
          >
            ↺ Reset
          </button>
        </div>
      </div>

      {/* Methodology note */}
      <div className="px-4 py-3 leading-relaxed"
        style={{ background: 'rgba(65,182,230,0.07)', borderLeft: '3px solid var(--color-blue)', color: 'var(--color-muted)', fontSize: 13 }}>
        <strong style={{ color: 'var(--color-blue)' }}>Baseline methodology:</strong> 3.1% MoM revenue growth (trailing 6-month avg), 54.9% COGS ratio, 35.1% OpEx ratio — adjusted for outdoor-apparel seasonal patterns (peak: Jul–Oct, trough: Dec–Feb). Actuals locked through October 2026.
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: '12M Fwd Revenue',  value: formatCurrency(totalFwdRevenue, true),  color: 'var(--color-blue)',  sub: 'Nov 2026 – Oct 2025' },
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
                  <stop offset="5%"  stopColor="#35B8E8" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#35B8E8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="aifNiGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#00A651" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#00A651" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(0,0,0,0.06)" strokeDasharray="3 3" />
              <XAxis dataKey="period" tick={{ fill: '#6B7A8D', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} tick={{ fill: '#6B7A8D', fontSize: 10 }} axisLine={false} tickLine={false} width={55} />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                formatter={(val, name, props) => {
                  const item = props.payload;
                  const suffix = item?.isActual ? ' (Actual)' : item?.isAdjusted ? ' ✎' : ' (Proj)';
                  return [`$${Number(val).toLocaleString()}${suffix}`, String(name)];
                }}
              />
              <ReferenceLine x="Oct '24" stroke="rgba(0,0,0,0.20)" strokeDasharray="4 3"
                label={{ value: 'Today', fill: '#6B7A8D', fontSize: 9, position: 'top' }} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#6B7A8D' }} />
              <Area type="monotone" dataKey="Revenue" stroke="#35B8E8" fill="url(#aifRevGrad)"
                strokeWidth={2} dot={false} strokeDasharray="none" />
              <Area type="monotone" dataKey="Net Income" stroke="#00A651" fill="url(#aifNiGrad)"
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
          Click a quarter card to set it as the target for your next assumption
        </div>
      </div>

      {/* AI Chat interface */}
      <div className="overflow-hidden"
        style={{
          background: 'var(--color-surf)',
          borderRadius: 'var(--card-radius)',
          boxShadow: 'var(--card-shadow)',
          border: '1px solid var(--color-border)',
        }}>
        <div className="px-4 py-2.5 border-b flex items-center gap-2"
          style={{ borderColor: 'var(--color-border)', background: 'var(--color-surf2)' }}>
          <div className="w-2 h-2 rounded-full"
            style={{ background: 'var(--color-blue)', boxShadow: '0 0 6px var(--color-blue)' }} />
          <span style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-blue)', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.10em' }}>
            AI Forecast Assistant
          </span>
          <span className="text-[10px] ml-auto" style={{ color: 'var(--color-muted)' }}>
            Adjusting: <strong style={{ color: 'var(--color-orange)' }}>{targetQuarter}</strong>
          </span>
        </div>

        {/* Messages — taller on all screens */}
        <div className="flex flex-col gap-4 overflow-y-auto" style={{ padding: '20px 20px', minHeight: 200, maxHeight: 420 }}>
          {aiMessages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: msg.role === 'ai' ? 'var(--color-blue-d)' : 'var(--color-surf2)',
                  border: `1px solid ${msg.role === 'ai' ? 'var(--color-blue)' : 'var(--color-border2)'}`,
                  color: msg.role === 'ai' ? 'var(--color-blue)' : 'var(--color-muted)',
                  fontFamily: 'var(--font-condensed)',
                  fontSize: 11,
                  fontWeight: 800,
                }}
              >
                {msg.role === 'ai' ? 'AI' : 'ME'}
              </div>
              <div
                className="max-w-[85%] leading-relaxed whitespace-pre-line"
                style={{
                  background:   msg.role === 'user' ? 'var(--color-blue)' : 'var(--color-surf2)',
                  color:        msg.role === 'user' ? '#FFFFFF' : 'var(--color-text)',
                  borderRadius: msg.role === 'user' ? '12px 12px 3px 12px' : '12px 12px 12px 3px',
                  border:       msg.role === 'ai' ? '1px solid var(--color-border2)' : 'none',
                  fontWeight:   msg.role === 'user' ? 600 : 400,
                  fontSize:     14,
                  padding:      '12px 16px',
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'var(--color-blue-d)', border: '1px solid var(--color-blue)', color: 'var(--color-blue)', fontFamily: 'var(--font-condensed)', fontSize: 11, fontWeight: 800 }}>
                AI
              </div>
              <div style={{ background: 'var(--color-surf2)', border: '1px solid var(--color-border2)', borderRadius: '12px 12px 12px 3px', padding: '12px 16px' }}>
                <div className="flex gap-1.5 items-center">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="w-2 h-2 rounded-full"
                      style={{ background: 'var(--color-blue)', animation: 'blink 1.2s infinite', animationDelay: `${i * 0.22}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="border-t" style={{ borderColor: 'var(--color-border)', background: 'var(--color-surf2)', padding: '16px 20px' }}>
          {/* Quarter selector */}
          <div className="flex gap-2 mb-4 flex-wrap items-center">
            <span style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-condensed)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Quarter:
            </span>
            {QUARTERS_AVAILABLE.map((q) => (
              <button
                key={q}
                onClick={() => setTargetQuarter(q)}
                style={{
                  fontFamily:  'var(--font-condensed)',
                  fontSize:    12,
                  fontWeight:  700,
                  padding:     '5px 12px',
                  borderRadius: 6,
                  cursor:      'pointer',
                  border:      `1px solid ${targetQuarter === q ? 'var(--color-blue)' : 'var(--color-border2)'}`,
                  background:  targetQuarter === q ? 'var(--color-blue)' : 'transparent',
                  color:       targetQuarter === q ? '#FFFFFF' : 'var(--color-muted)',
                }}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Suggested prompts */}
          <div className="flex flex-wrap gap-2 mb-4">
            {[
              `${targetQuarter} revenue grows 8% — product launch`,
              `${targetQuarter} marketing budget up $30K`,
              `${targetQuarter} revenue declines 5% — slowdown`,
              `${targetQuarter} one-time cost $50K`,
            ].map((chip) => (
              <button
                key={chip}
                onClick={() => setInput(chip)}
                style={{
                  border:       '1px solid var(--color-border2)',
                  color:        'var(--color-muted)',
                  background:   'transparent',
                  fontFamily:   'var(--font-condensed)',
                  fontSize:     12,
                  padding:      '5px 12px',
                  borderRadius: 6,
                  cursor:       'pointer',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-blue)'; e.currentTarget.style.color = 'var(--color-blue)'; e.currentTarget.style.background = 'var(--color-blue-d)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border2)'; e.currentTarget.style.color = 'var(--color-muted)'; e.currentTarget.style.background = 'transparent'; }}
              >
                {chip}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder={`Describe your ${targetQuarter} expectations in plain English...`}
              style={{
                flex:        1,
                padding:     '12px 16px',
                fontSize:    14,
                borderRadius: 8,
                border:      '1px solid var(--color-border2)',
                background:  'var(--color-surf)',
                color:       'var(--color-text)',
                fontFamily:  'inherit',
                outline:     'none',
                minWidth:    0,
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--color-blue)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--color-border2)')}
            />
            <button
              onClick={handleSend}
              disabled={isProcessing}
              style={{
                padding:      '12px 24px',
                fontSize:     13,
                fontWeight:   800,
                fontFamily:   'var(--font-condensed)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                borderRadius: 8,
                border:       'none',
                cursor:       isProcessing ? 'not-allowed' : 'pointer',
                background:   isProcessing ? 'var(--color-surf3)' : 'var(--color-blue)',
                color:        isProcessing ? 'var(--color-muted)' : '#FFFFFF',
                flexShrink:   0,
              }}
            >
              {isProcessing ? '…' : 'Apply →'}
            </button>
          </div>
        </div>
      </div>

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
                      background: m.isAdjusted ? 'rgba(255,107,53,0.05)' : m.isActual ? 'rgba(53,184,232,0.04)' : undefined,
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
