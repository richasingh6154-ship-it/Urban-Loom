import { CheckCircle2 } from 'lucide-react';
import type { AppRoute, Order } from '../types';
import { formatINR, formatShortDate } from '../utils/format';

interface OrderConfirmationPageProps {
  order: Order | null;
  onNavigate: (route: AppRoute) => void;
}

export function OrderConfirmationPage({ order, onNavigate }: OrderConfirmationPageProps) {
  if (!order) {
    return (
      <div className="max-w-[720px] mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="font-editorial text-2xl text-[#1A1917]">Order Receipt Unavailable</h1>
        <button
          type="button"
          onClick={() => onNavigate({ page: 'shop', category: 'All' })}
          className="px-5 py-2.5 text-xs font-medium bg-[#1A1917] text-white rounded-md"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[820px] mx-auto px-4 sm:px-6 py-12 lg:py-16">
      <div className="bg-white border border-[#E2DDD3] rounded-lg p-6 sm:p-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EFECE6]">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-7 h-7 text-[#4B5842] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-[#4B5842]">
                Demo {order.orderType === 'pre-order' ? 'Pre-order' : 'Order'} Confirmed
              </p>
              <h1 className="font-editorial text-2xl sm:text-3xl font-medium text-[#1A1917] mt-0.5">
                Thank you, {order.customerName}
              </h1>
            </div>
          </div>

          <div className="bg-[#F7F5F0] border border-[#E2DDD3] rounded-md px-4 py-2.5">
            <p className="text-[11px] text-[#635E56]">Reference Number</p>
            <p className="font-mono tabular-nums text-base font-semibold text-[#1A1917]">
              {order.referenceNumber}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
          <div>
            <p className="text-[#635E56]">Delivery Destination</p>
            <p className="font-medium text-[#1A1917] mt-1">{order.address}</p>
            <p className="text-[#635E56]">
              {order.city} — {order.pinCode}
            </p>
          </div>
          <div>
            <p className="text-[#635E56]">Payment Mode</p>
            <p className="font-medium text-[#1A1917] mt-1">{order.paymentMethod}</p>
            <p className="text-[#635E56]">Demo simulation (₹0 charged)</p>
          </div>
          <div>
            <p className="text-[#635E56]">Order Date &amp; Status</p>
            <p className="font-medium text-[#1A1917] mt-1">{formatShortDate(order.createdAt)}</p>
            <p className="text-[#4B5842] font-medium">{order.status}</p>
          </div>
        </div>

        {/* Items */}
        <div className="space-y-3 pt-2">
          <h2 className="text-xs font-semibold text-[#1A1917]">Garments Reserved</h2>
          <div className="divide-y divide-[#EFECE6] border-y border-[#EFECE6]">
            {order.items.map((item, idx) => (
              <div key={`${item.productId}-${idx}`} className="py-3 flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-14 h-16 object-cover rounded-sm bg-[#EFECE6]"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1A1917]">{item.name}</p>
                  <p className="text-xs text-[#635E56]">
                    Size {item.size} · {item.color} · Qty {item.quantity}
                  </p>
                </div>
                <span className="font-mono tabular-nums text-sm font-medium text-[#1A1917]">
                  {formatINR(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-3 text-base font-semibold text-[#1A1917]">
            <span>Total Demo Order Value</span>
            <span className="font-mono tabular-nums">{formatINR(order.total)}</span>
          </div>
        </div>

        <div className="pt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onNavigate({ page: 'shop', category: 'All' })}
            className="px-5 py-2.5 text-xs font-medium bg-[#1A1917] text-white rounded-md hover:bg-[#33312D]"
          >
            Continue Shopping
          </button>
          <button
            type="button"
            onClick={() => onNavigate({ page: 'feedback' })}
            className="px-5 py-2.5 text-xs font-medium border border-[#D8D1C5] text-[#1A1917] rounded-md hover:bg-[#EFECE6]"
          >
            Share Fabric &amp; Pricing Feedback
          </button>
        </div>
      </div>
    </div>
  );
}
