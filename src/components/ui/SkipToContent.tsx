'use client';

/**
 * Skip to Content Link
 *
 * Accessibility feature that allows keyboard users to skip
 * navigation and go directly to main content.
 */

export default function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-celtic-yellow focus:text-celtic-dark focus:font-semibold focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-celtic-blue"
    >
      Skip to main content
    </a>
  );
}
