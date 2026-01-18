import { Metadata } from 'next';
import Link from 'next/link';
import CelticBondBanner from '@/components/banners/CelticBondBanner';

export const metadata: Metadata = {
  title: 'Celtic Card',
  description: 'The Celtic Card - Cwmbran Celtic AFC loyalty and payment card. Load credit, earn rewards, and enjoy exclusive benefits.',
};

const benefits = [
  {
    icon: (
      <svg className="w-8 h-8 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
      </svg>
    ),
    title: 'Cashless Payments',
    description: 'Pay for drinks at the bar, food at the tea bar, and merchandise with a simple tap.',
  },
  {
    icon: (
      <svg className="w-8 h-8 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
      </svg>
    ),
    title: 'Fast Entry',
    description: 'Skip the queue with quick-tap turnstile entry on match days.',
  },
  {
    icon: (
      <svg className="w-8 h-8 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
    title: 'Exclusive Rewards',
    description: 'Earn points on every purchase and unlock exclusive discounts and offers.',
  },
  {
    icon: (
      <svg className="w-8 h-8 text-celtic-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
      </svg>
    ),
    title: 'Prize Draws',
    description: 'Automatic entry into monthly prize draws for Celtic Card holders.',
  },
  {
    icon: (
      <svg className="w-8 h-8 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
      </svg>
    ),
    title: 'Digital Wallet',
    description: 'Add your Celtic Card to Apple Wallet or Google Wallet for convenience.',
  },
  {
    icon: (
      <svg className="w-8 h-8 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
    title: 'Family Accounts',
    description: 'Link family members to a single account for easy top-ups and spending tracking.',
  },
];

const howItWorks = [
  {
    step: 1,
    title: 'Register',
    description: 'Sign up for your Celtic Card online or at the clubhouse. Choose digital or physical card.',
  },
  {
    step: 2,
    title: 'Top Up',
    description: 'Add credit to your card online, via the app, or at the clubhouse bar.',
  },
  {
    step: 3,
    title: 'Tap & Pay',
    description: 'Use your card at the bar, tea bar, shop, or turnstiles. Earn points on every transaction.',
  },
  {
    step: 4,
    title: 'Earn Rewards',
    description: 'Collect points, unlock discounts, and get entered into exclusive prize draws.',
  },
];

export default function CelticCardPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-celtic-blue to-celtic-blue-dark text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block bg-celtic-yellow text-celtic-dark text-sm font-bold px-3 py-1 rounded-full mb-4">
                  Coming Soon
                </span>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Celtic Card</h1>
                <p className="text-xl text-gray-200 mb-6">
                  Your all-in-one card for payments, entry, and rewards at Cwmbran Celtic.
                </p>
                <p className="text-gray-300 mb-8">
                  Load credit, tap to pay at the bar and tea bar, gain quick entry at the turnstiles,
                  and earn exclusive rewards. The smarter way to support the Celts.
                </p>
                <Link
                  href="/contact"
                  className="bg-celtic-yellow text-celtic-dark px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors inline-flex items-center gap-2"
                >
                  Register Your Interest
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
              <div className="flex justify-center">
                {/* Card Visual */}
                <div className="relative">
                  <div className="w-72 h-44 bg-gradient-to-br from-celtic-blue-dark to-black rounded-2xl shadow-2xl p-6 transform rotate-3 hover:rotate-0 transition-transform">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <p className="text-celtic-yellow font-bold text-lg">CELTIC CARD</p>
                        <p className="text-gray-400 text-xs">Member Since 2027</p>
                      </div>
                      <div className="w-10 h-10 bg-celtic-yellow rounded-full flex items-center justify-center">
                        <span className="text-celtic-dark font-bold text-xs">CC</span>
                      </div>
                    </div>
                    <div className="mb-4">
                      <p className="text-gray-400 text-xs">Card Number</p>
                      <p className="text-white font-mono tracking-wider">•••• •••• •••• 1924</p>
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-gray-400 text-xs">Card Holder</p>
                        <p className="text-white font-semibold">J. SUPPORTER</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-400 text-xs">Balance</p>
                        <p className="text-celtic-yellow font-bold">£25.00</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="section-title text-center">Card Benefits</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="card p-6">
                  <div className="w-14 h-14 bg-celtic-blue/10 rounded-xl flex items-center justify-center mb-4">{benefit.icon}</div>
                  <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 md:py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title text-center">How It Works</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {howItWorks.map((step) => (
                <div key={step.step} className="text-center">
                  <div className="w-12 h-12 bg-celtic-blue text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {step.step}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Where To Use */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title text-center">Where To Use Your Card</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card p-6 border-l-4 border-celtic-blue">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-celtic-blue/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Clubhouse Bar</h3>
                    <p className="text-gray-600 text-sm">
                      Pay for drinks with a simple tap. No need for cash or cards - just your Celtic Card.
                    </p>
                  </div>
                </div>
              </div>

              <div className="card p-6 border-l-4 border-celtic-blue">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-celtic-blue/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513c0 1.135.845 2.098 1.976 2.192 1.327.11 2.669.166 4.024.166 1.355 0 2.697-.056 4.024-.166C17.155 15.219 18 14.256 18 13.121v-2.513c0-1.135-.845-2.098-1.976-2.192A48.424 48.424 0 0012 8.25zm-1.5 11.25h3m-1.5-3v3" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Tea Bar</h3>
                    <p className="text-gray-600 text-sm">
                      Grab a hot drink, burger, or pie on match day. Quick and convenient.
                    </p>
                  </div>
                </div>
              </div>

              <div className="card p-6 border-l-4 border-celtic-blue">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-celtic-blue/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Turnstiles</h3>
                    <p className="text-gray-600 text-sm">
                      Tap your card for quick entry to home matches. Linked to your season ticket if applicable.
                    </p>
                  </div>
                </div>
              </div>

              <div className="card p-6 border-l-4 border-celtic-blue">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-celtic-blue/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Club Shop</h3>
                    <p className="text-gray-600 text-sm">
                      Buy merchandise, programmes, and more from the match day shop.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Top Up Options */}
      <section className="py-12 md:py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title text-center">Easy Top Up Options</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card p-6 text-center">
                <div className="w-14 h-14 bg-celtic-blue/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2">Online</h3>
                <p className="text-gray-600 text-sm">
                  Top up anytime via our website. Instant credit to your card.
                </p>
              </div>

              <div className="card p-6 text-center">
                <div className="w-14 h-14 bg-celtic-blue/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2">Mobile App</h3>
                <p className="text-gray-600 text-sm">
                  Manage your card, check balance, and top up via the Celtic Card app.
                </p>
              </div>

              <div className="card p-6 text-center">
                <div className="w-14 h-14 bg-celtic-blue/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2">At The Clubhouse</h3>
                <p className="text-gray-600 text-sm">
                  Top up at the bar with cash or card on match days and events.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title text-center">Card Options</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <div className="card p-8 text-center border-2 border-gray-200">
                <div className="w-16 h-16 bg-celtic-blue/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                  </svg>
                </div>
                <h3 className="font-bold text-xl mb-2">Digital Card</h3>
                <p className="text-3xl font-bold text-celtic-blue mb-2">FREE</p>
                <p className="text-gray-600 text-sm mb-6">
                  Add to Apple Wallet or Google Wallet. Perfect if you always have your phone.
                </p>
                <ul className="text-left space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="text-celtic-blue">✓</span>
                    <span>Instant activation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-celtic-blue">✓</span>
                    <span>Apple & Google Wallet</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-celtic-blue">✓</span>
                    <span>All card benefits</span>
                  </li>
                </ul>
              </div>

              <div className="card p-8 text-center border-2 border-celtic-blue">
                <div className="w-16 h-16 bg-celtic-yellow/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                  </svg>
                </div>
                <h3 className="font-bold text-xl mb-2">Physical Card</h3>
                <p className="text-3xl font-bold text-celtic-blue mb-2">£5</p>
                <p className="text-gray-600 text-sm mb-6">
                  Premium plastic card with NFC chip. Collect at the clubhouse.
                </p>
                <ul className="text-left space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="text-celtic-blue">✓</span>
                    <span>Premium card design</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-celtic-blue">✓</span>
                    <span>NFC tap technology</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-celtic-blue">✓</span>
                    <span>All card benefits</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16 bg-celtic-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Be First to Get Your Celtic Card
          </h2>
          <p className="text-gray-200 mb-8 max-w-xl mx-auto">
            The Celtic Card is launching soon. Register your interest now to be among the first
            to receive your card when it goes live.
          </p>
          <Link
            href="/contact"
            className="bg-celtic-yellow text-celtic-dark px-8 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors inline-flex items-center gap-2"
          >
            Register Your Interest
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Celtic Bond */}
      <CelticBondBanner variant="full" />
    </>
  );
}
