import Link from 'next/link';
import { Fixture } from '@/types';
import { formatMatchDate, getOpponent, isHomeGame } from '@/lib/comet';

interface UpcomingFixturesProps {
  fixtures: Fixture[];
}

function getTeamBadge(fixture: Fixture): { label: string; color: string; textColor: string } {
  const isLadies = fixture.homeTeam.includes('Ladies') || fixture.awayTeam.includes('Ladies');
  return isLadies
    ? { label: 'W', color: 'bg-celtic-yellow', textColor: 'text-celtic-dark' }
    : { label: 'M', color: 'bg-celtic-blue', textColor: 'text-white' };
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
            const teamBadge = getTeamBadge(fixture);
            return (
              <div
                key={fixture.matchId}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                {/* Team indicator badge */}
                <div
                  className={`${teamBadge.color} ${teamBadge.textColor} w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0`}
                  title={teamBadge.label === 'W' ? 'Women' : "Men's"}
                >
                  {teamBadge.label}
                </div>

                <div className="text-center min-w-[60px]">
                  <p className="text-sm font-semibold text-gray-700">
                    {formatMatchDate(fixture.date)}
                  </p>
                  <p className="text-xs text-gray-500">{fixture.time}</p>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-celtic-dark truncate">
                    vs {getOpponent(fixture)}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{fixture.competition}</p>
                </div>

                <div className="flex-shrink-0">
                  {isHomeGame(fixture) ? (
                    <span className="badge-home">HOME</span>
                  ) : (
                    <span className="badge-away">AWAY</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <span className="bg-celtic-blue text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">M</span>
            <span>Men&apos;s</span>
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
