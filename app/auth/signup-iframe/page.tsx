'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Users, Camera, Calendar, LogOut, Loader2, Video, Expand } from 'lucide-react';

export default function SignupIframePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [authView, setAuthView] = useState<'sign_up' | 'sign_in'>('sign_up');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth-token');
        if (token) {
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
          }
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Min 6 characters';
    }

    if (authView === 'sign_up' && !formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const endpoint = authView === 'sign_up' ? '/api/auth/signup' : '/api/auth/login';
      const response = await fetch(endpoint, {
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
        }
        setIsRedirecting(true);
        setTimeout(() => {
          try {
            window.parent.location.href = '/dashboard';
          } catch (error) {
            window.parent.postMessage({ type: 'DOOZI_REDIRECT', redirectTo: '/dashboard' }, '*');
          }
        }, 500);
      } else {
        const data = await response.json();
        setErrors({ submit: data.error || 'An error occurred' });
      }
    } catch (error) {
      setErrors({ submit: 'An error occurred' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
      localStorage.removeItem('auth-token');
      setUser(null);
      window.location.reload();
    } catch (error) {
      console.error('Logout failed');
      localStorage.removeItem('auth-token');
      setUser(null);
      window.location.reload();
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-pink animate-spin" />
      </div>
    );
  }

  if (isRedirecting) {
    return (
      <div className="w-full h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-brand-pink to-brand-purple rounded-full flex items-center justify-center mb-6 mx-auto">
            <MapPin className="text-white h-10 w-10" />
          </div>
          <Loader2 className="w-8 h-8 text-brand-pink animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Welcome to Doozi!</h2>
          <p className="text-gray-600">Taking you to your dashboard...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="w-full h-screen bg-white overflow-hidden relative flex items-center justify-center">
        <div className="w-full max-w-sm px-6 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-brand-pink to-brand-purple rounded-full flex items-center justify-center mb-6 mx-auto">
            <MapPin className="text-white h-10 w-10" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4 text-gray-900">
            Welcome to Doozi!
          </h1>
          
          <p className="text-gray-600 text-base leading-relaxed mb-8">
            You're viewing Doozi in a preview window. Open the full app for the best experience.
          </p>

          <button
            onClick={() => {
              try {
                window.parent.location.href = '/dashboard';
              } catch (error) {
                window.parent.postMessage({ type: 'DOOZI_REDIRECT', redirectTo: '/dashboard' }, '*');
              }
            }}
            className="w-full bg-brand-pink text-white font-bold py-4 px-6 rounded-2xl hover:bg-[#E63E6E] transition-colors flex items-center justify-center gap-3 text-lg"
          >
            <Expand className="w-5 h-5" />
            Open Full App
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="max-h-screen overflow-y-auto">
        <div className="px-6 py-4" style={{ paddingTop: '40px' }}>
          <div className="text-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-brand-pink to-brand-purple rounded-full flex items-center justify-center mb-3 mx-auto">
              <MapPin className="text-white h-6 w-6" />
            </div>
            
            <h1 className="text-xl font-bold mb-2 text-gray-900">
              {authView === 'sign_up' ? 'Join Doozi' : 'Welcome Back!'}
            </h1>
            
            <p className="text-gray-600 text-sm">
              {authView === 'sign_up' 
                ? 'Discover amazing places through travel videos'
                : 'Sign in to your account'
              }
            </p>
          </div>

          {authView === 'sign_up' && (
            <div className="mb-4">
              <div className="flex items-start space-x-3">
                <input
                  id="terms-iframe"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-brand-pink focus:ring-brand-pink"
                />
                <label htmlFor="terms-iframe" className="text-xs text-gray-500">
                  I agree to the{' '}
                  <a href="/terms" target="_parent" className="text-brand-pink hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="/privacy" target="_parent" className="text-brand-pink hover:underline">
                    Privacy Policy
                  </a>.
                </label>
              </div>
              {errors.agreeToTerms && (
                <p className="text-red-500 text-xs mt-1">{errors.agreeToTerms}</p>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Email address"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-pink focus:border-transparent transition-all text-sm"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder={authView === 'sign_up' ? 'Create password' : 'Password'}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-pink focus:border-transparent transition-all text-sm"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            {errors.submit && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                <p className="text-sm text-red-800">{errors.submit}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand-pink text-white font-semibold py-3 px-6 rounded-xl hover:bg-[#E63E6E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Please wait...' : authView === 'sign_up' ? 'Create Doozi account' : 'Sign in to Doozi'}
            </button>
          </form>

          <div className="text-center text-sm mt-4">
            <p className="text-gray-600">
              {authView === 'sign_up' ? (
                <>
                  Already have an account?{' '}
                  <button
                    onClick={() => setAuthView('sign_in')}
                    className="font-semibold text-brand-pink hover:underline"
                  >
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{' '}
                  <button
                    onClick={() => setAuthView('sign_up')}
                    className="font-semibold text-brand-pink hover:underline"
                  >
                    Sign up for free
                  </button>
                </>
              )}
            </p>
          </div>

          {authView === 'sign_up' && (
            <div className="border-t border-gray-200 pt-4 mt-4">
              <p className="text-xs text-gray-500 text-center mb-3">What you'll get:</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <Camera className="h-4 w-4 text-brand-pink mx-auto mb-1" />
                  <p className="text-xs text-gray-600">Travel Videos</p>
                </div>
                <div>
                  <Calendar className="h-4 w-4 text-brand-pink mx-auto mb-1" />
                  <p className="text-xs text-gray-600">Trip Planning</p>
                </div>
                <div>
                  <Users className="h-4 w-4 text-brand-pink mx-auto mb-1" />
                  <p className="text-xs text-gray-600">Community</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
