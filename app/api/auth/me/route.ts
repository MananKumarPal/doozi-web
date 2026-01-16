import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.BASE_URL || 'https://doozi-app-463323.uc.r.appspot.com';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/auth/me');
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const url = `${API_URL}/new/app/users/protected/me`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.error('[AUTH/ME] Non-JSON response:', text.substring(0, 200));
      return NextResponse.json(
        { error: `Backend returned ${response.status}. Check endpoint URL: ${url}` },
        { status: 500 }
      );
    }

    if (data.success && data.result?.user) {
      const user = data.result.user;
      const result = {
        user: {
          id: user._id || user.id,
          email: user.email,
          name: user.full_name || user.fullName || user.name,
          fullName: user.full_name || user.fullName,
          is_creator: user.is_creator || user.isCreator || false,
          isCreator: user.is_creator || user.isCreator || false,
        },
      };
      return NextResponse.json(result, { status: 200 });
    }

    return NextResponse.json(
      { error: data.error || 'Not authenticated' },
      { status: response.status || 401 }
    );
  } catch (error: any) {
    console.error('[AUTH/ME] Error:', error.message);
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }
}
