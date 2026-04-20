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
    "Three things for the board:\n\n● **Net income missed by $37.8K** — controls story, not demand. Revenue and gross margin both beat. One marketing line, two unreconciled invoices.\n● **Cash is healthy** — $873.5K, 8.2 months runway. November cash flow looks neutral.\n● **Revenue momentum is real** — +18.4% YoY, DTC at 14% conversion, zero discounting.\n\nOne ask: authorize CFO review of Altitude Creative and WestCoast Influencers before next vendor payment run.",

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
    "Working capital snapshot:\n\n● **Current ratio: 2.1x** — healthy, above the 1.5x benchmark\n● **DSO: 42 days** — slightly elevated; $127K in 90+ day AR\n● **DPO: 31 days** — room to extend vendor terms if needed\n● **Cash conversion cycle: 33 days** — manageable but improving AR aging would free ~$80K\n\nThe main lever: collect the $127K in aged AR. That alone improves the cash cycle by ~8 days.",

  // ── New topics ─────────────────────────────────────────────────────────────

  'ebitda':
    "**EBITDA: ~$187K for October** — adding back ~$56K depreciation & amortization to operating income of $130,600.\n\nEBITDA margin: **14.3%** — above the 10–12% range typical for B2B industrial at this scale.\n\n● Trailing 12-month EBITDA: ~$2.1M (annualized October run rate)\n● If marketing normalizes to budget, monthly EBITDA jumps to ~$232K — 17.7% margin\n\nThe headline is healthy. The risk is one line item — hold it there.",

  'opex':
    "**OpEx breakdown — October 2026:**\n\n● Payroll & Benefits: $201,200 (44% of OpEx) — one open SDR role adding ~$3K overage\n● Marketing: $171,200 (37%) — **$47,200 over budget**, the entire problem\n● G&A: $74,100 (16%) — $2,100 over, routine\n● Technology: $14,200 (3%) — $4,200 favorable (Salesforce deferred to November)\n\nTotal OpEx: $460,700 vs $412,400 budget. Strip marketing and we're $700 under. This is a single-line issue.",

  'hiring':
    "**Open headcount: 1 SDR role** — currently adding ~$3,200 of payroll overage (estimated fully-loaded cost at partial month).\n\nRecommendation: fill the role. At our current DTC conversion rate (14%), an incremental SDR targeted at wholesale accounts should generate **$40–60K in net new monthly revenue** within 90 days — well above the ~$8K monthly cost.\n\nRisk of not hiring: the October Scheels pull-forward won't repeat. We need pipeline to defend the November wholesale number.",

  'pricing':
    "No direct pricing variance flagged in October financials — revenue beat came from volume and mix, not rate.\n\nContext:\n● DTC average order value held steady — no discounting on the Oct 12 campaign ✅\n● Wholesale pricing with Scheels is governed by the Q4 contract — no renegotiation risk until renewal\n● Materials cost pressure ($8,800 El Paso freight surcharge) is eating into margin at the input side\n\nRecommendation: evaluate a 2–3% price increase on wholesale for Q1 2027 to offset freight cost creep. At current volume, that's **+$16K/month** in gross profit.",

  'q4':
    "**Q4 2026 setup:**\n\n● October landed +$41,600 above plan — solid base\n● November has Salesforce renewal ($22K) offset by full ShipBob savings ($14K)\n● December is historically DTC-heavy — seasonality should support higher volume\n\nRisk factors:\n● Marketing must normalize or Q4 NI is compressed by ~$140K vs plan\n● Scheels November order may be light after the October pull-forward\n● El Paso freight surcharge is ongoing — renegotiate before peak volume\n\nIf marketing holds at budget, Q4 NI is on track to **exceed the $330K quarterly plan**.",

  'break even':
    "**Monthly break-even: ~$1,155,000 in revenue.**\n\nBased on:\n● Fixed costs (payroll, G&A, tech): ~$289K/month\n● Variable costs (COGS + variable marketing): ~$634K at $1.155M revenue\n● Contribution margin: ~49% at current mix\n\nOctober came in at $1.31M — **$155K above break-even**, generating $71.4K in net income. If revenue dropped to break-even, we'd be cash-flow neutral but burning equity.\n\nThe 8.2-month runway gives ample buffer even in a soft revenue month.",

  'scheels':
    "**Scheels Distribution — #2 wholesale account.**\n\nOctober: $541,200 in wholesale revenue, with Scheels pulling forward a November order (+$13,200 above plan). This acceleration is **not incremental demand** — it was a Q4 floor reset reorder brought forward.\n\nImplication:\n● November wholesale could be $13–20K light vs plan if Scheels doesn't reorder on normal cycle\n● Watch the 30-day wholesale pipeline closely\n● The Scheels relationship is strong but the revenue timing creates short-term lumpiness\n\nLonger term: Scheels accounts for ~18% of total wholesale. Healthy — below the 20% concentration threshold.",

  'customers':
    "**Customer concentration — October 2026:**\n\n● Top customer (MegaCorp / wholesale): ~23.8% of revenue ⚠️ Above 20% threshold\n● Scheels: ~18% of wholesale ✅ Healthy\n● DTC: no single customer > 3% ✅ Well diversified\n\nThe wholesale book has concentration risk at the top. If the #1 wholesale account pulls back 20%, that's ~$60K/month in revenue impact.\n\nAction: accelerate DTC growth and add 1–2 mid-tier wholesale accounts in Q1 to reduce top-account dependency below 20%.",

  'inventory':
    "**Inventory: $520,800** — elevated heading into Q4.\n\n● At current COGS run rate, that's **~22 days of inventory on hand** (DIO)\n● Q4 seasonal demand should absorb the build — if sell-through tracks to plan\n● Risk: if DTC or wholesale miss December targets, excess inventory rolls into January at carrying cost\n\nRecommendation: monitor weekly sell-through starting Nov 1. If December DTC is tracking below plan by week 2, consider a modest promotional push rather than rolling excess inventory into Q1.",

  'ar':
    "**Accounts Receivable: $412,300 total.**\n\n● Current (0–30 days): $285,300 — normal\n● 31–60 days: $98,400 — follow up\n● 61–90 days: $28,600 — escalate\n● **90+ days: $127,000** — priority collections action ⚠️\n\nThe $127K in aged AR is the biggest near-term cash lever. At our DSO of 42 days (vs 35-day target), getting one major account to pay would add **$50–80K to cash** before month-end.\n\nAction: assign collections ownership today — don't let this roll into Q4 close.",

  'ap':
    "**Accounts Payable: $142,800** — DPO currently at ~31 days.\n\nOpportunity: extending DPO to 45 days (still well within vendor tolerance) would **free up ~$65K in working capital** without straining supplier relationships.\n\nVendors to target for extended terms:\n● ShipBob — new contract, strong relationship, may accept net-45\n● El Paso carrier — under active renegotiation anyway\n\nDo not extend terms with Altitude Creative or WestCoast Influencers until invoice reconciliation is resolved.",

  'headcount':
    "**October headcount & payroll:**\n\n● Total payroll: $201,200 — $3,200 over budget\n● Overage: one open SDR seat (partially backfilled with contractor hours this month)\n● All other headcount at plan\n\nFully-loaded cost of the open SDR: **~$7,800/month** at plan. Filling the role in November would normalize payroll and add sales capacity ahead of the Q1 pipeline build.\n\nRevenue per employee (Oct annualized): **$1.47M** — up +10.5% YoY. Team productivity is improving.",

  'tax':
    "**Q3 estimated tax payment: $31,000** — due November 15.\n\nThis is included in the accrued liabilities balance ($98,400 total). Cash on hand ($873,500) covers this easily — no liquidity concern.\n\nFull-year tax estimate: at current NI trajectory ($71.4K/month average), estimated annual NI is ~$857K. At ~28% effective rate, full-year tax liability is approximately **$240K**.\n\nAction: confirm the November 15 payment is queued with the banking team. Don't let a process gap turn a small item into a penalty.",

  'wip':
    "**WIP (Work in Progress): $847,000** across 6 active contracts.\n\n● $1.49M (52% of active WIP) is blocked or at risk\n● **Titan Energy** ($620K contract, $98K WIP) — scope change order stalled at day 44. Needs exec escalation.\n● **Bellco Systems** ($490K contract, $127K WIP) — material delay, 8 days in. Source alternative supplier.\n\nEvery day these stay blocked, billing recognition delays. Resolving Titan and Bellco unlocks **$810K** in contract value for Q4 revenue acceleration.",

  'pipeline':
    "**Sales pipeline — October 2026:**\n\n● Qualified pipeline: $4.2M (3 enterprise prospects + 8 mid-market accounts)\n● Proposal stage: $1.8M — 2 enterprise deals, expected close Q1 2027\n● Backlog (awarded, not started): $2.84M\n\nIf the two enterprise proposals close at 70% of proposed value, that adds **$1.26M** to Q1 2027 backlog — enough to support a 12-month revenue run rate above $18M.\n\nThe pipeline is healthy. The constraint is sales capacity — which is why filling the open SDR role matters now.",

  'cost reduction':
    "**Top cost reduction opportunities right now:**\n\n● **Marketing controls** — tighten campaign PO matching. A $47K overage that's unreconciled is a process gap, not just a budget issue. Fixing the controls prevents recurrence.\n● **El Paso freight** — renegotiate before Q4 peak. Carrier market is soft; 10–15% rate reduction is achievable. At current volume, that's **$5–8K/month** in savings.\n● **AP terms extension** — moving from net-31 to net-45 with key vendors frees ~$65K in working capital without cutting spend.\n● **Salesforce utilization** — $22K/year renewal. Audit seat count before November 1 renewal. Any unused seats should be cut.",

  'q1 2027':
    "**Q1 2027 outlook:**\n\n● Revenue target: $1.35–1.40M/month (+3–7% MoM from October)\n● Gross margin: 45–46% if DTC mix holds and ShipBob runs full volume\n● Key risk: January is historically soft for wholesale — ensure DTC pipeline is ready\n\nFor Q1 to hit plan:\n● Close at least one enterprise pipeline account (adds $400–600K to backlog)\n● Marketing must run at $124K budget — no repeat of October\n● Fill SDR role by Dec 1 to ramp in time\n\nBase case Q1 net income: **$105–115K/month** — a meaningful improvement from October's $71K.",

  'default':
    "I'm your AI CFO for **Apex Industrial Group**, trained on October 2026 financials.\n\nI can dig into:\n● Net income miss and marketing overage root cause\n● Cash position, runway, AR/AP analysis\n● EBITDA, break-even, and margin drivers\n● OpEx breakdown and cost reduction opportunities\n● Q4 outlook and Q1 2027 planning\n● Board talking points and executive summary\n● Customer concentration, pipeline health\n● WIP, financial backlog, and billing bottlenecks\n● Hiring, pricing, and inventory decisions\n\nJust ask — or pick a quick question below.",
};

