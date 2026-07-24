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
