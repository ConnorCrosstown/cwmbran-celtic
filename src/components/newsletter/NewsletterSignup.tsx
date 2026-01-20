'use client';

import { useState } from 'react';

interface NewsletterSignupProps {
  variant?: 'inline' | 'card' | 'footer';
  className?: string;
}

export default function NewsletterSignup({ variant = 'card', className = '' }: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstName }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message);
        setEmail('');
        setFirstName('');
      } else {
        setStatus('error');
        setMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  if (variant === 'inline') {
    return (
      <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-celtic-blue"
          disabled={status === 'loading'}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="btn-primary whitespace-nowrap"
        >
          {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
        </button>
        {status === 'success' && <span className="text-green-600 text-sm self-center">{message}</span>}
        {status === 'error' && <span className="text-red-600 text-sm self-center">{message}</span>}
      </form>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={className}>
        <h3 className="font-bold text-white mb-3">Newsletter</h3>
        <p className="text-gray-400 text-sm mb-4">
          Get the latest news, results, and fixtures delivered to your inbox.
        </p>
        {status === 'success' ? (
          <p className="text-celtic-yellow text-sm">{message}</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              required
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-celtic-yellow"
              disabled={status === 'loading'}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-celtic-yellow text-celtic-dark font-semibold py-2 px-4 rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50"
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
            {status === 'error' && <p className="text-red-400 text-sm">{message}</p>}
          </form>
        )}
      </div>
    );
  }

  // Default: card variant
  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 md:p-8 ${className}`}>
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-celtic-blue/10 rounded-xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-celtic-dark mb-2">Stay Updated</h3>
        <p className="text-gray-600 text-sm">
          Get the latest news, results, and fixtures delivered straight to your inbox.
        </p>
      </div>

      {status === 'success' ? (
        <div className="text-center p-4 bg-green-50 rounded-xl">
          <svg className="w-12 h-12 text-green-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-green-700 font-medium">{message}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="newsletter-firstname" className="sr-only">First name</label>
            <input
              id="newsletter-firstname"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name (optional)"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-celtic-blue focus:border-transparent"
              disabled={status === 'loading'}
            />
          </div>
          <div>
            <label htmlFor="newsletter-email" className="sr-only">Email address</label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-celtic-blue focus:border-transparent"
              disabled={status === 'loading'}
            />
          </div>
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full btn-primary py-3"
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe to Newsletter'}
          </button>
          {status === 'error' && (
            <p className="text-red-600 text-sm text-center">{message}</p>
          )}
          <p className="text-xs text-gray-500 text-center">
            You can unsubscribe at any time. We respect your privacy.
          </p>
        </form>
      )}
    </div>
  );
}
