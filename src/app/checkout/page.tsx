"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Spinner from "@/components/ui/Spinner";

const ESCROW_STEPS = [
  "You pay → Vendly holds it safely",
  "Seller is notified to ship/deliver",
  "You confirm receipt & quality",
  "Vendly releases money to seller",
];

export default function CheckoutPage() {
  const [user, setUser] = useState<any>(null);
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const listingId = searchParams.get("id");

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

      if (listingId) {
        const { data } = await supabase
          .from("listings")
          .select("*")
          .eq("id", listingId)
          .single();

        if (data) {
          setListing(data);
        } else {
          alert("Listing not found!");
          router.push("/marketplace");
        }
      }
      setLoading(false);
    };
    init();
  }, [listingId, router]);

  const handleInitiateEscrow = async () => {
    if (!user || !listing) return;

    if (listing.vendor_id === user.id) {
      alert("You cannot buy your own listing!");
      return;
    }

    setProcessing(true);

    const { data, error } = await supabase
      .from("escrow_transactions")
      .insert([
        {
          listing_id: listing.id,
          buyer_id: user.id,
          seller_id: listing.vendor_id,
          amount: listing.price,
          status: "pending",
        },
      ])
      .select();

    if (error) {
      alert("Error creating transaction: " + error.message);
      setProcessing(false);
    } else {
      alert(
        `Escrow initiated for ₦${listing.price.toLocaleString()}!\n\nIn production, this would redirect to Paystack/Flutterwave payment page.`,
      );

      await supabase
        .from("escrow_transactions")
        .update({ status: "paid" })
        .eq("id", data[0].id);

      router.push(`/transaction/${data[0].id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--v-canvas)]">
        <Spinner />
      </div>
    );
  }

  if (!listing) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--v-canvas)] p-4">
      <div className="v-rise v-glass-edge v-shadow w-full max-w-lg rounded-[var(--v-radius-card)] border border-[var(--v-border-strong)] bg-[var(--v-surface-1)] p-6 sm:p-8">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 shadow-lg shadow-emerald-500/30">
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-white">
            Secure Checkout
          </h1>
          <p className="text-sm text-[var(--v-text-muted)]">
            Your payment is protected by Vendly Escrow
          </p>
        </div>

        {/* Order summary */}
        <div className="v-surface-2 mb-5 space-y-3 rounded-2xl p-5">
          {listing.image_url && (
            <img
              src={listing.image_url}
              alt={listing.title}
              className="mb-1 h-36 w-full rounded-xl object-cover"
            />
          )}
          <div className="flex justify-between gap-3">
            <span className="text-[var(--v-text-muted)]">Item</span>
            <span className="text-right font-medium text-white">
              {listing.title}
            </span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-[var(--v-text-muted)]">Seller</span>
            <span className="text-right font-medium text-white">
              {listing.business_name}
            </span>
          </div>
          <div className="flex justify-between gap-3">
            <span className="text-[var(--v-text-muted)]">Category</span>
            <span className="text-right font-medium text-white">
              {listing.category}
            </span>
          </div>
          <div className="flex justify-between border-t border-[var(--v-border)] pt-3">
            <span className="font-medium text-slate-300">Total</span>
            <span className="v-num text-xl font-bold text-[var(--v-accent)]">
              ₦{listing.price.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Escrow explainer */}
        <div className="mb-6 rounded-2xl border border-sky-400/20 bg-sky-400/[0.07] p-4">
          <h3 className="mb-3 text-sm font-semibold text-sky-300">
            🔒 How Escrow Works
          </h3>
          <ol className="space-y-2">
            {ESCROW_STEPS.map((step, i) => (
              <li
                key={i}
                className="flex items-start gap-2.5 text-xs text-slate-300"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-400/15 text-[10px] font-bold text-sky-300">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* Pay */}
        <button
          onClick={handleInitiateEscrow}
          disabled={processing}
          className="v-press mb-3 w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-4 font-bold text-white shadow-lg shadow-emerald-500/30 transition-all disabled:opacity-50"
        >
          {processing
            ? "Processing..."
            : `Pay ₦${listing.price.toLocaleString()} Securely`}
        </button>

        <Link
          href="/marketplace"
          className="block w-full py-3 text-center text-sm text-[var(--v-text-muted)] transition-colors hover:text-white"
        >
          Cancel & Go Back
        </Link>
      </div>
    </div>
  );
}
