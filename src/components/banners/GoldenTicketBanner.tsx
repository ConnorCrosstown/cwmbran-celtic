import Link from 'next/link';
import { ticketPricing } from '@/data/mock-data';

export default function GoldenTicketBanner() {
  const { seasonTickets } = ticketPricing;

  return (
    <Link
      href="/tickets#golden"
      className="block bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 text-celtic-dark overflow-hidden hover:from-yellow-400 hover:via-yellow-300 hover:to-yellow-400 transition-all cursor-pointer"
    >
      <div className="flex items-center py-2">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-16">
          {[1, 2, 3].map((i) => (
            <span key={i} className="flex items-center gap-4 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span>
                <span className="font-bold">GOLDEN SEASON TICKET</span>
                {' '}- The Ultimate Fan Experience
              </span>
              <span className="text-celtic-dark/50">|</span>
              <span>
                <span className="font-bold">ALL</span> Men&apos;s, Women&apos;s & Cup Games
              </span>
              <span className="text-celtic-dark/50">|</span>
              <span>
                From just{' '}
                <span className="font-bold">£{seasonTickets.golden.earlyBird.adult}</span>
              </span>
              <span className="text-celtic-dark/50">|</span>
              <span className="font-bold">Get Your Golden Ticket →</span>
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
