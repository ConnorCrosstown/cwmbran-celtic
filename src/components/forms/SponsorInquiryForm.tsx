'use client';

import { useState, useEffect } from 'react';
import { initializeCSRFToken, validateCSRFToken } from '@/lib/csrf';
import {
  validateEmail,
  validatePhone,
  validateURL,
  validateBusinessName,
  validateName,
  validateMessage,
  sanitizeFormData,
} from '@/lib/validation';

const sponsorshipTypes = [
  { id: 'kit', label: 'Kit Sponsorship', description: 'Your brand on our match day kit' },
  { id: 'match', label: 'Match Sponsorship', description: 'Sponsor an individual match' },
  { id: 'board', label: 'Pitch Side Board', description: 'Advertising board at the ground' },
  { id: 'programme', label: 'Programme Advert', description: 'Advert in our match day programme' },
  { id: 'partnership', label: 'Club Partnership', description: 'Become a club partner' },
  { id: 'other', label: 'Other / Not Sure', description: 'Discuss options' },
];

export default function SponsorInquiryForm() {
  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    sponsorshipType: '',
    budget: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    setCsrfToken(initializeCSRFToken());
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    const businessNameResult = validateBusinessName(formData.businessName);
    if (!businessNameResult.isValid) newErrors.businessName = businessNameResult.error!;

    const contactNameResult = validateName(formData.contactName, 'Contact name');
    if (!contactNameResult.isValid) newErrors.contactName = contactNameResult.error!;

    const emailResult = validateEmail(formData.email);
    if (!emailResult.isValid) newErrors.email = emailResult.error!;

    const phoneResult = validatePhone(formData.phone);
    if (!phoneResult.isValid) newErrors.phone = phoneResult.error!;

    const websiteResult = validateURL(formData.website);
    if (!websiteResult.isValid) newErrors.website = websiteResult.error!;

    if (!formData.sponsorshipType) {
      newErrors.sponsorshipType = 'Please select a sponsorship type';
    }

    const messageResult = validateMessage(formData.message);
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
      // Sanitize form data before storing/sending
      const sanitizedData = sanitizeFormData(formData);

      // In production, this would send to a secure API endpoint
      // For now, store securely with timestamp (sessionStorage, not localStorage)
      const submissions = sessionStorage.getItem('sponsor-inquiries');
      const parsed = submissions ? JSON.parse(submissions) : [];
      parsed.push({
        ...sanitizedData,
        submittedAt: new Date().toISOString(),
      });
      sessionStorage.setItem('sponsor-inquiries', JSON.stringify(parsed));

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
          We&apos;ve received your sponsorship inquiry. Our commercial team will be in touch within 48 hours.
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

      {/* Business Name */}
      <div className="mb-6">
        <label htmlFor="businessName" className="block text-sm font-semibold text-celtic-dark mb-2">
          Business Name *
        </label>
        <input
          type="text"
          id="businessName"
          name="businessName"
          required
          aria-invalid={!!errors.businessName}
          aria-describedby={errors.businessName ? 'businessName-error' : undefined}
          value={formData.businessName}
          onChange={e => setFormData({ ...formData, businessName: e.target.value })}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-celtic-blue focus:border-celtic-blue ${errors.businessName ? 'border-red-500' : ''}`}
          placeholder="Your business name"
        />
        {errors.businessName && (
          <p id="businessName-error" className="mt-1 text-sm text-red-600">{errors.businessName}</p>
        )}
      </div>

      {/* Contact Name */}
      <div className="mb-6">
        <label htmlFor="contactName" className="block text-sm font-semibold text-celtic-dark mb-2">
          Contact Name *
        </label>
        <input
          type="text"
          id="contactName"
          name="contactName"
          required
          aria-invalid={!!errors.contactName}
          aria-describedby={errors.contactName ? 'contactName-error' : undefined}
          value={formData.contactName}
          onChange={e => setFormData({ ...formData, contactName: e.target.value })}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-celtic-blue focus:border-celtic-blue ${errors.contactName ? 'border-red-500' : ''}`}
          placeholder="Your name"
        />
        {errors.contactName && (
          <p id="contactName-error" className="mt-1 text-sm text-red-600">{errors.contactName}</p>
        )}
      </div>

      {/* Email & Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-celtic-dark mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-celtic-blue focus:border-celtic-blue ${errors.email ? 'border-red-500' : ''}`}
            placeholder="your@email.com"
          />
          {errors.email && (
            <p id="email-error" className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-celtic-dark mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
            value={formData.phone}
            onChange={e => setFormData({ ...formData, phone: e.target.value })}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-celtic-blue focus:border-celtic-blue ${errors.phone ? 'border-red-500' : ''}`}
            placeholder="07123 456789"
          />
          {errors.phone && (
            <p id="phone-error" className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>
      </div>

      {/* Website */}
      <div className="mb-6">
        <label htmlFor="website" className="block text-sm font-semibold text-celtic-dark mb-2">
          Business Website
        </label>
        <input
          type="url"
          id="website"
          name="website"
          aria-invalid={!!errors.website}
          aria-describedby={errors.website ? 'website-error' : undefined}
          value={formData.website}
          onChange={e => setFormData({ ...formData, website: e.target.value })}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-celtic-blue focus:border-celtic-blue ${errors.website ? 'border-red-500' : ''}`}
          placeholder="https://www.yourbusiness.com"
        />
        {errors.website && (
          <p id="website-error" className="mt-1 text-sm text-red-600">{errors.website}</p>
        )}
      </div>

      {/* Sponsorship Type */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-celtic-dark mb-2">
          What type of sponsorship interests you? *
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sponsorshipTypes.map(type => (
            <button
              key={type.id}
              type="button"
              onClick={() => setFormData({ ...formData, sponsorshipType: type.id })}
              className={`p-4 rounded-lg border text-left transition-all ${
                formData.sponsorshipType === type.id
                  ? 'border-celtic-blue bg-celtic-blue/5'
                  : 'border-gray-200 hover:border-celtic-blue/50'
              }`}
            >
              <p className={`font-semibold text-sm ${
                formData.sponsorshipType === type.id ? 'text-celtic-blue' : 'text-celtic-dark'
              }`}>
                {type.label}
              </p>
              <p className="text-xs text-gray-500 mt-1">{type.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Budget Range */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-celtic-dark mb-2">
          Budget Range
        </label>
        <select
          value={formData.budget}
          onChange={e => setFormData({ ...formData, budget: e.target.value })}
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-celtic-blue focus:border-celtic-blue"
        >
          <option value="">Select a range (optional)</option>
          <option value="under-100">Under £100</option>
          <option value="100-250">£100 - £250</option>
          <option value="250-500">£250 - £500</option>
          <option value="500-1000">£500 - £1,000</option>
          <option value="1000-plus">£1,000+</option>
          <option value="discuss">Prefer to discuss</option>
        </select>
      </div>

      {/* Message */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-celtic-dark mb-2">
          Tell us about your business and what you&apos;re looking for
        </label>
        <textarea
          value={formData.message}
          onChange={e => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-celtic-blue focus:border-celtic-blue h-32"
          placeholder="Tell us about your business and your sponsorship goals..."
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting || !formData.businessName || !formData.contactName || !formData.email || !formData.sponsorshipType}
        className="w-full bg-celtic-blue text-white py-4 rounded-xl font-bold text-lg hover:bg-celtic-blue-dark transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        aria-busy={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
      </button>

      <p className="text-xs text-gray-500 text-center mt-4">
        A member of our team will respond within 48 hours.
      </p>
    </form>
  );
}
