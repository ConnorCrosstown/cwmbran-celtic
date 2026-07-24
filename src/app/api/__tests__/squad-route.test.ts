import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InMemoryKV } from '@/lib/kv';
import { createStore } from '@/lib/programme-store';

const store = createStore(new InMemoryKV());
vi.mock('@/lib/store-singleton', () => ({ getStore: () => store }));
vi.mock('@/lib/admin-auth', () => ({ requireAdmin: () => true }));

import { GET, POST } from '../squad/route';
import { PUT } from '../squad/[id]/route';

beforeEach(async () => {
  for (const p of await store.listPlayers()) await store.deletePlayer(p.id);
});

describe('/api/squad', () => {
  it('POST creates a player, GET lists it', async () => {
    const create = new Request('http://x/api/squad', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ squadNo: 7, firstName: 'Lewis', lastName: 'Watkins', position: 'GK' }),
    });
    const created = await (await POST(create)).json();
    expect(created.id).toBeTruthy();
    expect(created.squadNo).toBe(7);

    const list = await (await GET()).json();
    expect(list).toHaveLength(1);
    expect(list[0].lastName).toBe('Watkins');
  });

  it('POST rejects a missing squad number with 400', async () => {
    const bad = new Request('http://x/api/squad', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ firstName: 'No', lastName: 'Number', position: 'GK' }),
    });
    expect((await POST(bad)).status).toBe(400);
  });

  it('PUT rejects a missing squad number with 400 and does not write', async () => {
    const req = new Request('http://x/api/squad/p1', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ firstName: 'No', lastName: 'Number', position: 'GK' }),
    });
    const res = await PUT(req, { params: Promise.resolve({ id: 'p1' }) });
    expect(res.status).toBe(400);
    expect(await store.listPlayers()).toHaveLength(0);
  });

  it('PUT rejects a non-numeric squad number with 400 and does not write', async () => {
    const req = new Request('http://x/api/squad/p1', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ squadNo: 'seven', firstName: 'No', lastName: 'Number', position: 'GK' }),
    });
    const res = await PUT(req, { params: Promise.resolve({ id: 'p1' }) });
    expect(res.status).toBe(400);
    expect(await store.listPlayers()).toHaveLength(0);
  });

  it('PUT with a valid squad number updates and persists the player', async () => {
    const req = new Request('http://x/api/squad/p1', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ squadNo: 9, firstName: 'Sam', lastName: 'Jones', position: 'ST' }),
    });
    const res = await PUT(req, { params: Promise.resolve({ id: 'p1' }) });
    expect(res.status).toBe(200);
    const updated = await res.json();
    expect(updated).toMatchObject({ id: 'p1', squadNo: 9, firstName: 'Sam', lastName: 'Jones', position: 'ST' });

    const list = await store.listPlayers();
    expect(list).toHaveLength(1);
    expect(list[0]).toMatchObject({ id: 'p1', squadNo: 9 });
  });
});
