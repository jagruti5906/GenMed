export type AuthoritativeRole = 'super_admin' | 'ops_manager' | 'support_lead';
export type UserRole = AuthoritativeRole | 'customer';

export type OrderStatus = 'pending' | 'confirmed' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
export type PaymentMethod = 'credit_card' | 'apple_pay' | 'cash_on_delivery' | 'wallet';
export type PaymentStatus = 'paid' | 'pending' | 'refunded';

export interface ServiceItem {
  id: string;
  name: string;
  category: 'Home Cleaning' | 'Plumbing & Electrical' | 'Appliance Repair' | 'Tech Support' | 'Express Courier';
  description: string;
  price: number;
  originalPrice?: number;
  durationMinutes: number;
  rating: number;
  reviewsCount: number;
  iconName: string;
  badge?: string;
  available: boolean;
  features: string[];
}

export interface OrderTimelineEvent {
  status: OrderStatus;
  timestamp: string;
  title: string;
  description: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  serviceId: string;
  serviceName: string;
  serviceCategory: string;
  servicePrice: number;
  discount: number;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  scheduledDate: string;
  scheduledTimeSlot: string;
  notes?: string;
  specialistId?: string;
  specialistName?: string;
  specialistPhone?: string;
  specialistAvatar?: string;
  specialistRating?: number;
  currentStepProgress: number;
  etaMinutes: number;
  createdAt: string;
  timeline: OrderTimelineEvent[];
}

export interface Specialist {
  id: string;
  name: string;
  specialty: string;
  phone: string;
  rating: number;
  totalJobs: number;
  status: 'available' | 'on_route' | 'in_service' | 'off_duty';
  avatar: string;
  currentLocationName: string;
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  walletBalance: number;
  loyaltyTier: 'Bronze' | 'Silver' | 'Gold' | 'VIP Platinum';
  totalSpent: number;
  joinedDate: string;
  avatar: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorRole: AuthoritativeRole | 'customer' | 'system';
  actorName: string;
  action: string;
  orderNumber?: string;
  details: string;
}

export interface AuthSession {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    loyaltyTier?: string;
  };
}

// Phase 4: Stripe / webhook types
export interface StripePaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: string;
  orderId: string;
  createdAt: string;
}

export interface StripeWebhookEvent {
  id: string;
  type: 'payment_intent.succeeded' | 'payment_intent.payment_failed' | 'charge.refunded';
  data: { object: StripePaymentIntent };
  created: number;
}
