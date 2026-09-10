export type ViewMode = 'customer_app' | 'admin_portal' | 'dual_view' | 'architecture_prd';

// ─── Phase 4: Payment Gateway Types ───────────────────────────────────────────

export interface StripeCardDetails {
  cardNumber: string;    // masked, e.g. "•••• •••• •••• 4242"
  expiry: string;        // "MM/YY"
  cvc: string;           // "•••"
  cardholderName: string;
}

export type StripePaymentIntentStatus =
  | 'requires_payment_method'
  | 'requires_confirmation'
  | 'requires_action'
  | 'processing'
  | 'succeeded'
  | 'canceled';

export interface StripePaymentIntent {
  id: string;               // pi_xxxxxxxxxxxxxxxxxxxxxxxx
  clientSecret: string;     // pi_xxx_secret_yyy
  amount: number;           // amount in cents
  currency: string;         // 'usd'
  status: StripePaymentIntentStatus;
  orderId: string;
  createdAt: string;
}

export interface StripeWebhookEvent {
  id: string;               // evt_xxxxxxxxxxxxxxxxxxxxxxxx
  type: 'payment_intent.succeeded' | 'payment_intent.payment_failed' | 'charge.refunded';
  data: {
    object: StripePaymentIntent;
  };
  created: number;           // Unix timestamp
}

// ─── Phase 4: Notification Types ─────────────────────────────────────────────

export type NotificationChannel = 'sms' | 'email' | 'push';
export type NotificationTrigger =
  | 'order_booked'
  | 'specialist_assigned'
  | 'specialist_en_route'
  | 'service_started'
  | 'order_completed'
  | 'order_cancelled'
  | 'otp_verification';

export interface NotificationRecord {
  id: string;
  channel: NotificationChannel;
  trigger: NotificationTrigger;
  recipient: string;           // phone or email
  message: string;
  status: 'sent' | 'delivered' | 'failed';
  sentAt: string;
  orderId?: string;
}

export type AuthoritativeRole = 'super_admin' | 'ops_manager' | 'support_lead';

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
  currentStepProgress: number; // 0 to 100
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

export interface ArchitectureComponent {
  id: string;
  layer: 'Client Applications' | 'API Gateway & Security' | 'Core Microservices' | 'Data & Persistence' | 'External Gateways';
  title: string;
  techStack: string;
  description: string;
  responsibilities: string[];
  connections: string[];
  status: 'Active' | 'High Availability' | 'Protected' | 'Managed';
}

export interface PRDSection {
  id: string;
  title: string;
  category: 'Executive Overview' | 'Personas & Scenarios' | 'Functional Scope' | 'Architecture & Tech' | 'Security & SLA';
  content: string;
  bullets?: string[];
  keyDeliverables?: string[];
}
