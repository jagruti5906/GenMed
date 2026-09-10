# Changelog — OmniFlow Platform

All notable changes to the **OmniFlow Platform (Customer App & Admin Portal)** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## Version Summary

| Version | Release Date | Highlights |
| :--- | :--- | :--- |
| [Unreleased](#unreleased) | Target Q2 2026 | WebSockets, Redis Pub/Sub, live map tiles |
| [2.0.0](#200---2026-03-25) | 2026-03-25 | **Phase 2 Complete**: Express REST Backend, PostgreSQL Schema, RBAC Auth & API Client |
| [1.0.0](#100---2026-03-15) | 2026-03-15 | Production-ready Dual-Surface Platform with AI Concierge & Copilot |
| [0.9.0](#090---2026-03-01) | 2026-03-01 | Synchronized Dual Split View & LocalStorage state sync |
| [0.5.0](#050---2026-02-15) | 2026-02-15 | Admin Dispatch Center, Role Switcher, & Immutable Audit Logging |
| [0.3.0](#030---2026-02-01) | 2026-02-01 | Customer Mobile App, Service Catalog, & Real-time Live Tracking |
| [0.1.0](#010---2026-01-15) | 2026-01-15 | Initial Scaffolding: React 19, TypeScript, Vite 6, & Tailwind CSS v4 |

---

## [Unreleased]

### Planned
- Real-time WebSocket connection to replace `localStorage` browser event sync.
- Redis Pub/Sub adapter for multi-node dispatch synchronization.
- Google Maps Platform integration for live specialist GPS telemetry.
- Stripe Payment Sheet integration for real credit card processing.
- Twilio SMS webhook integration for automated order status notifications.

---

## [2.0.0] - 2026-03-25 (Phase 2 Delivery)

### Added
- **Production-Ready Express Backend (`backend/src/`)**:
  - Express server entry point (`server/src/index.ts`) with CORS headers, logging, healthcheck endpoint (`GET /api/health`), and global error handling.
- **Relational PostgreSQL Schema (`server/src/db/schema.sql`)**:
  - Full PostgreSQL DDL schema with tables: `users`, `services`, `specialists`, `orders`, `order_timeline_events`, `audit_logs`, including foreign keys, UUIDs, and performance indexes.
- **ACID-Compliant Database Repository (`server/src/db/database.ts`)**:
  - Transactional store supporting atomic order placement, wallet deductions, seed data loading, and deterministic Finite State Machine (FSM) validation.
- **Authentication & RBAC Middleware (`server/src/middleware/auth.ts`)**:
  - Token extraction, session verification, and granular role-based authorization guards for `super_admin`, `ops_manager`, and `support_lead`.
- **RESTful API Routers (`server/src/routes/`)**:
  - `/api/v1/auth`: Customer & staff login and session validation.
  - `/api/v1/services`: Catalog retrieval, creation, modification, and active toggling.
  - `/api/v1/orders`: Order placement, retrieval, FSM status transitions, and specialist allocation.
  - `/api/v1/specialists`: Field specialist tracking and status management.
  - `/api/v1/audit-logs`: Immutable system audit ledger with pagination.
  - `/api/v1/users`: Customer directory profiles and wallet balance top-up transactions.
- **Typed Frontend API Client (`src/api/client.ts`)**:
  - End-to-end typed client methods (`servicesApi`, `ordersApi`, `specialistsApi`, `auditApi`, `usersApi`, `authApi`) connecting React components to the backend.
- **Vite Reverse Proxy & Package Script**:
  - Configured Vite development proxy in `vite.config.ts` forwarding `/api` to port 5000.
  - Added `"server": "tsx server/src/index.ts"` to `package.json`.

---

## [1.0.0] - 2026-03-15

### Added
- **Interactive System Architecture & PRD Viewer (`ArchitectureAndPrdView.tsx`)**:
  - Interactive layer inspection across Client Applications, API Gateway & Security, Core Microservices, Data & Persistence, and External Gateways.
  - Comprehensive Product Requirements Document (PRD) with Executive Overview, Personas, Functional Scope, and Security/SLA criteria.
- **AI-Powered Customer Concierge (`AiConcierge.tsx`)**:
  - Conversational natural language interface backed by `@google/genai` (Google Gemini SDK).
  - Quick action prompt chips for emergency plumbing, deep cleaning, electrical repair, and courier delivery.
  - Automatic service detection in chat with 1-click booking modal launcher.
- **AI Operations Co-Pilot (`AiAdminCopilot.tsx`)**:
  - Operations intelligence assistant providing fleet capacity analysis, dispatch bottleneck alerts, and shift summaries.
- **Persistent AI Documentation Suite**:
  - `decisions.md` documenting all 8 key Architecture Decision Records (ADRs).
  - `rules.md` detailing coding standards, UI/UX consistency, git guidelines, and regression prevention rules.
  - `memory.md` establishing the ground-truth technical knowledge base and database schemas.
  - `changelog.md` maintaining this chronological release history.
  - `phases.md` structuring the 6-phase engineering roadmap, deliverables, and checklists.

### Changed
- Refactored `src/types.ts` into a unified domain type library with strict typing across all surfaces.
- Enhanced `PlatformContext.tsx` with automated `localStorage` state synchronization, toast notifications, and reset capabilities.
- Modernized styling with Tailwind CSS v4 and fluid motion animations using `motion`.

### Fixed
- Fixed specialist availability toggle so specialist status correctly reverts to `available` when an order is completed.
- Prevented race conditions in simulated order generation by deduplicating order numbers (`ON-XXXX`).

---

## [0.9.0] - 2026-03-01

### Added
- **Synchronized Dual Split View (`DualSplitView.tsx`)**:
  - Side-by-side presentation showing Customer Mobile App and Admin Dispatch Center concurrently.
  - Real-time visual feedback proving immediate state synchronization across surfaces.
- **Phone Frame Mockup**:
  - Realistic iPhone device frame with dynamic island, time display, and battery indicators.
  - Global framing toggle button (`isPhoneFramed`) in header to switch between phone frame and full-bleed view.

### Changed
- Optimized `Header.tsx` to include unified surface switcher (`Dual Split View`, `Customer App`, `Admin Portal`, `Architecture & PRD`).
- Reorganized component folder structure into modular subdirectories (`customer/`, `admin/`, `common/`, `dual/`, `architecture/`).

### Fixed
- Fixed mobile scrolling container overflow issues inside the phone frame mockup.
- Resolved local storage serialization errors for nested date objects.

---

## [0.5.0] - 2026-02-15

### Added
- **Order Dispatch Command Center (`OrderDispatchCenter.tsx`)**:
  - High-density order queue with status badge indicators and filter pills.
  - 1-click state machine advancement button adhering to strict FSM lifecycle.
  - Interactive specialist assignment modal showing technician specialty, rating, and current job status.
- **Service Catalog Manager (`CatalogManager.tsx`)**:
  - Add, edit, and toggle active availability for service catalog items.
  - Instant pricing adjustment affecting customer catalog in real-time.
- **Authoritative Role Switching (`Header.tsx`)**:
  - Role switcher supporting `super_admin`, `ops_manager`, and `support_lead`.
- **Immutable Operational Audit Ledger (`AuditLogView.tsx`)**:
  - Chronological event stream tracking operator actions, timestamps, and order references.
- **Customer CRM Directory (`CustomerDirectory.tsx`)**:
  - Customer profile list with loyalty tiers, total spend, and contact coordinates.

### Changed
- Standardized status color tokens across admin tables (Emerald for completed, Amber for pending, Indigo for active).

### Fixed
- Fixed bug where assigning an already-booked technician was permitted without an alert.

---

## [0.3.0] - 2026-02-01

### Added
- **Customer Mobile Experience (`CustomerApp.tsx`)**:
  - Mobile bottom navigation bar (*Catalog*, *Live Tracking*, *AI Concierge*, *My Profile*).
- **Service Catalog (`CatalogView.tsx`)**:
  - Categorized service listings with pricing, estimated duration, rating stars, and badges.
- **Multi-Step Checkout & Booking Modal (`BookingModal.tsx`)**:
  - Date picker, time slot selector, customized address input, and payment method options (Card, Apple Pay, Wallet, COD).
- **Live Order Tracking (`OrderTrackingView.tsx`)**:
  - 5-stage progress indicator with simulated ETA countdown.
  - Assigned specialist profile card with direct contact button.
  - Interactive route map mockup.
- **Customer Profile & Wallet (`CustomerProfile.tsx`)**:
  - Loyalty tier badge display and balance deduction logic.

### Changed
- Implemented state persistence to prevent losing customer cart and booking progress on browser reload.

---

## [0.1.0] - 2026-01-15

### Added
- Initial project scaffolding using **Vite 6** and **React 19**.
- Strict **TypeScript 5.8** configuration in `tsconfig.json`.
- Modern **Tailwind CSS v4** styling setup via `@tailwindcss/vite`.
- Motion physics engine configuration with `motion`.
- Domain type definitions in `src/types.ts`.
- Comprehensive seed dataset in `src/mockData.ts` (services, specialists, customers, initial orders, architecture components, and PRD specifications).
- Global application shell in `src/App.tsx`.

---

## [3.0.0] — 2026-09-09 — Phase 6: Cloud Hardening & CI/CD (ALL PHASES COMPLETE)

### Added
- **`Dockerfile`** — Multi-stage production image (deps → build → release). Non-root `omniflow` user, `HEALTHCHECK`, minimal 22-alpine base. Supports `linux/amd64` + `linux/arm64`.
- **`docker-compose.yml`** — Full local development stack: MongoDB 7, Redis 7, Express backend (port 5000), Vite frontend (port 3000). Named volumes, health checks, dependency ordering.
- **`.github/workflows/deploy.yml`** — 4-job GitHub Actions CI/CD pipeline:
  - Job 1 `lint-and-typecheck` — `tsc --noEmit` on push/PR (fast feedback).
  - Job 2 `build` — Vite production build, artifact upload to GitHub.
  - Job 3 `docker-build-push` — Multi-arch image built and pushed to GHCR (main branch only).
  - Job 4 `deploy-cloud-run` — Zero-downtime deploy to Google Cloud Run with post-deploy health check smoke test.
- **`server/src/middleware/security.ts`** — OWASP Top 10 hardening layer:
  - `securityHeaders` — X-Frame-Options, X-Content-Type-Options, HSTS, CSP, Permissions-Policy, removes X-Powered-By.
  - `createRateLimiter` — In-process sliding window rate limiter with `X-RateLimit-*` headers. Pre-configured: `apiRateLimiter` (200/min), `authRateLimiter` (10/min), `webhookRateLimiter` (50/min).
  - `requestSizeGuard` — Rejects payloads exceeding 1 MB before JSON parsing (DoS mitigation).
  - `csrfProtection` — X-CSRF-Token header validation on state-changing requests (enforced in production).
  - `inputSanitiser` — Strips MongoDB `$operator` injection keys and XSS vectors from request bodies.
  - `strictCors` — Origin whitelist enforcement replacing the permissive wildcard handler.
- Security middleware fully wired into `server/src/index.ts` with per-route rate limit tiers.
- Health endpoint (`/api/health`) upgraded to v3.0.0, reports security subsystem status.

### Changed
- `server/src/index.ts` — Replaced permissive CORS and bare `express.json()` with the full OWASP security stack. Structured log format includes IP and log level.

---

## [2.5.0] — 2026-09-09 — Phase 5: AI Intelligence & Operational Analytics

### Added
- **`src/services/geminiService.ts`** (rewritten) — Gemini 2.5 Flash integration:
  - RAG-grounded customer concierge with full catalog knowledge base context.
  - `diagnosePhotoWithAI` — Gemini Vision multimodal photo diagnosis → maps damage to service SKU.
  - `predictSlaBreaches` — Pure-logic SLA breach risk scorer (0–100) for all active orders.
  - `generateShiftHandoffSummary` — End-of-shift operational intelligence briefing generator.
  - `calculateSurgePrice` — Supply/demand surge multiplier engine (hard-capped at 1.5×).
- **`src/components/admin/ExecutiveDashboard.tsx`** — Full BI dashboard: KPI cards with sparklines, order status donut chart, revenue-by-category bar chart, specialist performance bars, SLA risk monitor table, surge pricing panel, shift handoff briefing. CSV export button.
- **`src/components/customer/AiConcierge.tsx`** (rewritten) — Photo upload via `<input type="file">`, Gemini Vision diagnosis card with severity badge, typing indicator, chat scroll-to-bottom.
- **`src/components/admin/AiAdminCopilot.tsx`** (rewritten) — 3-tab panel: AI Chat | SLA Monitor (expandable risk cards with progress bars) | Shift Briefing (stat grid + flagged issues).
- **`src/components/admin/AdminPortal.tsx`** — Executive BI Dashboard added to sidebar nav.

---

## [2.1.0] — 2026-09-09 — Phase 4: Payments & Communications

### Added
- **`src/services/paymentService.ts`** — Stripe simulation: Luhn validation, `createPaymentIntent`, `confirmPayment` (test card logic), `refundPayment`, `formatCardNumber`, `maskCardNumber`.
- **`src/components/customer/BookingModal.tsx`** (rewritten) — 2-step booking flow (Schedule → Payment). Stripe-style card form with real-time field formatting, validation errors, processing/confirmed state screens.
- **`src/services/notificationService.ts`** — Multi-channel notification pipeline: SMS (Twilio), Email (SendGrid), Push (FCM). Templates for all 7 lifecycle triggers. `sendOtpVerification` helper.
- **`server/src/routes/webhookRoutes.ts`** — Stripe webhook handler: `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`. SSE broadcast on payment events.
- **`server/src/db/database.ts`** — `updateOrderPaymentStatus(orderId, status)` method added.
- **`src/types.ts`** — `StripeCardDetails`, `StripePaymentIntent`, `StripeWebhookEvent`, `NotificationRecord`, `NotificationChannel`, `NotificationTrigger` types added.
- **`.env.example`** — Full secrets reference for Stripe, Twilio, SendGrid, FCM, Redis, PostgreSQL, JWT.

---

## [2.0.1] — 2026-09-09 — Phase 3: Real-Time Event Bus & Telemetry

### Added
- **`src/hooks/useOrderSocket.ts`** — `useOrderSocket` base hook + `useOrderTracking` and `useDispatchBoard` convenience wrappers. Named SSE event listeners, exponential backoff auto-reconnect.
- **`src/components/customer/LiveMapView.tsx`** — SVG canvas animated map: smooth CSS-transition vehicle marker, GPS trail polyline, live SSE telemetry subscription, simulation fallback, telemetry bar (ETA / distance / speed).
- **`server/src/services/proximityEngine.ts`** — Re-exports Haversine engine from `dispatchEngine.ts`; adds `filterSpecialistsByRadius`, `calcEtaMinutes`, `isInsideServiceZone`.
- **`server/src/routes/orderRoutes.ts`** — SSE broadcasts on order create, status update, and specialist assignment. `/score-specialists` endpoint.
- **`server/src/routes/specialistRoutes.ts`** — SSE broadcast on specialist status update.

---

## [2.0.0] — 2026-Q2 — Phase 2: Production Backend, DB & Auth Engine

### Added
- Express/Node.js backend in `server/` with modular routing, CORS, auth middleware.
- PostgreSQL schema `server/src/db/schema.sql`.
- In-memory transactional repository `server/src/db/database.ts` with FSM validation.
- RBAC auth middleware (`server/src/middleware/auth.ts`).
- Full REST API: services, orders, specialists, audit logs, users, auth.
- Typed frontend API client `src/api/client.ts`.

---

## [1.0.0] — 2026-03-15 — Phase 1: Dual-Surface Core & Prototype

### Added
- Customer mobile app with service catalog, booking modal, order tracking, AI concierge, digital wallet.
- Admin dispatch center with Kanban board, specialist allocator, catalog manager, CRM, audit logs, AI copilot.
- Synchronized dual split view + interactive architecture/PRD viewer.
- Gemini AI service with heuristic offline fallback.
- Full strict TypeScript domain types in `src/types.ts`.
