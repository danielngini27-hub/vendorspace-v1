"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import OrderCard from "@/components/ui/OrderCard";
import EmptyState from "@/components/ui/EmptyState";

export default function OrdersPage() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"buying" | "selling">("buying");
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
      await fetchOrders(user.id, "buying");
      setLoading(false);
    };
    init();
  }, [router]);

  const fetchOrders = async (userId: string, type: "buying" | "selling") => {
    setLoading(true);
    const column = type === "buying" ? "buyer_id" : "seller_id";
    const { data } = await supabase
      .from("escrow_transactions")
      .select("*")
      .eq(column, userId)
      .order("created_at", { ascending: false });

    setOrders(data || []);
    setLoading(false);
  };

  const switchTab = (type: "buying" | "selling") => {
    setTab(type);
    if (user) fetchOrders(user.id, type);
  };

  return (
    <div className="min-h-screen bg-[var(--v-canvas)] pb-28">
      <div className="mx-auto max-w-lg px-5">
        {/* Header */}
        <div className="v-rise pt-12 pb-5">
          <h1 className="text-2xl font-bold text-white">My Orders</h1>
          <p className="mt-1 text-sm text-[var(--v-text-muted)]">
            Track all your escrow transactions
          </p>
        </div>

        {/* Segmented tabs */}
        <div className="v-rise v-rise-1 mb-5">
          <div className="v-surface flex rounded-2xl p-1">
            <button
              onClick={() => switchTab("buying")}
              className={`v-press flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all ${
                tab === "buying"
                  ? "bg-gradient-to-r from-sky-400 to-blue-600 text-white shadow-lg shadow-blue-500/20"
                  : "text-[var(--v-text-muted)]"
              }`}
            >
              🛒 Buying
            </button>
            <button
              onClick={() => switchTab("selling")}
              className={`v-press flex-1 rounded-xl py-2.5 text-sm font-semibold transition-all ${
                tab === "selling"
                  ? "bg-gradient-to-r from-sky-400 to-blue-600 text-white shadow-lg shadow-blue-500/20"
                  : "text-[var(--v-text-muted)]"
              }`}
            >
              💰 Selling
            </button>
          </div>
        </div>

        {/* Orders list */}
        <div>
          {loading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="v-surface rounded-[var(--v-radius-card)] p-4"
                >
                  <div className="v-skeleton mb-3 h-4 w-2/3" />
                  <div className="v-skeleton mb-4 h-5 w-1/3" />
                  <div className="v-skeleton h-1 w-full" />
                </div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <EmptyState
              icon={tab === "buying" ? "🛒" : "💰"}
              title={`No ${tab} orders yet`}
              description={
                tab === "buying"
                  ? "Items you buy will appear here with live escrow tracking."
                  : "Items you sell will appear here with live escrow tracking."
              }
              action={
                tab === "buying" ? (
                  <Link
                    href="/marketplace"
                    className="v-press inline-flex items-center rounded-xl bg-gradient-to-r from-sky-400 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20"
                  >
                    Browse Marketplace
                  </Link>
                ) : (
                  <Link
                    href="/listings"
                    className="v-press inline-flex items-center rounded-xl bg-gradient-to-r from-sky-400 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20"
                  >
                    List an item
                  </Link>
                )
              }
            />
          ) : (
            <div className="space-y-3">
              {orders.map((order, i) => (
                <div
                  key={order.id}
                  className="v-rise"
                  style={{ animationDelay: `${i * 0.04}s` }}
                >
                  <OrderCard order={order} perspective={tab} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
