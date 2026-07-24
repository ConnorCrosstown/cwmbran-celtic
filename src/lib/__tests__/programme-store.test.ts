import { describe, it, expect } from 'vitest';
import { InMemoryKV } from '../kv';
import { createStore } from '../programme-store';
import type { SquadPlayer, Programme } from '@/types/programme';

const player = (over: Partial<SquadPlayer> = {}): SquadPlayer => ({
  id: 'p1', squadNo: 7, firstName: 'Lewis', lastName: 'Watkins', position: 'GK', ...over,
});
const programme = (over: Partial<Programme> = {}): Programme => ({
  id: 'm1', slug: 'cwmbran-town-2026-07-28', status: 'draft', opponent: 'Cwmbran Town',
  date: '2026-07-28', kickoff: '19:00', competition: 'Ardal League South East',
  matchdayNumber: '1', venue: 'home', team: 'mens',
  startingXI: [], substitutes: [], captain: null,
  referee: '', assistantRef1: '', assistantRef2: '', fourthOfficial: '',
  matchSponsor: '', mascotSponsor: '', matchballSponsor: '', programmePrice: '',
  managersNotes: '', teamNews: '', specialNotes: '', playerToWatch: null,
  coverImage: '', actionImage: '', createdAt: '2026-07-24T00:00:00.000Z',
  updatedAt: '2026-07-24T00:00:00.000Z', ...over,
});

describe('programme store', () => {
  it('saves, lists (sorted by squadNo), and deletes players', async () => {
    const store = createStore(new InMemoryKV());
    await store.savePlayer(player({ id: 'a', squadNo: 9 }));
    await store.savePlayer(player({ id: 'b', squadNo: 1 }));
    let players = await store.listPlayers();
    expect(players.map((p) => p.squadNo)).toEqual([1, 9]);
    await store.deletePlayer('a');
    players = await store.listPlayers();
    expect(players.map((p) => p.id)).toEqual(['b']);
  });

  it('round-trips a programme by id', async () => {
    const store = createStore(new InMemoryKV());
    await store.saveProgramme(programme());
    expect(await store.getProgramme('m1')).toMatchObject({ opponent: 'Cwmbran Town' });
    expect((await store.listProgrammes()).length).toBe(1);
    await store.deleteProgramme('m1');
    expect(await store.getProgramme('m1')).toBeNull();
  });
});
