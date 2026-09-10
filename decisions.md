# Architecture Decision Records (ADRs) — OmniFlow Platform

This document serves as the persistent record of all significant architectural, technical, and product decisions for the **OmniFlow Platform (Customer App & Admin Portal)**. Every team member and AI coding assistant must consult and update this document when proposing or making architectural modifications.

---

## ADR Index

| ADR ID | Decision Title | Date | Status | Impact Area |
| :--- | :--- | :--- | :--- | :--- |
| [ADR-001](#adr-001-adoption-of-react-19-typescript-and-vite) | Adoption of React 19, TypeScript, and Vite | 2026-01-15 | **Accepted** | Core Architecture / Tooling |
| [ADR-002](#adr-002-tailwind-css-v4-and-motion-for-styling-and-micro-interactions) | Tailwind CSS v4 and Motion for Styling & Micro-interactions | 2026-01-18 | **Accepted** | UI / UX Design System |
| [ADR-003](#adr-003-unified-synchronized-state-management-via-react-context-and-localstorage) | Unified Synchronized State via React Context & LocalStorage | 2026-01-25 | **Accepted** | State Management / Data Persistence |
| [ADR-004](#adr-004-dual-surface-synchronization-architecture-mobile-frame--admin-portal) | Dual-Surface Architecture (Mobile Frame & Admin Cockpit) | 2026-02-02 | **Accepted** | Product Architecture / Layout |
| [ADR-005](#adr-005-deterministic-finite-state-machine-fsm-for-order-dispatch-lifecycle) | Deterministic Finite State Machine (FSM) for Order Lifecycle | 2026-02-10 | **Accepted** | Domain Logic / Dispatch Engine |
| [ADR-006](#adr-006-dual-surface-gemini-ai-sdk-integration-customer-concierge--ops-copilot) | Dual-Surface Gemini AI Integration (Concierge & Copilot) | 2026-02-20 | **Accepted** | AI Services / NLP Hub |
| [ADR-007](#adr-007-immutable-audit-logging-and-authoritative-role-switching-rbac) | Immutable Audit Logging and Authoritative Role Switching (RBAC) | 2026-02-28 | **Accepted** | Security / Compliance |
| [ADR-008](#adr-008-modular-component-directory-boundaries-customer-vs-admin-isolation) | Modular Directory Boundaries (Customer vs. Admin Isolation) | 2026-03-05 | **Accepted** | Codebase Architecture / Maintainability |

---

## ADR Template

When documenting a new decision, duplicate and fill out the template below:

```markdown
### ADR-XXX: [Decision Title]

- **Date**: YYYY-MM-DD
- **Status**: [Proposed | Accepted | Superseded | Deprecated]
- **Context / Problem**: What problem are we trying to solve? What constraints exist?
- **Decision Taken**: What is the specific decision, pattern, or technology chosen?
- **Reasoning**: Why is this approach superior? How does it address the problem?
- **Alternatives Considered**: What other options were evaluated and why were they rejected?
  - *Alternative 1*: Description + Reason for rejection
  - *Alternative 2*: Description + Reason for rejection
- **Impact on Project**:
  - Positive consequences (benefits, velocity, reliability)
  - Negative consequences / trade-offs (complexity, bundle size, migrations)
```

---

## Documented Decisions

### ADR-001: Adoption of React 19, TypeScript, and Vite

- **Date**: 2026-01-15
- **Status**: **Accepted**
- **Context / Problem**: The platform requires a lightning-fast development cycle, high-fidelity type safety across complex domain models (orders, specialists, telemetry, audit logs), and modern rendering capabilities for a dual-view interface.
- **Decision Taken**: Standardize on **React 19** (`react@^19.0.1`), **TypeScript ~5.8.2** with strict typing enabled, and **Vite 6** (`vite@^6.2.3`) as the bundler and development server.
- **Reasoning**:
  - Vite offers near-instant Hot Module Replacement (HMR) and lightweight ES module bundling.
  - React 19 provides state transitions, improved ref handling, and long-term compatibility.
  - Strict TypeScript prevents runtime errors when synchronizing complex state between customer and admin components.
- **Alternatives Considered**:
  - *Next.js (App Router)*: Rejected due to unnecessary SSR complexity for a dual-surface demo dashboard and specific hosting environment constraints in AI Studio sandbox.
  - *Create React App (CRA)*: Deprecated and slow; unacceptable build performance.
- **Impact on Project**:
  - Sub-second hot reload during development.
  - Zero tolerance for untyped JavaScript; compile-time guarantees for all order and role payloads.

---

### ADR-002: Tailwind CSS v4 and Motion for Styling and Micro-Interactions

- **Date**: 2026-01-18
- **Status**: **Accepted**
- **Context / Problem**: The platform requires a dark-mode-first aesthetic with high density for the admin cockpit and modern mobile glassmorphism for the customer app, plus fluid micro-interactions for order status transitions.
- **Decision Taken**: Use **Tailwind CSS v4** (`@tailwindcss/vite`, `tailwindcss@^4.1.14`) paired with **Motion** (`motion@^12.23.24`) for physics-based layout animations and transitions.
- **Reasoning**:
  - Tailwind v4 eliminates complex PostCSS configurations via native Vite integration.
  - Utility-first approach ensures design tokens (slate-900 backdrops, indigo accents, emerald status indicators) are uniformly applied.
  - Motion enables smooth layout transitions (animating order cards between status stages, expandable drawer menus).
- **Alternatives Considered**:
  - *Vanilla CSS Modules*: High maintenance overhead and slower developer velocity.
  - *Chakra UI / Material UI*: High runtime style-injection overhead; difficult to achieve custom futuristic glassmorphic aesthetics.
- **Impact on Project**:
  - Fast styling velocity with zero stylesheet bloat.
  - Consistent visual theme across all four surfaces (Customer, Admin, Dual View, Architecture).

---

### ADR-003: Unified Synchronized State Management via React Context and LocalStorage

- **Date**: 2026-01-25
- **Status**: **Accepted**
- **Context / Problem**: OmniFlow demonstrates real-time dispatch synchronization. When a user books a service in the Customer App, the Admin Dispatch Center must immediately reflect the incoming order without page reloads. Changes must persist across browser refreshes during demonstrations.
- **Decision Taken**: Implement a centralized `PlatformContext` (`src/context/PlatformContext.tsx`) that acts as an in-memory event bus and persists snapshots to browser `localStorage` (`omniflow_services`, `omniflow_orders`, `omniflow_specialists`, `omniflow_audit_logs`).
- **Reasoning**:
  - Avoids heavyweight external message broker setup (Kafka, RabbitMQ) during frontend demonstration phase while preserving realistic event-driven semantics.
  - Allows single-source-of-truth mutations that immediately broadcast to both mobile and desktop views.
  - Built-in reset functionality (`resetAllData`) provides reliable test repeatability.
- **Alternatives Considered**:
  - *Redux Toolkit*: Over-engineered boilerplate for current scope; Context API suffices for co-located components.
  - *Zustand*: Viable alternative, but native React Context provides zero external dependencies and straightforward integration with React 19.
- **Impact on Project**:
  - Sub-millisecond state propagation between customer mobile screen and admin dispatch board.
  - Persistence across reloads with simple reset switches for user testing.

---

### ADR-004: Dual-Surface Synchronization Architecture (Mobile Frame + Admin Portal)

- **Date**: 2026-02-02
- **Status**: **Accepted**
- **Context / Problem**: Demonstrating on-demand dispatch workflows normally requires opening two separate browsers or devices. Stakeholders need to observe the end-to-end customer booking and dispatcher response simultaneously on a single monitor.
- **Decision Taken**: Build a dedicated **Dual Split View** (`src/components/dual/DualSplitView.tsx`) alongside dedicated standalone views (`customer_app`, `admin_portal`, `architecture_prd`). The mobile app is rendered inside an interactive phone mockup with an optional framing toggle (`isPhoneFramed`).
- **Reasoning**:
  - Provides a single-screen executive demonstration of the entire platform value proposition.
  - Allows simultaneous inspection of customer order tracking progress bars and admin status override buttons.
- **Alternatives Considered**:
  - *Two distinct web repositories/domains*: High deployment friction and makes real-time local state synchronization complex without a live WebSocket server.
  - *Standard responsive layout collapsing*: Fails to show both interfaces at the same time.
- **Impact on Project**:
  - High demonstration impact for executives and engineers.
  - View switcher in global header enables switching between split and isolated full-screen views.

---

### ADR-005: Deterministic Finite State Machine (FSM) for Order Dispatch Lifecycle

- **Date**: 2026-02-10
- **Status**: **Accepted**
- **Context / Problem**: Service orders have strict operational rules. An order cannot jump directly from `pending` to `completed` without technician assignment and progress execution. Invalid state changes cause data corruption and customer confusion.
- **Decision Taken**: Enforce a strict Finite State Machine (FSM) for order progression:
  $$\text{Pending} \longrightarrow \text{Confirmed} \longrightarrow \text{Assigned} \longrightarrow \text{In Progress} \longrightarrow \text{Completed}$$
  *(Cancellation is permitted only from `Pending` or `Confirmed`).*
- **Reasoning**:
  - Guarantees data integrity across both customer-facing and internal dispatch operations.
  - Automatically calculates timeline milestones (`timeline: OrderTimelineEvent[]`) and step progress percentage (`0%` -> `25%` -> `50%` -> `75%` -> `100%`).
  - Technician status transitions automatically (`available` -> `on_route` -> `in_service` -> `available`).
- **Alternatives Considered**:
  - *Unconstrained status string update*: Prone to race conditions and invalid transitions.
- **Impact on Project**:
  - Zero invalid order states.
  - Automatic audit trail generated on every state transition.

---

### ADR-006: Dual-Surface Gemini AI SDK Integration (Customer Concierge & Ops Copilot)

- **Date**: 2026-02-20
- **Status**: **Accepted**
- **Context / Problem**: Both customers and dispatchers require contextual intelligence: customers need intent-based service recommendations and cost estimation, while dispatchers need fleet bottleneck alerts and capacity analysis.
- **Decision Taken**: Integrate `@google/genai` (Gemini SDK) with dual specialized personas:
  1. **AI Concierge (`AiConcierge.tsx`)**: Customer-facing conversational assistant with curated quick prompts, automatic service catalog matching, and direct booking modal triggers.
  2. **AI Admin Co-Pilot (`AiAdminCopilot.tsx`)**: Dispatch-facing operational intelligence analyzing specialist utilization, pending bottlenecks, and SLA compliance.
- **Reasoning**:
  - Leverages Google Gemini models for fast, grounded, conversational assistance.
  - Provides fallback heuristics so the application functions seamlessly even when offline or in development environments without active API keys.
- **Alternatives Considered**:
  - *Static FAQ chatbot*: Inflexible; cannot parse nuanced user requests or recommend specific catalog items.
  - *Single shared chatbot*: Confuses customer support questions with sensitive operational metrics.
- **Impact on Project**:
  - Differentiated AI experiences tailored to specific persona workflows.
  - Safe fallback mechanisms when `GEMINI_API_KEY` is not supplied.

---

### ADR-007: Immutable Audit Logging and Authoritative Role Switching (RBAC)

- **Date**: 2026-02-28
- **Status**: **Accepted**
- **Context / Problem**: In enterprise operations, compliance and accountability require tracking every administrative status override, specialist assignment, and pricing alteration. Additionally, different staff members have different operational authorities.
- **Decision Taken**: Implement role-based governance with three distinct authoritative roles (`super_admin`, `ops_manager`, `support_lead`) and an immutable chronological audit ledger (`AuditLogView.tsx`) tracking actor role, actor name, action, timestamp, and order references.
- **Reasoning**:
  - Simulates enterprise RBAC and compliance standards required by enterprise on-demand logistics platforms.
  - Role switcher in the global header allows instant testing of permission boundaries.
- **Alternatives Considered**:
  - *Ephemeral console logging*: Zero UI visibility for auditors or stakeholders.
  - *Hardcoded static role*: Inflexible for demonstrating multi-persona workflows.
- **Impact on Project**:
  - Complete operational transparency. Every dispatch update produces an audit entry.

---

### ADR-008: Modular Component Directory Boundaries (Customer vs. Admin Isolation)

- **Date**: 2026-03-05
- **Status**: **Accepted**
- **Context / Problem**: As the codebase expands, mixing customer-facing mobile components with admin-facing desktop components leads to tight coupling, circular imports, and difficulty in extracting services into micro-frontends later.
- **Decision Taken**: Establish strict directory boundaries:
  - `src/components/customer/`: Components dedicated to the customer mobile view.
  - `src/components/admin/`: Components dedicated to the administrative desktop cockpit.
  - `src/components/common/`: Shared cross-surface primitives (Header, Toast, Badges).
  - `src/components/dual/`: Layout composition for the synchronized side-by-side view.
  - `src/components/architecture/`: Interactive system blueprint and PRD viewer.
- **Reasoning**:
  - Prevents unintended code leaks between customer and admin interfaces.
  - Simplifies future migration to standalone repositories or micro-frontends.
- **Alternatives Considered**:
  - *Flat components directory*: Leads to name clashes and spaghetti dependencies.
- **Impact on Project**:
  - Clean modularity and clear ownership for future feature additions.
