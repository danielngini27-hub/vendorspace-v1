"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
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
            <span className="text-blue-200 text-sm">{user?.email}</span>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                router.push("/");
              }}
              className="text-red-400 hover:text-red-300 text-sm"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Welcome Section */}
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
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all">
            <div className="text-3xl mb-3">🛒</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Start Buying
            </h3>
            <p className="text-blue-200 text-sm mb-4">
              Browse verified sellers
            </p>
            <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
              Browse Marketplace →
            </button>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all">
            <div className="text-3xl mb-3">📦</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Start Selling
            </h3>
            <p className="text-blue-200 text-sm mb-4">List your products</p>
            <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
              Create Listing →
            </button>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Transactions
            </h3>
            <p className="text-blue-200 text-sm mb-4">View your history</p>
            <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
              View All →
            </button>
          </div>
        </div>

        {/* BVN Verification Card */}
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

        {/* Security Badge */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 text-blue-300 text-sm">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>Protected by Vendly Escrow</span>
          </div>
        </div>
      </div>
    </div>
  );
}
