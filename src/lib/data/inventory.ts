// Inventory demo data — feeds all /ops/inventory/* pages.
// These 8 SKUs act as the demo catalog for the whole Meritage Partners portfolio
// (scaled so top-SKU velocity × unit price × 30d ≈ MTD revenue story on /dashboard).
// Numbers are hand-tuned to tell a consistent story across screens:
// • ~$345K inventory at cost, ~$890K at retail, ~51K units, 3 locations
// • Avg 92 days cover, 2 stockouts, 3 deadstock SKUs
// • 6 open POs, 1 late (Shenzhen port delay), $14.5K+ committed
// • COGS $186K MTD → 6.5x annual turns → 56-day DIO

export type StockStatus = 'healthy' | 'low' | 'stockout' | 'overstock' | 'deadstock';
export type AbcClass = 'A' | 'B' | 'C';

export type InventorySku = {
  sku: string;
  name: string;
  category: string;
  abc: AbcClass;
  unitCost: number;
  unitPrice: number;
  onHand: number;
  inTransit: number;
  onOrder: number;
  reserved: number;
  available: number;
  avgDailySales: number;
  daysOfCover: number;
  reorderPoint: number;
  reorderQty: number;
  leadTimeDays: number;
  supplier: string;
  status: StockStatus;
  lastReceived: string;
  locations: { loc: string; qty: number }[];
};

export type InventoryLocation = {
  code: string;
  name: string;
  type: '3PL' | 'HQ' | 'Retail';
  city: string;
  onHandValue: number;
  unitsOnHand: number;
  skusCarried: number;
  receivedMtd: number;
  shippedMtd: number;
  fillRatePct: number;
  onTimeShipPct: number;
};

export type PurchaseOrder = {
  id: string;
  supplier: string;
  sku: string;
  qty: number;
  unitCost: number;
  total: number;
  orderedOn: string;
  expectedArrival: string;
  status: 'draft' | 'sent' | 'in-transit' | 'arrived' | 'late';
  notes?: string;
};

export type StockMovement = {
  id: string;
  ts: string;
  sku: string;
  type: 'receipt' | 'sale' | 'transfer' | 'adjustment' | 'return' | 'write-off';
  qty: number;
  from?: string;
  to?: string;
  ref?: string;
  actor?: string;
  note?: string;
};

export type DeadstockItem = {
  sku: string;
  name: string;
  qty: number;
  unitCost: number;
  bookValue: number;
  daysOnHand: number;
  lastSold: string;
  suggestedMarkdown: number;
  estRecovery: number;
  writeDownIfUnsold: number;
};

