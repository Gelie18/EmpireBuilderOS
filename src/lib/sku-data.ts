/**
 * SKU-level demo data keyed by subco id. Drives the SKU Rationalization page.
 *
 * Each subco has 15–25 real-feeling SKUs spread across all 5 segments so every
 * filter tab shows substantive results. Numbers are consistent with each subco's
 * annual revenue envelope in lib/subcos.ts.
 *
 * Topco "Consolidated" merges all subco SKUs into a single table with a
 * brand prefix — no stub row.
 */

export interface Sku {
  sku: string;
  name: string;
  category: string;
  units12M: number;
  revenue12M: number;
  grossMargin: number;        // decimal (0.42 = 42%)
  inventoryUnits: number;
  daysOfCover: number;
  lastSold: string;           // ISO date
  /** 'core' = top-decile revenue, 'tail' = bottom, 'dead' = no sales 90d+, 'bleeder' = negative margin */
  segment: 'core' | 'healthy' | 'tail' | 'dead' | 'bleeder';
  channels: string[];
  /** Subco brand tag — only set on consolidated/topco view */
  brand?: string;
}

export interface SkuBundle {
  subcoId: string;
  totalSkus: number;
  activeSkus: number;
  deadSkus: number;
  bleederSkus: number;
  paretoShare: number;         // decimal — % of revenue from top 20% of SKUs
  tailShare: number;           // decimal — % of revenue from bottom 50% of SKUs
  cashInDeadStock: number;     // USD tied up in dead inventory
  proposedCuts: number;        // SKU count eligible for prune
  marginUpliftPct: number;     // projected GM improvement if cuts executed
  skus: Sku[];
}

function mkSku(s: Partial<Sku> & Pick<Sku, 'sku' | 'name' | 'category' | 'segment'>): Sku {
  return {
    units12M: 0,
    revenue12M: 0,
    grossMargin: 0,
    inventoryUnits: 0,
    daysOfCover: 0,
    lastSold: '2026-04-18',
    channels: ['Shopify (DTC)'],
    ...s,
  } as Sku;
}

