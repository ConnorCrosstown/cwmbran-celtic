import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InMemoryKV } from '@/lib/kv';
import { createStore } from '@/lib/programme-store';

const store = createStore(new InMemoryKV());
vi.mock('@/lib/store-singleton', () => ({ getStore: () => store }));
vi.mock('@/lib/admin-auth', () => ({ requireAdmin: () => true }));

import { POST } from '../programme/route';
import { PUT, GET } from '../programme/[id]/route';

beforeEach(async () => {
  for (const p of await store.listProgrammes()) await store.deleteProgramme(p.id);
});

function put(id: string, body: unknown) {
  const req = new Request(`http://x/api/programme/${id}`, {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  return PUT(req, { params: Promise.resolve({ id }) });
}

describe('/api/programme/[id] PUT', () => {
  it('coerces a malformed status and non-array startingXI instead of trusting the body', async () => {
    const create = new Request('http://x/api/programme', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id: 'g1', opponent: 'Rhyl', status: 'published', startingXI: [1, 2, 3] }),
    });
    const created = await (await POST(create)).json();
    expect(created.status).toBe('published');
    expect(created.startingXI).toEqual([1, 2, 3]);

    const res = await put('g1', { status: 'garbage', startingXI: 'not-an-array' });
    expect(res.status).toBe(200);
    const updated = await res.json();
    expect(updated.status).toBe('draft');
    expect(updated.startingXI).toEqual([]);

    const stored = await (await GET(new Request('http://x/api/programme/g1'), { params: Promise.resolve({ id: 'g1' }) })).json();
    expect(stored.status).toBe('draft');
    expect(stored.startingXI).toEqual([]);
  });

  it('rejects a non-number captain, coercing it to null', async () => {
    const create = new Request('http://x/api/programme', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id: 'g2', opponent: 'Barry Town', captain: 5 }),
    });
    await POST(create);

    const res = await put('g2', { captain: 'nine' });
    const updated = await res.json();
    expect(updated.captain).toBeNull();
  });

  it('keeps the existing value for an omitted mutable field', async () => {
    const create = new Request('http://x/api/programme', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id: 'g3', opponent: 'Afan Lido', status: 'published', captain: 7, substitutes: [11, 12] }),
    });
    const created = await (await POST(create)).json();
    expect(created.status).toBe('published');
    expect(created.captain).toBe(7);

    // PUT omits status, captain, and substitutes entirely -> they must be retained, not reset to defaults.
    const res = await put('g3', { opponent: 'Afan Lido FC' });
    expect(res.status).toBe(200);
    const updated = await res.json();
    expect(updated.status).toBe('published');
    expect(updated.captain).toBe(7);
    expect(updated.substitutes).toEqual([11, 12]);
    expect(updated.opponent).toBe('Afan Lido FC');
  });

  it('POST persists all builder fields and coerces enums/numbers', async () => {
    const res = await POST(new Request('http://x/api/programme', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        id: 'm-full', opponent: 'Cwmbran Town', date: '2026-07-28',
        venue: 'away', team: 'womens', fourthOfficial: 'A. Ref',
        matchSponsor: 'Avondale', mascotSponsor: 'M', matchballSponsor: 'B',
        programmePrice: '£2', specialNotes: 'note', playerToWatch: 7,
        coverImage: 'data:cover', actionImage: 'data:action',
      }),
    }));
    const saved = await res.json();
    expect(saved).toMatchObject({
      venue: 'away', team: 'womens', fourthOfficial: 'A. Ref',
      matchSponsor: 'Avondale', mascotSponsor: 'M', matchballSponsor: 'B',
      programmePrice: '£2', specialNotes: 'note', playerToWatch: 7,
      coverImage: 'data:cover', actionImage: 'data:action',
    });
    expect(typeof saved.createdAt).toBe('string');
  });

  it('POST coerces invalid venue/team/playerToWatch to safe defaults', async () => {
    const res = await POST(new Request('http://x/api/programme', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id: 'm-bad', venue: 'sideways', team: 'aliens', playerToWatch: 'x' }),
    }));
    const saved = await res.json();
    expect(saved.venue).toBe('home');
    expect(saved.team).toBe('mens');
    expect(saved.playerToWatch).toBeNull();
  });

  it('PUT preserves omitted builder fields and coerces provided ones', async () => {
    await POST(new Request('http://x/api/programme', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id: 'm-put', matchSponsor: 'Original', venue: 'home' }),
    }));
    const res = await PUT(
      new Request('http://x/api/programme/m-put', {
        method: 'PUT', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ venue: 'away' }), // matchSponsor omitted
      }),
      { params: Promise.resolve({ id: 'm-put' }) },
    );
    const updated = await res.json();
    expect(updated.venue).toBe('away');        // coerced/updated
    expect(updated.matchSponsor).toBe('Original'); // omitted -> retained
  });

  it('forces id to the route id and refreshes updatedAt', async () => {
    const create = new Request('http://x/api/programme', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id: 'g4', opponent: 'Cambrian & Clydach' }),
    });
    const created = await (await POST(create)).json();
    const originalUpdatedAt = created.updatedAt;

    await new Promise((r) => setTimeout(r, 2));
    const res = await put('g4', { id: 'someone-elses-id', opponent: 'Cambrian & Clydach Vale' });
    const updated = await res.json();
    expect(updated.id).toBe('g4');
    expect(updated.updatedAt).not.toBe(originalUpdatedAt);
  });
});
