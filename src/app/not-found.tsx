import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="container mx-auto px-4 text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <span className="text-9xl font-bold text-celtic-blue opacity-20">404</span>
        </div>

        {/* Message */}
        <h1 className="text-3xl md:text-4xl font-bold text-celtic-dark mb-4">
          Page Not Found
        </h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Looks like the ball went out of play! The page you&apos;re looking for doesn&apos;t exist
          or has been moved.
        </p>

        {/* Quick Links */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="/" className="btn-primary">
            Back to Home
          </Link>
          <Link href="/fixtures" className="btn-outline">
            View Fixtures
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="border-t pt-8">
          <h2 className="text-lg font-semibold text-celtic-dark mb-4">Popular Pages</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/news" className="text-celtic-blue hover:text-celtic-blue-dark font-medium">
              Latest News
            </Link>
            <Link href="/teams" className="text-celtic-blue hover:text-celtic-blue-dark font-medium">
              Our Teams
            </Link>
            <Link href="/visit" className="text-celtic-blue hover:text-celtic-blue-dark font-medium">
              Visit Us
            </Link>
            <Link href="/contact" className="text-celtic-blue hover:text-celtic-blue-dark font-medium">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
