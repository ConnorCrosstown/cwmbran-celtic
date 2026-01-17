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
    <section className="relative min-h-[500px] md:min-h-[600px] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/images/hero-bg.jpg')`,
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-celtic-blue-dark/95 via-celtic-blue/90 to-celtic-blue/80" />
        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl">
          {/* Badge */}
          {fixture && (
            <div className="inline-flex items-center gap-2 bg-celtic-yellow text-celtic-dark px-4 py-2 rounded-full text-sm font-bold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-celtic-dark opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-celtic-dark"></span>
              </span>
              NEXT {isHome ? 'HOME' : 'AWAY'} MATCH
            </div>
          )}

          {fixture ? (
            <>
              {/* Match Info */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 leading-tight">
                <span className="text-celtic-yellow">Cwmbran Celtic</span>
                <br />
                <span className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-300">vs</span>
                <br />
                {opponent}
              </h1>

              {/* Match Details */}
              <div className="flex flex-wrap items-center gap-4 text-white/80 text-lg mb-8">
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formatMatchDateLong(fixture.date)}
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {fixture.time} Kick-off
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {fixture.venue}
                </span>
              </div>

              {/* Countdown */}
              {timeLeft && (
                <div className="mb-8">
                  <p className="text-white/60 text-sm uppercase tracking-wider mb-3">Kick-off in</p>
                  <div className="flex gap-3 md:gap-4">
                    <div className="text-center">
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 md:px-6 md:py-4 border border-white/20">
                        <span className="text-3xl md:text-5xl font-black text-white">{timeLeft.days}</span>
                      </div>
                      <span className="text-xs md:text-sm text-white/60 mt-2 block">Days</span>
                    </div>
                    <div className="text-center">
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 md:px-6 md:py-4 border border-white/20">
                        <span className="text-3xl md:text-5xl font-black text-white">{timeLeft.hours.toString().padStart(2, '0')}</span>
                      </div>
                      <span className="text-xs md:text-sm text-white/60 mt-2 block">Hours</span>
                    </div>
                    <div className="text-center">
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 md:px-6 md:py-4 border border-white/20">
                        <span className="text-3xl md:text-5xl font-black text-white">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                      </div>
                      <span className="text-xs md:text-sm text-white/60 mt-2 block">Mins</span>
                    </div>
                    <div className="text-center hidden sm:block">
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 md:px-6 md:py-4 border border-white/20">
                        <span className="text-3xl md:text-5xl font-black text-white">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                      </div>
                      <span className="text-xs md:text-sm text-white/60 mt-2 block">Secs</span>
                    </div>
                  </div>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/tickets"
                  className="btn-tickets"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                  Get Tickets
                </Link>
                <Link
                  href="/fixtures"
                  className="bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-all border border-white/20"
                >
                  View All Fixtures
                </Link>
              </div>

              {/* Urgency Message */}
              {isHome && (
                <p className="mt-6 text-celtic-yellow text-sm font-medium flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Limited tickets available - Don&apos;t miss out!
                </p>
              )}
            </>
          ) : (
            <>
              {/* No fixture fallback */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
                Welcome to
                <br />
                <span className="text-celtic-yellow">Cwmbran Celtic</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl">
                The home of football in Cwmbran since 1924. Join us at the Avondale Motor Park Arena.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/fixtures" className="btn-primary">
                  View Fixtures
                </Link>
                <Link href="/celtic-bond" className="btn-secondary">
                  Join Celtic Bond
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 dark:from-gray-900 to-transparent" />
    </section>
  );
}
