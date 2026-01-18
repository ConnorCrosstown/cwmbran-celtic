'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface SponsorInquiry {
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  sponsorshipType: string;
  budget: string;
  message: string;
  submittedAt: string;
  status?: 'new' | 'contacted' | 'negotiating' | 'confirmed' | 'declined';
  notes?: string;
}

const sponsorshipLabels: Record<string, string> = {
  kit: 'Kit Sponsorship',
  match: 'Match Sponsorship',
  board: 'Pitch Side Board',
  programme: 'Programme Advert',
  partnership: 'Club Partnership',
  other: 'Other / Not Sure',
};

const budgetLabels: Record<string, string> = {
  'under-100': 'Under £100',
  '100-250': '£100 - £250',
  '250-500': '£250 - £500',
  '500-1000': '£500 - £1,000',
  '1000-plus': '£1,000+',
  'discuss': 'Prefer to discuss',
};

export default function SponsorInquiriesAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inquiries, setInquiries] = useState<SponsorInquiry[]>([]);
  const [filter, setFilter] = useState<'all' | 'new' | 'contacted' | 'negotiating' | 'confirmed'>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('admin-auth');
      if (auth === 'true') {
        setIsAuthenticated(true);
      }
      // Load inquiries from localStorage
      const savedData = localStorage.getItem('sponsor-inquiries');
      if (savedData) {
        setInquiries(JSON.parse(savedData));
      }
    }
  }, []);

  const updateStatus = (index: number, status: SponsorInquiry['status']) => {
    const updated = [...inquiries];
    updated[index].status = status;
    setInquiries(updated);
    localStorage.setItem('sponsor-inquiries', JSON.stringify(updated));
  };

  const updateNotes = (index: number, notes: string) => {
    const updated = [...inquiries];
    updated[index].notes = notes;
    setInquiries(updated);
    localStorage.setItem('sponsor-inquiries', JSON.stringify(updated));
  };

  const deleteInquiry = (index: number) => {
    if (confirm('Are you sure you want to delete this inquiry?')) {
      const updated = inquiries.filter((_, i) => i !== index);
      setInquiries(updated);
      localStorage.setItem('sponsor-inquiries', JSON.stringify(updated));
      setSelectedInquiry(null);
    }
  };

  const filteredInquiries = inquiries.filter(i => {
    if (filter === 'all') return true;
    return (i.status || 'new') === filter;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="card p-8 text-center">
          <p className="text-gray-600 mb-4">Please login from the admin dashboard first</p>
          <Link href="/admin" className="btn-primary">Go to Admin</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <section className="bg-celtic-blue py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Sponsor Inquiries</h1>
              <p className="text-sm text-white/80">Manage sponsorship requests</p>
            </div>
            <Link href="/admin" className="text-sm text-white/80 hover:text-white">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-6 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="card p-4">
              <p className="text-xs text-gray-500 uppercase">Total</p>
              <p className="text-2xl font-bold text-celtic-dark">{inquiries.length}</p>
            </div>
            <div className="card p-4">
              <p className="text-xs text-gray-500 uppercase">New</p>
              <p className="text-2xl font-bold text-blue-600">
                {inquiries.filter(i => !i.status || i.status === 'new').length}
              </p>
            </div>
            <div className="card p-4">
              <p className="text-xs text-gray-500 uppercase">Contacted</p>
              <p className="text-2xl font-bold text-yellow-600">
                {inquiries.filter(i => i.status === 'contacted').length}
              </p>
            </div>
            <div className="card p-4">
              <p className="text-xs text-gray-500 uppercase">Negotiating</p>
              <p className="text-2xl font-bold text-orange-600">
                {inquiries.filter(i => i.status === 'negotiating').length}
              </p>
            </div>
            <div className="card p-4">
              <p className="text-xs text-gray-500 uppercase">Confirmed</p>
              <p className="text-2xl font-bold text-green-600">
                {inquiries.filter(i => i.status === 'confirmed').length}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Filter */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {(['all', 'new', 'contacted', 'negotiating', 'confirmed'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap ${
                    filter === f
                      ? 'bg-celtic-blue text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Inquiries */}
            {filteredInquiries.length === 0 ? (
              <div className="card p-8 text-center">
                <p className="text-gray-500">No sponsor inquiries yet</p>
                <Link href="/sponsors#inquiry" className="text-celtic-blue font-semibold hover:underline mt-2 inline-block">
                  View sponsor inquiry form
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredInquiries
                  .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
                  .map((inquiry, idx) => (
                  <div
                    key={idx}
                    className={`card p-5 cursor-pointer transition-shadow ${
                      selectedInquiry === idx ? 'ring-2 ring-celtic-blue' : 'hover:shadow-lg'
                    }`}
                    onClick={() => setSelectedInquiry(selectedInquiry === idx ? null : idx)}
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-celtic-dark">{inquiry.businessName}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            inquiry.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                            inquiry.status === 'negotiating' ? 'bg-orange-100 text-orange-700' :
                            inquiry.status === 'contacted' ? 'bg-yellow-100 text-yellow-700' :
                            inquiry.status === 'declined' ? 'bg-red-100 text-red-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {inquiry.status || 'new'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{inquiry.contactName}</p>
                      </div>
                      <p className="text-xs text-gray-400">
                        {new Date(inquiry.submittedAt).toLocaleDateString('en-GB')}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="text-xs bg-celtic-yellow/20 text-celtic-dark px-2 py-1 rounded">
                        {sponsorshipLabels[inquiry.sponsorshipType] || inquiry.sponsorshipType}
                      </span>
                      {inquiry.budget && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {budgetLabels[inquiry.budget] || inquiry.budget}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-500">{inquiry.email}</p>

                    {/* Expanded Details */}
                    {selectedInquiry === idx && (
                      <div className="mt-4 pt-4 border-t" onClick={e => e.stopPropagation()}>
                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                          {inquiry.phone && (
                            <div>
                              <p className="text-xs text-gray-500 uppercase">Phone</p>
                              <p className="text-celtic-dark">{inquiry.phone}</p>
                            </div>
                          )}
                          {inquiry.website && (
                            <div>
                              <p className="text-xs text-gray-500 uppercase">Website</p>
                              <a
                                href={inquiry.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-celtic-blue hover:underline truncate block"
                              >
                                {inquiry.website}
                              </a>
                            </div>
                          )}
                        </div>

                        {inquiry.message && (
                          <div className="mb-4">
                            <p className="text-xs text-gray-500 uppercase mb-1">Message</p>
                            <p className="text-sm text-gray-600">{inquiry.message}</p>
                          </div>
                        )}

                        {/* Notes */}
                        <div className="mb-4">
                          <p className="text-xs text-gray-500 uppercase mb-1">Internal Notes</p>
                          <textarea
                            value={inquiry.notes || ''}
                            onChange={e => updateNotes(idx, e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg text-sm h-20"
                            placeholder="Add notes about this inquiry..."
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            value={inquiry.status || 'new'}
                            onChange={e => updateStatus(idx, e.target.value as SponsorInquiry['status'])}
                            className="text-sm px-3 py-1.5 border rounded-lg"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="negotiating">Negotiating</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="declined">Declined</option>
                          </select>
                          <a
                            href={`mailto:${inquiry.email}?subject=Sponsorship at Cwmbran Celtic&body=Dear ${inquiry.contactName},%0D%0A%0D%0AThank you for your interest in sponsoring Cwmbran Celtic.%0D%0A%0D%0A`}
                            className="text-sm text-celtic-blue hover:underline"
                          >
                            Send Email
                          </a>
                          <button
                            onClick={() => deleteInquiry(idx)}
                            className="text-sm text-red-600 hover:underline ml-auto"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
