'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isValidatingToken, setIsValidatingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    if (!token) {
      setError('Invalid reset link');
      setIsValidatingToken(false);
      return;
    }
    const verifyToken = async () => {
      try {
        const response = await fetch(`/api/auth/reset-password?token=${token}`);
        const data = await response.json();
        if (response.ok) {
          setTokenValid(true);
          setUserEmail(data.data?.email || '');
        } else {
          setError(data.error || 'Invalid or expired reset link');
        }
      } catch {
        setError('Failed to verify reset link');
      } finally {
        setIsValidatingToken(false);
      }
    };
    verifyToken();
  }, [token]);

  const validateForm = () => {
    if (!password) {
      setError('Password is required');
      return false;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess(true);
        setTimeout(() => router.push('/auth/login'), 2000);
      } else {
        setError(data.error || 'Failed to reset password');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isValidatingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-purple via-brand-pink to-brand-green px-4 py-8">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 shadow-card">
          <div className="mb-4 sm:mb-6 flex justify-center">
            <Link href="/">
              <img src="/logo.svg" alt="Doozi Logo" className="h-12 sm:h-16 w-auto" />
            </Link>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm sm:text-base text-brand-gray">Verifying reset link...</p>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-purple via-brand-pink to-brand-green px-4 py-8">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 shadow-card">
          <div className="mb-4 sm:mb-6 flex justify-center">
            <Link href="/">
              <img src="/logo.svg" alt="Doozi Logo" className="h-12 sm:h-16 w-auto" />
            </Link>
          </div>
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-brand-black mb-2">Password Reset Successful!</h2>
            <p className="text-sm sm:text-base text-brand-gray mb-6">Your password has been successfully reset. You can now log in with your new password.</p>
            <p className="text-sm text-brand-gray">Redirecting to login...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-purple via-brand-pink to-brand-green px-4 py-8">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 shadow-card">
          <div className="mb-4 sm:mb-6 flex justify-center">
            <Link href="/">
              <img src="/logo.svg" alt="Doozi Logo" className="h-12 sm:h-16 w-auto" />
            </Link>
          </div>
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-brand-black mb-2">Invalid Reset Link</h2>
            <p className="text-sm sm:text-base text-brand-gray mb-6">{error || 'This password reset link is invalid or has expired.'}</p>
            <Link href="/auth/forgot-password" className="button-primary w-full inline-block text-center text-sm sm:text-base py-2.5 sm:py-3">
              Request New Reset Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-purple via-brand-pink to-brand-green px-4 py-8">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 shadow-card">
        <div className="mb-4 sm:mb-6 flex justify-center">
          <Link href="/">
            <img src="/logo.svg" alt="Doozi Logo" className="h-12 sm:h-16 w-auto" />
          </Link>
        </div>
        <div className="mb-4 sm:mb-6 text-center">
          <h2 className="mb-2 text-xl sm:text-2xl font-bold text-brand-black">Reset Your Password</h2>
          {userEmail && (
            <p className="text-sm sm:text-base text-brand-gray">for <span className="font-medium">{userEmail}</span></p>
          )}
        </div>
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-brand-black mb-1">New Password</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input text-sm sm:text-base"
              placeholder="Enter new password (min. 8 characters)"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-medium text-brand-black mb-1">Confirm New Password</label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input text-sm sm:text-base"
              placeholder="Confirm new password"
              disabled={isSubmitting}
            />
          </div>
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-2 sm:p-3">
              <p className="text-xs sm:text-sm text-red-800">{error}</p>
            </div>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="button-primary w-full text-sm sm:text-base py-2.5 sm:py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
          </button>
          <div className="text-center">
            <Link href="/auth/login" className="text-xs sm:text-sm text-brand-pink hover:underline font-medium">
              Back to Login
            </Link>
          </div>
        </form>
        <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm">
          <Link href="/" className="text-brand-gray hover:text-brand-pink transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
