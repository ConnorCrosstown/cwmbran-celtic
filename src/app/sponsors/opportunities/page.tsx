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
                <span className="text-2xl mb-2 block">📍</span>
                <p className="text-xs font-semibold text-celtic-dark">Local Reach</p>
                <p className="text-[10px] text-gray-500">Torfaen & Gwent audience</p>
              </div>
              <div className="card p-3 text-center">
                <span className="text-2xl mb-2 block">📱</span>
                <p className="text-xs font-semibold text-celtic-dark">Digital Exposure</p>
                <p className="text-[10px] text-gray-500">Social media & website</p>
              </div>
              <div className="card p-3 text-center">
                <span className="text-2xl mb-2 block">🏆</span>
                <p className="text-xs font-semibold text-celtic-dark">100+ Years</p>
                <p className="text-[10px] text-gray-500">Historic community club</p>
              </div>
              <div className="card p-3 text-center">
                <span className="text-2xl mb-2 block">🤝</span>
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
