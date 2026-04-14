/**
 * SofaScore Data Service
 *
 * Fetches team data from SofaScore via Apify scraper
 * with file-based caching to minimize API calls and costs.
 *
 * Data is cached locally and refreshed via API route (daily or on-demand).
 */

import { promises as fs } from 'fs';
import path from 'path';
import { Fixture, Result, LeagueTableRow, CometResponse } from '@/types';

// ============================================
// CONFIGURATION
// ============================================

const APIFY_API_TOKEN = process.env.APIFY_API_TOKEN || '';
const SOFASCORE_ACTOR_ID = 'azzouzana/sofascore-scraper-pro';

// Cwmbran Celtic team URLs on SofaScore
const SOFASCORE_URLS = {
  mens: 'https://www.sofascore.com/team/football/cwmbran-celtic/37942',
  // Add ladies team URL when available on SofaScore
};

// Cache file location (in project root for persistence)
const CACHE_DIR = path.join(process.cwd(), '.cache');
const CACHE_FILE = path.join(CACHE_DIR, 'sofascore-data.json');

// Cache duration: 24 hours in milliseconds
const CACHE_DURATION = 24 * 60 * 60 * 1000;

// ============================================
// SOFASCORE DATA TYPES
// ============================================

export interface SofaScoreTeamData {
  id: number;
  sport: string;
  teamDetails: {
    name: string;
    slug: string;
    venue?: {
      name: string;
      city?: { name: string };
    };
    teamColors?: {
      primary: string;
      secondary: string;
    };
  };
  teamUniqueTournaments?: {
    uniqueTournaments: Array<{
      name: string;
      slug: string;
      id: number;
    }>;
  };
  seoContent?: {
    about: string;
  };
}

export interface SofaScoreMatch {
  id: number;
  startTimestamp: number;
  homeTeam: {
    name: string;
    slug: string;
    id: number;
  };
  awayTeam: {
    name: string;
    slug: string;
    id: number;
  };
  homeScore?: {
    current?: number;
    display?: number;
  };
  awayScore?: {
    current?: number;
    display?: number;
  };
  tournament?: {
    name: string;
    slug: string;
  };
  status?: {
    type: string;
    description?: string;
  };
  roundInfo?: {
    round?: number;
  };
}

export interface SofaScoreStanding {
  team: {
    name: string;
    slug: string;
    id: number;
  };
  position: number;
  matches: number;
  wins: number;
  draws: number;
  losses: number;
  scoresFor: number;
  scoresAgainst: number;
  points: number;
}

export interface CachedSofaScoreData {
  lastUpdated: number;
  teamData: SofaScoreTeamData | null;
  fixtures: SofaScoreMatch[];
  results: SofaScoreMatch[];
  standings: SofaScoreStanding[];
}

// ============================================
// CACHE MANAGEMENT
// ============================================

async function ensureCacheDir(): Promise<void> {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
  } catch {
    // Directory may already exist
  }
}

async function readCache(): Promise<CachedSofaScoreData | null> {
  try {
    const data = await fs.readFile(CACHE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return null;
  }
}

async function writeCache(data: CachedSofaScoreData): Promise<void> {
  await ensureCacheDir();
  await fs.writeFile(CACHE_FILE, JSON.stringify(data, null, 2));
}

function isCacheValid(cache: CachedSofaScoreData | null): boolean {
  if (!cache) return false;
  const age = Date.now() - cache.lastUpdated;
  return age < CACHE_DURATION;
}

// ============================================
// APIFY API CLIENT
// ============================================

interface ApifyRunResponse {
  data: {
    id: string;
    status: string;
    defaultDatasetId: string;
  };
}

interface ApifyDatasetItem {
  url: string;
  data: SofaScoreTeamData;
}

/**
 * Run the SofaScore scraper on Apify and get results
 */
export async function fetchFromApify(urls: string[]): Promise<ApifyDatasetItem[]> {
  if (!APIFY_API_TOKEN) {
    console.warn('Apify API token not configured');
    return [];
  }

  try {
    // Start the actor run
    const runResponse = await fetch(
      `https://api.apify.com/v2/acts/${SOFASCORE_ACTOR_ID}/runs?token=${APIFY_API_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startUrls: urls.map(url => ({ url })),
        }),
      }
    );

    if (!runResponse.ok) {
      throw new Error(`Apify run failed: ${runResponse.status}`);
    }

    const runData: ApifyRunResponse = await runResponse.json();
    const runId = runData.data.id;

    // Wait for the run to complete (poll every 5 seconds, max 2 minutes)
    let status = runData.data.status;
    let attempts = 0;
    const maxAttempts = 24;

    while (status !== 'SUCCEEDED' && status !== 'FAILED' && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 5000));

      const statusResponse = await fetch(
        `https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_API_TOKEN}`
      );
      const statusData = await statusResponse.json();
      status = statusData.data.status;
      attempts++;
    }

    if (status !== 'SUCCEEDED') {
      throw new Error(`Apify run did not complete: ${status}`);
    }

    // Fetch the dataset results
    const datasetId = runData.data.defaultDatasetId;
    const datasetResponse = await fetch(
      `https://api.apify.com/v2/datasets/${datasetId}/items?token=${APIFY_API_TOKEN}`
    );

    if (!datasetResponse.ok) {
      throw new Error(`Failed to fetch dataset: ${datasetResponse.status}`);
    }

    return datasetResponse.json();
  } catch (error) {
    console.error('Apify fetch error:', error);
    return [];
  }
}

