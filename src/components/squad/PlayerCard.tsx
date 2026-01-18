import { Player, PlayerStats } from '@/types';
import Image from 'next/image';

interface PlayerCardProps {
  player: Player;
  stats?: PlayerStats;
  onClick?: () => void;
}

export default function PlayerCard({ player, stats, onClick }: PlayerCardProps) {
  // Check if player has a photo path that's not a placeholder
  const hasPhoto = player.photo && !player.photo.includes('placeholder');

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 hover:border-celtic-blue/30 hover:shadow-md transition-all cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      {/* Player Photo */}
      <div className="relative aspect-[4/5] bg-gradient-to-br from-celtic-blue to-celtic-blue-dark">
        {hasPhoto ? (
          <Image
            src={player.photo}
            alt={`${player.firstName} ${player.lastName}`}
            fill
            className="object-cover object-top"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
              <span className="text-3xl font-display text-celtic-yellow">
                {player.squadNo}
              </span>
            </div>
          </div>
        )}
        {/* Squad number badge */}
        <div className="absolute top-2 left-2 w-7 h-7 bg-celtic-yellow rounded-full flex items-center justify-center shadow-md">
          <span className="text-celtic-dark font-bold text-xs">{player.squadNo}</span>
        </div>
      </div>

      {/* Player Info */}
      <div className="p-2.5">
        <p className="font-semibold text-xs text-celtic-dark truncate leading-tight">
          {player.firstName} {player.lastName}
        </p>
        <p className="text-[10px] text-gray-500 truncate mb-1.5">
          {player.position}
        </p>

        {/* Stats */}
        {stats && (stats.goals > 0 || stats.assists > 0) && (
          <div className="flex gap-3 text-[10px] border-t border-gray-100 pt-1.5">
            <div className="flex items-center gap-1">
              <span className="font-bold text-celtic-blue">{stats.goals}</span>
              <span className="text-gray-400">G</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-celtic-blue">{stats.assists}</span>
              <span className="text-gray-400">A</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
