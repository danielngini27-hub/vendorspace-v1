const map: Record<string, { label: string; cls: string; dot: string }> = {
  active: {
    label: "Active",
    cls: "text-emerald-300 bg-emerald-400/10 border-emerald-400/20",
    dot: "bg-emerald-400",
  },
  paid: {
    label: "Paid",
    cls: "text-sky-300 bg-sky-400/10 border-sky-400/20",
    dot: "bg-sky-400",
  },
  shipped: {
    label: "Shipped",
    cls: "text-violet-300 bg-violet-400/10 border-violet-400/20",
    dot: "bg-violet-400",
  },
  delivered: {
    label: "Delivered",
    cls: "text-emerald-300 bg-emerald-400/10 border-emerald-400/20",
    dot: "bg-emerald-400",
  },
  disputed: {
    label: "Disputed",
    cls: "text-rose-300 bg-rose-400/10 border-rose-400/20",
    dot: "bg-rose-400",
  },
};

export default function StatusBadge({ status }: { status: string }) {
  const s = map[status] || {
    label: status,
    cls: "text-slate-300 bg-white/5 border-white/10",
    dot: "bg-slate-400",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${s.cls}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}
