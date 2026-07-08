/**
 * Comet API Client
 *
 * Data sources (in priority order):
 * 1. Comet API (FAW) - when API keys are granted
 * 2. SofaScore data (via Apify) - web-scraped data
 * 3. Mock data - fallback for development
 *
 * Comet API docs: https://kb.analyticom.de/comet/api-access-to-comet-data
 */

import { cache } from 'react';
import { CometResponse, Fixture, Result, LeagueTableRow, Player, PlayerStats } from '@/types';
import {
  mockFixtures,
  mockResults,
  mockLeagueTable,
  mockLadiesLeagueTable,
  mockSquad,
  mockPlayerStats
} from '@/data/mock-data';
import { fetchAllTeams } from '@/lib/allwalessport';
import { AWS_TEAMS, type TeamKey } from '@/data/allwalessport-teams';
// SofaScore imports disabled - fs module can't be used in client components
// Data is fetched via /api/sofascore instead
// import {
//   getSofaScoreFixtures,
//   getSofaScoreResults,
//   getSofaScoreLeagueTable,
//   getSofaScoreData,
// } from '@/lib/sofascore';

// ============================================
// CONFIGURATION
// ============================================

const COMET_BASE_URL = 'https://comet.faw.cymru/data-backend/api/public/areports/run';

// API Keys - populate when granted access
const API_KEYS = {
  fixtures: process.env.COMET_API_KEY_FIXTURES || '',
  results: process.env.COMET_API_KEY_RESULTS || '',
  leagueTable: process.env.COMET_API_KEY_LEAGUE || '',
  ladiesLeague: process.env.COMET_API_KEY_LADIES_LEAGUE || '',
  squad: process.env.COMET_API_KEY_SQUAD || '',
  playerStats: process.env.COMET_API_KEY_STATS || '',
};

// Set to true when API keys are available
const USE_LIVE_API = false;

// allwalessport is the primary live provider. React cache() memoises one
// fetchAllTeams() call per request so all fetchers share it, while the inner
// fetch()'s ISR revalidate refreshes data across requests. (A module-level
// promise would freeze the result — and cache a transient empty/failed feed —
// for the whole process lifetime.)
const loadAllwalessport = cache(() => fetchAllTeams());

// ============================================
// API CLIENT
// ============================================

/**
 * Fetch data from Comet API
 */
async function fetchFromComet<T>(
  apiKey: string, 
  page = 0, 
  perPage = 25
): Promise<CometResponse<T>> {
  if (!apiKey) {
    throw new Error('API key not configured');
  }

  const url = `${COMET_BASE_URL}/${page}/${perPage}/?API_KEY=${apiKey}`;
  
  const response = await fetch(url, {
    next: { revalidate: 3600 } // Cache for 1 hour
  });

  if (!response.ok) {
    throw new Error(`Comet API error: ${response.status}`);
  }

  return response.json();
}

// ============================================
// DATA FETCHERS
// ============================================

/** Wrap a typed row array in the CometResponse envelope the UI expects. */
function wrap<T>(reportName: string, results: T[]): CometResponse<T> {
  return {
    reportName,
    columnTypes: [],
    columnNames: [],
    columnKeys: [],
    results,
    totalSize: results.length,
    page: 0,
    pageSize: results.length,
  };
}

/** Tag mock rows with a team key from the club-name convention, so mock and
 *  live rows share the same `team` discriminator. */
function tagMockByName<T extends { homeTeam: string; awayTeam: string; team?: TeamKey }>(
  rows: T[],
): T[] {
  return rows.map(r => ({
    ...r,
    team: (r.homeTeam.includes('Ladies') || r.awayTeam.includes('Ladies') ? 'ladies' : 'mens') as TeamKey,
  }));
}

/** Merge per registry team: use a team's LIVE rows when present, else its own
 *  MOCK rows. Wiring one team live never blanks another (and a source outage
 *  falls that team back to mock). */
