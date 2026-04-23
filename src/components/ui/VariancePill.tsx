interface VariancePillProps {
  value: number;
  type?: 'expense' | 'revenue';
}

export default function VariancePill({ value, type = 'revenue' }: VariancePillProps) {
  const isSmall = Math.abs(value) < 1500;
  const favorable = type === 'expense' ? value < 0 : value > 0;

  let bg: string, color: string;
  if (isSmall) {
    bg = 'var(--color-orange-d)'; color = 'var(--color-orange)';
  } else if (favorable) {
    bg = 'var(--color-green-d)'; color = 'var(--color-green)';
  } else {
    bg = 'var(--color-red-d)'; color = 'var(--color-red)';
  }

  const sign = value >= 0 ? '+' : '';
  return (
    <span
      className="inline-block font-bold px-1.5 py-0.5 text-[11px]"
      style={{ fontFamily: 'var(--font-condensed)', background: bg, color }}
    >
      {sign}{value.toFixed(1)}%
    </span>
  );
}
