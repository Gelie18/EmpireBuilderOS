/**
 * Composed brand mark with optional product label.
 * Wraps BrandMark (the real logo PNG) with layout helpers.
 *
 * Two layouts:
 *  - 'horizontal' (default): logo on left, product label to the right
 *  - 'stacked': logo centered above the product label
 */

import BrandMark from './BrandMark';

interface BrandLogoProps {
  product?: string;
  layout?: 'horizontal' | 'stacked';
  markHeight?: number;
  /** 'light' = black logo for light pages (default), 'dark' = white logo for dark pages */
  theme?: 'dark' | 'light';
  /** kept for backward-compat — ignored */
  markColor?: string;
  labelColor?: string;
  ariaLabel?: string;
}

export default function BrandLogo({
  product,
  layout = 'horizontal',
  markHeight = 30,
  theme = 'light',
  labelColor = '#E8B84B',
  ariaLabel,
}: BrandLogoProps) {
  const label = ariaLabel ?? (product ? `Empire Builder — ${product}` : 'Empire Builder');

  if (layout === 'stacked') {
    return (
      <div aria-label={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <BrandMark theme={theme} height={markHeight} label="Empire Builder" />
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
      <BrandMark theme={theme} height={markHeight} label="Empire Builder" />
      {product && (
        <>
          <div style={{ width: 1, height: markHeight * 0.72, background: 'rgba(0,0,0,0.12)' }} aria-hidden />
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
