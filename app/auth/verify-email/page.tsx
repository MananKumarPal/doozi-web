'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { MapPin, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();
  
  const emailFromQuery = searchParams?.get('email') || '';
  
  const [email, setEmail] = useState(emailFromQuery);
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [hasAutoSent, setHasAutoSent] = useState(false);

  useEffect(() => {
    if (emailFromQuery && !hasAutoSent) {
      setEmail(emailFromQuery);
      handleAutoResend(emailFromQuery);
      setHasAutoSent(true);
    }
  }, [emailFromQuery, hasAutoSent]);

  const handleAutoResend = async (emailToResend: string) => {
    try {
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToResend }),
      });
      if (response.ok) {
        setResendSuccess(true);
        setTimeout(() => setResendSuccess(false), 5000);
      }
    } catch (error) {
      console.error('Failed to auto-resend OTP:', error);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    }
    if (!otp || otp.length !== 6) {
      newErrors.otp = 'Please enter the 6-digit code';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsVerifying(true);
    setErrors({});

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.data?.token) {
          localStorage.setItem('auth-token', data.data.token);
          await refreshUser();
          setVerificationSuccess(true);
          
          setTimeout(() => {
            router.push('/dashboard');
          }, 2000);
        }
      } else {
        const data = await response.json();
        setErrors({ submit: data.error || 'Verification failed' });
      }
    } catch (error) {
      setErrors({ submit: 'An error occurred. Please try again.' });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setErrors({ email: 'Email is required' });
      return;
    }

    setIsResending(true);
    setErrors({});
    setResendSuccess(false);

    try {
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setResendSuccess(true);
        setTimeout(() => setResendSuccess(false), 5000);
      } else {
        const data = await response.json();
        setErrors({ submit: data.error || 'Failed to resend code' });
      }
    } catch (error) {
      setErrors({ submit: 'An error occurred. Please try again.' });
    } finally {
      setIsResending(false);
    }
  };

  if (verificationSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-purple via-brand-pink to-brand-green px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-card p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-brand-black mb-2">
            Email Verified! 🎉
          </h2>
          <p className="text-brand-gray mb-6">
            Your email has been verified successfully. Redirecting you to your dashboard...
          </p>
          <div className="w-8 h-8 border-4 border-brand-pink border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-brand-purple via-brand-pink to-brand-green">
      <div className="hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-center lg:px-12">
        <div className="max-w-md text-white">
          <div className="mb-8 flex items-center">
            <Link href="/">
              <img
                src="/logo.svg"
                alt="Doozi Logo"
                className="h-12 sm:h-16 w-auto"
              />
            </Link>
          </div>
          <h2 className="mb-6 text-3xl sm:text-4xl font-bold">
            Almost There!
          </h2>
          <p className="mb-8 text-lg text-white/90">
            Just one more step to join the Doozi community and start discovering amazing travel content.
          </p>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-bold mb-1">Secure Account</h3>
                <p className="text-white/80 text-sm">
                  Email verification keeps your account safe and secure
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-bold mb-1">Stay Updated</h3>
                <p className="text-white/80 text-sm">
                  Get notified about new features and creator opportunities
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-bold mb-1">Quick & Easy</h3>
                <p className="text-white/80 text-sm">
                  Verification takes less than a minute
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex justify-center">
            <Link href="/">
              <img
                src="/logo.svg"
                alt="Doozi Logo"
                className="h-12 w-auto"
              />
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-card p-6 sm:p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-pink/10 rounded-full mb-3">
                <Mail className="w-6 h-6 text-brand-pink" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-brand-black mb-2">
                Verify Your Email
              </h2>
              <p className="text-sm text-brand-gray">
                We've sent a 6-digit verification code to
              </p>
              <p className="text-sm font-medium text-brand-black mt-1">
                {email}
              </p>
            </div>

            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-brand-black mb-1">
                  Verification Code
                </label>
                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    setOtp(value);
                    setErrors({});
                  }}
                  className={`input text-center text-2xl tracking-widest font-mono ${errors.otp ? 'border-red-500' : ''}`}
                  placeholder="000000"
                  autoFocus
                />
                {errors.otp && (
                  <p className="mt-1 text-sm text-red-500">{errors.otp}</p>
                )}
              </div>

              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{errors.submit}</p>
                </div>
              )}

              {resendSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-600">
                    ✓ New verification code sent to your email
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isVerifying || otp.length !== 6}
                className="w-full button-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isVerifying ? (
                  <span className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Verifying...
                  </span>
                ) : (
                  'Verify Email'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-brand-gray mb-2">
                Didn't receive the code?
              </p>
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="text-sm font-medium text-brand-pink hover:text-brand-pink/80 transition-colors disabled:opacity-50"
              >
                {isResending ? 'Sending...' : 'Resend Code'}
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <button
                type="button"
                onClick={() => router.push('/')}
                className="text-sm text-brand-gray hover:text-brand-pink transition-colors inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </button>
            </div>
          </div>

          <div className="lg:hidden mt-8 text-center text-white/90 text-sm">
            <p>Check your email inbox (and spam folder) for the verification code</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-purple via-brand-pink to-brand-green">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
