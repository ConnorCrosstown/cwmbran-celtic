import { NextRequest, NextResponse } from 'next/server';
import { addSubscriber } from '@/lib/newsletter';
import { validateEmail } from '@/lib/validation';

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

    if (result.success) {
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
