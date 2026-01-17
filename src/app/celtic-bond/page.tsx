import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Celtic Bond',
  description: 'Join Celtic Bond and support Cwmbran Celtic AFC with a monthly contribution. Win cash prizes in our monthly draw!',
};

export default function CelticBondPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-celtic-blue to-celtic-blue-dark text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <span className="inline-block bg-celtic-yellow text-celtic-dark px-4 py-1 rounded-full text-sm font-semibold mb-6">
            Support Your Club
          </span>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Celtic Bond</h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto mb-8">
            Join our monthly supporter scheme and be in with a chance to win cash prizes
            while helping Cwmbran Celtic AFC thrive.
          </p>
          <a href="#join" className="btn-secondary text-lg">
            Join Celtic Bond
          </a>
        </div>
      </section>

      {/* What is Celtic Bond */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title text-center">What is Celtic Bond?</h2>

            <div className="card p-8 mb-8">
              <p className="text-lg text-gray-700 mb-6">
                Celtic Bond is our monthly prize draw that helps fund the club while giving
                you the chance to win cash prizes. For just <strong>£5 per month</strong>,
                you&apos;ll be entered into every monthly draw and be directly supporting
                Cwmbran Celtic AFC.
              </p>
              <p className="text-gray-700">
                Every penny raised goes directly to the club, helping us maintain our facilities,
                support our teams, and develop football in the Cwmbran community.
              </p>
            </div>

            {/* How it Works */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="card p-6 text-center">
                <div className="w-16 h-16 bg-celtic-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-celtic-blue">1</span>
                </div>
                <h3 className="font-bold text-lg mb-2">Sign Up</h3>
                <p className="text-gray-600 text-sm">
                  Complete the form below and set up your monthly payment
                </p>
              </div>
              <div className="card p-6 text-center">
                <div className="w-16 h-16 bg-celtic-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-celtic-blue">2</span>
                </div>
                <h3 className="font-bold text-lg mb-2">Get Your Number</h3>
                <p className="text-gray-600 text-sm">
                  You&apos;ll receive a unique bond number for the monthly draws
                </p>
              </div>
              <div className="card p-6 text-center">
                <div className="w-16 h-16 bg-celtic-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-celtic-blue">3</span>
                </div>
                <h3 className="font-bold text-lg mb-2">Win Prizes</h3>
                <p className="text-gray-600 text-sm">
                  Be entered into every monthly draw with cash prizes to be won
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prizes */}
      <section className="py-12 md:py-16 bg-celtic-yellow">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-celtic-dark mb-8">Monthly Prizes</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <div className="text-celtic-yellow text-5xl mb-2">🥇</div>
                <p className="text-sm text-gray-500 mb-2">1st Prize</p>
                <p className="text-4xl font-bold text-celtic-blue">£100</p>
              </div>
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <div className="text-gray-400 text-5xl mb-2">🥈</div>
                <p className="text-sm text-gray-500 mb-2">2nd Prize</p>
                <p className="text-4xl font-bold text-celtic-blue">£50</p>
              </div>
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <div className="text-amber-600 text-5xl mb-2">🥉</div>
                <p className="text-sm text-gray-500 mb-2">3rd Prize</p>
                <p className="text-4xl font-bold text-celtic-blue">£25</p>
              </div>
            </div>

            <p className="mt-8 text-celtic-dark/80">
              * Prize amounts may vary. Winners announced on social media after each draw.
            </p>
          </div>
        </div>
      </section>

      {/* Recent Winners */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title text-center">Recent Winners</h2>

            <div className="card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-celtic-blue text-white">
                    <th className="px-4 py-3 text-left">Month</th>
                    <th className="px-4 py-3 text-left">1st Prize</th>
                    <th className="px-4 py-3 text-left">2nd Prize</th>
                    <th className="px-4 py-3 text-left">3rd Prize</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-3 font-medium">January 2026</td>
                    <td className="px-4 py-3">Bond #147</td>
                    <td className="px-4 py-3">Bond #032</td>
                    <td className="px-4 py-3">Bond #089</td>
                  </tr>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <td className="px-4 py-3 font-medium">December 2025</td>
                    <td className="px-4 py-3">Bond #056</td>
                    <td className="px-4 py-3">Bond #112</td>
                    <td className="px-4 py-3">Bond #078</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-3 font-medium">November 2025</td>
                    <td className="px-4 py-3">Bond #023</td>
                    <td className="px-4 py-3">Bond #145</td>
                    <td className="px-4 py-3">Bond #067</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Join Form */}
      <section id="join" className="py-12 md:py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="section-title text-center">Join Celtic Bond</h2>

            <div className="card p-8">
              <div className="text-center mb-8">
                <p className="text-3xl font-bold text-celtic-blue mb-2">£5 / month</p>
                <p className="text-gray-600">Cancel anytime</p>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-celtic-blue focus:border-celtic-blue outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-celtic-blue focus:border-celtic-blue outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-celtic-blue focus:border-celtic-blue outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-celtic-blue focus:border-celtic-blue outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="bonds" className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Bonds
                  </label>
                  <select
                    id="bonds"
                    name="bonds"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-celtic-blue focus:border-celtic-blue outline-none"
                  >
                    <option value="1">1 Bond - £5/month</option>
                    <option value="2">2 Bonds - £10/month</option>
                    <option value="3">3 Bonds - £15/month</option>
                    <option value="5">5 Bonds - £25/month</option>
                  </select>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    name="terms"
                    required
                    className="mt-1"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    I agree to the Celtic Bond terms and conditions and understand that £5 per bond
                    will be collected monthly until I cancel.
                  </label>
                </div>

                <button type="submit" className="btn-primary w-full">
                  Continue to Payment
                </button>
              </form>

              <p className="text-xs text-gray-500 text-center mt-6">
                Payment processed securely. You can cancel your membership at any time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="section-title text-center">Frequently Asked Questions</h2>

            <div className="space-y-4">
              <div className="card p-6">
                <h3 className="font-bold mb-2">When is the draw held?</h3>
                <p className="text-gray-600">
                  The draw is held on the last Saturday of each month. Winners are announced on our social media channels.
                </p>
              </div>
              <div className="card p-6">
                <h3 className="font-bold mb-2">How do I know if I&apos;ve won?</h3>
                <p className="text-gray-600">
                  Winners are contacted directly and announced on our social media. Make sure we have your correct contact details.
                </p>
              </div>
              <div className="card p-6">
                <h3 className="font-bold mb-2">Can I buy multiple bonds?</h3>
                <p className="text-gray-600">
                  Yes! You can purchase as many bonds as you like. Each bond gives you an additional entry into the draw.
                </p>
              </div>
              <div className="card p-6">
                <h3 className="font-bold mb-2">How do I cancel?</h3>
                <p className="text-gray-600">
                  You can cancel your Celtic Bond membership at any time by contacting us at {' '}
                  <a href="mailto:cwmbrancelticfc@gmail.com" className="text-celtic-blue hover:underline">
                    cwmbrancelticfc@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16 bg-celtic-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Questions About Celtic Bond?
          </h2>
          <p className="text-gray-200 mb-6 max-w-xl mx-auto">
            Get in touch and we&apos;ll be happy to help.
          </p>
          <Link href="/contact" className="btn-secondary">
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}
