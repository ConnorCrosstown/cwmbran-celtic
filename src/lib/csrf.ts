/**
 * CSRF Token Management
 *
 * Generates and validates CSRF tokens for form submissions.
 * Uses secure random generation and sessionStorage for client-side storage.
 */

// Generate a cryptographically secure random token
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Store token in sessionStorage (not localStorage for security)
export function storeCSRFToken(token: string): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('csrf_token', token);
  }
}

// Get stored token
export function getStoredCSRFToken(): string | null {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('csrf_token');
  }
  return null;
}

// Initialize a new token if one doesn't exist
export function initializeCSRFToken(): string {
  let token = getStoredCSRFToken();
  if (!token) {
    token = generateCSRFToken();
    storeCSRFToken(token);
  }
  return token;
}

// Validate a token against the stored one
export function validateCSRFToken(token: string): boolean {
  const storedToken = getStoredCSRFToken();
  if (!storedToken || !token) return false;

  // Constant-time comparison to prevent timing attacks
  if (storedToken.length !== token.length) return false;

  let result = 0;
  for (let i = 0; i < storedToken.length; i++) {
    result |= storedToken.charCodeAt(i) ^ token.charCodeAt(i);
  }
  return result === 0;
}

// Hook for React components
export function useCSRFToken(): string {
  if (typeof window === 'undefined') return '';
  return initializeCSRFToken();
}
