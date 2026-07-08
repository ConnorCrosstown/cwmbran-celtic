import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { validateEmail } from '@/lib/validation';

// Celtic Bond applications are emailed to the scheme organiser. There is no
// online payment gateway yet, so this is an application/enquiry — the organiser
// follows up to set up the monthly payment.
const BOND_RECIPIENT = 'Tony.Strange@zf.com';
const FROM = 'Cwmbran Celtic AFC <newsletter@cwmbranceltic.com>';

// Initialise Resend lazily so a missing key doesn't break the build.
function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  return apiKey ? new Resend(apiKey) : null;
}

const clean = (v: unknown, max = 100): string =>
  typeof v === 'string' ? v.trim().slice(0, max) : '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const firstName = clean(body.firstName, 60);
    const lastName = clean(body.lastName, 60);
    const email = clean(body.email, 254);
    const phone = clean(body.phone, 40);
    const bonds = clean(body.bonds, 3) || '1';
    const terms = body.terms === true;

    if (!firstName || !lastName) {
      return NextResponse.json(
        { success: false, message: 'Please enter your first and last name.' },
        { status: 400 },
      );
    }
    if (!email || !validateEmail(email).isValid) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address.' },
        { status: 400 },
      );
    }
    if (!terms) {
      return NextResponse.json(
        { success: false, message: 'Please accept the terms and conditions.' },
        { status: 400 },
      );
    }

    const bondsNum = parseInt(bonds, 10) || 1;
    const monthly = bondsNum * 5;

    const resend = getResendClient();
    if (!resend) {
      // Do NOT fake success — tell the user it couldn't be submitted.
      return NextResponse.json(
        { success: false, message: 'Sorry, we could not submit your application right now. Please email us directly.' },
        { status: 503 },
      );
    }

    const { error } = await resend.emails.send({
      from: FROM,
      to: BOND_RECIPIENT,
      replyTo: email,
      subject: `New Celtic Bond application — ${firstName} ${lastName}`,
      text: [
        'New Celtic Bond application from the website:',
        '',
        `Name:    ${firstName} ${lastName}`,
        `Email:   ${email}`,
        `Phone:   ${phone || '(not provided)'}`,
        `Bonds:   ${bondsNum} (£${monthly}/month)`,
        `Terms:   accepted`,
        '',
        'Reply to this email to contact the applicant.',
      ].join('\n'),
    });

    if (error) {
      console.error('[celtic-bond] Resend error:', error);
      return NextResponse.json(
        { success: false, message: 'Sorry, something went wrong sending your application. Please try again or email us.' },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true, message: 'Application received.' });
  } catch (err) {
    console.error('[celtic-bond] error:', err);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 },
    );
  }
}
