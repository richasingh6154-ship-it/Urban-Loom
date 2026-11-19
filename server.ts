import crypto from 'crypto';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  INITIAL_FEEDBACK,
  INITIAL_ORDERS,
  INITIAL_POPUP_EVENTS,
  INITIAL_POPUP_REGISTRATIONS,
  INITIAL_PRODUCTS,
  MVP_ADMIN_PASSKEY,
} from './src/data/seedData.ts';
import type {
  AdminOverviewData,
  FeedbackEntry,
  FeedbackSummary,
  Order,
  OrderStatus,
  PopupEvent,
  PopupRegistration,
  Product,
} from './src/types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'urban-loom-db.json');
const ADMIN_SECRET = process.env.ADMIN_SESSION_SECRET || crypto.randomBytes(32).toString('hex');

interface StoreDatabase {
  products: Product[];
  orders: Order[];
  feedback: FeedbackEntry[];
  popupEvents: PopupEvent[];
  popupRegistrations: PopupRegistration[];
  newsletterEmails: string[];
}

function createInitialDb(): StoreDatabase {
  return {
    products: INITIAL_PRODUCTS,
    orders: INITIAL_ORDERS,
    feedback: INITIAL_FEEDBACK,
    popupEvents: INITIAL_POPUP_EVENTS,
    popupRegistrations: INITIAL_POPUP_REGISTRATIONS,
    newsletterEmails: [
      'aarav.mehta@du.ac.in',
      'ananya.d@symbiosis.edu.in',
      'kabir.nair@christuniversity.in',
    ],
  };
}

function loadDb(): StoreDatabase {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const seed = createInitialDb();
      fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2), 'utf-8');
      return seed;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<StoreDatabase>;
    return {
      products: Array.isArray(parsed.products) ? parsed.products : INITIAL_PRODUCTS,
      orders: Array.isArray(parsed.orders) ? parsed.orders : INITIAL_ORDERS,
      feedback: Array.isArray(parsed.feedback) ? parsed.feedback : INITIAL_FEEDBACK,
      popupEvents: Array.isArray(parsed.popupEvents) ? parsed.popupEvents : INITIAL_POPUP_EVENTS,
      popupRegistrations: Array.isArray(parsed.popupRegistrations)
        ? parsed.popupRegistrations
        : INITIAL_POPUP_REGISTRATIONS,
      newsletterEmails: Array.isArray(parsed.newsletterEmails) ? parsed.newsletterEmails : [],
    };
  } catch (err) {
    console.error('Failed to read store database, falling back to initial seed:', err);
    return createInitialDb();
  }
}

function saveDb(db: StoreDatabase): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist store database:', err);
  }
}

let store: StoreDatabase = loadDb();

function signAdminToken(email: string): string {
  const payload = Buffer.from(
    JSON.stringify({
      email,
      role: 'admin',
      exp: Date.now() + 1000 * 60 * 60 * 12,
    }),
  ).toString('base64url');
  const sig = crypto.createHmac('sha256', ADMIN_SECRET).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

function verifyAdminToken(token: string | undefined): { email: string; role: string } | null {
  if (!token || !token.includes('.')) return null;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return null;
  const expected = crypto.createHmac('sha256', ADMIN_SECRET).update(payload).digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8')) as {
      email: string;
      role: string;
      exp: number;
    };
    if (decoded.role !== 'admin' || decoded.exp < Date.now()) return null;
    return { email: decoded.email, role: decoded.role };
  } catch {
    return null;
  }
}

function extractAdminToken(req: express.Request): string | undefined {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }
  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    const pairs = cookieHeader.split(';');
    for (const pair of pairs) {
      const idx = pair.indexOf('=');
      if (idx > -1) {
        const key = pair.slice(0, idx).trim();
        const val = pair.slice(idx + 1).trim();
        if (key === 'ul_admin_session') return decodeURIComponent(val);
      }
    }
  }
  return undefined;
}

function requireAdmin(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): void {
  const token = extractAdminToken(req);
  const verified = verifyAdminToken(token);
  if (!verified) {
    res.status(403).json({
      error: 'Unauthorized: Admin authentication is required to access this endpoint.',
    });
    return;
  }
  next();
}

