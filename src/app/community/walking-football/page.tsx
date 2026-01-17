import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Walking Football',
  description: 'Walking football sessions at Cwmbran Celtic AFC. Fun, social football for over 50s. All abilities welcome.',
};

export default function WalkingFootballPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-celtic-blue text-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <Link
              href="/community"
              className="inline-flex items-center text-gray-300 hover:text-white mb-6 text-sm"
            >
              ← Back to Community
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Walking Football</h1>
            <p className="text-lg text-gray-200">
              Stay active, have fun, and make new friends with our walking football sessions
            </p>
          </div>
        </div>
      </section>

      {/* Session Info */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Details Card */}
              <div className="card p-6">
                <h2 className="text-xl font-bold text-celtic-dark mb-4">Session Details</h2>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">📅</span>
                    <div>
                      <strong className="text-celtic-dark">Days</strong>
                      <p className="text-gray-600">Tuesday & Thursday</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">⏰</span>
                    <div>
                      <strong className="text-celtic-dark">Time</strong>
                      <p className="text-gray-600">10:00am - 11:30am</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">📍</span>
                    <div>
                      <strong className="text-celtic-dark">Location</strong>
                      <p className="text-gray-600">The Park, Henllys Way, Cwmbran</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">💰</span>
                    <div>
                      <strong className="text-celtic-dark">Cost</strong>
                      <p className="text-gray-600">£3 per session (pay as you play)</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* What to Expect */}
              <div className="card p-6">
                <h2 className="text-xl font-bold text-celtic-dark mb-4">What to Expect</h2>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-celtic-blue">✓</span>
                    <span>Friendly, welcoming atmosphere</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-celtic-blue">✓</span>
                    <span>Suitable for all abilities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-celtic-blue">✓</span>
                    <span>Low-impact exercise</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-celtic-blue">✓</span>
                    <span>Social time in the clubhouse after</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-celtic-blue">✓</span>
                    <span>No experience necessary</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-celtic-blue">✓</span>
                    <span>Equipment provided</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* About Section */}
            <div className="prose max-w-none mb-12">
              <h2 className="text-2xl font-bold text-celtic-dark mb-4">About Walking Football</h2>
              <p className="text-gray-600 mb-4">
                Walking football is a slower-paced version of the beautiful game, designed for
                people who want to stay active but prefer a lower-impact form of exercise. The main
                rule is simple - no running allowed!
              </p>
              <p className="text-gray-600 mb-4">
                Our sessions are open to anyone over 50 and are particularly popular with those
                who may have given up football due to age or injury. It&apos;s a fantastic way to get
                back into the game you love while meeting like-minded people.
              </p>
              <p className="text-gray-600">
                Sessions include a gentle warm-up, small-sided games, and finish with refreshments
                in our clubhouse. No booking required - just turn up!
              </p>
            </div>

            {/* FAQ */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-celtic-dark mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <div className="card p-4">
                  <h3 className="font-bold text-celtic-dark mb-2">Do I need to be fit to play?</h3>
                  <p className="text-gray-600">
                    No! Walking football is designed to be accessible to everyone. You can go at
                    your own pace and take breaks whenever you need.
                  </p>
                </div>
                <div className="card p-4">
                  <h3 className="font-bold text-celtic-dark mb-2">What should I wear?</h3>
                  <p className="text-gray-600">
                    Comfortable sports clothing and trainers or astro boots. We play on our 3G
                    artificial pitch, so studded boots are not recommended.
                  </p>
                </div>
                <div className="card p-4">
                  <h3 className="font-bold text-celtic-dark mb-2">Do I need to bring anything?</h3>
                  <p className="text-gray-600">
                    Just yourself and £3 for the session. We provide all the equipment. You might
                    want to bring water, although drinks are available in the clubhouse.
                  </p>
                </div>
                <div className="card p-4">
                  <h3 className="font-bold text-celtic-dark mb-2">Can women play?</h3>
                  <p className="text-gray-600">
                    Our sessions are mixed and everyone is welcome.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-celtic-blue text-white rounded-xl p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to Give It a Try?</h2>
              <p className="text-gray-200 mb-6">
                No booking required - just turn up to any session. For more information,
                contact us and we&apos;ll be happy to answer any questions.
              </p>
              <Link href="/contact" className="btn-secondary">
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
