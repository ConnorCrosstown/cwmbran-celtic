import Image from 'next/image';
import Link from 'next/link';

interface PlayerOfTheMatchProps {
  player: {
    name: string;
    position: string;
    photo: string;
    squadNo: number;
  };
  match: {
    opponent: string;
    score: string;
    date: string;
    competition: string;
  };
  stats?: {
    goals?: number;
    assists?: number;
    saves?: number;
    cleanSheet?: boolean;
  };
  sponsor?: {
    name: string;
    logo: string;
  };
}

export default function PlayerOfTheMatch({ player, match, stats, sponsor }: PlayerOfTheMatchProps) {
  return (
    <div className="card overflow-hidden">
      <div className="bg-gradient-to-r from-celtic-blue to-celtic-blue-dark p-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-celtic-yellow text-xs uppercase tracking-wider font-semibold">
              Player of the Match
            </span>
            <p className="text-white/80 text-sm mt-1">
              vs {match.opponent} ({match.score})
            </p>
          </div>
          {sponsor && (
            <div className="flex items-center gap-2">
              <span className="text-white/60 text-xs">Sponsored by</span>
              <div className="relative h-6 w-16 bg-white rounded px-1">
                <Image
                  src={sponsor.logo}
                  alt={sponsor.name}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        <div className="flex gap-6">
          {/* Player Photo */}
          <div className="relative w-24 h-32 flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-b from-celtic-blue/20 to-transparent rounded-lg overflow-hidden">
              <Image
                src={player.photo}
                alt={player.name}
                fill
                className="object-cover object-top"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-celtic-yellow rounded-full flex items-center justify-center text-celtic-dark font-bold text-lg shadow-lg">
              {player.squadNo}
            </div>
          </div>

          {/* Player Info */}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-celtic-dark">{player.name}</h3>
            <p className="text-gray-500 text-sm mb-4">{player.position}</p>

            {stats && (
              <div className="flex gap-4">
                {stats.goals !== undefined && stats.goals > 0 && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-celtic-blue">{stats.goals}</div>
                    <div className="text-xs text-gray-500">Goals</div>
                  </div>
                )}
                {stats.assists !== undefined && stats.assists > 0 && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-celtic-blue">{stats.assists}</div>
                    <div className="text-xs text-gray-500">Assists</div>
                  </div>
                )}
                {stats.saves !== undefined && stats.saves > 0 && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-celtic-blue">{stats.saves}</div>
                    <div className="text-xs text-gray-500">Saves</div>
                  </div>
                )}
                {stats.cleanSheet && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-celtic-blue">CS</div>
                    <div className="text-xs text-gray-500">Clean Sheet</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-t px-6 py-3 bg-gray-50 flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {match.date} | {match.competition}
        </span>
        <Link href="/fixtures" className="text-celtic-blue text-sm font-semibold hover:underline">
          View Match
        </Link>
      </div>
    </div>
  );
}
