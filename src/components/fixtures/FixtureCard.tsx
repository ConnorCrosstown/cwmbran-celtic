import Link from 'next/link';
import { Fixture } from '@/types';
import { formatMatchDate, getOpponent, isHomeGame } from '@/lib/comet';
import AddToCalendar from './AddToCalendar';

interface FixtureCardProps {
  fixture: Fixture;
  showAdmission?: boolean;
}

function getTeamBadge(fixture: Fixture): { label: string; color: string; textColor: string } {
  const isWomens = fixture.homeTeam.includes('Ladies') || fixture.awayTeam.includes('Ladies');
  return isWomens
    ? { label: 'W', color: 'bg-celtic-yellow', textColor: 'text-celtic-dark' }
    : { label: 'M', color: 'bg-celtic-blue', textColor: 'text-white' };
}

export default function FixtureCard({ fixture, showAdmission = false }: FixtureCardProps) {
  const isHome = isHomeGame(fixture);
  const opponent = getOpponent(fixture);
  const teamBadge = getTeamBadge(fixture);

  return (
    <div className="card">
      {/* Date & Competition Header */}
      <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div
            className={`${teamBadge.color} ${teamBadge.textColor} w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold`}
            title={teamBadge.label === 'W' ? 'Women' : "Men's"}
          >
            {teamBadge.label}
          </div>
          <span className="font-semibold text-celtic-dark">{formatMatchDate(fixture.date)}</span>
          <span className="text-gray-500">{fixture.time}</span>
        </div>
        <span className="text-sm text-gray-600">{fixture.competition}</span>
      </div>

      {/* Match Info */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <p className={`font-bold text-lg ${isHome ? 'text-celtic-blue' : 'text-gray-700'}`}>
              {fixture.homeTeam}
            </p>
          </div>
          <div className="px-4 text-center">
            <span className="text-2xl font-bold text-gray-400">vs</span>
          </div>
          <div className="flex-1 text-right">
            <p className={`font-bold text-lg ${!isHome ? 'text-celtic-blue' : 'text-gray-700'}`}>
              {fixture.awayTeam}
            </p>
          </div>
        </div>

        {/* Venue & Badge */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">📍 {fixture.venue}</span>
          {isHome ? (
            <span className="badge-home">HOME</span>
          ) : (
            <span className="badge-away">AWAY</span>
          )}
        </div>

        {/* Actions */}
        <div className="mt-4 pt-4 border-t flex gap-4 flex-wrap items-center justify-between">
          <div className="flex gap-3 flex-wrap">
            {isHome && (
              <>
                <Link
                  href="/visit"
                  className="text-sm text-celtic-blue hover:text-celtic-blue-dark font-medium"
                >
                  📍 Directions
                </Link>
                {showAdmission && (
                  <Link
                    href="/visit#admission"
                    className="text-sm text-celtic-blue hover:text-celtic-blue-dark font-medium"
                  >
                    🎟️ Admission
                  </Link>
                )}
              </>
            )}
          </div>
          <AddToCalendar fixture={fixture} />
        </div>
      </div>
    </div>
  );
}
