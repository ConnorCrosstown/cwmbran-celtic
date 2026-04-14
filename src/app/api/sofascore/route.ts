/**
 * SofaScore Data API Route
 *
 * GET  - Get current cache status and data
 * POST - Refresh data from Apify, import data, or receive webhook
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getSofaScoreData,
  refreshSofaScoreData,
  importSofaScoreFromFile,
  getCacheStatus,
  isSofaScoreConfigured,
} from '@/lib/sofascore';
import { promises as fs } from 'fs';
import path from 'path';

// Secret keys
const ADMIN_SECRET = process.env.SOFASCORE_ADMIN_SECRET || process.env.AUTH_SECRET || '';
const APIFY_WEBHOOK_SECRET = process.env.APIFY_WEBHOOK_SECRET || '';

// In-memory cache for serverless environments (Vercel)
let memoryCache: {
  lastUpdated: number;
  teamData: unknown;
  fixtures: unknown[];
  results: unknown[];
  standings: unknown[];
} | null = null;

/**
 * Helper to save Apify data to cache
 * Uses in-memory cache for Vercel (read-only filesystem)
 * Falls back to file cache for local development
 */
async function saveToCache(datasetItems: Array<{ url?: string; data?: unknown }>): Promise<void> {
  // Find team data and tournament data from the items
  let teamData = null;
  let standings: unknown[] = [];

  for (const item of datasetItems) {
    const data = item.data as Record<string, unknown>;
    if (!data) continue;

    // Team page data
    if (data.teamDetails) {
      teamData = data;
    }

    // Tournament page data - extract standings
    if (data.standings && Array.isArray(data.standings)) {
      const standingsData = data.standings as Array<{ type?: string; rows?: unknown[] }>;
      const totalStandings = standingsData.find(s => s.type === 'total');
      if (totalStandings?.rows) {
        standings = totalStandings.rows;
      }
    }
  }

  const cacheData = {
    lastUpdated: Date.now(),
    teamData,
    fixtures: [],
    results: [],
    standings,
  };

  // Always update memory cache
  memoryCache = cacheData;

  // Try file cache (works locally, fails silently on Vercel)
  try {
    const cacheDir = path.join(process.cwd(), '.cache');
    await fs.mkdir(cacheDir, { recursive: true });
    const cacheFile = path.join(cacheDir, 'sofascore-data.json');
    await fs.writeFile(cacheFile, JSON.stringify(cacheData, null, 2));
  } catch {
    // File write failed (expected on Vercel), using memory cache only
    console.log('File cache unavailable, using memory cache');
  }
}

/**
 * Get cached data (memory or file)
 */
async function getFromCache(): Promise<typeof memoryCache> {
  // Check memory cache first
  if (memoryCache) {
    return memoryCache;
  }

  // Try file cache
  try {
    const cacheFile = path.join(process.cwd(), '.cache', 'sofascore-data.json');
    const data = await fs.readFile(cacheFile, 'utf-8');
    return JSON.parse(data);
  } catch {
    return null;
  }
}

function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !ADMIN_SECRET) return false;
  return authHeader === `Bearer ${ADMIN_SECRET}`;
}

function isValidWebhook(request: NextRequest): boolean {
  // Apify sends the secret in the URL or as a header
  const { searchParams } = new URL(request.url);
  const urlSecret = searchParams.get('secret');
  const headerSecret = request.headers.get('x-apify-webhook-secret');

  if (!APIFY_WEBHOOK_SECRET) return false;

  return urlSecret === APIFY_WEBHOOK_SECRET || headerSecret === APIFY_WEBHOOK_SECRET;
}

