import Link from 'next/link';
import { clubInfo, sponsors } from '@/data/mock-data';

function PepperShaker() {
  return (
    <svg width="10" height="16" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block">
      <rect x="12" y="0" width="16" height="10" rx="3" fill="#e5e5e5" />
      <circle cx="15" cy="5" r="1.5" fill="#999" />
      <circle cx="20" cy="5" r="1.5" fill="#999" />
      <circle cx="25" cy="5" r="1.5" fill="#999" />
      <rect x="14" y="10" width="12" height="6" fill="#d4d4d4" />
      <path d="M10 16 L12 54 L28 54 L30 16 Z" fill="#f5f5f5" />
      <path d="M12 16 L13 52 L27 52 L28 16 Z" fill="#ffffff" />
      <rect x="14" y="28" width="12" height="16" rx="1" fill="#1a1a1a" />
      <text x="20" y="39" textAnchor="middle" fontSize="7" fontWeight="bold" fill="white">P</text>
    </svg>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-white relative overflow-hidden">
      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='1' stroke-linecap='round'%3E%3Cg transform='translate(25,25)'%3E%3Cline x1='-7' y1='-7' x2='7' y2='7'/%3E%3Ccircle cx='-8' cy='-8' r='2.5'/%3E%3Cline x1='5' y1='5' x2='5' y2='8'/%3E%3Cline x1='7' y1='7' x2='7' y2='9'/%3E%3Cline x1='7' y1='-7' x2='-7' y2='7'/%3E%3Ccircle cx='8' cy='-8' r='2.5'/%3E%3Cline x1='-5' y1='5' x2='-5' y2='8'/%3E%3Cline x1='-7' y1='7' x2='-7' y2='9'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      {/* Gradient accent at top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-celtic-blue via-celtic-yellow to-celtic-blue pointer-events-none" />

      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-10">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold mb-2">Stay Updated</h3>
              <p className="text-celtic-yellow text-sm">Get the latest news, fixtures & exclusive offers</p>
            </div>
            <form className="flex w-full md:w-auto gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-80 px-4 py-3 rounded-lg bg-white border border-white/20 text-celtic-dark placeholder-gray-500 focus:outline-none focus:border-celtic-yellow focus:ring-1 focus:ring-celtic-yellow"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-celtic-yellow text-celtic-dark font-semibold rounded-lg hover:bg-celtic-yellow-light transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Club Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-5">
              <img
                src="/images/club-logo.webp"
                alt="Cwmbran Celtic AFC"
                className="w-14 h-14"
              />
              <div>
                <div className="font-bold text-xl text-white">Cwmbran Celtic AFC</div>
                <div className="text-sm text-celtic-yellow font-medium">Est. 1925</div>
              </div>
            </div>
            <p className="text-sm mb-5 leading-relaxed max-w-sm text-white">
              The home of football in Cwmbran. Competing in the JD Cymru South (Men&apos;s)
              and Genero Adran South (Women&apos;s). Come support your local club!
            </p>
            <div className="mb-6">
              <p className="text-sm">
                <strong className="text-celtic-yellow block mb-1">{clubInfo.ground.name}</strong>
                <span className="text-white">{clubInfo.ground.address.street}</span><br />
                <span className="text-white">{clubInfo.ground.address.town}, {clubInfo.ground.address.postcode}</span>
              </p>
            </div>
            {/* Social Links */}
            <div className="flex items-center space-x-3">
              <span className="text-sm text-celtic-yellow font-medium mr-2">Follow us:</span>
              <a
                href={clubInfo.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-celtic-yellow hover:text-celtic-dark hover:scale-110 transition-all duration-200"
                aria-label="Twitter/X"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href={clubInfo.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-celtic-yellow hover:text-celtic-dark hover:scale-110 transition-all duration-200"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href={clubInfo.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-celtic-yellow hover:text-celtic-dark hover:scale-110 transition-all duration-200"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-5">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/news" className="text-white hover:text-celtic-yellow transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-celtic-yellow rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Latest News
                </Link>
              </li>
              <li>
                <Link href="/fixtures" className="text-white hover:text-celtic-yellow transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-celtic-yellow rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Fixtures & Results
                </Link>
              </li>
              <li>
                <Link href="/teams" className="text-white hover:text-celtic-yellow transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-celtic-yellow rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Our Teams
                </Link>
              </li>
              <li>
                <Link href="/tickets" className="text-white hover:text-celtic-yellow transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-celtic-yellow rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Buy Tickets
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-white hover:text-celtic-yellow transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-celtic-yellow rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Official Shop
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-white hover:text-celtic-yellow transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-celtic-yellow rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Photo Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* The Club */}
          <div>
            <h3 className="font-bold text-lg mb-5">The Club</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/club" className="text-white hover:text-celtic-yellow transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-celtic-yellow rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/club/history" className="text-white hover:text-celtic-yellow transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-celtic-yellow rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Club History
                </Link>
              </li>
              <li>
                <Link href="/visit" className="text-white hover:text-celtic-yellow transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-celtic-yellow rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Visit Us
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-white hover:text-celtic-yellow transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-celtic-yellow rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Community
                </Link>
              </li>
              <li>
                <Link href="/sponsors" className="text-white hover:text-celtic-yellow transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-celtic-yellow rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Sponsors
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white hover:text-celtic-yellow transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-celtic-yellow rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Supporters & Match Day */}
          <div>
            <h3 className="font-bold text-lg mb-5">Supporters</h3>
            <ul className="space-y-3 mb-6">
              <li>
                <Link href="/celtic-bond" className="text-white hover:text-celtic-yellow transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-celtic-yellow rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Celtic Bond
                </Link>
              </li>
              <li>
                <Link href="/celtic-card" className="text-white hover:text-celtic-yellow transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-celtic-yellow rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Celtic Card
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-white hover:text-celtic-yellow transition-colors text-sm flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-celtic-yellow rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Events
                </Link>
              </li>
            </ul>

            {/* Match Day Prices */}
            <div className="bg-white/5 rounded-xl p-4">
              <h4 className="font-semibold text-sm mb-3 text-celtic-yellow">Match Day Prices</h4>
              <ul className="space-y-2 text-sm mb-4">
                <li className="flex justify-between">
                  <span className="text-white">Adults</span>
                  <span className="text-white font-medium">£{clubInfo.admission.adults}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-white">Concessions</span>
                  <span className="text-white font-medium">£{clubInfo.admission.concessions}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-white">Under 16s</span>
                  <span className="text-celtic-yellow font-bold">FREE</span>
                </li>
              </ul>
              <Link
                href="/tickets"
                className="block w-full text-center py-2.5 bg-celtic-yellow text-celtic-dark font-bold text-sm rounded-lg hover:bg-celtic-yellow-light transition-colors"
              >
                BUY TICKETS
              </Link>
            </div>

            {/* OXO Easter Egg */}
            <Link href="/ban-the-bovril" className="block mt-4 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-white/60">Tea Hut Tip:</span>
                <span className="font-black" style={{ color: '#C41E3A' }}>OXO</span>
                <span className="text-white/60 flex items-center gap-1">+ <PepperShaker /></span>
                <span className="text-white/40 group-hover:text-celtic-yellow transition-colors">→</span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Sponsors Strip - Tiered Display */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-8">
          {/* Title Sponsor */}
          <div className="text-center mb-8">
            <p className="text-celtic-yellow text-xs uppercase tracking-wider mb-3">Stadium Naming Rights Partner</p>
            <a
              href={sponsors.titleSponsor.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white rounded-xl p-4 hover:scale-105 transition-transform"
            >
              <img
                src={sponsors.titleSponsor.logo}
                alt={sponsors.titleSponsor.name}
                className="h-14 md:h-16 w-auto"
              />
            </a>
          </div>

          {/* Official Partners */}
          <div className="mb-6">
            <p className="text-white text-xs uppercase tracking-wider text-center mb-4">Official Partners</p>
            <div className="flex items-center justify-center gap-6 md:gap-10 flex-wrap">
              {sponsors.officialPartners.map((sponsor, index) => (
                <a
                  key={index}
                  href={sponsor.url || '#'}
                  target={sponsor.url?.startsWith('http') ? '_blank' : undefined}
                  rel={sponsor.url?.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="block bg-white rounded-lg p-3 hover:scale-105 transition-transform"
                  title={sponsor.description}
                >
                  <img
                    src={sponsor.logo}
                    alt={sponsor.name}
                    className="h-10 md:h-12 w-auto"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Club Partners */}
          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wider text-center mb-4">Club Partners</p>
            <div className="flex items-center justify-center gap-6 md:gap-8 flex-wrap">
              {sponsors.clubPartners.map((sponsor, index) => (
                <a
                  key={index}
                  href={sponsor.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-white/90 rounded-lg p-2 hover:scale-105 transition-transform"
                >
                  <img
                    src={sponsor.logo}
                    alt={sponsor.name}
                    className="h-8 md:h-10 w-auto"
                  />
                </a>
              ))}
            </div>
          </div>

          <div className="text-center mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/sponsors" className="text-celtic-yellow text-sm hover:underline">
              View all sponsors →
            </Link>
            <span className="hidden sm:inline text-white/30">|</span>
            <Link href="/sponsors/opportunities" className="text-white text-sm hover:text-celtic-yellow transition-colors">
              Become a sponsor
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-black/20">
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p className="text-white">
              © {currentYear} Cwmbran Celtic AFC. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-white">
              <Link href="/privacy" className="hover:text-celtic-yellow transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-celtic-yellow transition-colors">Terms of Use</Link>
              <Link href="/accessibility" className="hover:text-celtic-yellow transition-colors">Accessibility</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
