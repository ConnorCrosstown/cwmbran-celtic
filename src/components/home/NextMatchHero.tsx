'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Fixture, Admission } from '@/types';
import { formatMatchDateLong, getOpponent } from '@/lib/comet';
import { getOppositionByName } from '@/data/opposition-data';

interface NextMatchHeroProps {
  fixture: Fixture | null;
  admission: Admission;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function NextMatchHero({ fixture, admission }: NextMatchHeroProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    if (!fixture) return;

    const calculateTimeLeft = () => {
      const difference = fixture.date - Date.now();

      if (difference <= 0) {
        return null;
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [fixture]);

  if (!fixture) {
    return (
      <section className="bg-celtic-blue text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-3xl font-bold">Welcome to Cwmbran Celtic</h1>
          <p className="text-gray-200 mt-2">No upcoming home fixtures scheduled</p>
        </div>
      </section>
    );
  }

  const opponent = getOpponent(fixture);
  const opponentData = getOppositionByName(opponent);
  const opponentBadge = opponentData?.badge;
  const isWomensGame = fixture.homeTeam.includes('Ladies') || fixture.awayTeam.includes('Ladies') ||
                       fixture.competition.includes('Adran') || fixture.competition.includes('Women');
  const teamLabel = isWomensGame ? "Cwmbran Celtic Women" : "Cwmbran Celtic";

  return (
    <>
      {/* Compact Match Hero */}
      <section className="bg-gradient-to-r from-celtic-blue to-celtic-blue-dark text-white py-6 md:py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Match Info with Badges */}
            <div className="flex items-center gap-4 md:gap-6">
              {/* Cwmbran Celtic Badge */}
              <div className="flex-shrink-0 hidden sm:block">
                <Image
                  src="/images/club-logo.webp"
                  alt="Cwmbran Celtic"
                  width={56}
                  height={56}
                  className="rounded-full border-2 border-celtic-yellow"
                />
              </div>

              <div className="text-center lg:text-left">
                <div className="flex items-center gap-2 justify-center lg:justify-start mb-1">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded ${isWomensGame ? 'bg-pink-500/80' : 'bg-celtic-yellow text-celtic-dark'}`}>
                    {isWomensGame ? "WOMEN'S" : "MEN'S"}
                  </span>
                  <p className="text-celtic-yellow text-xs uppercase tracking-wide">Next Home Game</p>
                </div>
                <p className="font-bold text-lg md:text-xl">
                  {teamLabel} <span className="text-gray-300 font-normal">vs</span> {opponent}
                </p>
                <p className="text-gray-300 text-sm">
                  {formatMatchDateLong(fixture.date)} • {fixture.time} • {fixture.venue}
                </p>
              </div>

              {/* Opponent Badge */}
              <div className="flex-shrink-0 hidden sm:block">
                {opponentBadge ? (
                  <Image
                    src={opponentBadge}
                    alt={opponent}
                    width={56}
                    height={56}
                    className="rounded-full border-2 border-white/30 bg-white object-contain"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center">
                    <span className="text-sm font-bold text-white/80">
                      {opponent.split(' ').map(w => w[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Countdown */}
            {timeLeft && (
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <div className="bg-white/10 rounded px-3 py-2 min-w-[50px]">
                    <span className="text-xl md:text-2xl font-bold">{timeLeft.days}</span>
                  </div>
                  <span className="text-xs text-gray-400">Days</span>
                </div>
                <span className="text-gray-500">:</span>
                <div className="text-center">
                  <div className="bg-white/10 rounded px-3 py-2 min-w-[50px]">
                    <span className="text-xl md:text-2xl font-bold">{timeLeft.hours}</span>
                  </div>
                  <span className="text-xs text-gray-400">Hrs</span>
                </div>
                <span className="text-gray-500">:</span>
                <div className="text-center">
                  <div className="bg-white/10 rounded px-3 py-2 min-w-[50px]">
                    <span className="text-xl md:text-2xl font-bold">{timeLeft.minutes}</span>
                  </div>
                  <span className="text-xs text-gray-400">Min</span>
                </div>
                <span className="text-gray-500 hidden sm:block">:</span>
                <div className="text-center hidden sm:block">
                  <div className="bg-white/10 rounded px-3 py-2 min-w-[50px]">
                    <span className="text-xl md:text-2xl font-bold">{timeLeft.seconds}</span>
                  </div>
                  <span className="text-xs text-gray-400">Sec</span>
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="flex gap-3">
              <Link
                href="/visit"
                className="bg-celtic-yellow text-celtic-dark px-4 py-2 rounded font-semibold text-sm hover:bg-yellow-400 transition-colors"
              >
                Get Directions
              </Link>
              <Link
                href="/fixtures"
                className="border border-white/50 text-white px-4 py-2 rounded font-semibold text-sm hover:bg-white/10 transition-colors"
              >
                All Fixtures
              </Link>
            </div>
          </div>
        </div>
      </section>

    </>
  );
}
