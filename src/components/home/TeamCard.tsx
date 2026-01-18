import Link from 'next/link';
import Image from 'next/image';
import { Fixture, LeagueTableRow } from '@/types';
import { formatMatchDate, getOpponent, isHomeGame } from '@/lib/comet';

interface TeamCardProps {
  teamName: string;
  teamType: 'mens' | 'ladies';
  league: string;
  position: LeagueTableRow | null;
  nextFixture: Fixture | null;
  href: string;
}

export default function TeamCard({
  teamName,
  teamType,
  league,
  position,
  nextFixture,
  href,
}: TeamCardProps) {
  return (
    <div className="card card-accent-yellow-top card-hover overflow-hidden">
      {/* Header */}
      <div className="card-header-gradient p-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full flex-shrink-0 overflow-hidden">
            <Image
              src="/images/club-logo.webp"
              alt="Cwmbran Celtic"
              width={56}
              height={56}
              className="object-cover w-full h-full"
            />
          </div>
          <div>
            <h3 className="font-display text-xl uppercase tracking-wide text-white">{teamName}</h3>
            <p className="text-sm text-celtic-yellow">{league}</p>
          </div>
        </div>
      </div>

      {/* League Position */}
      {position && (
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <span className="text-4xl font-display text-celtic-blue">{position.position}</span>
                <span className="text-sm text-gray-500">
                  {position.position === 1 ? 'st' : position.position === 2 ? 'nd' : position.position === 3 ? 'rd' : 'th'}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                <p><span className="font-bold text-celtic-dark">{position.points}</span> pts</p>
                <p>{position.played} played</p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="text-center px-3 py-1.5 bg-win/10 rounded">
                <span className="text-sm font-bold text-win">W{position.won}</span>
              </div>
              <div className="text-center px-3 py-1.5 bg-draw/10 rounded">
                <span className="text-sm font-bold text-draw">D{position.drawn}</span>
              </div>
              <div className="text-center px-3 py-1.5 bg-loss/10 rounded">
                <span className="text-sm font-bold text-loss">L{position.lost}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Next Fixture */}
      {nextFixture && (
        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
          <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">Next Home Game</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-celtic-dark">vs {getOpponent(nextFixture)}</p>
              <p className="text-sm text-gray-600">{formatMatchDate(nextFixture.date)} • {nextFixture.time}</p>
            </div>
            {isHomeGame(nextFixture) && (
              <span className="badge-home">HOME</span>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="p-4 flex gap-3">
        <Link
          href={href}
          className="flex-1 text-center py-2.5 bg-celtic-blue rounded-lg font-semibold hover:bg-celtic-blue-dark transition-colors text-sm text-white"
        >
          View Team
        </Link>
        <Link
          href="/fixtures"
          className="flex-1 text-center py-2.5 border-2 border-celtic-blue rounded-lg font-semibold hover:bg-celtic-blue hover:text-white transition-colors text-sm text-celtic-blue"
        >
          Fixtures
        </Link>
      </div>
    </div>
  );
}
