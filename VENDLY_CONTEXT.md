# VENDLY PROJECT CONTEXT & ARCHITECTURE

## 1. PRODUCT VISION
Vendly is a modern global commerce and payment platform. It helps businesses sell products/services online safely. 
Long-term goal: Combine online selling, payments, customer communication, order management, AI-powered advertising, and AI customer support into one ecosystem.
Design philosophy: Premium, modern, clean, fast, trustworthy, slightly futuristic. NOT a generic admin template.

## 2. TECH STACK
- Frontend: Next.js 16 (App Router), React 19, TypeScript
- Backend/Database: Supabase (PostgreSQL)
- Styling: Tailwind CSS v4, shadcn/ui, Lucide React
- Deployment: Vercel (planned)

## 3. DATABASE SCHEMA (Supabase)
Core tables currently in development:
- `users` / `profiles` (Auth)
- `listings` (Products/Services)
- `wallets` (User balances)
- `wallet_transactions` (Ledger)
- `escrow_transactions` (Secure payments)
- `verifications` (KYC/Business verification)
- `waitlist` (Go-to-market)

## 4. FRONTEND ARCHITECTURE
- Root: `src/app` (Next.js App Router)
- UI Components: `src/components` (shadcn/ui + custom)
- Utilities/Supabase Client: `src/lib`

## 5. MAJOR FEATURES & AI AGENTS
1. **Ad Creator Agent:** Helps sellers generate ad copy, concepts, and assets for various platforms (IG, TikTok, etc.).
2. **Customer Support Agent:** Handles customer inquiries based on seller-defined rules, tone, and product data.
3. **Secure Payments:** Escrow system, multi-currency support, wallet management.

## 6. MVP PRIORITIES (NOW)
1. Authentication (Secure Login/Signup)
2. Business/Store Setup & Verification
3. Product/Listing Management
4. Secure Payments (Escrow/Wallets)
5. Seller Dashboard (Clean, premium UI)

## 7. DEVELOPMENT RULES
- Security first (especially for financial data).
- Do not rewrite working systems unnecessarily.
- Preserve existing UI direction.
- Handle errors, loading states, and empty states properly.
- Think globally (multi-currency, multi-language ready).
- No hardcoded secrets.

## 8. CURRENT STATUS
- Database schema initialized in Supabase.
- Basic Next.js 16 structure established.
- Landing page and initial dashboard UI (hero cards) implemented.
- Next step: Connect frontend to Supabase Auth and Database securely.
