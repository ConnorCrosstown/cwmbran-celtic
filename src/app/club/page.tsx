import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'The Club',
  description: 'Learn about Cwmbran Celtic AFC - our history, honours, officials, and more. Serving the Cwmbran community since 1925.',
};

const sections = [
  {
    title: 'Club History',
    href: '/club/history',
    description: 'From CYMS to Cwmbran Celtic - our journey since 1925',
    icon: (
      <svg className="w-8 h-8 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    title: 'Honours',
    href: '/club/honours',
    description: 'Trophies and achievements throughout the years',
    icon: (
      <svg className="w-8 h-8 text-celtic-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
      </svg>
    ),
  },
  {
    title: 'Club Officials',
    href: '/club/officials',
    description: 'Meet the people who run the club',
    icon: (
      <svg className="w-8 h-8 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
  },
  {
    title: 'News Archive',
    href: '/club/news',
    description: 'All the latest news and updates',
    icon: (
      <svg className="w-8 h-8 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
      </svg>
    ),
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
            Cwmbran Celtic AFC - Proudly serving the community since 1925
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
                  <div className="w-14 h-14 bg-celtic-blue/10 rounded-xl flex items-center justify-center mb-4">{section.icon}</div>
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
                Cwmbran Celtic AFC was founded in <strong>1925</strong> as CYMS
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
                <p className="text-4xl font-bold text-celtic-blue mb-2">1925</p>
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
