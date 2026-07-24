# Programme Builder — Phase 1 (Foundation) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the match-day programme builder shared, server-side storage and a real login gate, plus a self-serve squad admin page — replacing the current browser-only (`localStorage`) setup so the whole team works off the same data.

**Architecture:** A small `KVClient` interface wraps Upstash Redis (provisioned via Vercel KV) with an in-memory implementation for tests. A `createStore(kv)` factory exposes typed CRUD for squad players and programmes. A stateless signed-cookie auth layer (HMAC over an expiry, one shared password) guards the admin API routes. The existing builder page and a new squad page talk to these routes via `fetch` instead of `localStorage`.

**Tech Stack:** Next.js App Router (TypeScript), Vitest (node env), `@upstash/redis`, `@vercel/blob`, Node `crypto`.

## Global Constraints

- Tests live at `src/**/*.test.ts`; runner is Vitest with `environment: 'node'` (see `vitest.config.ts`). No `.tsx`/jsdom tests — React pages are verified via `npm run build` + dev server, not unit tests.
- Import alias `@` → `src/`.
- Any API route touching Redis, Blob, or `crypto` MUST declare `export const runtime = 'nodejs';`.
- Env vars (provisioned in Vercel, mirrored in `.env.local` for dev): `KV_REST_API_URL`, `KV_REST_API_TOKEN` (Vercel KV/Upstash), `BLOB_READ_WRITE_TOKEN` (Vercel Blob), `ADMIN_PASSWORD` (shared staff password), `ADMIN_SESSION_SECRET` (random 32+ char string for HMAC).
- League display name comes from `MENS_LEAGUE_NAME` in `src/lib/site.ts` — never hardcode "Ardal League South East".
- Cookie name is `cc_admin`; session TTL is 12 hours.
- Money/scores/dates are not touched in this phase.

---

## Provisioning prerequisite (do first, one-time, ~15 min)

Not a code task, but Task 1's tests use the in-memory client so you can build without it; the API routes need it live before deploy.

1. In the Vercel dashboard → project `cwmbran-celtic` → **Storage** → create a **KV (Upstash Redis)** store, connect it to the project. Vercel injects `KV_REST_API_URL` + `KV_REST_API_TOKEN`.
2. Storage → create a **Blob** store, connect it. Vercel injects `BLOB_READ_WRITE_TOKEN`.
3. Project → Settings → Environment Variables → add `ADMIN_PASSWORD` (pick a shared password) and `ADMIN_SESSION_SECRET` (run `openssl rand -base64 32`).
4. Locally: `vercel env pull .env.local` to mirror all of the above for `npm run dev`.

---

## Task 1: KV store layer (types + client + CRUD)

**Files:**
- Create: `src/types/programme.ts`
- Create: `src/lib/kv.ts`
- Create: `src/lib/programme-store.ts`
- Test: `src/lib/__tests__/programme-store.test.ts`

**Interfaces:**
- Consumes: nothing (foundation).
- Produces:
  - `interface SquadPlayer { id: string; squadNo: number; firstName: string; lastName: string; position: string; photoUrl?: string; penPicture?: string; }`
  - `interface Programme { id: string; slug: string; status: 'draft' | 'published'; opponent: string; date: string; kickoff: string; competition: string; matchdayNumber: string; startingXI: number[]; substitutes: number[]; captain: number | null; referee: string; assistantRef1: string; assistantRef2: string; managersNotes: string; teamNews: string; updatedAt: string; }`
  - `interface KVClient { get<T>(key: string): Promise<T | null>; set(key: string, value: unknown): Promise<void>; del(key: string): Promise<void>; smembers(key: string): Promise<string[]>; sadd(key: string, member: string): Promise<void>; srem(key: string, member: string): Promise<void>; }`
  - `class InMemoryKV implements KVClient` (exported from `kv.ts`, for tests)
  - `function getRedis(): KVClient` (real singleton, from `kv.ts`)
  - `function createStore(kv: KVClient)` returning `{ listPlayers, savePlayer, deletePlayer, listProgrammes, getProgramme, saveProgramme, deleteProgramme }`
  - `type Store = ReturnType<typeof createStore>`

- [ ] **Step 1: Add the dependency**

Run: `npm install @upstash/redis`
Expected: added to `package.json` dependencies.

- [ ] **Step 2: Write the types file**

