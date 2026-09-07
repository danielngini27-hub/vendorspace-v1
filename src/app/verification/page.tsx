"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function VerificationPage() {
  const [idType, setIdType] = useState("bvn");
  const [idNumber, setIdNumber] = useState("");
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!ageConfirmed) {
      setError("Please confirm you are 18 or older.");
      return;
    }

    setLoading(true);

    try {
      // 1. Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("User not authenticated.");

      // 2. Insert into the new secure 'verifications' table
      const { error: dbError } = await supabase.from("verifications").upsert(
        {
          user_id: user.id,
          id_type: idType,
          id_number: idNumber,
          status: "pending", // In a real app, an admin or API would change this to 'verified'
        },
        { onConflict: "user_id, id_type" },
      );

      if (dbError) throw dbError;

      // 3. Success
      setShowSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err: any) {
      console.error("Verification error:", err);
      setError(err.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-vendly-background text-vendly-text py-12 px-4">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-6 right-6 bg-vendly-success text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-bounce">
          <svg
            className="w-6 h-6"
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
          <span className="font-bold">✅ Verification submitted securely!</span>
        </div>
      )}

      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <Link
            href="/dashboard"
            className="text-vendly-accent hover:underline text-sm inline-flex items-center gap-1"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold mt-4 mb-2">Verify Your Identity</h1>
          <p className="text-vendly-muted">Required for secure transactions</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-vendly-surface backdrop-blur-md rounded-xl p-8 border border-vendly-border"
        >
          {error && (
            <div className="mb-4 p-3 bg-vendly-error/20 border border-vendly-error rounded-lg text-vendly-error text-sm">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-vendly-text text-sm font-medium mb-3">
              Select ID Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIdType("bvn")}
                className={`py-3 px-4 rounded-lg border-2 transition-all font-semibold ${idType === "bvn" ? "border-vendly-primary bg-vendly-primary/20 text-vendly-text" : "border-vendly-border text-vendly-muted hover:border-vendly-primary/50"}`}
              >
                BVN
              </button>
              <button
                type="button"
                onClick={() => setIdType("nin")}
                className={`py-3 px-4 rounded-lg border-2 transition-all font-semibold ${idType === "nin" ? "border-vendly-primary bg-vendly-primary/20 text-vendly-text" : "border-vendly-border text-vendly-muted hover:border-vendly-primary/50"}`}
              >
                NIN
              </button>
            </div>
            <p className="text-vendly-muted text-xs mt-2">
              {idType === "nin"
                ? "⚠️ NIN accounts limited to ₦50,000"
                : "✅ BVN allows unlimited transactions"}
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-vendly-text text-sm font-medium mb-2">
              Enter your {idType.toUpperCase()} Number
            </label>
            <input
              type="text"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value.replace(/\D/g, ""))}
              placeholder="11-digit number"
              maxLength={11}
              className="w-full px-4 py-3 rounded-lg bg-vendly-background border border-vendly-border text-vendly-text placeholder-vendly-muted focus:outline-none focus:border-vendly-primary"
              required
            />
          </div>

          <div className="mb-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={ageConfirmed}
                onChange={(e) => setAgeConfirmed(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-vendly-border bg-vendly-background text-vendly-primary focus:ring-vendly-primary"
              />
              <span className="text-vendly-muted text-sm">
                I confirm I am 18+ years old
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !ageConfirmed}
            className="w-full bg-hero-gradient text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all disabled:opacity-50"
          >
            {loading ? "Securing Data..." : "Submit Verification"}
          </button>
        </form>
      </div>
    </div>
  );
}
