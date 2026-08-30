"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Spinner from "@/components/ui/Spinner";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [userName, setUserName] = useState("Vendor");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);
      const name =
        user.user_metadata?.business_name ||
        user.email?.split("@")[0] ||
        "Vendor";
      setUserName(name);
      setEmail(user.email || "");

      const savedAvatar = user.user_metadata?.avatar_url;
      if (savedAvatar) {
        setAvatarUrl(savedAvatar);
      } else {
        setAvatarUrl(
          `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}&backgroundColor=b6e3f4,c0aede,d1d4f9`,
        );
      }
      setLoading(false);
    };
    init();
  }, [router]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `avatars/${user.id}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("listing-images")
      .upload(fileName, file);
    if (uploadError) {
      alert("Upload failed: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from("listing-images")
      .getPublicUrl(fileName);
    const { error: updateError } = await supabase.auth.updateUser({
      data: { avatar_url: data.publicUrl },
    });
    if (updateError) {
      alert("Could not save avatar: " + updateError.message);
    } else {
      setAvatarUrl(data.publicUrl);
    }
    setUploading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--v-canvas)]">
        <Spinner />
      </div>
    );
  }

  const menuRows = [
    { href: "/listings", icon: "📦", label: "My Listings" },
    { href: "/orders", icon: "🛒", label: "My Orders" },
    { href: "/marketplace", icon: "🛍️", label: "Browse Marketplace" },
  ];

  return (
    <div className="min-h-screen bg-[var(--v-canvas)] pb-28">
      <div className="mx-auto max-w-lg px-5">
        {/* Header */}
        <div className="v-rise flex items-center gap-3 pt-12 pb-5">
          <Link
            href="/dashboard"
            aria-label="Back"
            className="v-press flex h-9 w-9 items-center justify-center rounded-full border border-[var(--v-border)] bg-[var(--v-surface-1)] text-slate-300"
          >
            ←
          </Link>
          <h1 className="text-lg font-bold text-white">My Profile</h1>
        </div>

        {/* Avatar Card — hero */}
        <div className="v-rise v-rise-1 mb-5">
          <div className="v-glass-edge v-shadow relative overflow-hidden rounded-[var(--v-radius-card)] border border-[var(--v-border-strong)] bg-gradient-to-br from-[#101a2e] via-[#0d1424] to-[#0a0f1c] p-6">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-sky-500/[0.08] blur-3xl" />
            <div className="relative flex flex-col items-center">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 opacity-70 blur" />
                <img
                  src={avatarUrl}
                  alt="avatar"
                  className="relative h-28 w-28 rounded-full object-cover ring-4 ring-[var(--v-canvas)]"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  aria-label="Change photo"
                  className="v-press absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-lg shadow-blue-500/40 ring-2 ring-[var(--v-canvas)]"
                >
                  {uploading ? "..." : "📷"}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>
              <h2 className="mt-4 text-xl font-bold text-white">{userName}</h2>
              <p className="mt-0.5 text-xs text-[var(--v-text-muted)]">
                {email}
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-[11px] font-semibold text-sky-300">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                Verified Seller
              </span>
            </div>
          </div>
        </div>

        {/* Info rows */}
        <div className="v-rise v-rise-2 mb-5">
          <div className="v-surface overflow-hidden rounded-[var(--v-radius-card)]">
            <InfoRow label="Business Name" value={userName} />
            <InfoRow label="Email" value={email} />
            <InfoRow
              label="Account Tier"
              value="Verified Seller ⭐"
              highlight
              last
            />
          </div>
        </div>

        {/* Menu options */}
        <div className="v-rise v-rise-3 mb-5">
          <div className="v-surface overflow-hidden rounded-[var(--v-radius-card)]">
            {menuRows.map((row, idx) => (
              <Link
                key={row.href}
                href={row.href}
                className={`v-press flex items-center justify-between px-5 py-4 ${
                  idx !== menuRows.length - 1
                    ? "border-b border-[var(--v-border)]"
                    : ""
                }`}
              >
                <span className="flex items-center gap-3 text-sm font-medium text-white">
                  <span>{row.icon}</span>
                  {row.label}
                </span>
                <span className="text-[var(--v-text-dim)]">›</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Logout */}
        <div className="v-rise v-rise-4">
          <button
            onClick={handleLogout}
            className="v-press w-full rounded-[var(--v-radius-card)] border border-rose-500/25 bg-rose-500/[0.08] py-4 text-sm font-semibold text-rose-300 transition-colors hover:bg-rose-500/15"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  highlight = false,
  last = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  last?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between px-5 py-4 ${last ? "" : "border-b border-[var(--v-border)]"}`}
    >
      <span className="text-sm text-[var(--v-text-muted)]">{label}</span>
      <span
        className={`ml-3 truncate text-right text-sm font-medium ${
          highlight ? "text-[var(--v-accent)]" : "text-white"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
