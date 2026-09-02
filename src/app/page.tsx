"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "saving" | "done" | "dupe" | "error"
  >("idle");
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setLoggedIn(!!data.user));
  }, []);

  const joinWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("saving");
    const { error } = await supabase
      .from("waitlist")
      .insert({ email: email.trim().toLowerCase() });

    if (error && error.code === "23505") setStatus("dupe");
    else if (error) setStatus("error");
    else setStatus("done");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--v-canvas)]">
      {/* Floating wireframe cubes — premium depth effect */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Background glow */}
        <div className="absolute left-1/2 top-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-500/[0.08] blur-[120px]" />

        {/* Large background cubes (far away, slow, faint) */}
        <div
          className="absolute -left-10 top-[10%] h-40 w-40 border border-sky-400/10"
          style={{ animation: "float-cube 14s ease-in-out infinite" }}
        />
        <div
          className="absolute -right-16 top-[40%] h-56 w-56 border border-blue-400/[0.07]"
          style={{ animation: "float-cube-reverse 18s ease-in-out infinite" }}
        />

        {/* Medium mid-ground cubes */}
        <div
          className="absolute left-[8%] top-[25%] h-24 w-24 border border-sky-400/20"
          style={{ animation: "float-cube-reverse 9s ease-in-out infinite" }}
        />
        <div
          className="absolute right-[12%] top-[15%] h-20 w-20 border border-cyan-400/15"
          style={{ animation: "float-cube 11s ease-in-out infinite" }}
        />
        <div
          className="absolute left-[15%] bottom-[20%] h-28 w-28 border border-blue-400/15"
          style={{ animation: "float-cube 12s ease-in-out infinite" }}
        />

        {/* Small foreground cubes (close, faster, brighter) */}
        <div
          className="absolute right-[20%] top-[60%] h-12 w-12 border border-sky-400/30"
          style={{ animation: "float-cube-reverse 6s ease-in-out infinite" }}
        />
        <div
          className="absolute left-[25%] top-[55%] h-8 w-8 border border-cyan-400/25"
          style={{ animation: "float-cube 7s ease-in-out infinite" }}
        />
        <div
          className="absolute right-[8%] bottom-[15%] h-16 w-16 border border-sky-400/20"
          style={{ animation: "float-cube-reverse 8s ease-in-out infinite" }}
        />
      </div>

      <div className="relative mx-auto max-w-lg px-5 pb-20">
        {/* Top bar */}
        <header className="v-rise flex items-center justify-between pt-10 pb-14">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 shadow-lg shadow-blue-500/30">
              <span className="text-base font-black text-white">V</span>
            </div>
            <span className="text-lg font-bold text-white">Vendly</span>
          </div>
          {loggedIn ? (
            <Link
              href="/dashboard"
              className="v-press rounded-xl bg-gradient-to-r from-sky-400 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20"
            >
              Open Dashboard
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="v-press px-3 py-2 text-sm text-[var(--v-text-muted)] hover:text-white"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="v-press rounded-xl border border-[var(--v-border-strong)] bg-[var(--v-surface-1)] px-4 py-2 text-sm font-semibold text-white"
              >
                Sign Up
              </Link>
            </div>
          )}
        </header>

        {/* Hero */}
        <div className="v-rise v-rise-1 text-center">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-[11px] font-semibold text-sky-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sky-400" />
            Launching soon in Nigeria
          </span>
          <h1 className="mb-4 text-4xl font-black leading-tight text-white sm:text-5xl">
            Buy & sell
            <br />
            <span className="v-gradient-text">without fear.</span>
          </h1>
          <p className="mx-auto mb-8 max-w-sm text-[15px] leading-relaxed text-[var(--v-text-muted)]">
            Vendly holds every payment safely until the buyer receives exactly
            what they ordered. No more "pay first and pray."
          </p>

          {/* Waitlist form */}
          {status === "done" || status === "dupe" ? (
            <div className="v-rise v-glass-edge mx-auto max-w-sm rounded-[var(--v-radius-card)] border border-emerald-400/20 bg-emerald-400/[0.07] p-6">
              <div className="mb-2 text-3xl">🎉</div>
              <p className="font-semibold text-white">
                {status === "dupe"
                  ? "You're already on the list!"
                  : "You're on the list!"}
              </p>
              <p className="mt-1 text-sm text-[var(--v-text-muted)]">
                We'll email you the moment Vendly goes live.
              </p>
            </div>
          ) : (
            <form
              onSubmit={joinWaitlist}
              className="mx-auto flex max-w-sm gap-2"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="v-surface min-w-0 flex-1 rounded-xl px-4 py-3.5 text-white placeholder-[var(--v-text-dim)] transition-colors focus:border-[var(--v-accent)] focus:outline-none"
              />
              <button
                type="submit"
                disabled={status === "saving"}
                className="v-press shrink-0 rounded-xl bg-gradient-to-r from-sky-400 to-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 disabled:opacity-50"
              >
                {status === "saving" ? "..." : "Join"}
              </button>
            </form>
          )}
          {status === "error" && (
            <p className="mt-3 text-xs text-rose-300">
              Something went wrong — try again.
            </p>
          )}
          <p className="mt-3 text-[11px] text-[var(--v-text-dim)]">
            No spam. Just one email when we launch.
          </p>
        </div>

        {/* How it works */}
        <div className="v-rise v-rise-2 mt-16">
          <h2 className="mb-4 text-center text-sm font-semibold uppercase tracking-[0.14em] text-[var(--v-text-dim)]">
            How Vendly protects you
          </h2>
          <div className="space-y-3">
            <StepCard
              n="1"
              icon="💳"
              title="Buyer pays securely"
              text="Money goes to Vendly's escrow — not straight to the seller."
            />
            <StepCard
              n="2"
              icon="📦"
              title="Seller delivers"
              text="The seller ships or hands over the item, knowing payment is guaranteed."
            />
            <StepCard
              n="3"
              icon="✅"
              title="Buyer confirms, seller gets paid"
              text="Vendly releases the money only after the buyer says all is good."
            />
          </div>
        </div>

        {/* Seller strip */}
        <div className="v-rise v-rise-3 v-glass-edge v-shadow mt-8 rounded-[var(--v-radius-card)] border border-[var(--v-border-strong)] bg-gradient-to-br from-[#101a2e] via-[#0d1424] to-[#0a0f1c] p-6 text-center">
          <p className="text-2xl">🛍️</p>
          <h3 className="mt-2 font-bold text-white">
            Sellers: get paid, guaranteed.
          </h3>
          <p className="mt-1 text-sm text-[var(--v-text-muted)]">
            No more chasing payments or getting ghosted. Just a simple 3% fee
            when you sell.
          </p>
        </div>

        {/* Footer */}
        <footer className="mt-14 text-center text-[11px] text-[var(--v-text-dim)]">
          © 2026 Vendly · Built for trust 🔷
        </footer>
      </div>
    </div>
  );
}

function StepCard({
  n,
  icon,
  title,
  text,
}: {
  n: string;
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="v-surface v-hover flex items-start gap-4 rounded-[var(--v-radius-card)] p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400/15 to-blue-600/15 text-lg">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-white">
          <span className="mr-1.5 text-[var(--v-accent)]">{n}.</span>
          {title}
        </p>
        <p className="mt-0.5 text-[13px] leading-relaxed text-[var(--v-text-muted)]">
          {text}
        </p>
      </div>
    </div>
  );
}