// ── SSK Baseball — 22 SKUs ──────────────────────────────────────────────────
const SSK_SKUS: Sku[] = [
  // ── CORE (5) ──
  mkSku({ sku: 'SSK-PS3-1200', name: 'PS3 Pro 12" Infield Glove — Tan', brand: 'SSK', category: 'Gloves', segment: 'core', revenue12M: 1_840_000, grossMargin: 0.44, units12M: 5_420, inventoryUnits: 612, daysOfCover: 41, channels: ['Amazon', 'Shopify (DTC)', 'Wholesale'] }),
  mkSku({ sku: 'SSK-ZL-33',    name: 'Z-Pro BBCOR Bat 33"/30oz',         brand: 'SSK', category: 'Bats',   segment: 'core', revenue12M: 1_260_000, grossMargin: 0.38, units12M: 3_120, inventoryUnits: 488, daysOfCover: 57, channels: ['Amazon', 'Shopify (DTC)'] }),
  mkSku({ sku: 'SSK-BC-PRO',   name: 'Pro Edge Batting Gloves — Black',  brand: 'SSK', category: 'Batting Gloves', segment: 'core', revenue12M: 982_000, grossMargin: 0.52, units12M: 22_400, inventoryUnits: 4_100, daysOfCover: 67, channels: ['Amazon', 'Shopify (DTC)', 'Retail (QB)'] }),
  mkSku({ sku: 'SSK-Z9-1175',  name: 'Z9 Maestro 11.75" Pitcher Glove', brand: 'SSK', category: 'Gloves', segment: 'core', revenue12M: 820_000, grossMargin: 0.46, units12M: 2_480, inventoryUnits: 310, daysOfCover: 46, channels: ['Amazon', 'Shopify (DTC)', 'Wholesale'] }),
  mkSku({ sku: 'SSK-FP5-CM',   name: 'FP5 Fastpitch Catcher Mitt 34"',  brand: 'SSK', category: 'Mitts',  segment: 'core', revenue12M: 614_000, grossMargin: 0.41, units12M: 1_840, inventoryUnits: 220, daysOfCover: 44, channels: ['Amazon', 'Shopify (DTC)'] }),
  // ── HEALTHY (6) ──
  mkSku({ sku: 'SSK-HELM-R1',  name: 'Red Line Batting Helmet',          brand: 'SSK', category: 'Helmets',        segment: 'healthy', revenue12M: 612_000, grossMargin: 0.36, units12M: 8_200, inventoryUnits: 1_150, daysOfCover: 51, channels: ['Amazon', 'Shopify (DTC)'] }),
  mkSku({ sku: 'SSK-FM-CL',    name: "Catcher's Mitt — Classic 32.5\"", brand: 'SSK', category: 'Mitts',           segment: 'healthy', revenue12M: 488_000, grossMargin: 0.42, units12M: 1_820, inventoryUnits: 212, daysOfCover: 42, channels: ['Amazon', 'Shopify (DTC)', 'Wholesale'] }),
  mkSku({ sku: 'SSK-Z7-1150',  name: 'Z7 Specialist 11.5" Infield',     brand: 'SSK', category: 'Gloves',          segment: 'healthy', revenue12M: 440_000, grossMargin: 0.43, units12M: 1_620, inventoryUnits: 198, daysOfCover: 45, channels: ['Amazon', 'Shopify (DTC)'] }),
  mkSku({ sku: 'SSK-BC-WHT',   name: 'Pro Edge Batting Gloves — White', brand: 'SSK', category: 'Batting Gloves',  segment: 'healthy', revenue12M: 318_000, grossMargin: 0.50, units12M: 7_200, inventoryUnits: 1_280, daysOfCover: 65, channels: ['Amazon', 'Shopify (DTC)'] }),
  mkSku({ sku: 'SSK-BAT-WOOD', name: 'Fungo Bat — Maple 36"',           brand: 'SSK', category: 'Bats',            segment: 'healthy', revenue12M: 210_000, grossMargin: 0.39, units12M: 1_180, inventoryUnits: 160, daysOfCover: 50, channels: ['Amazon', 'Shopify (DTC)', 'Wholesale'] }),
  mkSku({ sku: 'SSK-TRN-NET',  name: 'Batting Practice Tee — Pro',      brand: 'SSK', category: 'Training',        segment: 'healthy', revenue12M: 142_000, grossMargin: 0.44, units12M: 4_100, inventoryUnits: 580, daysOfCover: 52, channels: ['Amazon', 'Shopify (DTC)'] }),
  // ── LONG TAIL (5) ──
  mkSku({ sku: 'SSK-TB-YTH',   name: 'Youth T-Ball Combo Pack',          brand: 'SSK', category: 'Youth', segment: 'tail', revenue12M: 41_200, grossMargin: 0.22, units12M: 612, inventoryUnits: 940, daysOfCover: 560, channels: ['Amazon'] }),
  mkSku({ sku: 'SSK-APP-T3',   name: 'SSK Logo Tee — Navy XL',           brand: 'SSK', category: 'Apparel', segment: 'tail', revenue12M: 18_400, grossMargin: 0.18, units12M: 420, inventoryUnits: 2_180, daysOfCover: 1_895, channels: ['Shopify (DTC)'] }),
  mkSku({ sku: 'SSK-CAP-ADJ',  name: 'SSK Adjustable Cap — Black',       brand: 'SSK', category: 'Apparel', segment: 'tail', revenue12M: 14_200, grossMargin: 0.20, units12M: 320, inventoryUnits: 1_640, daysOfCover: 1_872, channels: ['Shopify (DTC)'] }),
  mkSku({ sku: 'SSK-YTH-MED',  name: 'Youth Medium Batting Gloves',      brand: 'SSK', category: 'Batting Gloves', segment: 'tail', revenue12M: 11_800, grossMargin: 0.26, units12M: 280, inventoryUnits: 820, daysOfCover: 1_069, channels: ['Amazon'] }),
  mkSku({ sku: 'SSK-WRG-SPG',  name: 'Wrist Guard — Spring 2023',        brand: 'SSK', category: 'Training', segment: 'tail', revenue12M: 8_200, grossMargin: 0.19, units12M: 180, inventoryUnits: 1_100, daysOfCover: 2_231, channels: ['Amazon'] }),
  // ── BLEEDERS (3) ──
  mkSku({ sku: 'SSK-STK-NBL',  name: 'Neon Batting Gloves 2023 — Youth S', brand: 'SSK', category: 'Batting Gloves', segment: 'bleeder', revenue12M: 9_800, grossMargin: -0.12, units12M: 218, inventoryUnits: 3_400, daysOfCover: 5_700, channels: ['Amazon'] }),
  mkSku({ sku: 'SSK-FP5-PKO',  name: 'FP5 Pink/Orange Colorway',          brand: 'SSK', category: 'Mitts', segment: 'bleeder', revenue12M: 14_200, grossMargin: -0.08, units12M: 140, inventoryUnits: 2_100, daysOfCover: 5_475, channels: ['Shopify (DTC)'] }),
  mkSku({ sku: 'SSK-SOCKS-22', name: 'SSK Branded Socks 3-Pack 2022',     brand: 'SSK', category: 'Apparel', segment: 'bleeder', revenue12M: 5_400, grossMargin: -0.06, units12M: 124, inventoryUnits: 1_800, daysOfCover: 5_306, channels: ['Amazon', 'Shopify (DTC)'] }),
  // ── DEAD (3) ──
  mkSku({ sku: 'SSK-DK-JR',    name: "Pro-Dk Jr. Glove 11.25\" — Disc. Color", brand: 'SSK', category: 'Gloves', segment: 'dead', revenue12M: 0, grossMargin: 0, units12M: 0, inventoryUnits: 1_240, daysOfCover: 9999, lastSold: '2025-08-12', channels: ['Shopify (DTC)'] }),
  mkSku({ sku: 'SSK-BAG-XL',   name: 'Team Bag XL — 2022 Print',           brand: 'SSK', category: 'Equipment Bags', segment: 'dead', revenue12M: 0, grossMargin: 0, units12M: 0, inventoryUnits: 640, daysOfCover: 9999, lastSold: '2025-09-03', channels: ['Amazon', 'Shopify (DTC)'] }),
  mkSku({ sku: 'SSK-TRN-BUN',  name: 'Training Bundle — 2021 Edition',    brand: 'SSK', category: 'Training', segment: 'dead', revenue12M: 0, grossMargin: 0, units12M: 0, inventoryUnits: 380, daysOfCover: 9999, lastSold: '2025-06-14', channels: ['Shopify (DTC)'] }),
];

