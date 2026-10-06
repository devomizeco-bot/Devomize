import {
  WordPressSite,
  WooProduct,
  WooOrder,
  WordPressUser,
  DashboardStats,
  AuditLog,
  OrderStatus,
} from '../types';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorMsg = 'API request failed';
    try {
      const errData = await res.json();
      errorMsg = errData.error || errData.message || errorMsg;
    } catch {
      errorMsg = `HTTP Error ${res.status}: ${res.statusText}`;
    }
    throw new Error(errorMsg);
  }
  return res.json();
}

export const api = {
  // Sites
  async getSites(): Promise<WordPressSite[]> {
    const res = await fetch('/api/sites');
    return handleResponse<WordPressSite[]>(res);
  },

  async addSite(data: {
    name: string;
    adminUrl: string;
    username: string;
    password: string;
    authType?: 'application_password' | 'standard';
  }): Promise<WordPressSite> {
    const res = await fetch('/api/sites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<WordPressSite>(res);
  },

  async updateSite(
    id: string,
    data: { name?: string; adminUrl?: string; username?: string; password?: string }
  ): Promise<WordPressSite> {
    const res = await fetch(`/api/sites/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<WordPressSite>(res);
  },

  async removeSite(id: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`/api/sites/${id}`, { method: 'DELETE' });
    return handleResponse<{ success: boolean; message: string }>(res);
  },

  async testSiteConnection(id: string): Promise<{ success: boolean; message: string; site: WordPressSite }> {
    const res = await fetch(`/api/sites/${id}/test`, { method: 'POST' });
    return handleResponse<{ success: boolean; message: string; site: WordPressSite }>(res);
  },

  async syncSite(id: string): Promise<{ success: boolean; lastSync: string; site: WordPressSite }> {
    const res = await fetch(`/api/sites/${id}/sync`, { method: 'POST' });
    return handleResponse<{ success: boolean; lastSync: string; site: WordPressSite }>(res);
  },

  // Dashboard
  async getDashboardStats(siteId: string, period = '7days'): Promise<DashboardStats> {
    const url = siteId === 'all'
      ? `/api/dashboard/all?period=${period}`
      : `/api/sites/${siteId}/dashboard?period=${period}`;
    const res = await fetch(url);
    return handleResponse<DashboardStats>(res);
  },

  // Products
  async getProducts(
    siteId: string,
    filters?: { search?: string; stockStatus?: string; category?: string; status?: string }
  ): Promise<WooProduct[]> {
    const params = new URLSearchParams();
    if (filters?.search) params.set('search', filters.search);
    if (filters?.stockStatus) params.set('stockStatus', filters.stockStatus);
    if (filters?.category) params.set('category', filters.category);
    if (filters?.status) params.set('status', filters.status);

    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`/api/sites/${siteId}/products${query}`);
    return handleResponse<WooProduct[]>(res);
  },

  async createProduct(
    siteId: string,
    data: Partial<WooProduct> & { targetSiteId?: string }
  ): Promise<WooProduct> {
    const res = await fetch(`/api/sites/${siteId}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<WooProduct>(res);
  },

  async updateProduct(
    siteId: string,
    productId: number | string,
    data: Partial<WooProduct>
  ): Promise<WooProduct> {
    const res = await fetch(`/api/sites/${siteId}/products/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<WooProduct>(res);
  },

  async deleteProduct(
    siteId: string,
    productId: number | string
  ): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`/api/sites/${siteId}/products/${productId}`, {
      method: 'DELETE',
    });
    return handleResponse<{ success: boolean; message: string }>(res);
  },

  // Orders
  async getOrders(
    siteId: string,
    filters?: { status?: string; search?: string }
  ): Promise<WooOrder[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.set('status', filters.status);
    if (filters?.search) params.set('search', filters.search);

    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`/api/sites/${siteId}/orders${query}`);
    return handleResponse<WooOrder[]>(res);
  },

  async updateOrderStatus(
    siteId: string,
    orderId: number | string,
    status: OrderStatus,
    note?: string
  ): Promise<{ success: boolean; order: WooOrder; message: string }> {
    const res = await fetch(`/api/sites/${siteId}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, note }),
    });
    return handleResponse<{ success: boolean; order: WooOrder; message: string }>(res);
  },

  // Users
  async getUsers(
    siteId: string,
    filters?: { role?: string; search?: string }
  ): Promise<WordPressUser[]> {
    const params = new URLSearchParams();
    if (filters?.role) params.set('role', filters.role);
    if (filters?.search) params.set('search', filters.search);

    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`/api/sites/${siteId}/users${query}`);
    return handleResponse<WordPressUser[]>(res);
  },

  // Browser check
  async checkBrowserEmbeddable(siteId: string): Promise<{
    siteId: string;
    adminUrl: string;
    allowIframe: boolean;
    restrictionReason?: string;
    recommendedMode: 'embedded' | 'external';
  }> {
    const res = await fetch(`/api/sites/${siteId}/browser-proxy/check`);
    return handleResponse(res);
  },

  // Audit Logs
  async getAuditLogs(limit = 50): Promise<AuditLog[]> {
    const res = await fetch(`/api/audit-logs?limit=${limit}`);
    return handleResponse<AuditLog[]>(res);
  },
};
