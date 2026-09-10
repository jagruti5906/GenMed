import {
  ServiceItem,
  Order,
  Specialist,
  CustomerUser,
  AuditLog,
  OrderStatus,
  AuthoritativeRole,
  PaymentMethod
} from '../types/index.js';

/**
 * Default Seed Data aligned with OmniFlow Domain Specifications
 */
const SEED_SERVICES: ServiceItem[] = [
  {
    id: 'srv-1',
    name: 'Deep Home Sanctuary Cleaning',
    category: 'Home Cleaning',
    description: 'Hospital-grade sanitized deep cleaning of kitchen, living areas, bathrooms, and high-touch fixtures.',
    price: 89,
    originalPrice: 119,
    durationMinutes: 120,
    rating: 4.9,
    reviewsCount: 342,
    iconName: 'Sparkles',
    badge: 'Popular',
    available: true,
    features: ['Eco-friendly disinfectants', 'HEPA-filter vacuuming', 'Inside microwave & oven wipe down', 'Guaranteed satisfaction']
  },
  {
    id: 'srv-2',
    name: 'Emergency Plumbing Diagnostic & Fix',
    category: 'Plumbing & Electrical',
    description: 'Rapid on-site leak investigation, pipe sealing, drain declogging, and pressure valve maintenance.',
    price: 95,
    originalPrice: 130,
    durationMinutes: 60,
    rating: 4.8,
    reviewsCount: 218,
    iconName: 'Wrench',
    badge: 'Urgent Dispatch',
    available: true,
    features: ['Rapid 45-min arrival SLA', 'Hydrostatic leak inspection', 'Replacement gasket included', '30-day work warranty']
  },
  {
    id: 'srv-3',
    name: 'Smart Home & HVAC Electrical Repair',
    category: 'Plumbing & Electrical',
    description: 'Certified electrical troubleshooting for circuit breakers, smart thermostats, and lighting panels.',
    price: 110,
    durationMinutes: 90,
    rating: 4.9,
    reviewsCount: 184,
    iconName: 'Zap',
    available: true,
    features: ['Licensed master electrician', 'Load balancing safety check', 'Surge suppression audit', 'Digital diagnostic report']
  },
  {
    id: 'srv-4',
    name: 'Kitchen Appliance Overhaul',
    category: 'Appliance Repair',
    description: 'Component-level servicing for refrigerators, dishwashers, induction stoves, and dryers.',
    price: 125,
    durationMinutes: 75,
    rating: 4.7,
    reviewsCount: 156,
    iconName: 'Wrench',
    available: true,
    features: ['OEM factory parts', 'Motor amperage test', 'Refrigerant pressure check', '90-day parts warranty']
  },
  {
    id: 'srv-5',
    name: 'Workstation & Wi-Fi Mesh Setup',
    category: 'Tech Support',
    description: 'Enterprise-grade home office networking, mesh router tuning, ethernet termination, and device security.',
    price: 75,
    durationMinutes: 60,
    rating: 4.9,
    reviewsCount: 310,
    iconName: 'Cpu',
    available: true,
    features: ['Channel frequency scan', 'WPA3 enterprise hardening', 'NAS storage mapping', 'Dead-zone elimination']
  },
  {
    id: 'srv-6',
    name: 'Priority White-Glove Courier Delivery',
    category: 'Express Courier',
    description: 'Direct door-to-door expedited document and sensitive hardware transport with real-time telemetry.',
    price: 45,
    originalPrice: 60,
    durationMinutes: 45,
    rating: 4.9,
    reviewsCount: 412,
    iconName: 'Truck',
    badge: 'Express',
    available: true,
    features: ['Tamper-proof sealed bags', 'GPS telemetry tracking', 'Direct recipient signature', 'Instant photo delivery receipt']
  }
];

const SEED_SPECIALISTS: Specialist[] = [
  {
    id: 'spec-1',
    name: 'Marcus Vance',
    specialty: 'Master Plumber & HVAC Specialist',
    phone: '+1 (555) 234-8901',
    rating: 4.9,
    totalJobs: 184,
    status: 'available',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    currentLocationName: 'Downtown Logistics Hub'
  },
  {
    id: 'spec-2',
    name: 'Elena Rostova',
    specialty: 'Sanitation Lead & Surface Specialist',
    phone: '+1 (555) 987-1234',
    rating: 4.95,
    totalJobs: 242,
    status: 'in_service',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    currentLocationName: 'Midtown Residential Sector'
  },
  {
    id: 'spec-3',
    name: 'David Chen',
    specialty: 'Appliance & Precision Electronics',
    phone: '+1 (555) 345-6789',
    rating: 4.85,
    totalJobs: 129,
    status: 'available',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    currentLocationName: 'West End Tech Corridor'
  },
  {
    id: 'spec-4',
    name: 'Sarah Jenkins',
    specialty: 'Secure Courier & Critical Dispatch',
    phone: '+1 (555) 876-5432',
    rating: 4.92,
    totalJobs: 304,
    status: 'available',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    currentLocationName: 'Central Transit Hub'
  }
];

