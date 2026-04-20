import type { Kpi } from '@/lib/data/types';
import { formatCurrency } from '@/lib/utils';

interface KpiCardProps {
  kpi: Kpi;
}

export default function KpiCard({ kpi }: KpiCardProps) {
  const isPos = kpi.trend === 'positive';
  const isNeg = kpi.trend === 'negative';

  const accentColor = isPos ? 'var(--color-green)' : isNeg ? 'var(--color-red)' : 'var(--color-blue)';
  const accentBg    = isPos ? 'var(--color-green-d)' : isNeg ? 'var(--color-red-d)' : 'var(--color-blue-d)';
  const deltaPrefix = kpi.varianceDollar >= 0 ? '+' : '–';
  const pctPrefix   = kpi.variancePercent >= 0 ? '+' : '';

  return (
    <div
      style={{
        background:    'var(--color-surf)',
        borderRadius:  'var(--card-radius)',
        boxShadow:     'var(--card-shadow)',
        border:        '1px solid var(--color-border)',
        padding:       '20px 22px 18px',
        display:       'flex',
        flexDirection: 'column',
        gap:           8,
        position:      'relative',
        overflow:      'hidden',
      }}
    >
      {/* Top accent stripe */}
      <div
        style={{
          position:    'absolute',
          top:         0,
          left:        0,
          right:       0,
          height:      3,
          background:  accentColor,
          borderRadius: 'var(--card-radius) var(--card-radius) 0 0',
          opacity:     0.7,
        }}
      />

      {/* Label */}
      <div
        style={{
          fontFamily:    'var(--font-condensed)',
          fontSize:      11,
          fontWeight:    700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color:         'var(--color-muted)',
          marginTop:     4,
        }}
      >
        {kpi.label}
      </div>

      {/* Main value */}
      <div
        style={{
          fontFamily:  'var(--font-condensed)',
          fontSize:    32,
          fontWeight:  900,
          lineHeight:  1,
          color:       'var(--color-text)',
          letterSpacing: '-0.01em',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {formatCurrency(kpi.value, true)}
      </div>

      {/* Delta badge + vs budget */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
        <span
          style={{
            fontFamily:    'var(--font-condensed)',
            fontSize:      11,
            fontWeight:    800,
            letterSpacing: '0.05em',
            padding:       '2px 8px',
            borderRadius:  4,
            background:    accentBg,
            color:         accentColor,
          }}
        >
          {pctPrefix}{kpi.variancePercent.toFixed(1)}%
        </span>
        <span
          style={{
            fontSize: 12,
            color:    'var(--color-muted)',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {deltaPrefix}{formatCurrency(Math.abs(kpi.varianceDollar))} vs plan
        </span>
      </div>
    </div>
  );
}
