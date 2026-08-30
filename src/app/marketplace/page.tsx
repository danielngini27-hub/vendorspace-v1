"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import ProductCard from "@/components/ui/ProductCard";
import EmptyState from "@/components/ui/EmptyState";

export default function MarketplacePage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    fetchListings();
    supabase.auth.getUser().then(({ data }) => setLoggedIn(!!data.user));
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("listings")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false });
    if (data) setListings(data);
    setLoading(false);
  };

  const filteredListings = listings.filter(
    (listing) =>
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[var(--v-canvas)] pb-28">
      <div className="mx-auto max-w-lg px-5">
        {/* Header */}
        <header className="v-rise flex items-center justify-between pt-12 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 shadow-lg shadow-blue-500/20">
              <span className="text-lg font-black text-white">V</span>
            </div>
            <h1 className="text-xl font-bold text-white">Marketplace</h1>
          </div>
          {!loggedIn && (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="v-press px-3 py-1.5 text-sm text-[var(--v-text-muted)] hover:text-white"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="v-press rounded-xl bg-gradient-to-r from-sky-400 to-blue-600 px-3 py-1.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20"
              >
                Sign Up
              </Link>
            </div>
          )}
        </header>

        {/* Hero + Search */}
        <div className="v-rise v-rise-1 pt-4 pb-6">
          <h2 className="mb-2 text-3xl font-bold text-white">
            Buy & Sell with <span className="v-gradient-text">Trust</span>
          </h2>
          <p className="mb-5 text-sm text-[var(--v-text-muted)]">
            Secure escrow payments. Verified vendors. No scams.
          </p>

          <div className="relative">
            <input
              type="text"
              placeholder="Search products, categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="v-surface w-full rounded-2xl px-5 py-3.5 pr-12 text-white placeholder-[var(--v-text-dim)] transition-colors focus:border-[var(--v-accent)]/50 focus:outline-none"
            />
            <svg
              className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--v-text-dim)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Listings */}
        <main>
          {loading ? (
            /* Skeleton loading state */
            <div className="grid grid-cols-2 gap-4">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="v-surface rounded-[var(--v-radius-card)] p-3"
                >
                  <div className="v-skeleton mb-3 h-32 w-full" />
                  <div className="v-skeleton mb-2 h-3 w-1/3" />
                  <div className="v-skeleton mb-2 h-4 w-3/4" />
                  <div className="v-skeleton h-3 w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredListings.length === 0 ? (
            <EmptyState
              icon="🛍️"
              title="No listings found"
              description={
                searchTerm
                  ? `Nothing matches "${searchTerm}". Try a different search.`
                  : "The market is quiet right now — be the first to list a product."
              }
              action={
                loggedIn ? (
                  <Link
                    href="/listings"
                    className="v-press inline-flex items-center rounded-xl bg-gradient-to-r from-sky-400 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20"
                  >
                    Start selling
                  </Link>
                ) : undefined
              }
            />
          ) : (
            <>
              <p className="mb-3 text-xs font-medium text-[var(--v-text-dim)]">
                {filteredListings.length}{" "}
                {filteredListings.length === 1 ? "listing" : "listings"}
              </p>
              <div className="v-rise v-rise-2 grid grid-cols-2 gap-4">
                {filteredListings.map((listing) => (
                  <ProductCard key={listing.id} listing={listing} />
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
