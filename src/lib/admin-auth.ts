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
