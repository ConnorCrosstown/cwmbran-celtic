'use client';

import { useState, useEffect } from 'react';
import { initializeCSRFToken, validateCSRFToken } from '@/lib/csrf';
import {
  validateEmail,
  validatePhone,
  validateName,
  validateMessage,
  sanitizeFormData,
} from '@/lib/validation';

const roles = [
  'Match Day Steward',
  'Tea Bar Helper',
  'Turnstile Operator',
  'Programme Seller',
  'Ground Maintenance',
  'Event Helper',
  'Other',
];

export default function VolunteerForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    roles: [] as string[],
    availability: '',
    experience: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    setCsrfToken(initializeCSRFToken());
  }, []);

  const handleRoleToggle = (role: string) => {
    setFormData(prev => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role],
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    const nameResult = validateName(formData.name, 'Full name');
    if (!nameResult.isValid) newErrors.name = nameResult.error!;

    const emailResult = validateEmail(formData.email);
    if (!emailResult.isValid) newErrors.email = emailResult.error!;

    const phoneResult = validatePhone(formData.phone);
    if (!phoneResult.isValid) newErrors.phone = phoneResult.error!;

    if (formData.roles.length === 0) {
      newErrors.roles = 'Please select at least one role';
    }

    const experienceResult = validateMessage(formData.experience, 1000);
    if (!experienceResult.isValid) newErrors.experience = experienceResult.error!;

    const messageResult = validateMessage(formData.message, 1000);
    if (!messageResult.isValid) newErrors.message = messageResult.error!;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate CSRF token
    if (!validateCSRFToken(csrfToken)) {
      setErrors({ form: 'Security validation failed. Please refresh the page and try again.' });
      return;
    }

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Sanitize text fields before storing
      const sanitizedData = {
        ...formData,
        name: sanitizeFormData({ name: formData.name }).name,
        email: sanitizeFormData({ email: formData.email }).email,
        phone: sanitizeFormData({ phone: formData.phone }).phone,
        experience: sanitizeFormData({ experience: formData.experience }).experience,
        message: sanitizeFormData({ message: formData.message }).message,
      };

      // In production, this would send to a secure API endpoint
      // For now, store in sessionStorage (more secure than localStorage)
      const submissions = sessionStorage.getItem('volunteer-submissions');
      const parsed = submissions ? JSON.parse(submissions) : [];
      parsed.push({
        ...sanitizedData,
        submittedAt: new Date().toISOString(),
      });
      sessionStorage.setItem('volunteer-submissions', JSON.stringify(parsed));

      setSubmitted(true);
    } catch {
      setErrors({ form: 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-celtic-dark mb-2">Thank You!</h3>
        <p className="text-gray-600 mb-4">
          We&apos;ve received your volunteer registration. Someone from the club will be in touch soon.
        </p>
        <p className="text-sm text-celtic-blue font-semibold">
          #UpTheCeltic
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
      {/* Hidden CSRF Token */}
      <input type="hidden" name="_csrf" value={csrfToken} />

      {/* Form-level error */}
      {errors.form && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg" role="alert">
          <p className="text-red-700 text-sm">{errors.form}</p>
        </div>
      )}

      {/* Name */}
      <div className="mb-6">
        <label htmlFor="volunteer-name" className="block text-sm font-semibold text-celtic-dark mb-2">
          Full Name *
        </label>
        <input
          type="text"
          id="volunteer-name"
          name="name"
          required
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'volunteer-name-error' : undefined}
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-celtic-blue focus:border-celtic-blue ${errors.name ? 'border-red-500' : ''}`}
          placeholder="Your name"
        />
        {errors.name && (
          <p id="volunteer-name-error" className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      {/* Email */}
      <div className="mb-6">
        <label htmlFor="volunteer-email" className="block text-sm font-semibold text-celtic-dark mb-2">
          Email Address *
        </label>
        <input
          type="email"
          id="volunteer-email"
          name="email"
          required
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'volunteer-email-error' : undefined}
          value={formData.email}
          onChange={e => setFormData({ ...formData, email: e.target.value })}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-celtic-blue focus:border-celtic-blue ${errors.email ? 'border-red-500' : ''}`}
          placeholder="your@email.com"
        />
        {errors.email && (
          <p id="volunteer-email-error" className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      {/* Phone */}
      <div className="mb-6">
        <label htmlFor="volunteer-phone" className="block text-sm font-semibold text-celtic-dark mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          id="volunteer-phone"
          name="phone"
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? 'volunteer-phone-error' : undefined}
          value={formData.phone}
          onChange={e => setFormData({ ...formData, phone: e.target.value })}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-celtic-blue focus:border-celtic-blue ${errors.phone ? 'border-red-500' : ''}`}
          placeholder="07123 456789"
        />
        {errors.phone && (
          <p id="volunteer-phone-error" className="mt-1 text-sm text-red-600">{errors.phone}</p>
        )}
      </div>

      {/* Roles */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-celtic-dark mb-2">
          Which roles interest you? *
        </label>
        <div className="grid grid-cols-2 gap-2">
          {roles.map(role => (
            <button
              key={role}
              type="button"
              onClick={() => handleRoleToggle(role)}
              className={`p-3 rounded-lg border text-sm font-medium transition-all text-left ${
                formData.roles.includes(role)
                  ? 'border-celtic-blue bg-celtic-blue/5 text-celtic-blue'
                  : 'border-gray-200 hover:border-celtic-blue/50'
              }`}
            >
              {formData.roles.includes(role) && (
                <svg className="w-4 h-4 inline mr-2 text-celtic-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-celtic-dark mb-2">
          Availability
        </label>
        <select
          value={formData.availability}
          onChange={e => setFormData({ ...formData, availability: e.target.value })}
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-celtic-blue focus:border-celtic-blue"
        >
          <option value="">Select your availability</option>
          <option value="every-match">Every home match</option>
          <option value="most-matches">Most home matches</option>
          <option value="occasional">Occasional matches</option>
          <option value="weekdays">Weekday evenings only</option>
          <option value="weekends">Weekends only</option>
          <option value="flexible">Flexible</option>
        </select>
      </div>

      {/* Experience */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-celtic-dark mb-2">
          Any relevant experience?
        </label>
        <textarea
          value={formData.experience}
          onChange={e => setFormData({ ...formData, experience: e.target.value })}
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-celtic-blue focus:border-celtic-blue h-24"
          placeholder="e.g. previous volunteer work, relevant skills, etc."
        />
      </div>

      {/* Message */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-celtic-dark mb-2">
          Anything else you&apos;d like us to know?
        </label>
        <textarea
          value={formData.message}
          onChange={e => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-celtic-blue focus:border-celtic-blue h-24"
          placeholder="Optional message..."
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting || !formData.name || !formData.email || formData.roles.length === 0}
        className="w-full bg-celtic-blue text-white py-4 rounded-xl font-bold text-lg hover:bg-celtic-blue-dark transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        aria-busy={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Registration'}
      </button>

      <p className="text-xs text-gray-500 text-center mt-4">
        By submitting this form you agree to be contacted about volunteering opportunities.
      </p>
    </form>
  );
}
