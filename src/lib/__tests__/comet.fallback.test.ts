import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';

const mensHtml = readFileSync(
  path.join(__dirname, 'fixtures', 'aws-preseason-mens-20149.html'), 'utf8',
);

describe('comet per-team mock fallback (real registry: mens live, ladies cid:0)', () => {
  it('keeps ladies mock fixtures while mens is live', async () => {
    vi.resetModules();
    vi.stubGlobal('fetch', vi.fn(async () => new Response(mensHtml, { status: 200 })));
    const { getFixturesByTeam } = await import('@/lib/comet');

    const ladies = await getFixturesByTeam('ladies');
    expect(ladies.length).toBeGreaterThan(0);            // mock ladies preserved
    expect(ladies.every(f => f.team === 'ladies')).toBe(true);

    const mens = await getFixturesByTeam('mens');
    expect(mens.length).toBeGreaterThan(0);              // live mens
    expect(mens.every(f => f.team === 'mens')).toBe(true);
    expect(mens.every(f => f.homeTeam === 'Cwmbran Celtic' || f.awayTeam === 'Cwmbran Celtic')).toBe(true);
  });

  it('falls back to mens mock when the live feed is down (500)', async () => {
    vi.resetModules();
    vi.stubGlobal('fetch', vi.fn(async () => new Response('err', { status: 500 })));
    const { getFixturesByTeam } = await import('@/lib/comet');

    const mens = await getFixturesByTeam('mens');
    expect(mens.length).toBeGreaterThan(0);              // mock mens rows
    expect(mens.every(f => f.team === 'mens')).toBe(true);
  });
});
