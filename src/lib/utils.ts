export function formatCurrency(n: number, compact = false): string {
  if (compact) {
    const abs = Math.abs(n);
    if (abs >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
    if (abs >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  }
  return '$' + Math.abs(n).toLocaleString('en-US');
}

export function formatPercent(n: number): string {
  const sign = n >= 0 ? '+' : '';
  return `${sign}${n.toFixed(1)}%`;
}

export function varianceClass(
  variance: number,
  isExpense = false
): 'positive' | 'negative' | 'neutral' {
  if (Math.abs(variance) < 1500) return 'neutral';
  const favorable = isExpense ? variance < 0 : variance > 0;
  return favorable ? 'positive' : 'negative';
}

export function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
