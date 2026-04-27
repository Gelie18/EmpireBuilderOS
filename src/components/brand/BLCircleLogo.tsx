/**
 * BLCircleLogo — legacy export name; now renders the plain 783 wordmark
 * (no circle, no badge). Kept so existing import sites stay compatible.
 */

import type { CSSProperties } from 'react';
import BrandMark from './BrandMark';

interface BLCircleLogoProps {
  size?: number;
  className?: string;
  style?: CSSProperties;
}

export default function BLCircleLogo({ size = 40, className, style }: BLCircleLogoProps) {
  return (
    <BrandMark
      color="#FFFFFF"
      height={size}
      label="783"
      className={className}
      style={style}
    />
  );
}
