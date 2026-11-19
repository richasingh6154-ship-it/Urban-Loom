import { useState, type FormEvent } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { api } from '../api/client';
import type { AppRoute } from '../types';
import { validateEmail } from '../utils/format';

interface FooterProps {
  onNavigate: (route: AppRoute) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; text?: string }>({
    type: 'idle',
  });

  const handleSubscribe = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setStatus({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }
    setStatus({ type: 'loading' });
    try {
      const res = await api.subscribeNewsletter(email);
      setEmail('');
      setStatus({ type: 'success', text: res.message });
    } catch (err) {
      setStatus({
        type: 'error',
        text: err instanceof Error ? err.message : 'Unable to subscribe right now.',
      });
    }
  };

  return (
    <footer className="bg-[#1A1917] text-[#EFECE6] border-t border-[#2E2C28]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand & Mission */}
          <div className="md:col-span-4 space-y-4">
            <h2 className="font-editorial text-2xl font-medium text-white tracking-tight">
              Urban Loom
            </h2>
            <p className="text-xs tracking-wide text-[#B7B0A4]">
              Style Today. Sustain Tomorrow.
            </p>
            <p className="text-sm text-[#C8C2B8] leading-relaxed max-w-sm">
              Affordable, small-batch everyday clothing made with certified organic cotton,
              Himalayan hemp, bamboo knit, and recycled twill for Gen Z across India.
            </p>
            <p className="text-xs text-[#9C9589]">
              Launch Hubs: Delhi NCR · Dehradun · Mumbai · Bengaluru · Pune
            </p>
          </div>

          {/* Shop & Explore */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="text-xs font-semibold tracking-wider text-[#B7B0A4]">
              Collection
            </h3>
            <ul className="space-y-2.5 text-sm text-[#DDD7CE]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ page: 'shop', category: 'All' })}
                  className="hover:text-white transition-colors"
                >
                  All Garments
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ page: 'shop', category: 'T-shirts' })}
                  className="hover:text-white transition-colors"
                >
                  Organic T-Shirts
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ page: 'shop', category: 'Shirts' })}
                  className="hover:text-white transition-colors"
                >
                  Hemp & Linen Shirts
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ page: 'shop', category: 'Casual Wear' })}
                  className="hover:text-white transition-colors"
                >
                  Casual Wear
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ page: 'shop', category: 'Everyday Essentials' })}
                  className="hover:text-white transition-colors"
                >
                  Everyday Essentials
                </button>
              </li>
            </ul>
          </div>

          {/* Community & Operations */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="text-xs font-semibold tracking-wider text-[#B7B0A4]">
              Experience
            </h3>
            <ul className="space-y-2.5 text-sm text-[#DDD7CE]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ page: 'find-us' })}
                  className="hover:text-white transition-colors"
                >
                  Find Us Near You
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ page: 'feedback' })}
                  className="hover:text-white transition-colors"
                >
                  Fabric Feedback
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ page: 'about' })}
                  className="hover:text-white transition-colors"
                >
                  About & Fabrics
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ page: 'contact' })}
                  className="hover:text-white transition-colors"
                >
                  Contact Studio
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate({ page: 'admin-login' })}
                  className="hover:text-white transition-colors text-[#B7B0A4]"
                >
                  Admin Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div className="md:col-span-4 space-y-4">
            <h3 className="text-xs font-semibold tracking-wider text-[#B7B0A4]">
              Batch Drops & Campus Alerts
            </h3>
            <p className="text-sm text-[#C8C2B8]">
              Get notified when new limited-batch ₹1,200 releases open and when our pop-up
              rack arrives at your university.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <label htmlFor="footer-newsletter" className="sr-only">
                Email address
              </label>
              <input
                id="footer-newsletter"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@campus.edu.in"
                className="flex-1 min-w-0 px-3.5 py-2.5 text-sm bg-[#262421] border border-[#3B3833] rounded-md text-white placeholder-[#8D867B] focus:outline-none focus:border-[#7B8E6D]"
              />
              <button
                type="submit"
                disabled={status.type === 'loading'}
                className="px-4 py-2.5 text-xs font-medium bg-[#4B5842] text-white rounded-md hover:bg-[#5B6B50] transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 disabled:opacity-60"
              >
                <span>Join</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
            {status.type === 'success' && (
              <p className="text-xs text-[#A3B899] flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                {status.text}
              </p>
            )}
            {status.type === 'error' && (
              <p className="text-xs text-[#E5989B]">{status.text}</p>
            )}
            <div className="pt-2 text-xs text-[#9C9589] space-y-1">
              <p>hello@urbanloom.in · +91 80 4123 7890</p>
              <p>Instagram @urbanloom.in · LinkedIn /urban-loom-india</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#2E2C28] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9C9589]">
          <p>© {new Date().getFullYear()} Urban Loom Apparel Pvt. Ltd. All rights reserved.</p>
          <p>Limited-batch sustainable production · Transparent INR pricing</p>
        </div>
      </div>
    </footer>
  );
}
