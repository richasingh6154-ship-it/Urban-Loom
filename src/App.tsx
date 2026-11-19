import { useCallback, useEffect, useState } from 'react';
import { api } from './api/client';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import {
  INITIAL_FEEDBACK,
  INITIAL_POPUP_EVENTS,
  INITIAL_PRODUCTS,
} from './data/seedData';
import { AboutPage } from './pages/AboutPage';
import { AccountPages } from './pages/AccountPages';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AuthPages } from './pages/AuthPages';
import { CheckoutPage } from './pages/CheckoutPage';
import { ContactPage } from './pages/ContactPage';
import { FeedbackPage } from './pages/FeedbackPage';
import { FindUsPage } from './pages/FindUsPage';
import { HomePage } from './pages/HomePage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ShopPage } from './pages/ShopPage';
import type {
  AppRoute,
  CartItem,
  FeedbackEntry,
  FeedbackSummary,
  Order,
  PopupEvent,
  Product,
  ProductCategory,
  SizeOption,
  UserProfile,
} from './types';

const CART_STORAGE_KEY = 'urban_loom_cart_v1';

function parseHashRoute(): AppRoute {
  const raw = window.location.hash.replace(/^#\/?/, '');
  if (!raw || raw === '/') return { page: 'home' };
  const parts = raw.split('/').map(decodeURIComponent);
  const head = parts[0];

  switch (head) {
    case 'shop':
      return { page: 'shop', category: (parts[1] as ProductCategory | 'All') || 'All' };
    case 'product':
      return parts[1] ? { page: 'product', productId: parts[1] } : { page: 'shop', category: 'All' };
    case 'checkout':
      return { page: 'checkout' };
    case 'order-confirmation':
      return { page: 'order-confirmation', referenceNumber: parts[1] || '' };
    case 'find-us':
      return { page: 'find-us' };
    case 'feedback':
      return { page: 'feedback' };
    case 'about':
      return { page: 'about' };
    case 'contact':
      return { page: 'contact' };
    case 'login':
      return { page: 'login' };
    case 'signup':
      return { page: 'signup' };
    case 'forgot-password':
      return { page: 'forgot-password' };
    case 'account':
      return { page: 'account' };
    case 'wishlist':
      return { page: 'wishlist' };
    case 'admin-login':
      return { page: 'admin-login' };
    case 'admin':
      return { page: 'admin' };
    default:
      return { page: 'home' };
  }
}

function routeToHash(route: AppRoute): string {
  switch (route.page) {
    case 'home':
      return '#/';
    case 'shop':
      return route.category && route.category !== 'All'
        ? `#/shop/${encodeURIComponent(route.category)}`
        : '#/shop';
    case 'product':
      return `#/product/${encodeURIComponent(route.productId)}`;
    case 'cart':
      return '#/shop';
    case 'checkout':
      return '#/checkout';
    case 'order-confirmation':
      return `#/order-confirmation/${encodeURIComponent(route.referenceNumber)}`;
    case 'find-us':
      return '#/find-us';
    case 'feedback':
      return '#/feedback';
    case 'about':
      return '#/about';
    case 'contact':
      return '#/contact';
    case 'login':
      return '#/login';
    case 'signup':
      return '#/signup';
    case 'forgot-password':
      return '#/forgot-password';
    case 'account':
      return '#/account';
    case 'wishlist':
      return '#/wishlist';
    case 'admin-login':
      return '#/admin-login';
    case 'admin':
      return '#/admin';
  }
}

function computeInitialSummary(entries: FeedbackEntry[]): FeedbackSummary {
  const len = entries.length || 1;
  const positive = entries.filter((e) => e.fabricQuality >= 4).length;
  return {
    totalReviews: entries.length,
    avgFabricQuality: Number((entries.reduce((s, e) => s + e.fabricQuality, 0) / len).toFixed(2)),
    avgComfort: Number((entries.reduce((s, e) => s + e.comfort, 0) / len).toFixed(2)),
    avgDesign: Number((entries.reduce((s, e) => s + e.design, 0) / len).toFixed(2)),
    avgAffordability: Number((entries.reduce((s, e) => s + e.affordability, 0) / len).toFixed(2)),
    positiveFabricPercent: Math.round((positive / len) * 100),
  };
}

export default function App() {
  const [route, setRoute] = useState<AppRoute>(() => parseHashRoute());
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [feedback, setFeedback] = useState<FeedbackEntry[]>(INITIAL_FEEDBACK);
  const [feedbackSummary, setFeedbackSummary] = useState<FeedbackSummary>(() =>
    computeInitialSummary(INITIAL_FEEDBACK),
  );
  const [popups, setPopups] = useState<PopupEvent[]>(INITIAL_POPUP_EVENTS);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore storage failure
    }
    return [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  // Customer Firebase Auth State (null unless Firebase is configured & signed in)
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authRedirectNotice, setAuthRedirectNotice] = useState<string | null>(null);

  // Backend-enforced Admin session
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  const navigate = useCallback((nextRoute: AppRoute) => {
    setRoute(nextRoute);
    window.location.hash = routeToHash(nextRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const onHashChange = () => setRoute(parseHashRoute());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Load initial data from backend API
  const refreshProducts = useCallback(async () => {
    try {
      const res = await api.getProducts();
      setProducts(res.products);
    } catch {
      // Keep initial seed fallback on transient failure
    }
  }, []);

  useEffect(() => {
    refreshProducts();
    api
      .getFeedback()
      .then((res) => {
        setFeedback(res.feedback);
        setFeedbackSummary(res.summary);
      })
      .catch(() => undefined);
    api
      .getPopups()
      .then((res) => setPopups(res.events))
      .catch(() => undefined);
    api
      .getAdminSession()
      .then((res) => {
        if (res.authenticated && res.email) {
          setAdminEmail(res.email);
        }
      })
      .catch(() => undefined);
  }, [refreshProducts]);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // Enforce protected routes
  useEffect(() => {
    if ((route.page === 'account' || route.page === 'wishlist') && !user) {
      setAuthRedirectNotice(
        'Please log in to view your protected Urban Loom account and wishlist.',
      );
      navigate({ page: 'login' });
    } else if (route.page === 'admin' && !adminEmail) {
      navigate({ page: 'admin-login' });
    }
  }, [route.page, user, adminEmail, navigate]);

  const addToCart = (
    product: Product,
    size: SizeOption,
    color: string,
    quantity = 1,
  ) => {
    setCart((prev) => {
      const idx = prev.findIndex(
        (it) => it.productId === product.id && it.size === size && it.color === color,
      );
      if (idx > -1) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          quantity: Math.min(10, updated[idx].quantity + quantity),
        };
        return updated;
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          image: product.images[0],
          price: product.price,
          size,
          color,
          quantity,
          fabric: product.fabric,
        },
      ];
    });
  };

  const handleBuyNow = (
    product: Product,
    size: SizeOption,
    color: string,
    quantity = 1,
  ) => {
    addToCart(product, size, color, quantity);
    setIsCartOpen(false);
    navigate({ page: 'checkout' });
  };

  const handleUpdateCartQty = (index: number, delta: number) => {
    setCart((prev) => {
      const updated = [...prev];
      const nextQty = updated[index].quantity + delta;
      if (nextQty <= 0) {
        updated.splice(index, 1);
      } else {
        updated[index] = { ...updated[index], quantity: Math.min(10, nextQty) };
      }
      return updated;
    });
  };

  const handleUpdateCartSize = (index: number, size: SizeOption) => {
    setCart((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], size };
      return updated;
    });
  };

  const handleRemoveCartItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const handleToggleWishlist = (productId: string) => {
    if (!user) {
      setAuthRedirectNotice(
        'Sign in with an Urban Loom customer account (Firebase Auth) to save items to your personal wishlist.',
      );
      navigate({ page: 'login' });
      return;
    }
    setUser((prev) => {
      if (!prev) return null;
      const exists = prev.wishlistIds.includes(productId);
      return {
        ...prev,
        wishlistIds: exists
          ? prev.wishlistIds.filter((id) => id !== productId)
          : [...prev.wishlistIds, productId],
      };
    });
  };

  const handleOrderCompleted = (order: Order) => {
    setLastOrder(order);
    setCart([]);
    refreshProducts();
    navigate({ page: 'order-confirmation', referenceNumber: order.referenceNumber });
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F5F0] text-[#1A1917]">
      <Navbar
        currentRoute={route}
        onNavigate={(r) => {
          setAuthRedirectNotice(null);
          navigate(r);
        }}
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        user={user}
        onLogoutUser={() => {
          setUser(null);
          navigate({ page: 'home' });
        }}
      />

      <main className="flex-1">
        {route.page === 'home' && (
          <HomePage
            products={products}
            feedback={feedback}
            feedbackSummary={feedbackSummary}
            popups={popups}
            onNavigate={navigate}
            onAddToCart={(p, s, c) => addToCart(p, s, c, 1)}
            onBuyNow={(p, s, c) => handleBuyNow(p, s, c, 1)}
            wishlistIds={user?.wishlistIds || []}
            onToggleWishlist={handleToggleWishlist}
          />
        )}

        {route.page === 'shop' && (
          <ShopPage
            products={products}
            initialCategory={route.category || 'All'}
            onNavigate={navigate}
            onAddToCart={(p, s, c) => addToCart(p, s, c, 1)}
            onBuyNow={(p, s, c) => handleBuyNow(p, s, c, 1)}
            wishlistIds={user?.wishlistIds || []}
            onToggleWishlist={handleToggleWishlist}
          />
        )}

        {route.page === 'product' && (
          <ProductDetailPage
            product={products.find((p) => p.id === route.productId)}
            onNavigate={navigate}
            onAddToCart={addToCart}
            onBuyNow={handleBuyNow}
            isWishlisted={Boolean(user?.wishlistIds.includes(route.productId))}
            onToggleWishlist={handleToggleWishlist}
          />
        )}

        {route.page === 'checkout' && (
          <CheckoutPage
            items={cart}
            user={user}
            onNavigate={navigate}
            onOrderCompleted={handleOrderCompleted}
          />
        )}

        {route.page === 'order-confirmation' && (
          <OrderConfirmationPage order={lastOrder} onNavigate={navigate} />
        )}

        {route.page === 'find-us' && (
          <FindUsPage events={popups} onEventsUpdated={setPopups} />
        )}

        {route.page === 'feedback' && (
          <FeedbackPage
            products={products}
            feedback={feedback}
            summary={feedbackSummary}
            onFeedbackAdded={(entry, updatedSummary) => {
              setFeedback((prev) => [entry, ...prev]);
              setFeedbackSummary(updatedSummary);
            }}
          />
        )}

        {route.page === 'about' && <AboutPage onNavigate={navigate} />}

        {route.page === 'contact' && <ContactPage onNavigate={navigate} />}

        {(route.page === 'login' ||
          route.page === 'signup' ||
          route.page === 'forgot-password') && (
          <AuthPages
            mode={route.page}
            onNavigate={(r) => {
              setAuthRedirectNotice(null);
              navigate(r);
            }}
            redirectNotice={authRedirectNotice}
          />
        )}

        {(route.page === 'account' || route.page === 'wishlist') && user && (
          <AccountPages
            view={route.page}
            user={user}
            orders={[]}
            products={products}
            wishlistIds={user.wishlistIds}
            onNavigate={navigate}
            onMoveWishlistToCart={(p) => {
              addToCart(p, 'M', p.colors[0]?.name || 'Natural', 1);
              setIsCartOpen(true);
            }}
            onRemoveWishlist={handleToggleWishlist}
            onLogout={() => {
              setUser(null);
              navigate({ page: 'home' });
            }}
          />
        )}

        {route.page === 'admin-login' && (
          <AdminLoginPage
            onAdminAuthenticated={(email) => {
              setAdminEmail(email);
              navigate({ page: 'admin' });
            }}
            onNavigate={navigate}
          />
        )}

        {route.page === 'admin' && adminEmail && (
          <AdminDashboardPage
            adminEmail={adminEmail}
            products={products}
            onProductsChanged={refreshProducts}
            onAdminLogout={async () => {
              await api.adminLogout();
              setAdminEmail(null);
              navigate({ page: 'home' });
            }}
          />
        )}
      </main>

      <Footer onNavigate={navigate} />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQty}
        onUpdateSize={handleUpdateCartSize}
        onRemoveItem={handleRemoveCartItem}
        onContinueShopping={() => {
          setIsCartOpen(false);
          navigate({ page: 'shop', category: 'All' });
        }}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          navigate({ page: 'checkout' });
        }}
      />
    </div>
  );
}
