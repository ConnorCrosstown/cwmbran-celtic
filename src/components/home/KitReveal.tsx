import Image from 'next/image';
import Link from 'next/link';

export default function KitReveal() {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-celtic-yellow via-celtic-yellow to-yellow-300 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Kit Image */}
          <div className="lg:w-1/2 relative">
            <div className="relative aspect-square max-w-md mx-auto">
              <Image
                src="/images/kit-2025-26.jpg"
                alt="Cwmbran Celtic 2025-26 Home Kit"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </div>

          {/* Content */}
          <div className="lg:w-1/2 text-center lg:text-left">
            <span className="inline-block bg-celtic-blue text-white text-xs uppercase tracking-wider px-3 py-1 rounded-full mb-4">
              2025/26 Season
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display uppercase text-celtic-dark mb-4">
              New Home Kit
            </h2>
            <p className="text-celtic-dark/80 text-lg mb-6 max-w-lg mx-auto lg:mx-0">
              Introducing our new home kit for the 2025/26 season. Classic Celtic yellow with blue trim,
              featuring our new shirt sponsor.
            </p>

            {/* Sponsor Badges */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
              <div className="bg-white rounded-lg px-4 py-3 shadow-md">
                <span className="text-xs text-gray-500 block">Kit Supplier</span>
                <span className="text-2xl font-bold text-black tracking-tight">adidas</span>
              </div>
              <div className="bg-white rounded-lg px-4 py-2 shadow-md">
                <span className="text-xs text-gray-500 block">Shirt Sponsor</span>
                <Image
                  src="/images/sponsors/oxo.png"
                  alt="OXO"
                  width={60}
                  height={30}
                  className="object-contain"
                />
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <Link
                href="/shop"
                className="bg-celtic-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-celtic-blue-dark transition-colors inline-flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Shop Now
              </Link>
              <Link
                href="/ban-the-bovril"
                className="bg-white text-celtic-dark px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors border border-celtic-dark/20"
              >
                Why OXO?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
