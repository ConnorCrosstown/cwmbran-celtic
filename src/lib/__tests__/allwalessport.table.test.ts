import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';
import { parseLeagueTable } from '@/lib/allwalessport';

const html = readFileSync(
  path.join(__dirname, 'fixtures', 'aws-inseason-womens-10641.html'), 'utf8'
);

describe('parseLeagueTable', () => {
  const table = parseLeagueTable(html);

  it('reads every club row', () => {
    expect(table.length).toBeGreaterThanOrEqual(10);
  });
  it('numbers positions by row order starting at 1', () => {
    expect(table[0].position).toBe(1);
    expect(table[0].club).toBe('Pontypridd United');
    expect(table[table.length - 1].position).toBe(table.length);
  });
  it('parses P/W/D/L/GD/Pts as numbers for the top row', () => {
    const top = table[0];
    expect(top.played).toBe(17);
    expect(top.won).toBe(13);
    expect(Number.isInteger(top.drawn)).toBe(true);
    expect(Number.isInteger(top.lost)).toBe(true);
    expect(Number.isInteger(top.gd)).toBe(true);
    expect(Number.isInteger(top.points)).toBe(true);
  });
});