function computeFeedbackSummary(entries: FeedbackEntry[]): FeedbackSummary {
  if (entries.length === 0) {
    return {
      totalReviews: 0,
      avgFabricQuality: 0,
      avgComfort: 0,
      avgDesign: 0,
      avgAffordability: 0,
      positiveFabricPercent: 0,
    };
  }
  const sumFabric = entries.reduce((acc, f) => acc + f.fabricQuality, 0);
  const sumComfort = entries.reduce((acc, f) => acc + f.comfort, 0);
  const sumDesign = entries.reduce((acc, f) => acc + f.design, 0);
  const sumAfford = entries.reduce((acc, f) => acc + f.affordability, 0);
  const positiveCount = entries.filter((f) => f.fabricQuality >= 4).length;

  return {
    totalReviews: entries.length,
    avgFabricQuality: Number((sumFabric / entries.length).toFixed(2)),
    avgComfort: Number((sumComfort / entries.length).toFixed(2)),
    avgDesign: Number((sumDesign / entries.length).toFixed(2)),
    avgAffordability: Number((sumAfford / entries.length).toFixed(2)),
    positiveFabricPercent: Math.round((positiveCount / entries.length) * 100),
  };
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isValidMobile(mobile: string): boolean {
  const digits = mobile.replace(/\D/g, '');
  return digits.length === 10 && /^[6-9]/.test(digits);
}

function isValidPinCode(pin: string): boolean {
  return /^\d{6}$/.test(pin.trim());
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  // Public auth status endpoint (transparent about Firebase provisioning state)
  app.get('/api/auth/config-status', (_req, res) => {
    res.json({
      firebaseConfigured: false,
      providerStatus: 'not_provisioned',
      message:
        'Firebase Authentication & Firestore were not provisioned for this workspace. Follow the setup instructions to enable live Email/Password, Google Sign-In, and Password Reset.',
    });
  });

  // Public catalogue
  app.get('/api/products', (_req, res) => {
    res.json({ products: store.products });
  });

  // Public demo checkout / pre-order
  app.post('/api/orders', (req, res) => {
    const body = req.body as Partial<Order>;
    if (!body.customerName || body.customerName.trim().length < 2) {
      res.status(400).json({ error: 'Please enter your full name.' });
      return;
    }
    if (!body.email || !isValidEmail(body.email)) {
      res.status(400).json({ error: 'Please enter a valid email address.' });
      return;
    }
    if (!body.mobile || !isValidMobile(body.mobile)) {
      res.status(400).json({ error: 'Please enter a valid 10-digit Indian mobile number.' });
      return;
    }
    if (!body.address || body.address.trim().length < 8) {
      res.status(400).json({ error: 'Please enter a complete delivery address.' });
      return;
    }
    if (!body.city || body.city.trim().length < 2) {
      res.status(400).json({ error: 'Please select or enter your city.' });
      return;
    }
    if (!body.pinCode || !isValidPinCode(body.pinCode)) {
      res.status(400).json({ error: 'Please enter a valid 6-digit PIN code.' });
      return;
    }
    if (!Array.isArray(body.items) || body.items.length === 0) {
      res.status(400).json({ error: 'Your cart is empty.' });
      return;
    }

    // Recompute totals authoritatively on the server
    const verifiedItems: Order['items'] = [];
    for (const item of body.items) {
      const catalogProduct = store.products.find((p) => p.id === item.productId);
      if (!catalogProduct) {
        res.status(400).json({ error: `Product "${item.name}" is no longer available.` });
        return;
      }
      const qty = Math.max(1, Math.min(10, Math.floor(Number(item.quantity) || 1)));
      verifiedItems.push({
        productId: catalogProduct.id,
        name: catalogProduct.name,
        image: catalogProduct.images[0],
        price: catalogProduct.price,
        size: item.size || 'M',
        color: item.color || catalogProduct.colors[0]?.name || 'Natural',
        quantity: qty,
      });

      if (catalogProduct.batchRemaining > 0) {
        catalogProduct.batchRemaining = Math.max(0, catalogProduct.batchRemaining - qty);
      }
    }

    const subtotal = verifiedItems.reduce((sum, it) => sum + it.price * it.quantity, 0);
    const shipping = subtotal >= 1499 ? 0 : 79;
    const total = subtotal + shipping;
    const refDigits = Math.floor(5000 + Math.random() * 4999);
    const referenceNumber = `UL-2026-${refDigits}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      referenceNumber,
      orderType: body.orderType === 'standard' ? 'standard' : 'pre-order',
      customerName: body.customerName.trim(),
      email: body.email.trim().toLowerCase(),
      mobile: body.mobile.replace(/\D/g, ''),
      address: body.address.trim(),
      city: body.city.trim(),
      pinCode: body.pinCode.trim(),
      paymentMethod:
        body.paymentMethod === 'Razorpay Card (Demo)' ||
        body.paymentMethod === 'Cash on Delivery (Demo)'
          ? body.paymentMethod
          : 'UPI (Demo)',
      items: verifiedItems,
      subtotal,
      shipping,
      total,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
    };

    store.orders.unshift(newOrder);
    saveDb(store);
    res.status(201).json({ order: newOrder });
  });

  // Public receipt lookup by exact reference number (no PII leakage of other orders)
  app.get('/api/orders/lookup', (req, res) => {
    const ref = String(req.query.ref || '').trim().toUpperCase();
    if (!ref) {
      res.status(400).json({ error: 'Order reference number is required.' });
      return;
    }
    const found = store.orders.find((o) => o.referenceNumber.toUpperCase() === ref);
    if (!found) {
      res.status(404).json({ error: 'Order not found.' });
      return;
    }
    res.json({ order: found });
  });

  // Public feedback
  app.get('/api/feedback', (_req, res) => {
    const summary = computeFeedbackSummary(store.feedback);
    res.json({
      feedback: store.feedback,
      summary,
    });
  });

  app.post('/api/feedback', (req, res) => {
    const body = req.body as Partial<FeedbackEntry>;
    if (!body.customerName || body.customerName.trim().length < 2) {
      res.status(400).json({ error: 'Please provide your name.' });
      return;
    }
    if (!body.city || body.city.trim().length < 2) {
      res.status(400).json({ error: 'Please select your city.' });
      return;
    }
    const clampRating = (val: unknown) => Math.max(1, Math.min(5, Math.round(Number(val) || 0)));
    const fabricQuality = clampRating(body.fabricQuality);
    const comfort = clampRating(body.comfort);
    const design = clampRating(body.design);
    const affordability = clampRating(body.affordability);
    if (!body.fabricQuality || !body.comfort || !body.design || !body.affordability) {
      res.status(400).json({ error: 'Please rate all four garment dimensions (1–5 stars).' });
      return;
    }
    const entry: FeedbackEntry = {
      id: `fb-${Date.now()}`,
      customerName: body.customerName.trim(),
      city: body.city.trim(),
      productName: (body.productName || 'General Collection').trim(),
      fabricQuality,
      comfort,
      design,
      affordability,
      suggestion: (body.suggestion || '').trim() || 'Great sustainable quality at this price.',
      createdAt: new Date().toISOString(),
    };
    store.feedback.unshift(entry);
    saveDb(store);
    res.status(201).json({
      entry,
      summary: computeFeedbackSummary(store.feedback),
    });
  });

  // Campus Pop-up Events & Registration
  app.get('/api/popups', (_req, res) => {
    res.json({ events: store.popupEvents });
  });

  app.post('/api/popups/register', (req, res) => {
    const body = req.body as Partial<PopupRegistration>;
    if (!body.name || body.name.trim().length < 2) {
      res.status(400).json({ error: 'Please enter your full name.' });
      return;
    }
    if (!body.email || !isValidEmail(body.email)) {
      res.status(400).json({ error: 'Please enter a valid email address.' });
      return;
    }
    if (!body.preferredLocation || body.preferredLocation.trim().length < 2) {
      res.status(400).json({ error: 'Please select a preferred campus or city.' });
      return;
    }
    const registration: PopupRegistration = {
      id: `reg-${Date.now()}`,
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      preferredLocation: body.preferredLocation.trim(),
      requestType:
        body.requestType === 'Fabric Sample Request'
          ? 'Fabric Sample Request'
          : 'Campus Pop-up Interest',
      notes: body.notes?.trim() || undefined,
      createdAt: new Date().toISOString(),
    };
    store.popupRegistrations.unshift(registration);

    // Increment matching event count if found
    const matchingEvent = store.popupEvents.find((ev) =>
      registration.preferredLocation.toLowerCase().includes(ev.city.toLowerCase()),
    );
    if (matchingEvent) {
      matchingEvent.registrationCount += 1;
    }

    saveDb(store);
    res.status(201).json({ registration, events: store.popupEvents });
  });

  // Newsletter subscription
  app.post('/api/newsletter', (req, res) => {
    const email = String((req.body as { email?: string })?.email || '')
      .trim()
      .toLowerCase();
    if (!isValidEmail(email)) {
      res.status(400).json({ error: 'Please enter a valid email address.' });
      return;
    }
    if (!store.newsletterEmails.includes(email)) {
      store.newsletterEmails.push(email);
      saveDb(store);
    }
    res.status(201).json({
      subscribed: true,
      message: 'You are on the list for Batch 05 drops and campus pop-up dates.',
    });
  });

  // Admin authentication (backend-enforced)
  app.post('/api/admin/login', (req, res) => {
    const { email, passkey } = req.body as { email?: string; passkey?: string };
    if (!email || !isValidEmail(email)) {
      res.status(400).json({ error: 'Please enter a valid admin email address.' });
      return;
    }
    if (!passkey || passkey.trim() !== MVP_ADMIN_PASSKEY) {
      res.status(401).json({ error: 'Invalid admin passkey. Access denied.' });
      return;
    }
    const token = signAdminToken(email.trim().toLowerCase());
    res.setHeader(
      'Set-Cookie',
      `ul_admin_session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=None; Secure; Max-Age=43200`,
    );
    res.json({
      authenticated: true,
      email: email.trim().toLowerCase(),
      token,
    });
  });

  app.post('/api/admin/logout', (_req, res) => {
    res.setHeader(
      'Set-Cookie',
      'ul_admin_session=; Path=/; HttpOnly; SameSite=None; Secure; Max-Age=0',
    );
    res.json({ authenticated: false });
  });

  app.get('/api/admin/session', (req, res) => {
    const verified = verifyAdminToken(extractAdminToken(req));
    if (!verified) {
      res.json({ authenticated: false });
      return;
    }
    res.json({ authenticated: true, email: verified.email });
  });

  // Protected Admin Endpoints
  app.get('/api/admin/overview', requireAdmin, (_req, res) => {
    const totalOrders = store.orders.length;
    const totalPreOrders = store.orders.filter((o) => o.orderType === 'pre-order').length;
    const uniqueCustomers = new Set(store.orders.map((o) => o.email.toLowerCase())).size;
    const totalDemoSalesValue = store.orders.reduce((sum, o) => sum + o.total, 0);
    const avgOrderValue = totalOrders > 0 ? Math.round(totalDemoSalesValue / totalOrders) : 0;

    const fbSummary = computeFeedbackSummary(store.feedback);

    const salesMap = new Map<
      string,
      { productId: string; name: string; category: string; unitsSold: number; revenue: number }
    >();
    for (const prod of store.products) {
      salesMap.set(prod.id, {
        productId: prod.id,
        name: prod.name,
        category: prod.category,
        unitsSold: 0,
        revenue: 0,
      });
    }
    for (const order of store.orders) {
      for (const item of order.items) {
        const existing = salesMap.get(item.productId) || {
          productId: item.productId,
          name: item.name,
          category: 'Collection',
          unitsSold: 0,
          revenue: 0,
        };
        existing.unitsSold += item.quantity;
        existing.revenue += item.price * item.quantity;
        salesMap.set(item.productId, existing);
      }
    }

    const popularProducts = Array.from(salesMap.values()).sort(
      (a, b) => b.unitsSold - a.unitsSold || b.revenue - a.revenue,
    );

    const overview: AdminOverviewData = {
      metrics: {
        totalOrders,
        totalPreOrders,
        totalCustomers: uniqueCustomers,
        totalDemoSalesValue,
        avgOrderValue,
        avgFabricQuality: fbSummary.avgFabricQuality,
        positiveFabricPercent: fbSummary.positiveFabricPercent,
        totalPopupRegistrations: store.popupRegistrations.length,
      },
      popularProducts,
      orders: store.orders,
      feedback: store.feedback,
      popupRegistrations: store.popupRegistrations,
      newsletterCount: store.newsletterEmails.length,
    };

    res.json(overview);
  });

  app.post('/api/admin/products', requireAdmin, (req, res) => {
    const body = req.body as Partial<Product>;
    if (!body.name || !body.category || !body.price) {
      res.status(400).json({ error: 'Product name, category, and price are required.' });
      return;
    }
    const price = Number(body.price);
    if (Number.isNaN(price) || price < 499 || price > 4999) {
      res.status(400).json({ error: 'Price must be between ₹499 and ₹4,999.' });
      return;
    }

    const newProduct: Product = {
      id: `ul-${Date.now()}`,
      name: body.name.trim(),
      category: body.category,
      price,
      compareAtPrice: body.compareAtPrice ? Number(body.compareAtPrice) : Math.round(price * 1.3),
      images:
        Array.isArray(body.images) && body.images.length > 0
          ? body.images
          : ['/src/assets/images/product_tee_olive_1795078044951.jpg'],
      sizes:
        Array.isArray(body.sizes) && body.sizes.length > 0
          ? body.sizes
          : ['XS', 'S', 'M', 'L', 'XL'],
      colors:
        Array.isArray(body.colors) && body.colors.length > 0
          ? body.colors
          : [{ name: 'Olive Moss', hex: '#4B5842' }],
      fabric: (body.fabric || '100% Organic Cotton').trim(),
      fabricOrigin: (body.fabricOrigin || 'Certified Indian Loom Collective').trim(),
      sustainabilityNote: (
        body.sustainabilityNote || 'Produced in limited batches using water-conscious botanical dyes.'
      ).trim(),
      waterSavedLiters: Number(body.waterSavedLiters) || 1800,
      description: (
        body.description || 'Everyday minimalist garment crafted for comfort and durability.'
      ).trim(),
      batchCode: (body.batchCode || 'BATCH-05').trim(),
      batchTotal: Number(body.batchTotal) || 100,
      batchRemaining: Number(body.batchRemaining) || 100,
      isFeatured: Boolean(body.isFeatured),
      isNewArrival: Boolean(body.isNewArrival ?? true),
      isLimitedBatch: Boolean(body.isLimitedBatch ?? true),
    };

    store.products.unshift(newProduct);
    saveDb(store);
    res.status(201).json({ product: newProduct });
  });

  app.put('/api/admin/products/:id', requireAdmin, (req, res) => {
    const id = req.params.id;
    const idx = store.products.findIndex((p) => p.id === id);
    if (idx === -1) {
      res.status(404).json({ error: 'Product not found.' });
      return;
    }
    const existing = store.products[idx];
    const body = req.body as Partial<Product>;
    const updated: Product = {
      ...existing,
      name: body.name !== undefined ? body.name.trim() : existing.name,
      category: body.category !== undefined ? body.category : existing.category,
      price: body.price !== undefined ? Number(body.price) : existing.price,
      fabric: body.fabric !== undefined ? body.fabric.trim() : existing.fabric,
      description: body.description !== undefined ? body.description.trim() : existing.description,
      sustainabilityNote:
        body.sustainabilityNote !== undefined
          ? body.sustainabilityNote.trim()
          : existing.sustainabilityNote,
      batchRemaining:
        body.batchRemaining !== undefined ? Number(body.batchRemaining) : existing.batchRemaining,
      isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : existing.isFeatured,
      isLimitedBatch:
        body.isLimitedBatch !== undefined ? Boolean(body.isLimitedBatch) : existing.isLimitedBatch,
    };
    store.products[idx] = updated;
    saveDb(store);
    res.json({ product: updated });
  });

  app.delete('/api/admin/products/:id', requireAdmin, (req, res) => {
    const id = req.params.id;
    const before = store.products.length;
    store.products = store.products.filter((p) => p.id !== id);
    if (store.products.length === before) {
      res.status(404).json({ error: 'Product not found.' });
      return;
    }
    saveDb(store);
    res.json({ deleted: true, id });
  });

  app.patch('/api/admin/orders/:id/status', requireAdmin, (req, res) => {
    const id = req.params.id;
    const status = (req.body as { status?: OrderStatus }).status;
    const allowed: OrderStatus[] = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];
    if (!status || !allowed.includes(status)) {
      res.status(400).json({ error: 'Invalid order status.' });
      return;
    }
    const order = store.orders.find((o) => o.id === id);
    if (!order) {
      res.status(404).json({ error: 'Order not found.' });
      return;
    }
    order.status = status;
    saveDb(store);
    res.json({ order });
  });

  // Serve Vite middleware in dev, or dist/ in production
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('/{*splat}', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Urban Loom server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
