'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Sparkles, Video, User, LogOut, TrendingUp, ArrowRight, Camera, Calendar, Target, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/auth/login');
      return;
    }

    const fetchApplication = async () => {
      if (!user.is_creator && !user.isCreator) {
        try {
          const token = localStorage.getItem('auth-token');
          if (token) {
            const appStatusResponse = await fetch('/api/creator-applications/status', {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });
            
            if (appStatusResponse.ok) {
              const appData = await appStatusResponse.json();
              if (appData.hasApplication && appData.application) {
                setApplication(appData.application);
              }
            }
          }
        } catch (error) {
          console.error('Failed to fetch application status:', error);
        }
      }
      setLoading(false);
    };

    fetchApplication();
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-pink border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-brand-gray">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <img
                src="/logo.svg"
                alt="Doozi Logo"
                className="h-10 sm:h-12 w-auto"
              />
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm text-brand-gray">
                <User className="h-4 w-4" />
                <span>{user?.email || user?.name || user?.fullName || 'User'}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-2 text-sm text-brand-gray hover:text-brand-pink transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-brand-black mb-2">
            Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : user?.name || user?.fullName ? `, ${user.name || user.fullName}` : ''}!
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-brand-gray">
            Your Doozi account is ready. Here's what's happening.
          </p>
        </div>

        {/* Status Banner */}
        <div className="bg-gradient-to-r from-brand-purple to-brand-pink rounded-2xl p-6 sm:p-8 text-white mb-6 sm:mb-8 shadow-lg">
          <div className="flex items-start space-x-3 sm:space-x-4">
            <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3">We're Getting Close!</h2>
              <p className="text-sm sm:text-base lg:text-lg text-white/90 leading-relaxed mb-3 sm:mb-4">
                We're currently testing and submitting the Doozi app to the app stores. 
                Your login details here will be the same ones you use in the mobile app once it's live.
              </p>
              <div className="flex items-center gap-2 text-white/80">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-xs sm:text-sm">App store submission in progress</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Creator Application CTA or Creator Status */}
          {user?.is_creator || user?.isCreator ? (
            <div className="bg-gradient-to-br from-brand-green to-brand-purple rounded-2xl p-6 sm:p-8 text-white shadow-xl hover:shadow-2xl transition-shadow">
              <div className="flex items-start justify-between mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Video className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">
                You're a Creator! 🎉
              </h3>
              <p className="text-sm sm:text-base text-white/90 mb-4 sm:mb-6 leading-relaxed">
                Your creator account is active. You'll get early access to Creator Studio when we launch. Start preparing your content!
              </p>
              <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-bold text-sm sm:text-base">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                Creator Account Active
              </div>
            </div>
          ) : application && application.status === 'pending' ? (
            <div className="bg-gradient-to-br from-brand-purple to-brand-pink rounded-2xl p-6 sm:p-8 text-white shadow-xl hover:shadow-2xl transition-shadow">
              <div className="flex items-start justify-between mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Clock className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">
                Application Under Review
              </h3>
              <p className="text-sm sm:text-base text-white/90 mb-4 sm:mb-6 leading-relaxed">
                Your creator application is currently being reviewed. We typically review applications within 3-5 business days. You'll be notified once a decision has been made.
              </p>
              <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-bold text-sm sm:text-base">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                Status: Pending Review
              </div>
            </div>
          ) : application && application.status === 'rejected' ? (
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl hover:shadow-2xl transition-shadow">
              <div className="flex items-start justify-between mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Video className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">
                Application Not Approved
              </h3>
              <p className="text-sm sm:text-base text-white/90 mb-4 sm:mb-6 leading-relaxed">
                Your previous application was not approved. You can submit a new application if you'd like to try again.
              </p>
              <Link
                href="/apply"
                className="inline-flex items-center gap-2 bg-white text-red-600 px-4 sm:px-6 py-2 sm:py-3 rounded-full font-bold hover:bg-gray-100 transition-colors text-sm sm:text-base"
              >
                Submit New Application
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-brand-pink to-brand-purple rounded-2xl p-6 sm:p-8 text-white shadow-xl hover:shadow-2xl transition-shadow">
              <div className="flex items-start justify-between mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Video className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">
                Apply to be a Creator
              </h3>
              <p className="text-sm sm:text-base text-white/90 mb-4 sm:mb-6 leading-relaxed">
                Join our creator program and be one of the first to share your travel experiences. Get early access to Creator Studio and start building your audience.
              </p>
              <Link
                href="/apply"
                className="inline-flex items-center gap-2 bg-white text-brand-pink px-4 sm:px-6 py-2 sm:py-3 rounded-full font-bold hover:bg-gray-100 transition-colors text-sm sm:text-base"
              >
                Apply Now
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </div>
          )}

          {/* Secondary Note for Non-Creators OR Community Highlights */}
          {user?.is_creator || user?.isCreator ? (
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-green/10 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-brand-green" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-brand-black">
                  Community Highlights
                </h3>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start gap-2 sm:gap-3">
                  <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-brand-pink mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm sm:text-base text-brand-black">Travel Content</p>
                    <p className="text-xs sm:text-sm text-brand-gray">Discover authentic experiences from creators worldwide</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-brand-purple mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm sm:text-base text-brand-black">Trip Planning</p>
                    <p className="text-xs sm:text-sm text-brand-gray">Save and organize your favorite travel spots</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <Target className="w-4 h-4 sm:w-5 sm:h-5 text-brand-green mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm sm:text-base text-brand-black">Direct Bookings</p>
                    <p className="text-xs sm:text-sm text-brand-gray">Reserve restaurants and hotels right in the app</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-green/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-brand-green" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-brand-black mb-2">
                    You're All Set!
                  </h3>
                  <p className="text-sm sm:text-base text-brand-gray leading-relaxed">
                    Your account is ready. We'll notify you when the Doozi app is live and ready to download.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100">
          <h3 className="text-xl sm:text-2xl font-bold text-brand-black mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-brand-purple" />
            What's Next?
          </h3>
          <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
            <div className="relative">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-pink rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg text-sm sm:text-base">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-brand-black mb-1 sm:mb-2 text-base sm:text-lg">App Store Submission</h4>
                  <p className="text-xs sm:text-sm text-brand-gray leading-relaxed">We're currently submitting v1 to Apple and Google</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-purple rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg text-sm sm:text-base">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-brand-black mb-1 sm:mb-2 text-base sm:text-lg">Review Process</h4>
                  <p className="text-xs sm:text-sm text-brand-gray leading-relaxed">Apps typically take 1-2 weeks for review</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-green rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg text-sm sm:text-base">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-brand-black mb-1 sm:mb-2 text-base sm:text-lg">Launch!</h4>
                  <p className="text-xs sm:text-sm text-brand-gray leading-relaxed">You'll be notified when the app is live and ready to download</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
