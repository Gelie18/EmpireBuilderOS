import type { ChatContext } from '@/lib/data/types';

const BASE_PERSONA = `You are the AI CFO for the company. Be direct and specific — no hedging.
- Lead with the number. Always cite specific dollar amounts and percentages.
- Keep responses under 120 words unless the user asks for detail.
- Use bullet points for lists. Use **bold** for key figures.
- End with a clear action or recommendation when relevant.`;

const APEX_FINANCIALS = `COMPANY: Apex Industrial Group — B2B industrial manufacturer, ~$15M annual revenue.
PERIOD: October 2026

P&L SNAPSHOT:
Revenue $1,311,600 (budget $1,270,000, +$41,600 / +3.3%)
  DTC $770,400 (+$28,400) — Oct 12 email campaign, 14% conversion
  Wholesale $541,200 (+$13,200) — Scheels pulled a Nov order early

Gross Profit $591,300 (45.1% margin, +40bps vs plan)
  Fulfillment favorable $14,300 — new ShipBob contract
  Materials over $8,800 — El Paso freight surcharge

OpEx $460,700 (budget $412,400, over $48,300)
  ⚠ Marketing $171,200 (budget $124,000, +$47,200/+38%) — two unmatched invoices: $18K Altitude Creative, $13K WestCoast Influencers
  Payroll $201,200 (+$3,200 — open SDR seat)
  Technology $14,200 (favorable $4,200 — Salesforce pushed to November)

Net Income $71,400 (budget $109,200, -$37,800/-34.6%)
Cash $873,500 | Runway ~8.2 months`;

const VIEW_HINTS: Record<string, string> = {
  dashboard:     'User is on the dashboard. Focus on the 2–3 most urgent issues and what requires action today.',
  pnl:           'User is reviewing P&L. Focus on specific line-item variances, root causes, and what to fix.',
  cashflow:      'User is on cash flow. Focus on cash position, runway, working capital, and near-term liquidity.',
  'balance-sheet': 'User is reviewing the balance sheet. Focus on working capital ratios, NWC, and asset/liability trends.',
  forecast:      'User is on the forecast page. Focus on growth assumptions, key risks, and scenarios.',
  scenarios:     'User is modeling scenarios. Focus on trade-offs, margin sensitivity, and risk quantification.',
  backlog:       'User is reviewing the backlog. Focus on highest-dollar risks, action owners, and timelines.',
  revenue:       'User is on revenue intel. Focus on product line performance, customer concentration, and MRR/ARR trends.',
  yoy:           'User is comparing year-over-year. Focus on growth rates, margin trends, and what changed.',
  mom:           'User is reviewing month-over-month. Focus on what shifted and whether it is noise or trend.',
  market:        'User is on market intel. Focus on competitive positioning and where benchmarks diverge.',
};

export function buildSystemPrompt(context: ChatContext, mode: 'demo' | 'live', liveData?: string): string {
  const financials = mode === 'live' && liveData ? liveData : APEX_FINANCIALS;
  const viewHint   = VIEW_HINTS[context.currentView] ?? '';

  return [
    BASE_PERSONA,
    financials,
    viewHint && `CURRENT VIEW: ${viewHint}`,
    context.highlights?.length ? `CONTEXT: ${context.highlights.join('; ')}` : '',
  ].filter(Boolean).join('\n\n');
}
