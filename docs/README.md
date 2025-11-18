# Documentation Index

Welcome to the cryptocurrency trading platform documentation. This folder contains comprehensive guides for building the new platform from scratch.

---

## 📚 Documentation Files

### 1. [NEW_PROJECT_STRUCTURE.md](../NEW_PROJECT_STRUCTURE.md)
**The Master Blueprint** - 2,661 lines of comprehensive guidance

**Contains:**
- Complete technology stack recommendations
- Detailed monorepo project structure
- Core architecture patterns (data flow, state management, service layers)
- Full implementation guides for 4 core features:
  - OnRamp Flow (Fiat-to-Crypto)
  - Crypto Swap (0x Protocol)
  - Trading Components (Chart, OrderBook, Panel)
  - Theme System
- Complete database schema design
- Security implementation patterns
- Testing strategy (unit, integration, E2E)
- Deployment strategy (Docker, CI/CD)
- 9-week development roadmap

**Start here** to understand the overall project vision and architecture.

---

### 2. [ARCHITECTURE_DECISIONS.md](./ARCHITECTURE_DECISIONS.md)
**Architecture Decision Records** - 15 key decisions explained

**Contains:**
- ADR-001: Monorepo Structure (Why PNPM workspaces)
- ADR-002: React Query for Server State
- ADR-003: Drizzle ORM over Prisma
- ADR-004: Feature-Based Frontend Structure
- ADR-005: Viem + Wagmi for Web3
- ADR-006: WebSocket Context for Real-Time Data
- ADR-007: 0x Protocol for DEX Aggregation
- ADR-008: OnRamp Money for Fiat Onboarding
- ADR-009: Groq API for AI Trading Features
- ADR-010: TailwindCSS for Styling
- ADR-011: JWT for Authentication
- ADR-012: PostgreSQL as Primary Database
- ADR-013: Express.js for Backend Framework
- ADR-014: Service Layer Pattern
- ADR-015: Zod for Runtime Validation

Each ADR includes:
- Decision made
- Context and rationale
- Alternatives considered
- Consequences

**Use this** to understand WHY specific technologies and patterns were chosen.

---

### 3. [GETTING_STARTED.md](./GETTING_STARTED.md)
**Developer Setup Guide** - Step-by-step instructions

**Contains:**
- Prerequisites and installation
- Project initialization (monorepo setup)
- Frontend setup (Vite + React + TypeScript + Tailwind)
- Backend setup (Express + TypeScript + Drizzle)
- Database configuration (PostgreSQL + Drizzle ORM)
- Environment variable setup
- Running the project (dev mode)
- Development workflow
- Useful PNPM commands
- Troubleshooting common issues
- Resources and links

**Use this** to set up your development environment and start coding.

---

### 4. [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md)
**270-Task Implementation Guide** - Track your progress

**Contains:**
- **Phase 1: Foundation** (60 tasks)
  - Project setup, frontend/backend foundation
  - Database setup, authentication
  - Base UI components, routing

- **Phase 2: Core Trading** (45 tasks)
  - Trading schema, market data integration
  - Chart, order book, trading panel
  - Order execution, portfolio tracking

- **Phase 3: Swap Integration** (30 tasks)
  - 0x Protocol integration
  - OnRamp Money integration
  - Swap UI and token management

- **Phase 4: AI Features** (28 tasks)
  - Groq API integration
  - Signal generation, market analysis
  - Portfolio optimization, AI assistant UI

- **Phase 5: Theme & Polish** (32 tasks)
  - Theme system, animations
  - Mobile responsiveness, performance
  - Accessibility, error handling

- **Phase 6: Testing & Security** (35 tasks)
  - Unit tests (frontend + backend)
  - Integration tests, E2E tests
  - Security audit, code quality

- **Phase 7: Deployment** (40 tasks)
  - CI/CD pipeline, frontend/backend deployment
  - Monitoring, documentation, go live

**Use this** to track your implementation progress week by week.

---

### 5. [TECH_STACK.md](./TECH_STACK.md)
**Complete Technology Stack Reference** - Detailed library choices

**Contains:**
- **Frontend Stack:** React, TypeScript, Vite, Tailwind CSS
- **Chart Libraries:** TradingView Lightweight Charts (candlesticks), Recharts (portfolio), Chart.js (dashboards), D3 (custom)
- **Backend Stack:** Express, Drizzle ORM, PostgreSQL, Socket.io
- **Web3 Integration:** Viem, Wagmi, 0x Protocol
- **Payment Providers:** Stripe, OnRamp Money, NowPayments, ChangeNow
- **AI Services:** Groq API, Anthropic Claude
- **External APIs:** CoinGecko, Hyperliquid
- **Implementation Examples:** Complete code snippets for each technology
- **Best Practices:** Do's and don'ts for frontend, backend, and security
- **Quick Reference:** Chart library decision matrix, API priority levels

**Use this** when you need to know which specific library to use for a feature (e.g., "Which charting library for candlesticks?") and how to implement it.

---

### 6. [SYSTEM_DESIGN_AND_SECURITY.md](./SYSTEM_DESIGN_AND_SECURITY.md)
**Production-Ready System Design & Security Patterns** - Critical implementation guide

**Contains:**
- **Architectural Implications:** Non-custodial design, Hyperliquid, 0x, OnRamp Money tradeoffs
- **Integration Flows:** Complete message flows for trading, swaps, and fiat on-ramp
- **Concrete Examples:** Order execution flow, swap flow, OnRamp flow with sequence diagrams
- **Failure Modes:** API downtime, quote staleness, webhook failures, relayer compromise, MEV/front-running, DB/chain divergence
- **Mitigation Strategies:** Circuit breakers, fallback routing, reconciliation, idempotency
- **Security Patterns:** SIWE authentication, nonce management, EIP-712 signatures, KMS key management, multisig cold storage
- **Operational Requirements:** Rate limiting, fraud detection, observability, alerting, blockchain watchers
- **Implementation Checklist:** Phase-by-phase security and operational tasks

