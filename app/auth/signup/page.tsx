'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MapPin, Eye, EyeOff, Camera, Calendar, Users, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function SignupPage() {
  const router = useRouter();
  const { user, loading: authLoading, refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    agreeToTerms: false,
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
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      } else if (!/[A-Z]/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one uppercase letter';
      } else if (!/[a-z]/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one lowercase letter';
      } else if (!/[0-9]/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one number';
      } else if (!/[^A-Za-z0-9]/.test(formData.password)) {
        newErrors.password = 'Password must contain at least one special character';
      }
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/signup', {
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
          await refreshUser();
        } else {
          setErrors({ submit: 'Account created but failed to get authentication token' });
        }
      } else {
        const data = await response.json();
        setErrors({ submit: data.error || 'Signup failed' });
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
    <div className="min-h-screen flex bg-gradient-to-br from-brand-purple via-brand-pink to-brand-green">
      {/* Left side - Benefits (hidden on mobile) */}
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
          <h2 className="mb-6 text-4xl font-bold leading-tight">
            Start your travel journey today
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <Camera className="mt-1 h-6 w-6 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">Discover Authentic Content</h3>
                <p className="text-white/90">Get real travel experiences from creators worldwide</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <Calendar className="mt-1 h-6 w-6 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">Plan Perfect Itineraries</h3>
                <p className="text-white/90">Save content and organize your trips effortlessly</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <Users className="mt-1 h-6 w-6 flex-shrink-0" />
              <div>
                <h3 className="font-semibold">Connect with Travelers</h3>
                <p className="text-white/90">Join a community of passionate explorers</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Signup form */}
      <div className="flex w-full items-center justify-center px-4 py-6 sm:py-8 lg:w-1/2 lg:bg-white lg:py-0">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 shadow-card lg:shadow-none">
          {/* Mobile logo */}
          <div className="mb-4 sm:mb-6 flex justify-center lg:hidden">
            <Link href="/">
              <img
                src="/logo.svg"
                alt="Doozi Logo"
                className="h-12 sm:h-16 w-auto"
              />
            </Link>
          </div>

          <div className="mb-4 sm:mb-6 text-center lg:text-left">
            <h2 className="mb-2 text-xl sm:text-2xl font-bold text-brand-black">
              Create Your Account
            </h2>
            <p className="text-sm sm:text-base text-brand-gray">
              Join thousands of travelers discovering the world together.
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

            {/* Terms */}
            <div>
              <div className="flex items-start space-x-2 sm:space-x-3">
                <input
                  id="terms"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                  className="checkbox mt-0.5 sm:mt-1"
                />
                <label htmlFor="terms" className="text-xs sm:text-sm text-brand-gray leading-relaxed">
                  I agree to the{' '}
                  <Link href="/terms" className="font-medium text-brand-pink hover:underline" target="_blank">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="font-medium text-brand-pink hover:underline" target="_blank">
                    Privacy Policy
                  </Link>
                  .
                </label>
              </div>
              {errors.agreeToTerms && (
                <div className="mt-2 rounded-lg bg-red-50 border border-red-200 p-2 sm:p-3 text-red-800">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <p className="text-xs font-medium">{errors.agreeToTerms}</p>
                  </div>
                </div>
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
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-brand-gray">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-medium text-brand-pink hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
