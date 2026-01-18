import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import CelticBondBanner from '@/components/banners/CelticBondBanner';
import OxoStrip from '@/components/banners/OxoStrip';
import GiftTicketBanner from '@/components/banners/GiftTicketBanner';
import { ticketPricing } from '@/data/mock-data';

export const metadata: Metadata = {
  title: 'Tickets',
  description: 'Buy tickets for Cwmbran Celtic AFC home matches. Season tickets, match day tickets, Golden Tickets, and Gift a Ticket options available.',
};

export default function TicketsPage() {
  const { matchDay, seasonTickets, giftATicket, calculateSavings } = ticketPricing;

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-celtic-blue via-celtic-blue to-celtic-blue-dark py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 border-4 border-white rounded-full" />
          <div className="absolute bottom-10 right-10 w-60 h-60 border-4 border-white rounded-full" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-semibold uppercase tracking-wide">Early Bird Ends {seasonTickets.earlyBird.endsFormatted}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display uppercase mb-4 text-white">Tickets</h1>
          <p className="text-lg max-w-2xl mx-auto text-white/80">
            Get your tickets for Cwmbran Celtic home matches at the Avondale Motor Park Arena
          </p>
        </div>
      </section>

      {/* Gift a Ticket Banner */}
      <GiftTicketBanner />

      {/* Quick Links */}
      <section className="py-6 bg-gray-100 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#matchday" className="px-4 py-2 bg-white rounded-full text-sm font-semibold hover:bg-celtic-blue hover:text-white transition-colors">
              Match Day Tickets
            </a>
            <a href="#mens" className="px-4 py-2 bg-white rounded-full text-sm font-semibold hover:bg-celtic-blue hover:text-white transition-colors">
              Men&apos;s Season Tickets
            </a>
            <a href="#womens" className="px-4 py-2 bg-white rounded-full text-sm font-semibold hover:bg-celtic-blue hover:text-white transition-colors">
              Women&apos;s Season Tickets
            </a>
            <a href="#golden" className="px-4 py-2 bg-celtic-yellow rounded-full text-sm font-semibold hover:bg-yellow-400 transition-colors">
              Golden Ticket
            </a>
            <a href="#gift" className="px-4 py-2 bg-celtic-blue/10 text-celtic-blue rounded-full text-sm font-semibold hover:bg-celtic-blue/20 transition-colors">
              Gift a Ticket
            </a>
          </div>
        </div>
      </section>

      {/* Match Day Tickets */}
      <section id="matchday" className="py-12 md:py-16 scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display uppercase text-celtic-dark text-center mb-2">Match Day Tickets</h2>
            <p className="text-center text-gray-600 mb-8">Pay at the gate or buy online via Gigantic</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Men's Match Day */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-celtic-blue p-4">
                  <h3 className="text-xl font-bold text-white text-center">Men&apos;s First Team</h3>
                  <p className="text-white/70 text-sm text-center">JD Cymru South</p>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-celtic-blue">£{matchDay.mens.adult.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">Adult</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-celtic-blue">£{matchDay.mens.concession.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">Concession</p>
                    </div>
                    <div className="text-center bg-celtic-yellow/20 rounded-lg py-2">
                      <p className="text-3xl font-bold text-celtic-dark">FREE</p>
                      <p className="text-sm text-celtic-dark/70">Under 16s</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 text-center mb-4">{matchDay.mens.homeGames} home league games per season</p>
                  <a
                    href="https://www.gigantic.com/cwmbran-celtic-tickets"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-celtic-blue text-white py-3 rounded-lg font-semibold hover:bg-celtic-blue-dark transition-colors"
                  >
                    Buy Online
                  </a>
                </div>
              </div>

              {/* Women's Match Day */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-celtic-blue p-4">
                  <h3 className="text-xl font-bold text-white text-center">Women&apos;s Team</h3>
                  <p className="text-white/70 text-sm text-center">Genero Adran South</p>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-celtic-blue">£{matchDay.womens.adult.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">Adult</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-celtic-blue">£{matchDay.womens.concession.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">Concession</p>
                    </div>
                    <div className="text-center bg-celtic-yellow/20 rounded-lg py-2">
                      <p className="text-3xl font-bold text-celtic-dark">FREE</p>
                      <p className="text-sm text-celtic-dark/70">Under 16s</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 text-center mb-4">{matchDay.womens.homeGames} home league games per season</p>
                  <a
                    href="https://www.gigantic.com/cwmbran-celtic-tickets"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-celtic-blue text-white py-3 rounded-lg font-semibold hover:bg-celtic-blue-dark transition-colors"
                  >
                    Buy Online
                  </a>
                </div>
              </div>
            </div>

            <p className="text-center text-gray-500 text-sm">
              Tickets also available on the gate on match days. Cash and card accepted.
            </p>
          </div>
        </div>
      </section>

      {/* Golden Season Ticket - Featured */}
      <section id="golden" className="py-12 md:py-16 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <span className="inline-block bg-celtic-dark text-celtic-yellow px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide mb-4">
                Ultimate Fan Experience
              </span>
              <h2 className="text-3xl md:text-4xl font-display uppercase text-celtic-dark mb-4">Golden Season Ticket</h2>
              <p className="text-celtic-dark/80 max-w-2xl mx-auto">
                One ticket. Every game. Men&apos;s, Women&apos;s, and ALL cup matches included. The ultimate way to support Cwmbran Celtic.
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Benefits */}
                <div className="p-8 lg:p-10">
                  <h3 className="font-bold text-xl mb-6 text-celtic-dark">What&apos;s Included</h3>
                  <ul className="space-y-4">
                    {seasonTickets.golden.includes.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 p-4 bg-celtic-yellow/20 rounded-xl">
                    <p className="text-sm text-celtic-dark">
                      <strong>Value:</strong> If you attended every Men&apos;s and Women&apos;s league game, you&apos;d pay <span className="line-through">£{calculateSavings.bothPayg.toFixed(2)}</span> - and that doesn&apos;t include cup games!
                    </p>
                  </div>
                </div>

                {/* Pricing */}
                <div className="bg-gradient-to-br from-celtic-dark to-slate-800 p-8 lg:p-10 text-white">
                  <h3 className="font-bold text-xl mb-6">Golden Ticket Pricing</h3>

                  <div className="space-y-4">
                    {/* Super Early Bird */}
                    <div className="bg-white/10 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-celtic-yellow font-semibold">Super Early Bird</span>
                        <span className="text-xs bg-red-500 px-2 py-1 rounded">First 50 only!</span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <div>
                          <span className="text-3xl font-display">£{seasonTickets.golden.superEarlyBird.adult}</span>
                          <span className="text-white/60 text-sm ml-2">Adult</span>
                        </div>
                        <div>
                          <span className="text-xl font-display">£{seasonTickets.golden.superEarlyBird.concession}</span>
                          <span className="text-white/60 text-sm ml-2">Conc.</span>
                        </div>
                      </div>
                    </div>

                    {/* Early Bird */}
                    <div className="bg-white/10 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-celtic-yellow font-semibold">Early Bird</span>
                        <span className="text-xs text-white/60">Until {seasonTickets.earlyBird.endsFormatted}</span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <div>
                          <span className="text-3xl font-display">£{seasonTickets.golden.earlyBird.adult}</span>
                          <span className="text-white/60 text-sm ml-2">Adult</span>
                        </div>
                        <div>
                          <span className="text-xl font-display">£{seasonTickets.golden.earlyBird.concession}</span>
                          <span className="text-white/60 text-sm ml-2">Conc.</span>
                        </div>
                      </div>
                    </div>

                    {/* Standard */}
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white/80 font-semibold">Standard</span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <div>
                          <span className="text-2xl font-display text-white/80">£{seasonTickets.golden.standard.adult}</span>
                          <span className="text-white/40 text-sm ml-2">Adult</span>
                        </div>
                        <div>
                          <span className="text-xl font-display text-white/80">£{seasonTickets.golden.standard.concession}</span>
                          <span className="text-white/40 text-sm ml-2">Conc.</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <a
                    href="https://www.gigantic.com/cwmbran-celtic-golden-ticket"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 block w-full text-center bg-celtic-yellow text-celtic-dark py-4 rounded-xl font-bold text-lg hover:bg-yellow-300 transition-colors"
                  >
                    Get Your Golden Ticket
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Men's Season Tickets */}
      <section id="mens" className="py-12 md:py-16 scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display uppercase text-celtic-dark text-center mb-2">Men&apos;s Season Tickets</h2>
            <p className="text-center text-gray-600 mb-8">All {matchDay.mens.homeGames} home JD Cymru South league games</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Super Early Bird */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-red-500">
                <div className="bg-red-500 text-white p-3 text-center">
                  <span className="text-sm font-bold uppercase">Super Early Bird - First 50!</span>
                </div>
                <div className="p-6">
                  <div className="text-center mb-4">
                    <span className="text-sm text-gray-500 line-through">£{calculateSavings.mensPayg.toFixed(2)}</span>
                    <p className="text-4xl font-display text-celtic-blue">£{seasonTickets.mens.superEarlyBird.adult}</p>
                    <p className="text-sm text-gray-600">Adult</p>
                  </div>
                  <div className="text-center mb-4 pb-4 border-b">
                    <p className="text-2xl font-display text-celtic-blue">£{seasonTickets.mens.superEarlyBird.concession}</p>
                    <p className="text-sm text-gray-600">Concession</p>
                  </div>
                  <div className="bg-green-100 text-green-700 text-center py-2 rounded-lg mb-4">
                    <span className="font-bold">SAVE 42%</span>
                  </div>
                  <a
                    href="https://www.gigantic.com/cwmbran-celtic-season-tickets"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                  >
                    Buy Now
                  </a>
                </div>
              </div>

              {/* Early Bird */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-celtic-blue">
                <div className="bg-celtic-blue text-white p-3 text-center">
                  <span className="text-sm font-bold uppercase">Early Bird - Until {seasonTickets.earlyBird.endsFormatted}</span>
                </div>
                <div className="p-6">
                  <div className="text-center mb-4">
                    <span className="text-sm text-gray-500 line-through">£{calculateSavings.mensPayg.toFixed(2)}</span>
                    <p className="text-4xl font-display text-celtic-blue">£{seasonTickets.mens.earlyBird.adult}</p>
                    <p className="text-sm text-gray-600">Adult</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center mb-4 pb-4 border-b">
                    <div>
                      <p className="text-xl font-display text-celtic-blue">£{seasonTickets.mens.earlyBird.concession}</p>
                      <p className="text-xs text-gray-600">Concession</p>
                    </div>
                    <div>
                      <p className="text-xl font-display text-celtic-blue">£{seasonTickets.mens.earlyBird.family}</p>
                      <p className="text-xs text-gray-600">Family</p>
                    </div>
                  </div>
                  <div className="bg-green-100 text-green-700 text-center py-2 rounded-lg mb-4">
                    <span className="font-bold">SAVE 33%</span>
                  </div>
                  <a
                    href="https://www.gigantic.com/cwmbran-celtic-season-tickets"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-celtic-blue text-white py-3 rounded-lg font-semibold hover:bg-celtic-blue-dark transition-colors"
                  >
                    Buy Now
                  </a>
                </div>
              </div>

              {/* Standard */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-200">
                <div className="bg-gray-200 text-gray-700 p-3 text-center">
                  <span className="text-sm font-bold uppercase">Standard Price</span>
                </div>
                <div className="p-6">
                  <div className="text-center mb-4">
                    <span className="text-sm text-gray-500 line-through">£{calculateSavings.mensPayg.toFixed(2)}</span>
                    <p className="text-4xl font-display text-celtic-blue">£{seasonTickets.mens.standard.adult}</p>
                    <p className="text-sm text-gray-600">Adult</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center mb-4 pb-4 border-b">
                    <div>
                      <p className="text-xl font-display text-celtic-blue">£{seasonTickets.mens.standard.concession}</p>
                      <p className="text-xs text-gray-600">Concession</p>
                    </div>
                    <div>
                      <p className="text-xl font-display text-celtic-blue">£{seasonTickets.mens.standard.family}</p>
                      <p className="text-xs text-gray-600">Family</p>
                    </div>
                  </div>
                  <div className="bg-green-100 text-green-700 text-center py-2 rounded-lg mb-4">
                    <span className="font-bold">SAVE 24%</span>
                  </div>
                  <a
                    href="https://www.gigantic.com/cwmbran-celtic-season-tickets"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                  >
                    Buy Now
                  </a>
                </div>
              </div>
            </div>

            <p className="text-center text-sm text-gray-500 mt-6">
              <strong>Under 16s go FREE</strong> with a paying adult at all home league games
            </p>
          </div>
        </div>
      </section>

      {/* Women's Season Tickets */}
      <section id="womens" className="py-12 md:py-16 bg-gray-100 scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display uppercase text-celtic-dark text-center mb-2">Women&apos;s Season Tickets</h2>
            <p className="text-center text-gray-600 mb-8">All {matchDay.womens.homeGames} home Genero Adran South league games</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {/* Super Early Bird */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-red-500">
                <div className="bg-red-500 text-white p-3 text-center">
                  <span className="text-sm font-bold uppercase">Super Early Bird</span>
                </div>
                <div className="p-6">
                  <div className="text-center mb-4">
                    <p className="text-4xl font-display text-celtic-blue">£{seasonTickets.womens.superEarlyBird.adult}</p>
                    <p className="text-sm text-gray-600">Adult</p>
                  </div>
                  <div className="text-center mb-4 pb-4 border-b">
                    <p className="text-2xl font-display text-celtic-blue">£{seasonTickets.womens.superEarlyBird.concession}</p>
                    <p className="text-sm text-gray-600">Concession</p>
                  </div>
                  <a
                    href="https://www.gigantic.com/cwmbran-celtic-season-tickets"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                  >
                    Buy Now
                  </a>
                </div>
              </div>

              {/* Early Bird */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-celtic-blue">
                <div className="bg-celtic-blue text-white p-3 text-center">
                  <span className="text-sm font-bold uppercase">Early Bird</span>
                </div>
                <div className="p-6">
                  <div className="text-center mb-4">
                    <p className="text-4xl font-display text-celtic-blue">£{seasonTickets.womens.earlyBird.adult}</p>
                    <p className="text-sm text-gray-600">Adult</p>
                  </div>
                  <div className="text-center mb-4 pb-4 border-b">
                    <p className="text-2xl font-display text-celtic-blue">£{seasonTickets.womens.earlyBird.concession}</p>
                    <p className="text-sm text-gray-600">Concession</p>
                  </div>
                  <a
                    href="https://www.gigantic.com/cwmbran-celtic-season-tickets"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-celtic-blue text-white py-3 rounded-lg font-semibold hover:bg-celtic-blue-dark transition-colors"
                  >
                    Buy Now
                  </a>
                </div>
              </div>

              {/* Standard */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-200">
                <div className="bg-gray-200 text-gray-700 p-3 text-center">
                  <span className="text-sm font-bold uppercase">Standard</span>
                </div>
                <div className="p-6">
                  <div className="text-center mb-4">
                    <p className="text-4xl font-display text-celtic-blue">£{seasonTickets.womens.standard.adult}</p>
                    <p className="text-sm text-gray-600">Adult</p>
                  </div>
                  <div className="text-center mb-4 pb-4 border-b">
                    <p className="text-2xl font-display text-celtic-blue">£{seasonTickets.womens.standard.concession}</p>
                    <p className="text-sm text-gray-600">Concession</p>
                  </div>
                  <a
                    href="https://www.gigantic.com/cwmbran-celtic-season-tickets"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                  >
                    Buy Now
                  </a>
                </div>
              </div>
            </div>

            <p className="text-center text-sm text-gray-500 mt-6">
              <strong>Under 16s go FREE</strong> with a paying adult at all home league games
            </p>
          </div>
        </div>
      </section>

      {/* Gift a Ticket */}
      <section id="gift" className="py-12 md:py-16 bg-gradient-to-br from-celtic-blue via-celtic-blue to-celtic-blue-dark scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="text-white">
                <div className="inline-flex items-center gap-2 bg-celtic-yellow text-celtic-dark px-4 py-2 rounded-full mb-4">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                  <span className="font-semibold">Give the Gift of Celtic</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-display uppercase mb-4 text-white">Gift a Season Ticket</h2>
                <p className="text-white mb-6">
                  Know someone who loves the Celts? Give them the ultimate gift - a season ticket!
                  Perfect for birthdays, Christmas, Father&apos;s Day, or just to say thank you.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-celtic-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-white">Choose any season ticket type</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-celtic-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-white">Digital gift card sent instantly</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-celtic-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-white">Recipient redeems when ready</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-xl">
                <h3 className="font-bold text-lg text-celtic-dark mb-4">Optional Gift Pack (+£{giftATicket.extraForGiftPack})</h3>
                <p className="text-gray-600 text-sm mb-4">Add a physical gift pack to make it extra special:</p>
                <ul className="space-y-2 mb-6">
                  {giftATicket.giftPackIncludes.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <span className="text-celtic-blue">✓</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="https://www.gigantic.com/cwmbran-celtic-gift-ticket"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-celtic-yellow text-celtic-dark py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors"
                >
                  Gift a Ticket Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Season Ticket Benefits */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display uppercase text-celtic-dark text-center mb-8">Season Ticket Benefits</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-celtic-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold mb-2">Save Money</h3>
                <p className="text-sm text-gray-600">Up to 42% off vs pay-as-you-go match tickets</p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-celtic-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-bold mb-2">Digital Pass</h3>
                <p className="text-sm text-gray-600">Apple & Google Wallet compatible for easy entry</p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-celtic-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                </div>
                <h3 className="font-bold mb-2">Priority Access</h3>
                <p className="text-sm text-gray-600">First access to cup match tickets</p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-celtic-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <h3 className="font-bold mb-2">10% Discount</h3>
                <p className="text-sm text-gray-600">On food & drink in the clubhouse</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Match Day Info CTA */}
      <section className="py-12 md:py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-display uppercase text-celtic-dark mb-4">Planning Your Visit?</h2>
            <p className="text-gray-600 mb-6">
              Find directions, parking info, facilities, and everything you need for match day.
            </p>
            <Link href="/matchday" className="btn-primary inline-flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Match Day Guide
            </Link>
          </div>
        </div>
      </section>

      {/* Celtic Bond CTA */}
      <CelticBondBanner variant="full" />
    </>
  );
}
