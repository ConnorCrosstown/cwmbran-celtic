import { Player, PlayerStats } from '@/types';

interface PlayerCardProps {
  player: Player;
  stats?: PlayerStats;
  onClick?: () => void;
}

export default function PlayerCard({ player, stats, onClick }: PlayerCardProps) {
  return (
    <div
      className="bg-white rounded border border-gray-200 hover:border-celtic-blue/30 transition-colors cursor-pointer p-2 flex items-center gap-2"
      onClick={onClick}
    >
      {/* Squad Number */}
      <div className="w-7 h-7 bg-celtic-blue rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-celtic-yellow font-bold text-[10px]">{player.squadNo}</span>
      </div>

      {/* Name & Position */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-[11px] text-celtic-dark truncate leading-tight">
          {player.firstName} {player.lastName}
        </p>
        <p className="text-[9px] text-gray-500 truncate">
          {player.position}
        </p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="flex gap-2 text-[9px] text-center flex-shrink-0">
          <div>
            <p className="font-bold text-celtic-dark">{stats.goals}</p>
            <p className="text-gray-400">G</p>
          </div>
          <div>
            <p className="font-bold text-celtic-dark">{stats.assists}</p>
            <p className="text-gray-400">A</p>
          </div>
        </div>
      )}
    </div>
  );
}
