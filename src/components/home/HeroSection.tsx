'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Fixture } from '@/types';
import { formatMatchDateLong, getOpponent } from '@/lib/comet';
import { oppositionTeams } from '@/data/opposition-data';
import { getAwayDayByTeamName } from '@/data/away-days';
import MatchWeather from '@/components/weather/MatchWeather';

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

  // Look up opponent badge from opposition data or away-days data
  const opponentData = opponent ? oppositionTeams.find(team =>
    team.name.toLowerCase() === opponent.toLowerCase()
  ) : null;

  // Also check away-days data for badge
  const awayDayData = opponent ? getAwayDayByTeamName(opponent) : null;
  const opponentBadge = opponentData?.badge || awayDayData?.badge;

  // Determine which Celtic team is playing based on the team name
  const celticTeamName = fixture ? (isHome ? fixture.homeTeam : fixture.awayTeam) : '';
  const isLadies = celticTeamName.toLowerCase().includes('ladies') || celticTeamName.toLowerCase().includes('women');
  const teamLabel = isLadies ? "Women's Team" : "Men's First Team";
  const leagueName = isLadies ? "Genero Adran South" : "JD Cymru South";

  return (
    <section className="relative min-h-[420px] md:min-h-[500px] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        {/* Ground Image Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('/images/ground-hero.jpg')` }}
        />
        {/* Dark Blue Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-celtic-blue-dark/90 via-celtic-blue/85 to-celtic-blue-dark/90" />
        {/* Crossed Keys Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.08]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='1' stroke-linecap='round'%3E%3Cg transform='translate(25,25)'%3E%3Cline x1='-7' y1='-7' x2='7' y2='7'/%3E%3Ccircle cx='-8' cy='-8' r='2.5'/%3E%3Cline x1='5' y1='5' x2='5' y2='8'/%3E%3Cline x1='7' y1='7' x2='7' y2='9'/%3E%3Cline x1='7' y1='-7' x2='-7' y2='7'/%3E%3Ccircle cx='8' cy='-8' r='2.5'/%3E%3Cline x1='-5' y1='5' x2='-5' y2='8'/%3E%3Cline x1='-7' y1='7' x2='-7' y2='9'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 py-12 md:py-16">
        {fixture ? (
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            {/* Left Side - Match Info */}
            <div className="max-w-2xl">
              {/* Badge Row - Wrap on mobile */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <span className={`${isHome ? 'badge-home' : 'badge-away'} flex items-center gap-1.5 sm:gap-2`}>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
                  </span>
                  <span className="hidden xs:inline">NEXT</span> {isHome ? 'HOME' : 'AWAY'}
                </span>
                <span className="badge-league hidden sm:inline-block">{teamLabel}</span>
                <span className="badge-league">{leagueName}</span>
              </div>

              {/* Match Title */}
              <div className="mb-6 sm:mb-8">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display uppercase tracking-wide text-white leading-none mb-2">
                  Cwmbran Celtic
                </h1>
                <div className="flex items-center gap-2 sm:gap-4 text-white">
                  <span className="text-xl sm:text-2xl md:text-3xl font-light">vs</span>
                  <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display uppercase tracking-wide text-celtic-yellow break-words">
                    {opponent}
                  </span>
                </div>
              </div>

              {/* Match Details */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-white mb-8">
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
              {/* Weather for home matches */}
              {isHome && (
                <MatchWeather matchDate={fixture.date} matchTime={fixture.time} compact />
              )}
            </div>

            {/* Countdown & CTAs */}
            <div className="flex flex-col gap-4 sm:gap-6">
              {/* Countdown */}
              {timeLeft && (
                <div className="flex items-start gap-1.5 sm:gap-2 md:gap-3">
                  <div className="text-center">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg w-[48px] sm:w-[56px] md:w-[68px] h-[44px] sm:h-[52px] md:h-[64px] flex items-center justify-center border border-white/20">
                      <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white font-display">
                        {timeLeft.days}
                      </span>
                    </div>
                    <span className="text-[10px] sm:text-xs md:text-sm text-gray-300 mt-1 block">Days</span>
                  </div>
                  <span className="text-white/50 text-xl sm:text-2xl font-light h-[44px] sm:h-[52px] md:h-[64px] flex items-center">:</span>
                  <div className="text-center">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg w-[48px] sm:w-[56px] md:w-[68px] h-[44px] sm:h-[52px] md:h-[64px] flex items-center justify-center border border-white/20">
                      <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white font-display">
                        {timeLeft.hours.toString().padStart(2, '0')}
                      </span>
                    </div>
                    <span className="text-[10px] sm:text-xs md:text-sm text-gray-300 mt-1 block">Hrs</span>
                  </div>
                  <span className="text-white/50 text-xl sm:text-2xl font-light h-[44px] sm:h-[52px] md:h-[64px] flex items-center">:</span>
                  <div className="text-center">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg w-[48px] sm:w-[56px] md:w-[68px] h-[44px] sm:h-[52px] md:h-[64px] flex items-center justify-center border border-white/20">
                      <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white font-display">
                        {timeLeft.minutes.toString().padStart(2, '0')}
                      </span>
                    </div>
                    <span className="text-[10px] sm:text-xs md:text-sm text-gray-300 mt-1 block">Mins</span>
                  </div>
                  <span className="text-white/50 text-xl sm:text-2xl font-light hidden sm:flex h-[44px] sm:h-[52px] md:h-[64px] items-center">:</span>
                  <div className="text-center hidden sm:block">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg w-[48px] sm:w-[56px] md:w-[68px] h-[44px] sm:h-[52px] md:h-[64px] flex items-center justify-center border border-white/20">
                      <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white font-display">
                        {timeLeft.seconds.toString().padStart(2, '0')}
                      </span>
                    </div>
                    <span className="text-[10px] sm:text-xs md:text-sm text-gray-300 mt-1 block">Secs</span>
                  </div>
                </div>
              )}

              {/* CTA Buttons - Stack on mobile, row on larger */}
              <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
                <Link href="/tickets" className="btn-tickets text-sm sm:text-base">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                  Get Tickets
                </Link>
                <Link
                  href="/visit"
                  className="px-4 sm:px-5 py-2.5 sm:py-3 bg-celtic-yellow text-celtic-dark rounded-lg font-semibold hover:bg-celtic-yellow-light transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <div className="w-32 h-32 xl:w-40 xl:h-40">
                <Image
                  src="/images/club-logo.webp"
                  alt="Cwmbran Celtic"
                  width={160}
                  height={160}
                  className="object-contain w-full h-full"
                />
              </div>

              {/* VS */}
              <span className="text-4xl xl:text-5xl font-display text-celtic-yellow">V</span>

              {/* Away Team Logo */}
              <div className="w-32 h-32 xl:w-40 xl:h-40 flex items-center justify-center">
                {opponentBadge ? (
                  <Image
                    src={opponentBadge}
                    alt={opponent || 'Opposition'}
                    width={160}
                    height={160}
                    className="object-contain w-full h-full drop-shadow-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <span className="text-4xl xl:text-5xl font-display text-white/60">
                      {opponent?.charAt(0) || '?'}
                    </span>
                  </div>
                )}
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
            <p className="text-xl text-celtic-yellow mb-8">Welcome to the official home of Cwmbran Celtic</p>
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
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