const SEED_USERS: CustomerUser[] = [
  {
    id: 'cust-101',
    name: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    phone: '+1 (555) 382-9104',
    address: '742 Evergreen Terrace, Suite 4B, Metro City',
    walletBalance: 240.00,
    loyaltyTier: 'Gold',
    totalSpent: 620.00,
    joinedDate: 'March 2025',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'cust-102',
    name: 'Marcus Bennett',
    email: 'm.bennett@enterprise.org',
    phone: '+1 (555) 912-4411',
    address: '120 Market St, 15th Floor, Financial Hub',
    walletBalance: 85.00,
    loyaltyTier: 'Silver',
    totalSpent: 380.00,
    joinedDate: 'January 2026',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  }
];

const SEED_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'ON-8921',
    customerId: 'cust-101',
    customerName: 'Alex Morgan',
    customerPhone: '+1 (555) 382-9104',
    customerEmail: 'alex.morgan@example.com',
    customerAddress: '742 Evergreen Terrace, Suite 4B, Metro City',
    serviceId: 'srv-1',
    serviceName: 'Deep Home Sanctuary Cleaning',
    serviceCategory: 'Home Cleaning',
    servicePrice: 89,
    discount: 10,
    totalAmount: 79,
    status: 'in_progress',
    paymentMethod: 'apple_pay',
    paymentStatus: 'paid',
    scheduledDate: 'Today',
    scheduledTimeSlot: '10:00 AM - 12:00 PM',
    notes: 'Please pay extra attention to master bedroom floorboards.',
    specialistId: 'spec-2',
    specialistName: 'Elena Rostova',
    specialistPhone: '+1 (555) 987-1234',
    specialistAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    specialistRating: 4.95,
    currentStepProgress: 75,
    etaMinutes: 25,
    createdAt: '2026-09-09 08:30 AM',
    timeline: [
      { status: 'pending',     timestamp: '08:30 AM', title: 'Booking Received',    description: 'Customer requested service via mobile client.' },
      { status: 'confirmed',   timestamp: '08:32 AM', title: 'Payment Confirmed',   description: 'Authorized $79.00 via Apple Pay.' },
      { status: 'assigned',    timestamp: '08:45 AM', title: 'Specialist Assigned', description: 'Elena Rostova accepted dispatch assignment.' },
      { status: 'in_progress', timestamp: '09:15 AM', title: 'Service in Progress', description: 'Specialist checked in on-site. Work is underway.' }
    ]
  },
  {
    id: 'ord-1002',
    orderNumber: 'ON-8922',
    customerId: 'cust-102',
    customerName: 'Marcus Bennett',
    customerPhone: '+1 (555) 912-4411',
    customerEmail: 'm.bennett@enterprise.org',
    customerAddress: '120 Market St, 15th Floor, Financial Hub',
    serviceId: 'srv-2',
    serviceName: 'Emergency Plumbing Diagnostic & Fix',
    serviceCategory: 'Plumbing & Electrical',
    servicePrice: 95,
    discount: 0,
    totalAmount: 95,
    status: 'assigned',
    paymentMethod: 'credit_card',
    paymentStatus: 'paid',
    scheduledDate: 'Today',
    scheduledTimeSlot: '11:30 AM - 12:30 PM',
    notes: 'Main riser valve dripping rapidly into utility closet.',
    specialistId: 'spec-1',
    specialistName: 'Marcus Vance',
    specialistPhone: '+1 (555) 234-8901',
    specialistAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    specialistRating: 4.9,
    currentStepProgress: 45,
    etaMinutes: 14,
    createdAt: '2026-09-09 09:10 AM',
    timeline: [
      { status: 'pending',   timestamp: '09:10 AM', title: 'Emergency Request Created', description: 'Priority queue triggered from mobile app.' },
      { status: 'confirmed', timestamp: '09:11 AM', title: 'Auto-Approved',             description: 'Immediate SLA match confirmed.' },
      { status: 'assigned',  timestamp: '09:15 AM', title: 'En Route',                  description: 'Marcus Vance en route via Van #104.' }
    ]
  }
];

const SEED_AUDIT_LOGS: AuditLog[] = [
  { id: 'log-1', timestamp: '09:15 AM', actorRole: 'ops_manager', actorName: 'Sarah Connor', action: 'Specialist Assigned', orderNumber: 'ON-8922', details: 'Dispatched Marcus Vance to 120 Market St.' },
  { id: 'log-2', timestamp: '09:10 AM', actorRole: 'customer',    actorName: 'Marcus Bennett', action: 'Order Placed',       orderNumber: 'ON-8922', details: 'Created priority order for Emergency Plumbing Diagnostic.' }
];

