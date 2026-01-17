import Link from 'next/link';
import { Fixture, LeagueTableRow } from '@/types';
import { formatMatchDate, getOpponent, isHomeGame } from '@/lib/comet';

interface TeamCardProps {
  teamName: string;
  teamType: 'mens' | 'ladies';
  league: string;
  position: LeagueTableRow | null;
  nextFixture: Fixture | null;
  href: string;
}

export default function TeamCard({
  teamName,
  teamType,
  league,
  position,
  nextFixture,
  href,
}: TeamCardProps) {
  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="bg-celtic-blue text-white p-4">
        <h3 className="font-bold text-lg">{teamName}</h3>
        <p className="text-sm text-celtic-yellow">{league}</p>
      </div>

      {/* League Position */}
      {position && (
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <span className="text-3xl font-bold text-celtic-blue">{position.position}</span>
                <span className="text-sm text-gray-500">
                  {position.position === 1 ? 'st' : position.position === 2 ? 'nd' : position.position === 3 ? 'rd' : 'th'}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                <p><span className="font-semibold">{position.points}</span> pts</p>
                <p>{position.played} played</p>
              </div>
            </div>
            <div className="text-sm text-gray-600 text-right">
              <p className="text-green-600">W{position.won}</p>
              <p className="text-yellow-600">D{position.drawn}</p>
              <p className="text-red-600">L{position.lost}</p>
            </div>
          </div>
        </div>
      )}

      {/* Next Fixture */}
      {nextFixture && (
        <div className="p-4 border-b bg-gray-50">
          <p className="text-xs text-gray-500 uppercase mb-2">Next Home Game</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-celtic-dark">vs {getOpponent(nextFixture)}</p>
              <p className="text-sm text-gray-600">{formatMatchDate(nextFixture.date)} • {nextFixture.time}</p>
            </div>
            {isHomeGame(nextFixture) && (
              <span className="badge-home">HOME</span>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="p-4 flex gap-3">
        <Link
          href={href}
          className="flex-1 text-center py-2 bg-celtic-blue text-white rounded-lg font-medium hover:bg-celtic-blue-dark transition-colors text-sm"
        >
          View Team
        </Link>
        <Link
          href="/fixtures"
          className="flex-1 text-center py-2 border border-celtic-blue text-celtic-blue rounded-lg font-medium hover:bg-celtic-blue hover:text-white transition-colors text-sm"
        >
          Fixtures
        </Link>
      </div>
    </div>
  );
}