const SSK: SkuBundle = {
  subcoId: 'ssk',
  totalSkus: 1420,
  activeSkus: 868,
  deadSkus: 284,
  bleederSkus: 71,
  paretoShare: 0.81,
  tailShare: 0.06,
  cashInDeadStock: 742_000,
  proposedCuts: 332,
  marginUpliftPct: 4.2,
  skus: SSK_SKUS,
};

// ── Baseball Glove Lace — 18 SKUs ──────────────────────────────────────────
const BGL_SKUS: Sku[] = [
  // ── CORE (4) ──
  mkSku({ sku: 'BGL-LCE-72T',   name: '72" Pro Leather Lace — Tan (10-pk)',       brand: 'BGL', category: 'Lace', segment: 'core', revenue12M: 1_480_000, grossMargin: 0.64, units12M: 38_200, inventoryUnits: 5_600, daysOfCover: 54, channels: ['Amazon', 'Shopify (DTC)', 'Wholesale'] }),
  mkSku({ sku: 'BGL-LCE-60B',   name: '60" Pro Leather Lace — Black (10-pk)',     brand: 'BGL', category: 'Lace', segment: 'core', revenue12M: 980_000, grossMargin: 0.62, units12M: 24_400, inventoryUnits: 3_200, daysOfCover: 48, channels: ['Amazon', 'Shopify (DTC)'] }),
  mkSku({ sku: 'BGL-KIT-REL',   name: 'Glove Relace Starter Kit',                 brand: 'BGL', category: 'Kits', segment: 'core', revenue12M: 620_000, grossMargin: 0.55, units12M: 7_100, inventoryUnits: 820, daysOfCover: 42, channels: ['Amazon', 'Shopify (DTC)', 'Wholesale'] }),
  mkSku({ sku: 'BGL-LCE-72R',   name: '72" Pro Leather Lace — Red (10-pk)',       brand: 'BGL', category: 'Lace', segment: 'core', revenue12M: 480_000, grossMargin: 0.63, units12M: 12_100, inventoryUnits: 1_800, daysOfCover: 54, channels: ['Amazon', 'Shopify (DTC)'] }),
  // ── HEALTHY (5) ──
  mkSku({ sku: 'BGL-TOOL-N1',   name: 'Lace Needle Tool — Pro',                   brand: 'BGL', category: 'Tools', segment: 'healthy', revenue12M: 182_000, grossMargin: 0.58, units12M: 9_200, inventoryUnits: 1_840, daysOfCover: 73, channels: ['Amazon', 'Shopify (DTC)'] }),
  mkSku({ sku: 'BGL-LCE-60T',   name: '60" Pro Leather Lace — Tan (10-pk)',       brand: 'BGL', category: 'Lace', segment: 'healthy', revenue12M: 158_000, grossMargin: 0.61, units12M: 4_100, inventoryUnits: 640, daysOfCover: 57, channels: ['Amazon', 'Shopify (DTC)'] }),
  mkSku({ sku: 'BGL-LCE-72NV',  name: '72" Pro Leather Lace — Navy',              brand: 'BGL', category: 'Lace', segment: 'healthy', revenue12M: 128_000, grossMargin: 0.60, units12M: 3_200, inventoryUnits: 480, daysOfCover: 55, channels: ['Amazon', 'Shopify (DTC)'] }),
  mkSku({ sku: 'BGL-OIL-4OZ',   name: 'Rawlings Glovolium Oil 4oz',               brand: 'BGL', category: 'Care', segment: 'healthy', revenue12M: 98_000, grossMargin: 0.52, units12M: 8_400, inventoryUnits: 1_200, daysOfCover: 52, channels: ['Amazon', 'Shopify (DTC)'] }),
  mkSku({ sku: 'BGL-KIT-PRO',   name: 'Pro Relace Kit — Full Catchers Set',       brand: 'BGL', category: 'Kits', segment: 'healthy', revenue12M: 76_000, grossMargin: 0.54, units12M: 920, inventoryUnits: 160, daysOfCover: 63, channels: ['Shopify (DTC)', 'Wholesale'] }),
  // ── LONG TAIL (4) ──
  mkSku({ sku: 'BGL-LCE-NEO',   name: 'Neon Lace 72" — Yellow/Orange',            brand: 'BGL', category: 'Lace', segment: 'tail', revenue12M: 22_400, grossMargin: 0.28, units12M: 620, inventoryUnits: 1_800, daysOfCover: 1_060, channels: ['Shopify (DTC)'] }),
  mkSku({ sku: 'BGL-LCE-60P',   name: '60" Lace — Purple (single)',               brand: 'BGL', category: 'Lace', segment: 'tail', revenue12M: 14_800, grossMargin: 0.30, units12M: 420, inventoryUnits: 1_240, daysOfCover: 1_079, channels: ['Shopify (DTC)'] }),
  mkSku({ sku: 'BGL-LCE-60PN',  name: '60" Lace — Pink (single)',                 brand: 'BGL', category: 'Lace', segment: 'tail', revenue12M: 12_200, grossMargin: 0.29, units12M: 340, inventoryUnits: 980, daysOfCover: 1_054, channels: ['Shopify (DTC)'] }),
  mkSku({ sku: 'BGL-SPONGE-V1', name: 'Leather Conditioning Sponge',              brand: 'BGL', category: 'Care', segment: 'tail', revenue12M: 8_400, grossMargin: 0.32, units12M: 640, inventoryUnits: 2_400, daysOfCover: 1_368, channels: ['Amazon'] }),
  // ── BLEEDERS (2) ──
  mkSku({ sku: 'BGL-CLN-HVY',   name: 'Glove Cleaner 16oz — Heavy (2022)',        brand: 'BGL', category: 'Care', segment: 'bleeder', revenue12M: 6_200, grossMargin: -0.08, units12M: 112, inventoryUnits: 1_400, daysOfCover: 4_560, channels: ['Amazon'] }),
  mkSku({ sku: 'BGL-DISP-KT',   name: 'Display Kit — Retail POP (2021)',          brand: 'BGL', category: 'Merch', segment: 'bleeder', revenue12M: 3_800, grossMargin: -0.12, units12M: 42, inventoryUnits: 380, daysOfCover: 3_302, channels: ['Wholesale'] }),
  // ── DEAD (3) ──
  mkSku({ sku: 'BGL-SWT-OL',    name: 'Glove Sweat Kit (OLD SKU)',                brand: 'BGL', category: 'Care', segment: 'dead', revenue12M: 0, grossMargin: 0, units12M: 0, inventoryUnits: 420, daysOfCover: 9999, lastSold: '2025-07-22', channels: ['Shopify (DTC)'] }),
  mkSku({ sku: 'BGL-LCE-GLOW',  name: 'Glow-in-Dark Lace (Test SKU 2022)',        brand: 'BGL', category: 'Lace', segment: 'dead', revenue12M: 0, grossMargin: 0, units12M: 0, inventoryUnits: 680, daysOfCover: 9999, lastSold: '2025-05-10', channels: ['Shopify (DTC)'] }),
  mkSku({ sku: 'BGL-MUG-BRD',   name: 'BGL Branded Mug 2021',                    brand: 'BGL', category: 'Merch', segment: 'dead', revenue12M: 0, grossMargin: 0, units12M: 0, inventoryUnits: 240, daysOfCover: 9999, lastSold: '2025-04-02', channels: ['Shopify (DTC)'] }),
];

