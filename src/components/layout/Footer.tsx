import Link from 'next/link';
import { clubInfo, sponsors } from '@/data/mock-data';

export default function Footer() {
  return (
    <footer className="bg-celtic-dark text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Club Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img
                src="/images/club-logo.webp"
                alt="Cwmbran Celtic AFC"
                className="w-12 h-12"
              />
              <div>
                <div className="font-bold text-lg">Cwmbran Celtic AFC</div>
                <div className="text-sm text-celtic-yellow">Est. 1924</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              {clubInfo.ground.name}<br />
              {clubInfo.ground.address.street}<br />
              {clubInfo.ground.address.town}, {clubInfo.ground.address.postcode}
            </p>
            {/* Social Links */}
            <div className="flex space-x-4">
              <a
                href={clubInfo.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-celtic-yellow transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href={clubInfo.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-celtic-yellow transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href={clubInfo.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-celtic-yellow transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/fixtures" className="hover:text-celtic-yellow transition-colors">
                  Fixtures & Results
                </Link>
              </li>
              <li>
                <Link href="/visit" className="hover:text-celtic-yellow transition-colors">
                  Visit Us
                </Link>
              </li>
              <li>
                <Link href="/teams" className="hover:text-celtic-yellow transition-colors">
                  Our Teams
                </Link>
              </li>
              <li>
                <Link href="/club/history" className="hover:text-celtic-yellow transition-colors">
                  Club History
                </Link>
              </li>
              <li>
                <Link href="/celtic-bond" className="hover:text-celtic-yellow transition-colors">
                  Celtic Bond
                </Link>
              </li>
            </ul>
          </div>

          {/* Match Day Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">Match Day</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="flex justify-between">
                <span>Adults</span>
                <span className="text-white">£{clubInfo.admission.adults}</span>
              </li>
              <li className="flex justify-between">
                <span>Concessions</span>
                <span className="text-white">£{clubInfo.admission.concessions}</span>
              </li>
              <li className="flex justify-between">
                <span>Under 16s</span>
                <span className="text-celtic-yellow">FREE</span>
              </li>
              <li className="flex justify-between">
                <span>Programme</span>
                <span className="text-white">£{clubInfo.admission.programme}</span>
              </li>
            </ul>
            <Link
              href="/visit"
              className="inline-block mt-4 text-celtic-yellow hover:underline text-sm"
            >
              Full visitor info →
            </Link>
          </div>

          {/* Main Sponsor */}
          <div>
            <h3 className="font-bold text-lg mb-4">Main Sponsor</h3>
            <a
              href={sponsors.main.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white p-4 rounded-lg hover:opacity-90 transition-opacity"
            >
              <div className="text-celtic-dark font-bold text-center">
                {sponsors.main.name}
              </div>
            </a>
            <Link
              href="/sponsors"
              className="inline-block mt-4 text-celtic-yellow hover:underline text-sm"
            >
              View all sponsors →
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Cwmbran Celtic AFC. All rights reserved.</p>
            <div className="flex space-x-4 mt-2 md:mt-0">
              <Link href="/privacy" className="hover:text-gray-400">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-gray-400">Terms of Use</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
