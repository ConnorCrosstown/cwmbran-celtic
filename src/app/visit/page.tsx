import { Metadata } from 'next';
import Link from 'next/link';
import { clubInfo } from '@/data/mock-data';
import SectionHeader from '@/components/ui/SectionHeader';

export const metadata: Metadata = {
  title: 'Visit Us',
  description: 'Plan your visit to Cwmbran Celtic AFC. Find directions, admission prices, facilities information and everything you need for match day.',
};

export default function VisitUsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-celtic-blue-dark to-celtic-blue" />
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display uppercase text-white mb-4">
              Visit Us
            </h1>
            <p className="text-xl text-celtic-yellow mb-8">
              Everything you need to know about visiting {clubInfo.ground.name}
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#getting-here" className="btn-secondary">
                Get Directions
              </a>
              <a href="#admission" className="bg-white/10 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors">
                Admission Prices
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Getting Here */}
      <section id="getting-here" className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <SectionHeader title="Getting Here" subtitle="How to find The Park" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Map */}
              <div className="card overflow-hidden">
                <iframe
                  src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2474.5!2d${clubInfo.ground.coordinates.lng}!3d${clubInfo.ground.coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTHCsDM5JzE2LjIiTiAzwrAwMScyNC4yIlc!5e0!3m2!1sen!2suk!4v1234567890`}
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ground location map"
                  className="w-full"
                />
              </div>

              {/* Address & Directions */}
              <div>
                <div className="card p-6 mb-6">
                  <h3 className="font-bold text-lg mb-4">Address</h3>
                  <p className="text-gray-700 mb-4">
                    <strong>{clubInfo.ground.name}</strong><br />
                    {clubInfo.ground.address.street}<br />
                    {clubInfo.ground.address.town}<br />
                    {clubInfo.ground.address.county}<br />
                    <span className="font-semibold">{clubInfo.ground.address.postcode}</span>
                  </p>

                  <div className="flex items-center gap-2 text-celtic-blue font-semibold">
                    <span>what3words:</span>
                    <a
                      href={`https://what3words.com/${clubInfo.ground.what3words.replace('///', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {clubInfo.ground.what3words}
                    </a>
                  </div>
                </div>

                <div className="card p-6">
                  <h3 className="font-bold text-lg mb-4">By Car</h3>
                  <p className="text-gray-700 mb-4">
                    From the <strong>M4 Junction 26</strong>, take the A4051 towards Cwmbran.
                    Continue for approximately 2 miles, then turn right onto Henllys Way.
                    The ground is on your left.
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>Sat Nav:</strong> NP44 3FS
                  </p>
                </div>
              </div>
            </div>

            {/* Public Transport */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="card-static p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-celtic-dark">
                  <svg className="w-5 h-5 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  By Train
                </h3>
                <p className="text-gray-700">
                  The nearest station is <strong>Cwmbran</strong> (approximately 1.5 miles from the ground).
                  From the station, you can take a taxi or walk (25-30 minutes).
                </p>
              </div>
              <div className="card-static p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-celtic-dark">
                  <svg className="w-5 h-5 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  By Bus
                </h3>
                <p className="text-gray-700">
                  Several local bus routes serve the Henllys area. Check with
                  Stagecoach South Wales for current timetables.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Admission */}
      <section id="admission" className="py-16 md:py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <SectionHeader title="Match Day Admission" subtitle="Pay on the day at the turnstile" centered />

            <div className="card p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="text-center p-4 bg-celtic-blue rounded-xl text-white">
                  <p className="text-sm mb-2">Adults</p>
                  <p className="text-4xl font-bold">£{clubInfo.admission.adults}</p>
                </div>
                <div className="text-center p-4 bg-celtic-blue rounded-xl text-white">
                  <p className="text-sm mb-2">Concessions</p>
                  <p className="text-4xl font-bold">£{clubInfo.admission.concessions}</p>
                </div>
                <div className="text-center p-4 bg-celtic-yellow rounded-xl">
                  <p className="text-sm mb-2">Under 16s</p>
                  <p className="text-4xl font-bold">FREE</p>
                </div>
                <div className="text-center p-4 bg-gray-100 rounded-xl">
                  <p className="text-sm mb-2 text-gray-600">Programme</p>
                  <p className="text-4xl font-bold text-celtic-dark">£{clubInfo.admission.programme}</p>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-bold mb-4">Payment Methods</h3>
                <p className="text-gray-700">
                  We accept <strong>cash and card payments</strong> at the turnstiles.
                  Contactless payments are available.
                </p>
              </div>

              <div className="border-t pt-6 mt-6">
                <h3 className="font-bold mb-4">Gates Open</h3>
                <p className="text-gray-700">
                  Gates typically open <strong>1 hour before kick-off</strong>.
                  We recommend arriving early to enjoy our clubhouse facilities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <SectionHeader title="Facilities" subtitle="What to expect at The Park" centered />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card-static p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-celtic-dark">
                  <div className="w-10 h-10 bg-celtic-blue/10/20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  Clubhouse Bar
                </h3>
                <p className="text-gray-700 mb-4">
                  Our licensed clubhouse bar is open on match days and selected evenings.
                  Enjoy a drink before, during, and after the game in a friendly atmosphere.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-celtic-yellow rounded-full" />
                    Wide selection of beers, ales, and spirits
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-celtic-yellow rounded-full" />
                    Soft drinks available
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-celtic-yellow rounded-full" />
                    Big screen for live football
                  </li>
                </ul>
              </div>

              <div className="card-static p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-celtic-dark">
                  <div className="w-10 h-10 bg-celtic-blue/10/20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  Tea Bar
                </h3>
                <p className="text-gray-700 mb-4">
                  Hot and cold refreshments available from our tea bar throughout the match.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-celtic-yellow rounded-full" />
                    Hot drinks (tea, coffee, hot chocolate)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-celtic-yellow rounded-full" />
                    Burgers and hot dogs
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-celtic-yellow rounded-full" />
                    Snacks and confectionery
                  </li>
                </ul>
              </div>

              <div className="card-static p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-celtic-dark">
                  <div className="w-10 h-10 bg-celtic-blue/10/20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  </div>
                  Parking
                </h3>
                <p className="text-gray-700">
                  <strong>Free parking</strong> is available at the ground.
                  There is ample space for all supporters, but we recommend
                  arriving early for popular fixtures.
                </p>
              </div>

              <div className="card-static p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-celtic-dark">
                  <div className="w-10 h-10 bg-celtic-blue/10/20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  Accessibility
                </h3>
                <p className="text-gray-700">
                  We welcome disabled supporters. Please contact the club in advance
                  if you have specific requirements and we will do our best to accommodate you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ground Hoppers */}
      <section className="py-16 md:py-20 bg-celtic-blue text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-display uppercase mb-6">Ground Hoppers Welcome!</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-gray-200 mb-6">
                  Whether you&apos;re ticking off Welsh grounds or just exploring the pyramid,
                  we extend a warm welcome to all visiting ground hoppers.
                  Our friendly club has been part of the Cwmbran community since 1924.
                </p>
                <p className="text-gray-200 mb-6">
                  <strong className="text-celtic-yellow">Club badges</strong> are available for purchase
                  from the clubhouse on match days.
                </p>
                <p className="text-gray-200">
                  Don&apos;t forget to sign our visitors book and enjoy our famous hospitality!
                </p>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-4 text-celtic-yellow">Nearby Grounds</h3>
                <p className="text-gray-200 mb-4">Planning a double header? Here are some nearby options:</p>
                <ul className="space-y-3">
                  <li className="flex justify-between">
                    <span>Croesyceiliog AFC</span>
                    <span className="text-celtic-yellow">~2 miles</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Pontnewydd AFC</span>
                    <span className="text-celtic-yellow">~3 miles</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Pontypool Town</span>
                    <span className="text-celtic-yellow">~5 miles</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Newport City FC</span>
                    <span className="text-celtic-yellow">~8 miles</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 md:py-20 bg-celtic-yellow">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display uppercase text-celtic-dark mb-4">
            Questions About Your Visit?
          </h2>
          <p className="text-celtic-dark/80 mb-6 max-w-xl mx-auto">
            If you have any questions or specific requirements, please don&apos;t hesitate to get in touch.
          </p>
          <Link href="/contact" className="btn-primary">
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}
