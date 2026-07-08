'use client';

import { useState } from 'react';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function CelticBondForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'submitting') return;
    setStatus('submitting');
    setMessage('');

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      firstName: data.get('firstName'),
      lastName: data.get('lastName'),
      email: data.get('email'),
      phone: data.get('phone'),
      bonds: data.get('bonds'),
      terms: data.get('terms') === 'on',
    };

    try {
      const res = await fetch('/api/celtic-bond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
        setMessage(json.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Could not reach the server. Please check your connection and try again.');
    }
  }

  if (status === 'success') {
    return (
      <div className="card p-8 text-center" role="status" aria-live="polite">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-celtic-dark mb-2">Application received!</h3>
        <p className="text-gray-600">
          Thanks for joining Celtic Bond. We&apos;ll be in touch shortly to set up your
          monthly payment. Diolch — your support means the world to the club.
        </p>
      </div>
    );
  }

  return (
    <div className="card p-8">
      <div className="text-center mb-8">
        <p className="text-3xl font-bold text-celtic-blue mb-2">£5 / month per bond</p>
        <p className="text-gray-600">Cancel anytime</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
              First Name *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-celtic-blue focus:border-celtic-blue outline-none"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
              Last Name *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-celtic-blue focus:border-celtic-blue outline-none"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-celtic-blue focus:border-celtic-blue outline-none"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-celtic-blue focus:border-celtic-blue outline-none"
          />
        </div>

        <div>
          <label htmlFor="bonds" className="block text-sm font-medium text-gray-700 mb-2">
            Number of Bonds
          </label>
          <select
            id="bonds"
            name="bonds"
            defaultValue="1"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-celtic-blue focus:border-celtic-blue outline-none"
          >
            <option value="1">1 Bond - £5/month</option>
            <option value="2">2 Bonds - £10/month</option>
            <option value="3">3 Bonds - £15/month</option>
            <option value="5">5 Bonds - £25/month</option>
          </select>
        </div>

        <div className="flex items-start gap-3">
          <input type="checkbox" id="terms" name="terms" required className="mt-1" />
          <label htmlFor="terms" className="text-sm text-gray-600">
            I agree to the Celtic Bond terms and conditions and understand that £5 per bond
            will be collected monthly until I cancel.
          </label>
        </div>

        {status === 'error' && (
          <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            {message}
          </p>
        )}

        <button type="submit" disabled={status === 'submitting'} className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed">
          {status === 'submitting' ? 'Submitting…' : 'Apply to Join'}
        </button>
      </form>

      <p className="text-xs text-gray-500 text-center mt-6">
        We&apos;ll be in touch to set up your monthly payment. You can cancel at any time.
      </p>
    </div>
  );
}
