/**
 * Fixtures API Client
 * Handles communication with Google Sheets via Apps Script
 */

export interface Fixture {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  homeTeam: string;
  awayTeam: string;
  competition: string;
  venue: string;
  team: 'mens' | 'womens' | 'reserves';
  homeScore: number | null;
  awayScore: number | null;
  attendance: number | null;
  scorers: string;
  status: 'scheduled' | 'completed' | 'postponed' | 'cancelled';
}

// Apps Script Web App URL - Replace with your deployed URL
const APPS_SCRIPT_URL = process.env.NEXT_PUBLIC_FIXTURES_API_URL || '';

/**
 * Fetch all fixtures from Google Sheets
 */
export async function fetchFixtures(): Promise<Fixture[]> {
  if (!APPS_SCRIPT_URL) {
    console.warn('Fixtures API URL not configured, using localStorage');
    return getLocalFixtures();
  }

  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (data.success) {
      // Also save to localStorage as backup
      saveLocalFixtures(data.fixtures);
      return data.fixtures;
    } else {
      console.error('API error:', data.error);
      return getLocalFixtures();
    }
  } catch (error) {
    console.error('Failed to fetch fixtures:', error);
    return getLocalFixtures();
  }
}

/**
 * Save a fixture (create or update)
 */
export async function saveFixture(fixture: Fixture): Promise<boolean> {
  // Always save to localStorage first
  const localFixtures = getLocalFixtures();
  const existingIndex = localFixtures.findIndex(f => f.id === fixture.id);

  if (existingIndex >= 0) {
    localFixtures[existingIndex] = fixture;
  } else {
    localFixtures.push(fixture);
  }
  saveLocalFixtures(localFixtures);

  if (!APPS_SCRIPT_URL) {
    return true;
  }

  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors', // Required for Apps Script
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'upsert',
        fixture: fixture,
      }),
    });

    // With no-cors, we can't read the response, but the request should succeed
    return true;
  } catch (error) {
    console.error('Failed to save fixture to API:', error);
    // Data is already saved locally, so return true
    return true;
  }
}

/**
 * Delete a fixture
 */
export async function deleteFixture(id: string): Promise<boolean> {
  // Always delete from localStorage first
  const localFixtures = getLocalFixtures();
  const filtered = localFixtures.filter(f => f.id !== id);
  saveLocalFixtures(filtered);

  if (!APPS_SCRIPT_URL) {
    return true;
  }

  try {
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'delete',
        id: id,
      }),
    });

    return true;
  } catch (error) {
    console.error('Failed to delete fixture from API:', error);
    return true; // Already deleted locally
  }
}

/**
 * Bulk save all fixtures (replaces all data)
 */
export async function bulkSaveFixtures(fixtures: Fixture[]): Promise<boolean> {
  // Save to localStorage
  saveLocalFixtures(fixtures);

  if (!APPS_SCRIPT_URL) {
    return true;
  }

  try {
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'bulk',
        fixtures: fixtures,
      }),
    });

    return true;
  } catch (error) {
    console.error('Failed to bulk save fixtures:', error);
    return true; // Already saved locally
  }
}

/**
 * Local storage helpers
 */
function getLocalFixtures(): Fixture[] {
  if (typeof window === 'undefined') return [];

  try {
    const data = localStorage.getItem('fixtures-data');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveLocalFixtures(fixtures: Fixture[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem('fixtures-data', JSON.stringify(fixtures));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

/**
 * Check if API is configured
 */
export function isApiConfigured(): boolean {
  return !!APPS_SCRIPT_URL;
}
