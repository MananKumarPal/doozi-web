'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MapPin, ArrowLeft, CheckCircle, XCircle, Loader2, User, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function SettingsPage() {
  const router = useRouter();
  const { user, loading: authLoading, refreshUser } = useAuth();
  
  const [username, setUsername] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [checkTimeout, setCheckTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }

    if (user && !user.emailVerified) {
      router.push(`/auth/verify-email?email=${encodeURIComponent(user.email)}`);
      return;
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.username) {
      setUsername(user.username);
    }
  }, [user]);

  const checkUsernameAvailability = async (usernameToCheck: string) => {
    if (!usernameToCheck || usernameToCheck === user?.username) {
      setIsAvailable(null);
      return;
    }

    if (usernameToCheck.length < 3) {
      setError('Username must be at least 3 characters');
      setIsAvailable(false);
      return;
    }

    if (usernameToCheck.length > 30) {
      setError('Username must be less than 30 characters');
      setIsAvailable(false);
      return;
    }

    if (!/^[a-z0-9_]+$/i.test(usernameToCheck)) {
      setError('Username can only contain letters, numbers, and underscores');
      setIsAvailable(false);
      return;
    }

    setIsChecking(true);
    setError('');

    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`/api/auth/check-username?username=${encodeURIComponent(usernameToCheck)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const available = data.result?.available ?? data.available ?? false;
        setIsAvailable(available);
        if (!available) {
          setError('Username is already taken');
        }
      } else {
        const data = await response.json();
        setError(data.error || 'Error checking username');
        setIsAvailable(false);
      }
    } catch (error) {
      setError('Failed to check username availability');
      setIsAvailable(false);
    } finally {
      setIsChecking(false);
    }
  };

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    setSuccess(false);
    setIsAvailable(null);
    setError('');

    if (checkTimeout) {
      clearTimeout(checkTimeout);
    }

    const timeout = setTimeout(() => {
      if (value && value !== user?.username) {
        checkUsernameAvailability(value);
      }
    }, 500);

    setCheckTimeout(timeout);
  };

  const handleSave = async () => {
    if (!username || username === user?.username) {
      return;
    }

    if (!isAvailable) {
      setError('Please choose an available username');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ username }),
      });

      if (response.ok) {
        await refreshUser();
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to update username');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = username && username !== user?.username;

  if (authLoading) {
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

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-black mb-2">
            Settings
          </h1>
          <p className="text-lg text-brand-gray">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-6 sm:p-8 mb-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-brand-pink/10 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-brand-pink" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-brand-black">Username</h2>
              <p className="text-sm text-brand-gray">
                Your unique identifier on Doozi
              </p>
            </div>
          </div>

          <div className="bg-brand-purple/10 border border-brand-purple/20 rounded-xl p-6 mb-6">
            <div className="flex items-start space-x-3">
              <Sparkles className="w-5 h-5 text-brand-purple flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-brand-black mb-2">Lock in Your Username Now</h3>
                <p className="text-sm text-brand-gray leading-relaxed">
                  Secure your preferred username before the app goes live! Once Doozi launches publicly, 
                  usernames will be first-come, first-served. By setting your username now, you're guaranteed 
                  to have it when the app launches to everyone.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-brand-black mb-2">
                Username
              </label>
              <div className="relative">
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => handleUsernameChange(e.target.value.toLowerCase())}
                  className={`input pr-10 ${
                    error ? 'border-red-500' : 
                    isAvailable === true ? 'border-green-500' : 
                    ''
                  }`}
                  placeholder="Enter your username"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {isChecking && (
                    <Loader2 className="w-5 h-5 text-brand-gray animate-spin" />
                  )}
                  {!isChecking && isAvailable === true && hasChanges && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                  {!isChecking && isAvailable === false && hasChanges && (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              </div>
              
              {error && (
                <p className="mt-2 text-sm text-red-500">{error}</p>
              )}
              
              {isAvailable === true && hasChanges && !error && (
                <p className="mt-2 text-sm text-green-600">
                  ✓ Username is available
                </p>
              )}

              {success && (
                <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-600">
                    ✓ Username updated successfully!
                  </p>
                </div>
              )}

              <p className="mt-2 text-xs text-brand-gray">
                Your username can only contain letters, numbers, and underscores (3-30 characters)
              </p>
            </div>

            {hasChanges && (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving || !isAvailable || isChecking}
                  className="button-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </span>
                  ) : (
                    'Save Username'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUsername(user?.username || '');
                    setIsAvailable(null);
                    setError('');
                  }}
                  className="button-secondary"
                >
                  Cancel
                </button>
              </div>
            )}

            {!hasChanges && user?.username && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-sm text-green-800">
                    Your username is set: <span className="font-bold">@{user.username}</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
