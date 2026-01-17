/**
 * Comet API Client
 * 
 * Stub implementation using mock data.
 * Replace with real API calls when access is granted.
 * 
 * Comet API docs: https://kb.analyticom.de/comet/api-access-to-comet-data
 */

import { CometResponse, Fixture, Result, LeagueTableRow, Player, PlayerStats } from '@/types';
import { 
  mockFixtures, 
  mockResults, 
  mockLeagueTable, 
  mockLadiesLeagueTable,
  mockSquad,
  mockPlayerStats 
} from '@/data/mock-data';

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

/**
 * Get all fixtures
 */
export async function getFixtures(): Promise<CometResponse<Fixture>> {
  if (USE_LIVE_API && API_KEYS.fixtures) {
    return fetchFromComet<Fixture>(API_KEYS.fixtures);
  }
  return mockFixtures as CometResponse<Fixture>;
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
export async function getFixturesByTeam(team: 'mens' | 'ladies'): Promise<Fixture[]> {
  const data = await getFixtures();
  
  return data.results.filter(f => {
    if (team === 'ladies') {
      return f.homeTeam.includes('Ladies') || f.awayTeam.includes('Ladies');
    }
    return !f.homeTeam.includes('Ladies') && !f.awayTeam.includes('Ladies');
  });
}

/**
 * Get all results
 */
export async function getResults(): Promise<CometResponse<Result>> {
  if (USE_LIVE_API && API_KEYS.results) {
    return fetchFromComet<Result>(API_KEYS.results);
  }
  return mockResults as CometResponse<Result>;
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
  if (USE_LIVE_API && API_KEYS.leagueTable) {
    return fetchFromComet<LeagueTableRow>(API_KEYS.leagueTable);
  }
  return mockLeagueTable as CometResponse<LeagueTableRow>;
}

/**
 * Get ladies league table
 */
export async function getLadiesLeagueTable(): Promise<CometResponse<LeagueTableRow>> {
  if (USE_LIVE_API && API_KEYS.ladiesLeague) {
    return fetchFromComet<LeagueTableRow>(API_KEYS.ladiesLeague);
  }
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
  clubName = 'Cwmbran Celtic Ladies'
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
    .filter(f => f.date > now && f.homeAway === 'H' && !f.homeTeam.includes('Ladies'))
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
    .filter(f => f.date > now && f.homeAway === 'H' && f.homeTeam.includes('Ladies'))
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
    .filter(f => f.date > now && !f.homeTeam.includes('Ladies') && !f.awayTeam.includes('Ladies'))
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
    .filter(f => f.date > now && (f.homeTeam.includes('Ladies') || f.awayTeam.includes('Ladies')))
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
