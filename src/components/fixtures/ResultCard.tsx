import { Result } from '@/types';
import { formatMatchDate, getResultOutcome, getScoreDisplay } from '@/lib/comet';

interface ResultCardProps {
  result: Result;
}

export default function ResultCard({ result }: ResultCardProps) {
  const outcome = getResultOutcome(result);
  const isCwmbranHome = result.homeTeam.includes('Cwmbran');

  const outcomeColors = {
    W: 'bg-green-500',
    D: 'bg-yellow-500',
    L: 'bg-red-500',
  };

  const outcomeBorder = {
    W: 'border-l-green-500',
    D: 'border-l-yellow-500',
    L: 'border-l-red-500',
  };

  return (
    <div className={`card border-l-4 ${outcomeBorder[outcome]}`}>
      {/* Date & Competition Header */}
      <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
        <div>
          <span className="font-semibold text-celtic-dark">{formatMatchDate(result.date)}</span>
        </div>
        <span className="text-sm text-gray-600">{result.competition}</span>
      </div>

      {/* Match Info */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <p className={`font-bold text-lg ${isCwmbranHome ? 'text-celtic-blue' : 'text-gray-700'}`}>
              {result.homeTeam}
            </p>
            {isCwmbranHome && <span className="text-xs text-gray-500">HOME</span>}
          </div>
          <div className="px-6 text-center">
            <div className="text-3xl font-bold text-celtic-dark mb-1">
              {getScoreDisplay(result)}
            </div>
            <span className={`${outcomeColors[outcome]} text-white px-2 py-0.5 rounded text-xs font-bold`}>
              {outcome === 'W' ? 'WIN' : outcome === 'D' ? 'DRAW' : 'LOSS'}
            </span>
          </div>
          <div className="flex-1 text-right">
            <p className={`font-bold text-lg ${!isCwmbranHome ? 'text-celtic-blue' : 'text-gray-700'}`}>
              {result.awayTeam}
            </p>
            {!isCwmbranHome && <span className="text-xs text-gray-500">AWAY</span>}
          </div>
        </div>

        {/* Scorers & Attendance */}
        {(result.scorers || result.attendance > 0) && (
          <div className="pt-4 border-t text-sm">
            {result.scorers && (
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Scorers:</span> {result.scorers}
              </p>
            )}
            {result.attendance > 0 && (
              <p className="text-gray-500">
                <span className="font-semibold">Attendance:</span> {result.attendance.toLocaleString()}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
