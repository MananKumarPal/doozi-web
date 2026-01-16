'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MapPin, CheckCircle, AlertCircle, ArrowLeft, Sparkles, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function ApplyPage() {
  const router = useRouter();
  const { user, loading: authLoading, refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState<any>(null);
  const [formData, setFormData] = useState({
    tiktok_link: '',
    tiktok_followers: '',
    instagram_link: '',
    instagram_followers: '',
    applicant_notes: '',
    public_content_allowed: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/auth/login?redirect=/apply');
      return;
    }

    setApplication(null);

    const fetchApplication = async () => {
      try {
        const token = localStorage.getItem('auth-token');
        if (token) {
          const appStatusResponse = await fetch('/api/creator-applications/status?' + new Date().getTime(), {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            cache: 'no-store',
          });
          
          if (appStatusResponse.ok) {
            const appData = await appStatusResponse.json();
            if (appData.hasApplication && appData.application) {
              setApplication(appData.application);
            } else {
              setApplication(null);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch application status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();

    const handleVisibilityChange = () => {
      if (!document.hidden && user && !authLoading) {
        const token = localStorage.getItem('auth-token');
        if (token) {
          fetch('/api/creator-applications/status?' + new Date().getTime(), {
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // TikTok validation
    if (!formData.tiktok_link.trim()) {
      newErrors.tiktok_link = 'TikTok profile link is required';
    } else if (!formData.tiktok_link.includes('tiktok.com')) {
      newErrors.tiktok_link = 'Please enter a valid TikTok profile URL';
    }

    if (!formData.tiktok_followers.trim()) {
      newErrors.tiktok_followers = 'TikTok follower count is required';
    } else if (!/^\d+$/.test(formData.tiktok_followers.trim())) {
      newErrors.tiktok_followers = 'Follower count must be a number';
    }

    // Instagram validation
    if (!formData.instagram_link.trim()) {
      newErrors.instagram_link = 'Instagram profile link is required';
    } else if (!formData.instagram_link.includes('instagram.com')) {
      newErrors.instagram_link = 'Please enter a valid Instagram profile URL';
    }

    if (!formData.instagram_followers.trim()) {
      newErrors.instagram_followers = 'Instagram follower count is required';
    } else if (!/^\d+$/.test(formData.instagram_followers.trim())) {
      newErrors.instagram_followers = 'Follower count must be a number';
    }

    // Notes validation
    if (!formData.applicant_notes.trim()) {
      newErrors.applicant_notes = 'Please tell us about yourself';
    } else if (formData.applicant_notes.trim().length < 50) {
      newErrors.applicant_notes = 'Please provide at least 50 characters';
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
      
      if (!token) {
        setErrors({ submit: 'Please log in to submit an application' });
        setIsSubmitting(false);
        return;
      }

      const response = await fetch('/api/creator-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();
      
      if (response.ok) {
        setErrors({});
        
        try {
          await refreshUser();
        } catch (error) {
          console.error('Failed to refresh user:', error);
        }
        
        const token = localStorage.getItem('auth-token');
        if (token) {
          try {
            const appStatusResponse = await fetch('/api/creator-applications/status?' + new Date().getTime(), {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
              cache: 'no-store',
            });
            
            if (appStatusResponse.ok) {
              const appData = await appStatusResponse.json();
              if (appData.hasApplication && appData.application) {
                setApplication(appData.application);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }
          } catch (error) {
            console.error('Failed to fetch application status:', error);
          }
        }
      } else {
        setErrors({ submit: responseData.error || 'Submission failed. Please try again.' });
      }
    } catch (error) {
      setErrors({ submit: 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-pink border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-brand-gray">Loading...</p>
        </div>
      </div>
    );
  }

  if (application && application.status === 'pending') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center space-x-2">
                <MapPin className="h-7 w-7 text-brand-pink" />
                <span className="text-2xl font-bold text-brand-black">Doozi</span>
              </Link>
              <Link href="/dashboard" className="text-sm text-brand-gray hover:text-brand-pink transition-colors">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-2xl shadow-card p-8 md:p-12 text-center">
            <div className="w-20 h-20 bg-brand-purple rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-brand-black mb-4">
              Application Under Review
            </h1>
            <p className="text-lg text-brand-gray leading-relaxed mb-8">
              Your creator application has been submitted and is currently under review. We typically review applications within 3-5 business days.
            </p>

            <div className="bg-brand-purple/10 border border-brand-purple/20 rounded-xl p-6 mb-8 text-left">
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-brand-purple flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-brand-black mb-2">Application Status: Pending</h3>
                  <p className="text-sm text-brand-gray mb-3">
                    Submitted on {new Date(application.applied_at || application.created_at).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                  {application.admin_notes && (
                    <div className="mt-3 pt-3 border-t border-brand-purple/20">
                      <p className="text-xs font-semibold text-brand-black mb-1">Admin Notes:</p>
                      <p className="text-sm text-brand-gray">{application.admin_notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <h3 className="text-xl font-bold text-brand-black">What Happens Next?</h3>
              <div className="text-left space-y-3 text-brand-gray">
                <p>✅ We're reviewing your application (typically within 3-5 business days)</p>
                <p>✅ If approved, we'll send you an email with next steps</p>
                <p>✅ You'll get early access to Creator Studio when we launch</p>
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

  if (application && application.status === 'rejected') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center space-x-2">
                <MapPin className="h-7 w-7 text-brand-pink" />
                <span className="text-2xl font-bold text-brand-black">Doozi</span>
              </Link>
              <Link href="/dashboard" className="text-sm text-brand-gray hover:text-brand-pink transition-colors">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-2xl shadow-card p-8 md:p-12 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-brand-black mb-4">
              Application Not Approved
            </h1>
            <p className="text-lg text-brand-gray leading-relaxed mb-8">
              Unfortunately, your creator application was not approved at this time. You can submit a new application if you'd like to try again.
            </p>

            {application.admin_notes && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8 text-left">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-brand-black mb-2">Feedback</h3>
                    <p className="text-sm text-brand-gray">{application.admin_notes}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setApplication(null)}
                className="button-primary"
              >
                Submit New Application
              </button>
              <Link href="/dashboard" className="button-secondary">
                Go to Dashboard
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (user && (user.is_creator || user.isCreator)) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center space-x-2">
                <MapPin className="h-7 w-7 text-brand-pink" />
                <span className="text-2xl font-bold text-brand-black">Doozi</span>
              </Link>
              <Link href="/dashboard" className="text-sm text-brand-gray hover:text-brand-pink transition-colors">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-2xl shadow-card p-8 md:p-12 text-center">
            <div className="w-20 h-20 bg-brand-green rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-brand-black mb-4">
              You're Already a Creator! 🎉
            </h1>
            <p className="text-lg text-brand-gray leading-relaxed mb-8">
              Your creator account is already active. You'll get early access to Creator Studio when we launch. 
              Start preparing your content and get ready to share your travel experiences!
            </p>

            <div className="bg-brand-green/10 border border-brand-green/20 rounded-xl p-6 mb-8">
              <div className="flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <h3 className="font-bold text-brand-black mb-2">Creator Account Active</h3>
                  <p className="text-sm text-brand-gray">
                    You're all set! We'll notify you when Creator Studio is available. In the meantime, 
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header Section */}
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

        {/* Application Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-card p-6 md:p-8 space-y-6">
          {/* TikTok Section */}
          <div>
            <h3 className="text-lg font-bold text-brand-black mb-4">TikTok Profile</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="tiktok_link" className="block text-sm font-medium text-brand-black mb-1">
                  TikTok Profile Link *
                </label>
                <input
                  id="tiktok_link"
                  type="url"
                  value={formData.tiktok_link}
                  onChange={(e) => setFormData({ ...formData, tiktok_link: e.target.value })}
                  className={`input ${errors.tiktok_link ? 'border-red-500' : ''}`}
                  placeholder="https://www.tiktok.com/@yourusername"
                />
                {errors.tiktok_link && (
                  <p className="mt-1 text-sm text-red-500">{errors.tiktok_link}</p>
                )}
              </div>

              <div>
                <label htmlFor="tiktok_followers" className="block text-sm font-medium text-brand-black mb-1">
                  TikTok Follower Count *
                </label>
                <input
                  id="tiktok_followers"
                  type="text"
                  inputMode="numeric"
                  value={formData.tiktok_followers}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    setFormData({ ...formData, tiktok_followers: value });
                  }}
                  className={`input ${errors.tiktok_followers ? 'border-red-500' : ''}`}
                  placeholder="e.g., 10000, 50000, 100000"
                />
                {errors.tiktok_followers && (
                  <p className="mt-1 text-sm text-red-500">{errors.tiktok_followers}</p>
                )}
              </div>
            </div>
          </div>

          {/* Instagram Section */}
          <div>
            <h3 className="text-lg font-bold text-brand-black mb-4">Instagram Profile</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="instagram_link" className="block text-sm font-medium text-brand-black mb-1">
                  Instagram Profile Link *
                </label>
                <input
                  id="instagram_link"
                  type="url"
                  value={formData.instagram_link}
                  onChange={(e) => setFormData({ ...formData, instagram_link: e.target.value })}
                  className={`input ${errors.instagram_link ? 'border-red-500' : ''}`}
                  placeholder="https://www.instagram.com/yourusername"
                />
                {errors.instagram_link && (
                  <p className="mt-1 text-sm text-red-500">{errors.instagram_link}</p>
                )}
              </div>

              <div>
                <label htmlFor="instagram_followers" className="block text-sm font-medium text-brand-black mb-1">
                  Instagram Follower Count *
                </label>
                <input
                  id="instagram_followers"
                  type="text"
                  inputMode="numeric"
                  value={formData.instagram_followers}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    setFormData({ ...formData, instagram_followers: value });
                  }}
                  className={`input ${errors.instagram_followers ? 'border-red-500' : ''}`}
                  placeholder="e.g., 5000, 25000, 75000"
                />
                {errors.instagram_followers && (
                  <p className="mt-1 text-sm text-red-500">{errors.instagram_followers}</p>
                )}
              </div>
            </div>
          </div>

          {/* About You */}
          <div>
            <label htmlFor="applicant_notes" className="block text-sm font-medium text-brand-black mb-1">
              Tell Us About Your Content *
            </label>
            <textarea
              id="applicant_notes"
              value={formData.applicant_notes}
              onChange={(e) => setFormData({ ...formData, applicant_notes: e.target.value })}
              rows={5}
              className={`input ${errors.applicant_notes ? 'border-red-500' : ''}`}
              placeholder="Tell us about your travel content, what makes you unique, and why you'd like to join Doozi... (minimum 50 characters)"
            />
            {errors.applicant_notes && (
              <p className="mt-1 text-sm text-red-500">{errors.applicant_notes}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              {formData.applicant_notes.length} / 50 characters minimum
            </p>
          </div>

          {/* Content Permission Checkbox */}
          <div className="border-2 border-brand-purple/20 rounded-xl p-6 bg-brand-purple/5">
            <div className="flex items-start space-x-3">
              <input
                id="public_content_allowed"
                type="checkbox"
                checked={formData.public_content_allowed}
                onChange={(e) => setFormData({ ...formData, public_content_allowed: e.target.checked })}
                className="checkbox mt-1"
              />
              <div className="flex-1">
                <label htmlFor="public_content_allowed" className="text-sm font-medium text-brand-black cursor-pointer">
                  I give Doozi permission to use my existing public content to help set up my profile and tag my videos to the correct locations.
                </label>
                <p className="mt-2 text-xs text-brand-gray leading-relaxed">
                  This permission only applies to publicly available content from your social media profiles. 
                  It helps us onboard you faster by pre-tagging locations and setting up your creator profile 
                  so you can hit the ground running when we launch. You can revoke this permission at any time.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <p className="text-sm text-red-800">{errors.submit}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="button-primary px-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
            </button>
          </div>
        </form>

        {/* Info Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-card p-6 md:p-8">
          <h3 className="text-xl font-bold text-brand-black mb-4">What We're Looking For</h3>
          <div className="space-y-3 text-brand-gray">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5" />
              <p>Original, high-quality travel content that showcases authentic experiences</p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5" />
              <p>Active engagement with your audience on social media</p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5" />
              <p>Passion for travel and storytelling through video content</p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5" />
              <p>Commitment to creating positive, inclusive content for the community</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
