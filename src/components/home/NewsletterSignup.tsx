'use client';

import { useState } from 'react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    // Simulate API call - replace with actual newsletter service
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1000);
  };

  return (
    <section className="bg-celtic-blue py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: '#ffffff' }}>
            Stay Updated
          </h2>
          <p className="mb-6 text-celtic-yellow">
            Get the latest news, match updates, and exclusive content delivered to your inbox.
          </p>

          {status === 'success' ? (
            <div className="bg-green-500 text-white p-4 rounded-lg">
              Thanks for subscribing! Check your inbox to confirm.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-4 py-3 rounded-lg bg-white text-celtic-dark placeholder-gray-500 focus:ring-2 focus:ring-celtic-yellow outline-none border border-gray-300"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="btn-secondary whitespace-nowrap disabled:opacity-50"
              >
                {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          )}

          <p className="text-xs mt-4" style={{ color: '#d1d5db' }}>
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}
