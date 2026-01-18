'use client';

import Link from 'next/link';
import { Result } from '@/types';
import { getOpponentFromResult, getResultOutcome, isHomeResult } from '@/lib/comet';

interface MatchStatusBannerProps {
  latestResult: Result | null;
  isLive?: boolean;
  liveScore?: { home: number; away: number; minute: number };
}

export default function MatchStatusBanner({ latestResult, isLive = false, liveScore }: MatchStatusBannerProps) {
  // If there's a live game
  if (isLive && liveScore) {
    return (
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-4">
              <span className="badge-live flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                LIVE
              </span>
              <div className="flex items-center gap-3">
                <span className="font-display text-lg uppercase">Cwmbran Celtic</span>
                <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded">
                  <span className="text-2xl font-display">{liveScore.home}</span>
                  <span className="text-white/70">-</span>
                  <span className="text-2xl font-display">{liveScore.away}</span>
                </div>
                <span className="font-display text-lg uppercase">{latestResult ? getOpponentFromResult(latestResult) : 'Opposition'}</span>
              </div>
              <span className="text-sm text-white/80">{liveScore.minute}&apos;</span>
            </div>
            <Link
              href="/fixtures"
              className="text-sm font-semibold hover:underline flex items-center gap-1"
            >
              Follow Live
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If there's a recent result (within last 24 hours - we'll simulate this)
  if (latestResult) {
    const outcome = getResultOutcome(latestResult);
    const isWin = outcome === 'W';
    const isDraw = outcome === 'D';
    const isHome = isHomeResult(latestResult);

    const bgColor = isWin ? 'from-celtic-yellow to-yellow-500' : isDraw ? 'from-amber-500 to-amber-600' : 'from-red-500 to-red-600';
    const resultText = isWin ? 'WIN' : isDraw ? 'DRAW' : 'LOSS';

    const celticScore = isHome ? latestResult.homeScore : latestResult.awayScore;
    const oppScore = isHome ? latestResult.awayScore : latestResult.homeScore;

    return (
      <div className={`bg-gradient-to-r ${bgColor} text-white`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-2.5">
            <div className="flex items-center gap-4">
              <span className="bg-celtic-dark text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wide">
                FT
              </span>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-sm sm:text-base">Cwmbran Celtic</span>
                <div className="flex items-center gap-2 bg-celtic-dark px-3 py-1 rounded">
                  <span className="text-xl sm:text-2xl font-display">{celticScore}</span>
                  <span className="text-white/70">-</span>
                  <span className="text-xl sm:text-2xl font-display">{oppScore}</span>
                </div>
                <span className="font-semibold text-sm sm:text-base">{getOpponentFromResult(latestResult)}</span>
              </div>
              <span className="hidden sm:inline-block text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded bg-celtic-dark">
                {resultText}
              </span>
            </div>
            <Link
              href={`/news`}
              className="text-sm font-semibold hover:underline flex items-center gap-1"
            >
              <span className="hidden sm:inline">Match Report</span>
              <span className="sm:hidden">Report</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
