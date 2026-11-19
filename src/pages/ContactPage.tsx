import { useState, type FormEvent } from 'react';
import { Mail, MapPin, Phone, Search } from 'lucide-react';
import { api } from '../api/client';
import type { AppRoute, Order } from '../types';
import { formatINR, formatShortDate } from '../utils/format';

interface ContactPageProps {
  onNavigate: (route: AppRoute) => void;
}

export function ContactPage({ onNavigate }: ContactPageProps) {
  const [lookupRef, setLookupRef] = useState('');
  const [lookupResult, setLookupResult] = useState<Order | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLookup = async (e: FormEvent) => {
    e.preventDefault();
    setLookupError(null);
    setLookupResult(null);
    if (!lookupRef.trim()) return;
    setLoading(true);
    try {
      const res = await api.lookupOrder(lookupRef.trim());
      setLookupResult(res.order);
    } catch (err) {
      setLookupError(err instanceof Error ? err.message : 'Order reference not found.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-12">
      <div className="max-w-2xl space-y-2">
        <p className="text-xs font-medium text-[#4B5842]">Studio &amp; Student Support</p>
        <h1 className="font-editorial text-3xl sm:text-4xl font-medium text-[#1A1917]">
          Get in Touch with Urban Loom
        </h1>
        <p className="text-sm text-[#635E56]">
          Questions about campus pop-up collaborations, pre-order sizing, or wholesale club kits?
          Reach our Bengaluru studio or track an existing demo order reference below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white border border-[#E2DDD3] rounded-lg p-5 space-y-2">
            <Mail className="w-4 h-4 text-[#4B5842]" />
            <h2 className="text-sm font-semibold text-[#1A1917]">Email Studio</h2>
            <p className="text-xs text-[#635E56]">hello@urbanloom.in</p>
            <p className="text-xs text-[#635E56]">campus@urbanloom.in</p>
          </div>

          <div className="bg-white border border-[#E2DDD3] rounded-lg p-5 space-y-2">
            <Phone className="w-4 h-4 text-[#4B5842]" />
            <h2 className="text-sm font-semibold text-[#1A1917]">Support Desk</h2>
            <p className="text-xs font-mono text-[#635E56]">+91 80 4123 7890</p>
            <p className="text-xs text-[#635E56]">Mon–Sat · 10:00 AM – 6:30 PM IST</p>
          </div>

          <div className="sm:col-span-2 bg-white border border-[#E2DDD3] rounded-lg p-5 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#1A1917]">
              <MapPin className="w-4 h-4 text-[#4B5842]" />
              <span>Design Studio &amp; Launch Hubs</span>
            </div>
            <p className="text-xs text-[#635E56] leading-relaxed">
              Urban Loom Textile Lab, 80ft Road, Indiranagar, Bengaluru 560038 · Active Campus
              Operations in Delhi NCR, Dehradun, Mumbai, Bengaluru &amp; Pune.
            </p>
            <div className="pt-1 flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => onNavigate({ page: 'find-us' })}
                className="px-4 py-2 text-xs font-medium bg-[#4B5842] text-white rounded-md hover:bg-[#3B4634]"
              >
                View Campus Pop-Ups
              </button>
              <button
                type="button"
                onClick={() => onNavigate({ page: 'feedback' })}
                className="px-4 py-2 text-xs font-medium border border-[#D8D1C5] text-[#1A1917] rounded-md hover:bg-[#F7F5F0]"
              >
                Share Fabric Feedback
              </button>
            </div>
          </div>
        </div>

        {/* Public Order Lookup */}
        <div className="lg:col-span-6 bg-white border border-[#E2DDD3] rounded-lg p-6 sm:p-8 space-y-5">
          <div>
            <h2 className="font-editorial text-2xl font-medium text-[#1A1917]">
              Track Demo Pre-order Status
            </h2>
            <p className="text-xs text-[#635E56] mt-1">
              Enter your order reference number (e.g. <span className="font-mono">UL-2026-4812</span>)
              to check live fulfillment status.
            </p>
          </div>

          <form onSubmit={handleLookup} className="flex gap-2">
            <input
              type="text"
              value={lookupRef}
              onChange={(e) => setLookupRef(e.target.value)}
              placeholder="UL-2026-4812"
              className="flex-1 px-3.5 py-2.5 text-sm font-mono bg-white border border-[#D8D1C5] rounded-md focus:outline-none focus:border-[#4B5842]"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2.5 text-xs font-medium bg-[#1A1917] text-white rounded-md hover:bg-[#33312D] inline-flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{loading ? 'Checking...' : 'Lookup'}</span>
            </button>
          </form>

          {lookupError && <p className="text-xs text-[#8B2E2E]">{lookupError}</p>}

          {lookupResult && (
            <div className="bg-[#F7F5F0] border border-[#E2DDD3] rounded-md p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between font-semibold text-[#1A1917]">
                <span className="font-mono">{lookupResult.referenceNumber}</span>
                <span className="text-[#4B5842]">{lookupResult.status}</span>
              </div>
              <p className="text-[#635E56]">
                {lookupResult.customerName} · {lookupResult.city} ·{' '}
                {formatShortDate(lookupResult.createdAt)}
              </p>
              <p className="font-mono tabular-nums font-medium text-[#1A1917]">
                Total: {formatINR(lookupResult.total)} ({lookupResult.items.length} item
                {lookupResult.items.length > 1 ? 's' : ''})
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
