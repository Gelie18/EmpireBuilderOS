'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ORG_TREE, type OrgNode } from '@/lib/data/hr-data';

function Card({ children }: { children: React.ReactNode }) {
  return (
    <section
      style={{
        background: 'var(--color-surf)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--card-radius)',
        boxShadow: 'var(--card-shadow)',
        padding: 20,
      }}
    >
      {children}
    </section>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontFamily: 'var(--font-condensed)',
        fontSize: 14,
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'var(--color-muted)',
        margin: '0 0 16px 0',
      }}
    >
      {children}
    </h2>
  );
}

const DEPT_COLOR: Record<string, string> = {
  Executive:   '#1B4DE6',
  Engineering: '#1B4DA8',
  Product:     '#6A1A7A',
  CS:          '#0E7C7B',
  Ops:         '#8A5A0F',
  Retail:      '#B85C00',
  Finance:     '#165E36',
  HR:          '#4A5464',
};

function countDescendants(n: OrgNode): number {
  return n.reports.reduce((s, r) => s + 1 + countDescendants(r), 0);
}

function OrgCard({ n, depth }: { n: OrgNode; depth: number }) {
  const [open, setOpen] = useState(depth < 2);
  const deptColor = DEPT_COLOR[n.dept] ?? '#4A5464';
  const hasReports = n.reports.length > 0;
  const totalBelow = countDescendants(n);

  return (
    <div style={{ position: 'relative' }}>
      <div
        onClick={() => hasReports && setOpen((v) => !v)}
        style={{
          background: 'var(--color-surf)',
          border: '1px solid var(--color-border)',
          borderLeft: `4px solid ${deptColor}`,
          borderRadius: 6,
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          cursor: hasReports ? 'pointer' : 'default',
          boxShadow: depth === 0 ? '0 2px 8px rgba(0,0,0,0.06)' : undefined,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {hasReports && (
            <span
              style={{
                fontFamily: 'var(--font-condensed)',
                fontSize: 14,
                width: 18,
                textAlign: 'center',
                color: 'var(--color-muted)',
              }}
            >
              {open ? '▾' : '▸'}
            </span>
          )}
          {!hasReports && <span style={{ width: 18 }} />}
          <div>
            <div style={{ fontWeight: 700, fontSize: depth === 0 ? 16 : 14 }}>{n.name}</div>
            <div
              style={{
                fontSize: 11,
                color: 'var(--color-muted)',
                fontFamily: 'var(--font-condensed)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                marginTop: 1,
              }}
            >
              {n.title} · {n.dept}
            </div>
          </div>
        </div>
        {hasReports && (
          <div
            style={{
              fontFamily: 'var(--font-condensed)',
              fontSize: 11,
              color: 'var(--color-muted)',
              background: 'var(--color-surf2)',
              padding: '2px 8px',
              borderRadius: 999,
              fontWeight: 700,
            }}
          >
            {n.reports.length} direct · {totalBelow} total
          </div>
        )}
      </div>

      {open && hasReports && (
        <div
          style={{
            marginLeft: 24,
            paddingLeft: 16,
            borderLeft: '1px dashed var(--color-border)',
            marginTop: 6,
            display: 'grid',
            gap: 6,
          }}
        >
          {n.reports.map((r) => (
            <OrgCard key={r.id} n={r} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function countAll(n: OrgNode): number {
  return 1 + n.reports.reduce((s, r) => s + countAll(r), 0);
}

function countManagers(n: OrgNode): number {
  return (n.reports.length > 0 ? 1 : 0) + n.reports.reduce((s, r) => s + countManagers(r), 0);
}

function maxDepth(n: OrgNode): number {
  if (n.reports.length === 0) return 1;
  return 1 + Math.max(...n.reports.map(maxDepth));
}

export default function OrgChartPage() {
  const total = countAll(ORG_TREE);
  const managers = countManagers(ORG_TREE);
  const depth = maxDepth(ORG_TREE);
  const avgSpan = total > 1 ? ((total - 1) / managers).toFixed(1) : '—';

  return (
    <div style={{ padding: '24px 28px 60px', maxWidth: 1400, margin: '0 auto' }}>
      <div
        style={{
          fontSize: 12,
          color: 'var(--color-muted)',
          marginBottom: 8,
          fontFamily: 'var(--font-condensed)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        <Link href="/hr/admin/dashboard" style={{ color: 'var(--color-muted)' }}>
          HR Admin
        </Link>{' '}
        &middot; Org Chart
      </div>

      <header style={{ marginBottom: 28 }}>
        <h1
          style={{
            fontSize: 32,
            fontWeight: 900,
            letterSpacing: '-0.01em',
            textTransform: 'uppercase',
            margin: '0 0 6px 0',
            lineHeight: 1.05,
          }}
        >
          Organization Chart
        </h1>
        <div style={{ color: 'var(--color-muted)', fontSize: 14 }}>
          {total} people in sampled tree &middot; {managers} people managers &middot; {depth} levels deep
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
        {[
          { label: 'Sampled people', value: String(total), sub: 'in this demo tree' },
          { label: 'People managers', value: String(managers), sub: `${Math.round((managers / total) * 100)}% of org` },
          { label: 'Avg span of control', value: String(avgSpan), sub: 'reports per manager', tone: 'good' as const },
          { label: 'Deepest reporting line', value: `${depth} levels`, sub: 'CEO → IC' },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <div
              style={{
                fontFamily: 'var(--font-condensed)',
                fontSize: 11,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--color-muted)',
              }}
            >
              {kpi.label}
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 900,
                marginTop: 4,
                color: kpi.tone === 'good' ? '#165E36' : 'var(--color-text)',
              }}
            >
              {kpi.value}
            </div>
            <div style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 4 }}>{kpi.sub}</div>
          </Card>
        ))}
      </div>

      <Card>
        <SectionTitle>Reporting tree · click to expand</SectionTitle>
        <div style={{ display: 'grid', gap: 6 }}>
          <OrgCard n={ORG_TREE} depth={0} />
        </div>
      </Card>

      <div style={{ marginTop: 20 }}>
        <Card>
          <SectionTitle>Legend</SectionTitle>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {Object.entries(DEPT_COLOR).map(([dept, color]) => (
              <div key={dept} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 14, height: 14, background: color, borderRadius: 3 }} />
                <div style={{ fontFamily: 'var(--font-condensed)', fontSize: 12, color: 'var(--color-muted)' }}>
                  {dept}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
