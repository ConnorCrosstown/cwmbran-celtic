import Link from 'next/link';
import { LeagueTableRow } from '@/types';

interface LeaguePositionProps {
  position: LeagueTableRow | null;
  leagueName: string;
}

export default function LeaguePosition({ position, leagueName }: LeaguePositionProps) {
  if (!position) {
    return null;
  }

  return (
    <div className="card">
      <div className="p-6">
        <h3 className="text-lg font-bold text-celtic-dark mb-4">League Position</h3>

        <div className="text-sm text-gray-500 mb-4">{leagueName}</div>

        <div className="flex items-center gap-6 mb-6">
          <div className="text-center">
            <span className="text-5xl font-bold text-celtic-blue">{position.position}</span>
            <span className="text-gray-500 text-lg">
              {position.position === 1 ? 'st' : position.position === 2 ? 'nd' : position.position === 3 ? 'rd' : 'th'}
            </span>
          </div>
          <div className="flex-1">
            <div className="grid grid-cols-4 gap-2 text-center">
              <div>
                <p className="text-2xl font-bold text-celtic-dark">{position.played}</p>
                <p className="text-xs text-gray-500">Played</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{position.won}</p>
                <p className="text-xs text-gray-500">Won</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">{position.drawn}</p>
                <p className="text-xs text-gray-500">Drawn</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{position.lost}</p>
                <p className="text-xs text-gray-500">Lost</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center bg-celtic-blue text-white p-4 rounded-lg">
          <span className="font-semibold">Points</span>
          <span className="text-3xl font-bold">{position.points}</span>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          Goal Difference: <span className={position.gd >= 0 ? 'text-green-600' : 'text-red-600'}>
            {position.gd > 0 ? '+' : ''}{position.gd}
          </span>
        </div>

        <Link
          href="/fixtures"
          className="block mt-4 text-celtic-blue font-semibold hover:text-celtic-blue-dark transition-colors text-sm"
        >
          View full table →
        </Link>
      </div>
    </div>
  );
}
