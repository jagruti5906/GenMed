# Project Development Rules & AI Directives — OmniFlow Platform

This document contains the binding development rules, architectural constraints, and standards for the **OmniFlow Platform**. All AI coding assistants, automated agents, and software engineers working in this repository **must strictly comply** with these rules.

---

## Table of Contents

1. [The Golden Rule: Never Break Existing Functionality](#1-the-golden-rule-never-break-existing-functionality)
2. [Coding Standards](#2-coding-standards)
3. [Folder Structure & Architectural Boundaries](#3-folder-structure--architectural-boundaries)
4. [Naming Conventions](#4-naming-conventions)
5. [UI/UX Consistency Rules](#5-uiux-consistency-rules)
6. [Git Commit & Branching Rules](#6-git-commit--branching-rules)
7. [Security & Environment Variable Rules](#7-security--environment-variable-rules)
8. [AI Agent Behavioral Directives](#8-ai-agent-behavioral-directives)

---

## 1. The Golden Rule: Never Break Existing Functionality

> ### ⚠️ CRITICAL MANDATE: NEVER BREAK EXISTING FUNCTIONALITY
> Under no circumstances should an AI agent or developer delete, rewrite, or break existing working features, interfaces, or mock data structures unless the user explicitly commands it.
>
> - **Always preserve backwards compatibility**: Any modifications to `src/types.ts` or `src/mockData.ts` must maintain compatibility with existing components and stored `localStorage` schemas.
> - **Incremental enhancements only**: Build upon existing components instead of replacing them wholesale.
> - **Validate before concluding**: Check that all views (`dual_view`, `customer_app`, `admin_portal`, `architecture_prd`) continue to compile and render properly.
> - **Preserve comments and docstrings**: Never wipe out existing technical notes or design rationale.

---

## 2. Coding Standards

### 2.1 TypeScript Standards
- **Strict Typing Mandatory**: Every function parameter, return type, state variable, and prop must have an explicit TypeScript type.
- **Forbidden**: Never use `any` or `unknown` without an explicit, documented type guard.
- **Interfaces vs. Types**:
  - Use `interface` for object models, data entities, and React component props (e.g., `Order`, `ServiceItem`, `BookingModalProps`).
  - Use `type` for unions, primitives, tuples, and function signatures (e.g., `OrderStatus`, `ViewMode`, `AuthoritativeRole`).
- **Path Aliasing**: Use the configured path alias `@/` mapped to the project root when importing shared files if applicable, or clean relative paths.

```typescript
// ✅ CORRECT: Explicit typing, descriptive prop interface
interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true
}) => {
  // Implementation
};

// ❌ INCORRECT: Implicit any, untyped props
export const OrderStatusBadge = (props: any) => { ... };
```

### 2.2 React 19 Best Practices
- **Functional Components**: Write pure functional components using `React.FC<Props>` or standard typed function declarations.
- **State Management**: Access state via `usePlatform()` from `src/context/PlatformContext.tsx`. Do not create isolated shadow state that goes out of sync with other surfaces.
- **Hooks Hygiene**:
  - Adhere strictly to the Rules of Hooks (never call hooks inside conditions, loops, or nested functions).
  - Use appropriate dependency arrays in `useEffect`, `useCallback`, and `useMemo`.
- **Pure Rendering**: Avoid side-effects during render phase; all mutations or `localStorage` operations belong inside context action handlers or `useEffect`.

### 2.3 Styling Standards (Tailwind CSS v4)
- **Zero Inline Styles**: Do not use `style={{ ... }}` except for truly dynamic values calculated at runtime (e.g., dynamic width percentage: `style={{ width: `${progress}%` }}`).
- **Curated Theme Tokens**: Use Tailwind palette colors defined in the design system (`slate-*`, `indigo-*`, `emerald-*`, `amber-*`, `rose-*`).
- **Arbitrary Value Prohibition**: Avoid arbitrary one-off values (e.g., `text-[#38a169]`) when standard semantic utility tokens exist (`text-emerald-500`).

---

## 3. Folder Structure & Architectural Boundaries

The codebase enforces strict modular separation. Code must reside in its designated domain:

```
c:/Users/Jagruti/GenMed/
├── public/                     # Static assets and media files
│   └── assets/aistudio/        # AI Studio media plugin mount
├── src/
│   ├── components/
│   │   ├── admin/              # Widescreen Desktop Operations Cockpit
│   │   │   ├── AdminDashboard.tsx      # Overview metrics, charts, quick actions
│   │   │   ├── AdminPortal.tsx         # Main admin container & tab navigation
│   │   │   ├── AiAdminCopilot.tsx      # Dispatch optimization & anomaly detection
│   │   │   ├── AuditLogView.tsx        # Immutable system audit trail
│   │   │   ├── CatalogManager.tsx      # Service pricing & availability CRUD
│   │   │   ├── CustomerDirectory.tsx   # CRM directory & customer loyalty
│   │   │   └── OrderDispatchCenter.tsx # Interactive dispatch board & specialist allocator
│   │   ├── architecture/       # System Blueprint & PRD Documentation
│   │   │   └── ArchitectureAndPrdView.tsx # Interactive layer diagram & full PRD
│   │   ├── common/             # Shared Primitives Across All Surfaces
│   │   │   └── Header.tsx              # View switcher, role selector, theme branding
│   │   ├── customer/           # Mobile Phone App Experience
│   │   │   ├── AiConcierge.tsx         # Customer AI shopping & booking assistant
│   │   │   ├── BookingModal.tsx        # Date, time, payment, and address checkout
│   │   │   ├── CatalogView.tsx         # Category filters and service cards
│   │   │   ├── CustomerApp.tsx         # Main mobile container & tab bar
│   │   │   ├── CustomerProfile.tsx     # Wallet balance & order history
│   │   │   └── OrderTrackingView.tsx   # Real-time progress tracker & specialist telemetry
│   │   └── dual/               # Synchronized Split View
│   │       └── DualSplitView.tsx       # Side-by-side synchronized demonstration
│   ├── context/
│   │   └── PlatformContext.tsx # Centralized reactive state store & localStorage sync
│   ├── types.ts                # Authoritative TypeScript domain models & types
│   ├── mockData.ts             # Default mock datasets, initial state, architecture data
│   ├── index.css               # Tailwind CSS v4 directives
│   ├── App.tsx                 # Root application routing between ViewModes
│   └── main.tsx                # React DOM entry point
├── changelog.md                # Chronological history of project changes
├── decisions.md                # Architecture Decision Records (ADRs)
├── memory.md                   # Long-term persistent project memory & knowledge base
├── phases.md                   # Multi-phase engineering roadmap & delivery checklists
├── rules.md                    # Project development rules and AI constraints (THIS FILE)
├── package.json                # Dependencies and npm build scripts
├── tsconfig.json               # TypeScript compiler configuration
└── vite.config.ts              # Vite 6 bundler configuration
```

### Strict Boundary Directives
1. **No Admin Leakage in Customer Components**: Customer components in `src/components/customer/` must never import admin components or manipulate admin-only data structures.
2. **Context as the Only Bridge**: Communication between Customer and Admin surfaces must happen exclusively through `PlatformContext`.
3. **Types in `types.ts`**: All domain models must be defined in `src/types.ts`. Do not declare ad-hoc domain interfaces inside component files if they are shared across components.

---

## 4. Naming Conventions

Consistency in naming ensures fast codebase navigation for both humans and AI agents.

| Item Type | Convention | Examples |
| :--- | :--- | :--- |
| **React Components** | `PascalCase.tsx` | `OrderDispatchCenter.tsx`, `BookingModal.tsx` |
| **Utility / Helper Files** | `camelCase.ts` | `formatCurrency.ts`, `calculateEta.ts` |
| **Context Providers** | `PascalCase.tsx` | `PlatformContext.tsx` |
| **TypeScript Types & Interfaces**| `PascalCase` | `Order`, `ServiceItem`, `OrderStatus` |
| **Enum / Union Values** | `snake_case` (string unions) | `'in_progress'`, `'super_admin'`, `'credit_card'` |
| **Variables & Functions** | `camelCase` | `activeTrackingOrderId`, `handleStatusChange` |
| **Constants & Mock Defaults** | `UPPER_SNAKE_CASE` | `INITIAL_SERVICES`, `CURRENT_CUSTOMER` |
| **Event Handler Props** | `on[EventName]` | `onNavigateToTracking`, `onSelectService` |
| **Event Handler Functions** | `handle[Action]` | `handleSend`, `handleConfirmBooking` |
| **Boolean State Flags** | `is*`, `has*`, `can*` | `isPhoneFramed`, `isLoading`, `hasPermission` |

---

## 5. UI/UX Consistency Rules

OmniFlow adheres to a high-density, futuristic dark-mode design system. Any visual additions must match these design tokens:

### 5.1 Color Tokens & Semantics
- **Backdrop Canvas**: `bg-slate-900` (deep slate) with secondary panels at `bg-slate-800` or `bg-slate-800/80` (card surface).
- **Borders & Dividers**: `border-slate-700/80` or `border-slate-800`.
- **Primary Brand / Action**: `indigo-600` (hover: `indigo-500`, focus ring: `ring-indigo-500`).
- **Success & Confirmed**: `emerald-500` / `bg-emerald-500/10` / `text-emerald-400`.
- **Warning & Attention**: `amber-500` / `bg-amber-500/10` / `text-amber-400`.
- **Urgent / Danger / Cancelled**: `rose-500` / `bg-rose-500/10` / `text-rose-400`.
- **Informational**: `sky-500` / `bg-sky-500/10` / `text-sky-400`.

### 5.2 Component Anatomy & Layout
- **Rounded Corners**: Standardize on `rounded-xl` (12px) for cards and inputs, and `rounded-2xl` (16px) for major modal containers.
- **Glassmorphism**: Combine `backdrop-blur-md` with semi-transparent background colors (`bg-slate-800/90`) for sticky headers and floating navigation bars.
- **Typography**:
  - Headings: Bold or Extra Bold with tighter tracking (`font-black tracking-tight`).
  - Labels / Micro-copy: Uppercase with wide tracking (`text-[10px] font-bold uppercase tracking-wider text-slate-400`).
  - Numeric Values: Tabular figures where appropriate to prevent layout jitter.
- **Mobile Viewport Emulation**:
  - Customer app within the phone frame should simulate standard iOS/Android viewports (width constraint between `360px` and `420px`).
  - Minimum touch target for mobile buttons: `44px x 44px`.

### 5.3 Micro-interactions
- Use subtle hover states (`hover:bg-slate-700/60`, `transition-all duration-200`).
- Status changes in the order timeline should provide visual confirmation via toasts (`showToast`).

---

## 6. Git Commit & Branching Rules

When making commits, adhere strictly to the **Conventional Commits** specification:

### 6.1 Format
```
<type>(<optional scope>): <description>

[optional body]

[optional footer(s)]
```

### 6.2 Allowed Types
- `feat`: A new feature or capability (e.g., `feat(customer): add coupon code deduction in booking modal`).
- `fix`: A bug fix (e.g., `fix(dispatch): prevent invalid order transition from pending to completed`).
- `refactor`: Code restructuring without changing observable behavior.
- `style`: Formatting, whitespace, or UI visual polish without logic change.
- `docs`: Documentation updates (e.g., `docs: update memory.md and decisions.md`).
- `chore`: Build config, dependencies, or tool updates.
- `perf`: Performance optimizations.
- `test`: Adding or updating test cases.

### 6.3 Branch Naming Conventions
- `feature/<short-description>`: e.g., `feature/live-telemetry-map`
- `bugfix/<issue-description>`: e.g., `bugfix/order-counter-desync`
- `refactor/<scope>`: e.g., `refactor/context-dispatch-actions`
- `docs/<document-name>`: e.g., `docs/adr-order-state-machine`

---

## 7. Security & Environment Variable Rules

### 7.1 Secret Management
- **Never Commit Secrets**: Never commit real API keys, credentials, private keys, or passwords to Git.
- **Environment Isolation**:
  - Variables meant for the client browser must be explicitly documented and prefixed according to Vite standards if exposed.
  - Server-side secrets (like raw Google Gemini API keys in production) must remain on server-side runtime environments or be injected via secure platform secret managers.
- **Maintain `.env.example`**: Any newly added environment variable must be documented with a placeholder and purpose in `.env.example`.

### 7.2 Data Sanitization & RBAC
- **No Unsanitized HTML**: Never use `dangerouslySetInnerHTML` unless rendering trusted, pre-sanitized markdown.
- **Role Enforcement**: UI actions restricted by role (e.g., catalog price edits or order status overrides) must check `authoritativeRole` before executing.
- **LocalStorage Data Validation**: When reading from `localStorage`, wrap `JSON.parse` in a try-catch block and fall back gracefully to `INITIAL_*` mock datasets if parsing fails or data is corrupted.

---

## 8. AI Agent Behavioral Directives

When interacting with this codebase as an AI agent:

1. **Review Context First**: Always inspect `memory.md`, `decisions.md`, and `rules.md` before modifying features or proposing architectures.
2. **Update Persistent Memory**: When adding a feature or refactoring, update `memory.md` (features completed / pending) and `changelog.md` (version log).
3. **Document Decisions**: If you introduce an architectural change or new library, add an ADR entry in `decisions.md`.
4. **Be Concise & Actionable**: Provide complete, working code modifications rather than ambiguous placeholders or comments like `// TODO: Implement later`.
5. **Preserve User Workflow**: Respect existing user preferences (e.g., dark theme default, selected view modes, mock datasets).
