import { describe, it, expect } from 'vitest';
import { safeNextPath } from '../safe-next';

const ORIGIN = 'https://cwmbran-celtic.example';

describe('safeNextPath', () => {
  it('falls back to /admin for null or empty', () => {
    expect(safeNextPath(null, ORIGIN)).toBe('/admin');
    expect(safeNextPath('', ORIGIN)).toBe('/admin');
  });

  it('allows a same-origin relative path (and preserves query/hash)', () => {
    expect(safeNextPath('/admin/squad', ORIGIN)).toBe('/admin/squad');
    expect(safeNextPath('/admin/programme?id=1#top', ORIGIN)).toBe('/admin/programme?id=1#top');
  });

  it('rejects absolute cross-origin URLs', () => {
    expect(safeNextPath('https://evil.com/steal', ORIGIN)).toBe('/admin');
  });

  it('rejects protocol-relative //host', () => {
    expect(safeNextPath('//evil.com', ORIGIN)).toBe('/admin');
  });

  it('rejects the control-character normalization bypass', () => {
    // URLSearchParams.get() decodes `/%09/evil.com` to `"/\t/evil.com"`; the
    // WHATWG parser strips the tab -> `//evil.com` -> cross-origin -> rejected.
    expect(safeNextPath('/\t/evil.com', ORIGIN)).toBe('/admin');
    expect(safeNextPath('/\n/evil.com', ORIGIN)).toBe('/admin');
  });

  it('rejects the backslash trick', () => {
    expect(safeNextPath('/\\evil.com', ORIGIN)).toBe('/admin');
  });
});