Create `src/types/programme.ts`:

```ts
export interface SquadPlayer {
  id: string;
  squadNo: number;
  firstName: string;
  lastName: string;
  position: string;
  photoUrl?: string;
  penPicture?: string;
}

export interface Programme {
  id: string;
  slug: string;
  status: 'draft' | 'published';
  opponent: string;
  date: string;
  kickoff: string;
  competition: string;
  matchdayNumber: string;
  startingXI: number[];
  substitutes: number[];
  captain: number | null;
  referee: string;
  assistantRef1: string;
  assistantRef2: string;
  managersNotes: string;
  teamNews: string;
  updatedAt: string;
}
```

- [ ] **Step 3: Write the KV client (`src/lib/kv.ts`)**

```ts
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
```

- [ ] **Step 4: Write the failing store test (`src/lib/__tests__/programme-store.test.ts`)**

```ts
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
  matchdayNumber: '1', startingXI: [], substitutes: [], captain: null,
  referee: '', assistantRef1: '', assistantRef2: '', managersNotes: '', teamNews: '',
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
```

- [ ] **Step 5: Run test to verify it fails**

Run: `npx vitest run src/lib/__tests__/programme-store.test.ts`
Expected: FAIL — cannot find module `../programme-store`.

- [ ] **Step 6: Write `src/lib/programme-store.ts`**

```ts
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
    const rows = await Promise.all(ids.map((id) => kv.get<T>(key(id))));
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
```

- [ ] **Step 7: Run test to verify it passes**

Run: `npx vitest run src/lib/__tests__/programme-store.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 8: Commit**

```bash
git add src/types/programme.ts src/lib/kv.ts src/lib/programme-store.ts src/lib/__tests__/programme-store.test.ts package.json package-lock.json
git commit -m "feat(programme): KV store layer for squad + programmes"
```

---

## Task 2: Admin auth (shared password + signed cookie)

**Files:**
- Create: `src/lib/admin-auth.ts`
- Test: `src/lib/__tests__/admin-auth.test.ts`

**Interfaces:**
- Consumes: env `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`.
- Produces:
  - `const ADMIN_COOKIE = 'cc_admin'`
  - `function checkPassword(input: string): boolean`
  - `function createSessionToken(now?: number): string`
  - `function verifySessionToken(token: string | undefined, now?: number): boolean`
  - `function getTokenFromCookieHeader(header: string | null): string | undefined`
  - `function requireAdmin(req: Request): boolean`

- [ ] **Step 1: Write the failing test (`src/lib/__tests__/admin-auth.test.ts`)**

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import {
  checkPassword, createSessionToken, verifySessionToken,
  getTokenFromCookieHeader, requireAdmin, ADMIN_COOKIE,
} from '../admin-auth';

beforeEach(() => {
  process.env.ADMIN_PASSWORD = 'celtic-secret';
  process.env.ADMIN_SESSION_SECRET = 'test-secret-please-change';
});

describe('admin auth', () => {
  it('accepts the right password and rejects wrong/empty', () => {
    expect(checkPassword('celtic-secret')).toBe(true);
    expect(checkPassword('nope')).toBe(false);
    expect(checkPassword('')).toBe(false);
  });

  it('issues a token that verifies before expiry and fails after', () => {
    const t = createSessionToken(1000);
    expect(verifySessionToken(t, 2000)).toBe(true);
    expect(verifySessionToken(t, 1000 + 1000 * 60 * 60 * 13)).toBe(false);
  });

  it('rejects tampered or missing tokens', () => {
    const t = createSessionToken();
    expect(verifySessionToken(t + 'x')).toBe(false);
    expect(verifySessionToken(undefined)).toBe(false);
    expect(verifySessionToken('a.b')).toBe(false);
  });

  it('extracts token from a cookie header and gates a Request', () => {
    const t = createSessionToken();
    const header = `foo=bar; ${ADMIN_COOKIE}=${t}; baz=qux`;
    expect(getTokenFromCookieHeader(header)).toBe(t);
    expect(getTokenFromCookieHeader(null)).toBeUndefined();
    const good = new Request('http://x', { headers: { cookie: header } });
    const bad = new Request('http://x');
    expect(requireAdmin(good)).toBe(true);
    expect(requireAdmin(bad)).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/__tests__/admin-auth.test.ts`
