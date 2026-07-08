import * as cheerio from 'cheerio';
import type { Fixture, Result } from '@/types';
import type { AwsTeam } from '@/data/allwalessport-teams';
import { parseAwsDate, stableMatchId } from '@/lib/allwalessport-parse';

/**
 * Parse a football.aspx?cid=<id> page into fixtures and results for one team.
 *
 * A match-day is an <h2>date</h2> followed by rows. Each row has:
 *   .team1 | .versus (" v ")             .team2   -> fixture (unplayed)
 *   .team1 | .versus (home) | .versus (away) | .team2 -> result (played)
 * Only rows involving team.clubName are returned.
 */
export function parseFixturesAndResults(
  html: string,
  team: AwsTeam
): { fixtures: Fixture[]; results: Result[] } {
  const $ = cheerio.load(html);
  const fixtures: Fixture[] = [];
  const results: Result[] = [];
  let currentDate = NaN;

  // Walk every <h2> (date) and <tr> (row) in document order.
  $('h2, tr').each((_, el) => {
    if (el.tagName === 'h2') {
      currentDate = parseAwsDate($(el).text());
      return;
    }
    const row = $(el);
    const home = row.find('td.team1').first().text().trim();
    const away = row.find('td.team2').first().text().trim();
    if (!home || !away) return;
    if (home !== team.clubName && away !== team.clubName) return;

    const versus = row.find('td.versus');
    const homeAway: 'H' | 'A' = home === team.clubName ? 'H' : 'A';
    const date = currentDate;

    if (versus.length >= 2) {
      const hs = parseInt($(versus[0]).text().trim(), 10);
      const as = parseInt($(versus[1]).text().trim(), 10);
      if (Number.isNaN(hs) || Number.isNaN(as)) return;
      results.push({
        matchId: stableMatchId(date, home, away),
        date, homeTeam: home, awayTeam: away,
        homeScore: hs, awayScore: as,
        competition: team.label, scorers: '', attendance: 0, team: team.key,
      });
    } else {
      fixtures.push({
        matchId: stableMatchId(date, home, away),
        date, time: '', homeTeam: home, awayTeam: away,
        competition: team.label, venue: '', homeAway, team: team.key,
      });
    }
  });

  return { fixtures, results };
}
