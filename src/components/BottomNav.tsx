"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  // Hide the navigation bar on the public landing page
  if (pathname === "/") return null;

  const links = [
    { href: "/dashboard", label: "Home", icon: "🏠" },
    { href: "/marketplace", label: "Market", icon: "🛍️" },
    { href: "/listings", label: "Sell", icon: "➕", isFab: true },
    { href: "/orders", label: "Orders", icon: "📦" },
    { href: "/profile", label: "Profile", icon: "👤" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--v-border)] bg-[var(--v-surface-1)]/90 backdrop-blur-xl pb-safe">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2">
        {links.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !== "/dashboard" && pathname.startsWith(link.href));

          if (link.isFab) {
            return (
              <Link
                key={link.href}
                href={link.href}
                className="v-press relative -top-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600 text-2xl text-white shadow-lg shadow-blue-500/40"
              >
                {link.icon}
              </Link>
            );
          }

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`v-press flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 transition-colors ${
                isActive
                  ? "text-[var(--v-accent)]"
                  : "text-[var(--v-text-muted)] hover:text-white"
              }`}
            >
              <span className="text-lg">{link.icon}</span>
              <span className="text-[10px] font-medium">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
