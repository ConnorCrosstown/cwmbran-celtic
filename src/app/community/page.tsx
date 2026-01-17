import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Community',
  description: 'Cwmbran Celtic AFC community programmes including walking football, youth development, and more.',
};

const communityPrograms = [
  {
    title: 'Walking Football',
    description: 'Fun, social football sessions for over 50s. Stay active and make new friends in a relaxed, low-impact environment.',
    href: '/teams/walking',
    icon: '🚶',
    sessions: 'Weekly sessions',
    cost: 'Contact for pricing',
  },
  {
    title: 'Coleg Gwent Partnership',
    description: 'Historic collaboration providing pathways for young players to combine education with football development.',
    href: '/community/coleg-gwent',
    icon: '🎓',
    sessions: 'Academic year',
    cost: 'Part of college programme',
  },
  {
    title: 'Youth Development',
    description: 'Developing the next generation of Cwmbran Celtic players. Sessions for various age groups from U7s to U16s.',
    href: '/community/youth',
    icon: '⚽',
    sessions: 'Various times - see page for details',
    cost: 'Contact for fees',
  },
  {
    title: 'Match Day Volunteers',
    description: 'Help make match days special. We need volunteers for various roles including hospitality, programme sales, and more.',
    href: '/contact',
    icon: '🤝',
    sessions: 'Match days',
    cost: 'Free entry + refreshments',
  },
];

export default function CommunityPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-celtic-blue text-white py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Community</h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            More than a football club - Cwmbran Celtic is at the heart of our community
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="section-title">Football For Everyone</h2>
            <p className="text-gray-600 mb-6">
              At Cwmbran Celtic AFC, we believe football should be accessible to everyone in our
              community. Whether you&apos;re looking to play, volunteer, or simply be part of something
              special, there&apos;s a place for you here.
            </p>
            <p className="text-gray-600">
              Since 1924, we&apos;ve been bringing people together through the beautiful game. Our
              community programmes continue that tradition, providing opportunities for people of
              all ages and abilities to get involved.
            </p>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-12 md:py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="section-title text-center">Our Programmes</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {communityPrograms.map((program) => (
              <Link
                key={program.title}
                href={program.href}
                className="card p-6 hover:shadow-lg transition-shadow group"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{program.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-xl text-celtic-dark group-hover:text-celtic-blue transition-colors mb-2">
                      {program.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {program.description}
                    </p>
                    <div className="text-sm text-gray-500 space-y-1">
                      <p>📅 {program.sessions}</p>
                      <p>💰 {program.cost}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Volunteer CTA */}
      <section className="py-12 md:py-16 bg-celtic-yellow">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-celtic-dark mb-4">
            Get Involved
          </h2>
          <p className="text-celtic-dark/80 mb-6 max-w-xl mx-auto">
            Cwmbran Celtic is run by volunteers who are passionate about our club and community.
            If you&apos;d like to help out, we&apos;d love to hear from you.
          </p>
          <Link href="/contact" className="btn-primary">
            Become a Volunteer
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-4xl font-bold text-celtic-blue mb-2">100+</div>
              <div className="text-gray-600">Years in the Community</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-celtic-blue mb-2">50+</div>
              <div className="text-gray-600">Active Volunteers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-celtic-blue mb-2">200+</div>
              <div className="text-gray-600">Youth Players</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-celtic-blue mb-2">30+</div>
              <div className="text-gray-600">Walking Football Members</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