Expected: FAIL — cannot find module `../admin-auth`.

- [ ] **Step 3: Write `src/lib/admin-auth.ts`**

```ts
import crypto from 'crypto';

export const ADMIN_COOKIE = 'cc_admin';
const TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

function secret(): string {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s) throw new Error('ADMIN_SESSION_SECRET is not set');
  return s;
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
}

export function checkPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD ?? '';
  return expected.length > 0 && safeEqual(input, expected);
}

export function createSessionToken(now: number = Date.now()): string {
  const payload = Buffer.from(JSON.stringify({ exp: now + TTL_MS })).toString('base64url');
  const sig = crypto.createHmac('sha256', secret()).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

export function verifySessionToken(token: string | undefined, now: number = Date.now()): boolean {
  if (!token) return false;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return false;
  const expected = crypto.createHmac('sha256', secret()).update(payload).digest('base64url');
  if (!safeEqual(sig, expected)) return false;
  try {
    const { exp } = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return typeof exp === 'number' && exp > now;
  } catch {
    return false;
  }
}

export function getTokenFromCookieHeader(header: string | null): string | undefined {
  if (!header) return undefined;
  const hit = header.split(';').map((c) => c.trim()).find((c) => c.startsWith(`${ADMIN_COOKIE}=`));
  return hit?.slice(ADMIN_COOKIE.length + 1);
}

export function requireAdmin(req: Request): boolean {
  return verifySessionToken(getTokenFromCookieHeader(req.headers.get('cookie')));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/__tests__/admin-auth.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/admin-auth.ts src/lib/__tests__/admin-auth.test.ts
git commit -m "feat(programme): shared-password signed-cookie admin auth"
```

---

## Task 3: Login / logout API routes + login page

**Files:**
- Create: `src/app/api/admin/login/route.ts`
- Create: `src/app/api/admin/logout/route.ts`
- Create: `src/app/admin/login/page.tsx`
- Test: `src/app/api/admin/__tests__/login.test.ts`

**Interfaces:**
- Consumes: `checkPassword`, `createSessionToken`, `ADMIN_COOKIE` (Task 2).
- Produces: `POST /api/admin/login` (JSON `{ password }` → sets `cc_admin` cookie or 401), `POST /api/admin/logout` (clears cookie). Client login page posts to these.

- [ ] **Step 1: Write the failing test (`src/app/api/admin/__tests__/login.test.ts`)**

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { POST } from '../login/route';

beforeEach(() => {
  process.env.ADMIN_PASSWORD = 'celtic-secret';
  process.env.ADMIN_SESSION_SECRET = 'test-secret-please-change';
});

function post(body: unknown): Request {
  return new Request('http://x/api/admin/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/admin/login', () => {
  it('sets an httpOnly cookie for the right password', async () => {
    const res = await POST(post({ password: 'celtic-secret' }));
    expect(res.status).toBe(200);
    const cookie = res.headers.get('set-cookie') ?? '';
    expect(cookie).toContain('cc_admin=');
    expect(cookie.toLowerCase()).toContain('httponly');
  });

  it('rejects a wrong password with 401 and no cookie', async () => {
    const res = await POST(post({ password: 'wrong' }));
    expect(res.status).toBe(401);
    expect(res.headers.get('set-cookie')).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/app/api/admin/__tests__/login.test.ts`
Expected: FAIL — cannot find module `../login/route`.

- [ ] **Step 3: Write `src/app/api/admin/login/route.ts`**

```ts
import { NextResponse } from 'next/server';
import { checkPassword, createSessionToken, ADMIN_COOKIE } from '@/lib/admin-auth';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const password = typeof body?.password === 'string' ? body.password : '';
  if (!checkPassword(password)) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 12,
  });
  return res;
}
```

- [ ] **Step 4: Write `src/app/api/admin/logout/route.ts`**

```ts
import { NextResponse } from 'next/server';
import { ADMIN_COOKIE } from '@/lib/admin-auth';

export const runtime = 'nodejs';

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 });
  return res;
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/app/api/admin/__tests__/login.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 6: Write the login page (`src/app/admin/login/page.tsx`)**

