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
    checkUser();
  }, []);

  async function checkUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/");
    } else {
      setUser(user);
      // Check if user is verified from metadata
      setIsVerified(user.user_metadata?.is_verified || false);
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
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
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all group">
            <div className="text-3xl mb-3"></div>
            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
              Start Buying
            </h3>
            <p className="text-blue-200 text-sm mb-4">
              Browse verified sellers
            </p>
            <button className="text-blue-400 hover:text-blue-300">
              Browse Marketplace →
            </button>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all group">
            <div className="text-3xl mb-3">📦</div>
            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
              Start Selling
            </h3>
            <p className="text-blue-200 text-sm mb-4">List your products</p>
            <button className="text-blue-400 hover:text-blue-300">
              Create Listing →
            </button>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all group">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
              Transactions
            </h3>
            <p className="text-blue-200 text-sm mb-4">View your history</p>
            <button className="text-blue-400 hover:text-blue-300">
              View All →
            </button>
          </div>
        </div>

        {/* Verification Status Card */}
        {!isVerified ? (
          /* Show this if NOT verified */
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
        ) : (
          /* Show this if VERIFIED */
          <div className="bg-green-500/20 backdrop-blur-md rounded-xl p-8 border border-green-500/40">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
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
                <h3 className="text-xl font-semibold text-white mb-1">
                  ✅ Account Verified
                </h3>
                <p className="text-green-200 text-sm">
                  Your {user.user_metadata?.verification_type?.toUpperCase()}{" "}
                  has been verified. You can now transact freely.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
