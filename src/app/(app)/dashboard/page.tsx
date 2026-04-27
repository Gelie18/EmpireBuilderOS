'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSubco } from '@/contexts/SubcoContext';
import { useDecisions } from '@/contexts/DecisionsContext';
import { getDemoActionItems, getDemoMoM, getDemoAnomalies } from '@/lib/data/demo-data';
import AnomalyBanner from '@/components/dashboard/AnomalyBanner';
import { type PeriodKey } from '@/components/ui/PeriodSelector';
import { getSkuBundle, type Sku } from '@/lib/sku-data';
import { ALL_PORTFOLIO_SUBCOS } from '@/lib/subcos';
import {
  getCashPosition,
  getPlanActual,
  getWeeklyDeltas,
  getAlerts,
  fmtMoneySigned,
  fmtPct,
  TONE_COLORS,
} from '@/lib/ceo-intel';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

// ─── Demo data ────────────────────────────────────────────────────────────────
const actions   = getDemoActionItems();
const mom       = getDemoMoM();
const anomalies = getDemoAnomalies();

const highPriorityActions = actions.filter((a) => a.priority === 'high');

// ─── Style constants ──────────────────────────────────────────────────────────
const CARD: React.CSSProperties = {
  background:   'var(--color-surf)',
  borderRadius: 'var(--card-radius)',
  boxShadow:    'var(--card-shadow)',
  border:       '1px solid var(--color-border)',
};

const TOOLTIP_STYLE = {
  background:   '#1E2236',
  border:       '1px solid rgba(255,255,255,0.10)',
  borderRadius: 8,
  color:        '#FFFFFF',
  fontSize:     12,
  boxShadow:    '0 1px 4px rgba(0,0,0,0.30), 0 4px 16px rgba(0,0,0,0.25)',
};

const DISPLAY_FONT = 'Aeonik, Inter, "DM Sans", system-ui, sans-serif';

const TODAY = 'Wednesday, April 22, 2026';
// Dynamic "since …" label based on day of week. Monday = "over the weekend",
// Tue–Fri = "in the last 24 hours".
const DAY_OF_WEEK = TODAY.split(',')[0];
const CHANGE_WINDOW_LABEL = DAY_OF_WEEK === 'Monday' ? 'over the weekend' : 'in the last 24 hours';

// ─── Period model ─────────────────────────────────────────────────────────────
type Period = 'today' | 'mtd' | 'l3m' | 'ytd' | 'l12m';

const PERIOD_OPTIONS: { key: Period; label: string; multiplier: number }[] = [
  { key: 'today', label: 'Today',  multiplier: 22 / 30 },   // Apr 22 of 30 days
  { key: 'mtd',   label: 'MTD',    multiplier: 1 },
  { key: 'l3m',   label: 'L3M',    multiplier: 3 },
  { key: 'ytd',   label: 'YTD',    multiplier: 4 },         // Jan–Apr
  { key: 'l12m',  label: 'L12M',   multiplier: 12 },
];

// Maps the unified brief-style Period onto the KPI-card SUBCO_PERIOD_DATA keys.
const PERIOD_TO_KPI_KEY: Record<Period, PeriodKey> = {
  today: 'current',
  mtd:   'current',
  l3m:   'last3',
  ytd:   'ytd',
  l12m:  'last12',
};

// ─── Per-portco 6-month trend (Nov 25 → Apr 26) ──────────────────────────────
const DEFAULT_TREND = mom.months.map((m) => ({
  month:        m.label,
  Revenue:      m.revenue,
  'Net Income': m.netIncome,
}));

const SUBCO_TREND: Record<string, Array<{ month: string; Revenue: number; 'Net Income': number }>> = {
  'consolidated': [
    { month: 'Nov', Revenue: 1720000, 'Net Income': 138000 },
    { month: 'Dec', Revenue: 1890000, 'Net Income': 162000 },
    { month: 'Jan', Revenue: 1650000, 'Net Income': 121000 },
    { month: 'Feb', Revenue: 1780000, 'Net Income': 145000 },
    { month: 'Mar', Revenue: 1820000, 'Net Income': 151000 },
    { month: 'Apr', Revenue: 1874000, 'Net Income': 157000 },
  ],
  'bases-loaded': [
    { month: 'Nov', Revenue: 1720000, 'Net Income': 138000 },
    { month: 'Dec', Revenue: 1890000, 'Net Income': 162000 },
    { month: 'Jan', Revenue: 1650000, 'Net Income': 121000 },
    { month: 'Feb', Revenue: 1780000, 'Net Income': 145000 },
    { month: 'Mar', Revenue: 1820000, 'Net Income': 151000 },
    { month: 'Apr', Revenue: 1874000, 'Net Income': 157000 },
  ],
  'ssk': DEFAULT_TREND,
  'bgl': [
    { month: 'Nov', Revenue: 402000, 'Net Income': 58000 },
    { month: 'Dec', Revenue: 428000, 'Net Income': 62000 },
    { month: 'Jan', Revenue: 381000, 'Net Income': 53000 },
    { month: 'Feb', Revenue: 418000, 'Net Income': 60000 },
    { month: 'Mar', Revenue: 433000, 'Net Income': 64000 },
    { month: 'Apr', Revenue: 441200, 'Net Income': 67800 },
  ],
  'ddw': [
    { month: 'Nov', Revenue: 71000, 'Net Income': 9200 },
    { month: 'Dec', Revenue: 96000, 'Net Income': 14800 },
    { month: 'Jan', Revenue: 54000, 'Net Income': 6100 },
    { month: 'Feb', Revenue: 61000, 'Net Income': 7400 },
    { month: 'Mar', Revenue: 63000, 'Net Income': 8100 },
    { month: 'Apr', Revenue: 64800, 'Net Income': 9800 },
  ],
  'aas': [
    { month: 'Nov', Revenue: 34000, 'Net Income': 3800 },
    { month: 'Dec', Revenue: 38000, 'Net Income': 4200 },
    { month: 'Jan', Revenue: 36000, 'Net Income': 4000 },
    { month: 'Feb', Revenue: 39000, 'Net Income': 4600 },
    { month: 'Mar', Revenue: 40000, 'Net Income': 4900 },
    { month: 'Apr', Revenue: 39200, 'Net Income': 4400 },
  ],
  'shug0': [
    { month: 'Nov', Revenue: 88000, 'Net Income': 7100 },
    { month: 'Dec', Revenue: 104000, 'Net Income': 9400 },
    { month: 'Jan', Revenue: 92000, 'Net Income': 7600 },
    { month: 'Feb', Revenue: 96000, 'Net Income': 8200 },
    { month: 'Mar', Revenue: 99000, 'Net Income': 8700 },
    { month: 'Apr', Revenue: 97400, 'Net Income': 8400 },
  ],
};

// ─── Per-portco period KPI data ────────────────────────────────────────────────
type PortcoPeriodRow = {
  revenue: string; revSub: string; revDelta: string; revDeltaColor: string; revDeltaBg: string;
  expenses: string; expSub: string; expDelta: string; expDeltaColor: string; expDeltaBg: string;
  netIncome: string; niSub: string; niDelta: string; niDeltaColor: string; niDeltaBg: string;
  cashBalance: string; cashSub: string; cashDelta: string; cashDeltaColor: string; cashDeltaBg: string;
};
type PortcoPeriods = Record<PeriodKey, PortcoPeriodRow>;
const G = '#0A8A5C'; const GB = 'rgba(10,138,92,0.10)';
const R = '#C13333'; const RB = 'rgba(193,51,51,0.10)';

