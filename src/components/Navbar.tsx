import { useState } from 'react';
import { ChevronDown, Heart, LogOut, Menu, ShoppingBag, User, X } from 'lucide-react';
import type { AppRoute, UserProfile } from '../types';

interface NavbarProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  cartCount: number;
  onOpenCart: () => void;
  user: UserProfile | null;
  onLogoutUser: () => void;
}

export function Navbar({
  currentRoute,
  onNavigate,
  cartCount,
  onOpenCart,
  user,
  onLogoutUser,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navigateAndClose = (route: AppRoute) => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
    onNavigate(route);
  };

  const navLinkClass = (active: boolean) =>
    `text-sm font-medium whitespace-nowrap shrink-0 transition-colors pb-0.5 border-b ${
      active
        ? 'text-[#1A1917] border-[#1A1917]'
        : 'text-[#635E56] border-transparent hover:text-[#1A1917] hover:border-[#C6BEB0]'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-[#F7F5F0]/95 backdrop-blur-sm border-b border-[#E2DDD3]">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Wordmark */}
        <button
          type="button"
          onClick={() => navigateAndClose({ page: 'home' })}
          className="font-editorial text-xl sm:text-2xl font-medium tracking-tight text-[#1A1917] whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4B5842] rounded-sm"
        >
          Urban Loom
        </button>

        {/* Zone 2: Clean Single-Line Text Navigation */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-7"
        >
          <button
            type="button"
            onClick={() => navigateAndClose({ page: 'home' })}
            className={navLinkClass(currentRoute.page === 'home')}
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => navigateAndClose({ page: 'shop', category: 'All' })}
            className={navLinkClass(currentRoute.page === 'shop' && (!currentRoute.category || currentRoute.category === 'All'))}
          >
            Shop
          </button>
          <button
            type="button"
            onClick={() => navigateAndClose({ page: 'shop', category: 'Shirts' })}
            className={navLinkClass(currentRoute.page === 'shop' && Boolean(currentRoute.category && currentRoute.category !== 'All'))}
          >
            Categories
          </button>
          <button
            type="button"
            onClick={() => navigateAndClose({ page: 'about' })}
            className={navLinkClass(currentRoute.page === 'about')}
          >
            About Us
          </button>
          {user ? (
            <>
              <button
                type="button"
                onClick={() => navigateAndClose({ page: 'account' })}
                className={navLinkClass(currentRoute.page === 'account')}
              >
                My Account
              </button>
              <button
                type="button"
                onClick={() => navigateAndClose({ page: 'wishlist' })}
                className={navLinkClass(currentRoute.page === 'wishlist')}
              >
                Wishlist
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => navigateAndClose({ page: 'contact' })}
              className={navLinkClass(currentRoute.page === 'contact' || currentRoute.page === 'find-us')}
            >
              Contact
            </button>
          )}
        </nav>

        {/* Zone 3: Primary Action & Cart */}
        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <div className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setProfileDropdownOpen((prev) => !prev)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#1A1917] border border-[#D8D1C5] rounded-md hover:bg-[#EFECE6] transition-colors whitespace-nowrap shrink-0"
              >
                <User className="w-3.5 h-3.5" />
                <span className="max-w-[110px] truncate">{user.fullName}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#635E56]" />
              </button>
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-[#E2DDD3] rounded-md shadow-sm py-1.5 z-50">
                  <button
                    type="button"
                    onClick={() => navigateAndClose({ page: 'account' })}
                    className="w-full text-left px-4 py-2 text-xs text-[#1A1917] hover:bg-[#F7F5F0] flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5" />
                    My Account
                  </button>
                  <button
                    type="button"
                    onClick={() => navigateAndClose({ page: 'wishlist' })}
                    className="w-full text-left px-4 py-2 text-xs text-[#1A1917] hover:bg-[#F7F5F0] flex items-center gap-2"
                  >
                    <Heart className="w-3.5 h-3.5" />
                    Wishlist
                  </button>
                  <div className="my-1 border-t border-[#E2DDD3]" />
                  <button
                    type="button"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onLogoutUser();
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-[#8B2E2E] hover:bg-[#F7F5F0] flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => navigateAndClose({ page: 'login' })}
              className="hidden md:inline-flex items-center px-3.5 py-2 text-xs font-medium text-[#1A1917] border border-[#D8D1C5] rounded-md hover:bg-[#EFECE6] transition-colors whitespace-nowrap shrink-0"
            >
              Login / Sign Up
            </button>
          )}

          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`Open shopping bag with ${cartCount} items`}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium bg-[#1A1917] text-[#F7F5F0] rounded-md hover:bg-[#33312D] transition-colors whitespace-nowrap shrink-0"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Bag</span>
            <span className="font-mono tabular-nums text-[11px] bg-[#4B5842] text-white px-1.5 py-0.5 rounded-sm">
              {cartCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 text-[#1A1917] hover:bg-[#EFECE6] rounded-md"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E2DDD3] bg-[#F7F5F0] px-4 py-4 space-y-2">
          <button
            type="button"
            onClick={() => navigateAndClose({ page: 'home' })}
            className="block w-full text-left py-2.5 text-sm font-medium text-[#1A1917] border-b border-[#E2DDD3]/60"
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => navigateAndClose({ page: 'shop', category: 'All' })}
            className="block w-full text-left py-2.5 text-sm font-medium text-[#1A1917] border-b border-[#E2DDD3]/60"
          >
            Shop All
          </button>
          <button
            type="button"
            onClick={() => navigateAndClose({ page: 'find-us' })}
            className="block w-full text-left py-2.5 text-sm font-medium text-[#1A1917] border-b border-[#E2DDD3]/60"
          >
            Find Us Near You
          </button>
          <button
            type="button"
            onClick={() => navigateAndClose({ page: 'feedback' })}
            className="block w-full text-left py-2.5 text-sm font-medium text-[#1A1917] border-b border-[#E2DDD3]/60"
          >
            Customer Feedback
          </button>
          <button
            type="button"
            onClick={() => navigateAndClose({ page: 'about' })}
            className="block w-full text-left py-2.5 text-sm font-medium text-[#1A1917] border-b border-[#E2DDD3]/60"
          >
            About Us
          </button>
          <button
            type="button"
            onClick={() => navigateAndClose({ page: 'contact' })}
            className="block w-full text-left py-2.5 text-sm font-medium text-[#1A1917] border-b border-[#E2DDD3]/60"
          >
            Contact
          </button>
          {user ? (
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigateAndClose({ page: 'account' })}
                className="flex-1 py-2.5 text-center text-xs font-medium bg-[#1A1917] text-[#F7F5F0] rounded-md"
              >
                My Account
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogoutUser();
                }}
                className="px-4 py-2.5 text-xs font-medium border border-[#D8D1C5] rounded-md text-[#8B2E2E]"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigateAndClose({ page: 'login' })}
                className="flex-1 py-2.5 text-center text-xs font-medium bg-[#1A1917] text-[#F7F5F0] rounded-md"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => navigateAndClose({ page: 'signup' })}
                className="flex-1 py-2.5 text-center text-xs font-medium border border-[#D8D1C5] rounded-md text-[#1A1917]"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
