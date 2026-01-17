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

      {/* Add to Calendar */}
      <AddToCalendar fixture={fixture} />
    </div>
  );
}
