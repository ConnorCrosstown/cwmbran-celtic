/**
 * Pure fixture/result formatting + display helpers.
 *
 * These are client-safe (no data fetching, no cheerio) and live here — rather
 * than in comet.ts — so client components can import them WITHOUT pulling the
 * server-only scraper (and its ~340KB cheerio dependency) into the browser
 * bundle. comet.ts re-exports these for server-side callers.
 */
import { Fixture, Result } from '@/types';

/** Convert Comet date (milliseconds) to a JavaScript Date. */
export function fromCometDate(ms: number): Date {
  return new Date(ms);
}

/** Short match date, e.g. "Sat, 9 Aug". Pinned to UK time so SSR and client agree. */
export function formatMatchDate(ms: number): string {
  return fromCometDate(ms).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'Europe/London',
  });
}

/** Long match date, e.g. "Saturday, 9 August 2026". Pinned to UK time. */
export function formatMatchDateLong(ms: number): string {
  return fromCometDate(ms).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/London',
  });
}

/** True if the fixture is a Cwmbran home game. */
export function isHomeGame(fixture: Fixture): boolean {
  return fixture.homeAway === 'H';
}

/** The opponent's name for a fixture. */
export function getOpponent(fixture: Fixture): string {
  return isHomeGame(fixture) ? fixture.awayTeam : fixture.homeTeam;
}

/** Outcome for Cwmbran Celtic: Win / Draw / Loss. */
export function getResultOutcome(result: Result): 'W' | 'D' | 'L' {
  const isCwmbranHome = result.homeTeam.includes('Cwmbran');

  if (result.homeScore === result.awayScore) return 'D';

  if (isCwmbranHome) {
    return result.homeScore > result.awayScore ? 'W' : 'L';
  } else {
    return result.awayScore > result.homeScore ? 'W' : 'L';
  }
}

/** Score display string, e.g. "2 - 1". */
export function getScoreDisplay(result: Result): string {
  return `${result.homeScore} - ${result.awayScore}`;
}

/** True if the result was a Cwmbran home game. */
export function isHomeResult(result: Result): boolean {
  return result.homeTeam.includes('Cwmbran');
}

/** The opponent's name for a result. */
export function getOpponentFromResult(result: Result): string {
  return isHomeResult(result) ? result.awayTeam : result.homeTeam;
}
