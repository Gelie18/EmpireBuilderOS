import BrandMark from './BrandMark';

/**
 * Composed wordmark: the "783" brand mark paired with a product label.
 * Two layouts:
 *  - 'horizontal' (default): mark on the left, product label stacked to the right
 *  - 'stacked': mark centered above the product label (used on splash and hero)
 */

interface BrandLogoProps {
  product?: string;               // e.g. "OS", "FINANCE OS", "HR OS"
  layout?: 'horizontal' | 'stacked';
  /** Pixel height of the 783 mark. */
  markHeight?: number;
  /** Color of the 783 mark. */
  markColor?: string;
  /** Color of the product label. */
  labelColor?: string;
  /** Accessible label. */
  ariaLabel?: string;
}

export default function BrandLogo({
  product,
  layout = 'horizontal',
  markHeight = 30,
  markColor = '#FFFFFF',
  labelColor = 'var(--color-accent)',
  ariaLabel,
}: BrandLogoProps) {
  const label = ariaLabel ?? (product ? `783 — ${product}` : '783');

  if (layout === 'stacked') {
    return (
      <div aria-label={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <BrandMark color={markColor} height={markHeight} label="783" />
        {product && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 36, height: 1, background: labelColor, opacity: 0.6, marginBottom: 8 }} />
            <div style={{
              fontFamily: 'Aeonik, Inter, "DM Sans", system-ui, sans-serif',
              fontWeight: 700,
              fontSize: Math.round(markHeight * 0.33),
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: labelColor,
              lineHeight: 1,
            }}>
              {product}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div aria-label={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <BrandMark color={markColor} height={markHeight} label="783" />
      {product && (
        <>
          <div style={{ width: 1, height: markHeight * 0.72, background: 'rgba(255,255,255,0.22)' }} aria-hidden />
          <span style={{
            fontFamily: 'Aeonik, Inter, "DM Sans", system-ui, sans-serif',
            fontWeight: 700,
            fontSize: Math.max(10, Math.round(markHeight * 0.4)),
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: labelColor,
            lineHeight: 1,
          }}>
            {product}
          </span>
        </>
      )}
    </div>
  );
}
