import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.BASE_URL || 'https://doozi-app-463323.uc.r.appspot.com';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    const authHeader = request.headers.get('Authorization');
    const headers: Record<string, string> = { 
      'Content-Type': 'application/json' 
    };
    
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const response = await fetch(
      `${API_URL}/new/app/users/check-username?username=${encodeURIComponent(username)}`,
      { headers }
    );

    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.error('[CHECK-USERNAME] Non-JSON response:', text.substring(0, 200));
      return NextResponse.json(
        { error: `Backend returned ${response.status}` },
        { status: 500 }
      );
    }

    if (!data.success) {
      return NextResponse.json(
        { error: data.error || 'Failed to check username' },
        { status: response.status || 400 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error('[CHECK-USERNAME] Error:', error.message);
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    );
  }
}
