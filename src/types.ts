export type SizeOption = 'XS' | 'S' | 'M' | 'L' | 'XL';

export type ProductCategory =
  | 'T-shirts'
  | 'Shirts'
  | 'Tops'
  | 'Casual Wear'
  | 'Everyday Essentials';

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Delivered';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  compareAtPrice?: number;
  images: string[];
  sizes: SizeOption[];
  colors: ProductColor[];
  fabric: string;
  fabricOrigin: string;
  sustainabilityNote: string;
  waterSavedLiters: number;
  description: string;
  batchCode: string;
  batchTotal: number;
  batchRemaining: number;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isLimitedBatch?: boolean;
}

export interface CartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  size: SizeOption;
  color: string;
  quantity: number;
  fabric: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  size: SizeOption;
  color: string;
  quantity: number;
}

export interface Order {
  id: string;
  referenceNumber: string;
  orderType: 'pre-order' | 'standard';
  customerName: string;
  email: string;
  mobile: string;
  address: string;
  city: string;
  pinCode: string;
  paymentMethod: 'UPI (Demo)' | 'Razorpay Card (Demo)' | 'Cash on Delivery (Demo)';
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export interface FeedbackEntry {
  id: string;
  customerName: string;
  city: string;
  productName: string;
  fabricQuality: number;
  comfort: number;
  design: number;
  affordability: number;
  suggestion: string;
  createdAt: string;
}

export interface FeedbackSummary {
  totalReviews: number;
  avgFabricQuality: number;
  avgComfort: number;
  avgDesign: number;
  avgAffordability: number;
  positiveFabricPercent: number;
}

export interface PopupEvent {
  id: string;
  campusName: string;
  city: string;
  venue: string;
  dateLabel: string;
  timeWindow: string;
  highlights: string;
  registrationCount: number;
}

export interface PopupRegistration {
  id: string;
  name: string;
  email: string;
  preferredLocation: string;
  requestType: 'Campus Pop-up Interest' | 'Fabric Sample Request';
  notes?: string;
  createdAt: string;
}

export interface SavedAddress {
  id: string;
  label: string;
  fullName: string;
  mobile: string;
  addressLine: string;
  city: string;
  pinCode: string;
}

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  mobile: string;
  city: string;
  savedAddresses: SavedAddress[];
  wishlistIds: string[];
}

export interface AdminOverviewData {
  metrics: {
    totalOrders: number;
    totalPreOrders: number;
    totalCustomers: number;
    totalDemoSalesValue: number;
    avgOrderValue: number;
    avgFabricQuality: number;
    positiveFabricPercent: number;
    totalPopupRegistrations: number;
  };
  popularProducts: {
    productId: string;
    name: string;
    category: string;
    unitsSold: number;
    revenue: number;
  }[];
  orders: Order[];
  feedback: FeedbackEntry[];
  popupRegistrations: PopupRegistration[];
  newsletterCount: number;
}

export type AppRoute =
  | { page: 'home' }
  | { page: 'shop'; category?: ProductCategory | 'All' }
  | { page: 'product'; productId: string }
  | { page: 'cart' }
  | { page: 'checkout' }
  | { page: 'order-confirmation'; referenceNumber: string }
  | { page: 'find-us' }
  | { page: 'feedback' }
  | { page: 'about' }
  | { page: 'contact' }
  | { page: 'login' }
  | { page: 'signup' }
  | { page: 'forgot-password' }
  | { page: 'account' }
  | { page: 'wishlist' }
  | { page: 'admin-login' }
  | { page: 'admin' };
