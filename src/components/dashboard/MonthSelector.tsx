'use client';

import { useState } from 'react';
import type { Period } from '@/lib/data/types';

interface MonthSelectorProps {
  periods: Period[];
  selected: Period;
  onSelect: (period: Period) => void;
}

export default function MonthSelector({ periods, selected, onSelect }: MonthSelectorProps) {
  return (
    <div className="flex gap-1 rounded-lg p-0.5" style={{ background: 'var(--color-surface2)' }}>
      {periods.map((p) => {
        const isActive = p.label === selected.label;
        return (
          <button
            key={p.label}
            onClick={() => onSelect(p)}
            className="px-3 py-1.5 rounded-md text-[12px] border-none cursor-pointer transition-all"
            style={{
              background: isActive ? 'var(--color-accent)' : 'transparent',
              color: isActive ? '#0e0f0d' : 'var(--color-muted)',
              fontWeight: isActive ? 600 : 400,
              fontFamily: 'inherit',
            }}
          >
            {p.label}
          </button>
        );
      })}
    </div>
  );
}
