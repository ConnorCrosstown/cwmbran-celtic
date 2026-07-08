import { describe, it, expect } from 'vitest';
import { parseAwsDate, stableMatchId } from '@/lib/allwalessport-parse';

describe('parseAwsDate', () => {
  it('parses "7 August 2026" to UTC-noon epoch ms', () => {
    expect(parseAwsDate('7 August 2026')).toBe(Date.UTC(2026, 7, 7, 12, 0, 0));
  });
  it('trims surrounding whitespace', () => {
    expect(parseAwsDate('  15 May 2022 ')).toBe(Date.UTC(2022, 4, 15, 12, 0, 0));
  });
  it('returns NaN for unparseable input', () => {
    expect(Number.isNaN(parseAwsDate('not a date'))).toBe(true);
  });
});

describe('stableMatchId', () => {
  it('is deterministic for the same inputs', () => {
    const d = Date.UTC(2026, 7, 7, 12, 0, 0);
    expect(stableMatchId(d, 'Cwmbran Celtic', 'Risca United'))
      .toBe(stableMatchId(d, 'Cwmbran Celtic', 'Risca United'));
  });
  it('differs when teams differ', () => {
    const d = Date.UTC(2026, 7, 7, 12, 0, 0);
    expect(stableMatchId(d, 'A', 'B')).not.toBe(stableMatchId(d, 'B', 'A'));
  });
  it('is a positive integer', () => {
    expect(stableMatchId(1, 'A', 'B')).toBeGreaterThan(0);
  });
});
