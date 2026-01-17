import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'The Club',
  description: 'Learn about Cwmbran Celtic AFC - our history, honours, officials, and more. Serving the Cwmbran community since 1924.',
};

const sections = [
  {
    title: 'Club History',
    href: '/club/history',
    description: 'From CYMS to Cwmbran Celtic - our journey since 1924',
    icon: '📜',
  },
  {
    title: 'Honours',
    href: '/club/honours',
    description: 'Trophies and achievements throughout the years',
    icon: '🏆',
  },
  {
    title: 'Club Officials',
    href: '/club/officials',
    description: 'Meet the people who run the club',
    icon: '👥',
  },
  {
    title: 'News Archive',
    href: '/club/news',
    description: 'All the latest news and updates',
    icon: '📰',
  },
];

export default function ClubPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-celtic-blue text-white py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">The Club</h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Cwmbran Celtic AFC - Proudly serving the community since 1924
          </p>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sections.map((section) => (
                <Link
                  key={section.href}
                  href={section.href}
                  className="card p-6 hover:shadow-lg transition-shadow group"
                >
                  <div className="text-4xl mb-4">{section.icon}</div>
                  <h2 className="text-xl font-bold text-celtic-dark mb-2 group-hover:text-celtic-blue transition-colors">
                    {section.title}
                  </h2>
                  <p className="text-gray-600">{section.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Brief History */}
      <section className="py-12 md:py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title">Our Story</h2>

            <div className="card p-8">
              <p className="text-lg text-gray-700 mb-6">
                Cwmbran Celtic AFC was founded in <strong>1924</strong> as CYMS
                (Catholic Young Men&apos;s Society). Over nearly a century, the club has been
                at the heart of football in Cwmbran, providing opportunities for players
                of all ages and abilities.
              </p>
              <p className="text-gray-700 mb-6">
                Today, we compete in the <strong>JD Cymru South</strong> league and continue
                to develop football at all levels, from our first team to our thriving
                ladies section and community walking football programme.
              </p>
              <Link href="/club/history" className="text-celtic-blue font-semibold hover:underline">
                Read our full history →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Facts */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title text-center">Quick Facts</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="card p-6 text-center">
                <p className="text-4xl font-bold text-celtic-blue mb-2">1924</p>
                <p className="text-sm text-gray-600">Founded</p>
              </div>
              <div className="card p-6 text-center">
                <p className="text-4xl font-bold text-celtic-blue mb-2">100+</p>
                <p className="text-sm text-gray-600">Years of History</p>
              </div>
              <div className="card p-6 text-center">
                <p className="text-4xl font-bold text-celtic-blue mb-2">4</p>
                <p className="text-sm text-gray-600">Teams</p>
              </div>
              <div className="card p-6 text-center">
                <p className="text-4xl font-bold text-celtic-blue mb-2">Tier 3</p>
                <p className="text-sm text-gray-600">Welsh Pyramid</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16 bg-celtic-yellow">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-celtic-dark mb-4">
            Want to Get Involved?
          </h2>
          <p className="text-celtic-dark/80 mb-6 max-w-xl mx-auto">
            Whether you want to play, volunteer, or support the club, we&apos;d love to hear from you.
          </p>
          <Link href="/contact" className="btn-primary">
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}
