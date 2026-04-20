import type { ChatContext } from '@/lib/data/types';

const BASE_PERSONA = `You are the AI CFO for the company. You are sharp, direct, and specific.
Always use specific dollar amounts and percentages.
Keep responses under 100 words unless asked for detail.
Flag what needs action. Don't hedge \u2014 give clear recommendations.`;

const RIDGELINE_FINANCIALS = `COMPANY: Apex Industrial Group \u2014 Western lifestyle outdoor apparel brand at ~$15M annual revenue.

OCTOBER 2024 FINANCIALS:
Revenue $1,311,600 (budget $1,270,000, +$41,600)
- DTC $770,400 (+$28,400): email campaign Oct 12 drove the beat
- Wholesale $541,200 (+$13,200): Scheels pulled forward a November order

COGS $720,300 (budget $725,800, favorable $5,500)
- Materials $516,800 (over $8,800): unbudgeted freight surcharge
- Fulfillment $203,500 (favorable $14,300): new ShipBob deal

Gross Profit $591,300 (budget $552,200)

OpEx $460,700 (budget $412,400, over $48,300)
- ANOMALY Marketing $171,200 (budget $124,000, OVER $47,200/+38%): Altitude Creative $18K + WestCoast Influencers $13K not mapped to campaigns
- Payroll $201,200 (over $3,200): one open SDR role
- Technology $14,200 (favorable $4,200): Salesforce $22K hitting November
- G&A $74,100 (over $2,100)

Op. Income $130,600 | Net Income $71,400 (budget $109,200, under $37,800/-34.6%)
Cash on hand $873,500 | Runway ~8.2 months.`;

const VIEW_CONTEXT: Record<string, string> = {
  dashboard: 'The user is on the main dashboard looking at KPIs and anomaly alerts. Focus on the big picture and what needs immediate attention.',
  pnl: 'The user is reviewing the P&L statement with budget vs actuals. Focus on specific line items, variances, and root causes.',
  cashflow: 'The user is on the cash flow page. Focus on cash position, runway, working capital, AR/AP aging, and liquidity risks.',
  forecast: 'The user is on the forecast page looking at 12-month projections. Focus on trends, growth assumptions, and risks to the forecast.',
  scenarios: 'The user is comparing what-if scenarios. Focus on scenario trade-offs, margin impact, and risk analysis.',
};

export function buildSystemPrompt(context: ChatContext, mode: 'demo' | 'live', liveData?: string): string {
  const financials = mode === 'live' && liveData ? liveData : RIDGELINE_FINANCIALS;
  const viewHint = VIEW_CONTEXT[context.currentView] || '';

  return `${BASE_PERSONA}

${financials}

${viewHint}

${context.highlights ? `KEY HIGHLIGHTS: ${context.highlights.join('; ')}` : ''}`;
}
