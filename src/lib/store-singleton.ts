import { createStore, type Store } from './programme-store';
import { getRedis } from './kv';

let store: Store | null = null;

export function getStore(): Store {
  if (!store) store = createStore(getRedis());
  return store;
}
