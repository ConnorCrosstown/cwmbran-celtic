'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Fixture } from '@/types';
import { formatMatchDateLong, getOpponent } from '@/lib/comet';

// Note: Image import kept for club logo fallback display

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
      // Combine date and kick-off time for accurate countdown
      const matchDate = new Date(fixture.date);
      if (fixture.time) {
        const [hours, minutes] = fixture.time.split(':').map(Number);
        matchDate.setHours(hours, minutes, 0, 0);
      }

      const difference = matchDate.getTime() - Date.now();

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

  // Determine which Celtic team is playing based on the team name
  const celticTeamName = fixture ? (isHome ? fixture.homeTeam : fixture.awayTeam) : '';
  const isLadies = celticTeamName.toLowerCase().includes('ladies') || celticTeamName.toLowerCase().includes('women');
  const teamLabel = isLadies ? "Women's Team" : "Men's First Team";
  const leagueName = isLadies ? "Genero Adran South" : "JD Cymru South";

  return (
    <section className="relative min-h-[420px] md:min-h-[500px] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-celtic-blue-dark via-celtic-blue to-celtic-blue-dark" />
        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 py-12 md:py-16">
        {fixture ? (
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            {/* Left Side - Match Info */}
            <div className="max-w-2xl">
              {/* Badge Row */}
              <div className="flex items-center gap-3 mb-6">
                <span className={`${isHome ? 'badge-home' : 'badge-away'} flex items-center gap-2`}>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
                  </span>
                  NEXT {isHome ? 'HOME' : 'AWAY'} MATCH
                </span>
                <span className="badge-league">{teamLabel}</span>
                <span className="badge-league">{leagueName}</span>
              </div>

              {/* Match Title */}
              <div className="mb-8">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display uppercase tracking-wide text-white leading-none mb-2">
                  Cwmbran Celtic
                </h1>
                <div className="flex items-center gap-4 text-white/80">
                  <span className="text-2xl md:text-3xl font-light">vs</span>
                  <span className="text-3xl sm:text-4xl md:text-5xl font-display uppercase tracking-wide text-celtic-yellow">
                    {opponent}
                  </span>
                </div>
              </div>

              {/* Match Details */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-white/90 mb-8">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-celtic-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-medium">{formatMatchDateLong(fixture.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-celtic-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{fixture.time} Kick-off</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-celtic-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-medium">{fixture.venue}</span>
              </div>
            </div>

            {/* Countdown & CTAs */}
            <div className="flex flex-col lg:flex-row lg:items-start gap-6">
              {/* Countdown */}
              {timeLeft && (
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="text-center">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg w-[56px] sm:w-[68px] h-[52px] sm:h-[64px] flex items-center justify-center border border-white/20">
                      <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white font-display">
                        {timeLeft.days}
                      </span>
                    </div>
                    <span className="text-xs sm:text-sm text-white/70 mt-1 block">Days</span>
                  </div>
                  <span className="text-white/50 text-2xl font-light h-[52px] sm:h-[64px] flex items-center">:</span>
                  <div className="text-center">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg w-[56px] sm:w-[68px] h-[52px] sm:h-[64px] flex items-center justify-center border border-white/20">
                      <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white font-display">
                        {timeLeft.hours.toString().padStart(2, '0')}
                      </span>
                    </div>
                    <span className="text-xs sm:text-sm text-white/70 mt-1 block">Hours</span>
                  </div>
                  <span className="text-white/50 text-2xl font-light h-[52px] sm:h-[64px] flex items-center">:</span>
                  <div className="text-center">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg w-[56px] sm:w-[68px] h-[52px] sm:h-[64px] flex items-center justify-center border border-white/20">
                      <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white font-display">
                        {timeLeft.minutes.toString().padStart(2, '0')}
                      </span>
                    </div>
                    <span className="text-xs sm:text-sm text-white/70 mt-1 block">Mins</span>
                  </div>
                  <span className="text-white/50 text-2xl font-light hidden sm:flex h-[52px] sm:h-[64px] items-center">:</span>
                  <div className="text-center hidden sm:block">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg w-[56px] sm:w-[68px] h-[52px] sm:h-[64px] flex items-center justify-center border border-white/20">
                      <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white font-display">
                        {timeLeft.seconds.toString().padStart(2, '0')}
                      </span>
                    </div>
                    <span className="text-xs sm:text-sm text-white/70 mt-1 block">Secs</span>
                  </div>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="flex gap-3 h-[52px] sm:h-[64px]">
                <Link href="/tickets" className="btn-tickets">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                  Get Tickets
                </Link>
                <Link
                  href="/visit"
                  className="px-5 py-3 bg-celtic-yellow text-celtic-dark rounded-lg font-semibold hover:bg-celtic-yellow-light transition-all flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Get Directions
                </Link>
              </div>
            </div>
            </div>

            {/* Right Side - Team Logos */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
              {/* Home Team Logo */}
              <div className="flex flex-col items-center">
                <div className="w-28 h-28 xl:w-36 xl:h-36">
                  <Image
                    src="/images/club-logo.webp"
                    alt="Cwmbran Celtic"
                    width={144}
                    height={144}
                    className="object-contain w-full h-full"
                  />
                </div>
                <span className="mt-3 text-white text-sm font-medium uppercase tracking-wide">Celtic</span>
              </div>

              {/* VS */}
              <div className="flex flex-col items-center">
                <span className="text-4xl xl:text-5xl font-display text-celtic-yellow">V</span>
              </div>

              {/* Away Team Logo */}
              <div className="flex flex-col items-center">
                <div className="w-28 h-28 xl:w-36 xl:h-36 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  {/* Placeholder for opposition logo - shows first letter */}
                  <span className="text-4xl xl:text-5xl font-display text-white/60">
                    {opponent?.charAt(0) || '?'}
                  </span>
                </div>
                <span className="mt-3 text-white text-sm font-medium uppercase tracking-wide">{opponent?.split(' ')[0] || 'TBC'}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl text-center mx-auto">
            {/* Club Crest */}
            <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 relative">
              <Image
                src="/images/club-logo.webp"
                alt="Cwmbran Celtic AFC"
                fill
                className="object-contain drop-shadow-2xl"
              />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display uppercase tracking-wide text-white mb-4">
              Cwmbran Celtic AFC
            </h1>
            <p className="text-xl text-white/80 mb-8">Welcome to the official home of Cwmbran Celtic</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/fixtures" className="btn-primary">
                View Fixtures
              </Link>
              <Link href="/news" className="btn-secondary">
                Latest News
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 dark:from-gray-900 to-transparent" />
    </section>
  );
}
