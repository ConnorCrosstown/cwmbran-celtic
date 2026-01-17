import Image from 'next/image';
import { Player, PlayerStats } from '@/types';

interface PlayerCardProps {
  player: Player;
  stats?: PlayerStats;
  onClick?: () => void;
}

export default function PlayerCard({ player, stats, onClick }: PlayerCardProps) {
  const hasPhoto = player.photo && !player.photo.includes('noImageAvailable');

  return (
    <div
      className="card hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      {/* Photo */}
      <div className="relative h-48 bg-gradient-to-br from-celtic-blue to-celtic-blue-dark flex items-center justify-center">
        {hasPhoto ? (
          <Image
            src={player.photo}
            alt={`${player.firstName} ${player.lastName}`}
            fill
            className="object-cover"
          />
        ) : (
          <div className="text-6xl font-bold text-celtic-yellow/30">
            {player.firstName[0]}{player.lastName[0]}
          </div>
        )}
        {/* Squad Number Badge */}
        <div className="absolute top-3 right-3 w-10 h-10 bg-celtic-yellow rounded-full flex items-center justify-center">
          <span className="text-celtic-blue font-bold text-lg">{player.squadNo}</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-celtic-dark">
          {player.firstName} {player.lastName}
        </h3>
        <p className="text-celtic-blue font-medium text-sm mb-3">
          {player.position}
        </p>

        {/* Stats */}
        {stats ? (
          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <div className="bg-gray-50 rounded p-2">
              <p className="font-bold text-celtic-dark">{stats.appearances}</p>
              <p className="text-xs text-gray-500">Apps</p>
            </div>
            <div className="bg-gray-50 rounded p-2">
              <p className="font-bold text-celtic-dark">{stats.goals}</p>
              <p className="text-xs text-gray-500">Goals</p>
            </div>
            <div className="bg-gray-50 rounded p-2">
              <p className="font-bold text-celtic-dark">{stats.assists}</p>
              <p className="text-xs text-gray-500">Assists</p>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded p-2 text-center text-sm">
            <p className="font-bold text-celtic-dark">{player.appearances}</p>
            <p className="text-xs text-gray-500">Appearances</p>
          </div>
        )}
      </div>
    </div>
  );
}
