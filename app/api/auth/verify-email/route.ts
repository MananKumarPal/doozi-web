import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.BASE_URL || 'https://core-incentive-479214-p2.uc.r.appspot.com';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_URL}/new/app/users/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });

    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.error('[VERIFY-EMAIL] Non-JSON response:', text.substring(0, 200));
      return NextResponse.json(
        { error: `Backend returned ${response.status}` },
        { status: 500 }
      );
    }

    if (!data.success) {
      return NextResponse.json(
        { error: data.error || 'Verification failed' },
        { status: response.status || 400 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error('[VERIFY-EMAIL] Error:', error.message);
    return NextResponse.json(
      { error: 'An error occurred during verification' },
      { status: 500 }
    );
  }
}