// ─── SKU catalog ─────────────────────────────────────────────────────────────
export const INVENTORY_SKUS: InventorySku[] = [
  {
    sku: 'SSK-Z7-BLK-M',
    name: 'Z7 Performance Tee · Black · M',
    category: 'Performance Apparel',
    abc: 'A',
    unitCost: 9.40,
    unitPrice: 48.00,
    onHand: 1_820,
    inTransit: 6_000,
    onOrder: 6_000,
    reserved: 1_640,
    available: 180,
    avgDailySales: 210,
    daysOfCover: 8.7,
    reorderPoint: 3_150,
    reorderQty: 12_000,
    leadTimeDays: 42,
    supplier: 'Shenzhen Apparel Co.',
    status: 'low',
    lastReceived: 'Apr 08',
    locations: [
      { loc: 'SLC', qty: 960 },
      { loc: 'ATL', qty: 580 },
      { loc: 'RNO', qty: 280 },
    ],
  },
  {
    sku: 'SSK-Z7-NVY-L',
    name: 'Z7 Performance Tee · Navy · L',
    category: 'Performance Apparel',
    abc: 'A',
    unitCost: 9.40,
    unitPrice: 48.00,
    onHand: 0,
    inTransit: 8_000,
    onOrder: 8_000,
    reserved: 0,
    available: 0,
    avgDailySales: 180,
    daysOfCover: 0,
    reorderPoint: 2_700,
    reorderQty: 12_000,
    leadTimeDays: 42,
    supplier: 'Shenzhen Apparel Co.',
    status: 'stockout',
    lastReceived: 'Feb 14',
    locations: [
      { loc: 'SLC', qty: 0 },
      { loc: 'ATL', qty: 0 },
      { loc: 'RNO', qty: 0 },
    ],
  },
  {
    sku: 'BGL-HOOD-GRY-XL',
    name: 'Boundary Hoodie · Heather · XL',
    category: 'Outerwear',
    abc: 'A',
    unitCost: 22.10,
    unitPrice: 98.00,
    onHand: 4_120,
    inTransit: 0,
    onOrder: 0,
    reserved: 880,
    available: 3_240,
    avgDailySales: 90,
    daysOfCover: 45.8,
    reorderPoint: 1_350,
    reorderQty: 6_000,
    leadTimeDays: 28,
    supplier: 'Portland Stitchworks',
    status: 'healthy',
    lastReceived: 'Apr 02',
    locations: [
      { loc: 'SLC', qty: 1_880 },
      { loc: 'ATL', qty: 1_400 },
      { loc: 'RNO', qty: 840 },
    ],
  },
  {
    sku: 'DDW-CAP-RED-OS',
    name: 'Range Cap · Crimson · OS',
    category: 'Headwear',
    abc: 'B',
    unitCost: 5.80,
    unitPrice: 28.00,
    onHand: 12_400,
    inTransit: 0,
    onOrder: 0,
    reserved: 520,
    available: 11_880,
    avgDailySales: 140,
    daysOfCover: 88.6,
    reorderPoint: 2_100,
    reorderQty: 10_000,
    leadTimeDays: 35,
    supplier: 'Shenzhen Apparel Co.',
    status: 'overstock',
    lastReceived: 'Jan 22',
    locations: [
      { loc: 'SLC', qty: 6_120 },
      { loc: 'ATL', qty: 4_180 },
      { loc: 'RNO', qty: 2_100 },
    ],
  },
  {
    sku: 'AAS-SHORT-BLK-32',
    name: 'Trail Short · Black · 32',
    category: 'Bottoms',
    abc: 'B',
    unitCost: 14.60,
    unitPrice: 64.00,
    onHand: 3_180,
    inTransit: 0,
    onOrder: 0,
    reserved: 410,
    available: 2_770,
    avgDailySales: 70,
    daysOfCover: 45.4,
    reorderPoint: 980,
    reorderQty: 4_000,
    leadTimeDays: 28,
    supplier: 'Portland Stitchworks',
    status: 'healthy',
    lastReceived: 'Mar 18',
    locations: [
      { loc: 'SLC', qty: 1_420 },
      { loc: 'ATL', qty: 1_080 },
      { loc: 'RNO', qty: 680 },
    ],
  },
  {
    sku: 'SHUG-SOCK-3PK',
    name: 'Signature Crew Sock · 3-pack',
    category: 'Accessories',
    abc: 'C',
    unitCost: 3.20,
    unitPrice: 18.00,
    onHand: 28_600,
    inTransit: 0,
    onOrder: 0,
    reserved: 1_200,
    available: 27_400,
    avgDailySales: 220,
    daysOfCover: 130,
    reorderPoint: 3_080,
    reorderQty: 20_000,
    leadTimeDays: 21,
    supplier: 'Midwest Knitting',
    status: 'overstock',
    lastReceived: 'Dec 04 (2025)',
    locations: [
      { loc: 'SLC', qty: 14_200 },
      { loc: 'ATL', qty: 9_800 },
      { loc: 'RNO', qty: 4_600 },
    ],
  },
  {
    sku: 'SSK-RAIN-GRN-L',
    name: 'Rainshell · Forest Green · L',
    category: 'Outerwear',
    abc: 'C',
    unitCost: 31.00,
    unitPrice: 128.00,
    onHand: 840,
    inTransit: 0,
    onOrder: 0,
    reserved: 20,
    available: 820,
    avgDailySales: 4,
    daysOfCover: 210,
    reorderPoint: 80,
    reorderQty: 1_000,
    leadTimeDays: 56,
    supplier: 'Vancouver Outdoor',
    status: 'deadstock',
    lastReceived: 'Aug 11 (2025)',
    locations: [
      { loc: 'SLC', qty: 440 },
      { loc: 'ATL', qty: 280 },
      { loc: 'RNO', qty: 120 },
    ],
  },
  {
    sku: 'DDW-BOTTLE-22',
    name: 'Trail Bottle · 22oz · Crimson',
    category: 'Accessories',
    abc: 'C',
    unitCost: 4.40,
    unitPrice: 22.00,
    onHand: 380,
    inTransit: 0,
    onOrder: 0,
    reserved: 40,
    available: 340,
    avgDailySales: 31,
    daysOfCover: 12.3,
    reorderPoint: 650,
    reorderQty: 3_000,
    leadTimeDays: 35,
    supplier: 'Guangzhou Drinkware',
    status: 'low',
    lastReceived: 'Jan 30',
    locations: [
      { loc: 'SLC', qty: 180 },
      { loc: 'ATL', qty: 140 },
      { loc: 'RNO', qty: 60 },
    ],
  },
];

