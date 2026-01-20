import Link from 'next/link';

export const metadata = {
  title: 'Unsubscribed',
  description: 'You have been unsubscribed from the Cwmbran Celtic AFC newsletter.',
};

export default function UnsubscribedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-celtic-dark mb-4">
            Successfully Unsubscribed
          </h1>

          <p className="text-gray-600 mb-6">
            You have been removed from the Cwmbran Celtic AFC newsletter.
            We&apos;re sorry to see you go!
          </p>

          <p className="text-sm text-gray-500 mb-8">
            Changed your mind? You can always subscribe again from our website.
          </p>

          <div className="space-y-3">
            <Link href="/" className="btn-primary block">
              Return to Website
            </Link>
            <Link href="/contact" className="text-celtic-blue hover:text-celtic-blue-dark transition-colors text-sm">
              Contact us with feedback
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
