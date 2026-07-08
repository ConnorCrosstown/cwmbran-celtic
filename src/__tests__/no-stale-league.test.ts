import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';

describe('no current-season JD Cymru South references', () => {
  it('swept app/components/emails contain no "JD Cymru South"', () => {
    const out = execSync(
      `grep -rIl "JD Cymru South" src/app src/components src/emails || true`,
      { encoding: 'utf8' },
    ).trim();
    // Allow the historical narrative files only.
    const allowed = new Set([
      'src/app/club/history/page.tsx',
      'src/app/programme/[slug]/print/page.tsx',
    ]);
    const offenders = out.split('\n').filter(Boolean).filter(f => !allowed.has(f));
    expect(offenders, `stale refs in: ${offenders.join(', ')}`).toEqual([]);
  });
});
