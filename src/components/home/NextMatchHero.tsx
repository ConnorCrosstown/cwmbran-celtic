'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Fixture, Admission } from '@/types';
import { formatMatchDateLong, getOpponent } from '@/lib/comet';

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

  return (
    <>
      {/* Compact Match Hero */}
      <section className="bg-gradient-to-r from-celtic-blue to-celtic-blue-dark text-white py-6 md:py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Match Info */}
            <div className="flex items-center gap-4 md:gap-6">
              <div className="text-center lg:text-left">
                <p className="text-celtic-yellow text-xs uppercase tracking-wide mb-1">Next Home Game</p>
                <p className="font-bold text-lg md:text-xl">
                  Cwmbran Celtic <span className="text-gray-300 font-normal">vs</span> {opponent}
                </p>
                <p className="text-gray-300 text-sm">
                  {formatMatchDateLong(fixture.date)} • {fixture.time} • {fixture.venue}
                </p>
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
