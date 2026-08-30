"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import EmptyState from "@/components/ui/EmptyState";
import Spinner from "@/components/ui/Spinner";
import StatusBadge from "@/components/ui/StatusBadge";
import SectionHeader from "@/components/ui/SectionHeader";

export default function ListingsPage() {
  const [user, setUser] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
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
      await fetchListings(user.id);
      setLoading(false);
    };
    init();
  }, [router]);

  const fetchListings = async (userId: string) => {
    const { data } = await supabase
      .from("listings")
      .select("*")
      .eq("vendor_id", userId)
      .order("created_at", { ascending: false });
    setListings(data || []);
  };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const fileName = `listings/${user.id}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("listing-images")
      .upload(fileName, file);
    if (error) {
      alert("Upload failed: " + error.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage
      .from("listing-images")
      .getPublicUrl(fileName);
    setImageUrl(data.publicUrl);
    setUploading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("listings").insert({
      vendor_id: user.id,
      business_name:
        user.user_metadata?.business_name ||
        user.email?.split("@")[0] ||
        "Vendor",
      title: title.trim(),
      category: category.trim() || "General",
      price: Number(price),
      image_url: imageUrl || null,
      status: "active",
    });
    if (error) {
      alert("Could not publish listing: " + error.message);
      setSaving(false);
      return;
    }
    setTitle("");
    setCategory("");
    setPrice("");
    setImageUrl("");
    await fetchListings(user.id);
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Remove this listing from the marketplace?")) return;
    const { error } = await supabase.from("listings").delete().eq("id", id);
    if (error) {
      alert("Could not delete: " + error.message);
      return;
    }
    setListings((prev) => prev.filter((l) => l.id !== id));
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--v-canvas)]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--v-canvas)] pb-28">
      <div className="mx-auto max-w-lg px-5">
        {/* Header */}
        <div className="v-rise pt-12 pb-5">
          <h1 className="text-2xl font-bold text-white">My Listings</h1>
          <p className="mt-1 text-sm text-[var(--v-text-muted)]">
            Publish products & manage your store
          </p>
        </div>

        {/* Create form */}
        <div className="v-rise v-rise-1 mb-6">
          <form
            onSubmit={handleCreate}
            className="v-glass-edge v-shadow rounded-[var(--v-radius-card)] border border-[var(--v-border-strong)] bg-[var(--v-surface-1)] p-5"
          >
            <h2 className="mb-4 text-[15px] font-semibold text-white">
              ➕ Publish a new product
            </h2>

            {/* Image picker */}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="v-press mb-4 block w-full overflow-hidden rounded-2xl border border-dashed border-[var(--v-border-strong)] bg-[var(--v-surface-2)]"
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="preview"
                  className="h-40 w-full object-cover"
                />
              ) : (
                <div className="flex h-28 flex-col items-center justify-center gap-1 text-[var(--v-text-dim)]">
                  <span className="text-2xl">📷</span>
                  <span className="text-xs font-medium">
                    {uploading ? "Uploading..." : "Tap to add a photo"}
                  </span>
                </div>
              )}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="hidden"
            />

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--v-text-muted)]">
                  Product Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. iPhone 13 Pro — barely used"
                  required
                  className="v-surface w-full rounded-xl px-4 py-3 text-white placeholder-[var(--v-text-dim)] transition-colors focus:border-[var(--v-accent)] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--v-text-muted)]">
                    Category
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Electronics"
                    className="v-surface w-full rounded-xl px-4 py-3 text-white placeholder-[var(--v-text-dim)] transition-colors focus:border-[var(--v-accent)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--v-text-muted)]">
                    Price (₦)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    required
                    className="v-surface v-num w-full rounded-xl px-4 py-3 text-white placeholder-[var(--v-text-dim)] transition-colors focus:border-[var(--v-accent)] focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving || uploading}
                className="v-press w-full rounded-xl bg-gradient-to-r from-sky-400 to-blue-600 py-3 font-semibold text-white shadow-lg shadow-blue-500/30 disabled:opacity-50"
              >
                {saving ? "Publishing..." : "Publish to Marketplace"}
              </button>
            </div>
          </form>
        </div>

        {/* Your listings */}
        <SectionHeader title={`Your Listings (${listings.length})`} />
        {listings.length === 0 ? (
          <EmptyState
            icon="📦"
            title="Nothing listed yet"
            description="Publish your first product above — it goes live on the marketplace instantly."
          />
        ) : (
          <div className="space-y-3">
            {listings.map((l, i) => (
              <div
                key={l.id}
                className="v-rise v-surface flex items-center gap-3 rounded-[var(--v-radius-card)] p-3"
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                {l.image_url ? (
                  <img
                    src={l.image_url}
                    alt={l.title}
                    className="h-16 w-16 rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[var(--v-surface-2)] text-xl">
                    📦
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-white">
                    {l.title}
                  </h3>
                  <p className="text-[11px] text-[var(--v-text-muted)]">
                    {l.category}
                  </p>
                  <p className="v-num text-sm font-bold text-[var(--v-accent)]">
                    ₦{Number(l.price).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <StatusBadge status={l.status} />
                  <button
                    onClick={() => handleDelete(l.id)}
                    className="v-press text-[11px] font-medium text-[var(--v-text-dim)] transition-colors hover:text-rose-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
