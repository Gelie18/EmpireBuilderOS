import type { PnlRow, CashFlowReport, CashFlowSection, AgingBucket, Period } from './types';
import type { QboReportResponse, QboRow } from '../qbo/reports';

// ── P&L Transformer ──
// QBO P&L has nested Row structure: Section > Data rows > Summary
export function transformQboPnl(report: QboReportResponse): PnlRow[] {
  const rows: PnlRow[] = [];
  let counter = 0;

  function processRows(qboRows: QboRow[], indent: boolean, sectionName?: string) {
    for (const row of qboRows) {
      if (row.type === 'Section' || row.Header) {
        const headerLabel = row.Header?.ColData?.[0]?.value || row.group || 'Unknown';

        // Section header
        rows.push({
          id: `sec-${counter++}`,
          type: 'section',
          label: headerLabel,
          indent: false,
          budget: null,
          actual: null,
          varianceDollar: null,
          variancePercent: null,
          isAnomaly: false,
        });

        // Process child rows
        if (row.Rows?.Row) {
          processRows(row.Rows.Row, true, headerLabel);
        }

        // Summary/subtotal
        if (row.Summary?.ColData) {
          const cols = row.Summary.ColData;
          const label = cols[0]?.value || `Total ${headerLabel}`;
          const actual = parseFloat(cols[1]?.value || '0');

          rows.push({
            id: `subtotal-${counter++}`,
            type: 'subtotal',
            label,
            indent: false,
            budget: null, // QBO doesn't include budget in standard P&L
            actual,
            varianceDollar: null,
            variancePercent: null,
            isAnomaly: false,
          });
        }
      } else if (row.ColData) {
        // Data row
        const cols = row.ColData;
        const label = cols[0]?.value || '';
        const actual = parseFloat(cols[1]?.value || '0');

        if (label && actual !== 0) {
          rows.push({
            id: `item-${counter++}`,
            type: 'line_item',
            label,
            indent,
            budget: null, // Budget data needs separate fetch or manual upload
            actual,
            varianceDollar: null,
            variancePercent: null,
            isAnomaly: false,
          });
        }
      }
    }
  }

  if (report.Rows?.Row) {
    processRows(report.Rows.Row, false);
  }

  // Add net income total from the last row group if present
  return rows;
}

// ── Cash Flow Transformer ──
export function transformQboCashFlow(
  report: QboReportResponse,
  period: Period
): CashFlowReport {
  const sections: CashFlowSection[] = [];

  function processSection(qboRows: QboRow[]): CashFlowSection {
    const items: { label: string; amount: number }[] = [];
    let total = 0;
    let label = 'Unknown';

    for (const row of qboRows) {
      if (row.Header?.ColData) {
        label = row.Header.ColData[0]?.value || label;
      }
      if (row.ColData) {
        const name = row.ColData[0]?.value || '';
        const amount = parseFloat(row.ColData[1]?.value || '0');
        if (name) items.push({ label: name, amount });
      }
      if (row.Summary?.ColData) {
        total = parseFloat(row.Summary.ColData[1]?.value || '0');
      }
      if (row.Rows?.Row) {
        const nested = processSection(row.Rows.Row);
        items.push(...nested.items);
        if (!total) total = nested.total;
      }
    }

    return { label, items, total };
  }

  if (report.Rows?.Row) {
    for (const row of report.Rows.Row) {
      if (row.Rows?.Row) {
        sections.push(processSection([row]));
      }
    }
  }

  const operating = sections[0] || { label: 'Operating Activities', items: [], total: 0 };
  const investing = sections[1] || { label: 'Investing Activities', items: [], total: 0 };
  const financing = sections[2] || { label: 'Financing Activities', items: [], total: 0 };
  const netChange = operating.total + investing.total + financing.total;

  return {
    period,
    operating,
    investing,
    financing,
    netChange,
    openingBalance: 0,  // Would need balance sheet query
    closingBalance: netChange,
    runway: {
      months: 0,
      monthlyBurn: Math.abs(netChange),
      cashOnHand: 0,
    },
    aging: { receivables: [], payables: [] },
    dailyForecast: [],
  };
}

// ── Aging Transformer ──
export function transformQboAging(report: QboReportResponse): AgingBucket[] {
  const buckets: AgingBucket[] = [];

  if (report.Rows?.Row) {
    for (const row of report.Rows.Row) {
      if (row.ColData) {
        const cols = row.ColData;
        // Aging reports typically have: Name, Current, 1-30, 31-60, 61-90, 91+, Total
        // We'll extract the bucket columns
      }
      if (row.Summary?.ColData) {
        const cols = row.Summary.ColData;
        // Extract totals per aging bucket from the summary row
        if (cols.length >= 6) {
          const ranges = ['Current', '1-30', '31-60', '61-90', '90+'];
          for (let i = 0; i < ranges.length && i + 1 < cols.length; i++) {
            const amount = parseFloat(cols[i + 1]?.value || '0');
            if (amount) {
              buckets.push({ range: ranges[i], amount, count: 0 });
            }
          }
        }
      }
    }
  }

  return buckets;
}
