/**
 * Registry of Cwmbran Celtic teams and their allwalessport competition ids.
 *
 * cid = the `cid` query param on football.aspx?cid=<id> for that team's division.
 * A team with cid: 0 is not yet resolved and is skipped until filled in.
 *
 * To resolve a team's cid: open allwalessport.co.uk football, drill into the
 * league that team plays in, and read the cid from the URL. Confirm the club's
 * exact spelling (clubName) as it appears in that division's table.
 */
export type TeamKey = 'mens' | 'ladies' | 'reserves';

export interface AwsTeam {
  key: TeamKey;
  label: string;    // heading shown on the team page
  cid: number;      // allwalessport competition id; 0 = unresolved, skipped
  clubName: string; // exact club name as printed on allwalessport
}

export const AWS_TEAMS: AwsTeam[] = [
  { key: 'mens', label: "Men's First Team", cid: 20149, clubName: 'Cwmbran Celtic' },
  // Women's cid to be resolved (pre-season, division not yet published).
  // Likely the S Wales Womens & Girls League. Set cid + confirm clubName, then this activates.
  { key: 'ladies', label: 'Ladies', cid: 0, clubName: 'Cwmbran Celtic' },
];

export function activeTeams(): AwsTeam[] {
  return AWS_TEAMS.filter(t => t.cid > 0);
}
