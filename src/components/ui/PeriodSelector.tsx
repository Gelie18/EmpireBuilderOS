'use client';

export type PeriodKey = 'current' | 'last' | 'last3' | 'ytd' | 'last12';

export const PERIOD_OPTIONS: { key: PeriodKey; label: string; sublabel: string }[] = [
  { key: 'current', label: 'Current Month',  sublabel: 'Apr 2026' },
  { key: 'last',    label: 'Last Month',      sublabel: 'Mar 2026' },
  { key: 'last3',   label: 'Last 3 Months',   sublabel: 'Feb–Apr 2026' },
  { key: 'ytd',     label: 'Year to Date',     sublabel: 'Jan–Apr 2026' },
  { key: 'last12',  label: 'Last 12 Months',  sublabel: 'May 2025–Apr 2026' },
];

interface PeriodSelectorProps {
  value: PeriodKey;
  onChange: (period: PeriodKey) => void;
}

export default function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      {/* Calendar icon */}
      <span
        style={{
          position:    'absolute',
          left:        10,
          top:         '50%',
          transform:   'translateY(-50%)',
          display:     'flex',
          alignItems:  'center',
          pointerEvents: 'none',
          color:       '#1D44BF',
          zIndex:      1,
        }}
      >
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="17" rx="2" />
          <path d="M3 9h18M8 2v4M16 2v4" strokeLinecap="round" />
        </svg>
      </span>

      {/* Select element */}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as PeriodKey)}
        onFocus={(e) => { e.currentTarget.style.borderColor = '#1D44BF'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(29,68,191,0.12)'; }}
        onBlur={(e)  => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.boxShadow = 'none'; }}
        style={{
          appearance:      'none',
          WebkitAppearance: 'none',
          padding:         '8px 36px 8px 32px',
          border:          '1px solid var(--color-border)',
          background:      'var(--color-surf)',
          borderRadius:    6,
          fontSize:        13,
          fontWeight:      600,
          color:           'var(--color-text)',
          cursor:          'pointer',
          outline:         'none',
          transition:      'border-color 0.15s, box-shadow 0.15s',
          lineHeight:      1.4,
        }}
      >
        {PERIOD_OPTIONS.map((opt) => (
          <option key={opt.key} value={opt.key}>
            {opt.label} — {opt.sublabel}
          </option>
        ))}
      </select>

      {/* Custom chevron */}
      <span
        style={{
          position:    'absolute',
          right:       10,
          top:         '50%',
          transform:   'translateY(-50%)',
          display:     'flex',
          alignItems:  'center',
          pointerEvents: 'none',
          color:       'var(--color-muted)',
        }}
      >
        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <polyline points="6 9 12 15 18 9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </div>
  );
}
