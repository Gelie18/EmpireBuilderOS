import { qboFetch } from './client';

export interface QboReportResponse {
  Header: {
    ReportName: string;
    StartPeriod: string;
    EndPeriod: string;
    Currency: string;
  };
  Columns: {
    Column: { ColTitle: string; ColType: string }[];
  };
  Rows: {
    Row: QboRow[];
  };
}

export interface QboRow {
  type?: string; // 'Section', 'Data'
  Header?: { ColData: QboColData[] };
  Rows?: { Row: QboRow[] };
  Summary?: { ColData: QboColData[] };
  ColData?: QboColData[];
  group?: string;
}

export interface QboColData {
  value: string;
  id?: string;
}

// ── Report Fetchers ──

export async function fetchProfitAndLoss(startDate: string, endDate: string): Promise<QboReportResponse> {
  const data = await qboFetch('/reports/ProfitAndLoss', {
    start_date: startDate,
    end_date: endDate,
    minorversion: '75',
  });
  return data as QboReportResponse;
}

export async function fetchBalanceSheet(endDate: string): Promise<QboReportResponse> {
  const data = await qboFetch('/reports/BalanceSheet', {
    date: endDate,
    minorversion: '75',
  });
  return data as QboReportResponse;
}

export async function fetchCashFlow(startDate: string, endDate: string): Promise<QboReportResponse> {
  const data = await qboFetch('/reports/CashFlow', {
    start_date: startDate,
    end_date: endDate,
    minorversion: '75',
  });
  return data as QboReportResponse;
}

export async function fetchAgedReceivables(): Promise<QboReportResponse> {
  const data = await qboFetch('/reports/AgedReceivables', {
    minorversion: '75',
  });
  return data as QboReportResponse;
}

export async function fetchAgedPayables(): Promise<QboReportResponse> {
  const data = await qboFetch('/reports/AgedPayables', {
    minorversion: '75',
  });
  return data as QboReportResponse;
}

export async function fetchTrialBalance(startDate: string, endDate: string): Promise<QboReportResponse> {
  const data = await qboFetch('/reports/TrialBalance', {
    start_date: startDate,
    end_date: endDate,
    minorversion: '75',
  });
  return data as QboReportResponse;
}
