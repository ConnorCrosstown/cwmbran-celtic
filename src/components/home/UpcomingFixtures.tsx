import Link from 'next/link';
import { Fixture } from '@/types';
import { formatMatchDate, getOpponent, isHomeGame } from '@/lib/comet';
import { getAwayDayByTeamName } from '@/data/away-days';
import TeamCrest from '@/components/teams/TeamCrest';

interface UpcomingFixturesProps {
  fixtures: Fixture[];
}

function getTeamInfo(fixture: Fixture): { label: string; fullName: string; color: string; textColor: string } {
  const homeTeam = fixture.homeTeam.toLowerCase();
  const awayTeam = fixture.awayTeam.toLowerCase();
  const teamName = homeTeam.includes('cwmbran') ? fixture.homeTeam : fixture.awayTeam;
  const teamLower = teamName.toLowerCase();

  // Check for Women's team
  if (teamLower.includes('ladies') || teamLower.includes('women')) {
    return { label: 'W', fullName: "Women's", color: 'bg-celtic-yellow', textColor: 'text-celtic-dark' };
  }

  // Check for 3rd team (Thirds)
  if (teamLower.includes('third') || teamLower.includes('3rd') || teamLower.includes('iii')) {
    return { label: '3', fullName: "Men's 3rds", color: 'bg-celtic-blue-light', textColor: 'text-white' };
  }

  // Check for 2nd team (Seconds/Reserves)
  if (teamLower.includes('second') || teamLower.includes('2nd') || teamLower.includes('reserve') || teamLower.includes('ii')) {
    return { label: '2', fullName: "Men's 2nds", color: 'bg-celtic-blue-dark', textColor: 'text-white' };
  }

  // Default to Men's 1st team
  return { label: '1', fullName: "Men's 1st", color: 'bg-celtic-blue', textColor: 'text-white' };
}

export default function UpcomingFixtures({ fixtures }: UpcomingFixturesProps) {
  if (fixtures.length === 0) {
    return null;
  }

  return (
    <div className="card">
      <div className="p-6">
        <h3 className="text-lg font-bold text-celtic-dark mb-4">Upcoming Fixtures</h3>

        <div className="space-y-3">
          {fixtures.map((fixture) => {
            const teamInfo = getTeamInfo(fixture);
            const opponent = getOpponent(fixture);
            const isAway = !isHomeGame(fixture);
            // Away day info for away guide links
            const awayDayInfo = getAwayDayByTeamName(opponent);

            return (
              <div
                key={fixture.matchId}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                {/* Opponent crest (monogram fallback) */}
                <div className="flex-shrink-0">
                  <TeamCrest name={opponent} size={40} />
                </div>

                <div className="text-center min-w-[70px]">
                  <p className="text-sm font-semibold text-gray-700">
                    {formatMatchDate(fixture.date)}
                  </p>
                  <p className="text-xs text-gray-500">{fixture.time}</p>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-celtic-blue mb-0.5">{teamInfo.fullName}</p>
                  <p className="font-semibold text-celtic-dark truncate">
                    vs {opponent}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{fixture.competition}</p>
                </div>

                <div className="flex-shrink-0 flex flex-col items-end gap-1">
                  {isAway ? (
                    <>
                      <span className="badge-away">AWAY</span>
                      {awayDayInfo && (
                        <Link
                          href={`/away-days/${awayDayInfo.teamId}`}
                          className="text-[10px] text-celtic-blue hover:underline"
                        >
                          Away guide →
                        </Link>
                      )}
                    </>
                  ) : (
                    <span className="badge-home">HOME</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <Link
          href="/fixtures"
          className="block mt-4 text-celtic-blue font-semibold hover:text-celtic-blue-dark transition-colors text-sm"
        >
          View all fixtures →
        </Link>
      </div>
    </div>
  );
}
