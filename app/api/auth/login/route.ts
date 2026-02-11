import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.BASE_URL || 'https://core-incentive-479214-p2.uc.r.appspot.com';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/auth/login');
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const url = `${API_URL}/new/app/users/login`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.error('[LOGIN] Non-JSON response:', text.substring(0, 200));
      return NextResponse.json(
        { error: `Backend returned ${response.status}. Check endpoint URL: ${url}` },
        { status: 500 }
      );
    }

    if (data.success && data.data) {
      const user = data.data.user;
      const emailVerified = user.emailVerified || false;
      
      const result: any = {
        user: {
          id: user._id || user.id,
          email: user.email,
          name: user.full_name || user.fullName || user.name,
          is_creator: user.is_creator || user.isCreator || false,
          isCreator: user.is_creator || user.isCreator || false,
          emailVerified: emailVerified,
        },
        token: data.data.token,
        message: 'Login successful',
      };

      if (!emailVerified) {
        result.requires_verification = true;
        result.email = user.email;
      }

      return NextResponse.json(result, { status: 200 });
    }

    return NextResponse.json(
      { error: data.error || 'Invalid email or password' },
      { status: response.status || 401 }
    );
  } catch (error: any) {
    console.error('[LOGIN] Error:', error.message);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
