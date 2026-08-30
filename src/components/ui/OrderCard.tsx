import Link from "next/link";
import StatusBadge from "./StatusBadge";

const STEP: Record<string, number> = {
  paid: 2,
  shipped: 3,
  delivered: 4,
  disputed: 0,
};

export default function OrderCard({
  order,
  perspective,
}: {
  order: any;
  perspective: "buying" | "selling";
}) {
  const step = STEP[order.status] ?? 1;
  const other = perspective === "buying" ? order.seller_id : order.buyer_id;
  const disputed = order.status === "disputed";
  const date = order.created_at
    ? new Date(order.created_at).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <Link
      href={`/transaction/${order.id}`}
      className="v-surface v-hover v-press block rounded-[var(--v-radius-card)] p-4"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="truncate pr-2 font-semibold text-white">
          {order.item_name || "Escrow Transaction"}
        </h3>
        <StatusBadge status={order.status} />
      </div>

      <div className="flex items-center justify-between">
        <span className="v-num text-lg font-bold text-[var(--v-accent)]">
          ₦{Number(order.amount).toLocaleString()}
        </span>
        <span className="text-[11px] text-[var(--v-text-dim)]">
          {perspective === "buying" ? "Seller" : "Buyer"}: {other?.slice(0, 8)}…
          {date && ` · ${date}`}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mt-3 flex gap-1">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full transition-colors ${
              s <= step
                ? disputed
                  ? "bg-rose-400"
                  : "bg-[var(--v-accent)]"
                : "bg-white/10"
            }`}
          />
        ))}
      </div>
    </Link>
  );
}
