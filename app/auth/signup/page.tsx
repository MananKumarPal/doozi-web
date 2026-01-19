'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MapPin, Eye, EyeOff, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function SignupPage() {
  const router = useRouter();
  const { user, loading: authLoading, refreshUser } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkTimeout, setCheckTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    return () => {
      if (checkTimeout) {
        clearTimeout(checkTimeout);
      }
    };
  }, [checkTimeout]);

  const checkUsernameAvailability = async (usernameToCheck: string) => {
    if (!usernameToCheck) {
      setUsernameAvailable(null);
      return;
    }

    if (usernameToCheck.length < 3) {
      setErrors({ ...errors, username: 'Username must be at least 3 characters' });
      setUsernameAvailable(false);
      return;
    }

    if (usernameToCheck.length > 30) {
      setErrors({ ...errors, username: 'Username must be less than 30 characters' });
      setUsernameAvailable(false);
      return;
    }

    if (!/^[a-z0-9_]+$/i.test(usernameToCheck)) {
      setErrors({ ...errors, username: 'Username can only contain letters, numbers, and underscores' });
      setUsernameAvailable(false);
      return;
    }

    setIsCheckingUsername(true);
    setErrors({ ...errors, username: '' });

    try {
      const response = await fetch(`/api/auth/check-username?username=${encodeURIComponent(usernameToCheck)}`);

      if (response.ok) {
        const data = await response.json();
        const available = data.result?.available ?? data.available ?? false;
        setUsernameAvailable(available);
        if (!available) {
          setErrors({ ...errors, username: 'Username is already taken' });
        }
      } else {
        const data = await response.json();
        setErrors({ ...errors, username: data.error || 'Error checking username' });
        setUsernameAvailable(false);
      }
    } catch (error) {
      setErrors({ ...errors, username: 'Failed to check username availability' });
      setUsernameAvailable(false);
    } finally {
      setIsCheckingUsername(false);
    }
  };

  const handleUsernameChange = (value: string) => {
    const lowerValue = value.toLowerCase();
    setFormData({ ...formData, username: lowerValue });
    setUsernameAvailable(null);
    setErrors({ ...errors, username: '' });

    if (checkTimeout) {
      clearTimeout(checkTimeout);
    }

    const timeout = setTimeout(() => {
      if (lowerValue) {
        checkUsernameAvailability(lowerValue);
      }
    }, 500);

    setCheckTimeout(timeout);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.username) {
      if (formData.username.length < 3) {
        newErrors.username = 'Username must be at least 3 characters';
      } else if (formData.username.length > 30) {
        newErrors.username = 'Username must be less than 30 characters';
      } else if (!/^[a-z0-9_]+$/i.test(formData.username)) {
        newErrors.username = 'Username can only contain letters, numbers, and underscores';
      } else if (usernameAvailable === false) {
        newErrors.username = 'Username is already taken';
      }
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
          username: formData.username.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.requires_verification) {
          router.push(`/auth/verify-email?email=${encodeURIComponent(formData.email)}`);
        } else {
          if (data.token) {
            localStorage.setItem('auth-token', data.token);
            await refreshUser();
          } else {
            setErrors({ submit: 'Account created but failed to get authentication token' });
          }
        }
      } else {
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
            Join Doozi Today
          </h2>
          <p className="mb-8 text-lg text-white/90">
            Discover and share amazing travel experiences from creators around the world.
          </p>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-bold mb-1">Discover Travel Content</h3>
                <p className="text-white/80 text-sm">
                  Browse curated travel videos from creators worldwide
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-bold mb-1">Save Your Favorites</h3>
                <p className="text-white/80 text-sm">
                  Create collections of videos for your next adventure
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-sm font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-bold mb-1">Apply to be a Creator</h3>
                <p className="text-white/80 text-sm">
                  Share your travel experiences and build your audience
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
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-black mb-2">
              Create your account
            </h2>
            <p className="text-sm text-brand-gray mb-6">
              Start your journey with Doozi
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-brand-black mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    setErrors({ ...errors, email: '' });
                  }}
                  className={`input ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-brand-black mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      setErrors({ ...errors, password: '' });
                    }}
                    className={`input pr-10 ${errors.password ? 'border-red-500' : ''}`}
                    placeholder="At least 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray hover:text-brand-black"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-brand-black mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => {
                      setFormData({ ...formData, confirmPassword: e.target.value });
                      setErrors({ ...errors, confirmPassword: '' });
                    }}
                    className={`input pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray hover:text-brand-black"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-brand-black mb-1">
                  Username 
                </label>
                <div className="relative">
                  <input
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    className={`input pr-10 ${
                      errors.username ? 'border-red-500' : 
                      usernameAvailable === true ? 'border-green-500' : ''
                    }`}
                    placeholder="Choose a username"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {isCheckingUsername && (
                      <Loader2 className="w-5 h-5 text-brand-gray animate-spin" />
                    )}
                    {!isCheckingUsername && usernameAvailable === true && formData.username && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    {!isCheckingUsername && usernameAvailable === false && formData.username && (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                </div>
                {errors.username && (
                  <p className="mt-1 text-sm text-red-500">{errors.username}</p>
                )}
                {usernameAvailable === true && formData.username && !errors.username && (
                  <p className="mt-1 text-sm text-green-600">✓ Username is available</p>
                )}
                <p className="mt-1 text-xs text-brand-gray">
                  Lock in your username before the app goes live! (3-30 characters, letters, numbers, and underscores only)
                </p>
              </div>

              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{errors.submit}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full button-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-brand-gray">
                Already have an account?{' '}
                <Link href="/auth/login" className="font-medium text-brand-pink hover:text-brand-pink/80">
                  Sign in
                </Link>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-xs text-brand-gray">
                By creating an account, you agree to our{' '}
                <Link href="/terms" className="text-brand-pink hover:underline">
                  Terms
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-brand-pink hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
