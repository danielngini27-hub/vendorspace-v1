"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function VerificationPage() {
  const [idType, setIdType] = useState("bvn");
  const [idNumber, setIdNumber] = useState("");
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ageConfirmed) {
      alert("Please confirm you are 18 or older");
      return;
    }

    setLoading(true);

    // Simulate saving to database
    setTimeout(() => {
      setLoading(false);
      setShowSuccess(true); // Show the smooth green toast

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push("/dashboard?verified=true");
      }, 2000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-12 px-4">
      {/* Smooth Success Toast (Replaces the ugly popup) */}
      {showSuccess && (
        <div className="fixed top-6 right-6 bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-bounce">
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
          <span className="font-bold">
            Verification submitted successfully!
          </span>
        </div>
      )}

      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/dashboard"
            className="text-blue-400 hover:underline text-sm inline-flex items-center gap-1"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-white mt-4 mb-2">
            Verify Your Identity
          </h1>
          <p className="text-blue-200">Required for secure transactions</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20"
        >
          {/* ID Type Selection */}
          <div className="mb-6">
            <label className="block text-white text-sm font-medium mb-3">
              Select ID Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIdType("bvn")}
                className={`py-3 px-4 rounded-lg border-2 transition-all font-semibold ${
                  idType === "bvn"
                    ? "border-blue-500 bg-blue-500/20 text-white"
                    : "border-white/20 text-blue-200 hover:bg-white/5"
                }`}
              >
                BVN
              </button>
              <button
                type="button"
                onClick={() => setIdType("nin")}
                className={`py-3 px-4 rounded-lg border-2 transition-all font-semibold ${
                  idType === "nin"
                    ? "border-blue-500 bg-blue-500/20 text-white"
                    : "border-white/20 text-blue-200 hover:bg-white/5"
                }`}
              >
                NIN
              </button>
            </div>
            <p className="text-blue-300 text-xs mt-2">
              {idType === "nin"
                ? "⚠️ NIN accounts limited to ₦50,000 per transaction"
                : "✅ BVN allows unlimited transactions"}
            </p>
          </div>

          {/* ID Number Input */}
          <div className="mb-6">
            <label className="block text-white text-sm font-medium mb-2">
              Enter your {idType.toUpperCase()} Number
            </label>
            <input
              type="text"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value.replace(/\D/g, ""))}
              placeholder={idType === "bvn" ? "11-digit BVN" : "11-digit NIN"}
              maxLength={11}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder-blue-300 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Age Confirmation */}
          <div className="mb-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={ageConfirmed}
                onChange={(e) => setAgeConfirmed(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-blue-200 text-sm">
                I confirm that I am 18 years or older and agree to the Terms of
                Service
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !ageConfirmed}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Submit Verification"}
          </button>
        </form>

        <div className="mt-6 text-center text-blue-300 text-sm">
          <p>🔒 Your information is encrypted and secure</p>
        </div>
      </div>
    </div>
  );
}
