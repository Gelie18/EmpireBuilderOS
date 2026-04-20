// AI CFO static responses — keyword matched, used when no API key is set.
// Written from a CFO perspective reviewing October 2026 for Apex Industrial Group.
// Formatting: \n\n = paragraph break, ● = bullet, **text** = bold

export const STATIC_RESPONSES: Record<string, string> = {

  'net income':
    "**Net income: $71,400** — $37,800 below the $109,200 plan (–34.6%).\n\nThe miss is entirely marketing-driven. Revenue beat by +$41,600 and COGS came in $5,500 favorable. We won on both lines. But a **$47,200 marketing overage** erased both wins.\n\n● $18K to Altitude Creative — paid, no matched campaign PO\n● $13K to WestCoast Influencers — paid, no campaign record\n\nAction: Hold both vendors. If they clear reconciliation, the real overage is only $16K — manageable.",

  'marketing':
    "**Marketing: $171,200 vs $124,000 budget — $47,200 over (+38%).** Largest monthly overage in 14 months.\n\n● $18K — Altitude Creative. Paid. No campaign PO match.\n● $13K — WestCoast Influencers. Paid. No campaign record.\n● $16K — Approved overrun (Google Ads, paid social).\n\nAction: Freeze re-engagement with both vendors until invoice attribution is confirmed. If they match, the structural overage drops to $16K.",

  'ecommerce':
    "DTC beat plan by **+$28,400** in October — driven by the Oct 12 email campaign (14% conversion, zero discounting). That's the most efficient DTC performance since launch.\n\nThe $31K in unreconciled agency invoices (Altitude Creative + WestCoast Influencers) sit in marketing, not DTC cost — so the channel economics look worse than they are. Strip those out and DTC margin is clean.",

  'cash':
    "**Cash on hand: $873,500** — approximately **8.2 months** of runway at trailing burn. No liquidity concern today.\n\nNovember watch list:\n● Salesforce renewal: +$22K expense (pushed from October)\n● Full ShipBob savings: +$14K/month\n● Net impact: ~–$8K — roughly neutral\n\nRisk: if the $171K marketing run rate continues, runway compresses faster than modeled. That's the scenario to stress-test.",

  'runway':
    "**$873,500 on hand. ~8.2 months runway** at trailing burn rate.\n\nTwo November offsets:\n● Salesforce renewal: –$22K\n● ShipBob full savings: +$14K\n\nIf marketing normalizes to the $124K budget, runway holds above 8 months through Q1. If October's $171K rate continues for 3 months, runway shortens meaningfully — flag for board.",

  'board':
    "Three things for the board:\n\n● **Net income missed by $37.8K** — but it's a controls story, not demand. Revenue and gross margin both beat. The miss is one marketing line with two unreconciled invoices.\n● **Cash is healthy** — $873.5K, 8.2 months runway. No funding urgency. November cash flow looks neutral.\n● **Revenue momentum is real** — +18.4% YoY, DTC conversion at 14%, zero discounting.\n\nOne ask: authorize CFO review of Altitude Creative and WestCoast Influencers before the next vendor payment run.",

  'revenue':
    "**Revenue: $1,311,600 — beat plan by $41,600 (+3.3%).**\n\n● DTC: +$28,400. Oct 12 email drove 14% conversion with no discounting — best since launch.\n● Wholesale: +$13,200. Scheels pulled forward a November order — not incremental demand.\n\nCaveat: the Scheels pull-forward may create a November wholesale shortfall. Watch that line. YoY revenue is +18.4% vs industry median ~11%.",

  'variance':
    "Key variances this month:\n\n✅ Revenue: +$41,600 — DTC campaign + Scheels pull-forward\n✅ Fulfillment: +$14,300 — ShipBob contract (full benefit in November)\n✅ Technology: +$4,200 — Salesforce pushed to November\n\n❌ Marketing: –$47,200 — two unmatched vendor payments ($31K) + $16K approved overrun\n❌ Materials: –$8,800 — El Paso freight surcharge, effective Oct 1\n\nMarketing is the only structural concern. Everything else is timing.",

  'margin':
    "**Gross margin: 45.1%** — 40bps above plan, 120bps above this time last year.\n\nTwo drivers:\n● DTC mix shift from the email campaign carries better margin than wholesale\n● ShipBob contract cut per-unit fulfillment cost from mid-month\n\nIf DTC mix holds through Q4 and ShipBob runs full volume, we're tracking toward a **45.5–46% gross margin exit** — above the 44.7% full-year target.",

  'forecast':
    "At current trajectory — 3% MoM revenue growth, COGS ~54.9%, OpEx normalizing:\n\n● **12-month forward revenue: ~$16.8M** annualized run rate\n● Projected NI margin: 13–14%\n● Cash stays above 6 months runway throughout\n\nCritical assumption: marketing normalizes from $171K → $124K. If October's rate runs 3 more months, full-year NI compresses ~$400K and margin drops to 10–11%.",

  'scenario':
    "Three scenarios modeled:\n\n🟢 **Best case** — Land enterprise pipeline + 5% organic: $22M+ run rate, 16%+ NI margin\n🔵 **Base case** — 3% MoM growth, marketing normalizes: $16.8M run rate, 13–14% margin\n🔴 **Downside** — –2% MoM + wholesale churn: runway drops below 6 months by Q2\n\nThe downside requires both revenue weakness and the marketing overage to become structural. Low probability — but have the playbook ready.",

  'yoy':
    "Year-over-year through October:\n\n● Revenue: **+18.4%** (industry median ~11%) ✅\n● Gross margin: **45.1% vs 43.9%** last year (+120bps) ✅\n● NI margin: **5.4% vs 8.2%** last year — compressed by marketing ⚠️\n● OpEx growth: +22% — ahead of revenue, driven by marketing + Q1 headcount\n\nStrip out October's marketing anomaly and NI margin runs ~8% — in line with last year. Controls story, not a business story.",

  'mom':
    "September → October:\n\n● Revenue: +3.1% — healthy, on trend ✅\n● Gross profit: +4.2% — margin expanding from DTC mix ✅\n● OpEx: +11.7% — entirely the $47K marketing overage ⚠️\n● Net income: –34% — September was a clean $108K\n\nBefore calling this a trend: November marketing is budgeted at $124K. That month is the test. If it holds, October was noise.",

  'november':
    "November watch list:\n\n● **Marketing must normalize** — budget is $124K, October ran $171K. The $47K overage needs to stay in October.\n● **Salesforce renewal hits Nov 1** — $22K, already in budget.\n● **Full ShipBob savings begin** — $14K/month. Offsets most of Salesforce.\n\nIf marketing holds, November NI should recover to $100K+. That's the number to watch.",

  'shipping':
    "**Fulfillment: $14,300 favorable** — ShipBob contract took effect mid-October at a lower per-unit rate. Full-month benefit starts November (+$14K/month).\n\nFlip side: Materials ran **$8,800 over** — an unbudgeted freight surcharge at the El Paso warehouse effective Oct 1. Evaluating carrier alternatives before Q4 holiday volume ramps.",

  'market':
    "Competitive position — October 2026:\n\n● Revenue growth: **+18.4%** (industry median 11%) ✅\n● Gross margin: **45.1%** (industry median 41.3%) ✅\n● NI margin: **5.4%** (top-quartile peers: 12%+) ⚠️\n● Revenue per employee: +10.5% YoY ✅\n\nThe NI gap vs top-quartile peers is October's marketing overage. Strip it out and we're at ~8% — upper-median. ShipBob deal gives us a structural fulfillment cost advantage vs smaller brands still on legacy 3PL contracts.",

  'vendors':
    "Key vendor status:\n\n● **Altitude Creative** — $18K October payment. No matched campaign PO. Do not re-engage.\n● **WestCoast Influencers** — $13K October payment. No campaign record. Hold.\n● **ShipBob** — New contract effective Oct 15. Saving **$14K/month** at full volume. Performing.\n● **El Paso carrier** — Fuel surcharge added Oct 1. Under renegotiation before Q4 peak.\n\nThe two unmatched invoices total **$31K**. If they reconcile, the real marketing overage is only $16K.",

  'backlog':
    "Top backlog risks by dollar impact:\n\n● **Wexler contract — $480K** at risk. Scope misalignment, needs executive escalation this week.\n● **AR aging — $127K** over 90 days. Collections action required now.\n● **IRS payment — $31K** due Nov 15. Confirm coverage before month-end.\n\nTotal backlog exposure: **$659K**. Three items are critical — Wexler, AR, and IRS. Everything else is manageable within the month.",

  'working capital':
    "Working capital snapshot:\n\n● **Current ratio: 2.1x** — healthy, above the 1.5x benchmark\n● **DSO: 42 days** — slightly elevated; $127K in 90+ day AR\n● **DPO: 31 days** — room to extend vendor terms if needed\n● **Cash conversion cycle: 58 days** — manageable but improving AR aging would free ~$80K\n\nThe main lever: collect the $127K in aged AR. That alone improves the cash cycle by ~8 days.",

  'default':
    "I'm your AI CFO for **Apex Industrial Group**, trained on October 2026 financials.\n\nI can answer:\n● Why net income missed plan by $38K\n● The marketing overage root cause\n● Cash position and 8.2-month runway\n● Board talking points\n● Revenue drivers and YoY growth\n● November outlook and priorities\n\nJust ask — or use a quick question below.",
};

