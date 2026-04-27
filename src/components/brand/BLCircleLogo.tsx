/**
 * BLCircleLogo — legacy export name kept so existing import sites stay compatible.
 * Now renders the Empire Builder logo PNG at the requested height.
 */

import type { CSSProperties } from 'react';
import BrandMark from './BrandMark';

interface BLCircleLogoProps {
  size?: number;
  theme?: 'dark' | 'light';
  className?: string;
  style?: CSSProperties;
}

export default function BLCircleLogo({ size = 40, theme = 'light', className, style }: BLCircleLogoProps) {
  return (
    <BrandMark
      theme={theme}
      height={size}
      className={className}
      style={style}
    />
  );
}
