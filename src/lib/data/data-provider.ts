import { getAppMode } from '../config';
import type { PnlReport, Kpi, Anomaly, CashFlowReport, ForecastModel, Scenario, Period } from './types';
import {
  getDemoPnlReport,
  getDemoKpis,
  getDemoAnomalies,
  getDemoCashFlow,
  getDemoForecast,
  getDemoScenarios,
  DEFAULT_PERIOD,
} from './demo-data';
import { fetchProfitAndLoss, fetchCashFlow as fetchQboCashFlow, fetchAgedReceivables, fetchAgedPayables } from '../qbo/reports';
import { transformQboPnl, transformQboCashFlow, transformQboAging } from './transformers';
import { isAuthenticated } from '../qbo/auth';

// ── P&L ──
export async function getPnlReport(period?: Period): Promise<PnlReport> {
  const mode = getAppMode();
  const p = period || DEFAULT_PERIOD;

  if (mode === 'live' && isAuthenticated()) {
    try {
      const qboReport = await fetchProfitAndLoss(p.startDate, p.endDate);
      const rows = transformQboPnl(qboReport);
      return {
        period: p,
        rows,
        generatedAt: new Date().toISOString(),
        source: 'qbo',
      };
    } catch (err) {
      console.error('QBO P&L fetch failed, falling back to demo:', err);
    }
  }

  return getDemoPnlReport();
}

// ── KPIs ──
export async function getKpis(period?: Period): Promise<Kpi[]> {
  const mode = getAppMode();

  if (mode === 'live' && isAuthenticated()) {
    try {
      // Derive KPIs from P&L
      const report = await getPnlReport(period);
      const revenue = report.rows.find((r) => r.id === 'rev-total' || r.label.includes('Total Revenue'));
      const gp = report.rows.find((r) => r.label.includes('Gross Profit') && r.type === 'total');
      const opIncome = report.rows.find((r) => r.label.includes('Operating Income'));
      const ni = report.rows.find((r) => r.label.includes('Net Income') && r.type === 'total');

      return [
        makeKpi('revenue', 'Revenue', revenue?.actual || 0, revenue?.budget || 0),
        makeKpi('gross-profit', 'Gross Profit', gp?.actual || 0, gp?.budget || 0),
        makeKpi('op-income', 'Op. Income', opIncome?.actual || 0, opIncome?.budget || 0),
        makeKpi('net-income', 'Net Income', ni?.actual || 0, ni?.budget || 0),
      ];
    } catch (err) {
      console.error('KPI derivation failed:', err);
    }
  }

  return getDemoKpis();
}

function makeKpi(id: string, label: string, actual: number, budget: number): Kpi {
  const variance = actual - budget;
  const pct = budget !== 0 ? (variance / budget) * 100 : 0;
  return {
    id,
    label,
    value: actual,
    budgetValue: budget,
    varianceDollar: variance,
    variancePercent: pct,
    trend: Math.abs(variance) < 1500 ? 'neutral' : variance > 0 ? 'positive' : 'negative',
  };
}

// ── Anomalies ──
export async function getAnomalies(): Promise<Anomaly[]> {
  // For now, anomaly detection is demo-only
  // In production, this would analyze QBO data for outliers
  return getDemoAnomalies();
}

// ── Cash Flow ──
export async function getCashFlow(period?: Period): Promise<CashFlowReport> {
  const mode = getAppMode();
  const p = period || DEFAULT_PERIOD;

  if (mode === 'live' && isAuthenticated()) {
    try {
      const [cfReport, arReport, apReport] = await Promise.all([
        fetchQboCashFlow(p.startDate, p.endDate),
        fetchAgedReceivables(),
        fetchAgedPayables(),
      ]);

      const cashFlow = transformQboCashFlow(cfReport, p);
      cashFlow.aging = {
        receivables: transformQboAging(arReport),
        payables: transformQboAging(apReport),
      };

      return cashFlow;
    } catch (err) {
      console.error('QBO Cash Flow fetch failed:', err);
    }
  }

  return getDemoCashFlow();
}

// ── Forecast (demo-only for now; would use ML in production) ──
export async function getForecast(): Promise<ForecastModel> {
  return getDemoForecast();
}

// ── Scenarios (demo-only for now) ──
export async function getScenarios(): Promise<Scenario[]> {
  return getDemoScenarios();
}