const BGL: SkuBundle = {
  subcoId: 'bgl',
  totalSkus: 312,
  activeSkus: 268,
  deadSkus: 22,
  bleederSkus: 8,
  paretoShare: 0.72,
  tailShare: 0.11,
  cashInDeadStock: 88_400,
  proposedCuts: 30,
  marginUpliftPct: 2.6,
  skus: BGL_SKUS,
};

// ── Double Dutch Waffles — 16 SKUs ──────────────────────────────────────────
const DDW_SKUS: Sku[] = [
  // ── CORE (3) ──
  mkSku({ sku: 'DDW-STK-CAR',   name: 'Stroopwafel Caramel — 8 pack',        brand: 'DDW', category: 'Stroopwafels', segment: 'core', revenue12M: 248_000, grossMargin: 0.48, units12M: 24_800, inventoryUnits: 2_400, daysOfCover: 35, channels: ['Shopify (DTC)', 'Amazon', 'Wholesale'] }),
  mkSku({ sku: 'DDW-STK-DCH',   name: 'Stroopwafel Dark Chocolate — 8 pack', brand: 'DDW', category: 'Stroopwafels', segment: 'core', revenue12M: 188_000, grossMargin: 0.46, units12M: 18_200, inventoryUnits: 1_600, daysOfCover: 32, channels: ['Shopify (DTC)', 'Amazon'] }),
  mkSku({ sku: 'DDW-STK-VAN',   name: 'Stroopwafel Vanilla — 8 pack',        brand: 'DDW', category: 'Stroopwafels', segment: 'core', revenue12M: 142_000, grossMargin: 0.45, units12M: 14_200, inventoryUnits: 1_200, daysOfCover: 31, channels: ['Shopify (DTC)', 'Amazon'] }),
  // ── HEALTHY (5) ──
  mkSku({ sku: 'DDW-GFT-MIX',   name: 'Gift Box — Waffle Variety 12-pack',   brand: 'DDW', category: 'Gift', segment: 'healthy', revenue12M: 84_000, grossMargin: 0.42, units12M: 3_100, inventoryUnits: 440, daysOfCover: 52, channels: ['Shopify (DTC)'] }),
  mkSku({ sku: 'DDW-STK-BLB',   name: 'Stroopwafel Blueberry — 8 pack',      brand: 'DDW', category: 'Stroopwafels', segment: 'healthy', revenue12M: 68_000, grossMargin: 0.44, units12M: 6_800, inventoryUnits: 620, daysOfCover: 33, channels: ['Shopify (DTC)', 'Amazon'] }),
  mkSku({ sku: 'DDW-GFT-CORP',  name: 'Corporate Gift Box — 24-pack',        brand: 'DDW', category: 'Gift', segment: 'healthy', revenue12M: 52_000, grossMargin: 0.40, units12M: 1_200, inventoryUnits: 180, daysOfCover: 55, channels: ['Wholesale', 'Shopify (DTC)'] }),
  mkSku({ sku: 'DDW-STK-CSC',   name: 'Choc. Salted Caramel — 8 pack',       brand: 'DDW', category: 'Stroopwafels', segment: 'healthy', revenue12M: 46_000, grossMargin: 0.43, units12M: 4_600, inventoryUnits: 380, daysOfCover: 30, channels: ['Shopify (DTC)', 'Amazon'] }),
  mkSku({ sku: 'DDW-SUBS-MON',  name: 'Monthly Waffle Club Subscription',    brand: 'DDW', category: 'Subscription', segment: 'healthy', revenue12M: 38_000, grossMargin: 0.50, units12M: 210, inventoryUnits: 0, daysOfCover: 0, channels: ['Shopify (DTC)'] }),
  // ── LONG TAIL (3) ──
  mkSku({ sku: 'DDW-STK-CAR1',  name: 'Stroopwafel Caramel — Single 2-pk',   brand: 'DDW', category: 'Stroopwafels', segment: 'tail', revenue12M: 18_400, grossMargin: 0.32, units12M: 4_800, inventoryUnits: 1_200, daysOfCover: 91, channels: ['Amazon'] }),
  mkSku({ sku: 'DDW-BRD-HAT',   name: 'DDW Brand Hat',                        brand: 'DDW', category: 'Merch', segment: 'tail', revenue12M: 8_200, grossMargin: 0.28, units12M: 220, inventoryUnits: 640, daysOfCover: 1_062, channels: ['Shopify (DTC)'] }),
  mkSku({ sku: 'DDW-TOT-BRD',   name: 'Branded Tote Bag',                    brand: 'DDW', category: 'Merch', segment: 'tail', revenue12M: 5_800, grossMargin: 0.24, units12M: 162, inventoryUnits: 480, daysOfCover: 1_082, channels: ['Shopify (DTC)'] }),
  // ── BLEEDERS (2) ──
  mkSku({ sku: 'DDW-MRC-MUG',   name: 'Branded Mug 12oz',                    brand: 'DDW', category: 'Merch', segment: 'bleeder', revenue12M: 4_100, grossMargin: -0.14, units12M: 220, inventoryUnits: 880, daysOfCover: 1_460, channels: ['Shopify (DTC)'] }),
  mkSku({ sku: 'DDW-PIN-LPL',   name: 'Lapel Pin — Logo (2023)',             brand: 'DDW', category: 'Merch', segment: 'bleeder', revenue12M: 2_400, grossMargin: -0.18, units12M: 120, inventoryUnits: 620, daysOfCover: 1_887, channels: ['Shopify (DTC)'] }),
  // ── DEAD (3) ──
  mkSku({ sku: 'DDW-SEA-PMK',   name: 'Pumpkin Spice — Seasonal 2024',       brand: 'DDW', category: 'Seasonal', segment: 'dead', revenue12M: 0, grossMargin: 0, units12M: 0, inventoryUnits: 1_280, daysOfCover: 9999, lastSold: '2025-12-01', channels: ['Shopify (DTC)'] }),
  mkSku({ sku: 'DDW-SEA-XMAS',  name: 'Holiday Cinnamon — Limited 2023',     brand: 'DDW', category: 'Seasonal', segment: 'dead', revenue12M: 0, grossMargin: 0, units12M: 0, inventoryUnits: 840, daysOfCover: 9999, lastSold: '2025-12-26', channels: ['Shopify (DTC)'] }),
  mkSku({ sku: 'DDW-TRY-PKG',   name: 'Try-All Sample Pack — 5 Flavors',     brand: 'DDW', category: 'Gift', segment: 'dead', revenue12M: 0, grossMargin: 0, units12M: 0, inventoryUnits: 560, daysOfCover: 9999, lastSold: '2025-10-08', channels: ['Shopify (DTC)'] }),
];

