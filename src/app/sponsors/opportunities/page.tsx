import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sponsorship Opportunities',
  description: 'Partner with Cwmbran Celtic AFC - sponsorship packages, advertising rates, and commercial opportunities.',
};

const sponsorshipPackages = [
  {
    name: 'Stadium Partner',
    price: 'POA',
    description: 'The ultimate partnership - stadium naming rights and premium brand exposure',
    features: [
      'Stadium naming rights for the season',
      'Logo on all club communications',
      'Premium pitch side advertising',
      'Hospitality package for all home games',
      'Featured on club website and social media',
      'Match day programme advertising',
      'Player appearance opportunities',
    ],
    highlight: true,
  },
  {
    name: 'Kit Sponsor',
    price: 'POA',
    description: 'Your brand on our match day shirts, seen at every game',
    features: [
      'Front of shirt logo (Men\'s or Women\'s)',
      'Logo on replica shirts sold in shop',
      'Pitch side advertising board',
      'Match day hospitality (4 games)',
      'Social media recognition',
      'Website sponsor listing',
    ],
    highlight: false,
  },
  {
    name: 'Match Day Sponsor',
    price: 'From £100',
    description: 'Sponsor an individual home match and enjoy VIP treatment',
    features: [
      'Hospitality for 4 guests',
      'PA announcements during match',
      'Programme advert and mention',
      'Ball presentation opportunity',
      'Social media post',
      'Complimentary programmes',
    ],
    highlight: false,
  },
];

const advertisingOptions = [
  { name: 'Pitch Side Board (Large)', price: '£300/season', description: '8ft x 3ft board visible throughout matches' },
  { name: 'Pitch Side Board (Standard)', price: '£200/season', description: '6ft x 2ft board at pitchside' },
  { name: 'Programme Full Page', price: '£150/season', description: 'Full page colour advert in all home programmes' },
  { name: 'Programme Half Page', price: '£100/season', description: 'Half page colour advert in all home programmes' },
  { name: 'Programme Quarter Page', price: '£60/season', description: 'Quarter page advert in all home programmes' },
  { name: 'Website Banner', price: '£100/season', description: 'Logo and link on sponsors page' },
  { name: 'Social Media Shoutout', price: '£25/post', description: 'Dedicated social media promotion' },
];

export default function SponsorshipOpportunitiesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-celtic-blue via-celtic-blue-dark to-celtic-blue py-6 md:py-10">
        <div className="container mx-auto px-4 text-center">
          <span className="inline-block bg-celtic-yellow text-celtic-dark px-3 py-1 rounded-full text-xs font-semibold mb-3">
            Partner With Us
          </span>
          <h1 className="text-xl md:text-3xl font-bold mb-2 text-white">
            Sponsorship Opportunities
          </h1>
          <p className="text-sm max-w-2xl mx-auto text-gray-200">
            Join the Cwmbran Celtic family and connect your brand with our passionate community
          </p>
        </div>
      </section>

      {/* Why Sponsor */}
      <section className="py-6 md:py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-lg font-bold text-celtic-dark mb-4 text-center">Why Partner With Cwmbran Celtic?</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <div className="card p-3 text-center">
                <div className="w-10 h-10 bg-celtic-blue/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <svg className="w-5 h-5 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
                <p className="text-xs font-semibold text-celtic-dark">Local Reach</p>
                <p className="text-[10px] text-gray-500">Torfaen & Gwent audience</p>
              </div>
              <div className="card p-3 text-center">
                <div className="w-10 h-10 bg-celtic-blue/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <svg className="w-5 h-5 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                  </svg>
                </div>
                <p className="text-xs font-semibold text-celtic-dark">Digital Exposure</p>
                <p className="text-[10px] text-gray-500">Social media & website</p>
              </div>
              <div className="card p-3 text-center">
                <div className="w-10 h-10 bg-celtic-yellow/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <svg className="w-5 h-5 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
                  </svg>
                </div>
                <p className="text-xs font-semibold text-celtic-dark">100+ Years</p>
                <p className="text-[10px] text-gray-500">Historic community club</p>
              </div>
              <div className="card p-3 text-center">
                <div className="w-10 h-10 bg-celtic-blue/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <svg className="w-5 h-5 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.05 4.575a1.575 1.575 0 10-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 013.15 0v1.5m-3.15 0l.075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 013.15 0V15M6.9 7.575a1.575 1.575 0 10-3.15 0v8.175a6.75 6.75 0 006.75 6.75h2.018a5.25 5.25 0 003.712-1.538l1.732-1.732a5.25 5.25 0 001.538-3.712l.003-2.024a.668.668 0 01.198-.471 1.575 1.575 0 10-2.228-2.228 3.818 3.818 0 00-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0116.35 15" />
                  </svg>
                </div>
                <p className="text-xs font-semibold text-celtic-dark">Networking</p>
                <p className="text-[10px] text-gray-500">Local business community</p>
              </div>
            </div>

            <div className="card p-4">
              <p className="text-sm text-gray-700">
                Cwmbran Celtic AFC offers a unique opportunity to connect with the local community through
                the beautiful game. With over 100 years of history, men&apos;s and women&apos;s teams competing
                in national leagues, and a range of community programmes, your brand can benefit from
                association with one of Wales&apos;s most established grassroots clubs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsorship Packages */}
      <section className="py-6 md:py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-lg font-bold text-celtic-dark mb-4 text-center">Sponsorship Packages</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sponsorshipPackages.map((pkg) => (
                <div
                  key={pkg.name}
                  className={`card overflow-hidden ${pkg.highlight ? 'ring-2 ring-celtic-yellow' : ''}`}
                >
                  {pkg.highlight && (
                    <div className="bg-celtic-yellow text-celtic-dark text-center py-1 text-[10px] font-bold uppercase">
                      Premium Partnership
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-celtic-dark mb-1">{pkg.name}</h3>
                    <p className="text-lg font-bold text-celtic-blue mb-2">{pkg.price}</p>
                    <p className="text-xs text-gray-600 mb-3">{pkg.description}</p>
                    <ul className="space-y-1">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="text-[11px] text-gray-700 flex items-start gap-1">
                          <span className="text-celtic-yellow">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Advertising Options */}
      <section id="advertising" className="py-6 md:py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-lg font-bold text-celtic-dark mb-4 text-center">Advertising Options</h2>

            <div className="card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-celtic-blue text-white">
                    <th className="px-4 py-3 text-left">Option</th>
                    <th className="px-4 py-3 text-left hidden md:table-cell">Description</th>
                    <th className="px-4 py-3 text-right">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {advertisingOptions.map((option, idx) => (
                    <tr key={idx} className={`border-b border-gray-100 ${idx % 2 === 1 ? 'bg-gray-50' : ''}`}>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-celtic-dark">{option.name}</span>
                        <span className="block md:hidden text-[10px] text-gray-500">{option.description}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-600 hidden md:table-cell text-xs">{option.description}</td>
                      <td className="px-4 py-3 text-right font-bold text-celtic-blue">{option.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-[10px] text-gray-500 text-center mt-2">
              * All prices are indicative and may vary. Contact us for current rates and availability.
            </p>
          </div>
        </div>
      </section>

      {/* Enquiry Form */}
      <section className="py-6 md:py-8 bg-celtic-blue">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-lg font-bold text-center mb-4 text-white">
              Sponsorship Enquiry
            </h2>

            <div className="card p-4 md:p-6">
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="company" className="block text-xs font-medium text-gray-700 mb-1">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      required
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-celtic-blue focus:border-celtic-blue outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact" className="block text-xs font-medium text-gray-700 mb-1">
                      Contact Name *
                    </label>
                    <input
                      type="text"
                      id="contact"
                      name="contact"
                      required
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-celtic-blue focus:border-celtic-blue outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-celtic-blue focus:border-celtic-blue outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-xs font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-celtic-blue focus:border-celtic-blue outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="interest" className="block text-xs font-medium text-gray-700 mb-1">
                    I&apos;m interested in... *
                  </label>
                  <select
                    id="interest"
                    name="interest"
                    required
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-celtic-blue focus:border-celtic-blue outline-none"
                  >
                    <option value="">Select an option</option>
                    <option value="stadium">Stadium Partnership</option>
                    <option value="kit">Kit Sponsorship</option>
                    <option value="match">Match Day Sponsorship</option>
                    <option value="pitchside">Pitch Side Advertising</option>
                    <option value="programme">Programme Advertising</option>
                    <option value="other">Other / Multiple Options</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-celtic-blue focus:border-celtic-blue outline-none"
                    placeholder="Tell us about your business and what you're looking for..."
                  ></textarea>
                </div>

                <button type="submit" className="btn-primary w-full text-sm">
                  Submit Enquiry
                </button>
              </form>

              <p className="text-[10px] text-gray-500 text-center mt-3">
                Or email us directly at{' '}
                <a href="mailto:cwmbrancelticfc@gmail.com" className="text-celtic-blue hover:underline">
                  cwmbrancelticfc@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Current Sponsors */}
      <section className="py-6 md:py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-600 mb-3">Join our existing partners</p>
          <Link href="/sponsors" className="text-celtic-blue text-sm font-semibold hover:underline">
            View Our Current Sponsors &rarr;
          </Link>
        </div>
      </section>
    </>
  );
}
