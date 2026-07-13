import 'server-only';
import type { Fixture, Result, LeagueTableRow } from '@/types';
import { resolveTeamCrest, type CrestResult } from '@/lib/team-crest';
import { activeTeams, AWS_TEAMS, type TeamKey } from '@/data/allwalessport-teams';

export interface FeedPayload {
  generatedAt: number;
  teams: { key: TeamKey; label: string; league: string }[];
  fixtures: Fixture[];
  results: Result[];
  tables: Record<string, LeagueTableRow[]>;
  crests: Record<string, CrestResult>;
}

type FeedData = { fixtures: Fixture[]; results: Result[]; tables: Record<string, LeagueTableRow[]> };

/** Every distinct club name that appears anywhere in the feed. */
export function collectClubNames(data: FeedData): string[] {
  const names = new Set<string>();
  for (const f of data.fixtures) { names.add(f.homeTeam); names.add(f.awayTeam); }
  for (const r of data.results) { names.add(r.homeTeam); names.add(r.awayTeam); }
  for (const rows of Object.values(data.tables)) for (const row of rows) names.add(row.club);
  return [...names];
}

/** Rewrite an app-relative crest image src to an absolute URL. Monograms and
 *  already-absolute srcs pass through unchanged. */
export function absolutizeCrest(crest: CrestResult, origin: string): CrestResult {
  if (crest.kind !== 'image') return crest;
  if (/^https?:\/\//i.test(crest.src)) return crest;
  const src = `${origin.replace(/\/$/, '')}/${crest.src.replace(/^\//, '')}`;
  return { ...crest, src };
}

/** Assemble the JSON payload WordPress consumes. Pure — no network. */
export function buildFeed(data: FeedData, origin: string, now: number): FeedPayload {
  const crests: Record<string, CrestResult> = {};
  for (const name of collectClubNames(data)) {
    crests[name] = absolutizeCrest(resolveTeamCrest(name), origin);
  }
  const active = activeTeams();
  const teams = active.map(t => {
    const meta = AWS_TEAMS.find(x => x.key === t.key)!;
    return { key: meta.key, label: meta.label, league: meta.league };
  });
  return { generatedAt: now, teams, fixtures: data.fixtures, results: data.results, tables: data.tables, crests };
}