const SUBCO_PERIOD_DATA: Record<string, PortcoPeriods> = {
  'ssk': {
    current: { revenue:'$1.31M',revSub:'vs $1.27M budget',revDelta:'+3.3% vs plan',revDeltaColor:G,revDeltaBg:GB, expenses:'$1.24M',expSub:'COGS + OpEx',expDelta:'+11.7% vs Mar',expDeltaColor:R,expDeltaBg:RB, netIncome:'$71.4K',niSub:'vs $109.2K budget',niDelta:'–34.6% vs plan',niDeltaColor:R,niDeltaBg:RB, cashBalance:'$873.5K',cashSub:'~8.2 months runway',cashDelta:'+2.6% vs Mar',cashDeltaColor:G,cashDeltaBg:GB },
    last:    { revenue:'$1.27M',revSub:'vs $1.25M budget',revDelta:'+1.8% vs plan',revDeltaColor:G,revDeltaBg:GB, expenses:'$1.10M',expSub:'COGS + OpEx',expDelta:'+2.1% vs Feb',expDeltaColor:R,expDeltaBg:RB, netIncome:'$108.4K',niSub:'vs $105K budget',niDelta:'+3.2% vs plan',niDeltaColor:G,niDeltaBg:GB, cashBalance:'$851.0K',cashSub:'~8.0 months runway',cashDelta:'+0.5% vs Feb',cashDeltaColor:G,cashDeltaBg:GB },
    last3:   { revenue:'$3.82M',revSub:'Feb–Apr 2026 total',revDelta:'+3.8% avg growth',revDeltaColor:G,revDeltaBg:GB, expenses:'$3.39M',expSub:'COGS + OpEx combined',expDelta:'+5.1% vs prior 3M',expDeltaColor:R,expDeltaBg:RB, netIncome:'$247.3K',niSub:'3-month total NI',niDelta:'–8.4% vs prior 3M',niDeltaColor:R,niDeltaBg:RB, cashBalance:'$873.5K',cashSub:'End of period cash',cashDelta:'+4.6% over 3M',cashDeltaColor:G,cashDeltaBg:GB },
    ytd:     { revenue:'$12.85M',revSub:'Jan–Apr 2026 total',revDelta:'+18.4% YoY',revDeltaColor:G,revDeltaBg:GB, expenses:'$11.32M',expSub:'YTD COGS + OpEx',expDelta:'+19.1% YoY',expDeltaColor:R,expDeltaBg:RB, netIncome:'$847.2K',niSub:'YTD net income',niDelta:'+6.2% YoY',niDeltaColor:G,niDeltaBg:GB, cashBalance:'$873.5K',cashSub:'Current cash on hand',cashDelta:'+4.6% vs Jan',cashDeltaColor:G,cashDeltaBg:GB },
    last12:  { revenue:'$15.64M',revSub:'Trailing 12-month total',revDelta:'+18.4% vs prior 12M',revDeltaColor:G,revDeltaBg:GB, expenses:'$13.72M',expSub:'COGS + OpEx TTM',expDelta:'+17.2% vs prior 12M',expDeltaColor:R,expDeltaBg:RB, netIncome:'$1.12M',niSub:'Trailing 12-month NI',niDelta:'+8.7% vs prior 12M',niDeltaColor:G,niDeltaBg:GB, cashBalance:'$873.5K',cashSub:'Current cash on hand',cashDelta:'+4.6% since May 2025',cashDeltaColor:G,cashDeltaBg:GB },
  },
  'bgl': {
    current: { revenue:'$441.2K',revSub:'vs $428K budget',revDelta:'+3.1% vs plan',revDeltaColor:G,revDeltaBg:GB, expenses:'$373.4K',expSub:'COGS + OpEx',expDelta:'+2.8% vs Mar',expDeltaColor:R,expDeltaBg:RB, netIncome:'$67.8K',niSub:'vs $64K budget',niDelta:'+5.9% vs plan',niDeltaColor:G,niDeltaBg:GB, cashBalance:'$341.0K',cashSub:'~8.9 months runway',cashDelta:'+1.4% vs Mar',cashDeltaColor:G,cashDeltaBg:GB },
    last:    { revenue:'$418.0K',revSub:'vs $410K budget',revDelta:'+2.0% vs plan',revDeltaColor:G,revDeltaBg:GB, expenses:'$354.0K',expSub:'COGS + OpEx',expDelta:'+1.2% vs Feb',expDeltaColor:R,expDeltaBg:RB, netIncome:'$64.0K',niSub:'vs $61K budget',niDelta:'+4.9% vs plan',niDeltaColor:G,niDeltaBg:GB, cashBalance:'$335.0K',cashSub:'~8.5 months runway',cashDelta:'+0.8% vs Feb',cashDeltaColor:G,cashDeltaBg:GB },
    last3:   { revenue:'$1.29M',revSub:'Feb–Apr 2026 total',revDelta:'+3.6% avg growth',revDeltaColor:G,revDeltaBg:GB, expenses:'$1.08M',expSub:'COGS + OpEx combined',expDelta:'+2.1% vs prior 3M',expDeltaColor:R,expDeltaBg:RB, netIncome:'$191.8K',niSub:'3-month total NI',niDelta:'+6.2% vs prior 3M',niDeltaColor:G,niDeltaBg:GB, cashBalance:'$341.0K',cashSub:'End of period cash',cashDelta:'+3.1% over 3M',cashDeltaColor:G,cashDeltaBg:GB },
    ytd:     { revenue:'$1.68M',revSub:'Jan–Apr 2026 total',revDelta:'+14.2% YoY',revDeltaColor:G,revDeltaBg:GB, expenses:'$1.40M',expSub:'YTD COGS + OpEx',expDelta:'+12.8% YoY',expDeltaColor:R,expDeltaBg:RB, netIncome:'$245.6K',niSub:'YTD net income',niDelta:'+18.4% YoY',niDeltaColor:G,niDeltaBg:GB, cashBalance:'$341.0K',cashSub:'Current cash on hand',cashDelta:'+6.2% vs Jan',cashDeltaColor:G,cashDeltaBg:GB },
    last12:  { revenue:'$5.5M',revSub:'Trailing 12-month total',revDelta:'+14.2% vs prior 12M',revDeltaColor:G,revDeltaBg:GB, expenses:'$4.58M',expSub:'COGS + OpEx TTM',expDelta:'+12.1% vs prior 12M',expDeltaColor:R,expDeltaBg:RB, netIncome:'$779K',niSub:'Trailing 12-month NI',niDelta:'+21.4% vs prior 12M',niDeltaColor:G,niDeltaBg:GB, cashBalance:'$341.0K',cashSub:'Current cash on hand',cashDelta:'+6.2% since May 2025',cashDeltaColor:G,cashDeltaBg:GB },
  },
  'ddw': {
    current: { revenue:'$64.8K',revSub:'vs $62K budget',revDelta:'+4.5% vs plan',revDeltaColor:G,revDeltaBg:GB, expenses:'$55.0K',expSub:'COGS + OpEx',expDelta:'+8.2% vs Mar',expDeltaColor:R,expDeltaBg:RB, netIncome:'$9.8K',niSub:'vs $11.2K budget',niDelta:'–12.5% vs plan',niDeltaColor:R,niDeltaBg:RB, cashBalance:'$94.0K',cashSub:'~1.7 months runway',cashDelta:'–3.1% vs Mar',cashDeltaColor:R,cashDeltaBg:RB },
    last:    { revenue:'$63.0K',revSub:'vs $60K budget',revDelta:'+5.0% vs plan',revDeltaColor:G,revDeltaBg:GB, expenses:'$50.8K',expSub:'COGS + OpEx',expDelta:'+2.4% vs Feb',expDeltaColor:R,expDeltaBg:RB, netIncome:'$12.2K',niSub:'vs $11.8K budget',niDelta:'+3.4% vs plan',niDeltaColor:G,niDeltaBg:GB, cashBalance:'$97.0K',cashSub:'~1.9 months runway',cashDelta:'+1.2% vs Feb',cashDeltaColor:G,cashDeltaBg:GB },
    last3:   { revenue:'$188.8K',revSub:'Feb–Apr 2026 total',revDelta:'+5.8% avg growth',revDeltaColor:G,revDeltaBg:GB, expenses:'$161.8K',expSub:'COGS + OpEx combined',expDelta:'+4.2% vs prior 3M',expDeltaColor:R,expDeltaBg:RB, netIncome:'$27.0K',niSub:'3-month total NI',niDelta:'–2.1% vs prior 3M',niDeltaColor:R,niDeltaBg:RB, cashBalance:'$94.0K',cashSub:'End of period cash',cashDelta:'+1.8% over 3M',cashDeltaColor:G,cashDeltaBg:GB },
    ytd:     { revenue:'$222.8K',revSub:'Jan–Apr 2026 total',revDelta:'+8.4% YoY',revDeltaColor:G,revDeltaBg:GB, expenses:'$190.8K',expSub:'YTD COGS + OpEx',expDelta:'+9.1% YoY',expDeltaColor:R,expDeltaBg:RB, netIncome:'$32.0K',niSub:'YTD net income',niDelta:'+4.2% YoY',niDeltaColor:G,niDeltaBg:GB, cashBalance:'$94.0K',cashSub:'Current cash on hand',cashDelta:'+2.4% vs Jan',cashDeltaColor:G,cashDeltaBg:GB },
    last12:  { revenue:'$800K',revSub:'Trailing 12-month total',revDelta:'+8.4% vs prior 12M',revDeltaColor:G,revDeltaBg:GB, expenses:'$685K',expSub:'COGS + OpEx TTM',expDelta:'+7.2% vs prior 12M',expDeltaColor:R,expDeltaBg:RB, netIncome:'$115K',niSub:'Trailing 12-month NI',niDelta:'+12.4% vs prior 12M',niDeltaColor:G,niDeltaBg:GB, cashBalance:'$94.0K',cashSub:'Current cash on hand',cashDelta:'+2.4% since May 2025',cashDeltaColor:G,cashDeltaBg:GB },
  },
  'aas': {
    current: { revenue:'$39.2K',revSub:'vs $41K budget',revDelta:'–4.4% vs plan',revDeltaColor:R,revDeltaBg:RB, expenses:'$34.8K',expSub:'COGS + OpEx',expDelta:'+1.8% vs Mar',expDeltaColor:R,expDeltaBg:RB, netIncome:'$4.4K',niSub:'vs $6.8K budget',niDelta:'–35.3% vs plan',niDeltaColor:R,niDeltaBg:RB, cashBalance:'$62.0K',cashSub:'~1.8 months runway',cashDelta:'–2.4% vs Mar',cashDeltaColor:R,cashDeltaBg:RB },
    last:    { revenue:'$40.0K',revSub:'vs $40K budget',revDelta:'+0.0% on plan',revDeltaColor:G,revDeltaBg:GB, expenses:'$34.2K',expSub:'COGS + OpEx',expDelta:'+0.6% vs Feb',expDeltaColor:R,expDeltaBg:RB, netIncome:'$5.8K',niSub:'vs $5.8K budget',niDelta:'0.0% on plan',niDeltaColor:G,niDeltaBg:GB, cashBalance:'$63.5K',cashSub:'~1.8 months runway',cashDelta:'+0.4% vs Feb',cashDeltaColor:G,cashDeltaBg:GB },
    last3:   { revenue:'$118.2K',revSub:'Feb–Apr 2026 total',revDelta:'–1.6% avg decline',revDeltaColor:R,revDeltaBg:RB, expenses:'$103.0K',expSub:'COGS + OpEx combined',expDelta:'+1.2% vs prior 3M',expDeltaColor:R,expDeltaBg:RB, netIncome:'$15.2K',niSub:'3-month total NI',niDelta:'–18.3% vs prior 3M',niDeltaColor:R,niDeltaBg:RB, cashBalance:'$62.0K',cashSub:'End of period cash',cashDelta:'–1.6% over 3M',cashDeltaColor:R,cashDeltaBg:RB },
    ytd:     { revenue:'$154.2K',revSub:'Jan–Apr 2026 total',revDelta:'+2.4% YoY',revDeltaColor:G,revDeltaBg:GB, expenses:'$134.0K',expSub:'YTD COGS + OpEx',expDelta:'+4.8% YoY',expDeltaColor:R,expDeltaBg:RB, netIncome:'$20.2K',niSub:'YTD net income',niDelta:'–8.6% YoY',niDeltaColor:R,niDeltaBg:RB, cashBalance:'$62.0K',cashSub:'Current cash on hand',cashDelta:'+1.2% vs Jan',cashDeltaColor:G,cashDeltaBg:GB },
    last12:  { revenue:'$500K',revSub:'Trailing 12-month total',revDelta:'+2.4% vs prior 12M',revDeltaColor:G,revDeltaBg:GB, expenses:'$438K',expSub:'COGS + OpEx TTM',expDelta:'+4.2% vs prior 12M',expDeltaColor:R,expDeltaBg:RB, netIncome:'$62K',niSub:'Trailing 12-month NI',niDelta:'–6.4% vs prior 12M',niDeltaColor:R,niDeltaBg:RB, cashBalance:'$62.0K',cashSub:'Current cash on hand',cashDelta:'+1.2% since May 2025',cashDeltaColor:G,cashDeltaBg:GB },
  },
  'shug0': {
    current: { revenue:'$97.4K',revSub:'vs $102K budget',revDelta:'–4.5% vs plan',revDeltaColor:R,revDeltaBg:RB, expenses:'$89.0K',expSub:'COGS + OpEx',expDelta:'+6.2% vs Mar',expDeltaColor:R,expDeltaBg:RB, netIncome:'$8.4K',niSub:'vs $14.2K budget',niDelta:'–40.8% vs plan',niDeltaColor:R,niDeltaBg:RB, cashBalance:'$134.0K',cashSub:'~1.5 months runway',cashDelta:'–4.8% vs Mar',cashDeltaColor:R,cashDeltaBg:RB },
    last:    { revenue:'$99.0K',revSub:'vs $100K budget',revDelta:'–1.0% vs plan',revDeltaColor:R,revDeltaBg:RB, expenses:'$83.8K',expSub:'COGS + OpEx',expDelta:'+1.4% vs Feb',expDeltaColor:R,expDeltaBg:RB, netIncome:'$15.2K',niSub:'vs $14.4K budget',niDelta:'+5.6% vs plan',niDeltaColor:G,niDeltaBg:GB, cashBalance:'$140.8K',cashSub:'~1.7 months runway',cashDelta:'+0.6% vs Feb',cashDeltaColor:G,cashDeltaBg:GB },
    last3:   { revenue:'$292.4K',revSub:'Feb–Apr 2026 total',revDelta:'–2.1% avg vs plan',revDeltaColor:R,revDeltaBg:RB, expenses:'$255.8K',expSub:'COGS + OpEx combined',expDelta:'+4.8% vs prior 3M',expDeltaColor:R,expDeltaBg:RB, netIncome:'$36.6K',niSub:'3-month total NI',niDelta:'–14.2% vs prior 3M',niDeltaColor:R,niDeltaBg:RB, cashBalance:'$134.0K',cashSub:'End of period cash',cashDelta:'–2.1% over 3M',cashDeltaColor:R,cashDeltaBg:RB },
    ytd:     { revenue:'$384.6K',revSub:'Jan–Apr 2026 total',revDelta:'+6.2% YoY',revDeltaColor:G,revDeltaBg:GB, expenses:'$337.4K',expSub:'YTD COGS + OpEx',expDelta:'+8.8% YoY',expDeltaColor:R,expDeltaBg:RB, netIncome:'$47.2K',niSub:'YTD net income',niDelta:'–8.4% YoY',niDeltaColor:R,niDeltaBg:RB, cashBalance:'$134.0K',cashSub:'Current cash on hand',cashDelta:'+2.8% vs Jan',cashDeltaColor:G,cashDeltaBg:GB },
    last12:  { revenue:'$1.20M',revSub:'Trailing 12-month total',revDelta:'+6.2% vs prior 12M',revDeltaColor:G,revDeltaBg:GB, expenses:'$1.06M',expSub:'COGS + OpEx TTM',expDelta:'+8.4% vs prior 12M',expDeltaColor:R,expDeltaBg:RB, netIncome:'$140K',niSub:'Trailing 12-month NI',niDelta:'–4.8% vs prior 12M',niDeltaColor:R,niDeltaBg:RB, cashBalance:'$134.0K',cashSub:'Current cash on hand',cashDelta:'+2.8% since May 2025',cashDeltaColor:G,cashDeltaBg:GB },
  },
};
// consolidated / bases-loaded share the same data (holdco rollup)
SUBCO_PERIOD_DATA['consolidated'] = {
  current: { revenue:'$1.87M',revSub:'vs $1.80M budget',revDelta:'+3.7% vs plan',revDeltaColor:G,revDeltaBg:GB, expenses:'$1.55M',expSub:'COGS + OpEx',expDelta:'+8.4% vs Mar',expDeltaColor:R,expDeltaBg:RB, netIncome:'$157K',niSub:'vs $194K budget',niDelta:'–19.1% vs plan',niDeltaColor:R,niDeltaBg:RB, cashBalance:'$1.47M',cashSub:'~9.6 months runway',cashDelta:'+2.1% vs Mar',cashDeltaColor:G,cashDeltaBg:GB },
  last:    { revenue:'$1.82M',revSub:'vs $1.76M budget',revDelta:'+3.1% vs plan',revDeltaColor:G,revDeltaBg:GB, expenses:'$1.48M',expSub:'COGS + OpEx',expDelta:'+2.8% vs Feb',expDeltaColor:R,expDeltaBg:RB, netIncome:'$196K',niSub:'vs $192K budget',niDelta:'+2.1% vs plan',niDeltaColor:G,niDeltaBg:GB, cashBalance:'$1.44M',cashSub:'~9.4 months runway',cashDelta:'+1.2% vs Feb',cashDeltaColor:G,cashDeltaBg:GB },
  last3:   { revenue:'$5.47M',revSub:'Feb–Apr 2026 total',revDelta:'+3.4% avg growth',revDeltaColor:G,revDeltaBg:GB, expenses:'$4.56M',expSub:'COGS + OpEx combined',expDelta:'+4.8% vs prior 3M',expDeltaColor:R,expDeltaBg:RB, netIncome:'$568K',niSub:'3-month total NI',niDelta:'–4.2% vs prior 3M',niDeltaColor:R,niDeltaBg:RB, cashBalance:'$1.47M',cashSub:'End of period cash',cashDelta:'+3.8% over 3M',cashDeltaColor:G,cashDeltaBg:GB },
  ytd:     { revenue:'$7.25M',revSub:'Jan–Apr 2026 total',revDelta:'+16.8% YoY',revDeltaColor:G,revDeltaBg:GB, expenses:'$6.02M',expSub:'YTD COGS + OpEx',expDelta:'+18.2% YoY',expDeltaColor:R,expDeltaBg:RB, netIncome:'$840K',niSub:'YTD net income',niDelta:'+9.4% YoY',niDeltaColor:G,niDeltaBg:GB, cashBalance:'$1.47M',cashSub:'Current cash on hand',cashDelta:'+5.4% vs Jan',cashDeltaColor:G,cashDeltaBg:GB },
  last12:  { revenue:'$22.0M',revSub:'Trailing 12-month total',revDelta:'+16.8% vs prior 12M',revDeltaColor:G,revDeltaBg:GB, expenses:'$18.24M',expSub:'COGS + OpEx TTM',expDelta:'+15.8% vs prior 12M',expDeltaColor:R,expDeltaBg:RB, netIncome:'$2.64M',niSub:'Trailing 12-month NI',niDelta:'+14.2% vs prior 12M',niDeltaColor:G,niDeltaBg:GB, cashBalance:'$1.47M',cashSub:'Current cash on hand',cashDelta:'+5.4% since May 2025',cashDeltaColor:G,cashDeltaBg:GB },
};
SUBCO_PERIOD_DATA['bases-loaded'] = SUBCO_PERIOD_DATA['consolidated'];

