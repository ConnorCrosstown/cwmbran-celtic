import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';
import { divisionUrl, fetchTeamData, fetchAllTeams } from '@/lib/allwalessport';
import type { AwsTeam } from '@/data/allwalessport-teams';

const html = readFileSync(
  path.join(__dirname, 'fixtures', 'aws-preseason-mens-20149.html'), 'utf8'
);
const mens: AwsTeam = { key: 'mens', label: 'Ardal South East', cid: 20149, clubName: 'Cwmbran Celtic' };

describe('divisionUrl', () => {
  it('builds the football.aspx url', () => {
    expect(divisionUrl(20149)).toBe('https://www.allwalessport.co.uk/football.aspx?cid=20149');
  });
});

describe('fetchTeamData', () => {
  it('fetches the division page once and returns parsed data', async () => {
    const fake = vi.fn(async () => new Response(html, { status: 200 }));
    const data = await fetchTeamData(mens, fake as unknown as typeof fetch);
    expect(fake).toHaveBeenCalledTimes(1);
    expect(fake).toHaveBeenCalledWith(divisionUrl(20149), expect.anything());
    expect(data.fixtures.length).toBeGreaterThan(0);
    expect(Array.isArray(data.table)).toBe(true);
  });

  it('returns empty arrays (no throw) on a non-ok response', async () => {
    const fake = vi.fn(async () => new Response('nope', { status: 500 }));
    const data = await fetchTeamData(mens, fake as unknown as typeof fetch);
    expect(data.fixtures).toEqual([]);
    expect(data.results).toEqual([]);
    expect(data.table).toEqual([]);
  });
});

describe('fetchAllTeams', () => {
  it('fetches only active registry teams and keys tables by team', async () => {
    const fake = vi.fn(async () => new Response(html, { status: 200 }));
    const data = await fetchAllTeams(fake as unknown as typeof fetch);
    // Only the mens team (cid 20149) is active; ladies (cid 0) is skipped.
    expect(fake).toHaveBeenCalledTimes(1);
    expect(data.tables).toHaveProperty('mens');
    expect(data.tables).not.toHaveProperty('ladies');
    expect(data.fixtures.length).toBeGreaterThan(0);
    expect(data.fixtures.every(f => f.team === 'mens')).toBe(true);
  });
});
