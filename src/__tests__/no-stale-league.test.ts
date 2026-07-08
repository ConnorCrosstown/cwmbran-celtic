import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';

describe('no current-season JD Cymru South references', () => {
  it('swept app/components/emails contain no "JD Cymru South"', () => {
    const out = execSync(
      `grep -rIl "JD Cymru South" src/app src/components src/emails || true`,
      { encoding: 'utf8' },
    ).trim();
    // Zero tolerance: no current-season "JD Cymru South" anywhere in the
    // rendered app. (Genuinely historical mentions use "Cymru South" without
    // the "JD" prefix, or live in src/data, outside this scan.)
    const offenders = out.split('\n').filter(Boolean);
    expect(offenders, `stale refs in: ${offenders.join(', ')}`).toEqual([]);
  });
});
