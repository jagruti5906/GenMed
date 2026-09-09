import {
  ServiceItem,
  Specialist,
  Order,
  CustomerUser,
  AuditLog,
  ArchitectureComponent,
  PRDSection
} from './types';

export const INITIAL_SERVICES: ServiceItem[] = [
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
    originalPrice: 150,
    durationMinutes: 75,
    rating: 4.7,
    reviewsCount: 156,
    iconName: 'Cpu',
    badge: 'OEM Certified',
    available: true,
    features: ['Genuine manufacturer parts', 'Compressor & motor testing', 'Thermal sensor re-calibration', 'Same-day turnaround']
  },
  {
    id: 'srv-5',
    name: 'Workstation & Wi-Fi Mesh Setup',
    category: 'Tech Support',
    description: 'Professional networking optimization, security router setup, printer integration, and backup config.',
    price: 75,
    durationMinutes: 60,
    rating: 4.9,
    reviewsCount: 290,
    iconName: 'Wifi',
    available: true,
    features: ['Zero dead-zone mesh tuning', 'WPA3 enterprise encryption', 'NAS / Cloud backup sync', 'Speed test verification']
  },
  {
    id: 'srv-6',
    name: 'Priority White-Glove Courier Delivery',
    category: 'Express Courier',
    description: 'Dedicated direct point-to-point courier for fragile documents, medical supplies, or high-value packages.',
    price: 45,
    durationMinutes: 45,
    rating: 5.0,
    reviewsCount: 512,
    iconName: 'Truck',
    badge: 'Real-Time GPS',
    available: true,
    features: ['Direct door-to-door courier', 'Digital signature proof-of-delivery', 'Insured up to $5,000', 'Live GPS broadcast']
  }
];

export const INITIAL_SPECIALISTS: Specialist[] = [
  {
    id: 'spec-1',
    name: 'Marcus Vance',
    specialty: 'Master Electrician & Smart Home',
    phone: '+1 (555) 234-8901',
    rating: 4.9,
    totalJobs: 489,
    status: 'on_route',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    currentLocationName: 'Downtown Metro Sector 4'
  },
  {
    id: 'spec-2',
    name: 'Elena Rostova',
    specialty: 'Sanitation Lead & Deep Cleaning',
    phone: '+1 (555) 987-1234',
    rating: 4.95,
    totalJobs: 620,
    status: 'in_service',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    currentLocationName: 'Oakridge Residential Heights'
  },
  {
    id: 'spec-3',
    name: 'David Chen',
    specialty: 'Emergency Plumber & Gas Systems',
    phone: '+1 (555) 456-7890',
    rating: 4.85,
    totalJobs: 340,
    status: 'available',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    currentLocationName: 'North Station Hub'
  },
  {
    id: 'spec-4',
    name: 'Sarah Jenkins',
    specialty: 'Express Logistics Courier',
    phone: '+1 (555) 678-9012',
    rating: 5.0,
    totalJobs: 890,
    status: 'available',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    currentLocationName: 'Financial District Depot'
  }
];

export const CURRENT_CUSTOMER: CustomerUser = {
  id: 'cust-101',
  name: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  phone: '+1 (555) 382-9104',
  address: '742 Evergreen Terrace, Suite 4B, Metro City',
  walletBalance: 240.50,
  loyaltyTier: 'VIP Platinum',
  totalSpent: 1845.00,
  joinedDate: 'Jan 2025',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
};

