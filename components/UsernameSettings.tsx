'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader2, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function UsernameSettings() {
  const { user, refreshUser } = useAuth();
  
  const [username, setUsername] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [checkTimeout, setCheckTimeout] = useState<NodeJS.Timeout | null>(null);

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

    // Clear previous timeout
    if (checkTimeout) {
      clearTimeout(checkTimeout);
    }

    // Set new timeout to check availability after user stops typing
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

  return (
    <div className="bg-white rounded-2xl shadow-card p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-brand-pink/10 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-brand-pink" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-brand-black">Username</h3>
          <p className="text-sm text-brand-gray">
            Your unique identifier on Doozi
          </p>
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
      </div>
    </div>
  );
}
