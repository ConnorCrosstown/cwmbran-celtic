import Link from 'next/link';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  isNew?: boolean;
}

// Mock products
const featuredProducts: Product[] = [
  {
    id: '1',
    name: 'Home Shirt 2025/26',
    price: 45,
    image: '/images/shop/home-shirt.jpg',
    category: 'Replica Kit',
    isNew: true,
  },
  {
    id: '2',
    name: 'Away Shirt 2025/26',
    price: 45,
    image: '/images/shop/away-shirt.jpg',
    category: 'Replica Kit',
    isNew: true,
  },
  {
    id: '3',
    name: 'Training Jacket',
    price: 35,
    image: '/images/shop/training-jacket.jpg',
    category: 'Training Wear',
  },
  {
    id: '4',
    name: 'Celtic Scarf',
    price: 15,
    image: '/images/shop/scarf.jpg',
    category: 'Accessories',
  },
];

function ProductCard({ product }: { product: Product }) {
  return (
    <a
      href="https://www.rhinodirect.co.uk/collections/cwmbran-celtic"
      target="_blank"
      rel="noopener noreferrer"
      className="group card-hover block rounded-lg"
    >
      <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 mb-3">
        {/* Placeholder for product image */}
        <div className="absolute inset-0 bg-gradient-to-br from-celtic-blue/10 to-celtic-yellow/10 flex items-center justify-center">
          <div className="w-20 h-20 bg-celtic-blue/20 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-celtic-blue/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        </div>

        {/* New badge */}
        {product.isNew && (
          <div className="absolute top-2 left-2 bg-celtic-yellow text-celtic-dark text-xs font-bold px-2 py-1 rounded">
            NEW
          </div>
        )}

        {/* Quick view overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <span className="bg-white text-celtic-dark px-4 py-2 rounded-lg font-semibold text-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
            Quick View
          </span>
        </div>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
        {product.category}
      </p>
      <h4 className="font-semibold text-celtic-dark dark:text-white text-sm mb-1 group-hover:text-celtic-blue dark:group-hover:text-celtic-yellow transition-colors">
        {product.name}
      </h4>
      <p className="font-bold text-celtic-blue dark:text-celtic-yellow">
        £{product.price.toFixed(2)}
      </p>
    </a>
  );
}

export default function ShopSection() {
  return (
    <section className="py-16 md:py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="section-header">
            <div className="section-header-accent" />
            <div className="section-header-content">
              <h2 className="section-title">Club Shop</h2>
              <p className="section-subtitle">Get kitted out in Celtic colours</p>
            </div>
          </div>
          <Link
            href="/shop"
            className="text-celtic-blue dark:text-celtic-yellow font-semibold text-sm hover:underline flex items-center gap-1 group"
          >
            Shop All
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Shop CTA Banner */}
        <div className="mt-10 relative rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-celtic-blue-dark to-celtic-blue" />
          <div className="relative px-6 py-8 md:py-10 md:px-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-display uppercase text-white mb-2">
                New Season Kit Available
              </h3>
              <p className="text-white">
                Get the 2025/26 home and away shirts now at the official club shop
              </p>
            </div>
            <a
              href="https://www.rhinodirect.co.uk/collections/cwmbran-celtic"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary whitespace-nowrap"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Visit Shop
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
