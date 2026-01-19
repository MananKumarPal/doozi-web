'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MapPin, ArrowLeft, Sparkles, CheckCircle, Video } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function ApplyPage() {
  const router = useRouter();
  const { user, loading: authLoading, refreshUser } = useAuth();
  
  const [formData, setFormData] = useState({
    tiktok_link: '',
    instagram_link: '',
    applicant_notes: '',
    public_content_allowed: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [application, setApplication] = useState<any>(null);
  const [loadingApplication, setLoadingApplication] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/auth/login?redirect=/apply');
      } else if (!user.emailVerified) {
        router.push(`/auth/verify-email?email=${encodeURIComponent(user.email)}`);
      } else {
        const token = localStorage.getItem('auth-token');
        if (token && user?.id) {
          fetch(`/api/creator-applications/status/${user.id}?t=` + new Date().getTime(), {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            cache: 'no-store',
          })
            .then(res => res.json())
            .then(data => {
              if (data.hasApplication && data.application) {
                setApplication(data.application);
              }
              setLoadingApplication(false);
            })
            .catch(() => {
              setLoadingApplication(false);
            });
        }
      }
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user?.id) {
        const token = localStorage.getItem('auth-token');
        if (token) {
          fetch(`/api/creator-applications/status/${user.id}?t=` + new Date().getTime(), {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            cache: 'no-store',
          })
            .then(res => res.json())
            .then(appData => {
              if (appData.hasApplication && appData.application) {
                setApplication(appData.application);
              } else {
                setApplication(null);
              }
            })
            .catch(() => {});
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [user, authLoading, router]);

  const normalizeTikTokLink = (input: string): string => {
    const trimmed = input.trim();
    if (!trimmed) return '';
    
    if (trimmed.startsWith('https://') || trimmed.startsWith('http://')) {
      return trimmed;
    }
    
    if (trimmed.startsWith('www.')) {
      return `https://${trimmed}`;
    }
    
    if (trimmed.startsWith('@')) {
      return `https://www.tiktok.com/${trimmed}`;
    }
    
    if (trimmed.includes('tiktok.com')) {
      return `https://${trimmed}`;
    }
    
    return `https://www.tiktok.com/@${trimmed.replace(/^@/, '')}`;
  };

  const normalizeInstagramLink = (input: string): string => {
    const trimmed = input.trim();
    if (!trimmed) return '';
    
    if (trimmed.startsWith('https://') || trimmed.startsWith('http://')) {
      return trimmed;
    }
    
    if (trimmed.startsWith('www.')) {
      return `https://${trimmed}`;
    }
    
    if (trimmed.startsWith('@')) {
      return `https://www.instagram.com/${trimmed}`;
    }
    
    if (trimmed.includes('instagram.com')) {
      return `https://${trimmed}`;
    }
    
    return `https://www.instagram.com/${trimmed.replace(/^@/, '')}`;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.tiktok_link.trim() && !formData.instagram_link.trim()) {
      newErrors.social_media = 'At least one social media profile link is required';
    }

    if (formData.tiktok_link.trim()) {
      const normalized = normalizeTikTokLink(formData.tiktok_link);
      if (!normalized.includes('tiktok.com')) {
        newErrors.tiktok_link = 'Please enter a valid TikTok username or link';
      }
    }

    if (formData.instagram_link.trim()) {
      const normalized = normalizeInstagramLink(formData.instagram_link);
      if (!normalized.includes('instagram.com')) {
        newErrors.instagram_link = 'Please enter a valid Instagram username or link';
      }
    }

    if (!formData.public_content_allowed) {
      newErrors.public_content_allowed = 'You must agree to the content display permissions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('auth-token');
      
      const normalizedTikTok = formData.tiktok_link.trim() 
        ? normalizeTikTokLink(formData.tiktok_link) 
        : null;
      const normalizedInstagram = formData.instagram_link.trim() 
        ? normalizeInstagramLink(formData.instagram_link) 
        : null;

      const response = await fetch('/api/creator-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          tiktok_link: normalizedTikTok,
          instagram_link: normalizedInstagram,
          applicant_notes: formData.applicant_notes.trim() || null,
          public_content_allowed: formData.public_content_allowed,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setApplication(data.data);
        await refreshUser();
        await new Promise(resolve => setTimeout(resolve, 500));
        sessionStorage.setItem('applicationJustSubmitted', 'true');
        sessionStorage.setItem('applicationData', JSON.stringify(data.data));
      } else {
        const data = await response.json();
        setErrors({ submit: data.error || 'Application submission failed' });
      }
    } catch (error) {
      setErrors({ submit: 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || loadingApplication) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-pink border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-brand-gray">Loading...</p>
        </div>
      </div>
    );
  }

  if (user?.is_creator || user?.isCreator) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center space-x-2">
                <MapPin className="h-7 w-7 text-brand-pink" />
                <span className="text-2xl font-bold text-brand-black">Doozi</span>
              </Link>
              <Link href="/dashboard" className="flex items-center space-x-2 text-sm text-brand-gray hover:text-brand-pink transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-brand-pink to-brand-purple rounded-2xl mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-brand-black mb-4">
              You're Already a Creator! 🎉
            </h1>
            <p className="text-lg text-brand-gray leading-relaxed mb-8">
              Your creator account is active. You'll get early access to Creator Studio when we launch. 
              Start preparing your content and get ready to share your travel experiences!
            </p>

            <div className="bg-brand-green/10 border border-brand-green/20 rounded-xl p-6 mb-8">
              <div className="flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <h3 className="font-bold text-brand-black mb-2">Creator Account Active</h3>
                  <p className="text-sm text-brand-gray">
                    We'll notify you when Creator Studio is available. In the meantime, 
                    you can start planning your content and thinking about the amazing travel experiences you want to share.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard" className="button-primary">
                Go to Dashboard
              </Link>
              <Link href="/" className="button-secondary">
                Back to Home
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (application) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center space-x-2">
                <MapPin className="h-7 w-7 text-brand-pink" />
                <span className="text-2xl font-bold text-brand-black">Doozi</span>
              </Link>
              <Link href="/dashboard" className="flex items-center space-x-2 text-sm text-brand-gray hover:text-brand-pink transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-brand-pink to-brand-purple rounded-2xl mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-brand-black mb-4">
              Application Submitted! 🎉
            </h1>
            <p className="text-lg text-brand-gray leading-relaxed mb-8">
              Thank you for applying to be a Doozi creator! We've received your application and will review it soon.
            </p>

            <div className="bg-white rounded-2xl shadow-card p-6 mb-8">
              <h3 className="font-bold text-brand-black mb-4">Application Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-brand-gray">Status</span>
                  <span className="font-medium text-brand-black capitalize">{application.status}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-brand-gray">Submitted</span>
                  <span className="font-medium text-brand-black">
                    {new Date(application.applied_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8">
              <p className="text-sm text-blue-900">
                <strong>What's next?</strong> Our team will review your application within 3-5 business days. 
                You'll receive an email notification once your application has been reviewed.
              </p>
            </div>

            <div className="mt-8">
              <Link href="/dashboard" className="button-primary">
                Go to Dashboard
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <MapPin className="h-7 w-7 text-brand-pink" />
              <span className="text-2xl font-bold text-brand-black">Doozi</span>
            </Link>
            <Link href="/" className="flex items-center space-x-2 text-sm text-brand-gray hover:text-brand-pink transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-brand-pink to-brand-purple rounded-2xl mb-3 sm:mb-4">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-brand-black mb-3 sm:mb-4">
            Creator Application
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-brand-gray px-2">
            Join our creator community and be among the first to share your travel experiences on Doozi.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-card p-6 md:p-8 space-y-6">
          {errors.social_media && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{errors.social_media}</p>
            </div>
          )}

          <div>
            <div className="space-y-4">
              <div>
                <label htmlFor="tiktok_link" className="block text-sm font-medium text-brand-black mb-1">
                  TikTok Profile Link
                </label>
                <input
                  id="tiktok_link"
                  type="text"
                  value={formData.tiktok_link}
                  onChange={(e) => {
                    const value = e.target.value.replace(/^@/, '');
                    setFormData({ ...formData, tiktok_link: value });
                  }}
                  className={`input ${errors.tiktok_link ? 'border-red-500' : ''}`}
                  placeholder="username or profile link"
                />
                {errors.tiktok_link && (
                  <p className="mt-1 text-sm text-red-500">{errors.tiktok_link}</p>
                )}
                <p className="mt-1 text-xs text-brand-gray">
                  Enter your username or profile link
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="space-y-4">
              <div>
                <label htmlFor="instagram_link" className="block text-sm font-medium text-brand-black mb-1">
                  Instagram Profile Link
                </label>
                <input
                  id="instagram_link"
                  type="text"
                  value={formData.instagram_link}
                  onChange={(e) => {
                    const value = e.target.value.replace(/^@/, '');
                    setFormData({ ...formData, instagram_link: value });
                  }}
                  className={`input ${errors.instagram_link ? 'border-red-500' : ''}`}
                  placeholder="username or profile link"
                />
                {errors.instagram_link && (
                  <p className="mt-1 text-sm text-red-500">{errors.instagram_link}</p>
                )}
                <p className="mt-1 text-xs text-brand-gray">
                  Enter your username or profile link
                </p>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="applicant_notes" className="block text-sm font-medium text-brand-black mb-1">
              Message for Doozi <span className="text-brand-gray font-normal">(Optional)</span>
            </label>
            <p className="text-sm text-brand-gray mb-2">
              Anything you'd like to share with us about your content or why you want to be a creator?
            </p>
            <textarea
              id="applicant_notes"
              value={formData.applicant_notes}
              onChange={(e) => setFormData({ ...formData, applicant_notes: e.target.value })}
              rows={5}
              className="input"
              placeholder="Tell us about your travel content style, favorite destinations, or what excites you about joining Doozi..."
            />
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="public_content_allowed"
                checked={formData.public_content_allowed}
                onChange={(e) => setFormData({ ...formData, public_content_allowed: e.target.checked })}
                className="mt-1 h-5 w-5 text-brand-pink focus:ring-brand-pink rounded"
              />
              <div className="flex-1">
                <label htmlFor="public_content_allowed" className="text-sm text-brand-black leading-relaxed cursor-pointer">
                  I consent to Doozi displaying my public TikTok travel videos on my Doozi creator profile & I retain full ownership of my content at all times. This permission only allows Doozi to showcase my videos within my profile to support discovery and creator opportunities. Doozi will not repost, repurpose, or use my content elsewhere, and I can manage or remove it at any time.
                </label>
                {errors.public_content_allowed && (
                  <p className="mt-2 text-sm text-red-500">{errors.public_content_allowed}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
            <p className="text-sm text-brand-black leading-relaxed">
              By applying to Doozi, I confirm that I own my content and have the necessary rights to all elements included in it.
            </p>
          </div>

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full button-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Submitting...
                </span>
              ) : (
                'Submit Application'
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-brand-gray">
            By submitting this application, you agree to our{' '}
            <Link href="/terms" className="text-brand-pink hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-brand-pink hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
