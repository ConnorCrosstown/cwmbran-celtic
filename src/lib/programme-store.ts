import type { KVClient } from './kv';
import type { SquadPlayer, Programme } from '@/types/programme';

const KEY = {
  player: (id: string) => `player:${id}`,
  playerIndex: 'players',
  programme: (id: string) => `programme:${id}`,
  programmeIndex: 'programmes',
};

export function createStore(kv: KVClient) {
  async function collect<T>(index: string, key: (id: string) => string): Promise<T[]> {
    const ids = await kv.smembers(index);
    const rows: (T | null)[] = await Promise.all(ids.map((id) => kv.get<T>(key(id))));
    return rows.filter((r): r is T => r !== null);
  }

  return {
    async listPlayers(): Promise<SquadPlayer[]> {
      const players = await collect<SquadPlayer>(KEY.playerIndex, KEY.player);
      return players.sort((a, b) => a.squadNo - b.squadNo);
    },
    async savePlayer(p: SquadPlayer): Promise<void> {
      await kv.set(KEY.player(p.id), p);
      await kv.sadd(KEY.playerIndex, p.id);
    },
    async deletePlayer(id: string): Promise<void> {
      await kv.del(KEY.player(id));
      await kv.srem(KEY.playerIndex, id);
    },
    async listProgrammes(): Promise<Programme[]> {
      const rows = await collect<Programme>(KEY.programmeIndex, KEY.programme);
      return rows.sort((a, b) => (a.date < b.date ? 1 : -1));
    },
    async getProgramme(id: string): Promise<Programme | null> {
      return kv.get<Programme>(KEY.programme(id));
    },
    async saveProgramme(p: Programme): Promise<void> {
      await kv.set(KEY.programme(p.id), p);
      await kv.sadd(KEY.programmeIndex, p.id);
    },
    async deleteProgramme(id: string): Promise<void> {
      await kv.del(KEY.programme(id));
      await kv.srem(KEY.programmeIndex, id);
    },
  };
}

export type Store = ReturnType<typeof createStore>;