const DDW: SkuBundle = {
  subcoId: 'ddw',
  totalSkus: 92,
  activeSkus: 74,
  deadSkus: 11,
  bleederSkus: 4,
  paretoShare: 0.70,
  tailShare: 0.14,
  cashInDeadStock: 28_400,
  proposedCuts: 14,
  marginUpliftPct: 3.1,
  skus: DDW_SKUS,
};

// ── All American Socks — 17 SKUs ────────────────────────────────────────────
const AAS_SKUS: Sku[] = [
  // ── CORE (3) ──
  mkSku({ sku: 'AAS-FLG-WHT',   name: 'USA Flag Crew Sock — White (M/L)',      brand: 'AAS', category: 'Crew', segment: 'core', revenue12M: 162_000, grossMargin: 0.51, units12M: 18_200, inventoryUnits: 2_400, daysOfCover: 48, channels: ['Shopify (DTC)', 'Amazon', 'Wholesale'] }),
  mkSku({ sku: 'AAS-ELT-HI',    name: 'Elite Athletic Hi-Crew — Navy',         brand: 'AAS', category: 'Crew', segment: 'core', revenue12M: 108_000, grossMargin: 0.49, units12M: 12_400, inventoryUnits: 1_600, daysOfCover: 47, channels: ['Shopify (DTC)', 'Amazon'] }),
  mkSku({ sku: 'AAS-FLG-RED',   name: 'USA Flag Crew Sock — Red/Blue',         brand: 'AAS', category: 'Crew', segment: 'core', revenue12M: 88_000, grossMargin: 0.50, units12M: 9_800, inventoryUnits: 1_240, daysOfCover: 46, channels: ['Shopify (DTC)', 'Amazon'] }),
  // ── HEALTHY (5) ──
  mkSku({ sku: 'AAS-LOW-BLK',   name: 'Low-Cut Athletic — Black 3-pack',       brand: 'AAS', category: 'Low-Cut', segment: 'healthy', revenue12M: 66_000, grossMargin: 0.44, units12M: 8_800, inventoryUnits: 1_100, daysOfCover: 46, channels: ['Shopify (DTC)', 'Amazon'] }),
  mkSku({ sku: 'AAS-TM-SCAR',   name: 'Team Crew Sock — Scarlet',              brand: 'AAS', category: 'Team', segment: 'healthy', revenue12M: 52_000, grossMargin: 0.48, units12M: 6_200, inventoryUnits: 840, daysOfCover: 50, channels: ['Wholesale', 'Shopify (DTC)'] }),
  mkSku({ sku: 'AAS-ELT-HI-R',  name: 'Elite Hi-Crew — Royal Blue',            brand: 'AAS', category: 'Crew', segment: 'healthy', revenue12M: 44_000, grossMargin: 0.47, units12M: 5_100, inventoryUnits: 680, daysOfCover: 49, channels: ['Shopify (DTC)', 'Amazon'] }),
  mkSku({ sku: 'AAS-TM-GRN',    name: 'Team Crew Sock — Forest Green',         brand: 'AAS', category: 'Team', segment: 'healthy', revenue12M: 38_000, grossMargin: 0.46, units12M: 4_400, inventoryUnits: 580, daysOfCover: 48, channels: ['Wholesale', 'Shopify (DTC)'] }),
  mkSku({ sku: 'AAS-OTK-WHT',   name: 'Over-the-Knee Pro — White',             brand: 'AAS', category: 'OTK', segment: 'healthy', revenue12M: 32_000, grossMargin: 0.52, units12M: 2_800, inventoryUnits: 360, daysOfCover: 47, channels: ['Shopify (DTC)'] }),
  // ── LONG TAIL (4) ──
  mkSku({ sku: 'AAS-LOW-WHT',   name: 'Low-Cut Athletic — White 3-pack',       brand: 'AAS', category: 'Low-Cut', segment: 'tail', revenue12M: 18_200, grossMargin: 0.30, units12M: 2_200, inventoryUnits: 820, daysOfCover: 136, channels: ['Amazon'] }),
  mkSku({ sku: 'AAS-TM-BLK',    name: 'Team Crew — Black (custom order min)',  brand: 'AAS', category: 'Team', segment: 'tail', revenue12M: 12_400, grossMargin: 0.27, units12M: 1_200, inventoryUnits: 680, daysOfCover: 207, channels: ['Wholesale'] }),
  mkSku({ sku: 'AAS-YTH-CREW',  name: 'Youth Crew Sock — Assorted 6-pk',       brand: 'AAS', category: 'Youth', segment: 'tail', revenue12M: 9_200, grossMargin: 0.28, units12M: 840, inventoryUnits: 920, daysOfCover: 400, channels: ['Amazon'] }),
  mkSku({ sku: 'AAS-LINER-WM',  name: 'Compression Liner — Womens',            brand: 'AAS', category: 'Specialty', segment: 'tail', revenue12M: 6_800, grossMargin: 0.24, units12M: 480, inventoryUnits: 640, daysOfCover: 488, channels: ['Shopify (DTC)'] }),
  // ── BLEEDERS (2) ──
  mkSku({ sku: 'AAS-LGO-CAP',   name: 'Logo Snapback Cap (OLD)',               brand: 'AAS', category: 'Apparel', segment: 'bleeder', revenue12M: 3_200, grossMargin: -0.09, units12M: 140, inventoryUnits: 820, daysOfCover: 2_138, channels: ['Shopify (DTC)'] }),
  mkSku({ sku: 'AAS-BND-HDB',   name: 'Headband 2-Pack (OLD color)',           brand: 'AAS', category: 'Apparel', segment: 'bleeder', revenue12M: 2_100, grossMargin: -0.06, units12M: 92, inventoryUnits: 560, daysOfCover: 2_217, channels: ['Amazon'] }),
  // ── DEAD (3) ──
  mkSku({ sku: 'AAS-SEA-XMS',   name: 'Holiday Snowflake Crew 2024',           brand: 'AAS', category: 'Seasonal', segment: 'dead', revenue12M: 0, grossMargin: 0, units12M: 0, inventoryUnits: 1_400, daysOfCover: 9999, lastSold: '2025-12-28', channels: ['Shopify (DTC)'] }),
  mkSku({ sku: 'AAS-TM-ORNG',   name: 'Team Crew — Orange (overstock)',        brand: 'AAS', category: 'Team', segment: 'dead', revenue12M: 0, grossMargin: 0, units12M: 0, inventoryUnits: 880, daysOfCover: 9999, lastSold: '2025-08-20', channels: ['Wholesale'] }),
  mkSku({ sku: 'AAS-OTK-BLK',   name: 'Over-the-Knee — Black (disc.)',         brand: 'AAS', category: 'OTK', segment: 'dead', revenue12M: 0, grossMargin: 0, units12M: 0, inventoryUnits: 560, daysOfCover: 9999, lastSold: '2025-07-15', channels: ['Shopify (DTC)'] }),
];

