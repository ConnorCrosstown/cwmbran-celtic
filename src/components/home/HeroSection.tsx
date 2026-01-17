'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Fixture } from '@/types';
import { formatMatchDateLong, getOpponent } from '@/lib/comet';

interface HeroSectionProps {
  fixture: Fixture | null;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function HeroSection({ fixture }: HeroSectionProps) {
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

  const opponent = fixture ? getOpponent(fixture) : null;
  const isHome = fixture?.homeAway === 'H';

  return (
    <section className="relative py-8 md:py-12 overflow-hidden">
      {/* Background with Overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-celtic-blue-dark via-celtic-blue to-celtic-blue" />
        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        {fixture ? (
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Match Info */}
            <div className="flex items-center gap-4 md:gap-6">
              {/* Badge */}
              <div className="hidden md:inline-flex items-center gap-2 bg-celtic-yellow text-celtic-dark px-3 py-1 rounded-full text-xs font-bold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-celtic-dark opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-celtic-dark"></span>
                </span>
                {isHome ? 'HOME' : 'AWAY'}
              </div>
              <div className="text-center lg:text-left">
                <p className="text-white/70 text-xs uppercase tracking-wide mb-1">Next {isHome ? 'Home' : 'Away'} Game</p>
                <p className="font-bold text-lg md:text-xl text-white">
                  Cwmbran Celtic <span className="text-white/70 font-normal">vs</span> {opponent}
                </p>
                <p className="text-white/80 text-sm">
                  {formatMatchDateLong(fixture.date)} • {fixture.time} • {fixture.venue}
                </p>
              </div>
            </div>

            {/* Countdown */}
            {timeLeft && (
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <div className="bg-white/10 rounded px-3 py-2 min-w-[50px]">
                    <span className="text-xl md:text-2xl font-bold text-white">{timeLeft.days}</span>
                  </div>
                  <span className="text-xs text-white/60">Days</span>
                </div>
                <span className="text-white/50">:</span>
                <div className="text-center">
                  <div className="bg-white/10 rounded px-3 py-2 min-w-[50px]">
                    <span className="text-xl md:text-2xl font-bold text-white">{timeLeft.hours.toString().padStart(2, '0')}</span>
                  </div>
                  <span className="text-xs text-white/60">Hrs</span>
                </div>
                <span className="text-white/50">:</span>
                <div className="text-center">
                  <div className="bg-white/10 rounded px-3 py-2 min-w-[50px]">
                    <span className="text-xl md:text-2xl font-bold text-white">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                  </div>
                  <span className="text-xs text-white/60">Min</span>
                </div>
                <span className="text-white/50 hidden sm:block">:</span>
                <div className="text-center hidden sm:block">
                  <div className="bg-white/10 rounded px-3 py-2 min-w-[50px]">
                    <span className="text-xl md:text-2xl font-bold text-white">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                  </div>
                  <span className="text-xs text-white/60">Sec</span>
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex gap-3">
              <Link
                href="/tickets"
                className="bg-red-600 text-white px-5 py-2.5 rounded font-bold text-sm hover:bg-red-700 transition-colors inline-flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
                Get Tickets
              </Link>
              <Link
                href="/visit"
                className="border border-white/50 text-white px-4 py-2.5 rounded font-semibold text-sm hover:bg-white/10 transition-colors"
              >
                Get Directions
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Welcome to Cwmbran Celtic</h1>
            <p className="text-gray-200">No upcoming home fixtures scheduled</p>
          </div>
        )}
      </div>
    </section>
  );
}
