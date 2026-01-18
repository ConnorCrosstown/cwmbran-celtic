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
    icon: (
      <svg className="w-8 h-8 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
    sessions: 'Weekly sessions',
    cost: 'Contact for pricing',
  },
  {
    title: 'Coleg Gwent Partnership',
    description: 'Historic collaboration providing pathways for young players to combine education with football development.',
    href: '/community/coleg-gwent',
    icon: (
      <svg className="w-8 h-8 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
    sessions: 'Academic year',
    cost: 'Part of college programme',
  },
  {
    title: 'Youth Development',
    description: 'Developing the next generation of Cwmbran Celtic players. Sessions for various age groups from U7s to U16s.',
    href: '/community/youth',
    icon: (
      <svg className="w-8 h-8 text-celtic-blue" fill="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5"/>
        <polygon points="12,7 13.5,10 17,10.5 14.5,13 15,16.5 12,15 9,16.5 9.5,13 7,10.5 10.5,10" fill="currentColor"/>
      </svg>
    ),
    sessions: 'Various times - see page for details',
    cost: 'Contact for fees',
  },
  {
    title: 'Match Day Volunteers',
    description: 'Help make match days special. We need volunteers for various roles including hospitality, programme sales, and more.',
    href: '/contact',
    icon: (
      <svg className="w-8 h-8 text-celtic-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.05 4.575a1.575 1.575 0 10-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 013.15 0v1.5m-3.15 0l.075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 013.15 0V15M6.9 7.575a1.575 1.575 0 10-3.15 0v8.175a6.75 6.75 0 006.75 6.75h2.018a5.25 5.25 0 003.712-1.538l1.732-1.732a5.25 5.25 0 001.538-3.712l.003-2.024a.668.668 0 01.198-.471 1.575 1.575 0 10-2.228-2.228 3.818 3.818 0 00-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0116.35 15" />
      </svg>
    ),
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
              Since 1925, we&apos;ve been bringing people together through the beautiful game. Our
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
                  <div className="w-14 h-14 bg-celtic-blue/10 rounded-xl flex items-center justify-center flex-shrink-0">{program.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-xl text-celtic-dark group-hover:text-celtic-blue transition-colors mb-2">
                      {program.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {program.description}
                    </p>
                    <div className="text-sm text-gray-500 space-y-1">
                      <p className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                        {program.sessions}
                      </p>
                      <p className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-celtic-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {program.cost}
                      </p>
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