export const INITIAL_ORDERS: Order[] = [
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
      {
        status: 'pending',
        timestamp: '08:30 AM',
        title: 'Booking Received',
        description: 'Customer requested service via mobile client.'
      },
      {
        status: 'confirmed',
        timestamp: '08:32 AM',
        title: 'Payment Confirmed',
        description: 'Authorized $79.00 via Apple Pay.'
      },
      {
        status: 'assigned',
        timestamp: '08:45 AM',
        title: 'Specialist Assigned',
        description: 'Elena Rostova accepted dispatch assignment.'
      },
      {
        status: 'in_progress',
        timestamp: '09:15 AM',
        title: 'Service in Progress',
        description: 'Specialist checked in on-site. Work is underway.'
      }
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
      {
        status: 'pending',
        timestamp: '09:10 AM',
        title: 'Emergency Request Created',
        description: 'Priority queue triggered from mobile app.'
      },
      {
        status: 'confirmed',
        timestamp: '09:11 AM',
        title: 'Auto-Approved',
        description: 'Immediate SLA match confirmed.'
      },
      {
        status: 'assigned',
        timestamp: '09:15 AM',
        title: 'En Route',
        description: 'Marcus Vance en route via Van #104.'
      }
    ]
  },
  {
    id: 'ord-1003',
    orderNumber: 'ON-8923',
    customerId: 'cust-103',
    customerName: 'Dr. Clara Oswald',
    customerPhone: '+1 (555) 441-2099',
    customerEmail: 'clara.oswald@stjudes.edu',
    customerAddress: '55 University Parkway, Apt 3C',
    serviceId: 'srv-6',
    serviceName: 'Priority White-Glove Courier Delivery',
    serviceCategory: 'Express Courier',
    servicePrice: 45,
    discount: 5,
    totalAmount: 40,
    status: 'pending',
    paymentMethod: 'wallet',
    paymentStatus: 'paid',
    scheduledDate: 'Today',
    scheduledTimeSlot: '01:00 PM - 02:00 PM',
    notes: 'Urgent pathology sample transport. Keep upright.',
    currentStepProgress: 15,
    etaMinutes: 45,
    createdAt: '2026-09-09 09:40 AM',
    timeline: [
      {
        status: 'pending',
        timestamp: '09:40 AM',
        title: 'Courier Requested',
        description: 'Awaiting Operations Manager dispatch assignment.'
      }
    ]
  },
  {
    id: 'ord-1004',
    orderNumber: 'ON-8919',
    customerId: 'cust-101',
    customerName: 'Alex Morgan',
    customerPhone: '+1 (555) 382-9104',
    customerEmail: 'alex.morgan@example.com',
    customerAddress: '742 Evergreen Terrace, Suite 4B, Metro City',
    serviceId: 'srv-5',
    serviceName: 'Workstation & Wi-Fi Mesh Setup',
    serviceCategory: 'Tech Support',
    servicePrice: 75,
    discount: 0,
    totalAmount: 75,
    status: 'completed',
    paymentMethod: 'credit_card',
    paymentStatus: 'paid',
    scheduledDate: 'Yesterday',
    scheduledTimeSlot: '03:00 PM - 04:00 PM',
    notes: 'Dual router installation and fiber ONT bridge.',
    specialistId: 'spec-1',
    specialistName: 'Marcus Vance',
    specialistPhone: '+1 (555) 234-8901',
    specialistAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    specialistRating: 4.9,
    currentStepProgress: 100,
    etaMinutes: 0,
    createdAt: '2026-09-08 02:00 PM',
    timeline: [
      {
        status: 'pending',
        timestamp: '02:00 PM',
        title: 'Order Placed',
        description: 'Customer booked tech setup.'
      },
      {
        status: 'confirmed',
        timestamp: '02:05 PM',
        title: 'Confirmed',
        description: 'Payment verified.'
      },
      {
        status: 'assigned',
        timestamp: '02:15 PM',
        title: 'Assigned',
        description: 'Assigned to Marcus Vance.'
      },
      {
        status: 'in_progress',
        timestamp: '03:00 PM',
        title: 'Work Begun',
        description: 'Mesh network tuned.'
      },
      {
        status: 'completed',
        timestamp: '03:52 PM',
        title: 'Completed & Certified',
        description: 'Customer signed off with 5-star rating.'
      }
    ]
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: '09:40:12 AM',
    actorRole: 'customer',
    actorName: 'Dr. Clara Oswald',
    action: 'Order Placed',
    orderNumber: 'ON-8923',
    details: 'Created Priority Courier booking using internal wallet balance.'
  },
  {
    id: 'log-2',
    timestamp: '09:15:04 AM',
    actorRole: 'ops_manager',
    actorName: 'Operations Lead (System)',
    action: 'Specialist Dispatched',
    orderNumber: 'ON-8922',
    details: 'Assigned Marcus Vance to Emergency Plumbing Order #ON-8922.'
  },
  {
    id: 'log-3',
    timestamp: '09:15:00 AM',
    actorRole: 'system',
    actorName: 'SLA Watchdog',
    action: 'Status Escalation',
    orderNumber: 'ON-8922',
    details: 'Flagged as High Urgency due to running water hazard.'
  },
  {
    id: 'log-4',
    timestamp: '08:45:22 AM',
    actorRole: 'ops_manager',
    actorName: 'Sarah Lin (Dispatcher)',
    action: 'Manual Dispatch',
    orderNumber: 'ON-8921',
    details: 'Manually routed to Elena Rostova based on proximity index.'
  },
  {
    id: 'log-5',
    timestamp: '08:32:10 AM',
    actorRole: 'system',
    actorName: 'Stripe Gateway',
    action: 'Payment Captured',
    orderNumber: 'ON-8921',
    details: 'Captured $79.00 via Apple Pay token auth.'
  }
];