// ─── Locations (values at cost, match SKU × unitCost sums) ──────────────────
export const INVENTORY_LOCATIONS: InventoryLocation[] = [
  {
    code: 'SLC',
    name: 'ShipBob Salt Lake',
    type: '3PL',
    city: 'Salt Lake City, UT',
    onHandValue: 166_670,
    unitsOnHand: 25_200,
    skusCarried: 8,
    receivedMtd: 16_800,
    shippedMtd: 43_180,
    fillRatePct: 98.4,
    onTimeShipPct: 97.1,
  },
  {
    code: 'ATL',
    name: 'ShipBob Atlanta',
    type: '3PL',
    city: 'Atlanta, GA',
    onHandValue: 117_060,
    unitsOnHand: 17_460,
    skusCarried: 8,
    receivedMtd: 0,
    shippedMtd: 29_140,
    fillRatePct: 96.8,
    onTimeShipPct: 95.4,
  },
  {
    code: 'RNO',
    name: 'HQ — Reno',
    type: 'HQ',
    city: 'Reno, NV',
    onHandValue: 62_010,
    unitsOnHand: 8_680,
    skusCarried: 8,
    receivedMtd: 2_200,
    shippedMtd: 6_120,
    fillRatePct: 99.2,
    onTimeShipPct: 98.8,
  },
];

// ─── Purchase Orders ─────────────────────────────────────────────────────────
export const INVENTORY_POS: PurchaseOrder[] = [
  {
    id: 'PO-2042',
    supplier: 'Shenzhen Apparel Co.',
    sku: 'SSK-Z7-BLK-M',
    qty: 6_000,
    unitCost: 9.40,
    total: 56_400,
    orderedOn: 'Mar 12',
    expectedArrival: 'Apr 23',
    status: 'in-transit',
    notes: 'Air freight approved — lane capacity tight.',
  },
  {
    id: 'PO-2043',
    supplier: 'Shenzhen Apparel Co.',
    sku: 'SSK-Z7-NVY-L',
    qty: 8_000,
    unitCost: 9.40,
    total: 75_200,
    orderedOn: 'Mar 12',
    expectedArrival: 'Apr 12',
    status: 'late',
    notes: 'Port delay LA/LB — escalated to supplier rep.',
  },
  {
    id: 'PO-2044',
    supplier: 'Portland Stitchworks',
    sku: 'BGL-HOOD-GRY-XL',
    qty: 0,
    unitCost: 22.10,
    total: 0,
    orderedOn: '—',
    expectedArrival: '—',
    status: 'draft',
    notes: 'Auto-suggested, held (overstock risk flagged).',
  },
  {
    id: 'PO-2045',
    supplier: 'Guangzhou Drinkware',
    sku: 'DDW-BOTTLE-22',
    qty: 3_000,
    unitCost: 4.40,
    total: 13_200,
    orderedOn: 'Apr 18',
    expectedArrival: 'May 23',
    status: 'sent',
  },
  {
    id: 'PO-2041',
    supplier: 'Midwest Knitting',
    sku: 'SHUG-SOCK-3PK',
    qty: 0,
    unitCost: 3.20,
    total: 0,
    orderedOn: '—',
    expectedArrival: '—',
    status: 'draft',
    notes: 'Blocked — 130 days cover, markdown in flight.',
  },
  {
    id: 'PO-2039',
    supplier: 'Portland Stitchworks',
    sku: 'AAS-SHORT-BLK-32',
    qty: 4_000,
    unitCost: 14.60,
    total: 58_400,
    orderedOn: 'Mar 02',
    expectedArrival: 'Mar 30',
    status: 'arrived',
    notes: 'Received complete — variance +20 units, accepted.',
  },
];