/**
 * GET /api/sofascore
 * Returns cache status and optionally the cached data
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeData = searchParams.get('includeData') === 'true';

    const cacheStatus = await getCacheStatus();
    const memoryCacheData = await getFromCache();

    const response: {
      configured: boolean;
      cache: typeof cacheStatus;
      memoryCache?: typeof memoryCacheData;
      data?: Awaited<ReturnType<typeof getSofaScoreData>>;
    } = {
      configured: isSofaScoreConfigured(),
      cache: cacheStatus,
    };

    // Include memory cache status for debugging
    if (memoryCacheData) {
      response.memoryCache = memoryCacheData;
    }

    if (includeData) {
      response.data = await getSofaScoreData();
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('SofaScore GET error:', error);
    return NextResponse.json(
      { error: 'Failed to get SofaScore data' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/sofascore
 *
 * Accepts:
 * 1. Apify webhook (with secret in URL or header)
 * 2. Admin actions (with Bearer token)
 *
 * Apify webhook payload format:
 * {
 *   "resource": { "defaultDatasetId": "..." },
 *   "eventData": { ... }
 * }
 *
 * Admin action formats:
 * - { action: 'refresh' } - Fetch fresh data from Apify
 * - { action: 'import', data: [...] } - Import provided JSON data
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Check if this is an Apify webhook
    if (isValidWebhook(request)) {
      console.log('Received Apify webhook');

      // Apify webhook sends run info, we need to fetch the dataset
      const { resource } = body;

      if (resource?.defaultDatasetId) {
        // Fetch the dataset from Apify
        const datasetId = resource.defaultDatasetId;
        const apifyToken = process.env.APIFY_API_TOKEN;

        if (!apifyToken) {
          console.error('APIFY_API_TOKEN not configured for webhook');
          return NextResponse.json(
            { error: 'Apify token not configured', hasToken: false },
            { status: 500 }
          );
        }

        const datasetUrl = `https://api.apify.com/v2/datasets/${datasetId}/items?token=${apifyToken}`;
        console.log('Fetching dataset:', datasetId);

        const datasetResponse = await fetch(datasetUrl);

        if (!datasetResponse.ok) {
          const errorText = await datasetResponse.text();
          console.error('Dataset fetch failed:', datasetResponse.status, errorText);
          return NextResponse.json(
            { error: `Failed to fetch dataset: ${datasetResponse.status}`, details: errorText },
            { status: 500 }
          );
        }

        const datasetItems = await datasetResponse.json();
        console.log('Dataset items received:', datasetItems.length);

        // Save to cache
        await saveToCache(datasetItems);

        console.log('Webhook data saved successfully');
        return NextResponse.json({
          success: true,
          message: 'Webhook data processed',
          itemsReceived: datasetItems.length,
          lastUpdated: Date.now(),
        });
      }

      // If webhook includes data directly (custom integration)
      if (Array.isArray(body) || body.data) {
        const dataToSave = Array.isArray(body) ? body : [body];
        await saveToCache(dataToSave);

        return NextResponse.json({
          success: true,
          message: 'Direct webhook data processed',
          lastUpdated: Date.now(),
        });
      }

      return NextResponse.json(
        { error: 'Invalid webhook payload' },
        { status: 400 }
      );
    }

    // Check authorization for admin operations
    if (!isAuthorized(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { action } = body;

    if (action === 'refresh') {
      // Fetch fresh data from Apify
      if (!isSofaScoreConfigured()) {
        return NextResponse.json(
          { error: 'Apify API token not configured' },
          { status: 400 }
        );
      }

      const data = await refreshSofaScoreData();

      return NextResponse.json({
        success: true,
        message: 'Data refreshed from Apify',
        lastUpdated: data.lastUpdated,
      });
    }

    if (action === 'import') {
      const { filePath, data } = body;

      if (data) {
        await saveToCache(Array.isArray(data) ? data : [{ data }]);

        return NextResponse.json({
          success: true,
          message: 'Data imported successfully',
          lastUpdated: Date.now(),
        });
      }

      if (filePath) {
        const importedData = await importSofaScoreFromFile(filePath);

        return NextResponse.json({
          success: true,
          message: 'Data imported from file',
          lastUpdated: importedData.lastUpdated,
        });
      }

      return NextResponse.json(
        { error: 'No data or filePath provided for import' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Invalid action. Use "refresh" or "import"' },
      { status: 400 }
    );
  } catch (error) {
    console.error('SofaScore POST error:', error);
    return NextResponse.json(
      { error: 'Failed to update SofaScore data', details: String(error) },
      { status: 500 }
    );
  }
}
