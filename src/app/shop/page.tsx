import { Metadata } from 'next';
import Link from 'next/link';
import CelticBondBanner from '@/components/banners/CelticBondBanner';

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Official Cwmbran Celtic AFC merchandise. Replica kits, training wear, and supporter merchandise.',
};

interface ProductCategory {
  title: string;
  description: string;
  image: string;
  link: string;
  external?: boolean;
}

const categories: ProductCategory[] = [
  {
    title: 'Replica Kits',
    description: 'Official match day kits for the 2026/27 season. Home, away, and goalkeeper shirts.',
    image: '👕',
    link: 'https://rhino.direct/pages/cwmbran-celtic-club-shop',
    external: true,
  },
  {
    title: 'Training Wear',
    description: 'Training tops, shorts, and accessories. Perfect for training or casual wear.',
    image: '🏃',
    link: 'https://rhino.direct/pages/cwmbran-celtic-club-shop',
    external: true,
  },
  {
    title: 'Supporter Merchandise',
    description: 'T-shirts, hoodies, scarves, hats and more. Show your support for the Celts!',
    image: '🧣',
    link: 'https://cwmbranceltic.teemill.com',
    external: true,
  },
];

export default function ShopPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-celtic-blue text-white py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Official Shop</h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Official Cwmbran Celtic AFC merchandise and replica kits
          </p>
        </div>
      </section>

      {/* Shop Categories */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="section-title text-center">Shop By Category</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categories.map((category, index) => (
                <a
                  key={index}
                  href={category.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card p-8 text-center hover:shadow-lg transition-all group"
                >
                  <div className="text-6xl mb-4">{category.image}</div>
                  <h3 className="font-bold text-xl mb-2 group-hover:text-celtic-blue transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {category.description}
                  </p>
                  <span className="inline-flex items-center gap-1 text-celtic-blue font-semibold">
                    Shop Now
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Kit Partner */}
      <section className="py-12 md:py-16 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title text-center">Our Kit Partner</h2>

            <div className="card p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="font-bold text-2xl mb-4">Rhino Teamwear</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Our official kit supplier Rhino provides all replica kits and training wear.
                    Premium quality sportswear designed for performance.
                  </p>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-400 mb-6">
                    <li className="flex items-center gap-2">
                      <span className="text-celtic-blue">✓</span>
                      <span>Official replica shirts</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-celtic-blue">✓</span>
                      <span>Training wear range</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-celtic-blue">✓</span>
                      <span>Kids sizes available</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-celtic-blue">✓</span>
                      <span>Personalisation options</span>
                    </li>
                  </ul>
                  <a
                    href="https://rhino.direct/pages/cwmbran-celtic-club-shop"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    Visit Rhino Shop
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
                <div className="bg-white dark:bg-gray-700 rounded-xl p-8 text-center">
                  <div className="text-6xl mb-4">🦏</div>
                  <p className="font-bold text-xl text-celtic-blue">Rhino</p>
                  <p className="text-gray-500">Official Kit Partner</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Teemill / Supporter Merchandise */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title text-center">Supporter Merchandise</h2>

            <div className="card p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="order-2 md:order-1 bg-celtic-yellow/10 rounded-xl p-8 text-center">
                  <div className="text-6xl mb-4">🌱</div>
                  <p className="font-bold text-xl text-celtic-blue">Teemill</p>
                  <p className="text-gray-500">Sustainable Print-on-Demand</p>
                </div>
                <div className="order-1 md:order-2">
                  <h3 className="font-bold text-2xl mb-4">Eco-Friendly Merchandise</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Our supporter merchandise is produced by Teemill using sustainable, organic cotton
                    and eco-friendly production methods. Made to order, so no waste!
                  </p>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-400 mb-6">
                    <li className="flex items-center gap-2">
                      <span className="text-celtic-blue">✓</span>
                      <span>T-shirts & hoodies</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-celtic-blue">✓</span>
                      <span>100% organic cotton</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-celtic-blue">✓</span>
                      <span>Sustainable production</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-celtic-blue">✓</span>
                      <span>Free UK delivery</span>
                    </li>
                  </ul>
                  <a
                    href="https://cwmbranceltic.teemill.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    Visit Teemill Shop
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Match Day Shop */}
      <section className="py-12 md:py-16 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="section-title">Match Day Shop</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Visit our club shop at the Avondale Motor Park Arena on match days for merchandise,
              programmes, and more. Cash and card payments accepted.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div className="card p-6">
                <div className="text-4xl mb-3">📍</div>
                <h3 className="font-semibold mb-2">Location</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Inside the clubhouse at the Avondale Motor Park Arena
                </p>
              </div>
              <div className="card p-6">
                <div className="text-4xl mb-3">🕐</div>
                <h3 className="font-semibold mb-2">Opening Hours</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  1 hour before kick-off until 30 mins after full time
                </p>
              </div>
              <div className="card p-6">
                <div className="text-4xl mb-3">💳</div>
                <h3 className="font-semibold mb-2">Payment</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Cash & contactless card payments accepted
                </p>
              </div>
            </div>

            <Link href="/fixtures" className="btn-secondary">
              View Fixtures
            </Link>
          </div>
        </div>
      </section>

      {/* Size Guide CTA */}
      <section className="py-12 md:py-16 bg-celtic-yellow">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-celtic-dark mb-4">
            Need Help With Sizing?
          </h2>
          <p className="text-celtic-dark/80 mb-6 max-w-xl mx-auto">
            Not sure what size to order? Check the size guides on each shop, or get in touch
            and we&apos;ll help you find the perfect fit.
          </p>
          <Link href="/contact" className="btn-primary">
            Contact Us
          </Link>
        </div>
      </section>

      {/* Celtic Bond */}
      <CelticBondBanner variant="full" />
    </>
  );
}