**Use this** for understanding HOW to build secure, resilient systems and WHAT TO WATCH OUT FOR in production (security vulnerabilities, failure scenarios, operational requirements).

---

## 🗺️ Documentation Map

```
Start Here
    ↓
NEW_PROJECT_STRUCTURE.md ←───────────── Read this first for big picture
    ↓
ARCHITECTURE_DECISIONS.md ←──────────── Understand the WHY behind choices
    ↓
TECH_STACK.md ←──────────────────────── Learn WHAT libraries to use
    ↓
SYSTEM_DESIGN_AND_SECURITY.md ←──────── Learn HOW to build securely (CRITICAL!)
    ↓
GETTING_STARTED.md ←─────────────────── Set up your dev environment
    ↓
IMPLEMENTATION_CHECKLIST.md ←────────── Follow the 9-week roadmap
    ↓
Build Features! 🚀
```

---

## 📖 How to Use This Documentation

### For Project Managers
1. Review **NEW_PROJECT_STRUCTURE.md** - Understand scope and timeline
2. **Review SYSTEM_DESIGN_AND_SECURITY.md** - Understand security requirements and risks
3. Use **IMPLEMENTATION_CHECKLIST.md** - Track team progress
4. Reference **ARCHITECTURE_DECISIONS.md** - Understand technical choices

### For Developers (New to Project)
1. Read **ARCHITECTURE_DECISIONS.md** - Understand technical foundation
2. Review **TECH_STACK.md** - Know which libraries to use for each feature
3. **Study SYSTEM_DESIGN_AND_SECURITY.md** - Learn security patterns and failure modes (REQUIRED)
4. Follow **GETTING_STARTED.md** - Set up your environment
5. Reference **NEW_PROJECT_STRUCTURE.md** - See implementation examples
6. Use **IMPLEMENTATION_CHECKLIST.md** - Know what to build next

### For Architects/Tech Leads
1. Study **ARCHITECTURE_DECISIONS.md** - Review all technical decisions
2. Review **TECH_STACK.md** - Validate library and API choices
3. **Review SYSTEM_DESIGN_AND_SECURITY.md** - Validate security architecture (CRITICAL)
4. Review **NEW_PROJECT_STRUCTURE.md** - Validate architecture patterns
5. Add new ADRs as decisions are made
6. Update checklist with new requirements

---

## 🎯 Quick Reference

### Key Technologies

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- React Query (server state)
- Wagmi + Viem (Web3)
- TradingView Lightweight Charts

**Backend:**
- Node.js 20 + TypeScript
- Express.js (framework)
- Drizzle ORM (database)
- PostgreSQL (database)
- Socket.io (WebSocket)
- Zod (validation)

**External APIs:**
- 0x Protocol (DEX aggregation)
- OnRamp Money (fiat onboarding)
- Groq API (AI features)
- Stripe (payments)

### Important Patterns

1. **Feature-based structure** - Organize code by feature, not by type
2. **Service layer** - Business logic separated from routes
3. **React Query** - Server state with automatic caching
4. **WebSocket Context** - Shared real-time data via context
5. **Zod validation** - Type-safe validation on both client/server

---

## 🔄 Keeping Documentation Updated

As you build the platform:

1. **Update ADRs** when making new architectural decisions
2. **Update GETTING_STARTED.md** when setup process changes
3. **Check off tasks** in IMPLEMENTATION_CHECKLIST.md as you complete them
4. **Add examples** to NEW_PROJECT_STRUCTURE.md when implementing features
5. **Document issues** and their solutions in a new TROUBLESHOOTING.md

---

## 📝 Document Versions

| Document | Version | Last Updated |
|----------|---------|--------------|
| NEW_PROJECT_STRUCTURE.md | 1.0 | 2025-11-18 |
| ARCHITECTURE_DECISIONS.md | 1.0 | 2025-11-18 |
| TECH_STACK.md | 1.0 | 2025-11-18 |
| SYSTEM_DESIGN_AND_SECURITY.md | 1.0 | 2025-11-18 |
| GETTING_STARTED.md | 1.0 | 2025-11-18 |
| IMPLEMENTATION_CHECKLIST.md | 1.0 | 2025-11-18 |

---

## 🤝 Contributing to Documentation

When adding or updating documentation:

1. Follow the existing structure and format
2. Include code examples where helpful
3. Keep language clear and concise
4. Update this index when adding new docs
5. Version and date your changes

---

## 📞 Getting Help

If you have questions about:

- **Architecture** - Review ARCHITECTURE_DECISIONS.md
- **Technology choices** - Check TECH_STACK.md
- **Security patterns** - Review SYSTEM_DESIGN_AND_SECURITY.md (non-custodial, relayer security, reconciliation)
- **Failure scenarios** - See SYSTEM_DESIGN_AND_SECURITY.md failure modes section
- **Setup issues** - Check GETTING_STARTED.md troubleshooting section
- **Implementation details** - See NEW_PROJECT_STRUCTURE.md code examples
- **What to build next** - Consult IMPLEMENTATION_CHECKLIST.md

Still stuck? Check with the team or create an issue in the repository.

---

**Ready to start building?** Begin with [GETTING_STARTED.md](./GETTING_STARTED.md) 🚀
