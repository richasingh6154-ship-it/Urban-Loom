import { useState, type FormEvent } from 'react';
import { AlertCircle, ArrowLeft, Lock, ShieldCheck } from 'lucide-react';
import { api } from '../api/client';
import { TARGET_CITIES } from '../data/seedData';
import type { AppRoute, CartItem, Order, UserProfile } from '../types';
import {
  formatINR,
  validateEmail,
  validateIndianMobile,
  validatePinCode,
} from '../utils/format';

interface CheckoutPageProps {
  items: CartItem[];
  user: UserProfile | null;
  onNavigate: (route: AppRoute) => void;
  onOrderCompleted: (order: Order) => void;
}

export function CheckoutPage({
  items,
  user,
  onNavigate,
  onOrderCompleted,
}: CheckoutPageProps) {
  const defaultAddress = user?.savedAddresses[0];

  const [customerName, setCustomerName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [mobile, setMobile] = useState(user?.mobile || '');
  const [address, setAddress] = useState(defaultAddress?.addressLine || '');
  const [city, setCity] = useState<string>(defaultAddress?.city || 'Delhi NCR');
  const [pinCode, setPinCode] = useState(defaultAddress?.pinCode || '');
  const [orderType, setOrderType] = useState<'pre-order' | 'standard'>('pre-order');
  const [paymentMethod, setPaymentMethod] = useState<
    'UPI (Demo)' | 'Razorpay Card (Demo)' | 'Cash on Delivery (Demo)'
  >('UPI (Demo)');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal === 0 ? 0 : subtotal >= 1499 ? 0 : 79;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="max-w-[720px] mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="font-editorial text-2xl text-[#1A1917]">Your Bag is Empty</h1>
        <p className="text-sm text-[#635E56]">
          Add sustainable everyday garments to your bag before proceeding to checkout.
        </p>
        <button
          type="button"
          onClick={() => onNavigate({ page: 'shop', category: 'All' })}
          className="px-5 py-2.5 text-xs font-medium bg-[#1A1917] text-white rounded-md"
        >
          Browse Collection
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (customerName.trim().length < 2) {
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
    if (address.trim().length < 8) {
      setErrorMsg('Please enter your complete street/hostel/apartment address.');
      return;
    }
    if (!validatePinCode(pinCode)) {
      setErrorMsg('Please enter a valid 6-digit Indian PIN code.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.createOrder({
        orderType,
        customerName: customerName.trim(),
        email: email.trim(),
        mobile: mobile.replace(/\D/g, ''),
        address: address.trim(),
        city,
        pinCode: pinCode.trim(),
        paymentMethod,
        items: items.map((it) => ({
          productId: it.productId,
          name: it.name,
          image: it.image,
          price: it.price,
          size: it.size,
          color: it.color,
          quantity: it.quantity,
        })),
        subtotal,
        shipping,
        total,
      });
      onOrderCompleted(res.order);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unable to place demo order.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button
        type="button"
        onClick={() => onNavigate({ page: 'shop', category: 'All' })}
        className="inline-flex items-center gap-2 text-xs font-medium text-[#635E56] hover:text-[#1A1917] mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Continue Shopping</span>
      </button>

      <div className="mb-8">
        <p className="text-xs font-medium text-[#4B5842] mb-1">
          MVP Pre-order &amp; Demo Checkout
        </p>
        <h1 className="font-editorial text-3xl font-medium text-[#1A1917]">
          Place Your Pre-order
        </h1>
      </div>

      {/* Explicit Demo Notice */}
      <div className="mb-8 bg-[#EFECE6] border border-[#D8D1C5] rounded-md p-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#4B5842] shrink-0 mt-0.5" />
        <div className="text-xs text-[#1A1917] space-y-1">
          <p className="font-semibold">
            Demo Payment Flow (No Real Payment Is Processed)
          </p>
          <p className="text-[#635E56]">
            This Urban Loom checkout simulates Razorpay / UPI / COD order placement for our
            limited-batch demand validation. No card, bank account, or UPI wallet will be charged.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Fields Left */}
        <div className="lg:col-span-7 bg-white border border-[#E2DDD3] rounded-lg p-6 sm:p-8 space-y-6">
          {errorMsg && (
            <div className="p-3.5 bg-[#FDF2F2] border border-[#E5B8B8] rounded-md text-xs text-[#8B2E2E] flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Order Mode */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#1A1917]">
              Fulfillment Preference
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setOrderType('pre-order')}
                className={`p-3.5 text-left rounded-md border transition-colors ${
                  orderType === 'pre-order'
                    ? 'border-[#4B5842] bg-[#F7F5F0]'
                    : 'border-[#E2DDD3] bg-white'
                }`}
              >
                <p className="text-xs font-semibold text-[#1A1917]">Limited-Batch Pre-order</p>
                <p className="text-[11px] text-[#635E56] mt-0.5">
                  Reserve your size in Batch 04/05 (Zero deadstock waste)
                </p>
              </button>
              <button
                type="button"
                onClick={() => setOrderType('standard')}
                className={`p-3.5 text-left rounded-md border transition-colors ${
                  orderType === 'standard'
                    ? 'border-[#4B5842] bg-[#F7F5F0]'
                    : 'border-[#E2DDD3] bg-white'
                }`}
              >
                <p className="text-xs font-semibold text-[#1A1917]">Ready Batch Dispatch</p>
                <p className="text-[11px] text-[#635E56] mt-0.5">
                  Ship immediately from available studio stock
                </p>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label htmlFor="chk-name" className="block text-xs font-medium text-[#1A1917] mb-1.5">
                Full Name
              </label>
              <input
                id="chk-name"
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Riya Sharma"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D8D1C5] rounded-md focus:outline-none focus:border-[#4B5842]"
              />
            </div>

            <div>
              <label htmlFor="chk-email" className="block text-xs font-medium text-[#1A1917] mb-1.5">
                Email Address
              </label>
              <input
                id="chk-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="riya@college.edu.in"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D8D1C5] rounded-md focus:outline-none focus:border-[#4B5842]"
              />
            </div>

            <div>
              <label htmlFor="chk-mobile" className="block text-xs font-medium text-[#1A1917] mb-1.5">
                Mobile Number (10 digits)
              </label>
              <input
                id="chk-mobile"
                type="tel"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="9811223344"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D8D1C5] rounded-md focus:outline-none focus:border-[#4B5842]"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="chk-address" className="block text-xs font-medium text-[#1A1917] mb-1.5">
                Delivery Address (Hostel / Flat / Street)
              </label>
              <textarea
                id="chk-address"
                rows={2}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House / Hostel Block, Street Name, Landmark"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D8D1C5] rounded-md focus:outline-none focus:border-[#4B5842]"
              />
            </div>

            <div>
              <label htmlFor="chk-city" className="block text-xs font-medium text-[#1A1917] mb-1.5">
                City
              </label>
              <select
                id="chk-city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D8D1C5] rounded-md focus:outline-none focus:border-[#4B5842]"
              >
                {TARGET_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
                <option value="Other Indian City">Other Indian City</option>
              </select>
            </div>

            <div>
              <label htmlFor="chk-pin" className="block text-xs font-medium text-[#1A1917] mb-1.5">
                PIN Code
              </label>
              <input
                id="chk-pin"
                type="text"
                maxLength={6}
                required
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                placeholder="110007"
                className="w-full px-3.5 py-2.5 text-sm font-mono bg-white border border-[#D8D1C5] rounded-md focus:outline-none focus:border-[#4B5842]"
              />
            </div>
          </div>

          {/* Demo Payment Method Interface */}
          <div className="pt-4 border-t border-[#EFECE6] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#1A1917]">
                Payment Interface (Demo Mode)
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-[#635E56]">
                <Lock className="w-3 h-3" />
                Razorpay / UPI Ready Schema
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {(
                ['UPI (Demo)', 'Razorpay Card (Demo)', 'Cash on Delivery (Demo)'] as const
              ).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`p-3 text-left text-xs rounded-md border transition-colors ${
                    paymentMethod === method
                      ? 'border-[#1A1917] bg-[#F7F5F0] font-semibold text-[#1A1917]'
                      : 'border-[#E2DDD3] text-[#635E56] hover:border-[#1A1917]'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary Right */}
        <aside className="lg:col-span-5 bg-white border border-[#E2DDD3] rounded-lg p-6 sm:p-8 space-y-5 lg:sticky lg:top-24">
          <h2 className="font-editorial text-xl font-medium text-[#1A1917]">Order Summary</h2>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.size}-${item.color}`}
                className="flex items-center gap-3 pb-3 border-b border-[#EFECE6]"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-14 h-16 object-cover rounded-sm bg-[#EFECE6] shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#1A1917] truncate">{item.name}</p>
                  <p className="text-[11px] text-[#635E56]">
                    Size {item.size} · {item.color} · Qty {item.quantity}
                  </p>
                </div>
                <span className="font-mono tabular-nums text-xs font-medium text-[#1A1917]">
                  {formatINR(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-sm pt-1">
            <div className="flex justify-between text-[#635E56]">
              <span>Subtotal</span>
              <span className="font-mono tabular-nums text-[#1A1917]">{formatINR(subtotal)}</span>
            </div>
            <div className="flex justify-between text-[#635E56]">
              <span>Carbon-Neutral Shipping</span>
              <span className="font-mono tabular-nums text-[#1A1917]">
                {shipping === 0 ? 'Free' : formatINR(shipping)}
              </span>
            </div>
            <div className="pt-3 border-t border-[#E2DDD3] flex justify-between font-semibold text-[#1A1917]">
              <span>Final Demo Amount</span>
              <span className="font-mono tabular-nums text-lg">{formatINR(total)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-4 bg-[#4B5842] text-white text-sm font-medium rounded-md hover:bg-[#3B4634] transition-colors disabled:opacity-60"
          >
            {submitting ? 'Confirming Demo Pre-order...' : 'Place Your Pre-order'}
          </button>

          <p className="text-[11px] text-[#635E56] text-center">
            No real funds are deducted. Generates a verifiable demo reference number.
          </p>
        </aside>
      </form>
    </div>
  );
}