function mergeByTeam<T extends { team?: TeamKey; homeTeam: string; awayTeam: string }>(
  live: T[],
  mock: T[],
): T[] {
  const taggedMock = tagMockByName(mock);
  const out: T[] = [];
  for (const t of AWS_TEAMS) {
    const liveRows = live.filter(r => r.team === t.key);
    out.push(...(liveRows.length > 0 ? liveRows : taggedMock.filter(r => r.team === t.key)));
  }
  return out;
}

/**
 * Get all fixtures
 */
export async function getFixtures(): Promise<CometResponse<Fixture>> {
  // Priority 1: Comet API
  if (USE_LIVE_API && API_KEYS.fixtures) {
    return fetchFromComet<Fixture>(API_KEYS.fixtures);
  }

  // Priority 2/3: allwalessport per-team, falling back to mock per team
  const aws = await loadAllwalessport();
  return wrap('Fixtures', mergeByTeam(aws.fixtures, (mockFixtures as CometResponse<Fixture>).results));
}

/**
 * Get upcoming fixtures only
 */
export async function getUpcomingFixtures(limit = 5): Promise<Fixture[]> {
  const data = await getFixtures();
  const now = Date.now();
  
  return data.results
    .filter(f => f.date > now)
    .sort((a, b) => a.date - b.date)
    .slice(0, limit);
}

/**
 * Get next home fixture
 */
export async function getNextHomeFixture(): Promise<Fixture | null> {
  const data = await getFixtures();
  const now = Date.now();
  
  const homeFixtures = data.results
    .filter(f => f.date > now && f.homeAway === 'H')
    .sort((a, b) => a.date - b.date);
  
  return homeFixtures[0] || null;
}

/**
 * Get fixtures by team
 */
export async function getFixturesByTeam(team: TeamKey): Promise<Fixture[]> {
  const data = await getFixtures();
  return data.results.filter(f => f.team === team);
}

/**
 * Get all results
 */
export async function getResults(): Promise<CometResponse<Result>> {
  // Priority 1: Comet API
  if (USE_LIVE_API && API_KEYS.results) {
    return fetchFromComet<Result>(API_KEYS.results);
  }

  // Priority 2/3: allwalessport per-team, falling back to mock per team
  const aws = await loadAllwalessport();
  return wrap('Results', mergeByTeam(aws.results, (mockResults as CometResponse<Result>).results));
}

/**
 * Get recent results
 */
export async function getRecentResults(limit = 5): Promise<Result[]> {
  const data = await getResults();
  
  return data.results
    .sort((a, b) => b.date - a.date)
    .slice(0, limit);
}

/**
 * Get latest result
 */
export async function getLatestResult(): Promise<Result | null> {
  const results = await getRecentResults(1);
  return results[0] || null;
}

/**
 * Get men's league table
 */
export async function getMensLeagueTable(): Promise<CometResponse<LeagueTableRow>> {
  // Priority 1: Comet API
  if (USE_LIVE_API && API_KEYS.leagueTable) {
    return fetchFromComet<LeagueTableRow>(API_KEYS.leagueTable);
  }

  // Priority 2: allwalessport
  const aws = await loadAllwalessport();
  const table = aws.tables['mens'] ?? [];
  if (table.length > 0) return wrap('League Table', table);

  // Priority 3: Mock data
  return mockLeagueTable as CometResponse<LeagueTableRow>;
}

/**
 * Get ladies league table
 */
export async function getLadiesLeagueTable(): Promise<CometResponse<LeagueTableRow>> {
  if (USE_LIVE_API && API_KEYS.ladiesLeague) {
    return fetchFromComet<LeagueTableRow>(API_KEYS.ladiesLeague);
  }

  const aws = await loadAllwalessport();
  const table = aws.tables['ladies'] ?? [];
  if (table.length > 0) return wrap('Ladies League Table', table);

  return mockLadiesLeagueTable as CometResponse<LeagueTableRow>;
}

/**
 * Get club's position in men's league
 */
export async function getLeaguePosition(
  clubName = 'Cwmbran Celtic'
): Promise<LeagueTableRow | null> {
  const data = await getMensLeagueTable();
  return data.results.find(row => row.club.includes(clubName)) || null;
}

/**
 * Get club's position in ladies league
 */
