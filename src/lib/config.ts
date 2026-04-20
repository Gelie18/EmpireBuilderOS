import type { AppMode } from './data/types';

export function getAppMode(): AppMode {
  return (process.env.NEXT_PUBLIC_MODE as AppMode) || 'demo';
}

export function isLiveMode(): boolean {
  return getAppMode() === 'live';
}

export function isDemoMode(): boolean {
  return getAppMode() === 'demo';
}

export const APP_CONFIG = {
  demoCompany: 'Apex Industrial Group',
  liveCompany: 'Meritage Partners',
  defaultPeriod: {
    type: 'month' as const,
    startDate: '2026-10-01',
    endDate: '2026-10-31',
    label: 'Oct 2026',
  },
};
