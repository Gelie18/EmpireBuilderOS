/**
 * Empire OS — Brand Config
 * Single source of truth for all brand values.
 * Import BRAND from here — never hardcode brand strings in components.
 *
 * Upstream: https://github.com/Gelie18/783demohub
 * To merge upstream updates:
 *   git fetch upstream
 *   git merge upstream/main
 *   npm run build
 *   git push origin main
 */

export const BRAND = {
  name:           'Empire OS',
  shortName:      'Empire',
  tagline:        'While institutional capital consolidates your industry, are you building an asset or just running a job?',
  copyrightHolder: 'Meritage Partners',
  subLabel:       'Finance OS · Meritage Partners',

  // Brand colors — swap these to theme the entire app
  colors: {
    primary:     '#1D44BF',   // cobalt blue  (783 upstream: #1D44BF)
    primaryLight: '#3B62D6',
    primaryDark:  '#162E8A',
    primaryAlpha: 'rgba(29,68,191,0.15)',
    accent:      '#E8B84B',   // warm gold    (783 upstream: #E8B84B)
    accentAlpha: 'rgba(232,184,75,0.14)',
  },

  // Nav / sidebar badge copy
  badge: {
    period: 'Apr 2026',
    mode:   'Demo',
  },
} as const;

export type Brand = typeof BRAND;
