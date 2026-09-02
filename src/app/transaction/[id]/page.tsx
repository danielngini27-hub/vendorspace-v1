"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Spinner from "@/components/ui/Spinner";
import StatusBadge from "@/components/ui/StatusBadge";

const STEPS = ["pending", "paid", "shipped", "delivered"];

export default function TransactionPage() {
  const [transaction, setTransaction] = useState<any>(null);
  const [listing, setListing] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const params = useParams();
  const router = useRouter();
  const transactionId = params.id;

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

      if (transactionId) {
        const { data: txData } = await supabase
          .from("escrow_transactions")
          .select("*")
          .eq("id", transactionId)
          .single();

        if (txData) {
          setTransaction(txData);
          const { data: listingData } = await supabase
            .from("listings")
            .select("*")
            .eq("id", txData.listing_id)
            .single();

          if (listingData) setListing(listingData);
        }
      }
      setLoading(false);
    };
    init();
  }, [transactionId, router]);

  const updateStatus = async (newStatus: string) => {
    if (!transaction) return;
    setUpdating(true);
    const { error } = await supabase
      .from("escrow_transactions")
      .update({ status: newStatus })
      .eq("id", transaction.id);

    if (!error) {
      setTransaction({ ...transaction, status: newStatus });
    } else {
      alert("Error updating status: " + error.message);
    }
    setUpdating(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--v-canvas)]">
        <Spinner />
      </div>
    );
  }

  if (!transaction || !listing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--v-canvas)]">
        <p className="text-[var(--v-text-muted)]">Transaction not found.</p>
      </div>
    );
  }

  const isBuyer = user.id === transaction.buyer_id;
  const isSeller = user.id === transaction.seller_id;
  const currentStepIndex = STEPS.indexOf(transaction.status);
  const date = new Date(transaction.created_at).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[var(--v-canvas)] pb-28">
      <div className="mx-auto max-w-lg px-5">
        {/* Header */}
        <div className="v-rise flex items-center justify-between pt-12 pb-6">
          <Link
            href="/orders"
            className="v-press flex items-center gap-2 text-sm text-[var(--v-text-muted)] hover:text-white"
          >
            ← Orders
          </Link>
          <StatusBadge status={transaction.status} />
        </div>

        {/* Main Card */}
        <div className="v-rise v-rise-1">
          <div className="v-glass-edge v-shadow rounded-[var(--v-radius-card)] border border-[var(--v-border-strong)] bg-[var(--v-surface-1)] p-6">
            <h1 className="mb-1 text-2xl font-bold text-white">
              Escrow Transaction
            </h1>
            <p className="mb-6 text-xs text-[var(--v-text-dim)]">
              ID: {transaction.id.slice(0, 8)}… · {date}
            </p>

            {/* Timeline */}
            <div className="mb-8">
              <div className="relative">
                <div className="absolute left-4 top-4 h-[calc(100%-2rem)] w-0.5 bg-[var(--v-border)]" />
                <div className="space-y-4">
                  {STEPS.map((step, index) => {
                    const isCompleted = index < currentStepIndex;
                    const isCurrent = index === currentStepIndex;
                    const isFuture = index > currentStepIndex;

                    return (
                      <div
                        key={step}
                        className="relative flex items-start gap-4"
                      >
                        <div
                          className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                            isCompleted
                              ? "border-[var(--v-accent)] bg-[var(--v-accent)] text-white"
                              : isCurrent
                                ? "border-[var(--v-accent)] bg-[var(--v-surface-1)] text-[var(--v-accent)]"
                                : "border-[var(--v-border)] bg-[var(--v-surface-1)] text-[var(--v-text-dim)]"
                          }`}
                        >
                          {isCompleted ? "✓" : index + 1}
                        </div>
                        <div className="flex-1 pt-1">
                          <p
                            className={`text-sm font-semibold capitalize ${
                              isCompleted || isCurrent
                                ? "text-white"
                                : "text-[var(--v-text-dim)]"
                            }`}
                          >
                            {step}
                          </p>
                          <p className="text-[11px] text-[var(--v-text-muted)]">
                            {step === "pending" &&
                              "Awaiting payment confirmation"}
                            {step === "paid" &&
                              isSeller &&
                              "Seller: mark as shipped to proceed"}
                            {step === "paid" &&
                              isBuyer &&
                              "Seller has been notified to ship"}
                            {step === "shipped" &&
                              isBuyer &&
                              "Confirm delivery to release funds"}
                            {step === "shipped" &&
                              isSeller &&
                              "Buyer will confirm receipt"}
                            {step === "delivered" && "Funds released to seller"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Product + Details */}
            {listing.image_url && (
              <img
                src={listing.image_url}
                alt={listing.title}
                className="mb-4 h-40 w-full rounded-2xl object-cover"
              />
            )}

            <div className="v-surface-2 mb-6 space-y-3 rounded-2xl p-4">
              <div className="flex justify-between">
                <span className="text-sm text-[var(--v-text-muted)]">Item</span>
                <span className="text-right text-sm font-medium text-white">
                  {listing.title}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-[var(--v-text-muted)]">
                  Amount Held
                </span>
                <span className="v-num text-lg font-bold text-[var(--v-accent)]">
                  ₦{listing.price.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-[var(--v-text-muted)]">
                  Seller
                </span>
                <span className="text-sm font-medium text-white">
                  {listing.business_name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-[var(--v-text-muted)]">
                  Buyer
                </span>
                <span className="text-sm font-medium text-white">
                  {isBuyer ? "You" : "Verified Buyer"}
                </span>
              </div>
            </div>

            {/* Actions */}
            {transaction.status === "paid" && isSeller && (
              <button
                onClick={() => updateStatus("shipped")}
                disabled={updating}
                className="v-press w-full rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 py-3.5 font-bold text-white shadow-lg shadow-violet-500/30 disabled:opacity-50"
              >
                {updating ? "Updating..." : "📦 Mark as Shipped"}
              </button>
            )}

            {transaction.status === "shipped" && isBuyer && (
              <div className="space-y-3">
                <button
                  onClick={() => updateStatus("delivered")}
                  disabled={updating}
                  className="v-press w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3.5 font-bold text-white shadow-lg shadow-emerald-500/30 disabled:opacity-50"
                >
                  {updating
                    ? "Updating..."
                    : "✅ Confirm Delivery & Release Funds"}
                </button>
                <button
                  onClick={() => updateStatus("disputed")}
                  disabled={updating}
                  className="v-press w-full rounded-xl border border-rose-500/25 bg-rose-500/[0.08] py-3 font-medium text-rose-300 transition-colors hover:bg-rose-500/15 disabled:opacity-50"
                >
                  ⚠️ Report an Issue (Dispute)
                </button>
              </div>
            )}

            {transaction.status === "delivered" && (
              <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/[0.08] p-4 text-center">
                <p className="font-bold text-emerald-300">
                  ✅ Transaction Completed! Funds released to seller.
                </p>
              </div>
            )}

            {transaction.status === "pending" && (
              <p className="py-4 text-center text-sm text-[var(--v-text-muted)]">
                Waiting for payment confirmation…
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
