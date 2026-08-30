export default function StatTile({
  label,
  value,
  sub,
  accent = false,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div className="v-surface rounded-[var(--v-radius-card)] p-4">
      <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--v-text-dim)]">
        {label}
      </p>
      <p
        className={`v-num mt-1.5 text-2xl font-bold ${accent ? "text-[var(--v-accent)]" : "text-white"}`}
      >
        {value}
      </p>
      {sub && (
        <p className="mt-1 text-[11px] text-[var(--v-text-muted)]">{sub}</p>
      )}
    </div>
  );
}
