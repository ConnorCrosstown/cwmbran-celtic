import { describe, it, expect } from 'vitest';
import { collectClubNames, absolutizeCrest, buildFeed } from '@/lib/feed';
import type { Fixture, Result, LeagueTableRow } from '@/types';

const fixtures: Fixture[] = [
  { matchId: 1, date: 100, time: '15:00', homeTeam: 'Cwmbran Celtic', awayTeam: 'Goytre AFC', competition: 'Ardal SE', venue: 'X', homeAway: 'H', team: 'mens' },
];
const results: Result[] = [
  { matchId: 2, date: 90, homeTeam: 'Trethomas Bluebirds', awayTeam: 'Cwmbran Celtic', homeScore: 1, awayScore: 2, competition: 'Ardal SE', scorers: '', attendance: 0, team: 'mens' },
];
const tables: Record<string, LeagueTableRow[]> = {
  mens: [{ position: 1, club: 'Cwmbran Celtic', played: 1, won: 1, drawn: 0, lost: 0, gd: 1, points: 3 }],
};
const data = { fixtures, results, tables };

describe('collectClubNames', () => {
  it('returns unique club names across fixtures, results and tables', () => {
    const names = collectClubNames(data).sort();
    expect(names).toEqual(['Cwmbran Celtic', 'Goytre AFC', 'Trethomas Bluebirds']);
  });
});

describe('absolutizeCrest', () => {
  it('prefixes app-relative image src with the origin', () => {
    const out = absolutizeCrest({ kind: 'image', src: '/images/club-logo.webp', alt: 'a' }, 'https://cwmbran-celtic.vercel.app');
    expect(out).toEqual({ kind: 'image', src: 'https://cwmbran-celtic.vercel.app/images/club-logo.webp', alt: 'a' });
  });
  it('leaves already-absolute src untouched', () => {
    const out = absolutizeCrest({ kind: 'image', src: 'https://cdn.example/x.png', alt: 'a' }, 'https://o');
    expect(out).toEqual({ kind: 'image', src: 'https://cdn.example/x.png', alt: 'a' });
  });
  it('passes monogram crests through unchanged', () => {
    const c = { kind: 'monogram' as const, initials: 'GA', hue: 120, alt: 'Goytre AFC' };
    expect(absolutizeCrest(c, 'https://o')).toEqual(c);
  });
});

describe('buildFeed', () => {
  it('assembles a payload with a crest per club name and absolutized image src', () => {
    const feed = buildFeed(data, 'https://cwmbran-celtic.vercel.app', 12345);
    expect(feed.generatedAt).toBe(12345);
    expect(feed.fixtures).toHaveLength(1);
    expect(feed.results).toHaveLength(1);
    expect(feed.tables.mens[0].club).toBe('Cwmbran Celtic');
    expect(Object.keys(feed.crests).sort()).toEqual(['Cwmbran Celtic', 'Goytre AFC', 'Trethomas Bluebirds']);
    const own = feed.crests['Cwmbran Celtic'];
    expect(own.kind).toBe('image');
    if (own.kind === 'image') expect(own.src.startsWith('https://cwmbran-celtic.vercel.app/')).toBe(true);
  });
});
