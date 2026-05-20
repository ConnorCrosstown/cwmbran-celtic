import { NextRequest, NextResponse } from 'next/server';

/**
 * Programme PDF generation endpoint.
 *
 * AUDIT-2026-05-20.md P1-3: the previous implementation imported `puppeteer`
 * directly at module top-level. Puppeteer is a `devDependency` (and ships a
 * ~280MB Chromium binary that exceeds Vercel's function size limit anyway),
 * so the route would 500 in production every time it was hit and inflate
 * cold-start times.
 *
 * The replacement plan is to render the programme via `@react-pdf/renderer`
 * (already in `dependencies`) using the existing `<ProgrammePDF />` component
 * in `src/components/programme-pdf/`. Until that is wired up, this endpoint
 * returns 501 so callers see a clear error rather than a build-time failure.
 */
export async function GET(_request: NextRequest) {
  return NextResponse.json(
    {
      error: 'PDF generation is temporarily unavailable.',
      detail:
        'The Puppeteer-based PDF renderer was removed pending migration to @react-pdf/renderer. See AUDIT-2026-05-20.md P1-3.',
    },
    { status: 501 },
  );
}
