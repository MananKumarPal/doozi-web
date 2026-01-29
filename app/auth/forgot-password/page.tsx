'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess(true);
      } else {
        setError(data.error || 'Failed to send reset email');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <h2 className="text-xl sm:text-2xl font-bold text-brand-black mb-2">Check Your Email</h2>
            <p className="text-sm sm:text-base text-brand-gray mb-6">
              If an account exists with <span className="font-medium">{email}</span>, you will receive a password reset link shortly.
            </p>
            <p className="text-sm text-brand-gray mb-6">Please check your inbox and follow the instructions to reset your password.</p>
            <Link href="/auth/login" className="button-primary w-full inline-block text-center text-sm sm:text-base py-2.5 sm:py-3">
              Back to Login
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
          <h2 className="mb-2 text-xl sm:text-2xl font-bold text-brand-black">Forgot Password?</h2>
          <p className="text-sm sm:text-base text-brand-gray">Enter your email and we&apos;ll send you a link to reset your password.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-brand-black mb-1">Email Address</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input text-sm sm:text-base"
              placeholder="you@example.com"
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
            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
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
