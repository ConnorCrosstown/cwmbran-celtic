import Link from 'next/link';

export default function NewKitBanner() {
  return (
    <Link
      href="/shop"
      className="block bg-gradient-to-r from-celtic-yellow via-yellow-400 to-celtic-yellow text-celtic-dark overflow-hidden hover:from-yellow-400 hover:via-yellow-300 hover:to-yellow-400 transition-all cursor-pointer"
    >
      <div className="flex items-center py-2">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-16">
          {[1, 2, 3].map((i) => (
            <span key={i} className="flex items-center gap-4 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span>
                <span className="font-bold">NEW 2025/26 HOME KIT</span>
                {' '}- Now Available
              </span>
              <span className="text-celtic-dark/50">|</span>
              <span className="flex items-center gap-1">
                Kit Supplier:{' '}
                <span className="font-bold">adidas</span>
              </span>
              <span className="text-celtic-dark/50">|</span>
              <span className="flex items-center gap-1">
                Shirt Sponsor:{' '}
                <span className="font-black" style={{ color: '#C41E3A' }}>OXO</span>
              </span>
              <span className="text-celtic-dark/50">|</span>
              <span className="font-bold">Shop Now →</span>
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
