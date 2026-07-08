import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';
import { parseFixturesAndResults } from '@/lib/allwalessport';
import { AWS_TEAMS } from '@/data/allwalessport-teams';
import { MENS_LEAGUE_NAME } from '@/lib/site';

describe('fixtures carry the league name as competition', () => {
  it('MENS_LEAGUE_NAME is Ardal League South East', () => {
    expect(MENS_LEAGUE_NAME).toBe('Ardal League South East');
  });
  it('the mens registry entry uses that league', () => {
    const mens = AWS_TEAMS.find(t => t.key === 'mens')!;
    expect(mens.league).toBe('Ardal League South East');
  });
  it('parsed fixtures set competition to the league, not the team label', () => {
    const html = readFileSync(
      path.join(__dirname, 'fixtures', 'aws-preseason-mens-20149.html'), 'utf8');
    const mens = AWS_TEAMS.find(t => t.key === 'mens')!;
    const { fixtures } = parseFixturesAndResults(html, mens);
    expect(fixtures.length).toBeGreaterThan(0);
    expect(fixtures.every(f => f.competition === 'Ardal League South East')).toBe(true);
  });
});