// ─── Quick-access report links ────────────────────────────────────────────────
const REPORTS = [
  { href: '/pnl',           label: 'P&L',            sub: 'Budget vs Actuals',   accent: 'var(--color-green)'  },
  { href: '/cashflow',      label: 'Cash Flow',       sub: '8.2 mo runway',      accent: 'var(--color-blue)'   },
  { href: '/yoy',           label: 'Year-over-Year',  sub: '+18.4% growth',      accent: 'var(--color-green)'  },
  { href: '/mom',           label: 'MoM Trend',       sub: '+3.1% Apr vs Mar',   accent: 'var(--color-blue)'   },
  { href: '/ai-forecast',   label: 'AI Forecast',     sub: '$16.8M proj. ARR',   accent: 'var(--color-blue)'   },
  { href: '/scenarios',     label: 'Scenarios',       sub: '4 cases modeled',    accent: '#1D44BF'             },
  { href: '/daily-revenue', label: 'Daily Revenue',   sub: 'Apr 30-day view',    accent: 'var(--color-orange)' },
  { href: '/backlog',       label: 'Backlog',         sub: '10 items · $659K risk', accent: 'var(--color-red)'    },
  { href: '/market',        label: 'Market Intel',    sub: 'Above median peers', accent: 'var(--color-green)'  },
];

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  open:        { label: 'Open',        color: 'var(--color-red)'    },
  in_progress: { label: 'In Progress', color: 'var(--color-orange)' },
  done:        { label: 'Done',        color: 'var(--color-green)'  },
};

