import { Redis } from '@upstash/redis';

export interface KVClient {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: unknown): Promise<void>;
  del(key: string): Promise<void>;
  smembers(key: string): Promise<string[]>;
  sadd(key: string, member: string): Promise<void>;
  srem(key: string, member: string): Promise<void>;
}

export class InMemoryKV implements KVClient {
  private store = new Map<string, unknown>();
  private sets = new Map<string, Set<string>>();
  async get<T>(key: string): Promise<T | null> {
    return this.store.has(key) ? (this.store.get(key) as T) : null;
  }
  async set(key: string, value: unknown): Promise<void> {
    this.store.set(key, JSON.parse(JSON.stringify(value)));
  }
  async del(key: string): Promise<void> {
    this.store.delete(key);
  }
  async smembers(key: string): Promise<string[]> {
    return [...(this.sets.get(key) ?? [])];
  }
  async sadd(key: string, member: string): Promise<void> {
    if (!this.sets.has(key)) this.sets.set(key, new Set());
    this.sets.get(key)!.add(member);
  }
  async srem(key: string, member: string): Promise<void> {
    this.sets.get(key)?.delete(member);
  }
}

let singleton: KVClient | null = null;

export function getRedis(): KVClient {
  if (singleton) return singleton;
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) {
    throw new Error('KV_REST_API_URL / KV_REST_API_TOKEN are not set');
  }
  const redis = new Redis({ url, token });
  singleton = {
    get: (k) => redis.get(k) as Promise<never>,
    set: (k, v) => redis.set(k, v as string).then(() => undefined),
    del: (k) => redis.del(k).then(() => undefined),
    smembers: (k) => redis.smembers(k),
    sadd: (k, m) => redis.sadd(k, m).then(() => undefined),
    srem: (k, m) => redis.srem(k, m).then(() => undefined),
  };
  return singleton;
}
