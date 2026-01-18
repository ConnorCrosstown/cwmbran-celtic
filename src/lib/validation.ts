/**
 * Form Validation Utilities
 *
 * Provides validation functions for form inputs with sanitization.
 */

// Email validation regex (RFC 5322 compliant simplified)
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// UK phone number regex (flexible format)
const UK_PHONE_REGEX = /^(?:(?:\+44\s?|0)(?:7\d{3}|\d{2,4})[\s.-]?\d{3,4}[\s.-]?\d{3,4}|\d{10,11})$/;

// URL regex (simplified)
const URL_REGEX = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b[-a-zA-Z0-9()@:%_+.~#?&/=]*$/;

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate email address
 */
export function validateEmail(email: string): ValidationResult {
  const trimmed = email.trim();

  if (!trimmed) {
    return { isValid: false, error: 'Email is required' };
  }

  if (trimmed.length > 254) {
    return { isValid: false, error: 'Email is too long' };
  }

  if (!EMAIL_REGEX.test(trimmed)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  return { isValid: true };
}

/**
 * Validate phone number (UK format)
 */
export function validatePhone(phone: string): ValidationResult {
  const trimmed = phone.trim().replace(/\s/g, '');

  if (!trimmed) {
    return { isValid: true }; // Phone is optional
  }

  if (!UK_PHONE_REGEX.test(trimmed)) {
    return { isValid: false, error: 'Please enter a valid UK phone number' };
  }

  return { isValid: true };
}

/**
 * Validate URL
 */
export function validateURL(url: string): ValidationResult {
  const trimmed = url.trim();

  if (!trimmed) {
    return { isValid: true }; // URL is optional
  }

  if (!URL_REGEX.test(trimmed)) {
    return { isValid: false, error: 'Please enter a valid URL (starting with http:// or https://)' };
  }

  return { isValid: true };
}

/**
 * Validate name (letters, spaces, hyphens, apostrophes)
 */
export function validateName(name: string, fieldName = 'Name'): ValidationResult {
  const trimmed = name.trim();

  if (!trimmed) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  if (trimmed.length < 2) {
    return { isValid: false, error: `${fieldName} must be at least 2 characters` };
  }

  if (trimmed.length > 100) {
    return { isValid: false, error: `${fieldName} is too long` };
  }

  // Allow letters, spaces, hyphens, apostrophes (international names)
  if (!/^[\p{L}\s'-]+$/u.test(trimmed)) {
    return { isValid: false, error: `${fieldName} contains invalid characters` };
  }

  return { isValid: true };
}

/**
 * Validate business name (more permissive than personal name)
 */
export function validateBusinessName(name: string): ValidationResult {
  const trimmed = name.trim();

  if (!trimmed) {
    return { isValid: false, error: 'Business name is required' };
  }

  if (trimmed.length < 2) {
    return { isValid: false, error: 'Business name must be at least 2 characters' };
  }

  if (trimmed.length > 200) {
    return { isValid: false, error: 'Business name is too long' };
  }

  return { isValid: true };
}

/**
 * Validate text message (free text with length limits)
 */
export function validateMessage(message: string, maxLength = 2000): ValidationResult {
  const trimmed = message.trim();

  if (trimmed.length > maxLength) {
    return { isValid: false, error: `Message must be less than ${maxLength} characters` };
  }

  return { isValid: true };
}

/**
 * Sanitize text input (remove potential XSS)
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Validate and sanitize form data
 */
export function sanitizeFormData<T extends Record<string, string>>(data: T): T {
  const sanitized = {} as T;

  for (const [key, value] of Object.entries(data)) {
    sanitized[key as keyof T] = sanitizeInput(value) as T[keyof T];
  }

  return sanitized;
}
