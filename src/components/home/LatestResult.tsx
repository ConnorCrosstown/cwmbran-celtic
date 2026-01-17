import Link from 'next/link';
import { Result } from '@/types';
import { formatMatchDate, getResultOutcome, getScoreDisplay } from '@/lib/comet';

interface LatestResultProps {
  result: Result | null;
}

function getTeamBadge(result: Result): { label: string; color: string; textColor: string } {
  const isWomens = result.homeTeam.includes('Ladies') || result.awayTeam.includes('Ladies');
  return isWomens
    ? { label: "WOMEN'S", color: 'bg-celtic-yellow', textColor: 'text-celtic-dark' }
    : { label: "MEN'S", color: 'bg-celtic-blue', textColor: 'text-white' };
}

export default function LatestResult({ result }: LatestResultProps) {
  if (!result) {
    return null;
  }

  const outcome = getResultOutcome(result);
  const outcomeColors = {
    W: 'bg-green-500',
    D: 'bg-yellow-500',
    L: 'bg-red-500',
  };
  const outcomeLabels = {
    W: 'WIN',
    D: 'DRAW',
    L: 'LOSS',
  };

  const isCwmbranHome = result.homeTeam.includes('Cwmbran');
  const teamBadge = getTeamBadge(result);

  return (
    <div className="card">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-celtic-dark">Latest Result</h3>
            <span className={`${teamBadge.color} ${teamBadge.textColor} px-2 py-0.5 rounded text-xs font-bold`}>
              {teamBadge.label}
            </span>
          </div>
          <span className={`${outcomeColors[outcome]} text-white px-3 py-1 rounded-full text-xs font-bold`}>
            {outcomeLabels[outcome]}
          </span>
        </div>

        <div className="text-sm text-gray-500 mb-4">
          {formatMatchDate(result.date)} • {result.competition}
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex-1 text-center">
            <p className={`font-bold ${isCwmbranHome ? 'text-celtic-blue' : 'text-gray-700'}`}>
              {result.homeTeam}
            </p>
            {isCwmbranHome && <span className="text-xs text-gray-500">HOME</span>}
          </div>
          <div className="px-4">
            <span className="text-3xl font-bold text-celtic-dark">
              {getScoreDisplay(result)}
            </span>
          </div>
          <div className="flex-1 text-center">
            <p className={`font-bold ${!isCwmbranHome ? 'text-celtic-blue' : 'text-gray-700'}`}>
              {result.awayTeam}
            </p>
            {!isCwmbranHome && <span className="text-xs text-gray-500">AWAY</span>}
          </div>
        </div>

        {result.scorers && (
          <div className="text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-lg">
            <span className="font-semibold">Scorers:</span> {result.scorers}
          </div>
        )}

        {result.attendance > 0 && (
          <p className="text-sm text-gray-500">
            Attendance: {result.attendance.toLocaleString()}
          </p>
        )}

        <Link
          href="/fixtures"
          className="block mt-4 text-celtic-blue font-semibold hover:text-celtic-blue-dark transition-colors text-sm"
        >
          View all results →
        </Link>
      </div>
    </div>
  );
}
