import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';

const mensHtml = readFileSync(
  path.join(__dirname, 'fixtures', 'aws-preseason-mens-20149.html'), 'utf8'
);

// Force only the mens team active for a deterministic test.
vi.mock('@/data/allwalessport-teams', async (orig) => {
  const actual = await orig<typeof import('@/data/allwalessport-teams')>();
  const mens = { key: 'mens', label: 'Ardal South East', league: 'Ardal League South East', cid: 20149, clubName: 'Cwmbran Celtic' };
  return { ...actual, AWS_TEAMS: [mens], activeTeams: () => [mens] };
});

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn(async () => new Response(mensHtml, { status: 200 })));
});

describe('comet façade backed by allwalessport', () => {
  it('getFixtures returns live Cwmbran fixtures, not mock', async () => {
    const { getFixtures } = await import('@/lib/comet');
    const data = await getFixtures();
    expect(data.results.length).toBeGreaterThan(0);
    expect(data.results.every(f =>
      f.homeTeam === 'Cwmbran Celtic' || f.awayTeam === 'Cwmbran Celtic')).toBe(true);
  });

  it('getFixturesByTeam("mens") filters on the team tag', async () => {
    const { getFixturesByTeam } = await import('@/lib/comet');
    const mens = await getFixturesByTeam('mens');
    expect(mens.length).toBeGreaterThan(0);
    expect(mens.every(f => f.team === 'mens')).toBe(true);
  });
});
