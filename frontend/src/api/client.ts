import {
  ServiceItem,
  Order,
  Specialist,
  CustomerUser,
  AuditLog,
  OrderStatus,
  AuthoritativeRole,
  PaymentMethod
} from '../types';

const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || '/api/v1';

let activeAuthRole: AuthoritativeRole = 'super_admin';
let authToken: string = 'token-super-admin';

export const setApiAuthRole = (role: AuthoritativeRole) => {
  activeAuthRole = role;
  authToken = `token-${role.replace('_', '-')}`;
};

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  headers.set('Authorization', `Bearer ${authToken}`);
  headers.set('x-authoritative-role', activeAuthRole);

  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      const errorJson = await response.json().catch(() => ({}));
      throw new Error(errorJson.error?.message || `API Error ${response.status}: ${response.statusText}`);
    }

    const json = await response.json();
    return json.data as T;
  } catch (err: any) {
    console.warn(`[ApiClient] Request to ${endpoint} failed:`, err.message);
    throw err;
  }
}

// 1. Services API
export const servicesApi = {
  list: (availableOnly?: boolean, category?: string) => {
    const params = new URLSearchParams();
    if (availableOnly) params.set('available', 'true');
    if (category) params.set('category', category);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return apiRequest<ServiceItem[]>(`/services${qs}`);
  },

  getById: (id: string) => {
    return apiRequest<ServiceItem>(`/services/${id}`);
  },

  create: (data: Omit<ServiceItem, 'id' | 'rating' | 'reviewsCount'>) => {
    return apiRequest<ServiceItem>('/services', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  update: (id: string, updates: Partial<ServiceItem>) => {
    return apiRequest<ServiceItem>(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  },

  toggleAvailability: (id: string) => {
    return apiRequest<ServiceItem>(`/services/${id}/toggle`, {
      method: 'PATCH'
    });
  }
};

// 2. Orders API
export const ordersApi = {
  list: (status?: OrderStatus, customerId?: string) => {
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    if (customerId) params.set('customerId', customerId);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return apiRequest<Order[]>(`/orders${qs}`);
  },

  getById: (id: string) => {
    return apiRequest<Order>(`/orders/${id}`);
  },

  create: (booking: {
    serviceId: string;
    scheduledDate: string;
    scheduledTimeSlot: string;
    paymentMethod: PaymentMethod;
    customAddress?: string;
    notes?: string;
    customerId?: string;
  }) => {
    return apiRequest<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(booking)
    });
  },

  updateStatus: (id: string, newStatus: OrderStatus, note?: string) => {
    return apiRequest<Order>(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ newStatus, note })
    });
  },

  assignSpecialist: (orderId: string, specialistId: string) => {
    return apiRequest<Order>(`/orders/${orderId}/assign`, {
      method: 'PATCH',
      body: JSON.stringify({ specialistId })
    });
  },

  cancel: (orderId: string, reason?: string) => {
    return apiRequest<Order>(`/orders/${orderId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason })
    });
  }
};

// 3. Specialists API
export const specialistsApi = {
  list: (status?: Specialist['status']) => {
    const qs = status ? `?status=${status}` : '';
    return apiRequest<Specialist[]>(`/specialists${qs}`);
  },

  getById: (id: string) => {
    return apiRequest<Specialist>(`/specialists/${id}`);
  },

  updateStatus: (id: string, status: Specialist['status']) => {
    return apiRequest<Specialist>(`/specialists/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  }
};

// 4. Audit Logs API
export const auditApi = {
  list: (limit: number = 50) => {
    return apiRequest<AuditLog[]>(`/audit-logs?limit=${limit}`);
  }
};

// 5. Users & CRM API
export const usersApi = {
  list: () => {
    return apiRequest<CustomerUser[]>('/users');
  },

  getById: (id: string) => {
    return apiRequest<CustomerUser>(`/users/${id}`);
  },

  topUpWallet: (userId: string, amount: number) => {
    return apiRequest<CustomerUser>(`/users/${userId}/wallet/topup`, {
      method: 'POST',
      body: JSON.stringify({ amount })
    });
  }
};

// 6. Auth API
export const authApi = {
  login: (email?: string, role?: AuthoritativeRole) => {
    return apiRequest<{
      token: string;
      user: { id: string; name: string; email: string; role: string; loyaltyTier?: string };
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, role })
    });
  },

  getMe: () => {
    return apiRequest<{ id: string; name: string; email: string; role: string }>('/auth/me');
  }
};

// 7. Webhooks API (for testing purposes)
export const webhooksApi = {
  health: () => apiRequest<{ status: string; endpoint: string; handledEvents: string[] }>('/webhooks/health'),

  simulateStripeSuccess: (orderId: string, amount: number) =>
    apiRequest<{ received: boolean }>('/webhooks/stripe', {
      method: 'POST',
      body: JSON.stringify({
        id: 'evt_' + Math.random().toString(36).slice(2),
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_' + Math.random().toString(36).slice(2),
            clientSecret: '',
            amount: Math.round(amount * 100),
            currency: 'usd',
            status: 'succeeded',
            orderId,
            createdAt: new Date().toISOString()
          }
        },
        created: Math.floor(Date.now() / 1000)
      })
    })
};