```tsx
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    setBusy(false);
    if (res.ok) {
      router.push(params.get('next') || '/admin');
    } else {
      setError('Incorrect password');
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="mb-6 text-2xl font-bold">Cwmbran Celtic Admin</h1>
      <form onSubmit={submit} className="space-y-4">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Staff password"
          className="w-full rounded border px-3 py-2"
          autoFocus
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={busy || !password}
          className="w-full rounded bg-green-700 px-4 py-2 font-semibold text-white disabled:opacity-50"
        >
          {busy ? 'Checking…' : 'Log in'}
        </button>
      </form>
    </div>
  );
}
```

- [ ] **Step 7: Verify the build compiles**

Run: `npm run build`
Expected: build succeeds; `/admin/login` and both API routes appear in the route list.

- [ ] **Step 8: Commit**

```bash
git add src/app/api/admin src/app/admin/login
git commit -m "feat(programme): admin login/logout routes + login page"
```

---

## Task 4: Blob upload helper + upload route

**Files:**
- Create: `src/lib/blob.ts`
- Create: `src/app/api/upload/route.ts`
- Test: `src/lib/__tests__/blob.test.ts`

**Interfaces:**
- Consumes: `requireAdmin` (Task 2), env `BLOB_READ_WRITE_TOKEN`.
- Produces:
  - `function uploadImage(filename: string, data: Buffer | Blob, putFn?: PutFn): Promise<string>` returning the public URL (`putFn` injectable for tests; defaults to `@vercel/blob` `put`).
  - `POST /api/upload` (multipart `file` field, admin-guarded) → `{ url }`.

- [ ] **Step 1: Add the dependency**

Run: `npm install @vercel/blob`
Expected: added to `package.json`.

- [ ] **Step 2: Write the failing test (`src/lib/__tests__/blob.test.ts`)**

```ts
import { describe, it, expect } from 'vitest';
import { uploadImage } from '../blob';

describe('uploadImage', () => {
  it('delegates to the put fn and returns the public url', async () => {
    const calls: string[] = [];
    const fakePut = async (path: string) => {
      calls.push(path);
      return { url: `https://blob.example/${path}` };
    };
    const url = await uploadImage('players/7.png', Buffer.from('x'), fakePut);
    expect(url).toBe('https://blob.example/players/7.png');
    expect(calls).toEqual(['players/7.png']);
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run src/lib/__tests__/blob.test.ts`
Expected: FAIL — cannot find module `../blob`.

- [ ] **Step 4: Write `src/lib/blob.ts`**

```ts
import { put } from '@vercel/blob';

export type PutFn = (
  path: string,
  data: Buffer | Blob,
  opts: { access: 'public'; token?: string; contentType?: string },
) => Promise<{ url: string }>;

export async function uploadImage(
  filename: string,
  data: Buffer | Blob,
  putFn: PutFn = put as unknown as PutFn,
): Promise<string> {
  const { url } = await putFn(filename, data, {
    access: 'public',
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });
  return url;
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/lib/__tests__/blob.test.ts`
Expected: PASS (1 test).

- [ ] **Step 6: Write `src/app/api/upload/route.ts`**

```ts
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { uploadImage } from '@/lib/blob';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const form = await req.formData();
  const file = form.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file' }, { status: 400 });
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const url = await uploadImage(`uploads/${Date.now()}-${safeName}`, buffer);
  return NextResponse.json({ url });
}
```

- [ ] **Step 7: Commit**

```bash
git add src/lib/blob.ts src/app/api/upload src/lib/__tests__/blob.test.ts package.json package-lock.json
git commit -m "feat(programme): Vercel Blob image upload helper + route"
```

---

## Task 5: Squad + programme CRUD API routes

**Files:**
- Create: `src/lib/store-singleton.ts`
- Create: `src/app/api/squad/route.ts`
- Create: `src/app/api/squad/[id]/route.ts`
- Create: `src/app/api/programme/route.ts` (list + create)
- Create: `src/app/api/programme/[id]/route.ts` (get + update + delete)
- Test: `src/app/api/__tests__/squad-route.test.ts`

**Note:** the repo already has `src/app/api/programme/pdf/route.ts`; you are ADDING sibling routes at `src/app/api/programme/route.ts` and `src/app/api/programme/[id]/route.ts`, not touching the pdf one.

**Interfaces:**
- Consumes: `createStore`, `getRedis` (Task 1); `requireAdmin` (Task 2).
- Produces:
  - `function getStore(): Store` from `store-singleton.ts` (wraps `createStore(getRedis())`; mocked in tests).
  - `GET /api/squad` (public read) → `SquadPlayer[]`; `POST /api/squad` (admin) create/replace player → `SquadPlayer`.
  - `PUT /api/squad/[id]` (admin), `DELETE /api/squad/[id]` (admin).
  - `GET /api/programme` (admin) → `Programme[]`; `POST /api/programme` (admin) → `Programme`.
  - `GET/PUT/DELETE /api/programme/[id]` (admin).

- [ ] **Step 1: Write the store singleton (`src/lib/store-singleton.ts`)**

```ts
import { createStore, type Store } from './programme-store';
import { getRedis } from './kv';

