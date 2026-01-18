import Link from 'next/link';
import SectionHeader from '@/components/ui/SectionHeader';

export const metadata = {
  title: 'Membership & Season Tickets',
  description: 'Join the Cwmbran Celtic family with a season ticket or membership. Support your club and enjoy exclusive benefits.',
};

const seasonTickets = [
  {
    name: 'Adult Season Ticket',
    price: 80,
    savings: 'Save over £30',
    description: 'Full access to all men\'s first team home league matches',
    features: [
      'Entry to all home league games',
      '10% off at the club shop',
      'Priority booking for cup ties',
      'Season ticket holder events',
      'Digital membership card',
    ],
    popular: true,
  },
  {
    name: 'Concession Season Ticket',
    price: 50,
    savings: 'Save over £20',
    description: 'For over 65s and students with valid ID',
    features: [
      'Entry to all home league games',
      '10% off at the club shop',
      'Priority booking for cup ties',
      'Digital membership card',
    ],
    popular: false,
  },
  {
    name: 'Junior Season Ticket',
    price: 20,
    savings: 'Best value',
    description: 'For under 16s accompanied by an adult',
    features: [
      'Entry to all home league games',
      'Free programme each game',
      'Birthday card from the club',
      'Junior Celtic member pack',
    ],
    popular: false,
  },
  {
    name: 'Family Season Ticket',
    price: 180,
    savings: 'Save over £50',
    description: '2 adults + 2 juniors (under 16)',
    features: [
      'Entry to all home league games',
      '10% off at the club shop',
      'Priority booking for cup ties',
      'Family day invitations',
      '4 digital membership cards',
    ],
    popular: false,
  },
];

const membershipTiers = [
  {
    name: 'Supporter Member',
    price: 25,
    period: 'per year',
    description: 'Show your support and join the Celtic family',
    features: [
      'Membership card',
      'Welcome pack',
      '5% shop discount',
      'Newsletter updates',
      'AGM voting rights',
    ],
    color: 'blue',
  },
  {
    name: 'Celtic Bond Member',
    price: 10,
    period: 'per month',
    description: 'Support the club with monthly contributions',
    features: [
      'All Supporter benefits',
      'Monthly prize draw entry',
      'Prize fund: £100, £50, £25',
      'Help fund improvements',
      'Exclusive member events',
    ],
    color: 'yellow',
    link: '/celtic-bond',
  },
];

const benefits = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
      </svg>
    ),
    title: 'Guaranteed Entry',
    description: 'Never miss a home game with your season ticket',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Save Money',
    description: 'Season tickets offer great savings versus pay-on-the-day',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
    title: 'Shop Discounts',
    description: 'Exclusive discounts on merchandise all season',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    title: 'Support Your Club',
    description: 'Your commitment helps the club plan and invest',
  },
];

export default function MembershipPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
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
              Join the Family
            </h1>
            <p className="text-xl text-white/80 mb-8">
              Become part of the Celtic community with a season ticket or membership
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#season-tickets" className="btn-secondary">
                Season Tickets
              </a>
              <a href="#membership" className="bg-white/10 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors">
                Membership
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Bar */}
      <section className="bg-celtic-yellow py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="text-celtic-dark flex-shrink-0">{benefit.icon}</div>
                <div>
                  <h3 className="font-bold text-celtic-dark text-sm">{benefit.title}</h3>
                  <p className="text-xs text-celtic-dark/70">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Season Tickets Section */}
      <section id="season-tickets" className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="2025/26 Season Tickets"
            subtitle="Secure your place at The Park for every home game"
            centered
          />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
            {seasonTickets.map((ticket, index) => (
              <div
                key={index}
                className={`card overflow-hidden ${ticket.popular ? 'ring-2 ring-celtic-yellow' : ''}`}
              >
                {ticket.popular && (
                  <div className="bg-celtic-yellow text-celtic-dark text-center py-2 text-xs font-bold uppercase tracking-wide">
                    Most Popular
                  </div>
                )}
                <div className="p-6">
                  <h3 className="font-bold text-lg text-celtic-dark dark:text-white mb-2">{ticket.name}</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-display text-celtic-blue dark:text-celtic-yellow">£{ticket.price}</span>
                  </div>
                  <p className="text-celtic-yellow dark:text-celtic-yellow/80 text-sm font-semibold mb-3">{ticket.savings}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{ticket.description}</p>

                  <ul className="space-y-2 mb-6">
                    {ticket.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <svg className="w-4 h-4 text-celtic-yellow flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link href="/contact" className={`w-full text-center ${ticket.popular ? 'btn-primary' : 'btn-outline'}`}>
                    Buy Now
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
            Season tickets can be collected from the clubhouse on matchdays or posted for an additional £3.
          </p>
        </div>
      </section>

      {/* Membership Section */}
      <section id="membership" className="py-16 md:py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Club Membership"
            subtitle="Support the club even if you can't make every game"
            centered
          />

          <div className="grid gap-8 md:grid-cols-2 max-w-3xl mx-auto">
            {membershipTiers.map((tier, index) => (
              <div
                key={index}
                className={`card-static p-6 ${tier.color === 'yellow' ? 'border-2 border-celtic-yellow bg-celtic-yellow/5' : ''}`}
              >
                <h3 className="font-display text-xl uppercase text-celtic-dark dark:text-white mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className={`text-4xl font-display ${tier.color === 'yellow' ? 'text-celtic-dark dark:text-celtic-yellow' : 'text-celtic-blue dark:text-celtic-yellow'}`}>
                    £{tier.price}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">/{tier.period}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{tier.description}</p>

                <ul className="space-y-2 mb-6">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <svg className="w-4 h-4 text-celtic-yellow flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href={tier.link || '/contact'}
                  className={`w-full text-center ${tier.color === 'yellow' ? 'btn-primary' : 'btn-outline'}`}
                >
                  {tier.link ? 'Join Celtic Bond' : 'Become a Member'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-20 bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Frequently Asked Questions"
            centered
          />

          <div className="max-w-2xl mx-auto space-y-4">
            <div className="card-static p-5">
              <h3 className="font-bold text-celtic-dark dark:text-white mb-2">How do I collect my season ticket?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Season tickets can be collected from the clubhouse before any home game. Please bring photo ID. Alternatively, we can post your ticket for £3.
              </p>
            </div>
            <div className="card-static p-5">
              <h3 className="font-bold text-celtic-dark dark:text-white mb-2">What matches are included?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Season tickets cover all JD Cymru South home league matches. Cup matches and friendlies may require separate purchase, though season ticket holders receive priority booking.
              </p>
            </div>
            <div className="card-static p-5">
              <h3 className="font-bold text-celtic-dark dark:text-white mb-2">Can I get a refund if I can't attend?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Season tickets are non-refundable, but you can gift your ticket to a friend or family member for individual matches.
              </p>
            </div>
            <div className="card-static p-5">
              <h3 className="font-bold text-celtic-dark dark:text-white mb-2">Does membership include entry to games?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Supporter Membership does not include match entry - you would need to purchase tickets separately. For included match entry, consider a season ticket.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-celtic-blue">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display uppercase text-white mb-4">
            Need Help Deciding?
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            Contact us and we&apos;ll help you find the perfect option for you and your family.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn-secondary">
              Contact Us
            </Link>
            <a href="tel:+441633000000" className="bg-white/10 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors">
              Call: 01633 000000
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
