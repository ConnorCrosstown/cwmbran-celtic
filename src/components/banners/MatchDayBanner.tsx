import Link from 'next/link';
import { ticketPricing } from '@/data/mock-data';

export default function MatchDayBanner() {
  const { matchDay } = ticketPricing;

  return (
    <Link
      href="/tickets#matchday"
      className="block bg-gradient-to-r from-green-600 via-green-500 to-green-600 text-white overflow-hidden hover:from-green-500 hover:via-green-400 hover:to-green-500 transition-all cursor-pointer"
    >
      <div className="flex items-center py-2">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-16">
          {[1, 2, 3].map((i) => (
            <span key={i} className="flex items-center gap-4 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              <span>
                <span className="font-bold">MATCH DAY TICKETS</span>
                {' '}- Adults{' '}
                <span className="font-bold">£{matchDay.mens.adult.toFixed(2)}</span>
              </span>
              <span className="text-white/70">|</span>
              <span>
                Concessions{' '}
                <span className="font-bold">£{matchDay.mens.concession.toFixed(2)}</span>
              </span>
              <span className="text-white/70">|</span>
              <span>
                Under 16s{' '}
                <span className="font-bold text-yellow-300">FREE</span>
              </span>
              <span className="text-white/70">|</span>
              <span className="font-bold">Buy Online & Skip the Queue →</span>
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
