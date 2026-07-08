import { describe, it, expect } from 'vitest';
import { resolveTeamCrest, crestInitials } from '@/lib/team-crest';

describe('crestInitials', () => {
  it('uses first letters of multi-word names', () => {
    expect(crestInitials('Cwmbran Town')).toBe('CT');
    expect(crestInitials('Newport Corinthians')).toBe('NC');
  });
  it('uses first two letters of single-word names', () => {
    expect(crestInitials('Goytre')).toBe('GO');
    expect(crestInitials('Undy')).toBe('UN');
  });
});

describe('resolveTeamCrest', () => {
  it('maps Cwmbran Celtic to the club logo image', () => {
    const r = resolveTeamCrest('Cwmbran Celtic');
    expect(r.kind).toBe('image');
    if (r.kind === 'image') expect(r.src).toBe('/images/club-logo.webp');
  });
  it('falls back to a monogram for an opponent with no crest', () => {
    const r = resolveTeamCrest('Zzz Unknown FC');
    expect(r.kind).toBe('monogram');
    if (r.kind === 'monogram') {
      expect(r.initials).toBe('ZU');
      expect(r.hue).toBeGreaterThanOrEqual(0);
      expect(r.hue).toBeLessThan(360);
      expect(r.alt).toBe('Zzz Unknown FC');
    }
  });
  it('is deterministic (same name → same hue)', () => {
    const a = resolveTeamCrest('Risca United');
    const b = resolveTeamCrest('Risca United');
    expect(a).toEqual(b);
  });
});
