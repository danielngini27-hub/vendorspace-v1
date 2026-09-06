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
      router.push("/login");
    } else {
      setUser(user);
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Vendly</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{user?.email}</span>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                router.push("/");
              }}
              className="text-red-600 hover:underline"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Your Dashboard
          </h2>
          <p className="text-gray-600">
            Manage your transactions and account settings
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-2">Start Buying</h3>
            <p className="text-gray-600 mb-4">Browse verified sellers</p>
            <button className="text-blue-600 hover:underline">
              Browse Marketplace →
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-2">Start Selling</h3>
            <p className="text-gray-600 mb-4">List your products</p>
            <button className="text-blue-600 hover:underline">
              Create Listing →
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-2">Transactions</h3>
            <p className="text-gray-600 mb-4">View your history</p>
            <button className="text-blue-600 hover:underline">
              View All →
            </button>
          </div>
        </div>

        {/* BVN Status */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Account Verification</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-700 mb-1">BVN Verification</p>
              <p className="text-sm text-gray-500">Required for transactions</p>
            </div>
            <button
              onClick={() => router.push("/bvn")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              {user?.user_metadata?.has_bvn ? "Update BVN" : "Add BVN"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