let store: Store | null = null;

export function getStore(): Store {
  if (!store) store = createStore(getRedis());
  return store;
}
```

- [ ] **Step 2: Write the failing test (`src/app/api/__tests__/squad-route.test.ts`)**

This test mocks the store singleton with an in-memory store and mocks auth to allow the request.

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InMemoryKV } from '@/lib/kv';
import { createStore } from '@/lib/programme-store';

const store = createStore(new InMemoryKV());
vi.mock('@/lib/store-singleton', () => ({ getStore: () => store }));
vi.mock('@/lib/admin-auth', () => ({ requireAdmin: () => true }));

import { GET, POST } from '../squad/route';

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
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run src/app/api/__tests__/squad-route.test.ts`
Expected: FAIL — cannot find module `../squad/route`.

- [ ] **Step 4: Write `src/app/api/squad/route.ts`**

```ts
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getStore } from '@/lib/store-singleton';
import type { SquadPlayer } from '@/types/programme';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(await getStore().listPlayers());
}

export async function POST(req: Request) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  if (typeof body?.squadNo !== 'number') {
    return NextResponse.json({ error: 'squadNo is required' }, { status: 400 });
  }
  const player: SquadPlayer = {
    id: typeof body.id === 'string' && body.id ? body.id : crypto.randomUUID(),
    squadNo: body.squadNo,
    firstName: String(body.firstName ?? ''),
    lastName: String(body.lastName ?? ''),
    position: String(body.position ?? ''),
    photoUrl: body.photoUrl ? String(body.photoUrl) : undefined,
    penPicture: body.penPicture ? String(body.penPicture) : undefined,
  };
  await getStore().savePlayer(player);
  return NextResponse.json(player);
}
```

- [ ] **Step 5: Write `src/app/api/squad/[id]/route.ts`**

```ts
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getStore } from '@/lib/store-singleton';
import type { SquadPlayer } from '@/types/programme';

export const runtime = 'nodejs';

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Ctx) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const player: SquadPlayer = {
    id,
    squadNo: Number(body.squadNo),
    firstName: String(body.firstName ?? ''),
    lastName: String(body.lastName ?? ''),
    position: String(body.position ?? ''),
    photoUrl: body.photoUrl ? String(body.photoUrl) : undefined,
    penPicture: body.penPicture ? String(body.penPicture) : undefined,
  };
  await getStore().savePlayer(player);
  return NextResponse.json(player);
}

export async function DELETE(req: Request, { params }: Ctx) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  await getStore().deletePlayer(id);
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 6: Write `src/app/api/programme/route.ts`**

```ts
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getStore } from '@/lib/store-singleton';
import type { Programme } from '@/types/programme';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json(await getStore().listProgrammes());
}

export async function POST(req: Request) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const id = typeof body.id === 'string' && body.id ? body.id : crypto.randomUUID();
  const programme: Programme = {
    id,
    slug: String(body.slug ?? id),
    status: body.status === 'published' ? 'published' : 'draft',
    opponent: String(body.opponent ?? ''),
    date: String(body.date ?? ''),
    kickoff: String(body.kickoff ?? ''),
    competition: String(body.competition ?? ''),
    matchdayNumber: String(body.matchdayNumber ?? ''),
    startingXI: Array.isArray(body.startingXI) ? body.startingXI : [],
    substitutes: Array.isArray(body.substitutes) ? body.substitutes : [],
    captain: typeof body.captain === 'number' ? body.captain : null,
    referee: String(body.referee ?? ''),
    assistantRef1: String(body.assistantRef1 ?? ''),
    assistantRef2: String(body.assistantRef2 ?? ''),
    managersNotes: String(body.managersNotes ?? ''),
    teamNews: String(body.teamNews ?? ''),
    updatedAt: new Date().toISOString(),
  };
  await getStore().saveProgramme(programme);
  return NextResponse.json(programme);
}
```

- [ ] **Step 7: Write `src/app/api/programme/[id]/route.ts`**

```ts
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getStore } from '@/lib/store-singleton';

