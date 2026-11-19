import { useState, type FormEvent } from 'react';
import { AlertCircle, Eye, EyeOff, Shield } from 'lucide-react';
import { api } from '../api/client';
import { MVP_ADMIN_PASSKEY } from '../data/seedData';
import type { AppRoute } from '../types';
import { validateEmail } from '../utils/format';

interface AdminLoginPageProps {
  onAdminAuthenticated: (email: string) => void;
  onNavigate: (route: AppRoute) => void;
}

export function AdminLoginPage({ onAdminAuthenticated, onNavigate }: AdminLoginPageProps) {
  const [email, setEmail] = useState('founder@urbanloom.in');
  const [passkey, setPasskey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validateEmail(email)) {
      setError('Please enter a valid admin email address.');
      return;
    }
    if (!passkey.trim()) {
      setError('Please enter the admin passkey.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.adminLogin(email, passkey);
      if (res.authenticated) {
        onAdminAuthenticated(res.email);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Admin authentication failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-[500px] mx-auto px-4 sm:px-6 py-12 lg:py-16 space-y-6">
      <div className="bg-[#EFECE6] border border-[#D8D1C5] rounded-md p-4 text-xs text-[#1A1917] space-y-1.5">
        <div className="flex items-center gap-2 font-semibold">
          <Shield className="w-4 h-4 text-[#4B5842]" />
          <span>Backend-Enforced Admin Gate</span>
        </div>
        <p className="text-[#635E56] leading-relaxed">
          Admin APIs (<code className="font-mono">/api/admin/*</code>) reject unauthenticated
          requests with HTTP 403 on the server. Because Firebase Admin RBAC was not provisioned, use
          the MBA Presenter Passkey below to unlock the live Analytics &amp; Inventory Dashboard:
        </p>
        <p className="font-mono text-xs bg-white border border-[#D8D1C5] rounded-sm px-2.5 py-1.5 inline-block text-[#1A1917]">
          Passkey: {MVP_ADMIN_PASSKEY}
        </p>
      </div>

      <div className="bg-white border border-[#E2DDD3] rounded-lg p-6 sm:p-8 space-y-6">
        <div className="space-y-1">
          <p className="text-xs font-medium text-[#4B5842]">Restricted Operations</p>
          <h1 className="font-editorial text-2xl font-medium text-[#1A1917]">
            Urban Loom Admin Login
          </h1>
          <p className="text-xs text-[#635E56]">
            Authorised founders and operations leads only.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="adm-email" className="block text-xs font-medium text-[#1A1917] mb-1.5">
              Admin Email
            </label>
            <input
              id="adm-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D8D1C5] rounded-md focus:outline-none focus:border-[#4B5842]"
            />
          </div>

          <div>
            <label htmlFor="adm-key" className="block text-xs font-medium text-[#1A1917] mb-1.5">
              Admin Passkey
            </label>
            <div className="relative">
              <input
                id="adm-key"
                type={showKey ? 'text' : 'password'}
                required
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                placeholder="Enter MVP admin passkey"
                className="w-full pl-3.5 pr-10 py-2.5 text-sm font-mono bg-white border border-[#D8D1C5] rounded-md focus:outline-none focus:border-[#4B5842]"
              />
              <button
                type="button"
                onClick={() => setShowKey((prev) => !prev)}
                aria-label={showKey ? 'Hide passkey' : 'Show passkey'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#635E56]"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-[#FDF2F2] border border-[#E5B8B8] rounded-md text-xs text-[#8B2E2E] flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-4 bg-[#1A1917] text-white text-xs font-medium rounded-md hover:bg-[#33312D] disabled:opacity-60"
          >
            {submitting ? 'Verifying Session...' : 'Access Admin Dashboard'}
          </button>
        </form>

        <p className="text-center text-xs text-[#635E56]">
          <button
            type="button"
            onClick={() => onNavigate({ page: 'home' })}
            className="hover:underline"
          >
            Return to Storefront
          </button>
        </p>
      </div>
    </div>
  );
}
