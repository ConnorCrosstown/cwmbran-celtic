import Link from 'next/link';
import SectionHeader from '@/components/ui/SectionHeader';

export const metadata = {
  title: 'Fan Zone',
  description: 'Welcome to the Cwmbran Celtic Fan Zone. Join our community, get involved, and show your support for the Celts.',
};

const fanContent = [
  {
    title: 'Supporters Club',
    description: 'Join the official Cwmbran Celtic Supporters Club and be part of our passionate community.',
    features: ['Exclusive events', 'Away travel subsidies', 'Member discounts', 'Voting rights on club matters'],
    ctaText: 'Join the Supporters Club',
    ctaLink: '/contact',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    title: 'Celtic Bond',
    description: 'Support the club financially while being in with a chance to win monthly cash prizes.',
    features: ['Just £10/month', 'Monthly prize draw', 'Fund club improvements', 'Support youth development'],
    ctaText: 'Join Celtic Bond',
    ctaLink: '/celtic-bond',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Volunteer With Us',
    description: 'Get involved on matchdays and beyond. We always need passionate volunteers.',
    features: ['Matchday stewards', 'Programme sellers', 'Tea bar helpers', 'Ground maintenance'],
    ctaText: 'Get Involved',
    ctaLink: '/contact',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
];

const socialLinks = [
  {
    name: 'Twitter / X',
    handle: '@CwmbranCelticFC',
    url: 'https://twitter.com/CwmbranCelticFC',
    followers: '2.1K',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    handle: 'Cwmbran Celtic AFC',
    url: 'https://facebook.com/CwmbranCelticAFC',
    followers: '3.5K',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    handle: '@cwmbranceltic',
    url: 'https://instagram.com/cwmbranceltic',
    followers: '1.8K',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    name: 'YouTube',
    handle: 'Cwmbran Celtic TV',
    url: 'https://youtube.com/@cwmbranceltic',
    followers: '500+',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

const chants = [
  {
    title: 'Come On You Celts',
    lyrics: "Come on you Celts, come on you Celts!\nWe're the pride of Cwmbran town,\nBlue and yellow all around,\nCome on you Celts!",
  },
  {
    title: 'Celtic Till I Die',
    lyrics: "Celtic till I die, I'm Celtic till I die,\nI know I am, I'm sure I am,\nI'm Celtic till I die!",
  },
  {
    title: 'The Park Ground',
    lyrics: "This is the Park Ground, our home sweet home,\nWhere the Celtic play and never roam,\nFrom Cwmbran town we proudly stand,\nThe best supporters in the land!",
  },
];

export default function FanZonePage() {
  return (
    <div className="min-h-screen bg-gray-50">
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
              Fan Zone
            </h1>
            <p className="text-xl text-white/80 mb-8">
              Welcome to the heart of the Celtic community. Get involved, stay connected, and show your support.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="#get-involved" className="btn-secondary">
                Get Involved
              </Link>
              <Link href="#social" className="bg-white/10 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors">
                Follow Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Get Involved Section */}
      <section id="get-involved" className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Get Involved"
            subtitle="There are many ways to support Cwmbran Celtic"
          />

          <div className="grid gap-8 md:grid-cols-3">
            {fanContent.map((item, index) => (
              <div key={index} className="card card-accent-yellow-top p-6">
                <div className="w-14 h-14 bg-celtic-blue/10/20 rounded-xl flex items-center justify-center text-celtic-blue mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-celtic-dark mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                <ul className="space-y-2 mb-6">
                  {item.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <svg className="w-4 h-4 text-celtic-yellow flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href={item.ctaLink} className="btn-primary w-full text-center">
                  {item.ctaText}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section id="social" className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Connect With Us"
            subtitle="Follow us on social media for the latest news and updates"
            centered
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card-static p-5 text-center hover:border-celtic-blue transition-colors group"
              >
                <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 group-hover:bg-celtic-blue group-hover:text-white transition-colors">
                  {social.icon}
                </div>
                <h3 className="font-bold text-celtic-dark mb-1">{social.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{social.handle}</p>
                <p className="text-xs text-celtic-blue font-semibold">{social.followers} followers</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Chants Section */}
      <section className="py-16 md:py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Matchday Songbook"
            subtitle="Learn the chants and make some noise on matchday"
            centered
          />

          <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
            {chants.map((chant, index) => (
              <div key={index} className="card-static p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-celtic-yellow rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-celtic-dark" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-celtic-dark">{chant.title}</h3>
                </div>
                <pre className="text-sm text-gray-600 whitespace-pre-wrap font-sans leading-relaxed">
                  {chant.lyrics}
                </pre>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fan Gallery CTA */}
      <section className="py-16 md:py-20 bg-celtic-yellow">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display uppercase text-celtic-dark mb-4">
            Share Your Photos
          </h2>
          <p className="text-celtic-dark/80 max-w-2xl mx-auto mb-8">
            Got great photos from matchday? Share them with the Celtic community using #UpTheCeltic on social media.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/gallery" className="btn-primary">
              View Gallery
            </Link>
            <a
              href="https://instagram.com/cwmbranceltic"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              Tag Us on Instagram
            </a>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center">
            <SectionHeader
              title="Stay Updated"
              subtitle="Get the latest Celtic news delivered to your inbox"
              centered
            />
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-celtic-blue focus:border-transparent"
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-3">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
