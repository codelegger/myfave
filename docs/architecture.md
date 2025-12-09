# MyFave POC Architecture Guide

This document explains how the current project structure supports the MyFave clone initiative, how the architecture scales, and the conventions we will use as we add more product surfaces (deals, payments, rewards, partner promos, etc.).

---

## 1. Why This Stack Fits the Fave App

- **Next.js 16 App Router** – Server Components keep the marketing pages fast while still letting us stream dynamic data (e.g., personalized deals, wallet balances). Incremental Static Regeneration (ISR) can cache popular pages while letting long-tail routes revalidate on demand.
- **React 19** – Latest concurrent features (transitions, streaming) help us build fluid mobile-like UX without sacrificing CSR interactivity.
- **Contract-based data layer** – The `src/data` package isolates API integration details behind repositories + DTOs. That keeps UI code simple, makes swapping mock services for real partner APIs feasible, and opens the door to sharing contracts across web/app clients.
- **pnpm + workspace hygiene** – Fast, deterministic installs, and support for future packages (e.g., `packages/design-system`, `packages/services`) when we break the app into smaller modules.
- **Tooling baked in** – Vitest, Playwright, ESLint, Prettier, Husky are already configured. QA automation grows as the app grows.

---

## 2. Current Route & Layout Map

```
┌────────────┐
│  /(layout) │  Root shell (fonts, theming, global providers)
└─────┬──────┘
      │
      ├── "/"                   → Landing placeholder (upcoming marketing hero)
      └── "/products"           → Product listing
           └── "/products/[id]" → Product detail (server-rendered, cached)
```

As we add new experiences, each feature will live in its own route segment (e.g., `/deals`, `/pay`, `/rewards`, `/profile`). Shared UI (nav bar, header, footer) belongs inside `src/app/(marketing)/layout.tsx` or `src/app/(app-shell)/layout.tsx` depending on the section.

---

## 3. Directory Layout Cheatsheet

```text
src/
├── app/                     # Route segments (App Router)
│   ├── layout.tsx           # Root layout, fonts, global providers
│   ├── page.tsx             # Landing page entry
│   └── products/            # Products feature vertical
│       ├── page.tsx
│       └── [id]/page.tsx
│
├── components/              # Reusable UI building blocks
│   └── ui/button.tsx
│
├── data/                    # Contract-based data layer
│   ├── api/                 # Raw HTTP clients (fetch + zod parsing)
│   ├── dtos/                # Shape exposed to components
│   ├── repositories/        # Main access point (cached)
│   ├── schemas/             # zod validation schemas (io contracts)
│   └── utils/               # Shared helpers (api client, errors)
│
└── lib/                     # Feature-agnostic utilities
```

**Key convention:** UI code imports exclusively from `@/data` (root barrel). Internal services stay hidden behind repository methods. This keeps UI pure and lets us swap the backend without touching components.

---

## 4. Data Flow Overview

```mermaid
flowchart LR
    UI[Server Component / Route Handler] -->|calls| Repo[Repository]
    Repo -->|delegates| APIService[ProductApi]
    APIService -->|fetches| HTTP[(External API\n(e.g., Deals Service))]
    HTTP --> APIService
    APIService -->|zod-validated DTOs| Repo
    Repo -->|returns DTOs| UI
```

Next.js `cache()` in the repository and API layers deduplicates calls during a request and keeps server render latency predictable. When we add client components that need live updates, we can layer SWR/React Query on top of the same repositories.

---

## 5. Growth Plan

### 5.1 Short Term (MVP parity)
- Flesh out landing page (`/`) with marketing sections, city selector, partner promos.
- Extend `src/app/products` into `src/app/deals` with category filters, search, and pagination.
- Introduce `src/app/(auth)/login` + `@/lib/auth` for session support and guard protected routes.
- Replace JSONPlaceholder with our actual Deals API. Keep API responses normalized in DTOs.

### 5.2 Mid Term (Feature verticals)
- **Payments (`/pay`)** – separate route group with wallet balance, QR scanning, voucher redemption. Add `@/data/payments` package mirroring the product repository pattern.
- **Rewards (`/rewards`)** – track cashback history, loyalty perks. Consider a cross-feature `@/components/rewards` for badges, progress bars.
- **Partner onboarding (`/partners`)** – marketing + dashboard stub, likely another route group with its own layout.
- **Design System package** – promote `src/components/ui` into `packages/ui` once we accumulate buttons, cards, modals, bottom tabs.
- **Global state** – introduce React Server Actions or tRPC proxy to share sessions and wallet data between routes without prop drilling.

### 5.3 Long Term (Scale & Ops)
- Set up ISR caching rules per route (e.g., deals refresh every 10 minutes, wallet routes disabled for static generation).
- Add feature flags (ConfigCat/LaunchDarkly) to gate new deal types or payment providers.
- Break the data layer into domain-specific services (`@/data/deals`, `@/data/wallet`, `@/data/users`) so squads can own modules independently.
- Instrument logging/metrics (OpenTelemetry) and error boundaries around critical flows (checkout, payment confirmation).

---

## 6. Adding New Routes: Recipe

1. **Create route segment** under `src/app/<segment>` with its own `layout.tsx` if it needs custom chrome.
2. **Add page component** using Server Components when possible. For client-side features, create a `Client` component wrapped in `use client`.
3. **Expose repository method** (e.g., `walletRepository.getBalance`) inside `src/data/<domain>`.
4. **Consume DTOs** inside the page by importing from `@/data`. Avoid importing schemas or API clients directly.
5. **Write tests** – component test in `src/app/<segment>/page.test.tsx` and E2E script in `e2e/<segment>.spec.ts`.
6. **Document route** by updating this guide (Route Map section) so new team members stay in sync.

---

## 7. Testing & Quality Gates

- **Unit / component** – Vitest + Testing Library (`pnpm test`). Add snapshots for marketing blocks and behavior tests for interactive widgets.
- **E2E** – Playwright scripts live in `e2e/`. Expand coverage to include browsing deals, applying vouchers, checking out.
- **Lint & format** – `pnpm lint`, `pnpm format`. Husky hooks will enforce this once the repo runs inside Git.
- **CI** – `.github/workflows` already contains CI scaffolding; plug it into GitHub Actions to run lint, unit, and E2E on PRs.

---

## 8. Deployment Strategy

- **Preview** – Vercel is the easiest path for feature branches; zero-config for Next.js App Router.
- **Production** – For payments, ensure PCI compliance. The same Next.js build can run on Vercel, AWS (Lambda@Edge), or containerized with `pnpm build && pnpm start`.
- **Static marketing** – Long-lived marketing content can use ISR or even export to static hosting, while dynamic routes (payments, rewards) stay server-rendered.

---

## 9. Next Steps Checklist

- [ ] Replace mock data with real Deals API integration.
- [ ] Define `/deals` route group + layout.
- [ ] Stand up authentication provider.
- [ ] Add component library guidelines (tokens, spacing scale).
- [ ] Hook up CI workflows to the GitHub repo.
- [ ] Update diagrams as new verticals launch.

This guide should evolve as the product matures. Keep it close whenever we plan new features or onboard teammates.

