import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.BASE_URL || 'https://doozi-app-463323.uc.r.appspot.com';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/auth/signup');
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const signupUrl = `${API_URL}/new/app/users/signup`;
    const signupResponse = await fetch(signupUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const contentType = signupResponse.headers.get('content-type');
    let signupData;

    if (contentType && contentType.includes('application/json')) {
      signupData = await signupResponse.json();
    } else {
      const text = await signupResponse.text();
      console.error('[SIGNUP] Non-JSON response:', text.substring(0, 200));
      return NextResponse.json(
        { error: `Backend returned ${signupResponse.status}. Check endpoint URL: ${signupUrl}` },
        { status: 500 }
      );
    }

    if (!signupData.success) {
      return NextResponse.json(
        { error: signupData.error || 'Signup failed' },
        { status: signupResponse.status || 400 }
      );
    }

    const loginUrl = `${API_URL}/new/app/users/login`;
    const loginResponse = await fetch(loginUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const loginContentType = loginResponse.headers.get('content-type');
    let loginData;

    if (loginContentType && loginContentType.includes('application/json')) {
      loginData = await loginResponse.json();
    } else {
      const text = await loginResponse.text();
      console.error('[SIGNUP] Login non-JSON response:', text.substring(0, 200));
      return NextResponse.json(
        { error: 'Account created but failed to get authentication token' },
        { status: 500 }
      );
    }

    if (loginData.success && loginData.data) {
      const user = signupData.result?.user || loginData.data.user;
      const result = {
        user: {
          id: user._id || user.id || signupData.result?.user_id,
          email: user.email || email,
          name: user.full_name || user.fullName || user.name,
          is_creator: user.is_creator || user.isCreator || false,
          isCreator: user.is_creator || user.isCreator || false,
        },
        token: loginData.data.token,
        message: signupData.message || 'Account created successfully',
      };
      return NextResponse.json(result, { status: 201 });
    }

    return NextResponse.json(
      { error: 'Account created but failed to get authentication token' },
      { status: 500 }
    );
  } catch (error: any) {
    console.error('[SIGNUP] Error:', error.message);
    return NextResponse.json(
      { error: 'An error occurred during signup' },
      { status: 500 }
    );
  }
}
