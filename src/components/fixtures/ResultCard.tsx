import Image from 'next/image';
import { Result } from '@/types';
import { formatMatchDate, getResultOutcome, getScoreDisplay } from '@/lib/comet';
import { getOppositionByName } from '@/data/opposition-data';

interface ResultCardProps {
  result: Result;
  compact?: boolean;
}

export default function ResultCard({ result, compact = false }: ResultCardProps) {
  const outcome = getResultOutcome(result);
  const isCwmbranHome = result.homeTeam.includes('Cwmbran');
  const opponent = isCwmbranHome ? result.awayTeam : result.homeTeam;

  // Get opponent badge
  const opponentData = getOppositionByName(opponent);
  const opponentBadge = opponentData?.badge;

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
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {opponentBadge ? (
              <Image
                src={opponentBadge}
                alt={opponent}
                width={28}
                height={28}
                className="rounded-full object-contain bg-white flex-shrink-0"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] text-gray-500 font-bold">
                  {opponent.split(' ').map(w => w[0]).join('').slice(0, 2)}
                </span>
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs text-gray-500 mb-0.5">{formatMatchDate(result.date)}</p>
              <p className="font-semibold text-celtic-dark text-sm truncate">
                {isCwmbranHome ? 'vs ' + opponent : '@ ' + opponent}
              </p>
            </div>
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

      {/* Match with badges */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3 flex-1">
          {/* Home team badge */}
          <div className="flex-shrink-0">
            {isCwmbranHome ? (
              <Image
                src="/images/club-logo.webp"
                alt="Cwmbran Celtic"
                width={36}
                height={36}
                className="rounded-full"
              />
            ) : opponentBadge ? (
              <Image
                src={opponentBadge}
                alt={opponent}
                width={36}
                height={36}
                className="rounded-full object-contain bg-white"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-xs text-gray-500 font-bold">
                  {result.homeTeam.split(' ').map(w => w[0]).join('').slice(0, 2)}
                </span>
              </div>
            )}
          </div>

          <div className="flex-1">
            <p className={`font-semibold ${isCwmbranHome ? 'text-celtic-dark' : 'text-gray-600'}`}>
              {result.homeTeam}
            </p>
            <p className={`font-semibold ${!isCwmbranHome ? 'text-celtic-dark' : 'text-gray-600'}`}>
              {result.awayTeam}
            </p>
          </div>

          {/* Away team badge */}
          <div className="flex-shrink-0">
            {!isCwmbranHome ? (
              <Image
                src="/images/club-logo.webp"
                alt="Cwmbran Celtic"
                width={36}
                height={36}
                className="rounded-full"
              />
            ) : opponentBadge ? (
              <Image
                src={opponentBadge}
                alt={opponent}
                width={36}
                height={36}
                className="rounded-full object-contain bg-white"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-xs text-gray-500 font-bold">
                  {result.awayTeam.split(' ').map(w => w[0]).join('').slice(0, 2)}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="text-right ml-3">
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
