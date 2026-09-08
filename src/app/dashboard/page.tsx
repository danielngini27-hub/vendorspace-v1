"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

// --- MOCK DATA FOR UI DEMONSTRATION ---
// In the next phase, we will replace this with real data from Supabase
const MOCK_TRANSACTIONS = [
  {
    id: 1,
    title: "iPhone 13 Pro",
    category: "Electronics",
    amount: 350000,
    status: "Released",
    date: "Today",
    type: "in",
  },
  {
    id: 2,
    title: "Gaming Laptop",
    category: "Electronics",
    amount: 450000,
    status: "In Escrow",
    date: "Yesterday",
    type: "pending",
  },
  {
    id: 3,
    title: "Vintage Sneakers",
    category: "Fashion",
    amount: 45000,
    status: "Completed",
    date: "Oct 24",
    type: "out",
  },
];

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkUserAndStatus();
  }, []);

  async function checkUserAndStatus() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/");
      return;
    }
    setUser(user);

    const { data: verification } = await supabase
      .from("verifications")
      .select("status")
      .eq("user_id", user.id)
      .in("id_type", ["bvn", "nin"])
      .eq("status", "verified")
      .single();

    setIsVerified(!!verification);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-vendly-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-vendly-primary/30 border-t-vendly-primary rounded-full animate-spin" />
          <p className="text-vendly-muted text-sm">Loading Vendly...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vendly-background text-vendly-text pb-24 lg:pb-0">
      {/* --- TOP NAVIGATION (Desktop & Mobile) --- */}
      <nav className="sticky top-0 z-50 bg-vendly-background/80 backdrop-blur-lg border-b border-vendly-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-hero-gradient flex items-center justify-center font-bold text-white shadow-lg shadow-vendly-primary/20">
              V
            </div>
            <div>
              <p className="text-xs text-vendly-muted">Welcome back,</p>
              <h2 className="text-sm font-semibold truncate max-w-[150px]">
                {user?.email?.split("@")[0]}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-full bg-vendly-surface border border-vendly-border hover:bg-vendly-elevated transition-colors">
              <svg
                className="w-5 h-5 text-vendly-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-vendly-error rounded-full" />
            </button>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                router.push("/");
              }}
              className="hidden sm:block text-vendly-muted hover:text-vendly-error text-sm font-medium transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* 1. THE FINANCIAL HERO CARD */}
        <div className="relative w-full max-w-md mx-auto lg:max-w-none lg:w-full">
          {/* Subtle Glow Behind Card */}
          <div className="absolute -inset-1 bg-hero-gradient opacity-20 blur-2xl rounded-3xl" />

          <div className="relative bg-gradient-to-br from-vendly-surface to-vendly-elevated border border-vendly-border rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-vendly-muted text-sm font-medium mb-1">
                  Available Balance
                </p>
                <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                  ₦ 125,000.00
                </h1>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-vendly-success text-xs font-semibold bg-vendly-success/10 px-2 py-0.5 rounded-full">
                    +2.5%
                  </span>
                  <span className="text-vendly-muted text-xs">this week</span>
                </div>
              </div>
              <button className="p-2 rounded-full bg-vendly-background/50 hover:bg-vendly-background transition-colors">
                <svg
                  className="w-5 h-5 text-vendly-muted"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </button>
            </div>

            {/* Escrow Status - Vendly's Core Feature */}
            <div className="bg-vendly-background/50 rounded-2xl p-4 border border-vendly-border mb-6">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-vendly-warning animate-pulse" />
                  <span className="text-xs text-vendly-muted font-medium">
                    Protected in Escrow
                  </span>
                </div>
                <span className="text-xs text-vendly-warning font-semibold">
                  Pending
                </span>
              </div>
              <p className="text-xl font-bold text-white"> 450,000.00</p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-4 gap-2 sm:gap-4">
              {[
                {
                  icon: "M12 4v16m8-8H4",
                  label: "Add Funds",
                  color: "text-vendly-accent",
                },
                {
                  icon: "M17 8l4 4m0 0l-4 4m4-4H3",
                  label: "Withdraw",
                  color: "text-vendly-primary",
                },
                {
                  icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z",
                  label: "Buy",
                  color: "text-vendly-success",
                },
                {
                  icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
                  label: "Sell",
                  color: "text-vendly-text",
                },
              ].map((action, idx) => (
                <button
                  key={idx}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-vendly-background border border-vendly-border flex items-center justify-center group-hover:border-vendly-primary/50 group-hover:bg-vendly-primary/5 transition-all">
                    <svg
                      className={`w-5 h-5 sm:w-6 sm:h-6 ${action.color}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={action.icon}
                      />
                    </svg>
                  </div>
                  <span className="text-[10px] sm:text-xs text-vendly-muted font-medium">
                    {action.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2. RECENT TRANSACTIONS & ACTIVITY */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Transactions List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Recent Activity</h3>
              <Link
                href="/transactions"
                className="text-sm text-vendly-accent hover:underline"
              >
                View All
              </Link>
            </div>

            <div className="bg-vendly-surface border border-vendly-border rounded-2xl p-2 sm:p-4 space-y-2">
              {MOCK_TRANSACTIONS.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-vendly-elevated/50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        tx.type === "in"
                          ? "bg-vendly-success/10 text-vendly-success"
                          : tx.type === "out"
                            ? "bg-vendly-error/10 text-vendly-error"
                            : "bg-vendly-warning/10 text-vendly-warning"
                      }`}
                    >
                      {tx.type === "in" ? "↓" : tx.type === "out" ? "↑" : "⏳"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white group-hover:text-vendly-accent transition-colors">
                        {tx.title}
                      </p>
                      <p className="text-xs text-vendly-muted">
                        {tx.category} • {tx.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-bold ${
                        tx.type === "in" ? "text-vendly-success" : "text-white"
                      }`}
                    >
                      {tx.type === "in" ? "+" : "-"} ₦{" "}
                      {tx.amount.toLocaleString()}
                    </p>
                    <p
                      className={`text-xs ${
                        tx.status === "Released"
                          ? "text-vendly-success"
                          : tx.status === "In Escrow"
                            ? "text-vendly-warning"
                            : "text-vendly-muted"
                      }`}
                    >
                      {tx.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verification / Account Status Card */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Account Status</h3>
            {!isVerified ? (
              <div className="bg-gradient-to-br from-vendly-error/10 to-vendly-surface border border-vendly-error/30 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-vendly-error/20 flex items-center justify-center text-vendly-error">
                    !
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">
                      Verification Required
                    </h4>
                    <p className="text-xs text-vendly-muted">
                      Unlock full features
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => router.push("/verification")}
                  className="w-full bg-vendly-error text-white py-2.5 rounded-xl font-semibold hover:bg-vendly-error/90 transition-colors text-sm"
                >
                  Verify Identity
                </button>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-vendly-success/10 to-vendly-surface border border-vendly-success/30 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-vendly-success/20 flex items-center justify-center text-vendly-success">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Fully Verified</h4>
                    <p className="text-xs text-vendly-muted">Tier 2 Account</p>
                  </div>
                </div>
                <div className="space-y-2 text-xs text-vendly-muted">
                  <div className="flex justify-between">
                    <span>Transaction Limit</span>
                    <span className="text-white font-medium">Unlimited</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Escrow Limit</span>
                    <span className="text-white font-medium">₦ 5,000,000</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* --- BOTTOM NAVIGATION (Mobile Only) --- */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-vendly-surface/90 backdrop-blur-lg border-t border-vendly-border px-6 py-3 flex justify-between items-center z-50">
        {[
          {
            icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
            label: "Home",
            active: true,
          },
          {
            icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z",
            label: "Market",
            active: false,
          },
          {
            icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
            label: "Orders",
            active: false,
          },
          {
            icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
            label: "Profile",
            active: false,
          },
        ].map((item, idx) => (
          <button
            key={idx}
            className={`flex flex-col items-center gap-1 ${item.active ? "text-vendly-accent" : "text-vendly-muted"}`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={item.icon}
              />
            </svg>
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
