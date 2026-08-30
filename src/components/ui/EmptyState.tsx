import { ReactNode } from "react";

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="v-surface flex flex-col items-center rounded-[var(--v-radius-card)] px-6 py-10 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-3xl">
        {icon}
      </div>
      <p className="text-base font-semibold text-white">{title}</p>
      <p className="mt-1 max-w-xs text-sm text-[var(--v-text-muted)]">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