export const runtime = 'nodejs';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: Ctx) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const programme = await getStore().getProgramme(id);
  if (!programme) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(programme);
}

export async function PUT(req: Request, { params }: Ctx) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const existing = await getStore().getProgramme(id);
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const body = await req.json().catch(() => ({}));
  const updated = { ...existing, ...body, id, updatedAt: new Date().toISOString() };
  await getStore().saveProgramme(updated);
  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: Ctx) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  await getStore().deleteProgramme(id);
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 8: Run the squad test to verify it passes**

Run: `npx vitest run src/app/api/__tests__/squad-route.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 9: Full suite + build**

Run: `npx vitest run && npm run build`
Expected: all tests pass; build lists the new `/api/squad`, `/api/squad/[id]`, `/api/programme`, `/api/programme/[id]` routes.

- [ ] **Step 10: Commit**

```bash
git add src/lib/store-singleton.ts src/app/api/squad src/app/api/programme/route.ts "src/app/api/programme/[id]" src/app/api/__tests__/squad-route.test.ts
git commit -m "feat(programme): squad + programme CRUD API routes (admin-guarded)"
```

---

## Task 6: Squad admin page

**Files:**
- Create: `src/app/admin/squad/page.tsx`

**Interfaces:**
- Consumes: `GET/POST /api/squad`, `PUT/DELETE /api/squad/[id]`, `POST /api/upload` (Tasks 4-5).
- Produces: a `/admin/squad` UI page (no exported symbols). Verified via dev server, not unit test (jsdom not configured).

- [ ] **Step 1: Write the page (`src/app/admin/squad/page.tsx`)**

```tsx
'use client';

import { useEffect, useState } from 'react';
import type { SquadPlayer } from '@/types/programme';

const BLANK: Omit<SquadPlayer, 'id'> = {
  squadNo: 0, firstName: '', lastName: '', position: '', photoUrl: '', penPicture: '',
};