const AAS: SkuBundle = {
  subcoId: 'aas',
  totalSkus: 184,
  activeSkus: 142,
  deadSkus: 21,
  bleederSkus: 6,
  paretoShare: 0.74,
  tailShare: 0.10,
  cashInDeadStock: 36_200,
  proposedCuts: 27,
  marginUpliftPct: 2.9,
  skus: AAS_SKUS,
};

// ── Shug0 — 18 SKUs ─────────────────────────────────────────────────────────
const SHUG0_SKUS: Sku[] = [
  // ── CORE (4) ──
  mkSku({ sku: 'SH0-GSIG-BLK',  name: 'Signature Glove — Matte Black',         brand: 'SH0', category: 'Gloves', segment: 'core', revenue12M: 412_000, grossMargin: 0.58, units12M: 920, inventoryUnits: 82, daysOfCover: 33, channels: ['Shopify (DTC)', 'Direct'] }),
  mkSku({ sku: 'SH0-BAT-GLD',   name: 'Limited Edition Gold Bat',              brand: 'SH0', category: 'Bats', segment: 'core', revenue12M: 286_000, grossMargin: 0.62, units12M: 412, inventoryUnits: 48, daysOfCover: 43, channels: ['Shopify (DTC)', 'Direct'] }),
  mkSku({ sku: 'SH0-CLT-MTL',   name: 'Metal Cleat — Signature Black',         brand: 'SH0', category: 'Cleats', segment: 'core', revenue12M: 198_000, grossMargin: 0.46, units12M: 1_240, inventoryUnits: 142, daysOfCover: 42, channels: ['Shopify (DTC)', 'Amazon'] }),
  mkSku({ sku: 'SH0-CLT-TPU',   name: 'TPU Molded Cleat — White/Gold',         brand: 'SH0', category: 'Cleats', segment: 'core', revenue12M: 156_000, grossMargin: 0.44, units12M: 1_020, inventoryUnits: 118, daysOfCover: 42, channels: ['Shopify (DTC)', 'Amazon'] }),
  // ── HEALTHY (5) ──
  mkSku({ sku: 'SH0-BAG-PRO',   name: 'Pro Player Travel Bag',                 brand: 'SH0', category: 'Equipment Bags', segment: 'healthy', revenue12M: 188_000, grossMargin: 0.54, units12M: 640, inventoryUnits: 92, daysOfCover: 52, channels: ['Shopify (DTC)'] }),
  mkSku({ sku: 'SH0-GSIG-TAN',  name: 'Signature Glove — Tan',                 brand: 'SH0', category: 'Gloves', segment: 'healthy', revenue12M: 142_000, grossMargin: 0.56, units12M: 320, inventoryUnits: 40, daysOfCover: 46, channels: ['Shopify (DTC)', 'Direct'] }),
  mkSku({ sku: 'SH0-UNI-WHT',   name: 'Custom Uniform — White Pinstripe',      brand: 'SH0', category: 'Uniforms', segment: 'healthy', revenue12M: 118_000, grossMargin: 0.48, units12M: 280, inventoryUnits: 38, daysOfCover: 50, channels: ['Direct', 'Wholesale'] }),
  mkSku({ sku: 'SH0-TURF-BLK',  name: 'Turf Trainer — Matte Black',           brand: 'SH0', category: 'Cleats', segment: 'healthy', revenue12M: 98_000, grossMargin: 0.50, units12M: 620, inventoryUnits: 88, daysOfCover: 52, channels: ['Shopify (DTC)', 'Amazon'] }),
  mkSku({ sku: 'SH0-GC-DIGIT',  name: 'Digital Gift Card — Variable',          brand: 'SH0', category: 'Gift Cards', segment: 'healthy', revenue12M: 62_000, grossMargin: 0.96, units12M: 420, inventoryUnits: 0, daysOfCover: 0, channels: ['Shopify (DTC)'] }),
  // ── LONG TAIL (4) ──
  mkSku({ sku: 'SH0-APP-HTH',   name: 'Heather Grey Training Tee',             brand: 'SH0', category: 'Apparel', segment: 'tail', revenue12M: 28_000, grossMargin: 0.38, units12M: 480, inventoryUnits: 680, daysOfCover: 518, channels: ['Shopify (DTC)'] }),
  mkSku({ sku: 'SH0-CAP-BLK',   name: 'Brand Cap — Matte Black',              brand: 'SH0', category: 'Apparel', segment: 'tail', revenue12M: 18_400, grossMargin: 0.34, units12M: 280, inventoryUnits: 420, daysOfCover: 548, channels: ['Shopify (DTC)'] }),
  mkSku({ sku: 'SH0-SOCK-GD',   name: 'Signature Crew Socks — Gold',           brand: 'SH0', category: 'Apparel', segment: 'tail', revenue12M: 12_200, grossMargin: 0.32, units12M: 320, inventoryUnits: 640, daysOfCover: 730, channels: ['Shopify (DTC)'] }),
  mkSku({ sku: 'SH0-PIN-EMB',   name: 'Embroidered Lapel Pin Set',             brand: 'SH0', category: 'Merch', segment: 'tail', revenue12M: 6_800, grossMargin: 0.28, units12M: 140, inventoryUnits: 380, daysOfCover: 991, channels: ['Shopify (DTC)'] }),
  // ── BLEEDERS (2) ──
  mkSku({ sku: 'SH0-COL-22',    name: '2022 Collab Drop — Remaining Stock',    brand: 'SH0', category: 'Apparel', segment: 'bleeder', revenue12M: 8_400, grossMargin: -0.18, units12M: 62, inventoryUnits: 280, daysOfCover: 1_649, channels: ['Shopify (DTC)'] }),
  mkSku({ sku: 'SH0-UNI-OLD',   name: 'Old Cut Uniform — 2021 Spec',           brand: 'SH0', category: 'Uniforms', segment: 'bleeder', revenue12M: 5_200, grossMargin: -0.12, units12M: 24, inventoryUnits: 160, daysOfCover: 2_433, channels: ['Wholesale'] }),
  // ── DEAD (3) ──
  mkSku({ sku: 'SH0-POS-SIG',   name: 'Signed Poster Print — 2022',           brand: 'SH0', category: 'Merch', segment: 'dead', revenue12M: 0, grossMargin: 0, units12M: 0, inventoryUnits: 180, daysOfCover: 9999, lastSold: '2025-08-04', channels: ['Shopify (DTC)'] }),
  mkSku({ sku: 'SH0-CLT-OLD',   name: 'Legacy Cleat — Discontinued Colorway', brand: 'SH0', category: 'Cleats', segment: 'dead', revenue12M: 0, grossMargin: 0, units12M: 0, inventoryUnits: 220, daysOfCover: 9999, lastSold: '2025-07-22', channels: ['Amazon', 'Shopify (DTC)'] }),
  mkSku({ sku: 'SH0-WRIST-OD',  name: 'Wristband 2-Pack — Old Design',        brand: 'SH0', category: 'Apparel', segment: 'dead', revenue12M: 0, grossMargin: 0, units12M: 0, inventoryUnits: 440, daysOfCover: 9999, lastSold: '2025-06-01', channels: ['Shopify (DTC)'] }),
];

