import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.BASE_URL || 'https://core-incentive-479214-p2.uc.r.appspot.com';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    console.log('GET /api/creator-applications/status');
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    let userId: string | null = null;
    
    try {
      const tokenParts = authHeader.replace('Bearer ', '').split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
        userId = payload.userId;
      }
    } catch (e) {
    }
    
    if (!userId) {
      const userResponse = await fetch(`${API_URL}/new/app/users/protected/me`, {
        headers: { 'Authorization': authHeader },
      });
      
      const userData = await userResponse.json();
      if (!userData.success || !userData.result?.user?.id) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 401 }
        );
      }
      
      userId = userData.result.user.id;
    }
    
    const statusUrl = `${API_URL}/new/app/users/application/status/${userId}?t=${Date.now()}`;
    const response = await fetch(statusUrl, {
      method: 'GET',
      headers: { 
        'Authorization': authHeader,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
      cache: 'no-store',
    });
    
    const responseText = await response.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('[CREATOR-APP-STATUS] Failed to parse JSON:', e);
      return NextResponse.json(
        { error: 'Invalid response from backend' },
        { status: 500 }
      );
    }
    
    if (data.success === true && data.hasApplication === true && data.data) {
      return NextResponse.json({
        success: true,
        hasApplication: true,
        application: {
          id: data.data.id,
          status: data.data.status,
          tiktok_link: data.data.tiktok_link,
          tiktok_followers: data.data.tiktok_followers,
          instagram_link: data.data.instagram_link,
          instagram_followers: data.data.instagram_followers,
          public_content_allowed: data.data.public_content_allowed || false,
          applied_at: data.data.applied_at,
          reviewed_at: data.data.reviewed_at,
          admin_notes: data.data.admin_notes,
          created_at: data.data.created_at,
        },
      }, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });
    }
    
    return NextResponse.json({
      success: true,
      hasApplication: false,
      application: null,
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error: any) {
    console.error('[CREATOR-APP-STATUS] Error:', error.message);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
