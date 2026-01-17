import { Metadata } from 'next';
import Link from 'next/link';
import { clubInfo } from '@/data/mock-data';

export const metadata: Metadata = {
  title: 'Visit Us',
  description: 'Plan your visit to Cwmbran Celtic AFC. Find directions, admission prices, facilities information and everything you need for match day.',
};

export default function VisitUsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-celtic-blue text-white py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Visit Us</h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Everything you need to know about visiting {clubInfo.ground.name}
          </p>
        </div>
      </section>

      {/* Getting Here */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title">Getting Here</h2>

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
              <div className="card p-6">
                <h3 className="font-bold text-lg mb-4">🚂 By Train</h3>
                <p className="text-gray-700">
                  The nearest station is <strong>Cwmbran</strong> (approximately 1.5 miles from the ground).
                  From the station, you can take a taxi or walk (25-30 minutes).
                </p>
              </div>
              <div className="card p-6">
                <h3 className="font-bold text-lg mb-4">🚌 By Bus</h3>
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
      <section id="admission" className="py-12 md:py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title">Match Day Admission</h2>

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
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title">Facilities</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card p-6">
                <h3 className="font-bold text-lg mb-4">🍺 Clubhouse Bar</h3>
                <p className="text-gray-700 mb-4">
                  Our licensed clubhouse bar is open on match days and selected evenings.
                  Enjoy a drink before, during, and after the game in a friendly atmosphere.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Wide selection of beers, ales, and spirits</li>
                  <li>• Soft drinks available</li>
                  <li>• Big screen for live football</li>
                </ul>
              </div>

              <div className="card p-6">
                <h3 className="font-bold text-lg mb-4">☕ Tea Bar</h3>
                <p className="text-gray-700 mb-4">
                  Hot and cold refreshments available from our tea bar throughout the match.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Hot drinks (tea, coffee, hot chocolate)</li>
                  <li>• Burgers and hot dogs</li>
                  <li>• Snacks and confectionery</li>
                </ul>
              </div>

              <div className="card p-6">
                <h3 className="font-bold text-lg mb-4">🚗 Parking</h3>
                <p className="text-gray-700">
                  <strong>Free parking</strong> is available at the ground.
                  There is ample space for all supporters, but we recommend
                  arriving early for popular fixtures.
                </p>
              </div>

              <div className="card p-6">
                <h3 className="font-bold text-lg mb-4">♿ Accessibility</h3>
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
      <section className="py-12 md:py-16 bg-celtic-blue text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Ground Hoppers Welcome!</h2>

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
      <section className="py-12 md:py-16 bg-celtic-yellow">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-celtic-dark mb-4">
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
