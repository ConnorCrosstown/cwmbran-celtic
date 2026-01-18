import Link from 'next/link';

interface CelticBondBannerProps {
  variant?: 'full' | 'compact' | 'sidebar' | 'topbar';
}

// Mock jackpot data - in production this would come from an API
const jackpotData = {
  currentJackpot: 175,
  nextDraw: '25th January 2025',
  lastWinner: 'D. Williams',
  lastPrize: 100,
  totalMembers: 87,
};

export default function CelticBondBanner({ variant = 'full' }: CelticBondBannerProps) {
  if (variant === 'topbar') {
    return (
      <Link href="/celtic-bond" className="block bg-celtic-blue-dark text-white overflow-hidden hover:bg-celtic-blue-dark/90 transition-colors cursor-pointer">
        <div className="flex items-center py-2">
          {/* Scrolling content */}
          <div className="animate-marquee whitespace-nowrap flex items-center gap-16">
            {[1, 2, 3].map((i) => (
              <span key={i} className="flex items-center gap-4 text-sm">
                <span className="text-celtic-yellow">★</span>
                <span>
                  <span className="font-bold text-celtic-yellow">CELTIC BOND</span>
                  {' '}- Win up to{' '}
                  <span className="font-bold text-celtic-yellow">£{jackpotData.currentJackpot}</span>
                  {' '}this month!
                </span>
                <span className="text-celtic-yellow">★</span>
                <span>
                  Next draw:{' '}
                  <span className="font-bold">{jackpotData.nextDraw}</span>
                </span>
                <span className="text-celtic-yellow">★</span>
                <span>
                  Only{' '}
                  <span className="font-bold text-celtic-yellow">£10/month</span>
                  {' '}to enter
                </span>
                <span className="text-celtic-yellow">★</span>
                <span className="font-bold text-celtic-yellow">Click to Join →</span>
              </span>
            ))}
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'sidebar') {
    return (
      <div className="bg-gradient-to-br from-celtic-blue to-celtic-blue-dark rounded-lg p-5 text-white">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-celtic-yellow rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-celtic-dark" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <h3 className="font-display text-lg uppercase">Celtic Bond</h3>
        </div>
        <p className="text-sm text-gray-200 mb-4">
          Support the club and win cash prizes every month!
        </p>
        <div className="bg-white/10 rounded-lg p-3 mb-4">
          <p className="text-xs text-gray-300 uppercase tracking-wide">This Month&apos;s Jackpot</p>
          <p className="text-3xl font-display text-celtic-yellow">£{jackpotData.currentJackpot}</p>
        </div>
        <Link
          href="/celtic-bond"
          className="block w-full bg-celtic-yellow text-celtic-dark text-center py-2 px-4 rounded font-bold hover:bg-yellow-400 transition-colors"
        >
          Join for £10/month
        </Link>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="bg-celtic-blue rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-white">
          <div className="w-10 h-10 bg-celtic-yellow rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-celtic-dark" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <div>
            <span className="font-display uppercase">Celtic Bond</span>
            <span className="hidden sm:inline text-gray-200"> - Jackpot: </span>
            <span className="hidden sm:inline text-celtic-yellow font-bold">£{jackpotData.currentJackpot}</span>
          </div>
        </div>
        <Link
          href="/celtic-bond"
          className="bg-celtic-yellow text-celtic-dark py-2 px-6 rounded font-bold hover:bg-yellow-400 transition-colors whitespace-nowrap"
        >
          Join Now
        </Link>
      </div>
    );
  }

  // Full variant - enhanced with jackpot display
  return (
    <section className="bg-gradient-to-r from-celtic-blue via-celtic-blue-dark to-celtic-blue py-12 md:py-16 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left side - Info */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-4">
                <div className="w-6 h-6 bg-celtic-yellow rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-celtic-dark" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <span className="text-white text-sm font-semibold uppercase tracking-wide">Support Your Club</span>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display uppercase text-white mb-4">
                Celtic Bond
              </h2>
              <p className="text-lg text-white/80 mb-6 max-w-md mx-auto lg:mx-0">
                Join our monthly prize draw and help fund first team improvements,
                youth development, and ground facilities.
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-6">
                <Link
                  href="/celtic-bond"
                  className="bg-celtic-yellow text-celtic-dark py-3 px-8 rounded-lg font-bold text-lg hover:bg-yellow-400 transition-colors"
                >
                  Join for £10/month
                </Link>
                <Link
                  href="/celtic-bond/results"
                  className="bg-white/10 text-white py-3 px-6 rounded-lg font-semibold hover:bg-white/20 transition-colors"
                >
                  View Results
                </Link>
              </div>

              <p className="text-white/60 text-sm">
                {jackpotData.totalMembers} members and growing
              </p>
            </div>

            {/* Right side - Jackpot Display */}
            <div className="flex justify-center lg:justify-end">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 max-w-sm w-full">
                {/* Jackpot amount */}
                <div className="text-center mb-6">
                  <p className="text-white/80 text-sm uppercase tracking-wide mb-2">This Month&apos;s Jackpot</p>
                  <div className="bg-celtic-yellow rounded-xl py-4 px-6">
                    <span className="text-5xl md:text-6xl font-display text-celtic-dark">£{jackpotData.currentJackpot}</span>
                  </div>
                </div>

                {/* Prize breakdown */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <p className="text-xs text-white/60 mb-1">1st Prize</p>
                    <p className="text-lg font-bold text-white">£100</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <p className="text-xs text-white/60 mb-1">2nd Prize</p>
                    <p className="text-lg font-bold text-white">£50</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <p className="text-xs text-white/60 mb-1">3rd Prize</p>
                    <p className="text-lg font-bold text-white">£25</p>
                  </div>
                </div>

                {/* Next draw */}
                <div className="border-t border-white/20 pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Next Draw</span>
                    <span className="text-white font-semibold">{jackpotData.nextDraw}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-white/60">Last Winner</span>
                    <span className="text-celtic-yellow font-semibold">{jackpotData.lastWinner} (£{jackpotData.lastPrize})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
