import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';
import { parseFixturesAndResults } from '@/lib/allwalessport';
import type { AwsTeam } from '@/data/allwalessport-teams';

const read = (f: string) =>
  readFileSync(path.join(__dirname, 'fixtures', f), 'utf8');

const mens: AwsTeam = { key: 'mens', label: 'Ardal South East', cid: 20149, clubName: 'Cwmbran Celtic' };

describe('parseFixturesAndResults — pre-season mens page (fixtures only)', () => {
  const { fixtures, results } = parseFixturesAndResults(read('aws-preseason-mens-20149.html'), mens);

  it('extracts Cwmbran Celtic fixtures', () => {
    expect(fixtures.length).toBeGreaterThan(0);
    for (const f of fixtures) {
      expect(f.homeTeam === 'Cwmbran Celtic' || f.awayTeam === 'Cwmbran Celtic').toBe(true);
    }
  });
  it('tags fixtures with the team key and label', () => {
    expect(fixtures[0].team).toBe('mens');
    expect(fixtures[0].competition).toBe('Ardal South East');
  });
  it('sets homeAway correctly', () => {
    const home = fixtures.find(f => f.homeTeam === 'Cwmbran Celtic');
    const away = fixtures.find(f => f.awayTeam === 'Cwmbran Celtic');
    if (home) expect(home.homeAway).toBe('H');
    if (away) expect(away.homeAway).toBe('A');
  });
  it('yields no results pre-season', () => {
    expect(results.length).toBe(0);
  });
});

describe('parseFixturesAndResults — in-season page (results present)', () => {
  // Filter to a club known to appear in the archived women's fixture file.
  const splott: AwsTeam = { key: 'ladies', label: 'S Wales Womens', cid: 10641, clubName: 'Splott Albion' };
  const { results } = parseFixturesAndResults(read('aws-inseason-womens-10641.html'), splott);

  it('extracts results with numeric scores for the club', () => {
    expect(results.length).toBeGreaterThan(0);
    for (const r of results) {
      expect(Number.isInteger(r.homeScore)).toBe(true);
      expect(Number.isInteger(r.awayScore)).toBe(true);
      expect(r.homeTeam === 'Splott Albion' || r.awayTeam === 'Splott Albion').toBe(true);
    }
  });
  it('reads the "7 0" row as 7-0', () => {
    const r = results.find(x => x.homeTeam === 'Newport City Dev' && x.awayTeam === 'Splott Albion');
    expect(r).toBeDefined();
    expect(r!.homeScore).toBe(7);
    expect(r!.awayScore).toBe(0);
  });
});
