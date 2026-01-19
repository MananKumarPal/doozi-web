'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MapPin, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading: authLoading, refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          localStorage.setItem('auth-token', data.token);
          
          if (data.requires_verification) {
            router.push(`/auth/verify-email?email=${encodeURIComponent(data.email || formData.email)}`);
            return;
          }
          
          await refreshUser();
        } else {
          setErrors({ submit: 'Login failed - no token received' });
        }
      } else {
        const data = await response.json();
        setErrors({ submit: data.error || 'Invalid email or password' });
      }
    } catch (error) {
      setErrors({ submit: 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-purple via-brand-pink to-brand-green px-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-purple via-brand-pink to-brand-green px-4 py-8">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 shadow-card">
        {/* Logo */}
        <div className="mb-4 sm:mb-6 flex justify-center">
          <Link href="/">
            <img
              src="/logo.svg"
              alt="Doozi Logo"
              className="h-12 sm:h-16 w-auto"
            />
          </Link>
        </div>

        <div className="mb-4 sm:mb-6 text-center">
          <h2 className="mb-2 text-xl sm:text-2xl font-bold text-brand-black">
            Welcome Back
          </h2>
          <p className="text-sm sm:text-base text-brand-gray">
            Log in to your account to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-brand-black mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`input text-sm sm:text-base ${errors.email ? 'border-red-500' : ''}`}
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-brand-black mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`input text-sm sm:text-base pr-10 ${errors.password ? 'border-red-500' : ''}`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-2 sm:p-3">
              <p className="text-xs sm:text-sm text-red-800">{errors.submit}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="button-primary w-full text-sm sm:text-base py-2.5 sm:py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        {/* Links */}
        <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3 text-center text-xs sm:text-sm">
          <div className="text-brand-gray">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="font-medium text-brand-pink hover:underline">
              Sign up
            </Link>
          </div>
          <div>
            <Link href="/" className="text-brand-gray hover:text-brand-pink transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
