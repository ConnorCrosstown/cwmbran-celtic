import Link from 'next/link';

interface CelticBondBannerProps {
  variant?: 'full' | 'compact' | 'sidebar';
}

export default function CelticBondBanner({ variant = 'full' }: CelticBondBannerProps) {
  if (variant === 'sidebar') {
    return (
      <div className="bg-gradient-to-br from-celtic-blue to-celtic-blue-dark rounded-lg p-5 text-white">
        <h3 className="font-bold text-lg mb-2">Join Celtic Bond</h3>
        <p className="text-sm text-gray-200 mb-4">
          Support the club and win cash prizes every month!
        </p>
        <div className="text-2xl font-bold text-celtic-yellow mb-4">
          £10/month
        </div>
        <Link
          href="/celtic-bond"
          className="block w-full bg-celtic-yellow text-celtic-dark text-center py-2 px-4 rounded font-bold hover:bg-yellow-400 transition-colors"
        >
          Join Now
        </Link>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="bg-celtic-blue rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-white">
          <span className="text-2xl">🎟️</span>
          <div>
            <span className="font-bold">Celtic Bond</span>
            <span className="hidden sm:inline text-gray-200"> - Support the club & win monthly prizes!</span>
          </div>
        </div>
        <Link
          href="/celtic-bond"
          className="bg-celtic-yellow text-celtic-dark py-2 px-6 rounded font-bold hover:bg-yellow-400 transition-colors whitespace-nowrap"
        >
          Join for £10/month
        </Link>
      </div>
    );
  }

  // Full variant
  return (
    <section className="bg-gradient-to-r from-celtic-blue via-celtic-blue-dark to-celtic-blue py-10 md:py-14">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-4xl mb-4 block">🎟️</span>
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-white">
            Join the Celtic Bond
          </h2>
          <p className="text-lg text-gray-200 mb-6 max-w-2xl mx-auto">
            Support Cwmbran Celtic AFC and be in with a chance to win cash prizes every month.
            Just £10 per month helps the club thrive!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="bg-white/10 backdrop-blur rounded-lg px-6 py-3">
              <span className="text-3xl font-bold text-celtic-yellow">£10</span>
              <span className="text-white">/month</span>
            </div>
            <Link
              href="/celtic-bond"
              className="bg-celtic-yellow text-celtic-dark py-3 px-8 rounded-lg font-bold text-lg hover:bg-yellow-400 transition-colors"
            >
              Join Celtic Bond
            </Link>
          </div>
          <p className="text-sm text-gray-300 mt-4">
            Monthly prize draws with cash prizes up to £100!
          </p>
        </div>
      </div>
    </section>
  );
}
