import Link from "next/link";

export default function QuickAction({
  href,
  icon,
  label,
}: {
  href: string;
  icon: string;
  label: string;
}) {
  return (
    <Link href={href} className="group flex flex-col items-center gap-2">
      <div className="v-surface v-press flex h-14 w-14 items-center justify-center rounded-[18px] text-2xl group-hover:border-[var(--v-border-strong)] group-hover:bg-[var(--v-surface-2)]">
        <span className="transition-transform duration-200 group-hover:scale-110">
          {icon}
        </span>
      </div>
      <span className="text-center text-[11px] font-medium text-[var(--v-text-muted)] group-hover:text-slate-300">
        {label}
      </span>
    </Link>
  );
}