const SHUG0: SkuBundle = {
  subcoId: 'shug0',
  totalSkus: 58,
  activeSkus: 46,
  deadSkus: 4,
  bleederSkus: 2,
  paretoShare: 0.83,
  tailShare: 0.04,
  cashInDeadStock: 52_800,
  proposedCuts: 6,
  marginUpliftPct: 5.4,
  skus: SHUG0_SKUS,
};

// ── Consolidated / 783 Partners Topco — all subco SKUs merged ───────────────
// The topco view shows every SKU across the portfolio with a brand label.
// This gives the CEO a single cross-portfolio Pareto and prune list.
const ALL_SKUS = [...SSK_SKUS, ...BGL_SKUS, ...DDW_SKUS, ...AAS_SKUS, ...SHUG0_SKUS];

const BASES_LOADED: SkuBundle = {
  subcoId: 'bases-loaded',
  totalSkus: 3840,
  activeSkus: 2117,
  deadSkus: 614,
  bleederSkus: 182,
  paretoShare: 0.78,
  tailShare: 0.08,
  cashInDeadStock: 1_240_000,
  proposedCuts: 796,
  marginUpliftPct: 3.8,
  skus: ALL_SKUS,
};

const BUNDLES: Record<string, SkuBundle> = {
  'bases-loaded': BASES_LOADED,
  ssk: SSK,
  bgl: BGL,
  ddw: DDW,
  aas: AAS,
  shug0: SHUG0,
  // Slug aliases
  'ssk-baseball': SSK,
  'baseball-glove-lace': BGL,
  'double-dutch-waffles': DDW,
  'all-american-socks': AAS,
};

export function getSkuBundle(subcoId: string): SkuBundle {
  return BUNDLES[subcoId] ?? BASES_LOADED;
}
