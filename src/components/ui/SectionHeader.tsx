import { ReactNode } from "react";
import Link from "next/link";

export default function SectionHeader({
  title,
  actionHref,
  actionLabel = "See all",
  right,
}: {
  title: string;
  actionHref?: string;
  actionLabel?: string;
  right?: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h3 className="text-[15px] font-semibold text-white">{title}</h3>
      {right ??
        (actionHref && (
          <Link
            href={actionHref}
            className="text-xs font-medium text-[var(--v-accent)] transition-colors hover:text-sky-300"
          >
            {actionLabel} →
          </Link>
        ))}
    </div>
  );
}
