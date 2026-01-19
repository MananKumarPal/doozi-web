import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.BASE_URL || 'https://doozi-app-463323.uc.r.appspot.com';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const response = await fetch(`${API_URL}/new/app/users/protected/me`, {
      headers: {
        'Authorization': authHeader,
      },
    });

    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.error('[ME] Non-JSON response:', text.substring(0, 200));
      return NextResponse.json(
        { error: `Backend returned ${response.status}` },
        { status: 500 }
      );
    }

    if (!data.success) {
      return NextResponse.json(
        { error: data.error || 'Failed to get user profile' },
        { status: response.status || 400 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error('[ME] Error:', error.message);
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    const response = await fetch(`${API_URL}/new/app/users/protected/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(body),
    });

    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.error('[ME-UPDATE] Non-JSON response:', text.substring(0, 200));
      return NextResponse.json(
        { error: `Backend returned ${response.status}` },
        { status: 500 }
      );
    }

    if (!data.success) {
      return NextResponse.json(
        { error: data.error || 'Failed to update profile' },
        { status: response.status || 400 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error('[ME-UPDATE] Error:', error.message);
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    );
  }
}
