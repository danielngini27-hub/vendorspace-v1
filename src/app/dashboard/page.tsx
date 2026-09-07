"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkUserAndStatus();
  }, []);

  async function checkUserAndStatus() {
    // 1. Get Auth User
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/");
      return;
    }
    setUser(user);

    // 2. Check Verification Status from the new secure table
    const { data: verification } = await supabase
      .from("verifications")
      .select("status")
      .eq("user_id", user.id)
      .in("id_type", ["bvn", "nin"])
      .eq("status", "verified") // We only care if it's actually verified
      .single();

    setIsVerified(!!verification);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-vendly-background">
        <div className="text-vendly-text text-xl">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vendly-background text-vendly-text">
      {/* Header */}
      <nav className="bg-vendly-surface/50 backdrop-blur-md border-b border-vendly-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-vendly-accent">Vendly</h1>
          <div className="flex items-center gap-4">
            <span className="text-vendly-muted text-sm hidden sm:inline">
              {user?.email}
            </span>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                router.push("/");
              }}
              className="text-vendly-error hover:text-red-300 text-sm font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-2">Welcome back! 👋</h2>
          <p className="text-vendly-muted">
            Manage your transactions and account settings
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/marketplace"
            className="bg-vendly-surface rounded-xl p-6 border border-vendly-border hover:border-vendly-primary/50 transition-all group"
          >
            <div className="text-3xl mb-3">🛒</div>
            <h3 className="text-xl font-semibold mb-2 group-hover:text-vendly-accent transition-colors">
              Start Buying
            </h3>
            <p className="text-vendly-muted text-sm mb-4">
              Browse verified sellers
            </p>
            <span className="text-vendly-accent text-sm font-medium">
              Browse Marketplace →
            </span>
          </Link>

          <Link
            href="/create-listing"
            className="bg-vendly-surface rounded-xl p-6 border border-vendly-border hover:border-vendly-primary/50 transition-all group"
          >
            <div className="text-3xl mb-3">📦</div>
            <h3 className="text-xl font-semibold mb-2 group-hover:text-vendly-accent transition-colors">
              Start Selling
            </h3>
            <p className="text-vendly-muted text-sm mb-4">List your products</p>
            <span className="text-vendly-accent text-sm font-medium">
              Create Listing →
            </span>
          </Link>

          <Link
            href="/transactions"
            className="bg-vendly-surface rounded-xl p-6 border border-vendly-border hover:border-vendly-primary/50 transition-all group"
          >
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-xl font-semibold mb-2 group-hover:text-vendly-accent transition-colors">
              Transactions
            </h3>
            <p className="text-vendly-muted text-sm mb-4">View your history</p>
            <span className="text-vendly-accent text-sm font-medium">
              View All →
            </span>
          </Link>
        </div>

        {/* Verification Status Card */}
        {!isVerified ? (
          <div className="bg-vendly-surface rounded-xl p-8 border border-vendly-border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Account Verification
                </h3>
                <p className="text-vendly-muted text-sm">
                  Verify your identity to start transacting securely
                </p>
              </div>
              <button
                onClick={() => router.push("/verification")}
                className="bg-hero-gradient text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-all shadow-lg"
              >
                Verify Now
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-vendly-success/10 rounded-xl p-8 border border-vendly-success/40">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-vendly-success rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">
                  ✅ Account Verified
                </h3>
                <p className="text-vendly-success text-sm">
                  Your identity is verified. You can transact freely.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
