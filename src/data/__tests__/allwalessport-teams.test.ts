import { describe, it, expect } from 'vitest';
import { AWS_TEAMS, activeTeams } from '@/data/allwalessport-teams';

describe('allwalessport team registry', () => {
  it('registers the mens first team with the verified cid', () => {
    const mens = AWS_TEAMS.find(t => t.key === 'mens');
    expect(mens).toBeDefined();
    expect(mens!.cid).toBe(20149);
    expect(mens!.clubName).toBe('Cwmbran Celtic');
  });

  it('has unique team keys', () => {
    const keys = AWS_TEAMS.map(t => t.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('activeTeams() excludes teams whose cid is unset (0)', () => {
    const withUnset = AWS_TEAMS.some(t => t.cid === 0);
    const active = activeTeams();
    expect(active.every(t => t.cid > 0)).toBe(true);
    if (withUnset) expect(active.length).toBeLessThan(AWS_TEAMS.length);
  });
});