const SEGMENT_TAG: Record<Sku['segment'], { label: string; bg: string; fg: string }> = {
  core:     { label: 'CORE',    bg: 'var(--color-green-d)',  fg: 'var(--color-green)'  },
  healthy:  { label: 'HEALTHY', bg: 'var(--color-blue-d)',   fg: 'var(--color-blue)'   },
  tail:     { label: 'TAIL',    bg: 'var(--color-orange-d)', fg: 'var(--color-orange)' },
  bleeder:  { label: 'MARGIN-', bg: 'var(--color-red-d)',    fg: 'var(--color-red)'    },
  dead:     { label: 'DEAD',    bg: 'var(--color-red-d)',    fg: 'var(--color-red)'    },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtMoney(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

/** Build a consolidated rollup of all operating subcos (excludes holdco itself). */
function useRollup() {
  const operating = ALL_PORTFOLIO_SUBCOS;
  const totalRev = operating.reduce((acc, s) => acc + s.annualRevenue, 0);
  const weightedGM = totalRev > 0
    ? operating.reduce((acc, s) => acc + s.grossMargin * s.annualRevenue, 0) / totalRev
    : 0;
  const totalGP = operating.reduce((acc, s) => acc + (s.grossMargin / 100) * s.annualRevenue, 0);
  return { operating, totalRev, weightedGM, totalGP };
}

/** Top SKUs for the active entity — aggregates across subcos for topco view. */
function useTopSkus(subcoId: string, isTopco: boolean, limit = 6): Array<Sku & { subcoLabel?: string; subcoColor?: string }> {
  if (isTopco) {
    const all: Array<Sku & { subcoLabel: string; subcoColor: string }> = [];
    for (const s of ALL_PORTFOLIO_SUBCOS) {
      const bundle = getSkuBundle(s.id);
      for (const sku of bundle.skus) {
        all.push({ ...sku, subcoLabel: s.monogram, subcoColor: s.colors.primary });
      }
    }
    return all.sort((a, b) => b.revenue12M - a.revenue12M).slice(0, limit);
  }
  const bundle = getSkuBundle(subcoId);
  return [...bundle.skus].sort((a, b) => b.revenue12M - a.revenue12M).slice(0, limit);
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();
  const { subco, isTopco } = useSubco();
  const { pending } = useDecisions();
  const [period, setPeriod] = useState<Period>('mtd');
  const periodMeta = PERIOD_OPTIONS.find((p) => p.key === period) ?? PERIOD_OPTIONS[1];

  // ── Brief-side data ──
  const cash = getCashPosition(subco.id);
  const planBase = getPlanActual(subco.id);
  const plan = useMemo(() => ({
    revenue:    {
      plan:      planBase.revenue.plan    * periodMeta.multiplier,
      actual:    planBase.revenue.actual  * periodMeta.multiplier,
      pctDelta:  planBase.revenue.pctDelta,
    },
    grossMargin: planBase.grossMargin,
    opex:       {
      plan:      planBase.opex.plan      * periodMeta.multiplier,
      actual:    planBase.opex.actual    * periodMeta.multiplier,
      pctDelta:  planBase.opex.pctDelta,
    },
    netIncome:  {
      plan:      planBase.netIncome.plan  * periodMeta.multiplier,
      actual:    planBase.netIncome.actual * periodMeta.multiplier,
      pctDelta:  planBase.netIncome.pctDelta,
    },
  }), [planBase, periodMeta.multiplier]);

  const deltas = getWeeklyDeltas(subco.id);
  const alerts = useMemo(
    () =>
      getAlerts(subco.id)
        .slice()
        .sort((a, b) => {
          const rank = { critical: 0, high: 1, medium: 2, low: 3 };
          return rank[a.severity] - rank[b.severity];
        }),
    [subco.id],
  );

  const pendingForContext = isTopco ? pending : pending.filter((d) => d.subcoId === subco.id);
  const topFires     = alerts.filter((a) => a.severity === 'critical' || a.severity === 'high').slice(0, 3);
  const topDecisions = pendingForContext.slice(0, 3);
  const topDeltas    = deltas.slice(0, 5);

  // ── Dashboard-side data ──
  const periodData = SUBCO_PERIOD_DATA[subco.id] ?? SUBCO_PERIOD_DATA['ssk'];
  const pd = periodData[PERIOD_TO_KPI_KEY[period]];
  const trendData = SUBCO_TREND[subco.id] ?? DEFAULT_TREND;
  const rollup = useRollup();
  const topSkus = useTopSkus(subco.id, isTopco);

  return (
    <div className="flex flex-col gap-5">

      {/* ── Greeting + period toggle ── */}
      <div style={{ ...CARD, padding: '24px 28px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.45,
          background: `radial-gradient(700px circle at 85% 0%, rgba(${subco.colors.primaryRgb}, 0.13) 0%, transparent 60%)`,
        }} />
        <div style={{ position: 'relative', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
          <div style={{ minWidth: 0, flex: '1 1 360px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: subco.colors.accent, marginBottom: 8 }}>
              Finance CEO Dashboard · {TODAY}
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.05, color: 'var(--color-text)', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', fontFamily: DISPLAY_FONT }}>
              <span style={{
                background: subco.colors.primary, color: '#FFFFFF',
                borderRadius: 5, padding: '3px 9px', fontSize: 14, fontWeight: 900,
              }}>
                {subco.monogram}
              </span>
              <span>Good morning, Ganesh</span>
            </div>
            <div style={{ marginTop: 10, fontSize: 14, color: 'var(--color-muted)', maxWidth: 780, lineHeight: 1.5 }}>
              {isTopco
                ? `${topFires.length} fires · ${topDecisions.length} decisions waiting · ${topDeltas.length} material deltas ${CHANGE_WINDOW_LABEL}. Portfolio view.`
                : `${topFires.length} ${subco.shortName} fires · ${topDecisions.length} decisions waiting for you · ${topDeltas.length} deltas ${CHANGE_WINDOW_LABEL}.`}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end' }}>
            {/* Period toggle pills */}
            <div style={{ display: 'flex', gap: 3, background: 'var(--color-surf2)', borderRadius: 6, padding: 3 }}>
              {PERIOD_OPTIONS.map((opt) => {
                const active = period === opt.key;
                return (
                  <button
                    key={opt.key}
                    onClick={() => setPeriod(opt.key)}
                    style={{
                      padding: '4px 9px',
                      borderRadius: 4,
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 10, fontWeight: 800, letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      background: active ? subco.colors.primary : 'transparent',
                      color: active ? '#FFFFFF' : 'var(--color-muted)',
                      transition: 'background 0.12s, color 0.12s',
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <StatusChip tone="good" label={`Cash: ${fmtMoney(cash.cashOnHand)}`} sub={`${cash.runwayMonths.toFixed(1)}mo runway`} />
              <StatusChip
                tone={plan.revenue.pctDelta >= 0 ? 'good' : 'bad'}
                label={`Revenue ${periodMeta.label}: ${fmtMoney(plan.revenue.actual)}`}
                sub={`${fmtPct(plan.revenue.pctDelta)} vs plan`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── 4 KPI cards — period-aware ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            id: 'revenue', label: 'Revenue', href: '/mom',
            value: pd.revenue, sub: pd.revSub, delta: pd.revDelta,
            deltaColor: pd.revDeltaColor, deltaBg: pd.revDeltaBg,
            valueColor: 'var(--color-text)', accentColor: 'var(--color-green)',
          },
          {
            id: 'expenses', label: 'Total Expenses', href: '/pnl',
            value: pd.expenses, sub: pd.expSub, delta: pd.expDelta,
            deltaColor: pd.expDeltaColor, deltaBg: pd.expDeltaBg,
            valueColor: 'var(--color-text)', accentColor: 'var(--color-red)',
          },
          {
            id: 'ni', label: 'Net Income', href: '/pnl',
            value: pd.netIncome, sub: pd.niSub, delta: pd.niDelta,
            deltaColor: pd.niDeltaColor, deltaBg: pd.niDeltaBg,
            valueColor: pd.niDeltaColor, accentColor: pd.niDeltaColor,
          },
          {
            id: 'cash', label: 'Cash on Hand', href: '/cashflow',
            value: pd.cashBalance, sub: pd.cashSub, delta: pd.cashDelta,
            deltaColor: pd.cashDeltaColor, deltaBg: pd.cashDeltaBg,
            valueColor: 'var(--color-text)', accentColor: 'var(--color-blue)',
          },
        ].map((m) => (
          <div
            key={m.id}
            role="button"
            tabIndex={0}
            onClick={() => router.push(m.href)}
            onKeyDown={(e) => e.key === 'Enter' && router.push(m.href)}
            style={{
              ...CARD,
              padding:    '20px 20px 16px',
              cursor:     'pointer',
              position:   'relative',
              overflow:   'hidden',
              transition: 'box-shadow 0.15s, border-color 0.15s',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.boxShadow   = 'var(--card-shadow-hover)';
              el.style.borderColor = `${m.accentColor}44`;
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.boxShadow   = 'var(--card-shadow)';
              el.style.borderColor = 'var(--color-border)';
            }}
          >
            <div
              style={{
                position:     'absolute',
                top: 0, left: 0, right: 0,
                height:       3,
                background:   m.accentColor,
                borderRadius: 'var(--card-radius) var(--card-radius) 0 0',
                opacity:      0.9,
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.09em', color: 'var(--color-muted)', marginBottom: 10, marginTop: 6 }}>
                {m.label}
              </div>
              <div style={{ fontSize: 34, fontWeight: 800, lineHeight: 1, color: m.valueColor, marginBottom: 6, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
                {m.value}
              </div>
              <div style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 10 }}>
                {m.sub}
              </div>
              <span style={{ background: m.deltaBg, color: m.deltaColor, fontSize: 11, fontWeight: 700, borderRadius: 3, padding: '3px 8px', letterSpacing: '0.03em' }}>
                {m.delta}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Top 3: Fires · Decisions · Cash+Plan ── */}
      <div className="grid grid-cols-12 gap-4">
        {/* On Fire */}
        <div className="col-span-12 lg:col-span-4" style={{ ...CARD, padding: 0, overflow: 'hidden' }}>
          <SectionHeader title="What's on fire" subtitle={`${topFires.length} need attention this week`} accent="#E06060" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {topFires.length === 0 && <EmptyState label="Nothing burning." />}
            {topFires.map((a) => (
              <Link
                key={a.id}
                href={a.cta.href}
                style={{
                  display: 'flex', flexDirection: 'column', gap: 6,
                  padding: '14px 20px',
                  borderBottom: '1px solid var(--color-border)',
                  textDecoration: 'none', color: 'inherit',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <SeverityBadge severity={a.severity} />
                  <span style={{ fontSize: 10, color: 'var(--color-muted)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    Due {a.due}
                  </span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.35 }}>{a.title}</div>
                <div style={{ fontSize: 11, color: 'var(--color-muted)', lineHeight: 1.45 }}>{a.body}</div>
                <div style={{ fontSize: 10, color: 'var(--color-muted)', fontWeight: 600, letterSpacing: '0.04em', marginTop: 2 }}>
                  Owner: <span style={{ color: 'var(--color-text)' }}>{a.owner}</span>
                </div>
              </Link>
            ))}
          </div>
          <Link href="/inbox" style={{ display: 'block', padding: '12px 20px', fontSize: 11, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#E8B84B', textDecoration: 'none', borderTop: '1px solid var(--color-border)' }}>
            See full queue →
          </Link>
        </div>

        {/* Decisions */}
        <div className="col-span-12 lg:col-span-4" style={{ ...CARD, padding: 0, overflow: 'hidden' }}>
          <SectionHeader title="Decisions waiting" subtitle={`${pendingForContext.length} in your queue`} accent="#E8B84B" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {topDecisions.length === 0 && <EmptyState label="Inbox zero. Enjoy it." />}
            {topDecisions.map((d) => (
              <Link
                key={d.id}
                href="/inbox"
                style={{
                  display: 'flex', flexDirection: 'column', gap: 6,
                  padding: '14px 20px',
                  borderBottom: '1px solid var(--color-border)',
                  textDecoration: 'none', color: 'inherit',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{
                    fontSize: 9, fontWeight: 800, letterSpacing: '0.10em',
                    padding: '2px 7px', borderRadius: 3,
                    background: d.urgency === 'URGENT' ? 'rgba(224,96,96,0.15)' : 'rgba(245,138,31,0.15)',
                    color: d.urgency === 'URGENT' ? '#E06060' : '#E8B84B',
                  }}>
                    {d.urgency}
                  </span>
                  <span style={{ fontSize: 10, color: 'var(--color-muted)', fontWeight: 700 }}>
                    {d.confidence}
                  </span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.35 }}>{d.title}</div>
                <div style={{ fontSize: 11, color: 'var(--color-muted)', lineHeight: 1.45 }}>{d.summary}</div>
                <div style={{ fontSize: 11, color: '#2DB47A', fontWeight: 700, marginTop: 2 }}>
                  💰 {d.impact}
                </div>
              </Link>
            ))}
          </div>
          <Link href="/inbox" style={{ display: 'block', padding: '12px 20px', fontSize: 11, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#E8B84B', textDecoration: 'none', borderTop: '1px solid var(--color-border)' }}>
            Open decision inbox →
          </Link>
        </div>

        {/* Cash + Plan strip (no longer has its own toggle — follows greeting-card period) */}
        <div className="col-span-12 lg:col-span-4" style={{ ...CARD, padding: 0, overflow: 'hidden' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 20px 12px',
            borderBottom: '1px solid var(--color-border)',
          }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#2DB47A' }}>
                Cash & Plan
              </div>
              <div style={{ fontSize: 10, color: 'var(--color-muted)', marginTop: 1 }}>
                Where you stand right now · {periodMeta.label}
              </div>
            </div>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2DB47A', boxShadow: '0 0 8px #2DB47A' }} />
          </div>
          <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <CashCard cash={cash} />
            <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />
            <PlanRow label={`Revenue · ${periodMeta.label}`}     plan={plan.revenue.plan}   actual={plan.revenue.actual}   deltaPct={plan.revenue.pctDelta}   money />
            <PlanRow label="Gross Margin"                         plan={plan.grossMargin.plan / 100} actual={plan.grossMargin.actual / 100} deltaPct={plan.grossMargin.pctDelta} asPct />
            <PlanRow label={`OpEx · ${periodMeta.label}`}         plan={plan.opex.plan}      actual={plan.opex.actual}      deltaPct={plan.opex.pctDelta}      money inverted />
            <PlanRow label={`Net Income · ${periodMeta.label}`}   plan={plan.netIncome.plan} actual={plan.netIncome.actual} deltaPct={plan.netIncome.pctDelta} money />
          </div>
          <div style={{ borderTop: '1px solid var(--color-border)', padding: '10px 20px', display: 'flex', gap: 10 }}>
            <Link href="/cashflow" style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#E8B84B' }}>Cash flow →</Link>
            <Link href="/pnl" style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase', color: '#E8B84B' }}>Full P&L →</Link>
          </div>
        </div>
      </div>

      {/* ── What changed (top 5) ── */}
      <div style={{ ...CARD, padding: 0, overflow: 'hidden' }}>
        <SectionHeader title={`What changed ${CHANGE_WINDOW_LABEL}`} subtitle="Material deltas across the business" accent={subco.colors.accent} />
        <div style={{ padding: '6px 0' }}>
          {topDeltas.length === 0 && <EmptyState label="No material deltas this week." />}
          {topDeltas.map((d) => {
            const tone = TONE_COLORS[d.tone];
            return (
              <div key={d.id} style={{
                padding: '14px 20px',
                borderTop: '1px solid var(--color-border)',
                display: 'grid',
                gridTemplateColumns: '100px 1fr auto',
                gap: 14,
                alignItems: 'start',
              }}>
                <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase', color: tone.fg, whiteSpace: 'nowrap' }}>
                  {d.category}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.35 }}>
                    {d.headline}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 4, lineHeight: 1.45 }}>
                    {d.detail}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--color-muted)', marginTop: 4, letterSpacing: '0.04em' }}>
                    {d.since}
                  </div>
                </div>
                {typeof d.dollarImpact === 'number' && (
                  <div style={{
                    fontSize: 13, fontWeight: 800, fontFamily: DISPLAY_FONT,
                    color: d.dollarImpact >= 0 ? '#2DB47A' : '#E06060',
                    whiteSpace: 'nowrap',
                  }}>
                    {fmtMoneySigned(d.dollarImpact)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Revenue & NI Trend Chart ── */}
      <div style={{ ...CARD, overflow: 'hidden' }}>
        <div
          className="flex items-center justify-between px-5 py-3.5 border-b"
          style={{ borderColor: 'var(--color-border)', background: 'var(--color-surf2)' }}
        >
          <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: 'var(--color-muted)' }}>
            Revenue &amp; Net Income — 6-Month Trend
          </span>
          <button
            onClick={() => router.push('/mom')}
            style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#1D44BF', background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            Deep Dive →
          </button>
        </div>
        <div className="p-4">
          <ResponsiveContainer width="100%" height={340}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-chart-grid)" vertical={false} />
              <XAxis
                dataKey="month"
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                tick={{ fill: 'var(--color-chart-text)', fontSize: 12 } as any}
                axisLine={false} tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                tick={{ fill: 'var(--color-chart-text)', fontSize: 11 } as any}
                axisLine={false} tickLine={false} width={54}
              />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                formatter={(val) => [`$${Number(val).toLocaleString()}`, '']}
                cursor={{ stroke: 'rgba(65,182,230,0.20)', strokeWidth: 1 }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="Revenue"
                stroke="#1D44BF" strokeWidth={2.5}
                dot={{ r: 4, fill: '#1D44BF', strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#1D44BF', stroke: '#FFFFFF', strokeWidth: 2 }}
              />
              <Line type="monotone" dataKey="Net Income"
                stroke="#4FA8FF" strokeWidth={2}
                dot={{ r: 4, fill: '#4FA8FF', strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#4FA8FF', stroke: '#FFFFFF', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Anomaly flags ── */}
      <AnomalyBanner anomalies={anomalies} />

      {/* ── Priority actions ── */}
      <div className="flex flex-col gap-3">
        {highPriorityActions.map((action) => {
          const sc  = STATUS_LABELS[action.status];
          const due = new Date(action.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          return (
            <div
              key={action.id}
              role="button"
              tabIndex={0}
              onClick={() => router.push('/pnl')}
              onKeyDown={(e) => e.key === 'Enter' && router.push('/pnl')}
              style={{
                ...CARD,
                borderLeft: '4px solid var(--color-red)',
                padding:    '18px 22px',
                cursor:     'pointer',
                transition: 'box-shadow 0.15s',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--card-shadow-hover)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--card-shadow)'; }}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span style={{ background: 'var(--color-red-d)', color: 'var(--color-red)', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '2px 8px', borderRadius: 3 }}>
                      HIGH PRIORITY
                    </span>
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--color-text)', lineHeight: 1.3 }}>
                    {action.text}
                  </div>
                  <div className="flex flex-wrap gap-4 mt-2">
                    <span style={{ fontSize: 13, color: 'var(--color-muted)' }}>
                      Owner: <strong style={{ color: 'var(--color-text)', fontWeight: 600 }}>{action.owner}</strong>
                    </span>
                    <span style={{ fontSize: 13, color: 'var(--color-muted)' }}>
                      Due: <strong style={{ color: 'var(--color-text)', fontWeight: 600 }}>{due}</strong>
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span style={{ background: 'var(--color-red-d)', color: sc.color, fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 4, border: '1px solid rgba(255,255,255,0.08)' }}>
                    ● {sc.label}
                  </span>
                  <span style={{ fontSize: 18, color: 'var(--color-muted)', fontWeight: 600 }}>→</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Portfolio Rollup (topco consolidated view only) ── */}
      {isTopco && (
        <div style={{ ...CARD, overflow: 'hidden' }}>
          <div
            className="flex items-center justify-between px-5 py-3.5 border-b"
            style={{ borderColor: 'var(--color-border)', background: 'var(--color-surf2)' }}
          >
            <div className="flex items-center gap-2">
              <span style={{
                fontSize: 10, fontWeight: 800, letterSpacing: '0.12em',
                color: subco.colors.accent,
                background: `rgba(${subco.colors.accentRgb}, 0.18)`,
                border: `1px solid rgba(${subco.colors.accentRgb}, 0.40)`,
                borderRadius: 3, padding: '2px 7px', textTransform: 'uppercase',
              }}>
                Consolidation Layer
              </span>
              <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: 'var(--color-muted)' }}>
                Portfolio Rollup — {rollup.operating.length} Operating Brands
              </span>
            </div>
            <button
              onClick={() => router.push('/consolidation')}
              style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#1D44BF', background: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              Deep Dive →
            </button>
          </div>
          <div style={{ padding: '8px 0' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(160px, 2.2fr) 1.2fr 1fr 1fr 2fr',
              padding: '8px 20px',
              fontSize: 10, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase',
              color: 'var(--color-muted)', borderBottom: '1px solid var(--color-border)',
            }}>
              <div>Subsidiary</div>
              <div style={{ textAlign: 'right' }}>Annual Revenue</div>
              <div style={{ textAlign: 'right' }}>Gross Margin</div>
              <div style={{ textAlign: 'right' }}>% of Portfolio</div>
              <div style={{ paddingLeft: 20 }}>Contribution</div>
            </div>
            {rollup.operating.map((s) => {
              const pct = rollup.totalRev > 0 ? (s.annualRevenue / rollup.totalRev) * 100 : 0;
              return (
                <button
                  key={s.id}
                  onClick={() => router.push('/consolidation')}
                  style={{
                    width: '100%',
                    display: 'grid',
                    gridTemplateColumns: 'minmax(160px, 2.2fr) 1.2fr 1fr 1fr 2fr',
                    alignItems: 'center',
                    padding: '12px 20px',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid var(--color-border)',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    textAlign: 'left',
                    transition: 'background 0.12s',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--color-surf2)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  <div className="flex items-center gap-3">
                    <span style={{
                      background: s.colors.primary, color: '#FFFFFF',
                      borderRadius: 4, padding: '3px 8px',
                      fontSize: 11, fontWeight: 900, letterSpacing: '0.02em',
                      minWidth: 40, textAlign: 'center',
                    }}>
                      {s.monogram}
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.2 }}>{s.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.tagline}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-text)', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                    {fmtMoney(s.annualRevenue)}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                    {s.grossMargin.toFixed(1)}%
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-muted)', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                    {pct.toFixed(1)}%
                  </div>
                  <div style={{ paddingLeft: 20 }}>
                    <div style={{ height: 8, background: 'var(--color-surf3)', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{
                        width: `${Math.min(100, pct)}%`,
                        height: '100%',
                        background: s.colors.primary,
                        borderRadius: 999,
                        transition: 'width 0.3s',
                      }} />
                    </div>
                  </div>
                </button>
              );
            })}

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(160px, 2.2fr) 1.2fr 1fr 1fr 2fr',
              alignItems: 'center',
              padding: '14px 20px',
              background: 'var(--color-surf2)',
            }}>
              <div style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text)' }}>
                Consolidated Total
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--color-text)', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                {fmtMoney(rollup.totalRev)}
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--color-text)', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                {rollup.weightedGM.toFixed(1)}%
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-muted)', textAlign: 'right' }}>
                100%
              </div>
              <div style={{ paddingLeft: 20, fontSize: 12, color: 'var(--color-muted)', fontWeight: 600 }}>
                GP ≈ {fmtMoney(rollup.totalGP)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Top SKUs — Revenue Leaders ── */}
      <div style={{ ...CARD, overflow: 'hidden' }}>
        <div
          className="flex items-center justify-between px-5 py-3.5 border-b"
          style={{ borderColor: 'var(--color-border)', background: 'var(--color-surf2)' }}
        >
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', color: 'var(--color-muted)' }}>
              {isTopco ? 'Top SKUs — Portfolio Rollup (Trailing 12M)' : 'Top SKUs by Revenue (Trailing 12M)'}
            </span>
          </div>
          <button
            onClick={() => router.push('/sku-rationalization')}
            style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#1D44BF', background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            SKU Rationalization →
          </button>
        </div>
        <div style={{ padding: '8px 0' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isTopco
              ? 'minmax(60px, 0.6fr) minmax(120px, 1fr) minmax(200px, 2.4fr) 1fr 0.9fr 0.9fr'
              : 'minmax(120px, 1fr) minmax(200px, 2.4fr) 1fr 0.9fr 0.9fr',
            padding: '8px 20px',
            fontSize: 10, fontWeight: 800, letterSpacing: '0.10em', textTransform: 'uppercase',
            color: 'var(--color-muted)', borderBottom: '1px solid var(--color-border)',
          }}>
            {isTopco && <div>Brand</div>}
            <div>SKU</div>
            <div>Name</div>
            <div style={{ textAlign: 'right' }}>Revenue (12M)</div>
            <div style={{ textAlign: 'right' }}>GM</div>
            <div style={{ textAlign: 'right' }}>Segment</div>
          </div>
          {topSkus.map((s, i) => {
            const tag = SEGMENT_TAG[s.segment];
            return (
              <div
                key={`${s.sku}-${i}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: isTopco
                    ? 'minmax(60px, 0.6fr) minmax(120px, 1fr) minmax(200px, 2.4fr) 1fr 0.9fr 0.9fr'
                    : 'minmax(120px, 1fr) minmax(200px, 2.4fr) 1fr 0.9fr 0.9fr',
                  alignItems: 'center',
                  padding: '12px 20px',
                  borderBottom: i === topSkus.length - 1 ? 'none' : '1px solid var(--color-border)',
                }}
              >
                {isTopco && (
                  <div>
                    <span style={{
                      background: s.subcoColor, color: '#FFFFFF',
                      borderRadius: 4, padding: '3px 7px',
                      fontSize: 10, fontWeight: 900, letterSpacing: '0.02em',
                      display: 'inline-block',
                    }}>
                      {s.subcoLabel}
                    </span>
                  </div>
                )}
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-muted)', fontFamily: 'ui-monospace, SF Mono, monospace' }}>
                  {s.sku}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {s.name}
                </div>
                <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--color-text)', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                  {fmtMoney(s.revenue12M)}
                </div>
                <div style={{
                  fontSize: 13, fontWeight: 700,
                  color: s.grossMargin >= 0.4 ? 'var(--color-green)' : s.grossMargin >= 0.25 ? 'var(--color-text)' : s.grossMargin >= 0 ? 'var(--color-orange)' : 'var(--color-red)',
                  textAlign: 'right', fontVariantNumeric: 'tabular-nums',
                }}>
                  {(s.grossMargin * 100).toFixed(1)}%
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    background: tag.bg, color: tag.fg,
                    fontSize: 10, fontWeight: 800, letterSpacing: '0.06em',
                    padding: '3px 8px', borderRadius: 3,
                  }}>
                    {tag.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── November Preview ── */}
      <div style={{ ...CARD, borderLeft: '4px solid var(--color-orange)', padding: '20px 24px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.10em', color: 'var(--color-orange)', marginBottom: 14 }}>
          November Preview
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { text: 'Salesforce renewal: +$22K expense hitting Nov 1. Partially offset by full ShipBob savings.', color: 'var(--color-red)' },
            { text: 'Full ShipBob savings: +$14K/month beginning November — gross margin should expand 0.5–0.8pp.', color: 'var(--color-green)' },
            { text: 'Marketing must normalize from $171K back to the $124K budget to restore net income to $100K+.', color: 'var(--color-orange)' },
          ].map((item, i) => (
            <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{
                background: item.color,
                width: 6, height: 6, borderRadius: '50%',
                flexShrink: 0, marginTop: 8,
              }} />
              <span style={{ fontSize: 14, color: 'var(--color-text)', lineHeight: 1.55 }}>{item.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ── All Reports quick access ── */}
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.10em', color: 'var(--color-muted)', marginBottom: 14 }}>
          All Reports
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {REPORTS.map((r) => (
            <div
              key={r.href}
              role="button"
              tabIndex={0}
              onClick={() => router.push(r.href)}
              onKeyDown={(e) => e.key === 'Enter' && router.push(r.href)}
              style={{
                ...CARD,
                padding:    '14px 16px',
                cursor:     'pointer',
                display:    'flex',
                alignItems: 'center',
                gap:        12,
                transition: 'box-shadow 0.15s, border-color 0.15s',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = `${r.accent}55`;
                el.style.boxShadow   = 'var(--card-shadow-hover)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = 'var(--color-border)';
                el.style.boxShadow   = 'var(--card-shadow)';
              }}
            >
              <div style={{ width: 3, height: 32, background: r.accent, borderRadius: 2, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-text)', lineHeight: 1.2 }}>
                  {r.label}
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 2 }}>
                  {r.sub}
                </div>
              </div>
              <span style={{ fontSize: 14, color: r.accent, fontWeight: 700, flexShrink: 0, opacity: 0.7 }}>→</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Brief helper components
// ──────────────────────────────────────────────────────────────────────────

function SectionHeader({ title, subtitle, accent }: { title: string; subtitle: string; accent: string }) {
  return (
    <div style={{
      padding: '16px 20px',
      borderBottom: '1px solid var(--color-border)',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10,
    }}>
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
          {title}
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, marginTop: 2, fontFamily: DISPLAY_FONT, color: 'var(--color-text)' }}>
          {subtitle}
        </div>
      </div>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: accent, boxShadow: `0 0 8px ${accent}` }} />
    </div>
  );
}

function StatusChip({ tone, label, sub }: { tone: 'good' | 'warn' | 'bad' | 'neutral'; label: string; sub: string }) {
  const c = TONE_COLORS[tone];
  return (
    <div style={{
      padding: '6px 12px',
      border: `1px solid ${c.border}`,
      background: c.bg,
      borderRadius: 7,
      display: 'flex', flexDirection: 'column', gap: 2,
    }}>
      <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: c.fg }}>
        {label}
      </span>
      <span style={{ fontSize: 10, color: 'var(--color-muted)' }}>{sub}</span>
    </div>
  );
}

function SeverityBadge({ severity }: { severity: 'critical' | 'high' | 'medium' | 'low' }) {
  const meta = {
    critical: { color: '#E06060', bg: 'rgba(224,96,96,0.18)', label: 'CRITICAL' },
    high:     { color: '#F7A500', bg: 'rgba(247,165,0,0.18)', label: 'HIGH' },
    medium:   { color: '#4FA8FF', bg: 'rgba(79,168,255,0.18)', label: 'MEDIUM' },
    low:      { color: 'var(--color-muted)', bg: 'rgba(255,255,255,0.05)', label: 'LOW' },
  }[severity];
  return (
    <span style={{
      fontSize: 9, fontWeight: 800, letterSpacing: '0.10em',
      padding: '2px 7px', borderRadius: 3,
      background: meta.bg, color: meta.color,
    }}>
      {meta.label}
    </span>
  );
}

function EmptyState({ label }: { label: string }) {
  return <div style={{ padding: '22px 20px', fontSize: 12, color: 'var(--color-muted)', textAlign: 'center' }}>{label}</div>;
}

function CashCard({ cash }: { cash: ReturnType<typeof getCashPosition> }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
          Cash on hand
        </span>
        <span style={{
          fontSize: 10, fontWeight: 800,
          color: cash.last30Change >= 0 ? '#2DB47A' : '#E06060',
        }}>
          {fmtMoneySigned(cash.last30Change)} · 30d
        </span>
      </div>
      <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-0.02em', fontFamily: DISPLAY_FONT, lineHeight: 1 }}>
        {fmtMoney(cash.cashOnHand)}
      </div>
      <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 4 }}>
        {cash.runwayMonths.toFixed(1)} months runway · AR {fmtMoney(cash.arOutstanding)} · AP {fmtMoney(cash.apDueNext30)}
      </div>
    </div>
  );
}

function PlanRow({
  label, plan, actual, deltaPct, money = false, asPct = false, inverted = false,
}: {
  label: string;
  plan: number;
  actual: number;
  deltaPct: number;
  money?: boolean;
  asPct?: boolean;
  inverted?: boolean;
}) {
  const formatValue = (v: number) => {
    if (asPct) return `${(v * 100).toFixed(1)}%`;
    if (money) return fmtMoney(v);
    return v.toString();
  };
  const positiveIsGood = !inverted;
  const isGood = positiveIsGood ? deltaPct >= 0 : deltaPct <= 0;
  const deltaColor = Math.abs(deltaPct) < 0.005 ? 'var(--color-muted)' : isGood ? '#2DB47A' : '#E06060';

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
          {label}
        </div>
        <div style={{ fontSize: 14, fontWeight: 800, fontFamily: DISPLAY_FONT, marginTop: 2 }}>
          {formatValue(actual)}
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 10, color: 'var(--color-muted)' }}>
          Plan: {formatValue(plan)}
        </div>
        <div style={{ fontSize: 12, fontWeight: 800, color: deltaColor, marginTop: 2 }}>
          {fmtPct(deltaPct)}
        </div>
      </div>
    </div>
  );
}
