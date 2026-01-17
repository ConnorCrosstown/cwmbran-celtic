import { Metadata } from 'next';
import Link from 'next/link';
import CelticBondBanner from '@/components/banners/CelticBondBanner';

export const metadata: Metadata = {
  title: 'Celtic Card',
  description: 'The Celtic Card - Cwmbran Celtic AFC loyalty and payment card. Load credit, earn rewards, and enjoy exclusive benefits.',
};

const benefits = [
  {
    icon: '💳',
    title: 'Cashless Payments',
    description: 'Pay for drinks at the bar, food at the tea bar, and merchandise with a simple tap.',
  },
  {
    icon: '🎟️',
    title: 'Fast Entry',
    description: 'Skip the queue with quick-tap turnstile entry on match days.',
  },
  {
    icon: '🎁',
    title: 'Exclusive Rewards',
    description: 'Earn points on every purchase and unlock exclusive discounts and offers.',
  },
  {
    icon: '🏆',
    title: 'Prize Draws',
    description: 'Automatic entry into monthly prize draws for Celtic Card holders.',
  },
  {
    icon: '📱',
    title: 'Digital Wallet',
    description: 'Add your Celtic Card to Apple Wallet or Google Wallet for convenience.',
  },
  {
    icon: '👨‍👩‍👧‍👦',
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
                  <div className="text-4xl mb-4">{benefit.icon}</div>
                  <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 md:py-16 bg-gray-100 dark:bg-gray-800">
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
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
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
                  <div className="text-4xl">🍺</div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Clubhouse Bar</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Pay for drinks with a simple tap. No need for cash or cards - just your Celtic Card.
                    </p>
                  </div>
                </div>
              </div>

              <div className="card p-6 border-l-4 border-celtic-blue">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">☕</div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Tea Bar</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Grab a hot drink, burger, or pie on match day. Quick and convenient.
                    </p>
                  </div>
                </div>
              </div>

              <div className="card p-6 border-l-4 border-celtic-blue">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">🎟️</div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Turnstiles</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Tap your card for quick entry to home matches. Linked to your season ticket if applicable.
                    </p>
                  </div>
                </div>
              </div>

              <div className="card p-6 border-l-4 border-celtic-blue">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">🛍️</div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Club Shop</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
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
      <section className="py-12 md:py-16 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title text-center">Easy Top Up Options</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card p-6 text-center">
                <div className="text-4xl mb-4">🌐</div>
                <h3 className="font-bold text-lg mb-2">Online</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Top up anytime via our website. Instant credit to your card.
                </p>
              </div>

              <div className="card p-6 text-center">
                <div className="text-4xl mb-4">📱</div>
                <h3 className="font-bold text-lg mb-2">Mobile App</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Manage your card, check balance, and top up via the Celtic Card app.
                </p>
              </div>

              <div className="card p-6 text-center">
                <div className="text-4xl mb-4">🏠</div>
                <h3 className="font-bold text-lg mb-2">At The Clubhouse</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
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
                <div className="text-5xl mb-4">📱</div>
                <h3 className="font-bold text-xl mb-2">Digital Card</h3>
                <p className="text-3xl font-bold text-celtic-blue mb-2">FREE</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                  Add to Apple Wallet or Google Wallet. Perfect if you always have your phone.
                </p>
                <ul className="text-left space-y-2 text-sm text-gray-600 dark:text-gray-400">
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
                <div className="text-5xl mb-4">💳</div>
                <h3 className="font-bold text-xl mb-2">Physical Card</h3>
                <p className="text-3xl font-bold text-celtic-blue mb-2">£5</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                  Premium plastic card with NFC chip. Collect at the clubhouse.
                </p>
                <ul className="text-left space-y-2 text-sm text-gray-600 dark:text-gray-400">
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
