'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Fixture, Admission } from '@/types';
import { formatMatchDateLong, getOpponent, isHomeGame } from '@/lib/comet';

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
      <section className="relative bg-celtic-blue text-white py-16 md:py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: 'url(/images/hero/stadium.jpg)' }}
        />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Welcome to Cwmbran Celtic</h1>
          <p className="text-lg text-gray-200">No upcoming home fixtures scheduled</p>
        </div>
      </section>
    );
  }

  const opponent = getOpponent(fixture);

  return (
    <section className="relative bg-gradient-to-br from-celtic-blue to-celtic-blue-dark text-white py-12 md:py-20 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: 'url(/images/hero/stadium.jpg)' }}
      />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center">
          {/* Competition Badge */}
          <span className="inline-block bg-celtic-yellow text-celtic-dark px-4 py-1 rounded-full text-sm font-semibold mb-6">
            {fixture.competition}
          </span>

          {/* Next Home Game Label */}
          <p className="text-celtic-yellow text-lg mb-2">Next Home Game</p>

          {/* Match Details */}
          <h1 className="text-3xl md:text-5xl font-bold mb-2">
            Cwmbran Celtic
          </h1>
          <p className="text-2xl md:text-3xl mb-2">vs</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            {opponent}
          </h2>

          {/* Date and Time */}
          <p className="text-xl md:text-2xl text-gray-200 mb-8">
            {formatMatchDateLong(fixture.date)} • {fixture.time}
          </p>

          {/* Countdown */}
          {timeLeft && (
            <div className="flex justify-center gap-4 md:gap-8 mb-10">
              <div className="text-center">
                <div className="bg-white/10 backdrop-blur rounded-lg p-4 md:p-6 min-w-[70px] md:min-w-[90px]">
                  <span className="text-3xl md:text-5xl font-bold">{timeLeft.days}</span>
                </div>
                <span className="text-sm text-gray-300 mt-2 block">Days</span>
              </div>
              <div className="text-center">
                <div className="bg-white/10 backdrop-blur rounded-lg p-4 md:p-6 min-w-[70px] md:min-w-[90px]">
                  <span className="text-3xl md:text-5xl font-bold">{timeLeft.hours}</span>
                </div>
                <span className="text-sm text-gray-300 mt-2 block">Hours</span>
              </div>
              <div className="text-center">
                <div className="bg-white/10 backdrop-blur rounded-lg p-4 md:p-6 min-w-[70px] md:min-w-[90px]">
                  <span className="text-3xl md:text-5xl font-bold">{timeLeft.minutes}</span>
                </div>
                <span className="text-sm text-gray-300 mt-2 block">Mins</span>
              </div>
              <div className="text-center hidden sm:block">
                <div className="bg-white/10 backdrop-blur rounded-lg p-4 md:p-6 min-w-[70px] md:min-w-[90px]">
                  <span className="text-3xl md:text-5xl font-bold">{timeLeft.seconds}</span>
                </div>
                <span className="text-sm text-gray-300 mt-2 block">Secs</span>
              </div>
            </div>
          )}

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/visit" className="btn-secondary">
              Get Directions
            </Link>
            <Link href="/visit#admission" className="btn-outline border-white text-white hover:bg-white hover:text-celtic-blue">
              Admission: Adults £{admission.adults}
            </Link>
          </div>

          {/* Venue */}
          <p className="mt-8 text-gray-300">
            📍 {fixture.venue}
          </p>
        </div>
      </div>
    </section>
  );
}
