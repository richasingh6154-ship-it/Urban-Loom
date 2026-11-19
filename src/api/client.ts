import type {
  AdminOverviewData,
  FeedbackEntry,
  FeedbackSummary,
  Order,
  OrderStatus,
  PopupEvent,
  PopupRegistration,
  Product,
} from '../types';

const ADMIN_TOKEN_KEY = 'urban_loom_admin_token';

export function getStoredAdminToken(): string | null {
  try {
    return sessionStorage.getItem(ADMIN_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredAdminToken(token: string | null): void {
  try {
    if (token) {
      sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
    } else {
      sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    }
  } catch {
    // ignore storage restrictions
  }
}

async function apiRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredAdminToken();
  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }
  if (token && url.startsWith('/api/admin')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });
  const data = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

export const api = {
  getAuthConfigStatus: () =>
    apiRequest<{ firebaseConfigured: boolean; providerStatus: string; message: string }>(
      '/api/auth/config-status',
    ),
  getProducts: () => apiRequest<{ products: Product[] }>('/api/products'),
  createOrder: (payload: Omit<Order, 'id' | 'referenceNumber' | 'status' | 'createdAt'>) =>
    apiRequest<{ order: Order }>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  lookupOrder: (ref: string) =>
    apiRequest<{ order: Order }>(`/api/orders/lookup?ref=${encodeURIComponent(ref)}`),
  getFeedback: () =>
    apiRequest<{ feedback: FeedbackEntry[]; summary: FeedbackSummary }>('/api/feedback'),
  submitFeedback: (payload: Omit<FeedbackEntry, 'id' | 'createdAt'>) =>
    apiRequest<{ entry: FeedbackEntry; summary: FeedbackSummary }>('/api/feedback', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getPopups: () => apiRequest<{ events: PopupEvent[] }>('/api/popups'),
  registerPopup: (payload: Omit<PopupRegistration, 'id' | 'createdAt'>) =>
    apiRequest<{ registration: PopupRegistration; events: PopupEvent[] }>('/api/popups/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  subscribeNewsletter: (email: string) =>
    apiRequest<{ subscribed: boolean; message: string }>('/api/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
  adminLogin: async (email: string, passkey: string) => {
    const res = await apiRequest<{ authenticated: boolean; email: string; token: string }>(
      '/api/admin/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, passkey }),
      },
    );
    setStoredAdminToken(res.token);
    return res;
  },
  adminLogout: async () => {
    await apiRequest('/api/admin/logout', { method: 'POST' });
    setStoredAdminToken(null);
  },
  getAdminSession: () =>
    apiRequest<{ authenticated: boolean; email?: string }>('/api/admin/session'),
  getAdminOverview: () => apiRequest<AdminOverviewData>('/api/admin/overview'),
  addProduct: (payload: Partial<Product>) =>
    apiRequest<{ product: Product }>('/api/admin/products', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateProduct: (id: string, payload: Partial<Product>) =>
    apiRequest<{ product: Product }>(`/api/admin/products/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  deleteProduct: (id: string) =>
    apiRequest<{ deleted: boolean; id: string }>(`/api/admin/products/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }),
  updateOrderStatus: (id: string, status: OrderStatus) =>
    apiRequest<{ order: Order }>(`/api/admin/orders/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};
