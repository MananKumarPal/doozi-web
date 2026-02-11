import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.BASE_URL || 'https://core-incentive-479214-p2.uc.r.appspot.com';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get('Authorization');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (authHeader) headers.Authorization = authHeader;

    const response = await fetch(`${API_URL}/new/business-campaigns`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const contentType = response.headers.get('content-type');
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      await response.text();
      return NextResponse.json(
        { error: `Backend returned ${response.status}` },
        { status: response.status >= 400 ? response.status : 500 }
      );
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Submission failed' },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
