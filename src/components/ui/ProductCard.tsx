import Link from "next/link";

export default function ProductCard({ listing }: { listing: any }) {
  return (
    <Link
      href={`/checkout?id=${listing.id}`}
      className="v-surface v-hover group flex flex-col overflow-hidden rounded-[var(--v-radius-card)] p-3"
    >
      {listing.image_url ? (
        <img
          src={listing.image_url}
          alt={listing.title}
          className="mb-3 h-32 w-full rounded-2xl object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      ) : (
        <div className="mb-3 flex h-32 w-full items-center justify-center rounded-2xl bg-[var(--v-surface-2)] text-3xl">
          📦
        </div>
      )}

      <span className="mb-1.5 self-start rounded-md border border-[var(--v-border-strong)] bg-white/5 px-2 py-0.5 text-[10px] font-medium text-[var(--v-accent)]">
        {listing.category}
      </span>

      <h3 className="line-clamp-1 text-sm font-semibold text-white">
        {listing.title}
      </h3>
      <p className="mb-2 line-clamp-1 text-[11px] text-[var(--v-text-muted)]">
        {listing.business_name}
      </p>

      <div className="mt-auto flex items-center justify-between border-t border-[var(--v-border)] pt-2.5">
        <span className="v-num text-sm font-bold text-[var(--v-accent)]">
          ₦{Number(listing.price).toLocaleString()}
        </span>
        <span className="v-press rounded-lg bg-gradient-to-r from-sky-400 to-blue-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow-lg shadow-blue-500/20">
          Buy
        </span>
      </div>
    </Link>
  );
}
