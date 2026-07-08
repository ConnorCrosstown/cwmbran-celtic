const MONTHS: Record<string, number> = {
  january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
};

/** "7 August 2026" -> epoch ms at 12:00 UTC (noon avoids TZ date-shift). NaN if unparseable. */
export function parseAwsDate(text: string): number {
  const m = text.trim().match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
  if (!m) return NaN;
  const day = parseInt(m[1], 10);
  const month = MONTHS[m[2].toLowerCase()];
  const year = parseInt(m[3], 10);
  if (month === undefined) return NaN;
  return Date.UTC(year, month, day, 12, 0, 0);
}

/** Deterministic positive 31-bit id from match identity (allwalessport has no match id). */
export function stableMatchId(date: number, home: string, away: string): number {
  const s = `${date}|${home}|${away}`;
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) % 2147483647 || 1;
}
