import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { sponsors } from '@/data/mock-data';
import CelticBondBanner from '@/components/banners/CelticBondBanner';

export const metadata: Metadata = {
  title: 'Our Sponsors',
  description: 'Thank you to all our sponsors and partners who support Cwmbran Celtic AFC. Find out about sponsorship opportunities.',
};

export default function SponsorsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-celtic-blue text-white py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Our Sponsors</h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Thank you to all our partners who make Cwmbran Celtic possible
          </p>
        </div>
      </section>

      {/* Main Sponsor */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="section-title">Stadium Partner</h2>

            <a
              href={sponsors.main.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="card p-8 md:p-12 inline-block hover:shadow-lg transition-shadow max-w-md"
            >
              {sponsors.main.logo ? (
                <div className="h-24 md:h-32 flex items-center justify-center mb-4">
                  <img
                    src={sponsors.main.logo}
                    alt={sponsors.main.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              ) : (
                <div className="text-3xl font-bold text-celtic-blue mb-4">
                  {sponsors.main.name}
                </div>
              )}
              <p className="text-gray-600 dark:text-gray-400 font-semibold">{sponsors.main.name}</p>
              <p className="text-sm text-gray-500">Stadium Naming Rights Partner</p>
            </a>

            <p className="mt-8 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We are proud to have {sponsors.main.name} as our main sponsor. Their support
              enables us to maintain our facilities and develop football in the Cwmbran community.
            </p>
          </div>
        </div>
      </section>

      {/* Club Partners */}
      <section className="py-12 md:py-16 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="section-title text-center">Club Partners</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {sponsors.partners.map((sponsor, index) => (
                sponsor.url ? (
                  <a
                    key={index}
                    href={sponsor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card p-6 text-center hover:shadow-lg transition-shadow group"
                  >
                    {sponsor.logo ? (
                      <div className="h-20 flex items-center justify-center mb-3">
                        <img
                          src={sponsor.logo}
                          alt={sponsor.name}
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                        />
                      </div>
                    ) : (
                      <div className="h-20 flex items-center justify-center mb-3">
                        <span className="text-celtic-dark dark:text-white font-semibold group-hover:text-celtic-blue transition-colors">
                          {sponsor.name}
                        </span>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{sponsor.name}</p>
                  </a>
                ) : (
                  <div key={index} className="card p-6 text-center">
                    {sponsor.logo ? (
                      <div className="h-20 flex items-center justify-center mb-3">
                        <img
                          src={sponsor.logo}
                          alt={sponsor.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="h-20 flex items-center justify-center mb-3">
                        <span className="text-celtic-dark dark:text-white font-semibold">
                          {sponsor.name}
                        </span>
                      </div>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{sponsor.name}</p>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Programme & Pitch Advertisers */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="section-title text-center">Programme & Pitch Advertisers</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {sponsors.advertisers.map((sponsor, index) => (
                <div
                  key={index}
                  className="card p-4 text-center"
                >
                  {sponsor.logo ? (
                    <div className="h-16 flex items-center justify-center mb-2">
                      <img
                        src={sponsor.logo}
                        alt={sponsor.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  ) : null}
                  <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                    {sponsor.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sponsorship Opportunities */}
      <section className="py-12 md:py-16 bg-celtic-blue text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              Sponsorship Opportunities
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white/10 rounded-xl p-6 text-center">
                <div className="text-4xl mb-4">👕</div>
                <h3 className="font-bold text-lg mb-2">Kit Sponsorship</h3>
                <p className="text-sm text-gray-300">
                  Have your brand on our match day kit worn by players throughout the season
                </p>
              </div>
              <div className="bg-white/10 rounded-xl p-6 text-center">
                <div className="text-4xl mb-4">📋</div>
                <h3 className="font-bold text-lg mb-2">Match Sponsorship</h3>
                <p className="text-sm text-gray-300">
                  Sponsor an individual match day with hospitality and programme advertising
                </p>
              </div>
              <Link href="/sponsors/boards" className="bg-white/10 rounded-xl p-6 text-center block hover:bg-white/20 transition-colors">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="font-bold text-lg mb-2">Pitch Side Boards</h3>
                <p className="text-sm text-gray-300">
                  Promote your business with advertising boards visible throughout matches
                </p>
                <span className="inline-block mt-2 text-celtic-yellow text-sm font-semibold">View Available →</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/10 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-4 text-celtic-yellow">Why Sponsor Celtic?</h3>
                <ul className="space-y-3 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-celtic-yellow">✓</span>
                    <span>Reach local audiences at every home game</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-celtic-yellow">✓</span>
                    <span>Association with a historic community club</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-celtic-yellow">✓</span>
                    <span>Exposure on social media and club website</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-celtic-yellow">✓</span>
                    <span>Networking opportunities with other local businesses</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-celtic-yellow">✓</span>
                    <span>Support grassroots football in your community</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white/10 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-4 text-celtic-yellow">Advertising Rates</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex justify-between">
                    <span className="text-gray-300">Programme Advert (Full Page)</span>
                    <span className="font-bold">From £150/season</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-300">Programme Advert (Half Page)</span>
                    <span className="font-bold">From £100/season</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-300">Pitch Side Board</span>
                    <span className="font-bold">From £200/season</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-300">Match Sponsorship</span>
                    <span className="font-bold">From £100/match</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-300">Kit Sponsorship</span>
                    <span className="font-bold">POA</span>
                  </li>
                </ul>
                <p className="text-xs text-gray-400 mt-4">
                  * Rates are indicative. Contact us for current pricing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-12 md:py-16 bg-celtic-yellow">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-celtic-dark mb-4">
            Interested in Sponsorship?
          </h2>
          <p className="text-celtic-dark/80 mb-6 max-w-xl mx-auto">
            We&apos;d love to discuss how we can work together. Get in touch to find out
            more about our sponsorship packages.
          </p>
          <Link href="/contact" className="btn-primary">
            Contact Us
          </Link>
        </div>
      </section>

      {/* Celtic Bond */}
      <CelticBondBanner variant="full" />
    </>
  );
}
