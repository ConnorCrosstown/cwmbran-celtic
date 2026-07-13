import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/allwalessport', () => ({
  fetchAllTeams: vi.fn(async () => ({
    fixtures: [{ matchId: 1, date: 100, time: '15:00', homeTeam: 'Cwmbran Celtic', awayTeam: 'Goytre AFC', competition: 'Ardal SE', venue: 'X', homeAway: 'H', team: 'mens' }],
    results: [],
    tables: { mens: [] },
  })),
}));

import { GET } from '@/app/api/feed/route';

describe('GET /api/feed', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns feed JSON with fixtures and cache headers', async () => {
    const res = await GET();
    expect(res.status).toBe(200);
    expect(res.headers.get('cache-control')).toContain('s-maxage=3600');
    expect(res.headers.get('access-control-allow-origin')).toBe('*');
    const body = await res.json();
    expect(body.fixtures).toHaveLength(1);
    expect(body.crests['Goytre AFC']).toBeTruthy();
    expect(typeof body.generatedAt).toBe('number');
  });
});
