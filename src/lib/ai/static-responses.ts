// Smart static CFO responses — keyword matched, used as fallback when no API key is set.
// All responses are written from a CFO perspective reviewing October 2024 financials
// for Apex Industrial Group, a DTC + wholesale outdoor footwear brand.

export const STATIC_RESPONSES: Record<string, string> = {

  'net income':
    "Net income came in at $71,400 — $37,800 below our $109,200 plan (–34.6%). The miss is entirely marketing-driven.\n\nRevenue actually beat plan by +$41,600 and COGS came in $5,500 favorable. We won on the top line and the cost of goods. But a $47,200 marketing overage erased both wins and then some.\n\nThe two unreconciled vendor payments — $18K to Altitude Creative and $13K to WestCoast Influencers — account for $31K of the overage with no matched campaign ID in the system. Until those are tied to approved deliverables, I recommend flagging them for CFO review before the next vendor payment run.",

  'marketing':
    "Marketing ran $171,200 versus a $124,000 budget — $47,200 over, the largest monthly overage in 14 months.\n\nBreakdown of the overage:\n● $18,000 — Altitude Creative (creative agency). Paid, but not matched to any active campaign PO at month-end.\n● $13,000 — WestCoast Influencers LLC (influencer firm). Same issue — paid with no matched campaign record.\n● $16,200 — Approved spend: Google Ads performance campaigns and incremental paid social.\n\nAction required: Hold Altitude Creative and WestCoast Influencers on the re-engagement list until campaign attribution is confirmed. If both invoices clear as legitimate Q4 brand spend, the overage shrinks to $16,200 — manageable. If they can't be matched, it's a controls issue.",

  'ecommerce':
    "DTC / ecommerce spend ran high in October because of two things:\n\n1. The Oct 12 email campaign — $0 incremental cost but drove $28,400 above-budget DTC revenue at a 14% conversion rate with no discounting. That's efficient spend.\n\n2. The unreconciled influencer and creative agency invoices ($31K combined) sit inside the marketing line and inflated the apparent ecommerce cost basis. $18K to Altitude Creative and $13K to WestCoast Influencers both lack campaign IDs — they're paid but unmatched.\n\nOnce those two are reconciled, ecommerce efficiency looks significantly better. The channel itself is performing; the cost controls around agency partners need tightening.",

  'cash':
    "Current cash position: $873,500. At our trailing 3-month average burn rate, that's approximately 8.2 months of runway — healthy, no immediate liquidity concern.\n\nNovember cash events to watch:\n● Salesforce renewal: +$22K expense (was pushed from October)\n● Full ShipBob savings: +$14K/month begins (only half-month in October)\n● Net impact: roughly –$8K on a cash basis\n\nIf October's marketing overage was a one-time spike, November should look cleaner. If the $171K marketing run rate continues, runway tightens faster than modeled — that's the scenario to stress-test.",

  'runway':
    "Cash on hand: $873,500 — roughly 8.2 months of runway at trailing burn.\n\nNovember has two offsetting events: Salesforce renewal adds $22K of expense, while full ShipBob savings adds back $14K/month. Net: approximately neutral.\n\nThe key variable is marketing. October's $171K rate — if it becomes the new normal — compresses net income by ~$47K/month versus plan, which shortens the runway estimate meaningfully. If marketing normalizes to the $124K budget, runway stays above 8 months through Q1.",

  'board':
    "Three things for the board this month:\n\n1. Net income miss — $37,800 below plan, but the cause is isolated: a $47,200 marketing overage with two unreconciled vendor payments. Revenue and gross margin both beat. This is a controls story, not a demand story.\n\n2. Cash is healthy — $873,500, 8.2 months of runway. No funding urgency. November cash flow looks neutral with Salesforce renewal offset by ShipBob savings.\n\n3. Revenue momentum is real — +18.4% YoY growth, DTC conversion above benchmark, and the October email campaign showed the channel can scale without discounting.\n\nThe one ask: authorize CFO review of Altitude Creative and WestCoast Influencers invoices before next vendor run.",

  'revenue':
    "Revenue beat plan by $41,600 (+3.3% vs budget). Two drivers:\n\n● DTC: +$28,400 above budget. The October 12 email campaign drove a 14% conversion rate with no discounting — best conversion since launch. This was efficient, margin-accretive growth.\n\n● Wholesale: +$13,200. Scheels pulled forward a Q4 floor reset reorder. Important caveat: this was an acceleration of a future purchase, not incremental demand. Watch November wholesale for a potential shortfall if they don't reorder on their normal cycle.\n\nYoY revenue is +18.4%, well above the outdoor footwear industry median of ~11%.",

  'variance':
    "Material variances this month — favorable first:\n\n✅ Fulfillment: +$14,300 favorable — new ShipBob contract took effect mid-October. Full benefit hits in November.\n✅ Revenue: +$41,600 favorable — DTC campaign and Scheels pull-forward.\n✅ Technology: +$4,200 favorable — Salesforce renewal pushed to November.\n\n❌ Marketing: –$47,200 unfavorable — two vendor payments ($31K) not matched to campaigns, plus $16K approved overrun.\n❌ Materials: –$8,800 unfavorable — El Paso warehouse carrier fuel surcharge effective October 1.\n\nNet: marketing is the only structural concern. Fulfillment and tech are timing items that self-correct in November.",

  'margin':
    "Gross margin came in at 45.1% — 40 basis points above plan and 120 basis points above the same period last year.\n\nTwo drivers of improvement:\n1. DTC mix shift — the email campaign drove higher DTC volume, which carries better margin than wholesale.\n2. ShipBob savings — new contract reduced per-unit fulfillment cost starting mid-October.\n\nIf DTC mix holds through Q4 and ShipBob runs at full volume, we're tracking toward a 45.5–46% gross margin exit — above the 44.7% full-year target.",

  'forecast':
    "At current trajectory — 3% month-over-month revenue growth, 54.9% COGS, OpEx returning to budget — we're projecting:\n\n● 12-month forward revenue: ~$16.8M annualized run rate\n● Projected net income margin: 13–14%\n● Cash position remains above 6 months runway through the forecast period\n\nThe critical assumption is marketing normalizing from $171K back to the $124K budget. If October's rate continues for 3 more months, full-year net income compresses by ~$400K and the margin projection drops to 10–11%.\n\nBest case scenario — landing the 3 prospective enterprise clients currently in pipeline — adds ~$6M in net new ARR and pushes the run rate toward $22M.",

  'scenario':
    "Four scenarios modeled:\n\n🟢 Best Case — Land enterprise pipeline ($6M new ARR), 5% organic growth: Exit run rate $22M+, NI margin 16%+\n🔵 Base Case — 3% MoM growth, marketing normalizes: $16.8M run rate, 13–14% NI margin\n🟡 Conservative — 1% growth, COGS creeps to 57%: $13.8M run rate, 9–10% margin\n🔴 Downside — –2% MoM, wholesale churn 10%: Runway drops below 6 months by Q2 2025\n\nThe downside requires both revenue weakness and the October marketing overage to become a structural run rate — both would need to materialize simultaneously. Low probability, but worth having the playbook ready.",

  'yoy':
    "Year-over-year through October:\n\n● Revenue: +18.4% (vs. industry median ~11%) ✅\n● Gross margin: 45.1% vs. 43.9% last year (+120bps) ✅\n● Net income margin: 5.4% vs. 8.2% last year — compressed by marketing ⚠️\n● OpEx growth: +22% YoY — ahead of revenue growth, driven by marketing and sales headcount added in Q1\n\nThe margin compression is new this year and entirely attributable to October's marketing overage. Strip that out and we're running at ~8% NI margin — consistent with last year. This is a cost controls story, not a business deterioration story.",

  'mom':
    "Month-over-month (September → October):\n\n● Revenue: +3.1% — healthy, on trend\n● Gross profit: +4.2% — margin expansion from DTC mix shift\n● OpEx: +11.7% — driven entirely by the $47K marketing overage\n● Net income: –34% — September was a clean month at $108K NI\n\nBefore calling October a trend, the question is whether the $47K marketing spend was a one-time campaign surge or a new run rate. The two unreconciled vendor invoices suggest it may be a one-time anomaly. November's marketing budget is locked at $124K — that's the test.",

  'november':
    "November preview — three things to watch:\n\n1. Marketing must normalize — budget is $124K. October ran $171K. The $47K overage needs to stay in October. If Altitude Creative and WestCoast Influencers are re-engaged at the same rate, the problem compounds.\n\n2. Salesforce renewal hits November 1 — $22K one-time charge. Already in the November budget.\n\n3. Full ShipBob benefit begins — $14K/month savings at full volume (only partial in October). This offsets most of the Salesforce hit.\n\nIf marketing normalizes, November net income should recover to $100K+. That's the number to watch.",

  'shipping':
    "Fulfillment came in $14,300 favorable against budget — the new ShipBob contract took effect mid-October at a lower per-unit rate. Full-month benefit starts in November (+$14K/month).\n\nOn the flip side, Materials & Production ran $8,800 over budget due to an unbudgeted freight surcharge at our El Paso warehouse — a carrier fuel surcharge that went into effect October 1. We're evaluating alternative carriers before Q4 holiday volume ramps.\n\nNet fulfillment picture is favorable. ShipBob is performing as modeled.",

  'market':
    "Competitive position — October 2024:\n\n● Revenue growth: +18.4% (industry median: 11%) — top quartile ✅\n● Gross margin: 45.1% (industry median: 41.3%) — above median ✅\n● Net income margin: 5.4% (top quartile: 12%+) — below peers ⚠️\n● Headcount efficiency: +10.5% revenue per employee YoY ✅\n\nThe NI margin gap versus top-quartile peers is entirely October's marketing overage. Strip it out and we're at ~8% — in line with upper-median performance.\n\nMacro tailwinds: consumer outdoor spending remains resilient, DTC channel growth is broad-based across the category. Freight cost pressure is industry-wide — our ShipBob deal gives us a structural cost advantage versus smaller brands still on legacy 3PL contracts.",

  'vendors':
    "Key vendor context for October:\n\n● Altitude Creative — creative agency, Q4 brand campaigns. $18K October payment pending campaign ID reconciliation. Do not re-engage until matched.\n● WestCoast Influencers LLC — influencer marketing. $13K October payment, also unmatched. Hold.\n● ShipBob — 3PL fulfillment partner. New contract effective October 15. Saving $14K/month at full volume. Performing as modeled.\n● El Paso carrier — freight surcharge added October 1. Under review for Q4 renegotiation before holiday peak.\n\nThe two unmatched invoices total $31K. If they're legitimate Q4 campaign spend, the October overage shrinks to $16K — manageable. If they can't be matched to deliverables, it's an AP controls gap.",

  'default':
    "I'm your AI CFO for Apex Industrial Group, trained on October 2024 financials.\n\nHere's what I can answer right now:\n● Why net income missed plan by $38K\n● What's behind the marketing overage\n● Cash position and 8.2-month runway\n● What to tell the board\n● Revenue drivers and YoY growth\n● November outlook and priorities\n\nJust ask — or pick one of the quick questions below.",
};

