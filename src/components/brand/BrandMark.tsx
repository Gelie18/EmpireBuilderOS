/**
 * Empire Builder brand mark — uses the official logo PNG.
 *
 * The source file is a white logo (works on dark backgrounds).
 * Pass theme="light" to invert it to black for light/white backgrounds.
 *
 * `height` sizes the mark; width is always auto (preserves aspect ratio).
 */

interface BrandMarkProps {
  /** 'dark' = white logo (for dark page backgrounds, default)
   *  'light' = black logo (for white/light page backgrounds) */
  theme?: 'dark' | 'light';
  /** kept for backward-compat with old callers that pass color — ignored */
  color?: string;
  /** Pixel height of the mark. */
  height?: number;
  /** Accessible label. */
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function BrandMark({
  theme = 'light',
  height = 32,
  label = 'Empire Builder',
  className,
  style,
}: BrandMarkProps) {
  // light pages: invert white→black; mix-blend-mode removes the dark bg halo
  // dark  pages: show the logo as-is (white on dark)
  const filterStyle: React.CSSProperties =
    theme === 'light'
      ? { filter: 'invert(1)', mixBlendMode: 'multiply' }
      : {};

  return (
    <img
      src="/brand/empire-builder-logo.png"
      alt={label}
      style={{
        display: 'block',
        height: `${height}px`,   // CSS property — not overridden by Tailwind reset
        width: 'auto',
        userSelect: 'none',
        ...filterStyle,
        ...style,
      }}
      className={className}
      draggable={false}
    />
  );
}