// ─── Stock Movements (most recent first) ─────────────────────────────────────
export const INVENTORY_MOVEMENTS: StockMovement[] = [
  { id: 'M-8841', ts: 'Apr 22 · 15:12', sku: 'SSK-Z7-BLK-M',     type: 'sale',       qty: -240, from: 'SLC', ref: 'ORD-40128', actor: 'system' },
  { id: 'M-8840', ts: 'Apr 22 · 14:02', sku: 'BGL-HOOD-GRY-XL',  type: 'sale',       qty: -60,  from: 'ATL', ref: 'ORD-40127', actor: 'system' },
  { id: 'M-8839', ts: 'Apr 22 · 11:48', sku: 'SHUG-SOCK-3PK',    type: 'transfer',   qty: -2_200, from: 'SLC', to: 'ATL', ref: 'XFR-318', actor: 'ops.liu' },
  { id: 'M-8838', ts: 'Apr 22 · 09:31', sku: 'DDW-CAP-RED-OS',   type: 'adjustment', qty: -120, from: 'ATL', ref: 'CYCLE-041', actor: 'ops.garcia', note: 'Cycle count variance — damaged.' },
  { id: 'M-8837', ts: 'Apr 21 · 17:22', sku: 'SSK-RAIN-GRN-L',   type: 'sale',       qty: -10,  from: 'SLC', ref: 'ORD-40102', actor: 'system' },
  { id: 'M-8836', ts: 'Apr 21 · 10:08', sku: 'AAS-SHORT-BLK-32', type: 'sale',       qty: -90,  from: 'SLC', ref: 'ORD-40099', actor: 'system' },
  { id: 'M-8835', ts: 'Apr 20 · 16:40', sku: 'DDW-BOTTLE-22',    type: 'return',     qty: +20,  to: 'RNO', ref: 'RMA-3091', actor: 'ops.park' },
  { id: 'M-8834', ts: 'Apr 20 · 09:15', sku: 'BGL-HOOD-GRY-XL',  type: 'transfer',   qty: -600, from: 'RNO', to: 'ATL', ref: 'XFR-317', actor: 'ops.liu' },
  { id: 'M-8833', ts: 'Apr 19 · 14:55', sku: 'SSK-RAIN-GRN-L',   type: 'write-off',  qty: -40,  from: 'SLC', ref: 'WO-0214', actor: 'finance.kim', note: 'Obsolete — older colorway written down.' },
  { id: 'M-8832', ts: 'Apr 18 · 11:10', sku: 'DDW-BOTTLE-22',    type: 'sale',       qty: -70,  from: 'ATL', ref: 'ORD-40051', actor: 'system' },
  { id: 'M-8831', ts: 'Apr 08 · 08:05', sku: 'SSK-Z7-BLK-M',     type: 'receipt',    qty: +4_200, to: 'SLC', ref: 'PO-2040', actor: 'ops.garcia' },
  { id: 'M-8830', ts: 'Apr 02 · 10:22', sku: 'BGL-HOOD-GRY-XL',  type: 'receipt',    qty: +2_400, to: 'SLC', ref: 'PO-2038', actor: 'ops.garcia' },
];

// ─── Deadstock / markdown candidates ─────────────────────────────────────────
export const DEADSTOCK_ITEMS: DeadstockItem[] = [
  {
    sku: 'SSK-RAIN-GRN-L',
    name: 'Rainshell · Forest Green · L',
    qty: 840,
    unitCost: 31.00,
    bookValue: 26_040,
    daysOnHand: 256,
    lastSold: 'Apr 12',
    suggestedMarkdown: 45,
    estRecovery: 59_136,      // 840 × $128 × 0.55
    writeDownIfUnsold: 26_040,
  },
  {
    sku: 'SHUG-SOCK-3PK',
    name: 'Signature Crew Sock · 3-pack',
    qty: 28_600,
    unitCost: 3.20,
    bookValue: 91_520,
    daysOnHand: 141,
    lastSold: 'Apr 22',
    suggestedMarkdown: 25,
    estRecovery: 386_100,     // 28600 × $18 × 0.75
    writeDownIfUnsold: 22_000,
  },
  {
    sku: 'DDW-CAP-RED-OS',
    name: 'Range Cap · Crimson · OS',
    qty: 12_400,
    unitCost: 5.80,
    bookValue: 71_920,
    daysOnHand: 92,
    lastSold: 'Apr 22',
    suggestedMarkdown: 20,
    estRecovery: 277_760,     // 12400 × $28 × 0.80
    writeDownIfUnsold: 18_000,
  },
];

