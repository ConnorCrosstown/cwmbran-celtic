'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { clubInfo } from '@/data/mock-data';

function ContactForm() {
  const searchParams = useSearchParams();
  const subject = searchParams.get('subject') || '';

  // Map URL subjects to form values
  const getInitialSubject = () => {
    if (subject.includes('board') || subject === 'advertising') return 'advertising';
    if (subject.includes('premium') || subject.includes('standard') || subject.includes('budget')) return 'advertising';
    if (subject === 'sponsorship') return 'sponsorship';
    return '';
  };

  // Get board number from subject if present
  const getBoardMessage = () => {
    if (subject.startsWith('board-')) {
      const boardNum = subject.replace('board-', '');
      return `I am interested in advertising Board #${boardNum}.\n\nPlease provide more information about availability and the sponsorship process.`;
    }
    if (subject === 'premium-board') {
      return 'I am interested in a Premium advertising board (8ft x 3ft).\n\nPlease provide more information about availability and locations.';
    }
    if (subject === 'standard-board') {
      return 'I am interested in a Standard advertising board (6ft x 2ft).\n\nPlease provide more information about availability and locations.';
    }
    if (subject === 'budget-board') {
      return 'I am interested in a Budget advertising board (4ft x 2ft).\n\nPlease provide more information about availability and locations.';
    }
    if (subject === 'advertising') {
      return 'I am interested in pitch-side advertising at Cwmbran Celtic.\n\nPlease provide more information about available boards and pricing.';
    }
    return '';
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-celtic-blue text-white py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            We&apos;d love to hear from you. Get in touch with Cwmbran Celtic AFC.
          </p>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div>
                <h2 className="section-title">Get in Touch</h2>

                {/* Email */}
                <div className="card p-6 mb-6">
                  <h3 className="font-bold text-lg mb-2">General Enquiries</h3>
                  <a
                    href={`mailto:${clubInfo.contact.email}`}
                    className="text-celtic-blue hover:text-celtic-blue-dark font-medium"
                  >
                    {clubInfo.contact.email}
                  </a>
                </div>

                {/* Chairman */}
                <div className="card p-6 mb-6">
                  <h3 className="font-bold text-lg mb-2">Chairman</h3>
                  <p className="text-gray-700 mb-1">{clubInfo.contact.chairman.name}</p>
                  {clubInfo.contact.chairman.phone && (
                    <a
                      href={`tel:${clubInfo.contact.chairman.phone.replace(/\s/g, '')}`}
                      className="text-celtic-blue hover:text-celtic-blue-dark font-medium"
                    >
                      {clubInfo.contact.chairman.phone}
                    </a>
                  )}
                </div>

                {/* Address */}
                <div className="card p-6 mb-6">
                  <h3 className="font-bold text-lg mb-2">Ground Address</h3>
                  <p className="text-gray-700">
                    {clubInfo.ground.name}<br />
                    {clubInfo.ground.address.street}<br />
                    {clubInfo.ground.address.town}<br />
                    {clubInfo.ground.address.postcode}
                  </p>
                </div>

                {/* Social Media */}
                <div className="card p-6">
                  <h3 className="font-bold text-lg mb-4">Follow Us</h3>
                  <div className="flex gap-4">
                    <a
                      href={clubInfo.social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-celtic-blue text-white rounded-full flex items-center justify-center hover:bg-celtic-blue-dark transition-colors"
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
                      className="w-12 h-12 bg-celtic-blue text-white rounded-full flex items-center justify-center hover:bg-celtic-blue-dark transition-colors"
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
                      className="w-12 h-12 bg-celtic-blue text-white rounded-full flex items-center justify-center hover:bg-celtic-blue-dark transition-colors"
                      aria-label="Facebook"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <h2 className="section-title">Send a Message</h2>

                <form className="card p-6 space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-celtic-blue focus:border-celtic-blue outline-none transition-colors"
                      placeholder="John Smith"
                    />
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-celtic-blue focus:border-celtic-blue outline-none transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      defaultValue={getInitialSubject()}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-celtic-blue focus:border-celtic-blue outline-none transition-colors"
                    >
                      <option value="">Select a subject...</option>
                      <option value="general">General Enquiry</option>
                      <option value="media">Media Request</option>
                      <option value="sponsorship">Sponsorship / Commercial</option>
                      <option value="advertising">Advertising Board Enquiry</option>
                      <option value="playing">Playing Opportunities</option>
                      <option value="celtic-bond">Celtic Bond</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      defaultValue={getBoardMessage()}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-celtic-blue focus:border-celtic-blue outline-none transition-colors resize-none"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary w-full"
                  >
                    Send Message
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    By submitting this form, you agree to our privacy policy.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 md:py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="section-title">Looking for Something Specific?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <a href="/visit" className="card p-6 hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-celtic-blue mb-2">Match Day Info</h3>
                <p className="text-sm text-gray-600">Directions, admission, facilities</p>
              </a>
              <a href="/sponsors" className="card p-6 hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-celtic-blue mb-2">Sponsorship</h3>
                <p className="text-sm text-gray-600">Partner with the club</p>
              </a>
              <a href="/celtic-bond" className="card p-6 hover:shadow-lg transition-shadow">
                <h3 className="font-bold text-celtic-blue mb-2">Celtic Bond</h3>
                <p className="text-sm text-gray-600">Support the club monthly</p>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ContactForm />
    </Suspense>
  );
}
