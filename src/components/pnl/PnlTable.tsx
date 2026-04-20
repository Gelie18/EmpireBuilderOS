'use client';

import { useState } from 'react';
import type { PnlRow } from '@/lib/data/types';
import { formatCurrency } from '@/lib/utils';
import VariancePill from '@/components/ui/VariancePill';

interface PnlTableProps {
  rows: PnlRow[];
  title?: string;
}

export default function PnlTable({ rows, title = 'Budget vs Actuals — April 2026' }: PnlTableProps) {
  const [openNotes, setOpenNotes] = useState<Set<string>>(new Set());
  const toggle = (id: string) => setOpenNotes((p) => {
    const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n;
  });

  let inExpense = false;

  return (
    <div className="border overflow-hidden" style={{ background: 'var(--color-surf)', borderColor: 'var(--color-border)' }}>
      {/* Header */}
      <div
        className="px-3.5 py-2.5 flex items-center justify-between border-b"
        style={{ background: 'var(--color-surf2)', borderColor: 'var(--color-border)' }}
      >
        <span
          className="text-[11px] font-bold uppercase tracking-[0.06em]"
          style={{ fontFamily: 'var(--font-condensed)' }}
        >
          {title}
        </span>
        <span className="text-[10px]" style={{ color: 'var(--color-muted)' }}>
          Click any row for AI analysis
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-[12px]">
          <thead>
            <tr>
              {['Line Item', 'Budget', 'Actual', 'Var $', 'Var %'].map((h, i) => (
                <th
                  key={h}
                  className="px-3 py-2 font-bold uppercase tracking-[0.08em] text-[9px] border-b"
                  style={{
                    fontFamily: 'var(--font-condensed)',
                    color: 'var(--color-muted)',
                    background: 'var(--color-surf2)',
                    borderColor: 'var(--color-border)',
                    textAlign: i === 0 ? 'left' : 'right',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              if (row.type === 'section') {
                inExpense = row.label === 'Operating Expenses';
                return (
                  <tr key={row.id} className="cursor-default">
                    <td
                      colSpan={5}
                      className="px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.08em]"
                      style={{ fontFamily: 'var(--font-condensed)', color: 'var(--color-muted)', background: 'var(--color-surf2)' }}
                    >
                      {row.label}
                    </td>
                  </tr>
                );
              }

              const v = row.varianceDollar ?? 0;
              const isSmall = Math.abs(v) < 1500;
              const favorable = inExpense ? v < 0 : v > 0;
              const varColor = isSmall ? 'var(--color-orange)' : favorable ? 'var(--color-green)' : 'var(--color-red)';
              const sign = v >= 0 ? '+' : '–';

              const isTotalish = row.type === 'total' || row.type === 'subtotal';
              const isTotal = row.type === 'total';

              return (
                <tr key={row.id}>
                  <td colSpan={5} style={{ padding: 0 }}>
                    {/* Main row */}
                    <div
                      className="grid cursor-pointer border-b transition-colors"
                      style={{
                        gridTemplateColumns: '1fr repeat(4, auto)',
                        borderColor: 'var(--color-border)',
                        borderTop: isTotal ? `2px solid var(--color-border2)` : undefined,
                      }}
                      onClick={() => row.aiNote && toggle(row.id)}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--color-blue-d)'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ''; }}
                    >
                      {/* Name cell */}
                      <div
                        className={`px-3 py-2 ${row.indent ? 'pl-6' : ''}`}
                        style={{
                          fontWeight: isTotalish ? 700 : 400,
                          fontSize: isTotal ? 13 : 12,
                          color: row.indent && !isTotalish ? 'var(--color-muted)' : 'var(--color-text)',
                          background: isTotalish ? 'rgba(0,0,0,0.02)' : undefined,
                        }}
                      >
                        {row.label}
                        {row.isAnomaly && (
                          <span className="ml-1.5 text-[11px]" style={{ color: 'var(--color-orange)' }}>△</span>
                        )}
                      </div>

                      {/* Budget */}
                      <div className="px-3 py-2 text-right text-[13px] font-semibold"
                        style={{ fontFamily: 'var(--font-condensed)', background: isTotalish ? 'rgba(0,0,0,0.02)' : undefined }}>
                        {row.budget != null ? formatCurrency(row.budget) : ''}
                      </div>

                      {/* Actual */}
                      <div className="px-3 py-2 text-right text-[13px] font-semibold"
                        style={{ fontFamily: 'var(--font-condensed)', background: isTotalish ? 'rgba(0,0,0,0.02)' : undefined }}>
                        {row.actual != null ? formatCurrency(row.actual) : ''}
                      </div>

                      {/* Var $ */}
                      <div className="px-3 py-2 text-right text-[13px] font-semibold"
                        style={{ fontFamily: 'var(--font-condensed)', color: varColor, background: isTotalish ? 'rgba(0,0,0,0.02)' : undefined }}>
                        {row.varianceDollar != null ? `${sign}${formatCurrency(Math.abs(v))}` : ''}
                      </div>

                      {/* Var % pill */}
                      <div className="px-3 py-2 text-right"
                        style={{ background: isTotalish ? 'rgba(0,0,0,0.02)' : undefined }}>
                        {row.variancePercent != null && (
                          <VariancePill value={row.variancePercent} type={inExpense ? 'expense' : 'revenue'} />
                        )}
                      </div>
                    </div>

                    {/* AI Note */}
                    {row.aiNote && openNotes.has(row.id) && (
                      <div
                        className="px-3 py-2.5 pl-6 text-[12px] leading-relaxed border-b border-l-[3px]"
                        style={{
                          background: 'var(--color-blue-d)',
                          borderColor: 'var(--color-border)',
                          borderLeftColor: 'var(--color-blue)',
                          color: 'rgba(240,238,232,0.65)',
                        }}
                      >
                        {row.aiNote}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
