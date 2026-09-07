import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-vendly-background text-vendly-text flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Subtle Background Glow for Premium Feel */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-vendly-primary/20 blur-[120px] rounded-full pointer-events-none" />

      {/* Navigation */}
      <nav className="absolute top-0 w-full max-w-6xl flex justify-between items-center py-6 z-10">
        <div className="flex items-center gap-2">
          {/* Simple Logo Placeholder */}
          <div className="w-8 h-8 rounded-lg bg-hero-gradient flex items-center justify-center font-bold text-white">
            V
          </div>
          <span className="text-xl font-bold tracking-tight">Vendly</span>
        </div>
        <div className="flex gap-4">
          <Link
            href="/login"
            className="text-vendly-muted hover:text-vendly-text transition-colors text-sm font-medium"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="bg-vendly-surface border border-vendly-border hover:border-vendly-primary/50 text-vendly-text px-4 py-2 rounded-lg text-sm font-medium transition-all"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 max-w-3xl text-center space-y-8 mt-10">
        {/* Trust Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vendly-surface border border-vendly-border text-xs text-vendly-muted">
          <span className="w-2 h-2 rounded-full bg-vendly-success animate-pulse" />
          Secure Escrow Marketplace
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">
          Buy and sell <br />
          <span className="text-transparent bg-clip-text bg-hero-gradient">
            without fear.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg text-vendly-muted max-w-xl mx-auto leading-relaxed">
          Vendly holds every payment safely until the buyer receives exactly
          what they ordered. No more "pay first and pray."
        </p>

        {/* Call to Action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Link
            href="/signup"
            className="w-full sm:w-auto bg-hero-gradient text-white px-8 py-3.5 rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg shadow-vendly-primary/20"
          >
            Create Free Account
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto bg-vendly-surface border border-vendly-border text-vendly-text px-8 py-3.5 rounded-xl font-semibold hover:bg-vendly-elevated transition-all"
          >
            Log In to Dashboard
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-2xl mx-auto">
          <div className="space-y-2">
            <div className="text-vendly-accent text-xl">🛡️</div>
            <h3 className="font-semibold text-sm">Protected Payments</h3>
            <p className="text-xs text-vendly-muted">
              Funds held securely until delivery is confirmed.
            </p>
          </div>
          <div className="space-y-2">
            <div className="text-vendly-accent text-xl">⚡</div>
            <h3 className="font-semibold text-sm">Instant Settlement</h3>
            <p className="text-xs text-vendly-muted">
              Sellers get paid immediately upon buyer confirmation.
            </p>
          </div>
          <div className="space-y-2">
            <div className="text-vendly-accent text-xl">🇳🇬</div>
            <h3 className="font-semibold text-sm">Built for Nigeria</h3>
            <p className="text-xs text-vendly-muted">
              Optimized for local banks and mobile money.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