export function getStaticResponse(text: string): string {
  const t = text.toLowerCase();

  // ── Specific keyword matching — most specific first ────────────────────────

  // Ecommerce / DTC spend questions
  if (t.includes('ecommerce') || t.includes('e-commerce') || t.includes('digital spend') || t.includes('online spend')) return STATIC_RESPONSES['ecommerce'];

  // Vendor / invoice questions
  if (t.includes('vendor') || t.includes('altitude') || t.includes('westcoast') || t.includes('shipbob') || t.includes('invoice') || t.includes('supplier')) return STATIC_RESPONSES['vendors'];

  // Marketing / campaign / agency
  if (t.includes('marketing') || t.includes('overage') || t.includes('campaign') || t.includes('influencer') || t.includes('agency') || t.includes('ad spend') || t.includes('paid social') || t.includes('google ads')) return STATIC_RESPONSES['marketing'];

  // Net income / profit miss
  if (t.includes('net income') || t.includes('income down') || t.includes('profit') || t.includes('below budget') || t.includes('miss') || t.includes('below plan') || t.includes('why is') && t.includes('down')) return STATIC_RESPONSES['net income'];

  // November / priorities / next month
  if (t.includes('november') || t.includes('next month') || t.includes('priorit') || t.includes('what should we') || t.includes('action item') || t.includes('what do we')) return STATIC_RESPONSES['november'];

  // Runway (check before cash — more specific)
  if (t.includes('runway')) return STATIC_RESPONSES['runway'];

  // Cash / liquidity
  if (t.includes('cash') || t.includes('liquidity') || t.includes('burn rate') || t.includes('working capital')) return STATIC_RESPONSES['cash'];

  // Board / executive summary
  if (t.includes('board') || t.includes('risk summary') || t.includes('executive summary') || t.includes('what to present') || t.includes('tell the board') || t.includes('investor')) return STATIC_RESPONSES['board'];

  // Attention / top risks / CEO
  if (t.includes('attention') || t.includes('top risk') || t.includes('ceo report') || t.includes('needs attention')) return STATIC_RESPONSES['board'];

  // Shipping / fulfillment / freight
  if (t.includes('ship') || t.includes('fulfillment') || t.includes('freight') || t.includes('logistic') || t.includes('3pl')) return STATIC_RESPONSES['shipping'];

  // Revenue / sales / DTC / wholesale
  if (t.includes('revenue') || t.includes('sales') || t.includes('dtc') || t.includes('wholesale') || t.includes('top line') || t.includes('above plan') || t.includes('beat')) return STATIC_RESPONSES['revenue'];

  // Variances / budget comparison
  if (t.includes('variance') || t.includes('variances') || t.includes('budget vs') || t.includes('favorable') || t.includes('unfavorable')) return STATIC_RESPONSES['variance'];

  // Margin / COGS / gross profit
  if (t.includes('margin') || t.includes('gross profit') || t.includes('gross margin') || t.includes('cogs') || t.includes('cost of goods')) return STATIC_RESPONSES['margin'];

  // Forecast / outlook / full year
  if (t.includes('forecast') || t.includes('projection') || t.includes('outlook') || t.includes('full year') || t.includes('arr') || t.includes('annual')) return STATIC_RESPONSES['forecast'];

  // Scenarios / what-if
  if (t.includes('scenario') || t.includes('what if') || t.includes('downside') || t.includes('best case') || t.includes('worst case') || t.includes('conservative')) return STATIC_RESPONSES['scenario'];

  // Year-over-year
  if (t.includes('yoy') || t.includes('year over') || t.includes('year-over') || t.includes('last year') || t.includes('vs last year') || t.includes('2023')) return STATIC_RESPONSES['yoy'];

  // Month-over-month
  if (t.includes('mom') || t.includes('month over') || t.includes('month-over') || t.includes('last month') || t.includes('vs september') || t.includes('september')) return STATIC_RESPONSES['mom'];

  // Market / benchmarks / competitors
  if (t.includes('market') || t.includes('benchmark') || t.includes('industry') || t.includes('competitor') || t.includes('peer') || t.includes('rank') || t.includes('compare')) return STATIC_RESPONSES['market'];

  return STATIC_RESPONSES['default'];
}
