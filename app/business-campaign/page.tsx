'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Building2, DollarSign, FileText, Calendar, Share2, CheckCircle, Download } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const CATEGORIES = ['Restaurant', 'Hotel', 'Experience', 'Tour', 'Bar', 'Retail', 'Other'];
const CREATOR_TYPES = ['Food', 'Luxury travel', 'Lifestyle', 'Adventure', 'Open to all'];

const minDeliveryDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().slice(0, 10);
};

const onlyPhone = (v: string) => v.replace(/[^\d+\-() ]/g, '');
const onlyCurrency = (v: string) => v.replace(/[^\d$,.]/g, '');

export default function BusinessCampaignPage() {
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [receipt, setReceipt] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    businessName: '',
    businessCategory: '',
    businessAddress: '',
    city: '',
    country: '',
    contactEmail: '',
    phone: '',
    inKindValue: '',
    paidCompensation: '',
    paidCompensationOption: 'amount' as 'amount' | 'not_offering',
    highlightRequest: '',
    brandGuidelines: '',
    preferredCreatorType: '',
    deliveryBy: '',
    postDoozi: true,
    postTiktok: false,
    postInstagram: false,
    reuseContent: null as boolean | null,
    confirmAccurate: false,
  });


  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.businessName.trim()) e.businessName = 'Required';
    if (!form.businessCategory) e.businessCategory = 'Required';
    if (!form.businessAddress.trim()) e.businessAddress = 'Required';
    if (!form.city.trim()) e.city = 'Required';
    if (!form.country.trim()) e.country = 'Required';
    if (!form.contactEmail.trim()) e.contactEmail = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail.trim())) e.contactEmail = 'Enter a valid email';
    if (!form.phone.trim()) e.phone = 'Required';
    else if (!/\d{6,}/.test(form.phone.replace(/[\s\-\(\)\+]/g, ''))) e.phone = 'Enter a valid phone number';
    if (!form.inKindValue.trim()) e.inKindValue = 'Required';
    else if (!/\d/.test(form.inKindValue.replace(/[$,]/g, ''))) e.inKindValue = 'Enter a numeric value (e.g. 200 or $200)';
    if (form.paidCompensationOption === 'amount' && form.paidCompensation.trim() && !/\d/.test(form.paidCompensation.replace(/[$,]/g, ''))) {
      e.paidCompensation = 'Enter a numeric amount';
    }
    if (!form.highlightRequest.trim()) e.highlightRequest = 'Required';
    if (!form.deliveryBy) e.deliveryBy = 'Required';
    if (form.deliveryBy) {
      const min = minDeliveryDate();
      if (form.deliveryBy < min) e.deliveryBy = 'Minimum 30 days from today';
    }
    if (form.reuseContent === null) e.reuseContent = 'Please select Yes or No';
    if (!form.confirmAccurate) e.confirmAccurate = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    setErrors({});
    try {
      const payload = {
        businessName: form.businessName.trim(),
        businessCategory: form.businessCategory,
        businessAddress: form.businessAddress.trim(),
        city: form.city.trim(),
        country: form.country.trim(),
        contactEmail: form.contactEmail.trim(),
        phone: form.phone.trim(),
        inKindValue: form.inKindValue.trim(),
        paidCompensation: form.paidCompensationOption === 'amount' ? form.paidCompensation.trim() || null : null,
        highlightRequest: form.highlightRequest.trim(),
        brandGuidelines: form.brandGuidelines.trim() || null,
        preferredCreatorType: form.preferredCreatorType || null,
        deliveryBy: form.deliveryBy,
        postDoozi: true,
        postTiktok: form.postTiktok,
        postInstagram: form.postInstagram,
        reuseContent: form.reuseContent,
        confirmAccurate: form.confirmAccurate,
      };
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await fetch('/api/business-campaigns', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors({ submit: data.error || 'Submission failed' });
        return;
      }
      setReceipt(data.data || { id: data.id, ...payload });
      setSubmitted(true);
    } catch {
      setErrors({ submit: 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadReceipt = () => {
    const id = receipt?.id || 'N/A';
    const date = receipt?.submittedAt ? new Date(receipt.submittedAt).toLocaleString() : new Date().toLocaleString();
    const posts = ['Doozi', receipt?.postTiktok && 'TikTok', receipt?.postInstagram && 'Instagram'].filter(Boolean).join(', ');
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Doozi Campaign Receipt – ${(receipt?.businessName || '').replace(/</g, '&lt;')}</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; max-width: 640px; margin: 0 auto; padding: 32px 24px; color: #18181B; line-height: 1.5; }
    .header { text-align: center; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 2px solid #f4f4f5; }
    .logo { font-size: 24px; font-weight: 800; background: linear-gradient(90deg, #FF4785, #8F65F6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .title { font-size: 14px; color: #71717a; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 4px; }
    .section { margin-bottom: 24px; }
    .section h2 { font-size: 12px; color: #8F65F6; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 12px 0; font-weight: 600; }
    .row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #f4f4f5; font-size: 14px; }
    .row:last-child { border-bottom: none; }
    .label { color: #71717a; }
    .value { font-weight: 500; text-align: right; max-width: 60%; }
    .footer { margin-top: 32px; padding-top: 24px; border-top: 2px solid #f4f4f5; font-size: 12px; color: #71717a; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">Doozi</div>
    <div class="title">Campaign request receipt</div>
    <div class="row" style="margin-top: 16px; border: none;"><span class="label">Submission ID</span><span class="value">${String(id).replace(/</g, '&lt;')}</span></div>
    <div class="row" style="border: none;"><span class="label">Date</span><span class="value">${date}</span></div>
  </div>
  <div class="section">
    <h2>Business information</h2>
    <div class="row"><span class="label">Business name</span><span class="value">${(receipt?.businessName || '—').replace(/</g, '&lt;')}</span></div>
    <div class="row"><span class="label">Category</span><span class="value">${(receipt?.businessCategory || '—').replace(/</g, '&lt;')}</span></div>
    <div class="row"><span class="label">Address</span><span class="value">${(receipt?.businessAddress || '—').replace(/</g, '&lt;')}</span></div>
    <div class="row"><span class="label">City</span><span class="value">${(receipt?.city || '—').replace(/</g, '&lt;')}</span></div>
    <div class="row"><span class="label">Country</span><span class="value">${(receipt?.country || '—').replace(/</g, '&lt;')}</span></div>
    <div class="row"><span class="label">Contact email</span><span class="value">${(receipt?.contactEmail || '—').replace(/</g, '&lt;')}</span></div>
    <div class="row"><span class="label">Phone</span><span class="value">${(receipt?.phone || '—').replace(/</g, '&lt;')}</span></div>
  </div>
  <div class="section">
    <h2>Campaign investment</h2>
    <div class="row"><span class="label">In-kind value</span><span class="value">${(receipt?.inKindValue || '—').replace(/</g, '&lt;')}</span></div>
    <div class="row"><span class="label">Paid compensation</span><span class="value">${(receipt?.paidCompensation || 'Not offering').replace(/</g, '&lt;')}</span></div>
  </div>
  <div class="section">
    <h2>Content</h2>
    <div class="row"><span class="label">Highlight request</span><span class="value">${(receipt?.highlightRequest || '—').replace(/</g, '&lt;').replace(/\n/g, ' ')}</span></div>
    <div class="row"><span class="label">Delivery by</span><span class="value">${(receipt?.deliveryBy || '—').replace(/</g, '&lt;')}</span></div>
    <div class="row"><span class="label">Post to</span><span class="value">${posts.replace(/</g, '&lt;')}</span></div>
    <div class="row"><span class="label">Reuse for marketing</span><span class="value">${receipt?.reuseContent === true ? 'Yes' : 'No'}</span></div>
  </div>
  <div class="footer">Doozi – Travel discovery made simple. This receipt confirms your campaign request was received.</div>
</body>
</html>`;
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `doozi-campaign-receipt-${receipt?.id || Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center">
                <img src="/logo.svg" alt="Doozi" className="h-10 sm:h-12 w-auto" />
              </Link>
              <Link href={user ? '/dashboard' : '/'} className="flex items-center gap-2 text-sm text-brand-gray hover:text-brand-pink transition-colors font-medium">
                <ArrowLeft className="h-4 w-4" />
                {user ? 'Back to Dashboard' : 'Back to Home'}
              </Link>
            </div>
          </div>
        </header>
        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 sm:p-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-brand-pink to-brand-purple rounded-2xl mb-6 shadow-lg">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-brand-black mb-2">Thank You!</h1>
            <p className="text-brand-gray mb-6 leading-relaxed">
              We can&apos;t wait to help get your business discovered — and create some incredible content along the way.
            </p>
            <button
              type="button"
              onClick={downloadReceipt}
              className="inline-flex items-center justify-center gap-2 button-primary w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold mb-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <Download className="w-5 h-5" />
              Download Receipt
            </button>
            <p className="text-sm text-brand-gray mb-6">
              Our team will review your submission and follow up with next steps shortly.
            </p>
            <Link
              href={user ? '/dashboard' : '/'}
              className="inline-flex items-center gap-2 text-brand-pink font-semibold hover:underline"
            >
              {user ? 'Return to Dashboard' : 'Return to Home'}
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center">
              <img src="/logo.svg" alt="Doozi" className="h-10 sm:h-12 w-auto" />
            </Link>
            <Link href={user ? '/dashboard' : '/'} className="flex items-center gap-2 text-sm font-medium text-brand-gray hover:text-brand-pink transition-colors py-2 px-3 rounded-lg hover:bg-gray-50">
              <ArrowLeft className="h-4 w-4" />
              {user ? 'Back to Dashboard' : 'Back to Home'}
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-purple via-brand-pink/90 to-brand-purple p-8 sm:p-10 text-white mb-10 shadow-xl">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15)_0%,transparent_50%)]" />
          <div className="relative flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2 tracking-tight">
                Get Your Business Discovered on Doozi
              </h1>
              <p className="text-white/90 text-sm sm:text-base leading-relaxed max-w-2xl">
                Be one of the first businesses featured — a video-first travel app where travelers discover where to eat, stay, and explore through authentic short-form videos from real travel creators.
              </p>
              <p className="text-white/80 text-sm mt-3">
                By submitting, you&apos;re applying to be featured and matched with creators who will experience your business and create content that gets seen.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="bg-white rounded-2xl shadow-md p-6 sm:p-8 border border-gray-100/80">
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-brand-purple/10 text-brand-purple font-bold text-sm">1</span>
              <h2 className="text-lg font-bold text-brand-black flex items-center gap-2">
                <Building2 className="w-5 h-5 text-brand-purple" />
                Business Information
              </h2>
            </div>
            <div className="space-y-5">
              <div>
                <label htmlFor="businessName" className="block text-sm font-semibold text-brand-black mb-1.5">Business Name</label>
                <input
                  id="businessName"
                  type="text"
                  value={form.businessName}
                  onChange={(e) => setForm((f) => ({ ...f, businessName: e.target.value }))}
                  className={`input py-3 rounded-xl ${errors.businessName ? 'border-red-500 focus:ring-red-500/20' : ''}`}
                  placeholder="Your business name"
                />
                {errors.businessName && <p className="mt-1.5 text-sm text-red-500">{errors.businessName}</p>}
              </div>
              <div>
                <label htmlFor="businessCategory" className="block text-sm font-semibold text-brand-black mb-1.5">Business Category</label>
                <select
                  id="businessCategory"
                  value={form.businessCategory}
                  onChange={(e) => setForm((f) => ({ ...f, businessCategory: e.target.value }))}
                  className={`input py-3 rounded-xl ${errors.businessCategory ? 'border-red-500 focus:ring-red-500/20' : ''}`}
                >
                  <option value="">Select category...</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-brand-gray">Restaurant, Hotel, Experience, Tour, Bar, Retail, Other</p>
                {errors.businessCategory && <p className="mt-1.5 text-sm text-red-500">{errors.businessCategory}</p>}
              </div>
              <div>
                <label htmlFor="businessAddress" className="block text-sm font-semibold text-brand-black mb-1.5">Business Address</label>
                <input
                  id="businessAddress"
                  type="text"
                  value={form.businessAddress}
                  onChange={(e) => setForm((f) => ({ ...f, businessAddress: e.target.value }))}
                  className={`input py-3 rounded-xl ${errors.businessAddress ? 'border-red-500 focus:ring-red-500/20' : ''}`}
                  placeholder="Street address"
                />
                {errors.businessAddress && <p className="mt-1.5 text-sm text-red-500">{errors.businessAddress}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="city" className="block text-sm font-semibold text-brand-black mb-1.5">City</label>
                  <input
                    id="city"
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                    className={`input py-3 rounded-xl ${errors.city ? 'border-red-500 focus:ring-red-500/20' : ''}`}
                  />
                  {errors.city && <p className="mt-1.5 text-sm text-red-500">{errors.city}</p>}
                </div>
                <div>
                  <label htmlFor="country" className="block text-sm font-semibold text-brand-black mb-1.5">Country</label>
                  <input
                    id="country"
                    type="text"
                    value={form.country}
                    onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                    className={`input py-3 rounded-xl ${errors.country ? 'border-red-500 focus:ring-red-500/20' : ''}`}
                  />
                  {errors.country && <p className="mt-1.5 text-sm text-red-500">{errors.country}</p>}
                </div>
              </div>
              <div>
                <label htmlFor="contactEmail" className="block text-sm font-semibold text-brand-black mb-1.5">Primary Contact Email</label>
                <input
                  id="contactEmail"
                  type="email"
                  value={form.contactEmail}
                  onChange={(e) => setForm((f) => ({ ...f, contactEmail: e.target.value }))}
                  className={`input py-3 rounded-xl ${errors.contactEmail ? 'border-red-500 focus:ring-red-500/20' : ''}`}
                />
                {errors.contactEmail && <p className="mt-1.5 text-sm text-red-500">{errors.contactEmail}</p>}
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-brand-black mb-1.5">Phone Number</label>
                <input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: onlyPhone(e.target.value) }))}
                  className={`input py-3 rounded-xl ${errors.phone ? 'border-red-500 focus:ring-red-500/20' : ''}`}
                  placeholder="e.g. +1 234 567 8900"
                />
                {errors.phone && <p className="mt-1.5 text-sm text-red-500">{errors.phone}</p>}
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-md p-6 sm:p-8 border border-gray-100/80">
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-brand-purple/10 text-brand-purple font-bold text-sm">2</span>
              <h2 className="text-lg font-bold text-brand-black flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-brand-purple" />
                Campaign Investment
              </h2>
            </div>
            <div className="space-y-5">
              <div>
                <label htmlFor="inKindValue" className="block text-sm font-semibold text-brand-black mb-1.5">In-Kind Experience Value (Required)</label>
                <p className="text-xs text-brand-gray mb-2">
                  Must cover the full service, meal, or experience for the creator plus any taxes & gratuities. A $25 Doozi listing fee applies at checkout. Creators are never out of pocket.
                </p>
                <input
                  id="inKindValue"
                  type="text"
                  inputMode="decimal"
                  value={form.inKindValue}
                  onChange={(e) => setForm((f) => ({ ...f, inKindValue: onlyCurrency(e.target.value) }))}
                  className={`input py-3 rounded-xl ${errors.inKindValue ? 'border-red-500 focus:ring-red-500/20' : ''}`}
                  placeholder="e.g. $200 or 200"
                />
                {errors.inKindValue && <p className="mt-1.5 text-sm text-red-500">{errors.inKindValue}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-brand-black mb-2">Optional: Paid Creator Compensation</label>
                <p className="text-xs text-brand-gray mb-3">
                  Not required; paid compensation increases reach and helps match you with creators who have larger audiences.
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="paidOption"
                      checked={form.paidCompensationOption === 'amount'}
                      onChange={() => setForm((f) => ({ ...f, paidCompensationOption: 'amount' }))}
                      className="w-4 h-4 text-brand-pink focus:ring-brand-pink"
                    />
                    <span className="text-sm">Enter amount:</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={form.paidCompensation}
                      onChange={(e) => setForm((f) => ({ ...f, paidCompensation: onlyCurrency(e.target.value) }))}
                      className={`input py-2 rounded-lg max-w-[120px] text-sm ${errors.paidCompensation ? 'border-red-500' : ''}`}
                      placeholder="e.g. $100"
                      disabled={form.paidCompensationOption !== 'amount'}
                    />
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="paidOption"
                      checked={form.paidCompensationOption === 'not_offering'}
                      onChange={() => setForm((f) => ({ ...f, paidCompensationOption: 'not_offering' }))}
                      className="w-4 h-4 text-brand-pink focus:ring-brand-pink"
                    />
                    <span className="text-sm">Not offering paid compensation</span>
                  </label>
                </div>
                {errors.paidCompensation && <p className="mt-1.5 text-sm text-red-500">{errors.paidCompensation}</p>}
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-md p-6 sm:p-8 border border-gray-100/80">
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-brand-purple/10 text-brand-purple font-bold text-sm">3</span>
              <h2 className="text-lg font-bold text-brand-black flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-purple" />
                Content Details
              </h2>
            </div>
            <div className="space-y-5">
              <div>
                <label htmlFor="highlightRequest" className="block text-sm font-semibold text-brand-black mb-1.5">What would you like the creator to highlight?</label>
                <p className="text-xs text-brand-gray mb-2">Products, menu items, services, experiences, or key talking points</p>
                <textarea
                  id="highlightRequest"
                  value={form.highlightRequest}
                  onChange={(e) => setForm((f) => ({ ...f, highlightRequest: e.target.value }))}
                  rows={4}
                  className={`input py-3 rounded-xl resize-none ${errors.highlightRequest ? 'border-red-500 focus:ring-red-500/20' : ''}`}
                  placeholder="Describe what the creator should focus on..."
                />
                {errors.highlightRequest && <p className="mt-1.5 text-sm text-red-500">{errors.highlightRequest}</p>}
              </div>
              <div>
                <label htmlFor="brandGuidelines" className="block text-sm font-semibold text-brand-black mb-1.5">Brand Vibe or Guidelines <span className="font-normal text-brand-gray">(Optional)</span></label>
                <textarea
                  id="brandGuidelines"
                  value={form.brandGuidelines}
                  onChange={(e) => setForm((f) => ({ ...f, brandGuidelines: e.target.value }))}
                  rows={3}
                  className="input py-3 rounded-xl resize-none"
                  placeholder="Tone, do's & don'ts, special requests..."
                />
              </div>
              <div>
                <label htmlFor="preferredCreatorType" className="block text-sm font-semibold text-brand-black mb-1.5">Preferred Creator Type <span className="font-normal text-brand-gray">(Optional)</span></label>
                <select
                  id="preferredCreatorType"
                  value={form.preferredCreatorType}
                  onChange={(e) => setForm((f) => ({ ...f, preferredCreatorType: e.target.value }))}
                  className="input py-3 rounded-xl"
                >
                  <option value="">Select...</option>
                  {CREATOR_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-md p-6 sm:p-8 border border-gray-100/80">
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-brand-purple/10 text-brand-purple font-bold text-sm">4</span>
              <h2 className="text-lg font-bold text-brand-black flex items-center gap-2">
                <Calendar className="w-5 h-5 text-brand-purple" />
                Content Timeline
              </h2>
            </div>
            <div>
              <label htmlFor="deliveryBy" className="block text-sm font-semibold text-brand-black mb-1.5">When do you need the content delivered by?</label>
              <p className="text-xs text-brand-gray mb-2">Minimum turnaround: 30 days</p>
              <input
                id="deliveryBy"
                type="date"
                value={form.deliveryBy}
                min={minDeliveryDate()}
                onChange={(e) => setForm((f) => ({ ...f, deliveryBy: e.target.value }))}
                className={`input py-3 rounded-xl max-w-xs ${errors.deliveryBy ? 'border-red-500 focus:ring-red-500/20' : ''}`}
              />
              {errors.deliveryBy && <p className="mt-1.5 text-sm text-red-500">{errors.deliveryBy}</p>}
            </div>
            <div className="mt-6 pt-6 border-t border-gray-100">
              <label className="block text-sm font-semibold text-brand-black mb-3">Where should the content be posted?</label>
              <div className="flex flex-wrap gap-4">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-brand-gray text-sm">
                  <span className="w-4 h-4 rounded bg-brand-pink/20 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-brand-pink" />
                  </span>
                  Doozi (required)
                </span>
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors has-[:checked]:border-brand-pink has-[:checked]:bg-brand-pink/5">
                  <input
                    type="checkbox"
                    checked={form.postTiktok}
                    onChange={(e) => setForm((f) => ({ ...f, postTiktok: e.target.checked }))}
                    className="w-4 h-4 rounded text-brand-pink focus:ring-brand-pink"
                  />
                  <span className="text-sm">TikTok</span>
                </label>
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors has-[:checked]:border-brand-pink has-[:checked]:bg-brand-pink/5">
                  <input
                    type="checkbox"
                    checked={form.postInstagram}
                    onChange={(e) => setForm((f) => ({ ...f, postInstagram: e.target.checked }))}
                    className="w-4 h-4 rounded text-brand-pink focus:ring-brand-pink"
                  />
                  <span className="text-sm">Instagram</span>
                </label>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-md p-6 sm:p-8 border border-gray-100/80">
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-brand-purple/10 text-brand-purple font-bold text-sm">5</span>
              <h2 className="text-lg font-bold text-brand-black flex items-center gap-2">
                <Share2 className="w-5 h-5 text-brand-purple" />
                Content Usage
              </h2>
            </div>
            <p className="text-sm font-semibold text-brand-black mb-3">Reuse this content for your own marketing (ads, website, social)?</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, reuseContent: true }))}
                className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${form.reuseContent === true ? 'border-brand-pink bg-brand-pink/10 text-brand-pink' : 'border-gray-200 text-brand-gray hover:border-gray-300'}`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, reuseContent: false }))}
                className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${form.reuseContent === false ? 'border-brand-pink bg-brand-pink/10 text-brand-pink' : 'border-gray-200 text-brand-gray hover:border-gray-300'}`}
              >
                No
              </button>
            </div>
            {errors.reuseContent && <p className="mt-2 text-sm text-red-500">{errors.reuseContent}</p>}
          </section>

          <section className="bg-white rounded-2xl shadow-md p-6 sm:p-8 border border-gray-100/80">
            <div className="flex items-center gap-3 mb-6">
              <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-brand-purple/10 text-brand-purple font-bold text-sm">6</span>
              <h2 className="text-lg font-bold text-brand-black">Final Confirmation</h2>
            </div>
            <div className="space-y-4">
              <label className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 hover:border-gray-200 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={form.confirmAccurate}
                  onChange={(e) => setForm((f) => ({ ...f, confirmAccurate: e.target.checked }))}
                  className="mt-0.5 h-5 w-5 rounded text-brand-pink focus:ring-brand-pink"
                />
                <span className="text-sm text-brand-black">I confirm that all information provided is accurate.</span>
              </label>
              {errors.confirmAccurate && <p className="text-sm text-red-500 -mt-2">{errors.confirmAccurate}</p>}
            </div>
          </section>

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full button-primary disabled:opacity-50 disabled:cursor-not-allowed py-4 rounded-xl text-base font-bold shadow-lg hover:shadow-xl transition-shadow"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </span>
              ) : (
                'Submit Application'
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
