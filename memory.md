# Project Memory & Knowledge Base — OmniFlow Platform

This file serves as the **persistent long-term memory** for the OmniFlow Platform. It stores the operational snapshot, architecture blueprints, feature matrices, schema definitions, and roadmap to guide ongoing development across AI sessions.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack & Tooling](#2-tech-stack--tooling)
3. [Features Completed](#3-features-completed)
4. [Pending Features & Technical Backlog](#4-pending-features--technical-backlog)
5. [API Endpoints (Simulated & Planned)](#5-api-endpoints-simulated--planned)
6. [Database Schema Summary](#6-database-schema-summary)
7. [Important Business Logic & State Machines](#7-important-business-logic--state-machines)
8. [Known Issues & Technical Debt](#8-known-issues--technical-debt)
9. [Future Roadmap](#9-future-roadmap)

---

## 1. Project Overview

- **Project Name**: OmniFlow Platform (Customer App & Admin Portal)
- **Repository**: `jagruti5906/GenMed`
- **Primary Mission**: Bridge the operational chasm between customer on-demand mobile experiences and administrative dispatch cockpits. OmniFlow delivers a **synchronized dual-surface architecture** demonstrating real-time order lifecycle tracking, dynamic field specialist dispatch, service catalog management, and role-governed operational auditing.
- **Key Target Stakeholders**:
  1. **Retail / Home Service Customer**: Books home services (cleaning, plumbing, HVAC, appliance repair, courier), tracks specialist arrival with live countdowns, interacts with an AI Concierge.
  2. **Operations Manager & Dispatcher**: Monitors live incoming jobs, overrides statuses, assigns specialists based on availability and proximity, handles capacity crunches.
  3. **Super Admin / Executive**: Governs service pricing, category taxonomy, system-wide compliance logs, and macro financial metrics.
  4. **Support & Escalation Lead**: Resolves customer disputes, processes refunds, reviews specialist ratings.

---

## 2. Tech Stack & Tooling

| Layer / Concern | Technology | Version | Description & Rationale |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React | `^19.0.1` | Concurrent rendering, modern hooks, robust component ecosystem |
| **Language** | TypeScript | `~5.8.2` | Strict compile-time typing, comprehensive domain interfaces |
| **Bundler & Dev Server** | Vite | `^6.2.3` | Ultra-fast HMR, ES module pipeline, proxy and plugin support |
| **Styling & CSS** | Tailwind CSS v4 | `^4.1.14` | Native Vite integration (`@tailwindcss/vite`), utility-first tokens |
| **Micro-Animations** | Motion | `^12.23.24` | Layout animations, status transitions, physics-based UI motion |
| **Iconography** | Lucide React | `^0.546.0` | Comprehensive semantic SVG icon set |
| **AI / LLM Integration** | Google GenAI SDK | `^2.4.0` | `@google/genai` for customer AI Concierge and Admin Copilot |
| **Server Runtime** | Node.js / Express | `^4.21.2` | Development applet proxy and backend API foundation |
| **State & Persistence** | React Context API | Native | In-memory reactive pub/sub with `localStorage` snapshotting |

---

## 3. Features Completed

### 3.1 Customer Mobile Experience (`src/components/customer/`)
- [x] **Realistic Mobile Phone Frame**: Emulated iPhone frame with status bar, dynamic island/notch, and responsive scrolling (`isPhoneFramed` toggle).
- [x] **Service Catalog View (`CatalogView.tsx`)**:
  - Filter by category: *Home Cleaning*, *Plumbing & Electrical*, *Appliance Repair*, *Tech Support*, *Express Courier*.
  - Pricing badges, duration estimates, review counts, and popular tags.
- [x] **Multi-Step Booking Modal (`BookingModal.tsx`)**:
  - Date picker and predefined time slots (e.g., *09:00 AM - 11:00 AM*).
  - Custom delivery/service address input with fallback to saved profile address.
  - Payment method selector: *Credit Card*, *Apple Pay*, *Cash on Delivery*, *Wallet Balance*.
  - Instant order dispatch into global context with generated unique order number (`ON-XXXX`).
- [x] **Real-Time Live Order Tracking (`OrderTrackingView.tsx`)**:
  - 5-stage visual progress tracker (`Pending` -> `Confirmed` -> `Assigned` -> `In Progress` -> `Completed`).
  - Specialist detail card (name, specialty, rating, phone contact button, avatar).
  - Interactive map simulation with live ETA countdown timer.
  - Chronological timeline audit entries.
- [x] **AI Concierge (`AiConcierge.tsx`)**:
  - Conversational AI assistant helping users diagnose household issues.
  - Curated quick prompt buttons (*Emergency plumbing*, *Hospital-grade deep cleaning*, etc.).
  - Automatic service detection and 1-click booking modal invocation directly from chat.
- [x] **Customer Profile & Digital Wallet (`CustomerProfile.tsx`)**:
  - Loyalty Tier indicator (*Bronze*, *Silver*, *Gold*, *VIP Platinum*).
  - Real-time digital wallet balance and historic order receipt list.

### 3.2 Admin & Operations Portal (`src/components/admin/`)
- [x] **Authoritative Role Switching (`Header.tsx`)**:
  - Seamless toggle between `super_admin`, `ops_manager`, and `support_lead`.
  - Visual indication of active permissions and operational scope.
- [x] **Interactive Order Dispatch Center (`OrderDispatchCenter.tsx`)**:
  - High-density order list with status filter pills (`All`, `Pending`, `Confirmed`, `Assigned`, `In Progress`, `Completed`).
  - 1-click state advancement button according to the strict FSM order progression.
  - Interactive specialist assignment modal showing technician status (`available`, `on_route`, `in_service`) and ratings.
  - Cancellation workflow with reason capture.
- [x] **Service Catalog Manager (`CatalogManager.tsx`)**:
  - Add new service modal with price, duration, category, and feature list.
  - Edit existing service pricing and duration.
  - 1-click toggle for immediate service availability on customer mobile apps.
- [x] **Customer CRM Directory (`CustomerDirectory.tsx`)**:
  - Customer registry with lifetime spend, loyalty tier, and address details.
- [x] **Immutable Operational Audit Log (`AuditLogView.tsx`)**:
  - Chronological stream of all system actions, status overrides, and specialist allocations with actor attribution.
- [x] **AI Operations Co-Pilot (`AiAdminCopilot.tsx`)**:
  - Conversational intelligence analyzing dispatch bottlenecks, specialist utilization, and SLA compliance.

### 3.3 Synchronized Dual View & Blueprint (`src/components/dual/`, `src/components/architecture/`)
- [x] **Synchronized Dual Split View (`DualSplitView.tsx`)**:
  - Side-by-side presentation of Customer Mobile App and Admin Dispatch Center.
  - Live proof of instant synchronization: placing an order in the left pane immediately appears in the right pane without refresh.
- [x] **Interactive Architecture & PRD Viewer (`ArchitectureAndPrdView.tsx`)**:
  - Layer-by-layer architectural inspection (*Client Applications*, *API Gateway & Security*, *Core Microservices*, *Data & Persistence*, *External Gateways*).
  - Comprehensive Product Requirements Document (PRD) viewer covering executive summary, user personas, functional specifications, and SLAs.

---

## 4. Pending Features & Technical Backlog

| Backlog Item | Priority | Domain | Description |
| :--- | :--- | :--- | :--- |
| **Live WebSocket Hub** | High | Backend / Real-time | Replace `localStorage` sync with actual Socket.io / WebSocket server for multi-device sync |
| **Live Map Tile Integration** | High | Telemetry | Replace simulated SVG map in `OrderTrackingView` with Google Maps Platform or Mapbox GL JS |
| **Real Stripe Payment Gateway** | Medium | Payments | Integrate Stripe Payment Element for PCI-DSS compliant credit card tokenization |
| **SMS & Push Notification Worker** | Medium | Communications | Twilio / Firebase Cloud Messaging pipeline for order milestone alerts |
| **Automated Technician Proximity Engine** | Medium | Dispatch | Haversine distance algorithm calculating ETA and optimal technician recommendations |
| **Dynamic Surge Pricing Algorithm** | Low | Catalog | Automated price multiplier based on concurrent pending orders in a given postal code |
| **E2E Integration & Unit Tests** | Medium | Quality Assurance | Vitest + Playwright test suite for validating FSM status transitions |

---

## 5. API Endpoints (Simulated & Planned)

### 5.1 Service Catalog
- `GET /api/v1/services`
  - **Description**: Fetch all active services with pricing, ratings, and features.
  - **Auth**: Public
  - **Response**: `ServiceItem[]`
- `POST /api/v1/services`
  - **Description**: Add a new service item.
  - **Auth**: Admin (`super_admin`)
  - **Body**: `Omit<ServiceItem, 'id' | 'rating' | 'reviewsCount'>`
- `PUT /api/v1/services/:id`
  - **Description**: Update pricing, duration, or active availability.
  - **Auth**: Admin (`super_admin`, `ops_manager`)

### 5.2 Orders & Dispatch
- `GET /api/v1/orders`
  - **Description**: List all orders with optional filter query (`?status=pending`).
  - **Auth**: Authenticated Admin / Customer (own orders)
  - **Response**: `Order[]`
- `POST /api/v1/orders`
  - **Description**: Place a new booking.
  - **Auth**: Customer
  - **Body**: `{ serviceId, date, timeSlot, paymentMethod, customAddress, notes }`
  - **Response**: `Order`
- `PATCH /api/v1/orders/:id/status`
  - **Description**: Transition order to next state in FSM.
  - **Auth**: Admin / System Dispatcher
  - **Body**: `{ newStatus: OrderStatus, note?: string }`
- `PATCH /api/v1/orders/:id/assign`
  - **Description**: Assign field specialist to order.
  - **Auth**: Admin (`ops_manager`, `super_admin`)
  - **Body**: `{ specialistId: string }`

### 5.3 Field Specialists
- `GET /api/v1/specialists`
  - **Description**: Query field specialists with status (`available`, `on_route`, `in_service`).
  - **Auth**: Admin

### 5.4 Audit & Compliance
- `GET /api/v1/audit-logs`
  - **Description**: Paginated stream of audit trail logs.
  - **Auth**: Admin (`super_admin`, `support_lead`)

---

## 6. Database Schema Summary

The conceptual database schema is designed for PostgreSQL with strict referential integrity.

### 6.1 `users`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(36)` | `PRIMARY KEY` | Unique customer / user UUID |
| `name` | `VARCHAR(100)` | `NOT NULL` | Full name |
| `email` | `VARCHAR(255)` | `UNIQUE, NOT NULL`| User email address |
| `phone` | `VARCHAR(20)` | `NOT NULL` | Contact phone number |
| `address` | `TEXT` | `NOT NULL` | Default street address |
| `wallet_balance`| `NUMERIC(10,2)`| `DEFAULT 0.00` | Account credit balance |
| `loyalty_tier` | `VARCHAR(20)` | `DEFAULT 'Bronze'`| Tier: Bronze, Silver, Gold, VIP |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Registration timestamp |

### 6.2 `services`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(36)` | `PRIMARY KEY` | Service item identifier |
| `name` | `VARCHAR(150)` | `NOT NULL` | Display title |
| `category` | `VARCHAR(50)` | `NOT NULL` | Service category grouping |
| `description` | `TEXT` | `NOT NULL` | Detailed scope of work |
| `price` | `NUMERIC(10,2)`| `NOT NULL` | Base price in USD |
| `duration_mins` | `INTEGER` | `NOT NULL` | Estimated completion time |
| `rating` | `NUMERIC(3,2)` | `DEFAULT 5.0` | Aggregated rating |
| `reviews_count` | `INTEGER` | `DEFAULT 0` | Total review count |
| `is_available` | `BOOLEAN` | `DEFAULT TRUE` | Active toggle |

### 6.3 `specialists`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(36)` | `PRIMARY KEY` | Specialist identifier |
| `name` | `VARCHAR(100)` | `NOT NULL` | Technician name |
| `specialty` | `VARCHAR(100)` | `NOT NULL` | Primary trade specialty |
| `rating` | `NUMERIC(3,2)` | `NOT NULL` | Performance rating |
| `status` | `VARCHAR(20)` | `NOT NULL` | `available`, `on_route`, `in_service` |
| `current_location`| `VARCHAR(150)`| `NOT NULL` | Geolocation name or coordinates |

### 6.4 `orders`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(36)` | `PRIMARY KEY` | Order UUID |
| `order_number` | `VARCHAR(20)` | `UNIQUE, NOT NULL`| Human-readable order code (`ON-XXXX`) |
| `customer_id` | `VARCHAR(36)` | `REFERENCES users`| Booking user |
| `service_id` | `VARCHAR(36)` | `REFERENCES services`| Requested service |
| `specialist_id`| `VARCHAR(36)` | `REFERENCES specialists`| Assigned field pro (nullable) |
| `status` | `VARCHAR(20)` | `NOT NULL` | FSM Status |
| `total_amount` | `NUMERIC(10,2)`| `NOT NULL` | Final amount billed |
| `payment_status`| `VARCHAR(20)` | `NOT NULL` | `pending`, `paid`, `refunded` |
| `scheduled_date`| `DATE` | `NOT NULL` | Service appointment date |
| `scheduled_slot`| `VARCHAR(50)` | `NOT NULL` | Service appointment time slot |
| `step_progress`| `INTEGER` | `DEFAULT 0` | Progress percentage (`0` to `100`) |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Order placement time |

### 6.5 `audit_logs`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(36)` | `PRIMARY KEY` | Audit log entry UUID |
| `timestamp` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Exact occurrence time |
| `actor_role` | `VARCHAR(30)` | `NOT NULL` | `super_admin`, `ops_manager`, `system` |
| `actor_name` | `VARCHAR(100)` | `NOT NULL` | Identity of operator |
| `action` | `VARCHAR(100)` | `NOT NULL` | Operation performed |
| `order_number` | `VARCHAR(20)` | `NULLABLE` | Related order code |
| `details` | `TEXT` | `NOT NULL` | Descriptive log message |

---

## 7. Important Business Logic & State Machines

### 7.1 Order Lifecycle Finite State Machine (FSM)

```
[Customer Books] ──► (pending) 
                          │
                          ▼ (Admin / Auto Confirm)
                     (confirmed)
                          │
                          ▼ (Specialist Assigned)
                     (assigned)
                          │
                          ▼ (Technician Arrives & Starts)
                    (in_progress)
                          │
                          ▼ (Work Validated & Completed)
                    (completed)
```
*Note: `cancelled` is accessible only from `pending` or `confirmed`.*

| Current State | Permitted Next States | Progress % | Required Pre-conditions |
| :--- | :--- | :--- | :--- |
| `pending` | `confirmed`, `cancelled` | 15% | Valid booking payload & payment authorization |
| `confirmed` | `assigned`, `cancelled` | 35% | Operator or auto-scheduler confirmation |
| `assigned` | `in_progress` | 65% | Specialist attached (`specialistId` must be set) |
| `in_progress` | `completed` | 85% -> 100%| Specialist on-site executing job |
| `completed` | *(Terminal state)* | 100% | Payment settled, specialist released to `available` |
| `cancelled` | *(Terminal state)* | 0% | Reason logged in audit trail, refund triggered |

### 7.2 Specialist Capacity & Status Dynamics
- When an order transitions to `assigned`, the chosen specialist’s status is set to `on_route`.
- When an order transitions to `in_progress`, the chosen specialist’s status is set to `in_service`.
- When an order is marked `completed` or `cancelled`, the specialist returns to `available` status and increments `totalJobs`.

### 7.3 Pricing & Loyalty Math
- **Total Calculation**:
  $$\text{Total Amount} = \text{Base Price} - \text{Promotional Discount}$$
- **Wallet Deductions**: If payment method is `wallet`, the total amount is deducted from `currentUser.walletBalance`. If balance is insufficient, checkout requests an alternate payment method.

---

## 8. Known Issues & Technical Debt

1. **LocalStorage Volume Threshold**: `localStorage` has a ~5MB quota in browsers. Storing hundreds of simulated audit logs or high-resolution images can exceed this limit. Mitigated by capping stored audit logs to the latest 50 entries.
2. **Synchronous Simulation**: Technician travel time is currently accelerated for demonstration purposes rather than real-time GPS telemetry.
3. **Absence of Server-Side RBAC Enforcement**: In the client demo, role permissions are enforced purely at the UI layer; production deployment requires JWT authorization with server-side middleware.
4. **AI SDK Offline Fallback**: If `GEMINI_API_KEY` is not provided in `.env`, the AI Concierge and Admin Copilot use heuristic regex pattern matchers.

---

## 9. Future Roadmap & Project Phasing

> For the comprehensive breakdown of deliverables, technical architectures, task checklists, and risk matrices, see **[phases.md](file:///c:/Users/Jagruti/GenMed/phases.md)**.

- **Phase 1: Dual-Surface Core & Prototype Simulation** `[COMPLETED ✅]`  
  Customer mobile app, admin dispatch center, synchronized dual view, system architecture/PRD blueprint, local storage sync, and Gemini AI prototypes.
- **Phase 2: Production Backend, Database & Auth Engine** `[COMPLETED ✅]`  
  Express API, PostgreSQL relational schema DDL, ACID database repository, JWT/Bearer auth, RBAC middleware, and typed frontend client.
- **Phase 3: Real-Time Event Bus & Live Telemetry** `[COMPLETED ✅]`  
  SSE event bus with channel rooms, React `useOrderSocket` hook, `LiveMapView` animated map, Haversine proximity engine.
- **Phase 4: Gateways, Payments & Communications** `[COMPLETED ✅]`  
  Stripe payment simulation + Luhn validation, 2-step BookingModal, Twilio/Email/FCM notification service, Stripe webhook handler.
- **Phase 5: Advanced AI Intelligence & Operational Analytics** `[COMPLETED ✅]`  
  Gemini RAG concierge, multimodal photo diagnosis, predictive SLA breach detector, shift handoff briefing, Executive BI Dashboard with surge pricing.
- **Phase 6: Cloud Hardening, CI/CD & Enterprise Scale** `[COMPLETED ✅]`  
  Multi-stage Dockerfile, docker-compose with MongoDB+Redis, GitHub Actions 4-job CI/CD pipeline, OWASP security middleware.