class DatabaseService {
  private services: Map<string, ServiceItem> = new Map();
  private specialists: Map<string, Specialist> = new Map();
  private users: Map<string, CustomerUser> = new Map();
  private orders: Map<string, Order> = new Map();
  private auditLogs: AuditLog[] = [];

  constructor() { this.seed(); }

  public seed(): void {
    this.services.clear();
    SEED_SERVICES.forEach(s => this.services.set(s.id, { ...s }));
    this.specialists.clear();
    SEED_SPECIALISTS.forEach(sp => this.specialists.set(sp.id, { ...sp }));
    this.users.clear();
    SEED_USERS.forEach(u => this.users.set(u.id, { ...u }));
    this.orders.clear();
    SEED_ORDERS.forEach(o => this.orders.set(o.id, { ...o }));
    this.auditLogs = [...SEED_AUDIT_LOGS];
  }

  public getServices(): ServiceItem[] { return Array.from(this.services.values()); }
  public getServiceById(id: string): ServiceItem | undefined { return this.services.get(id); }

  public createService(data: Omit<ServiceItem, 'id' | 'rating' | 'reviewsCount'>): ServiceItem {
    const id = 'srv-' + (this.services.size + 1);
    const s: ServiceItem = { ...data, id, rating: 5.0, reviewsCount: 0 };
    this.services.set(id, s);
    this.addAuditLog('super_admin', 'Super Admin', 'Service Created', `Added service ${s.name} ($${s.price})`);
    return s;
  }

