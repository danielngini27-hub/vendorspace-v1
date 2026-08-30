"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

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
        // Fetch transaction
        const { data: txData } = await supabase
          .from("escrow_transactions")
          .select("*")
          .eq("id", transactionId)
          .single();

        if (txData) {
          setTransaction(txData);

          // Fetch related listing details
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
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        Loading transaction...
      </div>
    );
  }

  if (!transaction || !listing) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        Transaction not found.
      </div>
    );
  }

  // Determine if user is buyer or seller
  const isBuyer = user.id === transaction.buyer_id;
  const isSeller = user.id === transaction.seller_id;

  // Status Colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "paid":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      case "shipped":
        return "bg-purple-500/20 text-purple-400 border-purple-500/50";
      case "delivered":
        return "bg-green-500/20 text-green-400 border-green-500/50";
      case "disputed":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      default:
        return "bg-slate-500/20 text-slate-400";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/marketplace"
            className="text-slate-400 hover:text-white flex items-center gap-2"
          >
            ← Back to Marketplace
          </Link>
          <span
            className={`px-4 py-1 rounded-full border text-sm font-bold uppercase tracking-wider ${getStatusColor(transaction.status)}`}
          >
            {transaction.status}
          </span>
        </div>

        {/* Main Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            Escrow Transaction
          </h1>
          <p className="text-slate-400 mb-8 text-sm">
            ID: {transaction.id.slice(0, 8)}...
          </p>

          {/* Progress Bar */}
          <div className="flex items-center justify-between mb-10 relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -z-10 transform -translate-y-1/2"></div>
            {["pending", "paid", "shipped", "delivered"].map((step, index) => {
              const steps = ["pending", "paid", "shipped", "delivered"];
              const currentStepIndex = steps.indexOf(transaction.status);
              const isActive = index <= currentStepIndex;

              return (
                <div key={step} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${isActive ? "bg-blue-500 text-white" : "bg-slate-800 text-slate-500"}`}
                  >
                    {index + 1}
                  </div>
                  <span
                    className={`text-xs mt-2 capitalize ${isActive ? "text-white" : "text-slate-500"}`}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-800/50 p-4 rounded-xl">
              <p className="text-slate-400 text-xs mb-1">Item</p>
              <p className="text-white font-bold text-lg">{listing.title}</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-xl">
              <p className="text-slate-400 text-xs mb-1">Amount Held</p>
              <p className="text-cyan-400 font-bold text-2xl">
                ₦{listing.price.toLocaleString()}
              </p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-xl">
              <p className="text-slate-400 text-xs mb-1">Seller</p>
              <p className="text-white font-medium">{listing.business_name}</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-xl">
              <p className="text-slate-400 text-xs mb-1">Buyer</p>
              <p className="text-white font-medium">
                {isBuyer ? "You" : "Verified Buyer"}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t border-slate-800 pt-6">
            <h3 className="text-white font-bold mb-4">Actions</h3>

            {transaction.status === "paid" && isSeller && (
              <button
                onClick={() => updateStatus("shipped")}
                disabled={updating}
                className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all disabled:opacity-50"
              >
                {updating ? "Updating..." : "📦 Mark as Shipped"}
              </button>
            )}

            {transaction.status === "shipped" && isBuyer && (
              <div className="space-y-3">
                <button
                  onClick={() => updateStatus("delivered")}
                  disabled={updating}
                  className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl transition-all disabled:opacity-50"
                >
                  {updating
                    ? "Updating..."
                    : "✅ Confirm Delivery & Release Funds"}
                </button>
                <button
                  onClick={() => updateStatus("disputed")}
                  className="w-full py-3 bg-red-900/50 hover:bg-red-900 text-red-400 font-medium rounded-xl transition-all border border-red-900"
                >
                  ⚠️ Report an Issue (Dispute)
                </button>
              </div>
            )}

            {transaction.status === "delivered" && (
              <div className="text-center py-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                <p className="text-green-400 font-bold">
                  Transaction Completed! Funds released to seller.
                </p>
              </div>
            )}

            {transaction.status === "pending" && (
              <p className="text-slate-400 text-center py-4">
                Waiting for payment confirmation...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
