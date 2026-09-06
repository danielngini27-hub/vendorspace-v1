"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    checkUser();

    // If they just came from verification, show a success toast
    if (searchParams.get("verified") === "true") {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    }
  }, []);

  async function checkUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/");
    } else {
      setUser(user);
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Smooth Toast Notification */}
      {showToast && (
        <div className="fixed top-6 right-6 bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-50">
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
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span className="font-bold">Identity Verified Successfully!</span>
        </div>
      )}

      {/* Header */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Vendly</h1>
          <div className="flex items-center gap-4">
            <span className="text-blue-200 text-sm hidden sm:inline">
              {user?.email}
            </span>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                router.push("/");
              }}
              className="text-red-400 hover:text-red-300 text-sm font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-white mb-2">
            Welcome back! 👋
          </h2>
          <p className="text-blue-200">
            Manage your transactions and account settings
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/marketplace"
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all group"
          >
            <div className="text-3xl mb-3">🛒</div>
            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
              Start Buying
            </h3>
            <p className="text-blue-200 text-sm mb-4">
              Browse verified sellers
            </p>
            <span className="text-blue-400 text-sm font-medium">
              Browse Marketplace →
            </span>
          </Link>

          <Link
            href="/create-listing"
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all group"
          >
            <div className="text-3xl mb-3">📦</div>
            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
              Start Selling
            </h3>
            <p className="text-blue-200 text-sm mb-4">List your products</p>
            <span className="text-blue-400 text-sm font-medium">
              Create Listing →
            </span>
          </Link>

          <Link
            href="/transactions"
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all group"
          >
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
              Transactions
            </h3>
            <p className="text-blue-200 text-sm mb-4">View your history</p>
            <span className="text-blue-400 text-sm font-medium">
              View All →
            </span>
          </Link>
        </div>

        {/* Verification Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Account Verification
              </h3>
              <p className="text-blue-200 text-sm">
                Verify your identity to start transacting securely
              </p>
            </div>
            <button
              onClick={() => router.push("/verification")}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg"
            >
              Verify Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
