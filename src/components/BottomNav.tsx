"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/dashboard", label: "Home", icon: "🏡" },
  { href: "/marketplace", label: "Market", icon: "🛍️" },
  { href: "/orders", label: "Orders", icon: "📦" },
  { href: "/profile", label: "Profile", icon: "👤" },
];

function NavItem({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: string;
}) {
  const pathname = usePathname();
  const active =
    pathname === href || (href === "/dashboard" && pathname === "/");

  return (
    <Link
      href={href}
      className="v-press flex flex-1 flex-col items-center gap-1 py-2"
    >
      <span
        className={`text-xl transition-all duration-200 ${active ? "scale-110" : "opacity-50"}`}
      >
        {icon}
      </span>
      <span
        className={`text-[10px] font-medium transition-colors ${active ? "text-[var(--v-accent)]" : "text-[var(--v-text-dim)]"}`}
      >
        {label}
      </span>
      <span
        className={`h-1 w-1 rounded-full transition-colors ${active ? "bg-[var(--v-accent)]" : "bg-transparent"}`}
      />
    </Link>
  );
}

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-lg -translate-x-1/2 border-t border-[var(--v-border)] bg-[#0a0f1c]/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl">
      <div className="flex items-end px-2">
        <NavItem {...items[0]} />
        <NavItem {...items[1]} />

        {/* Center FAB — Sell */}
        <Link
          href="/listings"
          aria-label="Sell an item"
          className="v-press flex flex-1 flex-col items-center gap-1 py-2"
        >
          <span className="-mt-6 flex h-13 w-13 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600 p-4 text-xl font-bold text-white shadow-lg shadow-blue-500/40 ring-4 ring-[#0a0f1c]">
            +
          </span>
          <span className="text-[10px] font-medium text-[var(--v-text-dim)]">
            Sell
          </span>
          <span className="h-1 w-1 rounded-full bg-transparent" />
        </Link>

        <NavItem {...items[2]} />
        <NavItem {...items[3]} />
      </div>
    </nav>
  );
}
