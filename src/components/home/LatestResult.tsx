import Link from 'next/link';
import Image from 'next/image';
import { Result } from '@/types';
import { formatMatchDate, getResultOutcome, getScoreDisplay } from '@/lib/comet';
import { getOppositionByName } from '@/data/opposition-data';

interface LatestResultProps {
  result: Result | null;
}

function getTeamBadgeLabel(result: Result): { label: string; color: string; textColor: string } {
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
  const opponent = isCwmbranHome ? result.awayTeam : result.homeTeam;
  const opponentData = getOppositionByName(opponent);
  const opponentBadge = opponentData?.badge;
  const teamBadgeLabel = getTeamBadgeLabel(result);

  return (
    <div className="card">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-celtic-dark">Latest Result</h3>
            <span className={`${teamBadgeLabel.color} ${teamBadgeLabel.textColor} px-2 py-0.5 rounded text-xs font-bold`}>
              {teamBadgeLabel.label}
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
          {/* Home team with badge */}
          <div className="flex-1 text-center">
            <div className="flex flex-col items-center">
              {isCwmbranHome ? (
                <Image
                  src="/images/club-logo.webp"
                  alt="Cwmbran Celtic"
                  width={48}
                  height={48}
                  className="rounded-full mb-2"
                />
              ) : opponentBadge ? (
                <Image
                  src={opponentBadge}
                  alt={opponent}
                  width={48}
                  height={48}
                  className="rounded-full mb-2 object-contain bg-white"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                  <span className="text-sm font-bold text-gray-500">
                    {result.homeTeam.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </span>
                </div>
              )}
              <p className={`font-bold text-sm ${isCwmbranHome ? 'text-celtic-blue' : 'text-gray-700'}`}>
                {result.homeTeam}
              </p>
              {isCwmbranHome && <span className="text-xs text-gray-500">HOME</span>}
            </div>
          </div>

          <div className="px-4">
            <span className="text-3xl font-bold text-celtic-dark">
              {getScoreDisplay(result)}
            </span>
          </div>

          {/* Away team with badge */}
          <div className="flex-1 text-center">
            <div className="flex flex-col items-center">
              {!isCwmbranHome ? (
                <Image
                  src="/images/club-logo.webp"
                  alt="Cwmbran Celtic"
                  width={48}
                  height={48}
                  className="rounded-full mb-2"
                />
              ) : opponentBadge ? (
                <Image
                  src={opponentBadge}
                  alt={opponent}
                  width={48}
                  height={48}
                  className="rounded-full mb-2 object-contain bg-white"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                  <span className="text-sm font-bold text-gray-500">
                    {result.awayTeam.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </span>
                </div>
              )}
              <p className={`font-bold text-sm ${!isCwmbranHome ? 'text-celtic-blue' : 'text-gray-700'}`}>
                {result.awayTeam}
              </p>
              {!isCwmbranHome && <span className="text-xs text-gray-500">AWAY</span>}
            </div>
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
