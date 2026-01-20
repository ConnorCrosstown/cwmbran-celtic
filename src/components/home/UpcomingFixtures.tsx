import Link from 'next/link';
import Image from 'next/image';
import { Fixture } from '@/types';
import { formatMatchDate, getOpponent, isHomeGame } from '@/lib/comet';
import { getAwayDayByTeamName } from '@/data/away-days';

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
            // Get opponent info for badge (works for both home and away games)
            const opponentInfo = getAwayDayByTeamName(opponent);

            return (
              <div
                key={fixture.matchId}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                {/* Show opponent badge if available, otherwise team indicator */}
                {opponentInfo?.badge ? (
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0 border border-gray-200 p-1">
                    <Image
                      src={opponentInfo.badge}
                      alt={`${opponent} badge`}
                      width={32}
                      height={32}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div
                    className={`${teamInfo.color} ${teamInfo.textColor} w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0`}
                    title={teamInfo.fullName}
                  >
                    {teamInfo.label}
                  </div>
                )}

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
                      {opponentInfo && (
                        <Link
                          href={`/away-days/${opponentInfo.teamId}`}
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

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <span className="bg-celtic-blue text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">1</span>
            <span>Men&apos;s 1st</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="bg-celtic-blue-dark text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">2</span>
            <span>Men&apos;s 2nds</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="bg-celtic-blue-light text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">3</span>
            <span>Men&apos;s 3rds</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="bg-celtic-yellow text-celtic-dark w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">W</span>
            <span>Women&apos;s</span>
          </div>
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
