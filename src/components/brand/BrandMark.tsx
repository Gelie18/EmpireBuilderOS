/**
 * 783 brand wordmark.
 *
 * Faithful to /public/brand/783-wordmark.svg and the 2026 brand guidelines:
 * a single oversized "7" with "83" set as a compact superscript to the
 * upper-right. Typeface per guidelines is Aeonik Bold; the web falls back
 * to Inter / system-ui — the shape is the mark, the font matches when
 * Aeonik is licensed and loaded.
 *
 * `color` paints the wordmark. `height` sizes it (width follows the SVG's
 * intrinsic aspect ratio of ~0.839:1).
 */

interface BrandMarkProps {
  color?: string;
  /** Pixel height of the mark. Width scales to preserve aspect ratio. */
  height?: number;
  /** Accessible label. Defaults to "783". */
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}

const ASPECT = 438.79 / 523.31;

export default function BrandMark({
  color = 'currentColor',
  height = 32,
  label = '783',
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
      viewBox="0 0 438.79 523.31"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill={color} style={{ fontFamily: 'Aeonik, Inter, "DM Sans", system-ui, sans-serif', fontWeight: 700 }}>
        <text x="0" y="357" fontSize="420">7</text>
        <text x="222.17" y="191.7" fontSize="182">8</text>
        <text x="331.77" y="191.7" fontSize="182">3</text>
      </g>
    </svg>
  );
}
