'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface VolunteerSubmission {
  name: string;
  email: string;
  phone: string;
  roles: string[];
  availability: string;
  experience: string;
  message: string;
  submittedAt: string;
  status?: 'new' | 'contacted' | 'confirmed' | 'declined';
}

export default function VolunteersAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [submissions, setSubmissions] = useState<VolunteerSubmission[]>([]);
  const [filter, setFilter] = useState<'all' | 'new' | 'contacted' | 'confirmed'>('all');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('admin-auth');
      if (auth === 'true') {
        setIsAuthenticated(true);
      }
      // Load submissions from localStorage
      const savedData = localStorage.getItem('volunteer-submissions');
      if (savedData) {
        setSubmissions(JSON.parse(savedData));
      }
    }
  }, []);

  const updateStatus = (index: number, status: VolunteerSubmission['status']) => {
    const updated = [...submissions];
    updated[index].status = status;
    setSubmissions(updated);
    localStorage.setItem('volunteer-submissions', JSON.stringify(updated));
  };

  const deleteSubmission = (index: number) => {
    if (confirm('Are you sure you want to delete this submission?')) {
      const updated = submissions.filter((_, i) => i !== index);
      setSubmissions(updated);
      localStorage.setItem('volunteer-submissions', JSON.stringify(updated));
    }
  };

  const filteredSubmissions = submissions.filter(s => {
    if (filter === 'all') return true;
    return (s.status || 'new') === filter;
  });

  const availabilityLabels: Record<string, string> = {
    'every-match': 'Every home match',
    'most-matches': 'Most home matches',
    'occasional': 'Occasional matches',
    'weekdays': 'Weekday evenings',
    'weekends': 'Weekends only',
    'flexible': 'Flexible',
  };

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
              <h1 className="text-2xl font-bold text-white">Volunteer Submissions</h1>
              <p className="text-sm text-white/80">Manage volunteer sign-ups</p>
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card p-4">
              <p className="text-xs text-gray-500 uppercase">Total</p>
              <p className="text-2xl font-bold text-celtic-dark">{submissions.length}</p>
            </div>
            <div className="card p-4">
              <p className="text-xs text-gray-500 uppercase">New</p>
              <p className="text-2xl font-bold text-blue-600">
                {submissions.filter(s => !s.status || s.status === 'new').length}
              </p>
            </div>
            <div className="card p-4">
              <p className="text-xs text-gray-500 uppercase">Contacted</p>
              <p className="text-2xl font-bold text-yellow-600">
                {submissions.filter(s => s.status === 'contacted').length}
              </p>
            </div>
            <div className="card p-4">
              <p className="text-xs text-gray-500 uppercase">Confirmed</p>
              <p className="text-2xl font-bold text-green-600">
                {submissions.filter(s => s.status === 'confirmed').length}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Filter */}
            <div className="flex gap-2 mb-6">
              {(['all', 'new', 'contacted', 'confirmed'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
                    filter === f
                      ? 'bg-celtic-blue text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Submissions */}
            <div className="space-y-4">
              {filteredSubmissions.length === 0 ? (
                <div className="card p-8 text-center">
                  <p className="text-gray-500">No volunteer submissions yet</p>
                  <Link href="/community/volunteer" className="text-celtic-blue font-semibold hover:underline mt-2 inline-block">
                    View volunteer page
                  </Link>
                </div>
              ) : (
                filteredSubmissions
                  .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
                  .map((submission, idx) => (
                  <div key={idx} className="card p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-lg text-celtic-dark">{submission.name}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            submission.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                            submission.status === 'contacted' ? 'bg-yellow-100 text-yellow-700' :
                            submission.status === 'declined' ? 'bg-red-100 text-red-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {submission.status || 'new'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{submission.email}</p>
                        {submission.phone && (
                          <p className="text-sm text-gray-500">{submission.phone}</p>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">
                        {new Date(submission.submittedAt).toLocaleDateString('en-GB')}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase mb-1">Interested Roles</p>
                        <div className="flex flex-wrap gap-1">
                          {submission.roles.map((role, i) => (
                            <span key={i} className="text-xs bg-celtic-blue/10 text-celtic-blue px-2 py-1 rounded">
                              {role}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase mb-1">Availability</p>
                        <p className="text-sm text-celtic-dark">
                          {availabilityLabels[submission.availability] || submission.availability || 'Not specified'}
                        </p>
                      </div>
                    </div>

                    {submission.experience && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 uppercase mb-1">Experience</p>
                        <p className="text-sm text-gray-600">{submission.experience}</p>
                      </div>
                    )}

                    {submission.message && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 uppercase mb-1">Message</p>
                        <p className="text-sm text-gray-600">{submission.message}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-4 border-t">
                      <select
                        value={submission.status || 'new'}
                        onChange={e => updateStatus(idx, e.target.value as VolunteerSubmission['status'])}
                        className="text-sm px-3 py-1.5 border rounded-lg"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="declined">Declined</option>
                      </select>
                      <a
                        href={`mailto:${submission.email}?subject=Volunteering at Cwmbran Celtic`}
                        className="text-sm text-celtic-blue hover:underline"
                      >
                        Send Email
                      </a>
                      <button
                        onClick={() => deleteSubmission(idx)}
                        className="text-sm text-red-600 hover:underline ml-auto"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
