import { useState, type FormEvent } from 'react';
import { AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { FirebaseSetupBanner } from '../components/FirebaseSetupBanner';
import type { AppRoute } from '../types';
import {
  validateEmail,
  validateIndianMobile,
  validateStrongPassword,
} from '../utils/format';

interface AuthPagesProps {
  mode: 'login' | 'signup' | 'forgot-password';
  onNavigate: (route: AppRoute) => void;
  redirectNotice?: string | null;
}

export function AuthPages({ mode, onNavigate, redirectNotice }: AuthPagesProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  const passwordCheck = validateStrongPassword(password);

  const handleGoogleAuth = () => {
    setInfoMsg(null);
    setErrorMsg(
      'Google Sign-In requires an active Firebase Authentication configuration. Provision Firebase and enable the Google provider in Firebase Console before signing in.',
    );
  };

  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setInfoMsg(null);

    if (!validateEmail(email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setErrorMsg(
      'Cannot authenticate: Firebase Authentication is not configured in this environment. Follow the setup instructions above to connect Email/Password sign-in.',
    );
  };

  const handleSignUpSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setInfoMsg(null);

    if (fullName.trim().length < 2) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!validateEmail(email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!validateIndianMobile(mobile)) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    if (!passwordCheck.valid) {
      setErrorMsg(`Password must include: ${passwordCheck.errors.join(', ')}.`);
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Confirm Password does not match Password.');
      return;
    }
    if (!acceptedTerms) {
      setErrorMsg('Please accept the Terms and Conditions to create an account.');
      return;
    }

    setErrorMsg(
      'Validation passed, but Firebase Authentication is not configured yet. Connect Firebase Auth & Firestore to persist new customer registrations.',
    );
  };

  const handleForgotSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setInfoMsg(null);

    if (!validateEmail(email)) {
      setErrorMsg('Please enter your registered email address.');
      return;
    }

    setErrorMsg(
      'Password reset emails are dispatched via Firebase Authentication (sendPasswordResetEmail), which is currently unconfigured. See setup instructions above.',
    );
  };

  return (
    <div className="max-w-[520px] mx-auto px-4 sm:px-6 py-10 lg:py-16 space-y-6">
      {redirectNotice && (
        <div className="p-3.5 bg-[#FFF9ED] border border-[#E5D3B3] rounded-md text-xs text-[#6E4F3A]">
          {redirectNotice}
        </div>
      )}

      <FirebaseSetupBanner />

      <div className="bg-white border border-[#E2DDD3] rounded-lg p-6 sm:p-8 space-y-6">
        {mode === 'login' && (
          <>
            <div className="space-y-1">
              <p className="text-xs font-medium text-[#4B5842]">Urban Loom Account</p>
              <h1 className="font-editorial text-2xl sm:text-3xl font-medium text-[#1A1917]">
                Welcome Back
              </h1>
              <p className="text-xs text-[#635E56]">
                Sign in to manage your pre-orders, saved addresses, and wishlist.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label htmlFor="login-email" className="block text-xs font-medium text-[#1A1917] mb-1.5">
                  Email Address
                </label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@campus.edu.in"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D8D1C5] rounded-md focus:outline-none focus:border-[#4B5842]"
                />
              </div>

              <div>
                <label htmlFor="login-password" className="block text-xs font-medium text-[#1A1917] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-3.5 pr-10 py-2.5 text-sm bg-white border border-[#D8D1C5] rounded-md focus:outline-none focus:border-[#4B5842]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#635E56] hover:text-[#1A1917]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="inline-flex items-center gap-2 text-[#635E56] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-[#D8D1C5] accent-[#4B5842]"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg(null);
                    onNavigate({ page: 'forgot-password' });
                  }}
                  className="font-medium text-[#4B5842] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              {errorMsg && (
                <div className="p-3 bg-[#FDF2F2] border border-[#E5B8B8] rounded-md text-xs text-[#8B2E2E] flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {infoMsg && (
                <div className="p-3 bg-[#F0F4ED] border border-[#C3D1B8] rounded-md text-xs text-[#2F3B28] flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{infoMsg}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#1A1917] text-white text-xs font-medium rounded-md hover:bg-[#33312D] transition-colors"
              >
                Login
              </button>
            </form>

            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#EFECE6]" />
              </div>
              <div className="relative flex justify-center text-[11px]">
                <span className="px-3 bg-white text-[#8D867B]">or</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleAuth}
              className="w-full py-2.5 px-4 border border-[#D8D1C5] text-[#1A1917] text-xs font-medium rounded-md hover:bg-[#F7F5F0] transition-colors flex items-center justify-center gap-2"
            >
              <span>Continue with Google (Requires Firebase)</span>
            </button>

            <div className="pt-2 text-center text-xs text-[#635E56] space-y-2">
              <p>
                New to Urban Loom?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg(null);
                    onNavigate({ page: 'signup' });
                  }}
                  className="font-semibold text-[#1A1917] hover:underline"
                >
                  Create a New Account
                </button>
              </p>
              <p>
                Staff or Founder?{' '}
                <button
                  type="button"
                  onClick={() => onNavigate({ page: 'admin-login' })}
                  className="font-medium text-[#4B5842] hover:underline"
                >
                  Admin Portal Login
                </button>
              </p>
            </div>
          </>
        )}

        {mode === 'signup' && (
          <>
            <div className="space-y-1">
              <p className="text-xs font-medium text-[#4B5842]">Join Urban Loom</p>
              <h1 className="font-editorial text-2xl sm:text-3xl font-medium text-[#1A1917]">
                Create Your Account
              </h1>
              <p className="text-xs text-[#635E56]">
                Save your wishlist, track limited-batch pre-orders, and manage delivery addresses.
              </p>
            </div>

            <form onSubmit={handleSignUpSubmit} className="space-y-4">
              <div>
                <label htmlFor="su-name" className="block text-xs font-medium text-[#1A1917] mb-1.5">
                  Full Name
                </label>
                <input
                  id="su-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Meera Kapoor"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D8D1C5] rounded-md focus:outline-none focus:border-[#4B5842]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="su-email" className="block text-xs font-medium text-[#1A1917] mb-1.5">
                    Email Address
                  </label>
                  <input
                    id="su-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@campus.edu.in"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D8D1C5] rounded-md focus:outline-none focus:border-[#4B5842]"
                  />
                </div>
                <div>
                  <label htmlFor="su-mobile" className="block text-xs font-medium text-[#1A1917] mb-1.5">
                    Mobile Number
                  </label>
                  <input
                    id="su-mobile"
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="9811223344"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D8D1C5] rounded-md focus:outline-none focus:border-[#4B5842]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="su-password" className="block text-xs font-medium text-[#1A1917] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="su-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 8 chars, uppercase, number & symbol"
                    className="w-full pl-3.5 pr-10 py-2.5 text-sm bg-white border border-[#D8D1C5] rounded-md focus:outline-none focus:border-[#4B5842]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#635E56]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-[#635E56] mt-1">
                  Requires 8+ characters, 1 uppercase letter, 1 number, and 1 special character.
                </p>
              </div>

              <div>
                <label htmlFor="su-confirm" className="block text-xs font-medium text-[#1A1917] mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="su-confirm"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full pl-3.5 pr-10 py-2.5 text-sm bg-white border border-[#D8D1C5] rounded-md focus:outline-none focus:border-[#4B5842]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#635E56]"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <label className="flex items-start gap-2 text-xs text-[#635E56] cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-0.5 rounded border-[#D8D1C5] accent-[#4B5842]"
                />
                <span>
                  I accept Urban Loom&apos;s Terms &amp; Conditions and sustainable batch pre-order
                  policy.
                </span>
              </label>

              {errorMsg && (
                <div className="p-3 bg-[#FDF2F2] border border-[#E5B8B8] rounded-md text-xs text-[#8B2E2E] flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#4B5842] text-white text-xs font-medium rounded-md hover:bg-[#3B4634] transition-colors"
              >
                Create Account
              </button>
            </form>

            <button
              type="button"
              onClick={handleGoogleAuth}
              className="w-full py-2.5 px-4 border border-[#D8D1C5] text-[#1A1917] text-xs font-medium rounded-md hover:bg-[#F7F5F0] transition-colors"
            >
              Continue with Google (Requires Firebase)
            </button>

            <p className="text-center text-xs text-[#635E56]">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  onNavigate({ page: 'login' });
                }}
                className="font-semibold text-[#1A1917] hover:underline"
              >
                Login
              </button>
            </p>
          </>
        )}

        {mode === 'forgot-password' && (
          <>
            <div className="space-y-1">
              <p className="text-xs font-medium text-[#4B5842]">Password Recovery</p>
              <h1 className="font-editorial text-2xl sm:text-3xl font-medium text-[#1A1917]">
                Reset Your Password
              </h1>
              <p className="text-xs text-[#635E56]">
                Enter your registered email address to receive a Firebase password reset link.
              </p>
            </div>

            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div>
                <label htmlFor="fp-email" className="block text-xs font-medium text-[#1A1917] mb-1.5">
                  Registered Email Address
                </label>
                <input
                  id="fp-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@campus.edu.in"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D8D1C5] rounded-md focus:outline-none focus:border-[#4B5842]"
                />
              </div>

              {errorMsg && (
                <div className="p-3 bg-[#FDF2F2] border border-[#E5B8B8] rounded-md text-xs text-[#8B2E2E] flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#1A1917] text-white text-xs font-medium rounded-md hover:bg-[#33312D]"
              >
                Send Password Reset Link
              </button>
            </form>

            <p className="text-center text-xs text-[#635E56]">
              Remembered your password?{' '}
              <button
                type="button"
                onClick={() => {
                  setErrorMsg(null);
                  onNavigate({ page: 'login' });
                }}
                className="font-semibold text-[#1A1917] hover:underline"
              >
                Back to Login
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