export function getStaticResponse(text: string): string {
  const t = text.toLowerCase();

  if (t.includes('ecommerce') || t.includes('e-commerce') || t.includes('digital spend') || t.includes('online spend')) return STATIC_RESPONSES['ecommerce'];
  if (t.includes('vendor') || t.includes('altitude') || t.includes('westcoast') || t.includes('shipbob') || t.includes('invoice') || t.includes('supplier')) return STATIC_RESPONSES['vendors'];
  if (t.includes('marketing') || t.includes('overage') || t.includes('campaign') || t.includes('influencer') || t.includes('agency') || t.includes('ad spend')) return STATIC_RESPONSES['marketing'];
  if (t.includes('net income') || t.includes('profit') || t.includes('below budget') || t.includes('miss') || t.includes('below plan') || t.includes('income down')) return STATIC_RESPONSES['net income'];
  if (t.includes('november') || t.includes('next month') || t.includes('priorit') || t.includes('what should we') || t.includes('action item')) return STATIC_RESPONSES['november'];
  if (t.includes('runway')) return STATIC_RESPONSES['runway'];
  if (t.includes('working capital') || t.includes('dso') || t.includes('dpo') || t.includes('cash cycle') || t.includes('nwc')) return STATIC_RESPONSES['working capital'];
  if (t.includes('cash') || t.includes('liquidity') || t.includes('burn rate')) return STATIC_RESPONSES['cash'];
  if (t.includes('board') || t.includes('executive summary') || t.includes('tell the board') || t.includes('investor')) return STATIC_RESPONSES['board'];
  if (t.includes('attention') || t.includes('top risk') || t.includes('needs attention')) return STATIC_RESPONSES['board'];
  if (t.includes('backlog') || t.includes('wexler') || t.includes('pipeline items') || t.includes('at risk')) return STATIC_RESPONSES['backlog'];
  if (t.includes('ship') || t.includes('fulfillment') || t.includes('freight') || t.includes('logistic') || t.includes('3pl')) return STATIC_RESPONSES['shipping'];
  if (t.includes('revenue') || t.includes('sales') || t.includes('dtc') || t.includes('wholesale') || t.includes('top line') || t.includes('beat')) return STATIC_RESPONSES['revenue'];
  if (t.includes('variance') || t.includes('budget vs') || t.includes('favorable') || t.includes('unfavorable')) return STATIC_RESPONSES['variance'];
  if (t.includes('margin') || t.includes('gross profit') || t.includes('gross margin') || t.includes('cogs')) return STATIC_RESPONSES['margin'];
  if (t.includes('forecast') || t.includes('projection') || t.includes('outlook') || t.includes('full year')) return STATIC_RESPONSES['forecast'];
  if (t.includes('scenario') || t.includes('what if') || t.includes('downside') || t.includes('best case') || t.includes('worst case')) return STATIC_RESPONSES['scenario'];
  if (t.includes('yoy') || t.includes('year over') || t.includes('year-over') || t.includes('last year')) return STATIC_RESPONSES['yoy'];
  if (t.includes('mom') || t.includes('month over') || t.includes('last month') || t.includes('september')) return STATIC_RESPONSES['mom'];
  if (t.includes('market') || t.includes('benchmark') || t.includes('industry') || t.includes('competitor') || t.includes('peer')) return STATIC_RESPONSES['market'];

  return STATIC_RESPONSES['default'];
}
