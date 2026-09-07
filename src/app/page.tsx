import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-vendly-background text-vendly-text relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-vendly-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-vendly-accent/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-hero-gradient flex items-center justify-center font-bold text-white shadow-lg shadow-vendly-primary/20">
            V
          </div>
          <span className="text-xl font-bold tracking-tight">Vendly</span>
        </div>
        <div className="flex gap-4">
          <Link
            href="/login"
            className="text-vendly-muted hover:text-vendly-text transition-colors text-sm font-medium py-2"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="bg-vendly-surface border border-vendly-border hover:border-vendly-primary/50 text-vendly-text px-5 py-2 rounded-lg text-sm font-medium transition-all"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section - Split Layout */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-20 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        {/* Left Column: Content */}
        <div className="space-y-8 text-center lg:text-left">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-vendly-surface border border-vendly-border text-xs text-vendly-muted mx-auto lg:mx-0">
            <span className="w-2 h-2 rounded-full bg-vendly-success animate-pulse" />
            Secure Escrow Marketplace
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
            Buy and sell <br />
            <span className="text-transparent bg-clip-text bg-hero-gradient">
              without fear.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg text-vendly-muted max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Vendly holds every payment safely until the buyer receives exactly
            what they ordered. No more "pay first and pray."
          </p>

          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
            <Link
              href="/signup"
              className="w-full sm:w-auto bg-hero-gradient text-white px-8 py-3.5 rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg shadow-vendly-primary/20 text-center"
            >
              Create Free Account
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto bg-vendly-surface border border-vendly-border text-vendly-text px-8 py-3.5 rounded-xl font-semibold hover:bg-vendly-elevated transition-all text-center"
            >
              Log In to Dashboard
            </Link>
          </div>

          {/* Trust Stats */}
          <div className="pt-8 flex flex-wrap justify-center lg:justify-start gap-8 text-sm">
            <div className="flex items-center gap-2 text-vendly-muted">
              <svg
                className="w-5 h-5 text-vendly-success"
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
              <span>Protected Payments</span>
            </div>
            <div className="flex items-center gap-2 text-vendly-muted">
              <svg
                className="w-5 h-5 text-vendly-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span>Instant Settlement</span>
            </div>
          </div>
        </div>

        {/* Right Column: App Preview Visual */}
        <div className="relative hidden lg:block">
          {/* Decorative blurred background behind the card */}
          <div className="absolute inset-0 bg-hero-gradient opacity-20 blur-3xl rounded-full transform scale-75" />

          {/* The Mock Dashboard Card */}
          <div className="relative bg-vendly-surface border border-vendly-border rounded-2xl p-6 shadow-2xl backdrop-blur-sm transform hover:scale-[1.02] transition-transform duration-500">
            {/* Card Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <p className="text-vendly-muted text-sm mb-1">
                  Available Balance
                </p>
                <h3 className="text-3xl font-bold text-white">₦ 125,000.00</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-vendly-elevated flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-vendly-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Escrow Status */}
            <div className="bg-vendly-elevated/50 rounded-xl p-4 border border-vendly-border mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-vendly-muted">
                  Protected in Escrow
                </span>
                <span className="text-xs bg-vendly-warning/20 text-vendly-warning px-2 py-0.5 rounded-full">
                  Pending
                </span>
              </div>
              <p className="text-xl font-semibold text-white"> 45,000.00</p>
            </div>

            {/* Mock Transaction List */}
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-lg bg-vendly-background/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-vendly-success/20 flex items-center justify-center text-vendly-success text-xs">
                    ✓
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      iPhone 13 Pro
                    </p>
                    <p className="text-xs text-vendly-muted">Completed</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-vendly-success">
                  + ₦ 350,000
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-vendly-background/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-vendly-primary/20 flex items-center justify-center text-vendly-primary text-xs">
                    ⏳
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      Gaming Laptop
                    </p>
                    <p className="text-xs text-vendly-muted">In Escrow</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-white">
                  ₦ 450,000
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
