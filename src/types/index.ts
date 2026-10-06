export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'on-hold'
  | 'completed'
  | 'cancelled'
  | 'refunded'
  | 'failed';

export type ProductStatus = 'publish' | 'draft' | 'pending' | 'private';
export type StockStatus = 'instock' | 'outofstock' | 'onbackorder';

export interface WordPressSite {
  id: string;
  name: string;
  adminUrl: string;
  siteUrl: string;
  username: string;
  authType: 'application_password' | 'standard';
  status: 'connected' | 'error' | 'syncing' | 'offline';
  lastSync: string;
  wpVersion?: string;
  wcVersion?: string;
  productsCount: number;
  ordersCount: number;
  hasWooCommerce: boolean;
  createdAt: string;
}

export interface WooProduct {
  id: number | string;
  siteId: string;
  siteName?: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  regularPrice: number;
  salePrice: number | null;
  stockQuantity: number | null;
  stockStatus: StockStatus;
  category: string;
  tags: string[];
  status: ProductStatus;
  images: string[];
  description: string;
  shortDescription: string;
  updatedAt: string;
  createdAt: string;
}

export interface WooOrderItem {
  id: string | number;
  name: string;
  productId: string | number;
  quantity: number;
  subtotal: number;
  total: number;
}

export interface WooOrder {
  id: number | string;
  siteId: string;
  siteName?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  status: OrderStatus;
  items: WooOrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
  paymentMethod: string;
  shippingAddress: {
    address1: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  billingAddress: {
    address1: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  customerNote?: string;
}

export interface WordPressUser {
  id: number | string;
  siteId: string;
  siteName?: string;
  name: string;
  username: string;
  email: string;
  role: 'administrator' | 'shop_manager' | 'customer' | 'subscriber' | 'editor';
  registeredDate: string;
  status: 'active' | 'inactive';
  ordersCount?: number;
  totalSpent?: number;
}

export interface DashboardStats {
  totalViews: number;
  totalProducts: number;
  totalSales: number;
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  refundedOrders: number;
  registeredUsers: number;
  currency: string;
  period: string;
  chartData: {
    date: string;
    label: string;
    sales: number;
    orders: number;
    revenue: number;
    views: number;
  }[];
}

export interface AuditLog {
  id: string;
  siteId?: string;
  siteName?: string;
  action: string;
  category: 'product' | 'order' | 'site' | 'user' | 'system';
  details: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  createdAt?: string;
}
