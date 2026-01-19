import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.BASE_URL || 'https://doozi-app-463323.uc.r.appspot.com';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      tiktok_link,
      instagram_link,
      applicant_notes,
      public_content_allowed,
    } = body;

    if (!tiktok_link && !instagram_link) {
      return NextResponse.json(
        { error: 'At least one social media profile link is required' },
        { status: 400 }
      );
    }

    const payload: any = {};

    if (tiktok_link) {
      payload.tiktok_link = tiktok_link;
    }

    if (instagram_link) {
      payload.instagram_link = instagram_link;
    }

    if (applicant_notes) {
      payload.applicant_notes = applicant_notes;
    }

    if (public_content_allowed !== undefined) {
      payload.public_content_allowed = Boolean(public_content_allowed);
    }

    const url = `${API_URL}/new/app/users/application`;
    console.log('POST /api/creator-applications');

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(payload),
    });

    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.error('[CREATOR-APP] Non-JSON response:', text.substring(0, 200));
      return NextResponse.json(
        { error: `Backend returned ${response.status}. Check endpoint URL: ${url}` },
        { status: 500 }
      );
    }

    if (data.success && data.data) {
      const result = {
        data: {
          id: data.data.id || data.data._id,
          tiktok_link: data.data.tiktok_link,
          instagram_link: data.data.instagram_link,
          applicant_notes: data.data.applicant_notes || applicant_notes || null,
          public_content_allowed: data.data.public_content_allowed || public_content_allowed || false,
          status: data.data.status || 'pending',
          applied_at: data.data.applied_at || data.data.created_at || new Date().toISOString(),
        },
        message: data.message || 'Application submitted successfully',
      };
      return NextResponse.json(result, { status: 201 });
    }

    return NextResponse.json(
      { error: data.error || 'Failed to submit application' },
      { status: response.status || 400 }
    );
  } catch (error: any) {
    console.error('[CREATOR-APP] Error:', error.message);
    return NextResponse.json(
      { error: 'An error occurred while submitting your application' },
      { status: 500 }
    );
  }
}