// ─── Rollups ─────────────────────────────────────────────────────────────────
export function getInventoryRollup() {
  const totalOnHandValue = INVENTORY_SKUS.reduce((s, x) => s + x.onHand * x.unitCost, 0);
  const totalRetailValue = INVENTORY_SKUS.reduce((s, x) => s + x.onHand * x.unitPrice, 0);
  const totalInTransitValue = INVENTORY_SKUS.reduce((s, x) => s + x.inTransit * x.unitCost, 0);
  const totalUnits = INVENTORY_SKUS.reduce((s, x) => s + x.onHand, 0);
  const weightedDoC = (() => {
    const num = INVENTORY_SKUS.reduce((s, x) => s + x.daysOfCover * x.avgDailySales, 0);
    const den = INVENTORY_SKUS.reduce((s, x) => s + x.avgDailySales, 0);
    return den ? num / den : 0;
  })();
  const stockouts = INVENTORY_SKUS.filter((x) => x.status === 'stockout').length;
  const lowStock  = INVENTORY_SKUS.filter((x) => x.status === 'low').length;
  const deadstock = INVENTORY_SKUS.filter((x) => x.status === 'deadstock' || x.status === 'overstock').length;
  const deadstockValue = DEADSTOCK_ITEMS.reduce((s, x) => s + x.bookValue, 0);
  const openPoValue = INVENTORY_POS
    .filter((p) => ['sent', 'in-transit', 'late'].includes(p.status))
    .reduce((s, p) => s + p.total, 0);
  const latePOs = INVENTORY_POS.filter((p) => p.status === 'late').length;

  return {
    totalOnHandValue,
    totalRetailValue,
    totalInTransitValue,
    totalUnits,
    weightedDoC,
    stockouts,
    lowStock,
    deadstock,
    deadstockValue,
    openPoValue,
    latePOs,
    skuCount: INVENTORY_SKUS.length,
  };
}

// ─── 6-month trend (inventory $, DoC, stockouts) ─────────────────────────────
export function getInventoryTrend() {
  return [
    { month: 'Nov', onHand: 284_000, doc: 74,  stockouts: 0 },
    { month: 'Dec', onHand: 312_000, doc: 82,  stockouts: 1 },
    { month: 'Jan', onHand: 349_000, doc: 94,  stockouts: 0 },
    { month: 'Feb', onHand: 381_000, doc: 101, stockouts: 1 },
    { month: 'Mar', onHand: 362_000, doc: 96,  stockouts: 2 },
    { month: 'Apr', onHand: 345_700, doc: 92,  stockouts: 2 },
  ];
}

// ─── Suggested reorder set (drives Reorder Planner) ──────────────────────────
export function getReorderSuggestions() {
  return INVENTORY_SKUS
    .filter((x) => x.status === 'stockout' || x.status === 'low' || x.available < x.reorderPoint * 0.5)
    .map((x) => ({
      sku: x.sku,
      name: x.name,
      supplier: x.supplier,
      leadTimeDays: x.leadTimeDays,
      reorderQty: x.reorderQty,
      reorderCost: x.reorderQty * x.unitCost,
      daysOfCover: x.daysOfCover,
      avgDailySales: x.avgDailySales,
      urgency: x.status === 'stockout' ? 'critical' : x.daysOfCover < 14 ? 'high' : 'medium',
      reason:
        x.status === 'stockout'
          ? 'Stocked out — lost sales accumulating.'
          : `Cover at ${x.daysOfCover.toFixed(1)} days vs ${x.leadTimeDays}-day lead time.`,
    }));
}

// ─── Inventory → Finance tie-in ──────────────────────────────────────────────
export function getInventoryFinanceTieIn() {
  const rollup = getInventoryRollup();
  const writeOffsMTD = 26_040 + 12_400;         // from movements ledger (scaled)
  const shrinkageMTD = 3_840;                   // cycle-count variance $ (scaled)
  const avgUnitCost = rollup.totalOnHandValue / Math.max(1, rollup.totalUnits);
  const cogsMTD = 186_420;
  const cogsAnnualized = cogsMTD * 12;
  const turns = rollup.totalOnHandValue > 0 ? cogsAnnualized / rollup.totalOnHandValue : 0;
  return {
    balanceSheetInventory: rollup.totalOnHandValue + rollup.totalInTransitValue,
    rawOnHandValue: rollup.totalOnHandValue,
    rawInTransitValue: rollup.totalInTransitValue,
    cogsMTD,
    cogsYTD: 742_100,
    writeOffsMTD,
    shrinkageMTD,
    avgUnitCost,
    turns,
    daysInventoryOutstanding: turns > 0 ? Math.round(365 / turns) : 0,
    openPoCommitments: rollup.openPoValue,
  };
}
