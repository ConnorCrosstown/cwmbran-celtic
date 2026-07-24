// Resolve a post-login `next` redirect target against the current origin and
// only allow it if it stays same-origin. Using the WHATWG URL parser (not
// string prefixes) closes normalization bypasses such as `/%09/evil.com`,
// where the parser strips the tab and collapses the value to a
// protocol-relative `//evil.com`. Returns a same-origin relative path, or the
// `/admin` fallback for anything absolute, cross-origin, or unparseable.
export function safeNextPath(next: string | null, origin: string): string {
  if (!next) return '/admin';
  try {
    const url = new URL(next, origin);
    if (url.origin !== origin) return '/admin';
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return '/admin';
  }
}
