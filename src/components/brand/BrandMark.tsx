/**
 * Empire OS brand wordmark.
 *
 * Two-line text mark rendered in SVG:
 *   Line 1: "EMPIRE"  — cobalt #1D44BF, bold, ~18px
 *   Line 2: "BUILDER" — gold #E8B84B, bold, ~10px
 * Typeface: DM Sans / system-ui fallback.
 *
 * `height` sizes the mark (width follows the SVG's intrinsic aspect ratio).
 */

interface BrandMarkProps {
  color?: string;
  /** Pixel height of the mark. Width scales to preserve aspect ratio. */
  height?: number;
  /** Accessible label. Defaults to "Empire OS". */
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}

// viewBox is "0 0 440 56" → width / height = 440 / 56
const ASPECT = 440 / 56;

export default function BrandMark({
  color = 'currentColor',
  height = 32,
  label = 'Empire OS',
  className,
  style,
}: BrandMarkProps) {
  const width = Math.round(height * ASPECT * 100) / 100;
  return (
    <svg
      role="img"
      aria-label={label}
      className={className}
      style={{ display: 'block', ...style }}
      width={width}
      height={height}
      viewBox="0 0 440 56"
      xmlns="http://www.w3.org/2000/svg"
    >
      <text
        x="0" y="36"
        style={{ fontFamily: '"DM Sans", system-ui, sans-serif', fontWeight: 700, fontSize: 36 }}
        fill="#1D44BF"
      >
        EMPIRE
      </text>
      <text
        x="2" y="52"
        style={{ fontFamily: '"DM Sans", system-ui, sans-serif', fontWeight: 700, fontSize: 14 }}
        fill="#E8B84B"
        letterSpacing="6"
      >
        BUILDER
      </text>
    </svg>
  );
}