export function getStaticResponse(text: string): string {
  const t = text.toLowerCase();

  // Most specific first
  if (t.includes('ecommerce') || t.includes('e-commerce') || t.includes('digital spend') || t.includes('online spend') || t.includes('dtc spend')) return STATIC_RESPONSES['ecommerce'];
  if (t.includes('vendor') || t.includes('altitude') || t.includes('westcoast') || t.includes('shipbob') || t.includes('invoice') || t.includes('supplier')) return STATIC_RESPONSES['vendors'];
  if (t.includes('scheels')) return STATIC_RESPONSES['scheels'];
  if (t.includes('marketing') || t.includes('overage') || t.includes('campaign') || t.includes('influencer') || t.includes('agency') || t.includes('ad spend')) return STATIC_RESPONSES['marketing'];
  if (t.includes('ebitda')) return STATIC_RESPONSES['ebitda'];
  if (t.includes('break-even') || t.includes('break even') || t.includes('breakeven')) return STATIC_RESPONSES['break even'];
  if (t.includes('net income') || t.includes('profit') || t.includes('below budget') || t.includes('miss') || t.includes('below plan') || t.includes('income down')) return STATIC_RESPONSES['net income'];
  if (t.includes('november') || t.includes('next month') || t.includes('priorit') || t.includes('what should we') || t.includes('action item')) return STATIC_RESPONSES['november'];
  if (t.includes('q4') || t.includes('fourth quarter') || t.includes('q4 outlook') || t.includes('holiday')) return STATIC_RESPONSES['q4'];
  if (t.includes('q1 2027') || t.includes('next quarter') || t.includes('q1 outlook') || t.includes('next year')) return STATIC_RESPONSES['q1 2027'];
  if (t.includes('runway')) return STATIC_RESPONSES['runway'];
  if (t.includes('working capital') || t.includes('dso') || t.includes('dpo') || t.includes('cash cycle') || t.includes('nwc')) return STATIC_RESPONSES['working capital'];
  if (t.includes('accounts receivable') || (t.includes('ar') && (t.includes('aging') || t.includes('aged') || t.includes('collection')))) return STATIC_RESPONSES['ar'];
  if (t.includes('accounts payable') || (t.includes('ap') && (t.includes('terms') || t.includes('vendor') || t.includes('extend')))) return STATIC_RESPONSES['ap'];
  if (t.includes('cash') || t.includes('liquidity') || t.includes('burn rate')) return STATIC_RESPONSES['cash'];
  if (t.includes('board') || t.includes('executive summary') || t.includes('tell the board') || t.includes('investor')) return STATIC_RESPONSES['board'];
  if (t.includes('attention') || t.includes('top risk') || t.includes('needs attention')) return STATIC_RESPONSES['board'];
  if (t.includes('backlog') || t.includes('wexler') || t.includes('pipeline items') || t.includes('at risk')) return STATIC_RESPONSES['backlog'];
  if (t.includes('wip') || t.includes('work in progress') || t.includes('unbilled') || t.includes('billing bottleneck')) return STATIC_RESPONSES['wip'];
  if (t.includes('pipeline') || t.includes('prospet') || t.includes('enterprise deal') || t.includes('sales pipeline')) return STATIC_RESPONSES['pipeline'];
  if (t.includes('ship') || t.includes('fulfillment') || t.includes('freight') || t.includes('logistic') || t.includes('3pl')) return STATIC_RESPONSES['shipping'];
  if (t.includes('opex') || t.includes('operating expense') || t.includes('expense breakdown') || t.includes('cost breakdown')) return STATIC_RESPONSES['opex'];
  if (t.includes('hire') || t.includes('hiring') || t.includes('headcount') || t.includes('sdr') || t.includes('open role') || t.includes('recruit')) return STATIC_RESPONSES['hiring'];
  if (t.includes('payroll') || t.includes('salary') || t.includes('employee cost') || t.includes('staff')) return STATIC_RESPONSES['headcount'];
  if (t.includes('pricing') || t.includes('price increase') || t.includes('rate increase') || t.includes('discount')) return STATIC_RESPONSES['pricing'];
  if (t.includes('inventory') || t.includes('stock') || t.includes('dio') || t.includes('days inventory')) return STATIC_RESPONSES['inventory'];
  if (t.includes('tax') || t.includes('irs') || t.includes('estimated tax') || t.includes('quarterly tax')) return STATIC_RESPONSES['tax'];
  if (t.includes('customer') || t.includes('concentration') || t.includes('top account') || t.includes('megacorp')) return STATIC_RESPONSES['customers'];
  if (t.includes('cost reduction') || t.includes('cut cost') || t.includes('save money') || t.includes('reduce spend') || t.includes('efficiency')) return STATIC_RESPONSES['cost reduction'];
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
