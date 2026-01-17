import { Metadata } from 'next';
import Link from 'next/link';
import CelticBondBanner from '@/components/banners/CelticBondBanner';

export const metadata: Metadata = {
  title: 'Tickets',
  description: 'Buy tickets for Cwmbran Celtic AFC home matches. Season tickets, match day tickets, and digital wallet passes available.',
};

export default function TicketsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-celtic-blue py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#ffffff' }}>Tickets</h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: '#e5e7eb' }}>
            Get your tickets for Cwmbran Celtic home matches at the Avondale Motor Park Arena
          </p>
        </div>
      </section>

      {/* Match Day Tickets */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title text-center">Match Day Tickets</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="card p-6 text-center">
                <div className="text-4xl mb-3">🎟️</div>
                <h3 className="font-bold text-lg mb-2">Adults</h3>
                <p className="text-3xl font-bold text-celtic-blue mb-2">£5</p>
                <p className="text-sm text-gray-600">Standard admission</p>
              </div>
              <div className="card p-6 text-center">
                <div className="text-4xl mb-3">👴</div>
                <h3 className="font-bold text-lg mb-2">Concessions</h3>
                <p className="text-3xl font-bold text-celtic-blue mb-2">£3</p>
                <p className="text-sm text-gray-600">OAPs & Students with valid ID</p>
              </div>
              <div className="card p-6 text-center bg-celtic-yellow">
                <div className="text-4xl mb-3">👧</div>
                <h3 className="font-bold text-lg mb-2">Under 16s</h3>
                <p className="text-3xl font-bold text-celtic-dark mb-2">FREE</p>
                <p className="text-sm text-celtic-dark/70">When accompanied by adult</p>
              </div>
            </div>

            <div className="text-center">
              <a
                href="https://www.gigantic.com/cwmbran-celtic-tickets"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2"
              >
                Buy Tickets Online
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <p className="text-sm text-gray-500 mt-3">
                Tickets also available on the gate on match days
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Season Tickets */}
      <section className="py-12 md:py-16 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="section-title text-center">Season Tickets 2026/27</h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Get access to all home league matches with a season ticket. Save money and show your support for the Celts!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Adult Season Ticket */}
              <div className="card p-6 border-2 border-celtic-blue">
                <div className="text-center mb-4">
                  <span className="bg-celtic-blue text-white text-xs font-bold px-3 py-1 rounded-full">
                    ADULT
                  </span>
                </div>
                <div className="text-center mb-6">
                  <p className="text-4xl font-bold text-celtic-blue">£75</p>
                  <p className="text-sm text-gray-500">per season</p>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2 text-sm">
                    <span className="text-celtic-blue">✓</span>
                    <span>All home league matches</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <span className="text-celtic-blue">✓</span>
                    <span>Digital wallet pass</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <span className="text-celtic-blue">✓</span>
                    <span>10% clubhouse discount</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <span className="text-celtic-blue">✓</span>
                    <span>Priority cup match access</span>
                  </li>
                </ul>
                <a
                  href="https://www.gigantic.com/cwmbran-celtic-season-tickets"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-celtic-blue text-white text-center py-3 rounded-lg font-semibold hover:bg-celtic-blue-dark transition-colors"
                >
                  Buy Now
                </a>
              </div>

              {/* Concession Season Ticket */}
              <div className="card p-6 border-2 border-gray-200">
                <div className="text-center mb-4">
                  <span className="bg-gray-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    CONCESSION
                  </span>
                </div>
                <div className="text-center mb-6">
                  <p className="text-4xl font-bold text-celtic-blue">£50</p>
                  <p className="text-sm text-gray-500">per season</p>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2 text-sm">
                    <span className="text-celtic-blue">✓</span>
                    <span>All home league matches</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <span className="text-celtic-blue">✓</span>
                    <span>Digital wallet pass</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <span className="text-celtic-blue">✓</span>
                    <span>10% clubhouse discount</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <span className="text-celtic-blue">✓</span>
                    <span>Priority cup match access</span>
                  </li>
                </ul>
                <a
                  href="https://www.gigantic.com/cwmbran-celtic-season-tickets"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-gray-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                  Buy Now
                </a>
                <p className="text-xs text-gray-500 text-center mt-2">OAPs & Students with valid ID</p>
              </div>

              {/* Family Season Ticket */}
              <div className="card p-6 border-2 border-celtic-yellow bg-celtic-yellow/5">
                <div className="text-center mb-4">
                  <span className="bg-celtic-yellow text-celtic-dark text-xs font-bold px-3 py-1 rounded-full">
                    BEST VALUE
                  </span>
                </div>
                <div className="text-center mb-6">
                  <p className="text-4xl font-bold text-celtic-blue">£150</p>
                  <p className="text-sm text-gray-500">per season</p>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2 text-sm">
                    <span className="text-celtic-blue">✓</span>
                    <span>2 Adults + 2 Under 16s</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <span className="text-celtic-blue">✓</span>
                    <span>All home league matches</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <span className="text-celtic-blue">✓</span>
                    <span>4 digital wallet passes</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <span className="text-celtic-blue">✓</span>
                    <span>10% clubhouse discount</span>
                  </li>
                </ul>
                <a
                  href="https://www.gigantic.com/cwmbran-celtic-season-tickets"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-celtic-yellow text-celtic-dark text-center py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
                >
                  Buy Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Digital Wallet */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="section-title">Digital Wallet Passes</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  All season ticket holders receive a digital pass for Apple Wallet or Google Wallet.
                  Simply show your phone at the turnstile for quick entry - no paper tickets needed!
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-celtic-blue/10 rounded-full flex items-center justify-center text-celtic-blue">✓</span>
                    <span>Works with Apple Wallet & Google Wallet</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-celtic-blue/10 rounded-full flex items-center justify-center text-celtic-blue">✓</span>
                    <span>Quick scan entry at turnstiles</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-celtic-blue/10 rounded-full flex items-center justify-center text-celtic-blue">✓</span>
                    <span>Automatic updates for fixture changes</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-celtic-blue/10 rounded-full flex items-center justify-center text-celtic-blue">✓</span>
                    <span>Never lose your ticket again</span>
                  </li>
                </ul>
              </div>
              <div className="flex justify-center gap-4">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-6 text-center">
                  <div className="text-5xl mb-3">📱</div>
                  <p className="font-semibold">Apple Wallet</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-6 text-center">
                  <div className="text-5xl mb-3">📲</div>
                  <p className="font-semibold">Google Wallet</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Match Day Info */}
      <section className="py-12 md:py-16 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title text-center">Match Day Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card p-6">
                <h3 className="font-bold text-lg mb-4">Getting There</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  <strong>Avondale Motor Park Arena</strong><br />
                  Henllys Way, Cwmbran<br />
                  NP44 3JY
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Free parking available at the ground. The venue is a 10-minute walk from Cwmbran town centre.
                </p>
                <Link href="/visit" className="text-celtic-blue font-semibold hover:underline mt-4 inline-block">
                  Get Directions →
                </Link>
              </div>

              <div className="card p-6">
                <h3 className="font-bold text-lg mb-4">Facilities</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <span>🍺</span>
                    <span>Licensed clubhouse bar</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>☕</span>
                    <span>Tea bar with hot food</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>🚗</span>
                    <span>Free parking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>♿</span>
                    <span>Accessible facilities</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>📋</span>
                    <span>Match day programme</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Celtic Bond CTA */}
      <CelticBondBanner variant="full" />
    </>
  );
}