// ============================================
// DATA TRANSFORMATION
// ============================================

/**
 * Convert SofaScore matches to our Fixture format
 */
function transformToFixtures(matches: SofaScoreMatch[]): Fixture[] {
  const now = Date.now();

  return matches
    .filter(match => (match.startTimestamp * 1000) > now)
    .map(match => {
      const isCwmbranHome = match.homeTeam.name.toLowerCase().includes('cwmbran');
      const matchDate = new Date(match.startTimestamp * 1000);

      return {
        matchId: match.id,
        date: match.startTimestamp * 1000,
        time: matchDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        homeTeam: match.homeTeam.name,
        awayTeam: match.awayTeam.name,
        competition: match.tournament?.name || 'League',
        venue: isCwmbranHome ? 'Celtic Park, Cwmbran' : 'Away',
        homeAway: (isCwmbranHome ? 'H' : 'A') as 'H' | 'A',
      };
    })
    .sort((a, b) => a.date - b.date);
}

/**
 * Convert SofaScore matches to our Result format
 */
function transformToResults(matches: SofaScoreMatch[]): Result[] {
  const now = Date.now();

  return matches
    .filter(match => {
      const hasScore = match.homeScore?.current !== undefined && match.awayScore?.current !== undefined;
      const isPast = (match.startTimestamp * 1000) < now;
      return hasScore && isPast;
    })
    .map(match => ({
      matchId: match.id,
      date: match.startTimestamp * 1000,
      homeTeam: match.homeTeam.name,
      awayTeam: match.awayTeam.name,
      homeScore: match.homeScore?.current || match.homeScore?.display || 0,
      awayScore: match.awayScore?.current || match.awayScore?.display || 0,
      competition: match.tournament?.name || 'League',
      scorers: '', // SofaScore doesn't provide this in basic scrape
      attendance: 0,
    }))
    .sort((a, b) => b.date - a.date);
}

/**
 * Convert SofaScore standings to our LeagueTableRow format
 */
function transformToLeagueTable(standings: SofaScoreStanding[]): LeagueTableRow[] {
  return standings.map(standing => ({
    position: standing.position,
    club: standing.team.name,
    played: standing.matches,
    won: standing.wins,
    drawn: standing.draws,
    lost: standing.losses,
    gd: standing.scoresFor - standing.scoresAgainst,
    points: standing.points,
  }));
}

// ============================================
// PUBLIC API
// ============================================

/**
 * Get cached SofaScore data, refreshing if stale
 */
export async function getSofaScoreData(): Promise<CachedSofaScoreData> {
  const cache = await readCache();

  if (isCacheValid(cache)) {
    return cache!;
  }

  // Return stale cache if available, refresh happens via API route
  if (cache) {
    console.log('SofaScore cache is stale, using cached data');
    return cache;
  }

  // No cache at all - return empty data
  return {
    lastUpdated: 0,
    teamData: null,
    fixtures: [],
    results: [],
    standings: [],
  };
}

/**
 * Force refresh SofaScore data from Apify
 * Called by API route for scheduled/manual refresh
 */