export const ARCHITECTURE_COMPONENTS: ArchitectureComponent[] = [
  {
    id: 'arch-client-app',
    layer: 'Client Applications',
    title: 'Customer Native / PWA Mobile App',
    techStack: 'React 19, Tailwind CSS, Motion, Web Push API',
    description: 'Ultra-fast, touch-optimized client application designed for mobile viewports. Features dynamic catalog browsing, single-tap checkout, live GPS specialist tracking, and AI Concierge.',
    responsibilities: [
      'Customer authentication & biometric sign-in',
      'Interactive catalog discovery with faceted filter engines',
      'Real-time order tracking with step progress & map pins',
      'Integrated conversational Gemini AI customer concierge'
    ],
    connections: ['API Gateway / Reverse Proxy', 'WebSocket Live Stream'],
    status: 'Active'
  },
  {
    id: 'arch-admin-web',
    layer: 'Client Applications',
    title: 'Admin & Authoritative Web Portal',
    techStack: 'React Desktop SPA, Tailwind UI, Multi-Role RBAC',
    description: 'High-density operational cockpit for Super Admins, Operations Managers, and Support Specialists to coordinate field dispatches, monitor revenue, edit services, and audit actions.',
    responsibilities: [
      'Role-based access control (Super Admin, Ops Manager, Support Lead)',
      'Real-time Kanban dispatch board with drag-and-drop or 1-click status shifts',
      'Comprehensive catalog & inventory pricing management',
      'Audit log inspection, dispute escalation, and system health metrics'
    ],
    connections: ['API Gateway / Reverse Proxy', 'WebSocket Live Stream'],
    status: 'Active'
  },
  {
    id: 'arch-gateway',
    layer: 'API Gateway & Security',
    title: 'Secure Edge Gateway & Reverse Proxy',
    techStack: 'Nginx, Envoy Proxy, Token Auth, Rate Limiter',
    description: 'Central ingress point routing external client requests to microservices while enforcing TLS termination, JWT validation, rate limiting, and CORS security.',
    responsibilities: [
      'Single external IP ingress on port 3000/8080',
      'Role & scope validation on incoming bearer tokens',
      'DDoS rate limiting (1,000 req/min per IP)',
      'Dynamic routing between synchronous REST and asynchronous WebSockets'
    ],
    connections: ['Core Microservices', 'Client Applications'],
    status: 'High Availability'
  },
  {
    id: 'arch-service-order',
    layer: 'Core Microservices',
    title: 'Order & Dispatch Management Service',
    techStack: 'Node.js Express / Go Microservice, BullMQ',
    description: 'State machine managing order lifecycles (Pending -> Confirmed -> Assigned -> In Progress -> Completed), geofenced technician matching, and ETA calculation algorithms.',
    responsibilities: [
      'Finite State Machine (FSM) enforcing valid status transitions',
      'Geofence proximity calculation for technician dispatch',
      'Automated SLA monitoring and fallback re-dispatch queue',
      'Real-time broadcast triggers upon order status changes'
    ],
    connections: ['API Gateway', 'PostgreSQL Primary DB', 'Event Bus / PubSub'],
    status: 'Managed'
  },
  {
    id: 'arch-service-catalog',
    layer: 'Core Microservices',
    title: 'Service Catalog & Pricing Engine',
    techStack: 'REST Service, Redis In-Memory Cache',
    description: 'Manages multi-tier service taxonomy, promotional discount logic, dynamic surge pricing based on local demand, and inventory availability.',
    responsibilities: [
      'Sub-millisecond cached catalog queries',
      'Dynamic discount code & wallet deduction math',
      'Admin-governed instant pricing & feature toggle mutations'
    ],
    connections: ['Redis Cache', 'PostgreSQL Primary DB'],
    status: 'Managed'
  },
  {
    id: 'arch-service-ai',
    layer: 'Core Microservices',
    title: 'AI Concierge & Operations Intelligence Hub',
    techStack: 'Google Gemini 2.5/Flash SDK, Embeddings, Context Augmentation',
    description: 'Dual-purpose AI service providing customer-facing intent detection (recommending ideal services) and admin-facing anomaly detection & dispatch optimization.',
    responsibilities: [
      'Natural language order search and service suggestions',
      'Real-time customer query resolution with grounding',
      'Operational anomaly detection (delayed jobs, surge bottlenecks)'
    ],
    connections: ['Gemini API', 'Client Applications'],
    status: 'Protected'
  },
  {
    id: 'arch-data-sql',
    layer: 'Data & Persistence',
    title: 'Relational Database (PostgreSQL / Cloud SQL)',
    techStack: 'PostgreSQL 16, ACID Transactions, Read Replicas',
    description: 'Authoritative data store maintaining normalized records for users, roles, services, orders, financial transactions, and immutable audit logs.',
    responsibilities: [
      'ACID transactional guarantees for payment & order placement',
      'Foreign-key relational integrity across customers and specialists',
      'Encrypted-at-rest customer PII data'
    ],
    connections: ['Core Microservices'],
    status: 'High Availability'
  },
  {
    id: 'arch-data-cache',
    layer: 'Data & Persistence',
    title: 'Distributed In-Memory Cache & Pub/Sub',
    techStack: 'Redis 7.2 Cluster, Sentinel High-Availability',
    description: 'Low-latency session store, live technician coordinates tracker, and pub/sub message bus feeding WebSocket connections for real-time order tracking.',
    responsibilities: [
      'Live geolocation ephemeral caching (<50ms)',
      'Pub/sub event distributor for client sync',
      'Session token blacklist and distributed locks'
    ],
    connections: ['Core Microservices', 'WebSocket Hub'],
    status: 'High Availability'
  },
  {
    id: 'arch-external-integrations',
    layer: 'External Gateways',
    title: 'External Third-Party Ecosystem',
    techStack: 'Stripe Payments, Google Maps Platform, Twilio SMS',
    description: 'Integrated external platforms supplying credit card tokenization, route polyline calculations, and transactional SMS notifications.',
    responsibilities: [
      'PCI-DSS compliant payment processing',
      'Turn-by-turn routing and real-time transit calculation',
      'Customer SMS delivery receipts and emergency push alerts'
    ],
    connections: ['API Gateway', 'Core Microservices'],
    status: 'Protected'
  }
];

