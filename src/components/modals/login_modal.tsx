'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faTimes, faCode } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components/buttons/button';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (credentials: { username: string; password: string }) => Promise<void>;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle modal entrance/exit animation
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';
    } else {
      setIsAnimating(false);
      document.body.style.overflow = 'unset';
      setError('');
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({ username, password });
      setUsername('');
      setPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-2000 flex items-center justify-center transition-all duration-300 ${
        isAnimating
          ? 'bg-black/20 backdrop-blur-sm'
          : 'bg-black/0 backdrop-blur-none'
      }`}
      onClick={handleBackdropClick}
    >
      {/* ANIMATED BACKGROUND ELEMENTS */}

      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        {/* SUBTLE DOTTED PATTERN */}

        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%">
            <defs>
              <pattern
                id="dots"
                patternUnits="userSpaceOnUse"
                width="40"
                height="40"
              >
                <circle cx="20" cy="20" r="2" fill="rgb(37, 99, 235)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>
      </div>

      {/* MODAL CARD */}

      <div
        ref={modalRef}
        className={`relative w-full max-w-[420px] mx-4 bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden transition-all duration-500 transform ${
          isAnimating
            ? 'scale-100 opacity-100'
            : 'scale-95 opacity-0 pointer-events-none'
        }`}
      >

        {/* CLOSE BUTTON */}

        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="absolute top-6 right-6 z-10"
          aria-label="Close modal"
        >
          <FontAwesomeIcon icon={faTimes} className="text-slate-500" />
        </Button>

        {/* CONTENT */}

        <div className="px-8 py-10 dark:bg-slate-900">
          <div className="flex flex-col items-center mb-8">
            <div className="mb-4 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-xl">
              <FontAwesomeIcon icon={faCode} className="text-blue-500 dark:text-blue-600 text-4xl" />
            </div>
            <h1 className="text-xl md:text-3xl font-bold mb-2">
              Welcome Back
            </h1>
            <p className="text-xs md:text-base text-center text-slate-600 dark:text-slate-400">
              Sign in to access your portfolio dashboard.
            </p>
          </div>

          {/* ERROR MESSAGE */}

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* FORM */}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium mb-2"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                className="w-full px-3 py-2 border border-slate-200 outline-none rounded-lg placeholder-slate-400 disabled:bg-slate-50 disabled:text-slate-500 dark:border-slate-600 placeholder:text-slate-500 dark:placeholder:text-slate-600"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full px-3 py-2 pr-12 border border-slate-200 outline-none rounded-lg placeholder-slate-400 disabled:bg-slate-50 disabled:text-slate-500 dark:border-slate-600 placeholder:text-slate-500 dark:placeholder:text-slate-600"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <FontAwesomeIcon icon={faEyeSlash} className="text-slate-500" />
                  ) : (
                    <FontAwesomeIcon icon={faEye} className="text-slate-500" />
                  )}
                </Button>
              </div>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-3 bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 text-base font-semibold rounded-lg shadow-lg"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <span>→</span>
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