export async function refreshSofaScoreData(): Promise<CachedSofaScoreData> {
  console.log('Refreshing SofaScore data from Apify...');

  const urls = Object.values(SOFASCORE_URLS);
  const results = await fetchFromApify(urls);

  if (results.length === 0) {
    console.warn('No data returned from Apify, keeping existing cache');
    const existingCache = await readCache();
    if (existingCache) return existingCache;
  }

  // Process the first result (men's team)
  const mensData = results[0]?.data;

  const newCache: CachedSofaScoreData = {
    lastUpdated: Date.now(),
    teamData: mensData || null,
    fixtures: [], // Will be populated from match pages if needed
    results: [],
    standings: [],
  };

  await writeCache(newCache);
  console.log('SofaScore cache updated');

  return newCache;
}

/**
 * Import data directly from a downloaded JSON file
 * Useful for importing Apify exports without API calls
 */
export async function importSofaScoreFromFile(filePath: string): Promise<CachedSofaScoreData> {
  const fileData = await fs.readFile(filePath, 'utf-8');
  const jsonData: ApifyDatasetItem[] = JSON.parse(fileData);

  const mensData = jsonData[0]?.data;

  const newCache: CachedSofaScoreData = {
    lastUpdated: Date.now(),
    teamData: mensData || null,
    fixtures: [],
    results: [],
    standings: [],
  };

  await writeCache(newCache);
  console.log('SofaScore data imported from file');

  return newCache;
}

// ============================================
// COMET-COMPATIBLE EXPORTS
// ============================================

/**
 * Get fixtures in Comet response format
 */
export async function getSofaScoreFixtures(): Promise<CometResponse<Fixture>> {
  const data = await getSofaScoreData();
  const fixtures = transformToFixtures(data.fixtures);

  return {
    reportName: 'SofaScore Fixtures',
    columnTypes: ['NUMBER', 'DATE', 'STRING', 'STRING', 'STRING', 'STRING', 'STRING', 'STRING'],
    columnNames: ['Match ID', 'Date', 'Time', 'Home', 'Away', 'Competition', 'Venue', 'H/A'],
    columnKeys: ['matchId', 'date', 'time', 'homeTeam', 'awayTeam', 'competition', 'venue', 'homeAway'],
    results: fixtures,
    totalSize: fixtures.length,
    page: 0,
    pageSize: fixtures.length,
  };
}

/**
 * Get results in Comet response format
 */
export async function getSofaScoreResults(): Promise<CometResponse<Result>> {
  const data = await getSofaScoreData();
  const results = transformToResults(data.results);

  return {
    reportName: 'SofaScore Results',
    columnTypes: ['NUMBER', 'DATE', 'STRING', 'STRING', 'NUMBER', 'NUMBER', 'STRING', 'STRING', 'NUMBER'],
    columnNames: ['Match ID', 'Date', 'Home', 'Away', 'Home Score', 'Away Score', 'Competition', 'Scorers', 'Attendance'],
    columnKeys: ['matchId', 'date', 'homeTeam', 'awayTeam', 'homeScore', 'awayScore', 'competition', 'scorers', 'attendance'],
    results: results,
    totalSize: results.length,
    page: 0,
    pageSize: results.length,
  };
}

/**
 * Get league table in Comet response format
 */
export async function getSofaScoreLeagueTable(): Promise<CometResponse<LeagueTableRow>> {
  const data = await getSofaScoreData();
  const table = transformToLeagueTable(data.standings);

  return {
    reportName: 'SofaScore League Table',
    columnTypes: ['NUMBER', 'STRING', 'NUMBER', 'NUMBER', 'NUMBER', 'NUMBER', 'NUMBER', 'NUMBER'],
    columnNames: ['Position', 'Club', 'Played', 'Won', 'Drawn', 'Lost', 'GD', 'Points'],
    columnKeys: ['position', 'club', 'played', 'won', 'drawn', 'lost', 'gd', 'points'],
    results: table,
    totalSize: table.length,
    page: 0,
    pageSize: table.length,
  };
}

/**
 * Check if SofaScore data is available
 */
export function isSofaScoreConfigured(): boolean {
  return !!APIFY_API_TOKEN;
}

/**
 * Get cache status
 */
export async function getCacheStatus(): Promise<{
  hasCache: boolean;
  lastUpdated: number | null;
  isStale: boolean;
  ageHours: number | null;
}> {
  const cache = await readCache();

  if (!cache) {
    return { hasCache: false, lastUpdated: null, isStale: true, ageHours: null };
  }

  const ageMs = Date.now() - cache.lastUpdated;
  const ageHours = Math.round(ageMs / (1000 * 60 * 60) * 10) / 10;

  return {
    hasCache: true,
    lastUpdated: cache.lastUpdated,
    isStale: !isCacheValid(cache),
    ageHours,
  };
}
