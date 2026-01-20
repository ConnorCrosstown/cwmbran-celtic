import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { addSubscriber } from '@/lib/newsletter';
import { validateEmail } from '@/lib/validation';
import WelcomeEmail from '@/emails/WelcomeEmail';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cwmbranceltic.com';

// Initialize Resend lazily to avoid build errors when API key is not set
function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new Resend(apiKey);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName } = body;

    // Validate email
    if (!email || !validateEmail(email)) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // Sanitize first name
    const sanitizedFirstName = firstName?.trim().slice(0, 50) || undefined;

    // Add subscriber
    const result = await addSubscriber(email, sanitizedFirstName);

    if (result.success && result.unsubscribeToken) {
      // Send welcome email (don't block on this)
      const resend = getResendClient();
      if (resend) {
        const unsubscribeUrl = `${baseUrl}/api/newsletter/unsubscribe?token=${result.unsubscribeToken}`;

        // Send asynchronously without waiting
        resend.emails.send({
          from: 'Cwmbran Celtic AFC <newsletter@cwmbranceltic.com>',
          to: email,
          subject: 'Welcome to Cwmbran Celtic AFC!',
          react: WelcomeEmail({
            firstName: sanitizedFirstName,
            unsubscribeUrl,
          }),
        }).catch((err) => {
          console.error('Failed to send welcome email:', err);
        });
      }

      return NextResponse.json(result, { status: 200 });
    } else if (result.success) {
      // Already subscribed
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
