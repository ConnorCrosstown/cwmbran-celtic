import Link from 'next/link';
import Image from 'next/image';
import SectionHeader from '@/components/ui/SectionHeader';

export const metadata = {
  title: 'Hospitality & Events',
  description: 'Book hospitality packages and hire our facilities at Cwmbran Celtic AFC. Perfect for matchday hospitality, private events, and celebrations.',
};

const hospitalityPackages = [
  {
    name: 'Matchday Hospitality',
    description: 'Enjoy the ultimate matchday experience with pre-match dining, premium seating, and post-match refreshments.',
    price: 'From £35pp',
    features: ['Pre-match meal', 'Premium seats', 'Matchday programme', 'Post-match refreshments', 'Meet the players'],
    image: '/images/hospitality-matchday.jpg',
  },
  {
    name: 'Sponsor a Match',
    description: 'Become the official match sponsor and enjoy extensive brand exposure plus VIP hospitality for your guests.',
    price: 'From £250',
    features: ['Logo on matchday programme', 'PA announcements', 'Social media promotion', 'Hospitality for 10 guests', 'Man of the match presentation'],
    image: '/images/hospitality-sponsor.jpg',
  },
  {
    name: 'Player Sponsorship',
    description: 'Support your favourite player and get exclusive benefits throughout the season.',
    price: 'From £100',
    features: ['Name in matchday programme', 'Signed shirt at end of season', 'Photo with your player', 'Website recognition', 'Exclusive updates'],
    image: '/images/hospitality-player.jpg',
  },
];

const venueHire = [
  {
    name: 'Clubhouse Function Room',
    capacity: 'Up to 80 guests',
    description: 'Our main function room is perfect for parties, celebrations, wakes, and corporate events.',
    features: ['Licensed bar', 'Kitchen facilities', 'PA system', 'Free parking', 'Disabled access'],
  },
  {
    name: 'Birthday Parties',
    capacity: 'Up to 30 children',
    description: 'Let the kids enjoy a football-themed birthday party at the home of Cwmbran Celtic.',
    features: ['Use of pitch (weather permitting)', 'Party room', 'Basic catering options', 'Celtic party pack', 'Photo opportunities'],
  },
  {
    name: 'Meeting Room',
    capacity: 'Up to 20 guests',
    description: 'A professional space for business meetings, training sessions, or small gatherings.',
    features: ['WiFi', 'Projector available', 'Tea/coffee', 'Flipchart', 'Breakout area'],
  },
];

export default function HospitalityPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-celtic-blue-dark to-celtic-blue" />
          <div className="absolute inset-0 opacity-[0.08]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='1' stroke-linecap='round'%3E%3Cg transform='translate(25,25)'%3E%3Cline x1='-7' y1='-7' x2='7' y2='7'/%3E%3Ccircle cx='-8' cy='-8' r='2.5'/%3E%3Cline x1='5' y1='5' x2='5' y2='8'/%3E%3Cline x1='7' y1='7' x2='7' y2='9'/%3E%3Cline x1='7' y1='-7' x2='-7' y2='7'/%3E%3Ccircle cx='8' cy='-8' r='2.5'/%3E%3Cline x1='-5' y1='5' x2='-5' y2='8'/%3E%3Cline x1='-7' y1='7' x2='-7' y2='9'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display uppercase text-white mb-4">
              Hospitality & Events
            </h1>
            <p className="text-xl text-celtic-yellow mb-8">
              From matchday experiences to private functions, make your event special at Cwmbran Celtic AFC
            </p>
            <Link href="/contact" className="btn-secondary">
              Enquire Now
            </Link>
          </div>
        </div>
      </section>

      {/* Matchday Hospitality */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Matchday Hospitality"
            subtitle="Experience matchday in style"
          />

          <div className="grid gap-8 md:grid-cols-3">
            {hospitalityPackages.map((pkg, index) => (
              <div key={index} className="card card-accent-yellow-top overflow-hidden">
                {/* Placeholder image area */}
                <div className="h-48 bg-gradient-to-br from-celtic-blue to-celtic-blue-dark flex items-center justify-center">
                  <svg className="w-16 h-16 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-celtic-dark">{pkg.name}</h3>
                    <span className="text-celtic-blue font-bold">{pkg.price}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{pkg.description}</p>
                  <ul className="space-y-2 mb-6">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                        <svg className="w-4 h-4 text-celtic-yellow flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link href="/contact" className="btn-primary w-full text-center">
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Venue Hire */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Venue Hire"
            subtitle="Host your event at the home of Cwmbran Celtic"
          />

          <div className="grid gap-6 md:grid-cols-3">
            {venueHire.map((venue, index) => (
              <div key={index} className="card-static card-accent-left p-6">
                <h3 className="text-xl font-bold text-celtic-dark mb-2">{venue.name}</h3>
                <p className="text-celtic-blue font-semibold text-sm mb-3">{venue.capacity}</p>
                <p className="text-gray-600 text-sm mb-4">{venue.description}</p>
                <ul className="space-y-2">
                  {venue.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 bg-celtic-yellow rounded-full flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-celtic-yellow">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display uppercase text-celtic-dark mb-4">
            Ready to Book?
          </h2>
          <p className="text-celtic-dark/80 max-w-2xl mx-auto mb-8">
            Contact us to discuss your requirements and we&apos;ll help create the perfect experience for you and your guests.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn-primary">
              Contact Us
            </Link>
            <a href="tel:+441onal" className="btn-outline">
              Call Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
