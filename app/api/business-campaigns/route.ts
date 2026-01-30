import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const {
      businessName,
      businessCategory,
      businessAddress,
      city,
      country,
      contactEmail,
      phone,
      inKindValue,
      paidCompensation,
      highlightRequest,
      brandGuidelines,
      preferredCreatorType,
      deliveryBy,
      postDoozi,
      postTiktok,
      postInstagram,
      reuseContent,
      confirmIndependent,
      confirmAccurate,
    } = body;

    if (!businessName?.trim() || !businessCategory || !businessAddress?.trim() || !city?.trim() || !country?.trim()) {
      return NextResponse.json({ error: 'Missing required business fields' }, { status: 400 });
    }
    if (!contactEmail?.trim() || !phone?.trim() || !inKindValue?.trim() || !highlightRequest?.trim() || !deliveryBy) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(contactEmail).trim())) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }
    const phoneDigits = String(phone).replace(/[\s\-\(\)\+]/g, '');
    if (!/\d{6,}/.test(phoneDigits)) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
    }
    const inKindDigits = String(inKindValue).replace(/[$,]/g, '');
    if (!/\d/.test(inKindDigits)) {
      return NextResponse.json({ error: 'In-kind value must include a number' }, { status: 400 });
    }
    if (paidCompensation && String(paidCompensation).trim() && !/\d/.test(String(paidCompensation).replace(/[$,]/g, ''))) {
      return NextResponse.json({ error: 'Paid compensation must be a numeric amount' }, { status: 400 });
    }
    if (reuseContent === undefined || reuseContent === null) {
      return NextResponse.json({ error: 'Content usage (reuse) is required' }, { status: 400 });
    }
    if (!confirmIndependent || !confirmAccurate) {
      return NextResponse.json({ error: 'Both confirmations are required' }, { status: 400 });
    }

    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 30);
    if (new Date(deliveryBy) < minDate) {
      return NextResponse.json({ error: 'Delivery date must be at least 30 days from today' }, { status: 400 });
    }

    const id = `dev-${Date.now()}`;
    const data = {
      id,
      businessName: businessName.trim(),
      businessCategory,
      businessAddress: businessAddress.trim(),
      city: city.trim(),
      country: country.trim(),
      contactEmail: contactEmail.trim(),
      phone: phone.trim(),
      inKindValue: inKindValue.trim(),
      paidCompensation: paidCompensation?.trim() || null,
      highlightRequest: highlightRequest.trim(),
      brandGuidelines: brandGuidelines?.trim() || null,
      preferredCreatorType: preferredCreatorType || null,
      deliveryBy,
      postDoozi: Boolean(postDoozi),
      postTiktok: Boolean(postTiktok),
      postInstagram: Boolean(postInstagram),
      reuseContent: Boolean(reuseContent),
      submittedAt: new Date().toISOString(),
    };

    return NextResponse.json({ data, inDevelopment: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