  public updateService(id: string, updates: Partial<ServiceItem>): ServiceItem | null {
    const existing = this.services.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...updates };
    this.services.set(id, updated);
    this.addAuditLog('super_admin', 'Super Admin', 'Service Updated', `Updated service ${updated.name}`);
    return updated;
  }

  public toggleService(id: string): ServiceItem | null {
    const s = this.services.get(id);
    if (!s) return null;
    s.available = !s.available;
    this.services.set(id, s);
    this.addAuditLog('super_admin', 'Super Admin', 'Service Availability Toggled', `${s.name} set to ${s.available ? 'Active' : 'Inactive'}`);
    return s;
  }

  public getSpecialists(): Specialist[] { return Array.from(this.specialists.values()); }
  public getSpecialistById(id: string): Specialist | undefined { return this.specialists.get(id); }

  public updateSpecialistStatus(id: string, status: Specialist['status']): Specialist | null {
    const spec = this.specialists.get(id);
    if (!spec) return null;
    spec.status = status;
    this.specialists.set(id, spec);
    return spec;
  }

  public getUsers(): CustomerUser[] { return Array.from(this.users.values()); }
  public getUserById(id: string): CustomerUser | undefined { return this.users.get(id); }

  public topUpWallet(userId: string, amount: number): CustomerUser | null {
    const user = this.users.get(userId);
    if (!user) return null;
    user.walletBalance += amount;
    this.users.set(userId, user);
    this.addAuditLog('customer', user.name, 'Wallet Top-Up', `Added $${amount.toFixed(2)} to digital wallet`);
    return user;
  }

  public getOrders(): Order[] {
    return Array.from(this.orders.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  public getOrderById(id: string): Order | undefined { return this.orders.get(id); }

  public createOrder(params: {
    customerId: string; serviceId: string; scheduledDate: string;
    scheduledTimeSlot: string; paymentMethod: PaymentMethod;
    customAddress?: string; notes?: string;
  }): Order {
    const user = this.users.get(params.customerId) || SEED_USERS[0];
    const service = this.services.get(params.serviceId);
    if (!service) throw new Error(`Service ${params.serviceId} not found`);

    const discount = 10;
    const totalAmount = Math.max(10, service.price - discount);

    if (params.paymentMethod === 'wallet') {
      if (user.walletBalance < totalAmount) throw new Error('Insufficient wallet balance');
      user.walletBalance -= totalAmount;
    }
    user.totalSpent += totalAmount;
    this.users.set(user.id, user);

    const orderNum = 'ON-' + (8924 + Math.floor(Math.random() * 900));
    const orderId = 'ord-' + Date.now();
    const now = new Date();
    const t = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newOrder: Order = {
      id: orderId, orderNumber: orderNum,
      customerId: user.id, customerName: user.name, customerPhone: user.phone,
      customerEmail: user.email, customerAddress: params.customAddress || user.address,
      serviceId: service.id, serviceName: service.name, serviceCategory: service.category,
      servicePrice: service.price, discount, totalAmount,
      status: 'pending', paymentMethod: params.paymentMethod, paymentStatus: 'paid',
      scheduledDate: params.scheduledDate, scheduledTimeSlot: params.scheduledTimeSlot,
      notes: params.notes, currentStepProgress: 15, etaMinutes: 45,
      createdAt: `${now.toISOString().split('T')[0]} ${t}`,
      timeline: [{ status: 'pending', timestamp: t, title: 'Booking Placed', description: `Customer booked ${service.name} for ${params.scheduledDate} (${params.scheduledTimeSlot}).` }]
    };

    this.orders.set(orderId, newOrder);
    this.addAuditLog('customer', user.name, 'Order Placed', `Created order #${orderNum} for $${totalAmount}.00 (${params.paymentMethod})`, orderNum);
    return newOrder;
  }

  public updateOrderStatus(orderId: string, newStatus: OrderStatus, actorRole: AuthoritativeRole = 'ops_manager', note?: string): Order | null {
    const order = this.orders.get(orderId);
    if (!order) return null;

    const allowed: Record<OrderStatus, OrderStatus[]> = {
      pending: ['confirmed', 'cancelled'], confirmed: ['assigned', 'cancelled'],
      assigned: ['in_progress', 'cancelled'], in_progress: ['completed'],
      completed: [], cancelled: []
    };
    if (!allowed[order.status].includes(newStatus))
      throw new Error(`Invalid FSM transition: Cannot move order from ${order.status} to ${newStatus}`);

    const t = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const progressMap: Partial<Record<OrderStatus, [number, number]>> = {
      confirmed: [35, 35], assigned: [60, 20], in_progress: [85, 10],
      completed: [100, 0], cancelled: [0, 0]
    };
    const [p, e] = progressMap[newStatus] ?? [15, 45];
    order.status = newStatus; order.currentStepProgress = p; order.etaMinutes = e;
    order.timeline.push({ status: newStatus, timestamp: t, title: `Order ${newStatus.toUpperCase()}`, description: note || `Status updated to ${newStatus}` });

    if ((newStatus === 'completed' || newStatus === 'cancelled') && order.specialistId) {
      const spec = this.specialists.get(order.specialistId);
      if (spec) {
        spec.status = 'available';
        if (newStatus === 'completed') spec.totalJobs += 1;
        this.specialists.set(spec.id, spec);
      }
    }
    this.orders.set(orderId, order);
    this.addAuditLog(actorRole, actorRole === 'super_admin' ? 'Super Admin' : 'Operations Manager', `Order -> ${newStatus.toUpperCase()}`, note || `Moved order to ${newStatus}`, order.orderNumber);
    return order;
  }

  public assignSpecialist(orderId: string, specialistId: string, actorRole: AuthoritativeRole = 'ops_manager'): Order | null {
    const order = this.orders.get(orderId);
    if (!order) return null;
    const spec = this.specialists.get(specialistId);
    if (!spec) throw new Error(`Specialist ${specialistId} not found`);

    const t = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    order.status = 'assigned'; order.specialistId = spec.id; order.specialistName = spec.name;
    order.specialistPhone = spec.phone; order.specialistAvatar = spec.avatar;
    order.specialistRating = spec.rating; order.currentStepProgress = 50; order.etaMinutes = 18;
    order.timeline.push({ status: 'assigned', timestamp: t, title: 'Specialist Assigned', description: `${spec.name} (${spec.specialty}) dispatched to location.` });

    spec.status = 'on_route';
    this.specialists.set(spec.id, spec);
    this.orders.set(orderId, order);
    this.addAuditLog(actorRole, actorRole === 'super_admin' ? 'Super Admin' : 'Operations Manager', 'Specialist Dispatched', `Assigned ${spec.name} to #${order.orderNumber}`, order.orderNumber);
    return order;
  }

  public updateOrderPaymentStatus(orderId: string, paymentStatus: 'paid' | 'pending' | 'refunded'): Order | null {
    const order = this.orders.get(orderId);
    if (!order) return null;
    order.paymentStatus = paymentStatus;
    this.orders.set(orderId, order);
    this.addAuditLog('system', 'Stripe Webhook', `Payment ${paymentStatus.toUpperCase()}`, `Payment status updated to ${paymentStatus} for order #${order.orderNumber}`, order.orderNumber);
    return order;
  }

  public getAuditLogs(): AuditLog[] { return [...this.auditLogs]; }

  public addAuditLog(actorRole: AuthoritativeRole | 'customer' | 'system', actorName: string, action: string, details: string, orderNumber?: string): AuditLog {
    const t = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const log: AuditLog = { id: 'log-' + Date.now() + '-' + Math.floor(Math.random() * 1000), timestamp: t, actorRole, actorName, action, details, orderNumber };
    this.auditLogs.unshift(log);
    if (this.auditLogs.length > 100) this.auditLogs.pop();
    return log;
  }
}

export const db = new DatabaseService();
