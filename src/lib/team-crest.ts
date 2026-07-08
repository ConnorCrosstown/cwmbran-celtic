import { getOppositionByName } from '@/data/opposition-data';

const CLUB_LOGO = '/images/club-logo.webp';

export type CrestResult =
  | { kind: 'image'; src: string; alt: string }
  | { kind: 'monogram'; initials: string; hue: number; alt: string };

/** 1-2 letter monogram: initials of the first two words, or first two letters
 *  of a single-word name. Uppercased. */
export function crestInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return (words[0] ?? '').slice(0, 2).toUpperCase();
}

function hueFromName(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return h % 360;
}

/** Decide how to render a club's crest: our own logo, a real crest image, or a
 *  deterministic monogram fallback. */
export function resolveTeamCrest(name: string): CrestResult {
  if (name.includes('Cwmbran Celtic')) {
    return { kind: 'image', src: CLUB_LOGO, alt: name };
  }
  const badge = getOppositionByName(name)?.badge;
  if (badge) return { kind: 'image', src: badge, alt: name };
  return { kind: 'monogram', initials: crestInitials(name), hue: hueFromName(name), alt: name };
}
