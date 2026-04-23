'use client';

import { useEffect } from 'react';

/**
 * Forces data-theme="dark" on the <html> element for the lifetime of the
 * HR OS route group, then restores the previous theme on unmount.
 * HR OS is designed exclusively for dark mode — all component styles use
 * hardcoded dark colours (rgba(255,255,255,x) text, etc.) and would be
 * invisible on a light-mode background.
 */
export function ForceDarkMode({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const prev = document.documentElement.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', 'dark');
    return () => {
      if (prev) {
        document.documentElement.setAttribute('data-theme', prev);
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
    };
  }, []);

  return <>{children}</>;
}
