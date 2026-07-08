import { describe, it, expect } from 'vitest';
import type { Fixture, Result } from '@/types';

describe('team tag on fixtures/results', () => {
  it('accepts a team tag on Fixture', () => {
    const f: Fixture = {
      matchId: 1, date: 0, time: '', homeTeam: 'A', awayTeam: 'B',
      competition: 'X', venue: '', homeAway: 'H', team: 'mens',
    };
    expect(f.team).toBe('mens');
  });
  it('accepts a team tag on Result', () => {
    const r: Result = {
      matchId: 1, date: 0, homeTeam: 'A', awayTeam: 'B', homeScore: 1,
      awayScore: 0, competition: 'X', scorers: '', attendance: 0, team: 'ladies',
    };
    expect(r.team).toBe('ladies');
  });
});
