// ── Mode & Period ──
export type AppMode = 'demo' | 'live';
export type PeriodType = 'month' | 'quarter' | 'ytd' | 'custom';

export interface Period {
  type: PeriodType;
  startDate: string;
  endDate: string;
  label: string;
}

// ── P&L ──
export type PnlRowType = 'section' | 'line_item' | 'subtotal' | 'total';

export interface PnlRow {
  id: string;
  type: PnlRowType;
  label: string;
  indent: boolean;
  budget: number | null;
  actual: number | null;
  varianceDollar: number | null;
  variancePercent: number | null;
  isAnomaly: boolean;
  aiNote?: string;
}

export interface PnlReport {
  period: Period;
  rows: PnlRow[];
  generatedAt: string;
  source: 'demo' | 'qbo';
}

// ── KPIs ──
export interface Kpi {
  id: string;
  label: string;
  value: number;
  budgetValue: number;
  varianceDollar: number;
  variancePercent: number;
  trend: 'positive' | 'negative' | 'neutral';
}

// ── Anomalies ──
export type AnomalySeverity = 'critical' | 'warning' | 'info';

export interface Anomaly {
  id: string;
  category: string;
  severity: AnomalySeverity;
  headline: string;
  detail: string;
  lineItemId: string;
}

// ── Cash Flow ──
export interface CashFlowReport {
  period: Period;
  operating: CashFlowSection;
  investing: CashFlowSection;
  financing: CashFlowSection;
  netChange: number;
  openingBalance: number;
  closingBalance: number;
  runway: RunwayMetrics;
  aging: AgingReport;
  dailyForecast: DailyForecastPoint[];
}

export interface CashFlowSection {
  label: string;
  items: CashFlowLineItem[];
  total: number;
}

export interface CashFlowLineItem {
  label: string;
  amount: number;
}

export interface RunwayMetrics {
  months: number;
  monthlyBurn: number;
  cashOnHand: number;
}

export interface AgingReport {
  receivables: AgingBucket[];
  payables: AgingBucket[];
}

export interface AgingBucket {
  range: string;
  amount: number;
  count: number;
}

export interface DailyForecastPoint {
  date: string;
  balance: number;
  isProjected: boolean;
}

// ── Forecasting ──
export interface ForecastMonth {
  month: string;
  label: string;
  revenue: number;
  cogs: number;
  grossProfit: number;
  opex: number;
  netIncome: number;
  isActual: boolean;
}

export interface ForecastModel {
  id: string;
  name: string;
  months: ForecastMonth[];
  drivers: ForecastDriver[];
}

export interface ForecastDriver {
  id: string;
  label: string;
  value: number;
  unit: 'percent' | 'currency' | 'number';
  min: number;
  max: number;
  step: number;
}

// ── Scenario Modeling ──
export interface Scenario {
  id: string;
  name: string;
  color: string;
  assumptions: ScenarioAssumption[];
  results: ForecastMonth[];
}

export interface ScenarioAssumption {
  id: string;
  label: string;
  baseValue: number;
  adjustedValue: number;
  unit: 'percent' | 'currency' | 'headcount';
}

// ── YoY / MoM Comparison ──
export interface ComparisonMonth {
  month: string;       // "2024-10"
  label: string;       // "Oct '24"
  revenue: number;
  grossProfit: number;
  grossMargin: number; // percent
  opex: number;
  netIncome: number;
  headcount: number;
}

export interface YoYReport {
  currentYear: ComparisonMonth[];
  priorYear: ComparisonMonth[];
  summary: {
    revenueGrowth: number;
    grossMarginExpansion: number;
    opexGrowth: number;
    netIncomeGrowth: number;
  };
}

export interface MoMReport {
  months: ComparisonMonth[];     // last 6 months
  latestMonth: ComparisonMonth;
  priorMonth: ComparisonMonth;
}

// ── Daily Reports ──
export interface DailyRevenuePoint {
  date: string;       // "2024-10-01"
  dayLabel: string;   // "Oct 1"
  dtc: number;
  wholesale: number;
  total: number;
  budget: number;
  runningTotal: number;
  runningBudget: number;
}

export interface DailyCeoMetric {
  id: string;
  label: string;
  value: string;
  subtext: string;
  trend: 'positive' | 'negative' | 'neutral';
  delta?: string;
}

export interface ActionItem {
  id: string;
  priority: 'high' | 'medium' | 'low';
  owner: string;
  text: string;
  dueDate: string;
  status: 'open' | 'in_progress' | 'done';
}

// ── Comments / Annotations ──
export interface Comment {
  id: string;
  targetId: string;          // line item id or view name
  targetLabel: string;
  author: string;
  authorInitials: string;
  content: string;
  timestamp: string;
  status: 'open' | 'resolved' | 'flagged';
  replies: CommentReply[];
  tags: string[];
}

export interface CommentReply {
  id: string;
  author: string;
  authorInitials: string;
  content: string;
  timestamp: string;
}

// ── Market Intelligence ──
export interface BenchmarkRow {
  metric: string;
  ridgeline: number;
  industryMedian: number;
  topQuartile: number;
  unit: 'percent' | 'currency' | 'number' | 'multiple';
  favorable: 'high' | 'low';   // whether higher is better
}

export interface MacroIndicator {
  id: string;
  label: string;
  value: string;
  change: string;
  direction: 'up' | 'down' | 'flat';
  impact: 'positive' | 'negative' | 'neutral';
  detail: string;
}

// ── Chat ──
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatContext {
  currentView: string;
  period: Period;
  highlights?: string[];
}
