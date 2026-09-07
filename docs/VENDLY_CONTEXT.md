# VENDLY PROJECT CONSTITUTION

## 1. Product Vision

Vendly is a secure, escrow-based marketplace platform designed for the Nigerian market. It solves the trust deficit in peer-to-peer commerce by holding funds securely until the buyer confirms receipt and satisfaction of the product.

## 2. Core User Journeys

- **Buyer:** Browse -> Select Product -> Fund Escrow -> Confirm Delivery -> Release Funds.
- **Seller:** Create Listing -> Receive Order -> Ship/Deliver -> Receive Funds.
- **Verification (KYC):** Sign Up -> Tier 1 (NIN, ₦50k limit) OR Tier 2 (BVN, Unlimited) -> Dashboard Access.
- **Withdrawal:** View Balance -> Select Destination -> Enter Amount -> Security Check -> Process.

## 3. Design System & Visual Identity

- **Vibe:** Premium, trustworthy, modern fintech. Not flashy, not generic.
- **Primary Background:** Deep Slate/Blue gradients (Dark mode first).
- **Primary Accent:** Vendly Cyan/Blue (used for primary actions, active states, and financial highlights).
- **Semantic Colors:**
  - Success: Emerald Green (for verified states, completed transactions).
  - Warning: Amber (for pending escrow, low balance).
  - Error: Rose/Red (for failed transactions, rejected KYC).
- **Typography:** Clean, sans-serif (Inter or similar). High contrast for readability.
- **Components:** Glassmorphic cards with subtle borders, soft shadows, and generous padding.

## 4. Technical Architecture

- **Frontend:** Next.js 14+ (App Router), TypeScript, Tailwind CSS.
- **Backend/Database:** Supabase (PostgreSQL, Auth, Storage, Edge Functions).
- **State Management:** React Server Components for data fetching; Zustand/Context for complex client UI state.
- **Styling:** Tailwind CSS with custom `vendly` theme extensions.

## 5. Critical Business Rules

- **Escrow:** Funds are NEVER released to the seller until the buyer explicitly confirms receipt or the auto-confirm timer expires.
- **KYC Limits:** NIN verification restricts transaction volume to ₦50,000. BVN removes this restriction.
- **PII Security:** BVN and NIN numbers MUST NEVER be stored in Supabase `auth.users` metadata. They must be stored in a dedicated, encrypted `verifications` table with strict Row Level Security (RLS).

## 6. Current Status & Roadmap

- **Current State:** Basic Auth, Landing Page, Generic Dashboard, Basic Verification UI (needs PII security fix).
- **P0 (Immediate):** Design System implementation, Secure DB Schema for PII, Dashboard Redesign (Financial Hero Card), Core Marketplace Flow.
- **P1 (Next):** Transfer/Withdrawal Flow, In-App Notifications, Mobile Polish.
- **P2 (Future):** AI Forecasting (TimesFM-3), Advanced Analytics.

## 7. Rules of Engagement

- No PII in auth metadata.
- No fake success states. If an API fails, show the error.
- Always consider Loading, Empty, and Error states for every screen.
- Do not delete working code without a documented reason.
