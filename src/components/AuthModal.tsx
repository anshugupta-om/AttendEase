import React, { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { Mail, Lock, LogIn, UserPlus, KeyRound, Loader2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const getFriendlyErrorMessage = (code: string) => {
    switch (code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'Invalid email or password. Please try again.';
      case 'auth/email-already-in-use':
        return 'This email is already registered. Please sign in instead.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters long.';
      case 'auth/invalid-email':
        return 'Please enter a valid student email address.';
      case 'auth/popup-closed-by-user':
        return 'Google sign-in cancelled.';
      case 'auth/popup-blocked':
        return 'Sign-in popup was blocked by your browser. Please allow popups for this site and try again.';
      case 'auth/cancelled-popup-request':
        return 'Sign-in request was cancelled as another sign-in attempt was started.';
      case 'auth/network-request-failed':
        return 'Network connection failed. Please check your internet connection and try again.';
      case 'auth/internal-error':
        return 'Connection to sign-in service failed. Please check your network connection or DNS settings and try again.';
      default:
        return 'An error occurred during authentication. Please try again.';
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (activeTab === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
        if (onClose) onClose();
      } else if (activeTab === 'register') {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (name && userCredential.user) {
          await updateProfile(userCredential.user, { displayName: name });
        }
        if (onClose) onClose();
      } else if (activeTab === 'forgot') {
        await sendPasswordResetEmail(auth, email);
        setSuccess('Password reset link sent! Check your inbox.');
      }
    } catch (err: any) {
      console.error(err);
      setError(getFriendlyErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      if (onClose) onClose();
    } catch (err: any) {
      const benignErrors = ['auth/popup-closed-by-user', 'auth/popup-blocked', 'auth/cancelled-popup-request'];
      if (!benignErrors.includes(err.code)) {
        console.error(err);
      } else {
        console.warn(`Google sign-in popup was not completed: ${err.code}`);
      }
      setError(getFriendlyErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 font-bmw">
      <div className="bg-surface-card rounded-lg max-w-md w-full border border-hairline-strong shadow-2xl p-6 space-y-6">
        
        {/* Brand Banner */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-1">
            <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center text-white font-bold text-sm shadow-sm transition-transform hover:scale-105">
              AE
            </div>
          </div>
          <h2 className="text-xl font-bold text-ink tracking-tight">
            Sign in to AttendEase
          </h2>
          <p className="text-xs text-muted font-normal">
            Orchestrate your academic schedule with ease
          </p>
        </div>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-2.5 px-4 bg-canvas hover:bg-surface-soft text-ink border border-hairline-strong font-semibold text-xs rounded-md flex items-center justify-center space-x-2 transition-all disabled:opacity-50 cursor-pointer shadow-sm"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-hairline w-full" />
          <span className="bg-surface-card px-3 text-[10px] text-muted uppercase font-bold tracking-[1px] absolute">
            or use credentials
          </span>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-canvas-soft p-1 border border-hairline-strong rounded-md text-xs font-semibold">
          <button
            onClick={() => {
              setActiveTab('login');
              setError(null);
              setSuccess(null);
            }}
            className={`flex-1 py-2 rounded-sm transition-all tracking-[0.5px] text-[11px] font-bold cursor-pointer ${
              activeTab === 'login'
                ? 'bg-canvas text-ink shadow-sm'
                : 'text-muted hover:text-ink'
            }`}
          >
            Email Login
          </button>
          <button
            onClick={() => {
              setActiveTab('register');
              setError(null);
              setSuccess(null);
            }}
            className={`flex-1 py-2 rounded-sm transition-all tracking-[0.5px] text-[11px] font-bold cursor-pointer ${
              activeTab === 'register'
                ? 'bg-canvas text-ink shadow-sm'
                : 'text-muted hover:text-ink'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs font-semibold rounded-md border border-red-200/50 uppercase tracking-[0.5px]">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 text-xs font-semibold rounded-md border border-green-200/50 uppercase tracking-[0.5px]">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {activeTab === 'register' && (
            <div>
              <label className="block text-[10px] font-bold tracking-[1px] uppercase text-muted mb-1 font-mono">
                Full Name
              </label>
              <input
                type="text"
                required
                disabled={loading}
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                placeholder="Student Name"
                className="w-full px-4 py-2.5 bg-canvas border border-hairline-strong rounded-md text-xs text-ink focus:outline-none focus:border-text-link disabled:opacity-50 tracking-[0.5px]"
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold tracking-[1px] uppercase text-muted mb-1 font-mono">
              Student Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-muted absolute left-3 top-3" />
              <input
                type="email"
                required
                disabled={loading}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="student@college.edu"
                className="w-full pl-10 pr-4 py-2.5 bg-canvas border border-hairline-strong rounded-md text-xs text-ink focus:outline-none focus:border-text-link disabled:opacity-50 tracking-[0.5px]"
              />
            </div>
          </div>

          {activeTab !== 'forgot' && (
            <div>
              <label className="block text-[10px] font-bold tracking-[1px] uppercase text-muted mb-1 font-mono">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  disabled={loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={activeTab === 'login' ? 'current-password' : 'new-password'}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-canvas border border-hairline-strong rounded-md text-xs text-ink focus:outline-none focus:border-text-link disabled:opacity-50 tracking-[0.5px]"
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.5px] pt-1">
            {activeTab === 'login' ? (
              <button
                type="button"
                onClick={() => {
                  setActiveTab('forgot');
                  setError(null);
                  setSuccess(null);
                }}
                className="text-text-link hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            ) : activeTab === 'forgot' ? (
              <button
                type="button"
                onClick={() => {
                  setActiveTab('login');
                  setError(null);
                  setSuccess(null);
                }}
                className="text-text-link hover:underline cursor-pointer"
              >
                Back to Login
              </button>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-white font-semibold text-xs rounded-md hover:bg-primary-active transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer shadow-sm border-0"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : activeTab === 'login' ? (
              <>
                <LogIn className="w-4 h-4 text-white" />
                <span>Sign In to Tracker</span>
              </>
            ) : activeTab === 'register' ? (
              <>
                <UserPlus className="w-4 h-4 text-white" />
                <span>Create Student Account</span>
              </>
            ) : (
              <>
                <KeyRound className="w-4 h-4 text-white" />
                <span>Send Reset Link</span>
              </>
            )}
          </button>
        </form>

        {onClose && (
          <div className="text-center pt-2">
            <button 
              onClick={onClose}
              className="text-[10px] text-muted hover:text-ink uppercase tracking-[1px] transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