export default function SquadAdminPage() {
  const [players, setPlayers] = useState<SquadPlayer[]>([]);
  const [form, setForm] = useState<Omit<SquadPlayer, 'id'> & { id?: string }>({ ...BLANK });
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch('/api/squad');
    setPlayers(await res.json());
  }
  useEffect(() => { load(); }, []);

  async function uploadPhoto(file: File) {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    if (res.ok) setForm((f) => ({ ...f, photoUrl: (await res.json()).url }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const editing = Boolean(form.id);
    await fetch(editing ? `/api/squad/${form.id}` : '/api/squad', {
      method: editing ? 'PUT' : 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...form, squadNo: Number(form.squadNo) }),
    });
    setForm({ ...BLANK });
    setSaving(false);
    load();
  }

  async function remove(id: string) {
    if (!confirm('Delete this player?')) return;
    await fetch(`/api/squad/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Squad</h1>

      <form onSubmit={save} className="mb-8 grid grid-cols-2 gap-3 rounded border p-4">
        <input type="number" placeholder="No." value={form.squadNo || ''} required
          onChange={(e) => setForm({ ...form, squadNo: Number(e.target.value) })}
          className="rounded border px-2 py-1" />
        <input placeholder="Position" value={form.position}
          onChange={(e) => setForm({ ...form, position: e.target.value })}
          className="rounded border px-2 py-1" />
        <input placeholder="First name" value={form.firstName} required
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          className="rounded border px-2 py-1" />
        <input placeholder="Last name" value={form.lastName} required
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          className="rounded border px-2 py-1" />
        <textarea placeholder="Pen picture" value={form.penPicture}
          onChange={(e) => setForm({ ...form, penPicture: e.target.value })}
          className="col-span-2 rounded border px-2 py-1" rows={2} />
        <input type="file" accept="image/*"
          onChange={(e) => e.target.files?.[0] && uploadPhoto(e.target.files[0])}
          className="col-span-2" />
        <button type="submit" disabled={saving}
          className="col-span-2 rounded bg-green-700 px-4 py-2 font-semibold text-white disabled:opacity-50">
          {form.id ? 'Update player' : 'Add player'}
        </button>
      </form>

      <ul className="divide-y">
        {players.map((p) => (
          <li key={p.id} className="flex items-center justify-between py-2">
            <span>#{p.squadNo} {p.firstName} {p.lastName} — {p.position}</span>
            <span className="space-x-3">
              <button onClick={() => setForm(p)} className="text-blue-600">Edit</button>
              <button onClick={() => remove(p.id)} className="text-red-600">Delete</button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 2: Verify build + manual smoke test**

Run: `npm run build && npm run dev`
Then, with `.env.local` populated: log in at `/admin/login`, open `/admin/squad`, add a player with a photo, edit it, delete it. Confirm the list reflects each change and the photo URL is a `blob.vercel-storage.com` link.
Expected: all operations succeed; players persist across a page reload (proving KV, not localStorage).

- [ ] **Step 3: Commit**

```bash
git add src/app/admin/squad
git commit -m "feat(programme): self-serve squad admin page"
```

---

## Task 7: Move the programme builder off localStorage

**Files:**
- Modify: `src/app/admin/programme/page.tsx` (replace the `localStorage` load/save/delete with `fetch` to `/api/programme`)

**Interfaces:**
- Consumes: `GET/POST /api/programme`, `PUT/DELETE /api/programme/[id]` (Task 5).
- Produces: no new exports; the builder now reads/writes shared storage.

- [ ] **Step 1: Locate the localStorage calls**

Run: `grep -n "localStorage" src/app/admin/programme/page.tsx`
Expected: the load loop (~line 178), the save (~line 319), and the delete (~line 351) from the current implementation.

- [ ] **Step 2: Replace the load logic**

Find the effect that iterates `localStorage` to build the saved-programmes list and replace its body with a fetch:

```tsx
// Load saved programmes from shared storage
useEffect(() => {
  (async () => {
    const res = await fetch('/api/programme');
    if (res.ok) {
      const rows = await res.json();
      setSavedProgrammes(rows.map((data: ProgrammeData & { id: string }) => ({ id: data.id, data })));
    }
  })();
}, []);
```

- [ ] **Step 3: Replace the save logic**

Replace the `localStorage.setItem(programmeKey, ...)` block with:

```tsx
const isUpdate = Boolean(formData.id);
const res = await fetch(isUpdate ? `/api/programme/${formData.id}` : '/api/programme', {
  method: isUpdate ? 'PUT' : 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(formData),
});
if (res.ok) {
  const saved = await res.json();
  setFormData((f) => ({ ...f, id: saved.id }));
}
```

- [ ] **Step 4: Replace the delete logic**

Replace `localStorage.removeItem(id)` with:

```tsx
await fetch(`/api/programme/${id}`, { method: 'DELETE' });
```

(Keep the surrounding state refresh; re-run the load fetch from Step 2 after delete.)

- [ ] **Step 5: Confirm no localStorage remains**

Run: `grep -n "localStorage" src/app/admin/programme/page.tsx`
Expected: no matches.

- [ ] **Step 6: Verify build + manual smoke test**

Run: `npm run build && npm run dev`
Then: at `/admin/programme`, create a programme, reload the page, and confirm it still appears (it now lives in KV). Open the same URL in a different browser (still logged in) and confirm the same programme is listed — proving it is shared, not per-browser.
Expected: programmes persist server-side and are visible across browsers.

- [ ] **Step 7: Commit**

```bash
git add src/app/admin/programme/page.tsx
git commit -m "feat(programme): builder reads/writes shared KV instead of localStorage"
```

---

## Phase 1 done — what exists now

- Shared server storage (KV) for squad + programmes; images in Blob.
- A real shared-password login gate on every admin write route.
- A self-serve squad admin page.
- The builder persists to shared storage, so the whole team sees the same data from any device.

## Next phases (separate plans, written when we reach them)

- **Phase 2 — Auto-fill:** next-match resolver + feed→builder wiring (match core, table, results, fixtures).
- **Phase 3 — Content:** opposition library + static-content Settings editor (pre-populated from the Publisher file's officials/history/honours/adverts text).
- **Phase 4 — Outputs:** public web programme page + PDF generated from the saved record.
