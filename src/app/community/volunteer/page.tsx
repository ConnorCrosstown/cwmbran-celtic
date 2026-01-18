import { Metadata } from 'next';
import VolunteerForm from '@/components/forms/VolunteerForm';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Volunteer With Us',
  description: 'Join the Cwmbran Celtic family as a volunteer. We need help on match days with stewarding, tea bar, turnstiles, and more.',
};

const volunteerRoles = [
  {
    title: 'Match Day Steward',
    description: 'Help manage crowd flow and ensure a safe environment for all supporters.',
    commitment: '2-3 hours per match',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: 'Tea Bar Helper',
    description: 'Serve hot drinks, snacks, and food to supporters before, during, and after matches.',
    commitment: '3-4 hours per match',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    title: 'Turnstile Operator',
    description: 'Welcome supporters to the ground and handle match day admissions.',
    commitment: '2 hours per match',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
      </svg>
    ),
  },
  {
    title: 'Programme Seller',
    description: 'Sell match day programmes to supporters arriving at the ground.',
    commitment: '1-2 hours per match',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    title: 'Ground Maintenance',
    description: 'Help keep our facilities in top condition - painting, repairs, and general upkeep.',
    commitment: 'Flexible',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: 'Event Helper',
    description: 'Assist with special events, fundraisers, and community activities.',
    commitment: 'As needed',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
];

export default function VolunteerPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-celtic-blue via-celtic-blue to-celtic-blue-dark py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-40 h-40 border-4 border-white rounded-full" />
          <div className="absolute bottom-10 left-10 w-60 h-60 border-4 border-white rounded-full" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-celtic-yellow text-celtic-dark px-4 py-2 rounded-full mb-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="font-semibold">Join Our Team</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display uppercase mb-4 text-white">Volunteer With Us</h1>
          <p className="text-lg max-w-2xl mx-auto text-white/80">
            Cwmbran Celtic is a community club run by volunteers. We&apos;re always looking for people to help on match days and beyond.
          </p>
        </div>
      </section>

      {/* Why Volunteer */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-celtic-dark text-center mb-8">Why Volunteer?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-celtic-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="font-bold mb-2">Be Part of the Family</h3>
                <p className="text-sm text-gray-600">Join a welcoming community of like-minded people who love football and Cwmbran Celtic.</p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-celtic-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                </div>
                <h3 className="font-bold mb-2">Free Entry</h3>
                <p className="text-sm text-gray-600">Volunteers get free entry to matches when they&apos;re helping out.</p>
              </div>
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-celtic-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="font-bold mb-2">Make a Difference</h3>
                <p className="text-sm text-gray-600">Help keep grassroots football alive in Cwmbran for future generations.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Volunteer Roles */}
      <section className="py-12 md:py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-celtic-dark text-center mb-2">Volunteer Roles</h2>
            <p className="text-center text-gray-600 mb-8">We need help in various areas - find one that suits you</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {volunteerRoles.map((role, idx) => (
                <div key={idx} className="bg-white rounded-xl p-6 shadow">
                  <div className="w-12 h-12 bg-celtic-blue/10 rounded-lg flex items-center justify-center mb-4 text-celtic-blue">
                    {role.icon}
                  </div>
                  <h3 className="font-bold text-lg text-celtic-dark mb-2">{role.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{role.description}</p>
                  <p className="text-xs text-celtic-blue font-semibold">{role.commitment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sign Up Form */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-celtic-dark text-center mb-2">Register Your Interest</h2>
            <p className="text-center text-gray-600 mb-8">
              Fill in the form below and we&apos;ll be in touch about volunteering opportunities
            </p>

            <VolunteerForm />
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-12 md:py-16 bg-celtic-yellow">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-celtic-dark mb-4">Have Questions?</h2>
          <p className="text-celtic-dark/80 mb-6 max-w-xl mx-auto">
            If you&apos;d like to know more about volunteering opportunities, get in touch with us.
          </p>
          <Link href="/contact" className="btn-primary">
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}
