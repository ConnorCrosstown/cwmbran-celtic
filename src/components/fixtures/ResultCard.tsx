import { Result } from '@/types';
import { formatMatchDate, getResultOutcome, getScoreDisplay } from '@/lib/comet';

interface ResultCardProps {
  result: Result;
  compact?: boolean;
}

export default function ResultCard({ result, compact = false }: ResultCardProps) {
  const outcome = getResultOutcome(result);
  const isCwmbranHome = result.homeTeam.includes('Cwmbran');

  const outcomeColors = {
    W: 'bg-green-500',
    D: 'bg-amber-500',
    L: 'bg-red-500',
  };

  const outcomeBorder = {
    W: 'border-l-green-500',
    D: 'border-l-amber-500',
    L: 'border-l-red-500',
  };

  const outcomeText = {
    W: 'Win',
    D: 'Draw',
    L: 'Loss',
  };

  if (compact) {
    return (
      <div className={`card p-3 border-l-4 ${outcomeBorder[outcome]}`}>
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 mb-1">{formatMatchDate(result.date)}</p>
            <p className="font-semibold text-celtic-dark text-sm truncate">
              {isCwmbranHome ? 'vs ' + result.awayTeam : '@ ' + result.homeTeam}
            </p>
          </div>
          <div className="text-right ml-3">
            <p className="font-bold text-lg text-celtic-dark">{getScoreDisplay(result)}</p>
            <span className={`${outcomeColors[outcome]} text-white px-2 py-0.5 rounded text-xs`}>
              {outcomeText[outcome]}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`card p-4 border-l-4 ${outcomeBorder[outcome]}`}>
      {/* Date */}
      <p className="text-sm text-gray-500 mb-2">{formatMatchDate(result.date)}</p>

      {/* Match */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex-1">
          <p className={`font-semibold ${isCwmbranHome ? 'text-celtic-dark' : 'text-gray-600'}`}>
            {result.homeTeam}
          </p>
          <p className={`font-semibold ${!isCwmbranHome ? 'text-celtic-dark' : 'text-gray-600'}`}>
            {result.awayTeam}
          </p>
        </div>
        <div className="text-right">
          <p className="font-bold text-2xl text-celtic-dark">{getScoreDisplay(result)}</p>
          <span className={`${outcomeColors[outcome]} text-white px-2 py-0.5 rounded text-xs`}>
            {outcomeText[outcome]}
          </span>
        </div>
      </div>

      {/* Scorers */}
      {result.scorers && (
        <p className="text-sm text-gray-600 mt-3 pt-3 border-t">
          <span className="font-medium">Scorers:</span> {result.scorers}
        </p>
      )}
    </div>
  );
}
