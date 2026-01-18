import Link from 'next/link';

export default function GiftTicketBanner() {
  return (
    <Link
      href="/tickets#gift"
      className="block bg-gradient-to-r from-celtic-blue via-celtic-blue-dark to-celtic-blue text-white overflow-hidden hover:from-celtic-blue-light hover:via-celtic-blue hover:to-celtic-blue-light transition-all cursor-pointer"
    >
      <div className="flex items-center py-2">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-16">
          {[1, 2, 3].map((i) => (
            <span key={i} className="flex items-center gap-4 text-sm">
              <svg className="w-4 h-4 text-celtic-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
              <span>
                <span className="font-bold text-celtic-yellow">GIFT A SEASON TICKET</span>
                {' '}- The Perfect Present
              </span>
              <span className="text-white/50">|</span>
              <span>
                Birthdays, Christmas, Father&apos;s Day
              </span>
              <span className="text-white/50">|</span>
              <span>
                Optional <span className="font-bold text-celtic-yellow">Gift Pack</span> available
              </span>
              <span className="text-white/50">|</span>
              <span className="font-bold text-celtic-yellow">Give the Gift of Celtic →</span>
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
