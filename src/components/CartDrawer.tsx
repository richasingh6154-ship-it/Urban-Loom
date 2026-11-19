import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import type { CartItem, SizeOption } from '../types';
import { formatINR } from '../utils/format';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (index: number, delta: number) => void;
  onUpdateSize: (index: number, size: SizeOption) => void;
  onRemoveItem: (index: number) => void;
  onContinueShopping: () => void;
  onProceedToCheckout: () => void;
}

const SIZES: SizeOption[] = ['XS', 'S', 'M', 'L', 'XL'];

export function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onUpdateSize,
  onRemoveItem,
  onContinueShopping,
  onProceedToCheckout,
}: CartDrawerProps) {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal === 0 ? 0 : subtotal >= 1499 ? 0 : 79;
  const total = subtotal + shipping;
  const freeShippingRemaining = Math.max(0, 1499 - subtotal);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="fixed inset-0 bg-[#1A1917]/40 backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        aria-label="Shopping Bag"
        className="relative w-full max-w-md bg-[#F7F5F0] h-full flex flex-col border-l border-[#E2DDD3] shadow-xl z-10"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-[#E2DDD3] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-4 h-4 text-[#4B5842]" />
            <h2 className="font-editorial text-xl font-medium text-[#1A1917]">
              Your Bag ({items.reduce((acc, it) => acc + it.quantity, 0)})
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close bag"
            className="p-2 text-[#635E56] hover:text-[#1A1917] rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Indicator */}
        {items.length > 0 && (
          <div className="px-6 py-2.5 bg-[#EFECE6] border-b border-[#E2DDD3] text-xs text-[#1A1917]">
            {freeShippingRemaining === 0
              ? 'Complimentary carbon-neutral shipping unlocked on this order.'
              : `Add ${formatINR(freeShippingRemaining)} more for complimentary shipping (standard ₹79).`}
          </div>
        )}

        {/* Line Items */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#EFECE6] flex items-center justify-center text-[#635E56]">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="font-editorial text-lg text-[#1A1917]">Your bag is empty</p>
                <p className="text-xs text-[#635E56] max-w-xs">
                  Explore our limited-batch organic cotton, hemp-linen, and bamboo knit essentials
                  starting at ₹799.
                </p>
              </div>
              <button
                type="button"
                onClick={onContinueShopping}
                className="px-5 py-2.5 text-xs font-medium bg-[#1A1917] text-white rounded-md hover:bg-[#33312D]"
              >
                Explore Collection
              </button>
            </div>
          ) : (
            items.map((item, idx) => (
              <div
                key={`${item.productId}-${item.size}-${item.color}`}
                className="bg-white border border-[#E2DDD3] rounded-md p-3.5 flex gap-3.5"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-20 h-24 object-cover rounded-sm bg-[#EFECE6] shrink-0"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-[#1A1917] truncate">
                        {item.name}
                      </h3>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(idx)}
                        aria-label={`Remove ${item.name}`}
                        className="text-[#8D867B] hover:text-[#8B2E2E] p-0.5"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-[#635E56] mt-0.5">{item.color}</p>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <select
                        aria-label="Select size"
                        value={item.size}
                        onChange={(e) => onUpdateSize(idx, e.target.value as SizeOption)}
                        className="text-xs font-mono bg-[#F7F5F0] border border-[#E2DDD3] rounded-sm px-1.5 py-1 text-[#1A1917]"
                      >
                        {SIZES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>

                      <div className="inline-flex items-center border border-[#E2DDD3] rounded-sm">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(idx, -1)}
                          aria-label="Decrease quantity"
                          className="p-1 text-[#635E56] hover:text-[#1A1917]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono tabular-nums text-[#1A1917]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(idx, 1)}
                          aria-label="Increase quantity"
                          className="p-1 text-[#635E56] hover:text-[#1A1917]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <span className="font-mono tabular-nums text-sm font-medium text-[#1A1917]">
                      {formatINR(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary & Checkout */}
        {items.length > 0 && (
          <div className="p-6 bg-white border-t border-[#E2DDD3] space-y-4">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-[#635E56]">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums text-[#1A1917]">{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#635E56]">
                <span>Shipping</span>
                <span className="font-mono tabular-nums text-[#1A1917]">
                  {shipping === 0 ? 'Free' : formatINR(shipping)}
                </span>
              </div>
              <div className="pt-2 border-t border-[#EFECE6] flex justify-between font-semibold text-[#1A1917]">
                <span>Estimated Total</span>
                <span className="font-mono tabular-nums text-base">{formatINR(total)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={onProceedToCheckout}
                className="w-full py-3 px-4 bg-[#4B5842] text-white text-sm font-medium rounded-md hover:bg-[#3B4634] transition-colors"
              >
                Place Your Pre-order
              </button>
              <button
                type="button"
                onClick={onContinueShopping}
                className="w-full py-2.5 px-4 border border-[#D8D1C5] text-[#1A1917] text-xs font-medium rounded-md hover:bg-[#F7F5F0] transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
