import Link from 'next/link';
import { Fixture } from '@/types';
import { formatMatchDate, isHomeGame } from '@/lib/comet';
import AddToCalendar from './AddToCalendar';

interface FixtureCardProps {
  fixture: Fixture;
  showAdmission?: boolean;
}

export default function FixtureCard({ fixture }: FixtureCardProps) {
  const isHome = isHomeGame(fixture);
  const cwmbranTeam = isHome ? fixture.homeTeam : fixture.awayTeam;
  const opponent = isHome ? fixture.awayTeam : fixture.homeTeam;

  return (
    <div className="card p-4">
      {/* Date & Time */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm">
          <span className="font-semibold text-celtic-dark">{formatMatchDate(fixture.date)}</span>
          <span className="text-gray-500 ml-2">{fixture.time}</span>
        </div>
        {isHome ? (
          <span className="badge-home text-xs">HOME</span>
        ) : (
          <span className="badge-away text-xs">AWAY</span>
        )}
      </div>

      {/* Teams */}
      <div className="mb-3">
        <p className="font-bold text-celtic-dark">{cwmbranTeam}</p>
        <p className="text-gray-600">vs {opponent}</p>
      </div>

      {/* Venue */}
      <p className="text-xs text-gray-500 mb-3">{fixture.venue}</p>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {isHome && (
          <Link
            href="/tickets"
            className="flex-1 bg-celtic-yellow text-celtic-dark text-center text-sm font-semibold py-2 px-3 rounded-lg hover:bg-yellow-400 transition-colors flex items-center justify-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            Buy Tickets
          </Link>
        )}
        <AddToCalendar fixture={fixture} />
      </div>
    </div>
  );
}
