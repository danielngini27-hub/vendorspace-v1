"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import EarningsCard from "@/components/ui/EarningsCard";
import StatTile from "@/components/ui/StatTile";
import QuickAction from "@/components/ui/QuickAction";
import SectionHeader from "@/components/ui/SectionHeader";
import EmptyState from "@/components/ui/EmptyState";
import Spinner from "@/components/ui/Spinner";

const COMMISSION_RATE = 0.03;
// 🔐 ONLY this account sees the commission earnings card
const OWNER_EMAIL = "danielngini27@gmail.com";

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
  const [trend, setTrend] = useState<number[]>([2, 3, 3, 5, 4, 6, 7, 9]);
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
    const { data: listings } = await supabase
      .from("listings")
      .select("id")
      .eq("vendor_id", userId);
    const { data: mySales } = await supabase
      .from("escrow_transactions")
      .select("amount, status")
      .eq("seller_id", userId);
    const { data: allTx } = await supabase
      .from("escrow_transactions")
      .select("amount, status");

    let totalSales = 0,
      inEscrow = 0,
      completedOrders = 0,
      pendingOrders = 0;
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

    let commissionEarned = 0,
      pendingCommission = 0;
    const trendSrc: number[] = [];
    (allTx || []).forEach((tx) => {
      const amount = Number(tx.amount);
      if (tx.status === "delivered") {
        commissionEarned += amount * COMMISSION_RATE;
        trendSrc.push(amount * COMMISSION_RATE);
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
    if (trendSrc.length) setTrend(trendSrc.slice(-8));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  // 🔐 Owner gate
  const isOwner = (user?.email || "").toLowerCase() === OWNER_EMAIL;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--v-canvas)]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--v-canvas)] pb-28">
      <div className="mx-auto max-w-lg px-5">
        {/* Header */}
        <div className="v-rise flex items-center justify-between pt-12 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 text-lg font-bold text-white shadow-lg shadow-blue-500/20">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xs text-[var(--v-text-muted)]">Welcome back</p>
              <h1 className="text-lg font-semibold text-white">{userName}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/profile"
              aria-label="Settings"
              className="v-press flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--v-border)] bg-[var(--v-surface-1)] text-slate-400 hover:text-white"
            >
              ⚙️
            </Link>
            <button
              onClick={handleLogout}
              aria-label="Log out"
              className="v-press flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--v-border)] bg-[var(--v-surface-1)] text-slate-400 hover:border-rose-400/30 hover:text-rose-300"
            >
              🚪
            </button>
          </div>
        </div>

        {/* 🔐 OWNER-ONLY — Signature Earnings Card */}
        {isOwner && (
          <div className="v-rise v-rise-1 mb-4">
            <EarningsCard
              earned={stats.commissionEarned}
              pending={stats.pendingCommission}
              trend={trend}
            />
          </div>
        )}

        {/* Escrow wallet (each user sees ONLY their own seller money) */}
        <div className="v-rise v-rise-2 v-glass-edge relative mb-6 overflow-hidden rounded-[var(--v-radius-card)] border border-[var(--v-border-strong)] bg-gradient-to-br from-[#101a2e] via-[#0d1424] to-[#0a0f1c] p-6 v-shadow">
          <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-sky-500/[0.07] blur-3xl" />
          <div className="relative">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-slate-300">
                In Escrow · Held Safely
              </p>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/20 bg-sky-400/10 px-2.5 py-0.5 text-[10px] font-semibold text-sky-300">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />{" "}
                Protected
              </span>
            </div>
            <h2 className="v-num text-4xl font-bold tracking-tight text-white">
              ₦{stats.inEscrow.toLocaleString()}
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <StatTile
                label="Total Sales"
                value={`₦${stats.totalSales.toLocaleString()}`}
              />
              <StatTile label="Completed" value={`${stats.completedOrders}`} />
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="v-rise v-rise-3 mb-6">
          <SectionHeader title="Quick Actions" />
          <div className="grid grid-cols-4 gap-3">
            <QuickAction href="/listings" icon="➕" label="Sell Item" />
            <QuickAction href="/listings" icon="📦" label="My Listings" />
            <QuickAction href="/marketplace" icon="🛍️" label="Market" />
            <QuickAction href="/profile" icon="⚙️" label="Settings" />
          </div>
        </div>

        {/* Stat tiles */}
        <div className="v-rise v-rise-3 mb-6 grid grid-cols-2 gap-3">
          <StatTile label="Active Listings" value={`${stats.activeListings}`} />
          <StatTile
            label="Pending Orders"
            value={`${stats.pendingOrders}`}
            accent
          />
        </div>

        {/* Recent activity */}
        <div className="v-rise v-rise-4">
          <SectionHeader title="Recent Activity" actionHref="/orders" />
          <EmptyState
            icon="🚀"
            title="Track your orders"
            description="Every escrow transaction — buying and selling — will appear here with live status."
            action={
              <Link
                href="/orders"
                className="v-press inline-flex items-center rounded-xl bg-gradient-to-r from-sky-400 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20"
              >
                View all orders
              </Link>
            }
          />
        </div>
      </div>
    </div>
  );
}
