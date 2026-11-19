import { Heart, LogOut, MapPin, Package, ShoppingBag, User } from 'lucide-react';
import type { AppRoute, Order, Product, UserProfile } from '../types';
import { formatINR, formatShortDate } from '../utils/format';

interface AccountPagesProps {
  view: 'account' | 'wishlist';
  user: UserProfile;
  orders: Order[];
  products: Product[];
  wishlistIds: string[];
  onNavigate: (route: AppRoute) => void;
  onMoveWishlistToCart: (product: Product) => void;
  onRemoveWishlist: (productId: string) => void;
  onLogout: () => void;
}

export function AccountPages({
  view,
  user,
  orders,
  products,
  wishlistIds,
  onNavigate,
  onMoveWishlistToCart,
  onRemoveWishlist,
  onLogout,
}: AccountPagesProps) {
  const wishlistedProducts = products.filter((p) => wishlistIds.includes(p.id));
  const userOrders = orders.filter(
    (o) => o.email.toLowerCase() === user.email.toLowerCase(),
  );

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E2DDD3]">
        <div>
          <p className="text-xs font-medium text-[#4B5842]">My Account</p>
          <h1 className="font-editorial text-3xl font-medium text-[#1A1917]">
            Welcome, {user.fullName}
          </h1>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="px-4 py-2 text-xs font-medium border border-[#D8D1C5] rounded-md text-[#8B2E2E] hover:bg-[#FDF2F2] inline-flex items-center gap-1.5 self-start sm:self-auto"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>
      </div>

      {view === 'account' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Profile & Saved Addresses */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-[#E2DDD3] rounded-lg p-6 space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#1A1917]">
                <User className="w-4 h-4 text-[#4B5842]" />
                <span>Profile Information</span>
              </div>
              <div className="text-xs text-[#635E56] space-y-1">
                <p className="text-[#1A1917] font-medium">{user.fullName}</p>
                <p>{user.email}</p>
                <p className="font-mono">{user.mobile}</p>
              </div>
            </div>

            <div className="bg-white border border-[#E2DDD3] rounded-lg p-6 space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#1A1917]">
                <MapPin className="w-4 h-4 text-[#4B5842]" />
                <span>Saved Addresses</span>
              </div>
              {user.savedAddresses.length === 0 ? (
                <p className="text-xs text-[#635E56]">No saved addresses yet.</p>
              ) : (
                user.savedAddresses.map((addr) => (
                  <div key={addr.id} className="text-xs text-[#635E56] border-t border-[#EFECE6] pt-2">
                    <p className="font-medium text-[#1A1917]">{addr.label}</p>
                    <p>{addr.addressLine}</p>
                    <p>
                      {addr.city} — {addr.pinCode}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Order History */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#1A1917]">
              <Package className="w-4 h-4 text-[#4B5842]" />
              <span>My Orders &amp; Pre-orders ({userOrders.length})</span>
            </div>

            {userOrders.length === 0 ? (
              <div className="bg-white border border-[#E2DDD3] rounded-lg p-8 text-center space-y-3">
                <p className="text-sm text-[#635E56]">You have not placed any orders yet.</p>
                <button
                  type="button"
                  onClick={() => onNavigate({ page: 'shop', category: 'All' })}
                  className="px-4 py-2 text-xs font-medium bg-[#1A1917] text-white rounded-md"
                >
                  Browse Collection
                </button>
              </div>
            ) : (
              userOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white border border-[#E2DDD3] rounded-lg p-5 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#EFECE6] text-xs">
                    <span className="font-mono font-semibold text-[#1A1917]">
                      {ord.referenceNumber}
                    </span>
                    <span className="text-[#635E56]">{formatShortDate(ord.createdAt)}</span>
                    <span className="font-medium text-[#4B5842]">{ord.status}</span>
                    <span className="font-mono tabular-nums font-semibold text-[#1A1917]">
                      {formatINR(ord.total)}
                    </span>
                  </div>
                  {ord.items.map((it, idx) => (
                    <div key={`${it.productId}-${idx}`} className="flex items-center gap-3 text-xs">
                      <img
                        src={it.image}
                        alt={it.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-14 object-cover rounded-sm bg-[#EFECE6]"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-[#1A1917]">{it.name}</p>
                        <p className="text-[#635E56]">
                          Size {it.size} · Qty {it.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {view === 'wishlist' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#1A1917]">
            <Heart className="w-4 h-4 text-[#6E4F3A]" />
            <span>Saved Wishlist ({wishlistedProducts.length})</span>
          </div>

          {wishlistedProducts.length === 0 ? (
            <div className="bg-white border border-[#E2DDD3] rounded-lg p-10 text-center space-y-3">
              <p className="text-sm text-[#635E56]">No garments saved to your wishlist yet.</p>
              <button
                type="button"
                onClick={() => onNavigate({ page: 'shop', category: 'All' })}
                className="px-4 py-2 text-xs font-medium bg-[#1A1917] text-white rounded-md"
              >
                Explore Garments
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {wishlistedProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white border border-[#E2DDD3] rounded-lg overflow-hidden flex flex-col"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="aspect-[4/3] w-full object-cover bg-[#EFECE6]"
                  />
                  <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[#1A1917]">{product.name}</p>
                      <p className="font-mono tabular-nums text-xs text-[#635E56] mt-1">
                        {formatINR(product.price)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => onMoveWishlistToCart(product)}
                        className="flex-1 py-2 px-3 text-xs font-medium bg-[#4B5842] text-white rounded-md inline-flex items-center justify-center gap-1.5"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Move to Bag</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemoveWishlist(product.id)}
                        className="py-2 px-3 text-xs font-medium border border-[#D8D1C5] rounded-md text-[#635E56]"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
