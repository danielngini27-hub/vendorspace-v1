"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Spinner from "@/components/ui/Spinner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--v-canvas)] p-4">
      {/* Restrained glow — not overwhelming */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/[0.08] blur-[100px]" />

      <div className="v-rise v-glass-edge v-shadow relative z-10 w-full max-w-md rounded-[var(--v-radius-card)] border border-[var(--v-border-strong)] bg-[var(--v-surface-1)] p-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 shadow-lg shadow-blue-500/30">
            <span className="text-3xl font-black text-white">V</span>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-white">Welcome Back</h1>
          <p className="text-sm text-[var(--v-text-muted)]">
            Sign in to your Vendly account
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="v-rise mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--v-text-muted)]">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="v-surface w-full rounded-xl px-4 py-3 text-white placeholder-[var(--v-text-dim)] transition-colors focus:border-[var(--v-accent)] focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--v-text-muted)]">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="v-surface w-full rounded-xl px-4 py-3 text-white placeholder-[var(--v-text-dim)] transition-colors focus:border-[var(--v-accent)] focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-[var(--v-border-strong)] bg-[var(--v-surface-2)] text-blue-500"
              />
              <span className="text-sm text-[var(--v-text-muted)]">
                Remember me
              </span>
            </label>
            <Link
              href="/forgot-password"
              className="text-sm text-[var(--v-accent)] transition-colors hover:text-sky-300"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="v-press w-full rounded-xl bg-gradient-to-r from-sky-400 to-blue-600 py-3 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-[var(--v-text-muted)]">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-[var(--v-accent)] transition-colors hover:text-sky-300"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