export const PRD_SECTIONS: PRDSection[] = [
  {
    id: 'prd-exec',
    title: '1. Executive Summary & Problem Statement',
    category: 'Executive Overview',
    content: 'On-demand service and dispatch ecosystems face severe operational friction when customer-facing applications and administrative command centers are decoupled. Customers suffer from ambiguous arrival times and static status bars, while operations teams battle fragmented spreadsheets and opaque dispatch queues. OmniFlow unifies the entire operational lifecycle through a synchronized dual-surface architecture: a frictionless mobile app for customers and a high-density, role-governed web portal for administrators and dispatchers.',
    bullets: [
      'Core Goal: Single source of truth connecting end-customer bookings to authoritative dispatchers in real time.',
      'Target Platform: Mobile-first responsive app for customers, widescreen desktop command cockpit for admin roles.',
      'Unified Data Pipeline: Live synchronized state where any admin status change reflects instantaneously on the customer mobile screen.'
    ]
  },
  {
    id: 'prd-personas',
    title: '2. User Personas & Role Matrix',
    category: 'Personas & Scenarios',
    content: 'The platform accommodates four primary stakeholder personas with distinct permissions and interface requirements:',
    bullets: [
      'Customer (Alex Morgan): Needs 3-tap booking, transparent pricing, live specialist arrival countdown, digital receipting, and 24/7 AI chat support.',
      'Super Admin / Executive: Requires high-level KPI visibility (Gross Merchandise Value, Active Specialists, SLA Compliance), service catalog governance, and system-wide audit controls.',
      'Operations Manager / Dispatcher: Coordinates the live field board, reallocates specialists, manages capacity crunches, and overrides order statuses.',
      'Support & Dispute Specialist: Handles customer escalation tickets, processes refunds, and monitors review ratings.'
    ]
  },
  {
    id: 'prd-customer-app',
    title: '3. Customer App Functional Specifications',
    category: 'Functional Scope',
    content: 'The mobile app interface provides an intuitive experience designed specifically for mobile viewports:',
    bullets: [
      'Faceted Service Catalog: Interactive categories (Home Cleaning, Emergency Plumbing, Electrical, Appliances, Courier) with transparent base pricing and duration estimates.',
      'Multi-Step Instant Booking: Schedule date/time slot, input customized address/notes, choose payment method (Card, Wallet, Apple Pay), and confirm in seconds.',
      'Live Tracking & Telemetry: 5-stage visual progress tracker (Pending -> Confirmed -> Assigned -> In Progress -> Completed) with live ETA countdown, specialist profile card with phone contact, and map pin visualization.',
      'Intelligent AI Concierge: Built-in conversational assistant to answer service FAQs, estimate complex project costs, and provide booking recommendations.',
      'Profile & Transaction History: Real-time wallet balance, active promotions, loyalty tier perks, and historic order receipts.'
    ]
  },
  {
    id: 'prd-admin-web',
    title: '4. Authoritative Web Portal Functional Specifications',
    category: 'Functional Scope',
    content: 'The web view provides a dense, information-rich desktop cockpit tailored for high-volume operational workflows:',
    bullets: [
      'Real-Time Dispatch Command Board: Kanban and high-density list views of all orders with color-coded status badges, 1-click status advancement, and specialist reassignment modal.',
      'Dynamic Role Switcher: Toggle seamlessly between Super Admin, Operations Manager, and Support Lead to demonstrate granular permission boundaries.',
      'Service & Catalog Management: Real-time CRUD controls to add new services, update pricing tiers, adjust duration estimates, and toggle service availability.',
      'Customer Directory & CRM: Customer profiles, lifetime transaction volume, active loyalty badges, and contact details.',
      'Audit Ledger: Immutable chronological stream of system events, operator overrides, payment captures, and dispatch assignments.',
      'AI Operations Co-Pilot: Automated operational health analysis, dispatch bottleneck identification, and shift summaries.'
    ]
  },
  {
    id: 'prd-arch-tech',
    title: '5. Technical Architecture & Data Consistency',
    category: 'Architecture & Tech',
    content: 'Built upon a resilient event-driven microservices architecture ensuring sub-second state propagation between customer apps and admin cockpits:',
    bullets: [
      'State Synchronization: Shared reactive state engine simulating bidirectional WebSocket events between customer interactions and admin actions.',
      'Deterministic State Machine: Strict status progression preventing invalid transitions (e.g., cannot complete an unassigned order).',
      'Auditing & Security: Every status modification creates an immutable audit record logging timestamp, actor role, and previous/next states.'
    ]
  }
];
