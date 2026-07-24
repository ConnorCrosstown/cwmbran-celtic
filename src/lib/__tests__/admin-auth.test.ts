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
