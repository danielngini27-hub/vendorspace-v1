"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

const COMMISSION_RATE = 0.03; // 3% platform fee on every sale

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [userName, setUserName] = useState("Vendor");
  const [stats, setStats] = useState({
    totalSales: 0,
    inEscrow: 0,
    completedOrders: 0,
    activeListings: 0,
    pendingOrders: 0,
    commissionEarned: 0,
    pendingCommission: 0,
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);
      setUserName(
        user.user_metadata?.business_name ||
          user.email?.split("@")[0] ||
          "Vendor",
      );
      await fetchStats(user.id);
      setLoading(false);
    };
    init();
  }, [router]);

  const fetchStats = async (userId: string) => {
    // Your own listings
    const { data: listings } = await supabase
      .from("listings")
      .select("id")
      .eq("vendor_id", userId);

    // Your own sales as a seller
    const { data: mySales } = await supabase
      .from("escrow_transactions")
      .select("amount, status")
      .eq("seller_id", userId);

    // ALL transactions on the platform (you own Vendly — you earn 3% on EVERYTHING!)
    const { data: allTx } = await supabase
      .from("escrow_transactions")
      .select("amount, status");

    let totalSales = 0;
    let inEscrow = 0;
    let completedOrders = 0;
    let pendingOrders = 0;

    (mySales || []).forEach((tx) => {
      const amount = Number(tx.amount);
      if (tx.status === "delivered") {
        totalSales += amount;
        completedOrders += 1;
      } else if (tx.status === "paid" || tx.status === "shipped") {
        inEscrow += amount;
        pendingOrders += 1;
      }
    });

    let commissionEarned = 0;
    let pendingCommission = 0;
    (allTx || []).forEach((tx) => {
      const amount = Number(tx.amount);
      if (tx.status === "delivered") {
        commissionEarned += amount * COMMISSION_RATE;
      } else if (tx.status === "paid" || tx.status === "shipped") {
        pendingCommission += amount * COMMISSION_RATE;
      }
    });

    setStats({
      totalSales,
      inEscrow,
      completedOrders,
      activeListings: listings ? listings.length : 0,
      pendingOrders,
      commissionEarned,
      pendingCommission,
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const quickActions = [
    {
      label: "Sell Item",
      icon: "➕",
      href: "/listings",
      color: "from-cyan-500 to-blue-600",
    },
    {
      label: "My Listings",
      icon: "📦",
      href: "/listings",
      color: "from-purple-500 to-pink-600",
    },
    {
      label: "Marketplace",
      icon: "🛍️",
      href: "/marketplace",
      color: "from-green-500 to-emerald-600",
    },
    {
      label: "Settings",
      icon: "⚙️",
      href: "/profile",
      color: "from-orange-500 to-red-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black pb-24 max-w-lg mx-auto">
      {/* Top Header */}
      <div className="px-5 pt-12 pb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-cyan-500/30">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-slate-400 text-xs">Welcome back</p>
            <h1 className="text-white font-bold text-lg">{userName}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/profile"
            className="w-10 h-10 rounded-full bg-slate-800/60 flex items-center justify-center text-slate-300 hover:bg-slate-700 transition-all"
          >
            ⚙️
          </Link>
          <button
            onClick={handleLogout}
            className="w-10 h-10 rounded-full bg-slate-800/60 flex items-center justify-center text-slate-300 hover:bg-red-500/20 hover:text-red-400 transition-all"
          >
            🚪
          </button>
        </div>
      </div>

      {/* 💰 YOUR COMMISSION EARNINGS CARD */}
      <div className="px-5 mb-5">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-green-500 to-teal-600 p-5 shadow-2xl shadow-emerald-500/30">
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-xs mb-1">
                💰 Your Commission Earnings (3%)
              </p>
              <h2 className="text-white text-3xl font-black">
                ₦{stats.commissionEarned.toLocaleString()}
              </h2>
              <p className="text-emerald-100/80 text-[11px] mt-1">
                +₦{stats.pendingCommission.toLocaleString()} pending from active
                escrows
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-3xl">
              💸
            </div>
          </div>
        </div>
      </div>

      {/* Balance Card (Your seller money) */}
      <div className="px-5 mb-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-700 p-6 shadow-2xl shadow-cyan-500/30">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-12 -left-8 w-32 h-32 rounded-full bg-cyan-300/20 blur-2xl" />

          <div className="relative">
            <p className="text-cyan-100 text-sm mb-1">
              In Escrow (Held Safely)
            </p>
            <h2 className="text-white text-4xl font-black mb-4">
              ₦{stats.inEscrow.toLocaleString()}
            </h2>
            <div className="flex items-center gap-2 mb-5">
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-[10px] text-white font-medium">
                🔒 Protected by Vendly Escrow
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-3">
                <p className="text-cyan-100 text-[11px]">Total Sales</p>
                <p className="text-white font-bold text-lg">
                  ₦{stats.totalSales.toLocaleString()}
                </p>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-3">
                <p className="text-cyan-100 text-[11px]">Completed</p>
                <p className="text-white font-bold text-lg">
                  {stats.completedOrders}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-5 mb-6">
        <h3 className="text-white font-bold mb-3">Quick Actions</h3>
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex flex-col items-center gap-2"
            >
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center text-2xl shadow-lg active:scale-95 transition-transform`}
              >
                {action.icon}
              </div>
              <span className="text-slate-300 text-[11px] text-center font-medium">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div className="px-5 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4">
            <p className="text-slate-400 text-xs mb-1">Active Listings</p>
            <p className="text-white text-2xl font-bold">
              {stats.activeListings}
            </p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4">
            <p className="text-slate-400 text-xs mb-1">Pending Orders</p>
            <p className="text-white text-2xl font-bold">
              {stats.pendingOrders}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-bold">Recent Activity</h3>
          <Link href="/orders" className="text-cyan-400 text-xs font-medium">
            See all →
          </Link>
        </div>
        <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 text-center">
          <div className="text-4xl mb-2">🚀</div>
          <p className="text-slate-300 font-medium mb-1">Track your orders</p>
          <p className="text-slate-500 text-xs">
            Tap "See all" to view every escrow transaction
          </p>
        </div>
      </div>
    </div>
  );
}
