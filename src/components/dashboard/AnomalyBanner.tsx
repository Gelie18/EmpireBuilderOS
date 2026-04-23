'use client';

import { useState } from 'react';
import type { Anomaly } from '@/lib/data/types';

interface AnomalyBannerProps {
  anomalies: Anomaly[];
}

const SEVERITY_COLOR: Record<string, string> = {
  critical: 'var(--color-red)',
  warning:  'var(--color-orange)',
  info:     'var(--color-blue)',
};

const SEVERITY_BG: Record<string, string> = {
  critical: 'var(--color-red-d)',
  warning:  'var(--color-orange-d)',
  info:     'var(--color-blue-d)',
};

export default function AnomalyBanner({ anomalies }: AnomalyBannerProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const visible = anomalies.filter((a) => !dismissed.has(a.id));

  if (!visible.length) return null;

  const dismissAll = () => setDismissed(new Set(anomalies.map((a) => a.id)));

  return (
    <div
      className="border animate-fade-up"
      style={{
        background:   'var(--color-surf)',
        borderColor:  'var(--color-border)',
        borderRadius: 'var(--card-radius)',
        overflow:     'hidden',
        boxShadow:    'var(--card-shadow)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-2.5 border-b"
        style={{ background: 'var(--color-surf2)', borderColor: 'var(--color-border)' }}
      >
        <div
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{
            background: visible.some((a) => a.severity === 'critical')
              ? 'var(--color-red)'
              : 'var(--color-orange)',
            boxShadow: 'none',
          }}
        />
        <span
          className="text-[12px] font-bold uppercase tracking-[0.1em]"
          style={{
            fontFamily: 'var(--font-condensed)',
            color: visible.some((a) => a.severity === 'critical')
              ? 'var(--color-red)'
              : 'var(--color-orange)',
          }}
        >
          {visible.length} Flag{visible.length > 1 ? 's' : ''} for Review
        </span>
        <span
          className="text-[11px]"
          style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-condensed)' }}
        >
          · Action required before next close
        </span>
        <button
          onClick={dismissAll}
          className="ml-auto text-[11px] cursor-pointer px-2 py-0.5 transition-colors"
          style={{
            background: 'transparent',
            border: '1px solid var(--color-border2)',
            color: 'var(--color-muted)',
            fontFamily: 'var(--font-condensed)',
            letterSpacing: '0.04em',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-muted)';
            e.currentTarget.style.color = 'var(--color-text)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-border2)';
            e.currentTarget.style.color = 'var(--color-muted)';
          }}
        >
          Dismiss all
        </button>
      </div>

      {/* Flag rows */}
      {visible.map((a, i) => {
        const color = SEVERITY_COLOR[a.severity] ?? 'var(--color-orange)';
        const bg    = SEVERITY_BG[a.severity]    ?? 'var(--color-orange-d)';
        return (
          <div
            key={a.id}
            className="flex items-start gap-3 px-4 py-3"
            style={{
              borderBottom: i < visible.length - 1 ? '1px solid var(--color-border)' : 'none',
              borderLeft: `3px solid ${color}`,
            }}
          >
            {/* Category badge */}
            <div className="flex-shrink-0 mt-0.5">
              <span
                className="text-[10px] font-black uppercase tracking-[0.1em] px-2 py-0.5"
                style={{ background: bg, color, fontFamily: 'var(--font-condensed)' }}
              >
                {a.category}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <span
                className="text-[13px] font-semibold leading-snug"
                style={{ color: 'var(--color-text)' }}
              >
                {a.headline}
              </span>
              {a.detail && (
                <span
                  className="text-[13px] leading-snug"
                  style={{ color: 'var(--color-muted)' }}
                >
                  {' '}— {a.detail}
                </span>
              )}
            </div>

            {/* Dismiss */}
            <button
              onClick={() => setDismissed((p) => new Set(p).add(a.id))}
              className="text-[13px] flex-shrink-0 mt-0.5 cursor-pointer w-6 h-6 flex items-center justify-center transition-colors"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-muted)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-text)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-muted)'; }}
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
}
