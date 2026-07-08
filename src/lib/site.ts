export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
  'https://cwmbran-celtic.vercel.app';

/** Men's first team league (2026-27). Single source of truth for the league name. */
export const MENS_LEAGUE_NAME = 'Ardal League South East';
