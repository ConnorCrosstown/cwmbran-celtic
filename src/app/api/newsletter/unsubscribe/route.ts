import { NextRequest, NextResponse } from 'next/server';
import { unsubscribeByToken } from '@/lib/newsletter';

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Invalid unsubscribe link.' },
        { status: 400 }
      );
    }

    const result = await unsubscribeByToken(token);

    if (result.success) {
      // Redirect to confirmation page
      return NextResponse.redirect(new URL('/newsletter/unsubscribed', request.url));
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