export async function getLadiesLeaguePosition(
  clubName = 'Cwmbran Celtic'
): Promise<LeagueTableRow | null> {
  const data = await getLadiesLeagueTable();
  return data.results.find(row => row.club.includes(clubName)) || null;
}

/**
 * Get next home fixture for men's team
 */
export async function getNextMensHomeFixture(): Promise<Fixture | null> {
  const data = await getFixtures();
  const now = Date.now();

  const homeFixtures = data.results
    .filter(f => f.date > now && f.homeAway === 'H' && f.team === 'mens')
    .sort((a, b) => a.date - b.date);

  return homeFixtures[0] || null;
}

/**
 * Get next home fixture for ladies team
 */
export async function getNextLadiesHomeFixture(): Promise<Fixture | null> {
  const data = await getFixtures();
  const now = Date.now();

  const homeFixtures = data.results
    .filter(f => f.date > now && f.homeAway === 'H' && f.team === 'ladies')
    .sort((a, b) => a.date - b.date);

  return homeFixtures[0] || null;
}

/**
 * Get upcoming fixtures for men's team
 */
export async function getUpcomingMensFixtures(limit = 5): Promise<Fixture[]> {
  const data = await getFixtures();
  const now = Date.now();

  return data.results
    .filter(f => f.date > now && f.team === 'mens')
    .sort((a, b) => a.date - b.date)
    .slice(0, limit);
}

/**
 * Get upcoming fixtures for ladies team
 */
export async function getUpcomingLadiesFixtures(limit = 5): Promise<Fixture[]> {
  const data = await getFixtures();
  const now = Date.now();

  return data.results
    .filter(f => f.date > now && f.team === 'ladies')
    .sort((a, b) => a.date - b.date)
    .slice(0, limit);
}

/**
 * Get men's squad
 */
export async function getMensSquad(): Promise<CometResponse<Player>> {
  if (USE_LIVE_API && API_KEYS.squad) {
    return fetchFromComet<Player>(API_KEYS.squad);
  }
  return mockSquad as CometResponse<Player>;
}

/**
 * Get player statistics
 */
export async function getPlayerStats(): Promise<CometResponse<PlayerStats>> {
  if (USE_LIVE_API && API_KEYS.playerStats) {
    return fetchFromComet<PlayerStats>(API_KEYS.playerStats);
  }
  return mockPlayerStats as CometResponse<PlayerStats>;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Convert Comet date (milliseconds) to JavaScript Date
 */
export function fromCometDate(ms: number): Date {
  return new Date(ms);
}

/**
 * Format date for display
 */
export function formatMatchDate(ms: number): string {
  const date = fromCometDate(ms);
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });
}

/**
 * Format date for display (long format)
 */
export function formatMatchDateLong(ms: number): string {
  const date = fromCometDate(ms);
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

/**
 * Check if fixture is a home game
 */
export function isHomeGame(fixture: Fixture): boolean {
  return fixture.homeAway === 'H';
}

/**
 * Get opponent name from fixture
 */
export function getOpponent(fixture: Fixture): string {
  return isHomeGame(fixture) ? fixture.awayTeam : fixture.homeTeam;
}

/**
 * Determine result outcome for Cwmbran Celtic
 */
export function getResultOutcome(result: Result): 'W' | 'D' | 'L' {
  const isCwmbranHome = result.homeTeam.includes('Cwmbran');
  
  if (result.homeScore === result.awayScore) return 'D';
  
  if (isCwmbranHome) {
    return result.homeScore > result.awayScore ? 'W' : 'L';
  } else {
    return result.awayScore > result.homeScore ? 'W' : 'L';
  }
}

/**
 * Get score display string
 */
export function getScoreDisplay(result: Result): string {
  return `${result.homeScore} - ${result.awayScore}`;
}

/**
 * Check if result was a home game for Cwmbran Celtic
 */
export function isHomeResult(result: Result): boolean {
  return result.homeTeam.includes('Cwmbran');
}

/**
 * Get opponent name from result
 */
export function getOpponentFromResult(result: Result): string {
  return isHomeResult(result) ? result.awayTeam : result.homeTeam;
}
