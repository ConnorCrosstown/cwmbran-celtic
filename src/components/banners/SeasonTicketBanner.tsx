import Link from 'next/link';
import { ticketPricing } from '@/data/mock-data';

interface SeasonTicketBannerProps {
  variant?: 'full' | 'compact' | 'topbar';
}

export default function SeasonTicketBanner({ variant = 'full' }: SeasonTicketBannerProps) {
  const { seasonTickets } = ticketPricing;
  const earlyBirdEnds = seasonTickets.earlyBird.endsFormatted;

  if (variant === 'topbar') {
    return (
      <Link href="/tickets" className="block bg-gradient-to-r from-celtic-blue via-celtic-blue-dark to-celtic-blue text-white overflow-hidden hover:from-celtic-blue-light hover:via-celtic-blue hover:to-celtic-blue-light transition-all cursor-pointer">
        <div className="flex items-center py-2">
          <div className="animate-marquee whitespace-nowrap flex items-center gap-16">
            {[1, 2, 3].map((i) => (
              <span key={i} className="flex items-center gap-4 text-sm text-white">
                <svg className="w-4 h-4 text-celtic-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
                <span>
                  <span className="font-bold text-celtic-yellow">2025/26 SEASON TICKETS</span>
                  {' '}- From just{' '}
                  <span className="font-bold text-celtic-yellow">£{seasonTickets.mens.superEarlyBird.adult}</span>
                </span>
                <span className="text-white/50">|</span>
                <span>
                  <span className="font-bold text-celtic-yellow">EARLY BIRD</span> until {earlyBirdEnds}
                </span>
                <span className="text-white/50">|</span>
                <span>
                  <span className="font-bold text-celtic-yellow">GOLDEN TICKET</span> - All games from{' '}
                  <span className="font-bold text-celtic-yellow">£{seasonTickets.golden.superEarlyBird.adult}</span>
                </span>
                <span className="text-white/50">|</span>
                <span className="font-bold text-celtic-yellow">Buy Now →</span>
              </span>
            ))}
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="bg-gradient-to-r from-celtic-yellow to-yellow-400 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-celtic-dark">
          <div className="w-10 h-10 bg-celtic-blue rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          </div>
          <div>
            <span className="font-display uppercase">Season Tickets</span>
            <span className="hidden sm:inline"> - From just </span>
            <span className="hidden sm:inline font-bold">£{seasonTickets.mens.superEarlyBird.adult}</span>
          </div>
        </div>
        <Link
          href="/tickets"
          className="bg-celtic-blue text-white py-2 px-6 rounded font-bold hover:bg-celtic-blue-dark transition-colors whitespace-nowrap"
        >
          Buy Now
        </Link>
      </div>
    );
  }

  // Full variant
  return (
    <section className="bg-gradient-to-r from-celtic-yellow via-yellow-400 to-celtic-yellow py-12 md:py-16 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%231e3a5f' stroke-width='1' stroke-linecap='round'%3E%3Cg transform='translate(25,25)'%3E%3Cline x1='-7' y1='-7' x2='7' y2='7'/%3E%3Ccircle cx='-8' cy='-8' r='2.5'/%3E%3Cline x1='5' y1='5' x2='5' y2='8'/%3E%3Cline x1='7' y1='7' x2='7' y2='9'/%3E%3Cline x1='7' y1='-7' x2='-7' y2='7'/%3E%3Ccircle cx='8' cy='-8' r='2.5'/%3E%3Cline x1='-5' y1='5' x2='-5' y2='8'/%3E%3Cline x1='-7' y1='7' x2='-7' y2='9'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full mb-4">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-semibold uppercase tracking-wide">Early Bird Ends {earlyBirdEnds}</span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display uppercase text-celtic-dark mb-4">
              2025/26 Season Tickets
            </h2>
            <p className="text-lg text-celtic-blue max-w-2xl mx-auto">
              Secure your place for every home game. Save money, never miss a match, and support your club!
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Men's Season Ticket */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-celtic-blue p-4 text-center">
                <h3 className="text-xl font-bold text-white">Men&apos;s Season Ticket</h3>
                <p className="text-white/80 text-sm">15 home league games</p>
              </div>
              <div className="p-6">
                <div className="text-center mb-4">
                  <span className="text-sm text-gray-500 line-through">£{ticketPricing.calculateSavings.mensPayg.toFixed(2)}</span>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-4xl font-display text-celtic-blue">£{seasonTickets.mens.earlyBird.adult}</span>
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">SAVE 33%</span>
                  </div>
                  <p className="text-sm text-gray-600">Early Bird Price</p>
                </div>
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Concession</span>
                    <span className="font-semibold">£{seasonTickets.mens.earlyBird.concession}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Family (2+2)</span>
                    <span className="font-semibold">£{seasonTickets.mens.earlyBird.family}</span>
                  </div>
                  <div className="flex justify-between text-celtic-yellow-dark">
                    <span>Under 16s</span>
                    <span className="font-bold">FREE</span>
                  </div>
                </div>
                <Link
                  href="/tickets#mens"
                  className="block w-full text-center bg-celtic-blue text-white py-3 rounded-lg font-bold hover:bg-celtic-blue-dark transition-colors"
                >
                  Buy Now
                </Link>
              </div>
            </div>

            {/* Golden Season Ticket - Featured */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden ring-4 ring-celtic-yellow transform md:-translate-y-2">
              <div className="bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 p-4 text-center relative">
                <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  BEST VALUE
                </div>
                <h3 className="text-xl font-bold text-celtic-dark">Golden Season Ticket</h3>
                <p className="text-celtic-dark/80 text-sm">ALL games - Men&apos;s, Women&apos;s & Cups</p>
              </div>
              <div className="p-6">
                <div className="text-center mb-4">
                  <span className="text-sm text-gray-500 line-through">£{ticketPricing.calculateSavings.bothPayg.toFixed(2)}+</span>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-4xl font-display text-celtic-dark">£{seasonTickets.golden.earlyBird.adult}</span>
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">SAVE 35%+</span>
                  </div>
                  <p className="text-sm text-gray-600">Early Bird Price</p>
                </div>
                <ul className="space-y-2 text-sm mb-4">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>All 15 Men&apos;s league games</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>All 8 Women&apos;s league games</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-semibold">ALL cup games included!</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-celtic-yellow flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span>Exclusive Golden badge</span>
                  </li>
                </ul>
                <div className="space-y-2 text-sm mb-4 border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Concession</span>
                    <span className="font-semibold">£{seasonTickets.golden.earlyBird.concession}</span>
                  </div>
                </div>
                <Link
                  href="/tickets#golden"
                  className="block w-full text-center bg-gradient-to-r from-yellow-500 to-yellow-400 text-celtic-dark py-3 rounded-lg font-bold hover:from-yellow-400 hover:to-yellow-300 transition-all"
                >
                  Get Golden Ticket
                </Link>
              </div>
            </div>

            {/* Women's Season Ticket */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-celtic-blue p-4 text-center">
                <h3 className="text-xl font-bold text-white">Women&apos;s Season Ticket</h3>
                <p className="text-white/80 text-sm">8 home league games</p>
              </div>
              <div className="p-6">
                <div className="text-center mb-4">
                  <span className="text-sm text-gray-500 line-through">£{ticketPricing.calculateSavings.womensPayg.toFixed(2)}</span>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-4xl font-display text-celtic-blue">£{seasonTickets.womens.earlyBird.adult}</span>
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">SAVE 14%</span>
                  </div>
                  <p className="text-sm text-gray-600">Early Bird Price</p>
                </div>
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Concession</span>
                    <span className="font-semibold">£{seasonTickets.womens.earlyBird.concession}</span>
                  </div>
                  <div className="flex justify-between text-celtic-yellow-dark">
                    <span>Under 16s</span>
                    <span className="font-bold">FREE</span>
                  </div>
                </div>
                <Link
                  href="/tickets#womens"
                  className="block w-full text-center bg-celtic-blue text-white py-3 rounded-lg font-bold hover:bg-celtic-blue-dark transition-colors"
                >
                  Buy Now
                </Link>
              </div>
            </div>
          </div>

          {/* Gift a Ticket CTA */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-celtic-blue/10 rounded-full flex items-center justify-center">
                <svg className="w-7 h-7 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg text-celtic-dark">Gift a Season Ticket</h3>
                <p className="text-gray-600 text-sm">Give the gift of Celtic! Perfect for birthdays, Christmas, or just because.</p>
              </div>
            </div>
            <Link
              href="/tickets#gift"
              className="bg-celtic-blue text-white py-3 px-6 rounded-lg font-bold hover:bg-celtic-blue-dark transition-colors whitespace-nowrap flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
              Gift a Ticket
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
