import MiniSparkline from "./MiniSparkline";

export default function EarningsCard({
  earned,
  pending,
  trend = [2, 3, 3, 5, 4, 6, 7, 9],
}: {
  earned: number;
  pending: number;
  trend?: number[];
}) {
  const first = trend[0] || 1;
  const last = trend[trend.length - 1] || 1;
  const deltaPct = Math.round(((last - first) / first) * 100);
  const positive = deltaPct >= 0;

  return (
    <div className="v-glass-edge v-shadow relative overflow-hidden rounded-[var(--v-radius-card)] border border-emerald-400/15 bg-gradient-to-br from-[#0f1d1a] via-[#0d1620] to-[#0b1018] p-6">
      {/* restrained glow — low opacity, corners only */}
      <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-emerald-500/[0.08] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-cyan-500/[0.05] blur-3xl" />

      <div className="relative flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-400/10 text-xs">
              💰
            </span>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-300/80">
              Commission Earnings
            </p>
          </div>

          <div className="mt-3 flex items-end gap-3">
            <h2 className="v-num text-[40px] font-bold leading-none tracking-tight text-white">
              ₦{earned.toLocaleString()}
            </h2>
            <span
              className={`mb-1 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${
                positive
                  ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                  : "border-rose-400/20 bg-rose-400/10 text-rose-300"
              }`}
            >
              {positive ? "↑" : "↓"} {Math.abs(deltaPct)}%
            </span>
          </div>

          <p className="mt-2 text-[13px] text-[var(--v-text-muted)]">
            <span className="font-medium text-slate-300">
              +₦{pending.toLocaleString()}
            </span>{" "}
            pending in active escrows
          </p>
        </div>

        <div className="hidden w-[120px] shrink-0 sm:block">
          <MiniSparkline data={trend} className="h-9 w-full" />
          <p className="mt-1 text-right text-[10px] text-[var(--v-text-dim)]">
            last 8 sales
          </p>
        </div>
      </div>

      <div className="relative mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
        <div className="flex items-center gap-2 text-[12px] text-[var(--v-text-muted)]">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          3% platform fee · auto-collected
        </div>
        <span className="text-[12px] font-medium text-slate-400">
          Owner view
        </span>
      </div>
    </div>
  );
}
